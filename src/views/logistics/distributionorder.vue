<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button icon="el-icon-check"
                   size="small"
                   :type="type"
                   @click.stop="dialogVisible = true">扫描新增配送单
        </el-button>
      </template>
      <template slot-scope="{type,size,row}" slot="menu">
        <el-button  :size="size"
                    :type="type"
                    icon="el-icon-delete"
                    v-if="permission.distributionorder_delete  && row.distributionStatus === '2'"
                    @click="rowDel(row)">删 除
        </el-button>
        <el-button icon="el-icon-check"
                   :size="size"
                   :type="type"
                   v-if="permission.distributionorder_edit  && row.distributionStatus === '2'"
                   @click.stop="handleEdit(row,index)">编辑
        </el-button>
        <el-button icon="el-icon-check"
                   :size="size"
                   :type="type"
                   v-if="permission.distributionorder_edit && row.distributionStatus === '1'"
                   @click.stop="handleStart(row.id)">发起
        </el-button>
        <el-button :type="type" :size="size" icon="el-icon-printer"
                   v-if="row.distributionStatus === '2'"
                   @click="doPrint1(row)">打印配送单
        </el-button>
        <el-button :type="type" :size="size" icon="el-icon-printer"
                   v-if="parseInt(row.distributionStatus) > 2"
                   @click="doPrint1(row)">补打
        </el-button>
      </template>
      <template slot="distributionStatus" slot-scope="scope">
        <div style="color: green" v-if="scope.row.distributionStatus=='2'?'2':'3'">制作完成</div>
        <div style="color: red" v-else>派送中</div>
      </template>
    </avue-crud>
    <div style="display: none" id="print11">
      <!-- 隐藏打印区域，避免用户看到 -->
      <div style="padding: 10px;height: 500px;margin-top: 35px">
        <div class="head">
          淘草中医药厂内配送单
        </div>
        <div class="shou">
          <div style="width: 100%">
            <div class="head" style="text-align: center">
              {{printData.$hospitalId}}
            </div>
            <p>类型 : <span style="margin-left: 10px;">{{printData.$orderType}}</span></p>
            <p>处方号 : <span style="margin-left: 10px;">{{printData.pspnum}}</span></p>
            <p>患者姓名:<span style="margin-left: 10px;">{{printData.addresseeName}}</span></p>
            <p>手机号:<span style="margin-left: 10px;">{{printData.addresseePhone}}</span></p>
            <p>地址:<span style="margin-left: 10px;">{{printData.addresseeAddress}}</span></p>
            <p>接方时间:<span style="margin-left: 10px;">{{printData.receivingDate}}</span></p>
            <p>配送类型:<span style="margin-left: 10px;">厂内配送</span></p>
          </div>
        </div>
        <div class="tiaoxingma" style="padding: 10px;">
          <svg id="bigcode"></svg>
        </div>
      </div>
    </div>
    <el-dialog
      title="扫描新增配送单"
      :visible.sync="dialogVisible"
      width="30%"
      :modal="false"
      :before-close="handleClose">
      <el-form :model="numberValidateForm" ref="numberValidateForm" label-width="100px" class="demo-ruleForm">
        <el-form-item
          label="扫码开关"
          prop="scan"
        >
          <el-switch
            v-model="scanSwitch"
            active-text="开"
            inactive-text="关">
          </el-switch>
        </el-form-item>
        <el-form-item
          label="调配单号"
          prop="age"
        >
          <el-input ref="scanNumber" maxlength="19"  show-word-limit size="small" v-model="scanNumber" placeholder="请扫描调配单条码"
                    :disabled="scanNumberDisabled" @keyup.native="inputNum" @change="inputchange"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {
    getList, getDetail, add, update, remove,
    updateStatus,scanOrder
  } from "@/api/logistics/distributionorder";
  import {mapGetters} from "vuex";
  import JsBarcode from 'jsbarcode';
  import './dayin.css'

  export default {
    data() {
      var isInteger= (rule, value, callback) => {
        if (!value) {
          return callback(new Error('输入不可以为空'));
        }
        setTimeout(() => {
          if (!Number(value)) {
            callback(new Error('请输入正整数'));
          } else {
            const re = /^[0-9]*[1-9][0-9]*$/;
            const rsCheck = re.test(value);
            if (!rsCheck) {
              callback(new Error('请输入正整数'));
            } else {
              callback();
            }
          }
        }, 0);
      };
      return {
        form: {},
        query: {},
        loading: true,
        scanNumberDisabled:false,
        scanSwitch:true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        arr:[],
        printData: {
          orderType: '',
          pspnum: '',
          receivingDate: '',
          addresseeAddress: '',
          hospitalName: '',
          addresseeName: '',
          addresseePhone: '',
        },
        dialogVisible: false,
        scanNumber:'',
        selectionList: [],
        option: {
          height: 'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          excelBtn:true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "单号",
              prop: "orderNumber",
              searchLabelWidth: 130,
              addDisplay: false,
              editDisplay: false,
              width: 180,
              search: true,
              labelWidth: 130,
            },
            {
              label: "状态",
              prop: "distributionStatus",
              addDisplay: false,
              editDisplay: false,
              labelWidth: 130,
              dicUrl: "/api/blade-system/dict/dictionary?code=distribution_status",
              props: {
                label: "dictValue",
                value: "dictKey"
              }
            },
            {
              label: "医院",
              prop: "hospitalId",
              type: "tree",
              searchLabelWidth: 130,
              labelWidth: 130,
              rules: [{
                required: true,
                message: "请选择医院",
                trigger: "blur"
              }],
              props: {
                label: "hospitalName",
                value: "id"
              },
              search: true,
              dicUrl: "/api/taocao-hisHospital/hospital/selectHosptal"
            },
            {
              label: "处方号",
              prop: "pspnum",
              labelWidth: 130,
              rules: [{
                required: true,
                message: "请输入处方号",
                trigger: "blur"
              }]
            },
            {
              label: "剂数",
              prop: "dose",
              labelWidth: 130,
              rules: [{
                required: true,
                message: "请输入剂数",
                trigger: "blur"
              }]
            },
            {
              label: "类型",
              prop: "orderType",
              type: 'select',
              labelWidth: 130,
              rules: [{
                required: true,
                message: "请选择类型",
                trigger: "blur"
              }],
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=isDaijian"
            },
            {
              label: "接方时间",
              labelWidth: 130,
              prop: "receivingDate",
              type: "date",
              format: "yyyy-MM-dd",
              valueFormat: "yyyy-MM-dd",
              rules: [{
                required: true,
                message: "请输入接方时间",
                trigger: "blur"
              }]
            },
            {
              label: "患者姓名",
              prop: "addresseeName",
              labelWidth: 130,
              searchLabelWidth: 130,
              rules: [{
                required: true,
                message: "请输入患者姓名",
                trigger: "blur"
              }],
              search: true,
            },
            {
              label: "患者性别",
              prop: "addresseeSex",
              labelWidth: 130,
              type: "radio",
              dicData: [{
                label: '男',
                value: '1'
              }, {
                label: '女',
                value: '2'
              }],
            },
            {
              label: "患者年龄",
              prop: "addresseeAge",
              labelWidth: 130,
              type:'number'
            },
            {
              label: "患者地址",
              prop: "addresseeAddress",
              labelWidth: 130,
              rules: [{
                required: true,
                message: "请输入收件人地址",
                trigger: "blur"
              }]
            },
            {
              label: "患者手机号",
              prop: "addresseePhone",
              labelWidth: 130,
              searchLabelWidth: 130,
              maxlength:11,
              showWordLimit:true,
              search: true,
              rules: [{
                required: true,
                validator:isInteger,
                trigger: "blur"
              }]
            },
            {
              label: "寄件时间",
              prop: "senderTime",
              labelWidth: 130,
              type: "datetime",
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
              addDisplay: false,
              editDisplay: false,
            },
            {
              label: "收件时间",
              prop: "addresseeTime",
              labelWidth: 130,
              type: "datetime",
              addDisplay: false,
              editDisplay: false,
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
            },
            {
              label: "备注",
              prop: "remark",
              labelWidth: 130,
            },
          ]
        },
        data: []
      };
    },
    watch:{
      dialogVisible(newName){
        if(newName){
          setTimeout(()=>{
            this.$refs['scanNumber'].focus();
          },10)
        }else{

        }
      }
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.distributionorder_add, false),
          viewBtn: this.vaildData(this.permission.distributionorder_view, false),
          delBtn: false,
          editBtn: false
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
      rowSave(row, done, loading) {
        add(row).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        }, error => {
          this.$message({
            type: "error",
            message: error.data.msg
          });
          loading();
        });
      },
      rowUpdate(row, index, done, loading) {
        update(row).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        }, error => {
          this.$message({
            type: "error",
            message: error.data.msg
          });
          loading();
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getDetail(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        done();
      },
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },
      searchChange(params, done) {
        this.query = params;
        this.page.currentPage = 1;
        this.onLoad(this.page, params);
        done();
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      selectionClear() {
        this.selectionList = [];
        this.$refs.crud.toggleSelection();
      },
      currentChange(currentPage) {
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize) {
        this.page.pageSize = pageSize;
      },
      refreshChange() {
        this.onLoad(this.page, this.query);
      },
      onLoad(page, params = {}) {
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      },
      handleEdit(row, index) {
        this.$refs.crud.rowEdit(row, index);
      },
      handleStart(id) {
        updateStatus(id,2).then(res => {
          this.$message({
            type: 'info',
            message: res.data.msg
          })
          this.refreshChange();
        })
      },
      updateStatus(id, status) {
        updateStatus(id, status).then(res => {
          if (res.data.success) {
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
          this.refreshChange();
        }).catch(error =>{
          this.$message.error(error.data.msg);
        })
      },
      doPrint1(row) {
        this.printData = row;
        setTimeout(() => {
          JsBarcode("#bigcode", row.orderNumber, {
            width: 2,//设置条之间的宽度
            height: 28,//高度
            fontOptions: "bold",//使文字加粗体或变斜体
            textAlign: "center",//设置文本的水平对齐方式
            textMargin: 5,//设置条形码和文本之间的间距
            fontSize: 26,//设置文本的大小
            displayValue: true,//是否在条形码下方显示文字
            margin: 2
          });
          var prnhtml = document.querySelector("#print11").innerHTML;
          var iframe = document.createElement('IFRAME');
          iframe.setAttribute('style', 'display:none;');
          var doc = null;
          var css = ".head{text-align:center;position:relative;font-size:32px}.head_l{position:absolute;bottom:0;left:0}.head_l img{width:32px;height:32px}.head_r{margin-right:10px;font-size:24px}.bottom{height:38%}.tiaoxingma{text-align:center;height:80px}.tiaoxingma svg{width:100%;height:99%}.tiaoxingma-sm{width:78%}.tiaoxingma-sm img{width:100%;height:99%}.shou{display:flex;border-top:1px solid black;border-bottom:1px solid black;height:380px;font-size:26px;margin-top:20px}p{margin:8px;padding:0}"
          document.body.appendChild(iframe);
          doc = iframe.contentWindow.document;
          doc.write('<html><head><style>' + css + '</style></head><body style="zoom: 60%;">' + prnhtml + '</body></html>');
          doc.close();
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          if (navigator.userAgent.indexOf("MSIE") > 0) {
            document.body.removeChild(iframe);
          }
        }, 100);
      },
      inputNum(target){
        if(this.scanSwitch){
          let timeout = target.timeStamp;
          let iscontu = true;
          if(this.scanNumber !== ''){
            this.arr.push(timeout);
          }else{
            this.arr = [];
          }
          let i;
          for (i in this.arr){
            if(this.arr.length <= 1){
              return ;
            }
            if(Math.ceil(this.arr[this.arr.length -1]) - Math.ceil(this.arr[this.arr.length -2]) <60){
              iscontu = true;
            }else{
              this.scanNumber = '';
              this.arr = [];
              iscontu = false;
            }
            if(i > 0 && this.arr.length === parseInt(i)+1){
              if(iscontu === true){
                return ;
              }
            }
          }
        }
      },
      inputchange(val){
        if(val.length === 19){
          this.scanNumberDisabled =true;
          scanOrder(val).then( res =>{
            this.scanNumberDisabled =false;
            this.$message.success(res.data.msg);
            this.scanNumber = '';
            setTimeout(()=>{
              this.$refs['scanNumber'].focus();
            },50);
          }).catch(err =>{
            this.scanNumberDisabled =false;
            this.$message.success(err.data.msg);
          })
        }
      }
    }
  }
</script>

<style>
</style>
