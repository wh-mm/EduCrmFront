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
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.sendinfo_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.sendinfo_delete"
                   @click="Test(scope.row)">发送
        </el-button>
      </template>

      <template slot="tradeOrdersForm" slot-scope="scope">

        <el-button icon="el-icon-check"
                   size="small"
                   :type="type"
                  @click="openDialog()">扫描新增电子面单
        </el-button>
      </template>

    </avue-crud>
    <el-dialog
      title="扫描新增配送单"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="30%">

        <el-input v-model="input" placeholder="请输入内容" ></el-input>
           <el-button size="small"
                      @click="selectRecipients()">确定</el-button>



    </el-dialog>


  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove,Test} from "@/api/express/sendinfo";
  import {mapGetters} from "vuex";
  import {selectRecipients} from "@/api/order/order";

  export default {
    data() {
      return {
        form: {},
        query: {},
        loading: true,
        input:'',
        dialogVisible: false,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: {
          height:'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "物流公司",
              prop: "cpCode",
              type: "select",
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=KD",
            },
            {
              label: "发送者信息",
              prop: "sendMessageId",
              type: "select",
              props: {
                label: "name",
                value: "id"
              },
              search: true,
              dicUrl: "/api/express/sendmessage/selectByName"
            },
            // {
            //   label: "物流服务值",
            //   prop: "logisticsServices",
            //   rules: [{
            //     required: true,
            //     message: "请输入物流服务值",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "请求ID",
              prop: "objectId",
              disabled:true,
              rules: [{
                required: true,
                message: "请输入请求ID",
                trigger: "blur"
              }]
            },
            {
              label: "订单渠道平台，请按实际订单所属平台传入",
              prop: "orderChannelsType",
             value:'OTHERS'
            },
            {
              prop: "tradeOrders",
              formslot:true,
            },
            {
              label: "订单号",
              prop: "tradeOrder",
              rules: [{
                required: true,
                message: "请输入订单号",
                trigger: "blur"
              }],
            },
            {
              label: "收件人手机号码",
              prop: "recipientMobile",
              rules: [{
                required: true,
                message: "请输入收件人手机号码",
                trigger: "blur"
              }]
            },
            {
              label: "收件人姓名",
              prop: "recipientName",
              rules: [{
                required: true,
                message: "请输入收件人姓名",
                trigger: "blur"
              }]
            },
            {
              label: "详细地址",
              prop: "recipientDetail",
              rules: [{
                required: true,
                message: "请输入详细地址",
                trigger: "blur"
              }]
            },
            {
              label: "包裹id，用于拆合单场景",
              prop: "packageInfoId",
              disabled: true,
              rules: [{
                required: true,
                message: "请输入包裹id，用于拆合单场景",
                trigger: "blur"
              }]
            },
            {
              label: "数量",
              prop: "packageInfoCount",
              rules: [{
                required: true,
                message: "请输入数量",
                trigger: "blur"
              }]
            },
            {
              label: "商品名称",
              prop: "packageInfoName",
              rules: [{
                required: true,
                message: "请输入名称",
                trigger: "blur"
              }]
            },
            {
              label: "体积,单位ml",
              prop: "packageInfoVolume",
              rules: [{
                required: true,
                message: "请输入体积,单位ml",
                trigger: "blur"
              }]
            },
            {
              label: "重量,单位g",
              prop: "packageInfoWeight",
              rules: [{
                required: true,
                message: "请输入重量,单位g",
                trigger: "blur"
              }]
            },
            {
              label: "省份",
              prop: "recipientProvince",
              rules: [{
                required: true,
                message: "请输入省",
                trigger: "blur"
              }],
              showlabel: false,
              type: 'select',
              props: {
                label: 'name',
                value: 'code'
              },
              cascaderItem: ['recipientCity', 'recipientDistrict'],
              dicUrl: '/api/blade-system/region/select',

            },

            {
              label: "城市",
              prop: "recipientCity",
              rules: [{
                required: true,
                message: "请输入城市",
                trigger: "blur"
              }],
              type: 'select',
              props: {
                label: 'name',
                value: 'code'
              },
              dicFlag: false,
              dicUrl: '/api/blade-system/region/select?code={{key}}',
            },
            {
              label: "区县",
              prop: "recipientDistrict",
              rules: [{
                required: true,
                message: "请输入区县",
                trigger: "blur"
              }],
              type: 'select',
              props: {
                label: 'name',
                value: 'code'
              },
              dicFlag: false,
              dicUrl: '/api/blade-system/region/select?code={{key}}',
            },
            {
              label: "街道",
              prop: "recipientTown",
              rules: [{
                required: true,
                message: "请输入街道",
                trigger: "blur"
              }]
            },
            {
              label: "固定电话",
              prop: "recipientPhone",
              rules: [{
                required: true,
                message: "请输入固定电话",
                trigger: "blur"
              }]
            },
            // {
            //   label: "云打印标准模板URL",
            //   prop: "templateUrl",
            //   rules: [{
            //     required: true,
            //     message: "请输入云打印标准模板URL",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "使用者ID",
              prop: "userId",
              disabled: true,
              rules: [{
                required: true,
                message: "请输入使用者ID",
                trigger: "blur"
              }]
            },

          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.sendinfo_add, false),
          viewBtn: this.vaildData(this.permission.sendinfo_view, false),
          delBtn: this.vaildData(this.permission.sendinfo_delete, false),
          editBtn: this.vaildData(this.permission.sendinfo_edit, false)
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
      openDialog(){
        this.dialogVisible = true;
      },
      selectRecipients(){
        selectRecipients(this.input).then(res=>{
          var selectData= res.data.data;
          this.form.tradeOrder = this.input; //订单号
          this.form.objectId = this.input;  //请求id
          this.form.packageInfoId = this.input; //包裹id
          this.form.userId = this.input; //userId
          console.log(selectData)
            this.form.recipientMobile = selectData.recipientMobile;
            this.form.recipientName = selectData.recipientName;
            this.form.recipientDetail = selectData.recipientDetail;

        })
      },
      Test(row){
        Test(row).then(res=>{
          console.log(res.data.data.data[0].printData)
          if (res.data.success) {
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
          this.refreshChange();
        })
      }
    }
  };
</script>

<style>
</style>
