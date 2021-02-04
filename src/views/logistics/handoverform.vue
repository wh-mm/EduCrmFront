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
       <el-button type="primary"
                   size="small"
                   icon="el-icon-plus"
                   plain
                   @click="viewTransport()">发起运输单
        </el-button>

      </template>
      <template slot-scope="{type,size,row}" slot="menu">
<!--        <el-button  :size="size"
                    :type="type"
                    icon="el-icon-check"
                    v-if="row.status === 1"
                    @click="updateById(row.id,row.id)">完成
        </el-button>-->

        <el-button  :size="size"
                    :type="type"
                   icon="el-icon-plus"
                   @click="viewHandover(row.id)">详情
        </el-button>
        <el-button :size="size"
                   :type="type"
                   icon="el-icon-plus"
                   @click="print(row)">补打
        </el-button>
      </template>
    </avue-crud>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="80%"
      :modal="false"
      :before-close="handleClose">
      <avue-form ref="transportForm" v-model="obj" :option="transportOption" @submit="submitTransport">
      </avue-form>
      <avue-crud :data="selectionList" :option="transportListOption">
      </avue-crud>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="viewDialogVisible"
      width="80%"
      :modal="false"
      :before-close="handleClose">
      <avue-crud :data="view.data" :option="distributionOption"
                 :page.sync="view.page">
      </avue-crud>
    </el-dialog>
    <el-dialog
      title="打印交接单"
      :visible.sync="handoverDialogVisible"
      width="800px"
      :modal="false"
      :before-close="handleClose">
      <el-button type="primary"
                 size="small"
                 icon="el-icon-plus"
                 plain
                 v-print="'#print1'"
                 @click="printSave">打印交接单
      </el-button>
      <div id="print1" ref="print11">
        <div style="padding: 10px;">
          <el-row>
            <el-col :span="24">
              <div class="grid-content bg-purple-dark"
                   style="font-size: 24px;text-align: center;margin-bottom: 15px;">
                配送交接单
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="grid-content bg-purple-dark">
                <p>医院名称 : <span style="margin-left: 10px;">{{printData.hospitalName}}</span></p>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <div class="grid-content bg-purple">
                <p>医院地址 : <span style="margin-left: 10px;">{{printData.hospitalAddress}}</span></p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple-light">
                <p>联系方式 : <span style="margin-left: 10px;">{{printData.hospitalTel}}</span></p>
              </div>
            </el-col>
          </el-row>
          <el-table
            :data="printData.tableData"
            border :fit="false"
            style="width: 707px;margin-top: 15px;margin-right: 0px;">
            <el-table-column
              type="index"
              label="序号"
              width="60">
            </el-table-column>
            <el-table-column
              prop="receivingDate"
              label="接方日期"
              width="100">
            </el-table-column>
            <el-table-column
              prop="pspnum"
              label="处方编号"
              width="150">
            </el-table-column>
            <el-table-column
              prop="addresseeName"
              label="患者姓名"
              width="90">
            </el-table-column>
            <el-table-column
              prop="addresseeSex"
              label="性别"
              width="55">
              <template slot-scope="scope">
                {{ scope.row.addresseeSex === '1'?'男':'女' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="addresseeAge"
              label="年龄"
              width="55">
            </el-table-column>
            <el-table-column
              prop="dose"
              label="剂数"
              width="55">
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注">
            </el-table-column>
            <el-table-column
              label=""
              width="60">
            </el-table-column>
          </el-table>
          <el-row style="margin-top: 20px;">
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <p>日期 : <span style="margin-left: 10px;">{{printData.time}}</span></p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple-light">
                <p>送货人 : <span style="margin-left: 10px;"></span></p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <p>收货人 : <span style="margin-left: 10px;"></span></p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple-light">
                <p>收货日期 : <span style="margin-left: 10px;"></span></p>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove,
    submitTransport,view,viewList,updateById} from "@/api/logistics/handoverform";
  import {mapGetters} from "vuex";
  import {getHospitalDetail} from "@/api/hisHospital/hospital";

  export default {
    data() {
      return {
        form: {},
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        view:{
          data:[],
          loading: true,
          page: {
            pageSize: 10,
            currentPage: 1,
            total: 0
          },
        },
        dialogVisible: false,
        viewDialogVisible:false,
        option: {
          height:'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          excelBtn:true,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: '单号',
              prop: 'orderNumber',
              addDisplay: false,
              editDisplay: false,
              width: 180,
              search: true,
            },
            {
              label: "医院名称",
              prop: "hospitalId",
              type: "select",
              props: {
                label: "hospitalName",
                value: "id"
              },
              span: 6,
              search: true,
              filterable: true,
              remote: true,
              dicUrl: "/api/taocao-hisHospital/hospital/selectHosptalByName?name={{key}}"
            },
            {
              label: "状态",
              prop: "statusName",
              addDisplay: false,
              editDisplay: false,
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=handover_form_status",
              props: {
                label: "dictValue",
                value: "dictKey"
              }
            },
          ]
        },
        data: [],
        transportListOption: {
          calcHeight: 30,
          border: true,
          index: false,
          viewBtn: false,
          addBtn: false,
          selection: false,
          columnBtn: false,
          refreshBtn: false,
          menu: false,
          dialogClickModal: false,
          column: [
            {
              label: '单号',
              prop: 'orderNumber',
            },
            {
              label: "医院名称",
              prop: "hospitalId",
              type: "select",
              props: {
                label: "hospitalName",
                value: "id"
              },
              dicUrl: "/api/taocao-hisHospital/hospital/selectHosptalByName?name={{key}}"
            },
          ]
        },
        transportData: [],
        transportForm: {},
        transportOption: {
          height: 'auto',
          calcHeight: 30,
          border: true,
          menu: false,
          menuPosition: "right",
          dialogClickModal: false,
          column: [
            {
              label: "车辆",
              prop: "carId",
              type: 'select',
              search: true,
              props: {
                label: 'name',
                value: 'id'
              },
              rules: [{
                required: true,
                message: "请选择运送车辆",
                trigger: "blur"
              }],
              dicUrl: '/api/logistics/taocar/selectTaoCar'
            },
            {
              label: "司机",
              prop: "driverId",
              type: 'select',

              props: {
                label: 'name',
                value: 'id'
              },
              rules: [{
                required: true,
                message: "请选择运送人员",
                trigger: "blur"
              }],
              dicUrl: '/api/logistics/taodriver/selectTaodriver'
            },
          ]
        },
        distributionOption:{
          height: 'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          viewBtn: false,
          addBtn: false,
          editBtn: false,
          delBtn: false,
          refreshBtn:false,
          columnBtn:false,
          menu:false,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "单号",
              prop: "orderNumber",
              width: 180,
            },
            {
              label: "状态",
              prop: "distributionStatus",
              addDisplay: false,
              editDisplay: false,
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
              props: {
                label: "hospitalName",
                value: "id"
              },
              dicUrl: "/api/taocao-hisHospital/hospital/selectHosptal"
            },
            {
              label: "处方号",
              prop: "pspnum",
            },
            {
              label: "剂数",
              prop: "dose",
            },
            {
              label: "类型",
              prop: "orderType",
              type: 'select',
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=isDaijian"
            },
            {
              label: "接方时间",
              prop: "receivingDate",
              type: "date",
              format: "yyyy-MM-dd",
              valueFormat: "yyyy-MM-dd",
            },
            {
              label: "患者姓名",
              prop: "addresseeName",
            },
            {
              label: "患者性别",
              prop: "addresseeSex",
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
              type:'number'
            },
            {
              label: "患者地址",
              prop: "addresseeAddress",
            },
            {
              label: "患者手机号",
              prop: "addresseePhone",
              maxlength:11,
              showWordLimit:true,
            },
            {
              label: "收件时间",
              prop: "addresseeTime",
              type: "datetime",
              addDisplay: false,
              editDisplay: false,
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
            },
            {
              label: "备注",
              prop: "remark",
            },
          ]
        },
        handoverDialogVisible:false,
        printData: {
          hospitalName: '',
          time: '',
          hospitalAddress: '',
          hospitalTel: '',
          tableData: [],
        },
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: false,
          viewBtn: false,
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
          loading();
          window.console.log(error);
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
          loading();
          console.log(error);
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
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
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
      /*viewTransport() {
        if(this.ids){
          this.dialogVisible = true;
        }else{
          this.$message({
            type: 'info',
            message: '请选择配送单'
          });
        }
      },*/
      updateById(id) {
        updateById(id).then(res => {
          if (res.data.success) {
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
          this.refreshChange();
          this.onLoad(this.page);
        })
      },
      viewTransport() {
        if(this.ids){
          this.dialogVisible = true;
        }else{
          this.$message({
            type: 'info',
            message: '请选择配送单'
          });
        }
      },

      submitTransport() {
        submitTransport(this.obj.carId,this.obj.driverId,this.ids).then(res => {
          if(res.data.success){
            this.$message({
              type: 'success',
              message: res.data.msg
            });
            this.dialogVisible = false;
            this.refreshChange();
          }

        })
      },
      viewHandover(id){
        this.viewDialogVisible = true;
        view(this.view.page.currentPage, this.view.page.pageSize, id).then(res => {
          const data = res.data.data;
          this.view.page.total = data.total;
          this.view.data = data.records;
        });
      },
      print(row) {
        getHospitalDetail(row.hospitalId).then(res => {
          let data = res.data.data;
          this.printData.hospitalName = data.hospitalName;
          this.printData.hospitalAddress = data.hospitalProfile;
          this.printData.hospitalTel = data.hospitalTel;
        })
        viewList(row.id).then(res => {
          let date = new Date();
          let year = date.getFullYear(); // 年
          let month = date.getMonth() + 1; // 月
          let day = date.getDate(); // 日
          this.printData.time = year + '-' + month + '-' + day;
          this.printData.tableData = res.data.data;
          this.handoverDialogVisible = true;
        });
      },
    }
  };
</script>

<style>
</style>
