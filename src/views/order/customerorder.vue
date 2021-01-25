<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               :permission="permissionList"
               v-model="form"
               ref="crud"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" plain @click="newAddYin()">新增饮片</el-button>
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" plain @click="newAddKe()">新增颗粒</el-button>
      </template>
      <!--修改-->
      <template slot-scope="scope" slot="menu">
        <el-button type="text" icon="el-icon-view" size="small" @click.stop="lockInfo(scope.row)">查 看</el-button>
        <!-- <el-button type="text" icon="el-icon-check" size="small" @click.stop="prescription()">抓 药</el-button>-->
      </template>
    </avue-crud>

    <!-- 新增饮片 -->
    <el-dialog title="新增饮片" :visible.sync="addYinDialogVisible" v-if="addYinDialogVisible"
               width="90%" :modal="false" :close-on-click-modal="false">
      <addYinPian @reject="rejectYin" ></addYinPian>
    </el-dialog>

    <el-dialog title="新增颗粒" :visible.sync="addKeDialogVisible" v-if="addKeDialogVisible"
               width="90%" :modal="false" :close-on-click-modal="false">
      <addKeLi @reject="rejectKe" ></addKeLi>
    </el-dialog>

    <el-dialog title="订单详情" :visible.sync="viewYinDialogVisible" v-if="viewYinDialogVisible"
               width="90%" :modal="false" :close-on-click-modal="false">
      <viewYinPian :orderInfo="orderInfo"></viewYinPian>
    </el-dialog>
    <el-dialog title="订单详情" :visible.sync="viewKeDialogVisible" v-if="viewKeDialogVisible"
               width="90%" :modal="false" :close-on-click-modal="false">
      <viewKeLi :orderInfo="orderInfo"></viewKeLi>
    </el-dialog>
  </basic-container>
</template>

<script>
import {getInfo,getList} from "@/api/order/order";
import addYinPian from "./addClinic/addYinPian";
import addKeLi from "./addClinic/addKeLi";
import viewYinPian from "./view/viewYinPian";
import viewKeLi from "./view/viewKeLi";
import {mapGetters} from "vuex";


export default {
  components:{
    addYinPian,
    addKeLi,
    viewYinPian,
    viewKeLi
  },
  name: "customerorder",
  data() {
    return {
      addYinDialogVisible: false,
      addKeDialogVisible: false,
      viewKeDialogVisible: false,
      viewYinDialogVisible: false,
      orderInfo: {
        form: {},
        drugList: []
      },
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        addBtn: false,
        height: "auto",
        calcHeight: 30,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        viewBtn: false,
        selection: true,
        dialogClickModal: false,
        column: [
          {
            label: "订单id",
            prop: "id",
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
            search: true,
            dicUrl: "/api/taocao-hisHospital/hospital/selectHosptal"
          },
          {
            label: "订单状态",
            prop: "orderStatic",
            type: "select",
            props: {
              label: 'dictValue',
              value: 'dictKey'
            },
            search: true,
            required: true,
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=order_status",
            trigger: "blur"
          },

          {
            label: "订单类型",
            prop: "orderType",
            type: "select",
            props: {
              label: 'dictValue',
              value: 'dictKey'
            },
            search: true,
            required: true,
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=order_type",
            trigger: "blur"
          },
          {
            label: "订单区分",
            prop: "orderDifferentiation",
            type: "select",
            props: {
              label: 'dictValue',
              value: 'dictKey'
            },
            search: true,
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=order_differentiation",
            trigger: "blur"
          },
          {
            label: "收货地址",
            prop: "address",
            rules: [{
              required: true,
              message: "请输入收货地址",
              trigger: "blur"
            }]
          },
          {
            label: "收件人",
            prop: "addressee",
            rules: [{
              required: true,
              message: "请输入收件人",
              trigger: "blur"
            }],
            search: true,
          },
          {
            label: "收件人电话",
            prop: "addresseePhone",
            labelWidth: 100,
          },


          {
            label: "订单时间",
            prop: "releaseTimeRange",
            type: "datetime",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            searchRange: true,
            searchSpan: 12,
            hide: true,
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            search: true,
            rules: [{
              required: true,
              message: "请输入通知时间",
              trigger: "blur"
            }]
          },
          {
            label: "订单时间",
            prop: "orderTime",
            type: "date",
            width: 150,
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            rules: [{
              required: true,
              message: "请输入通知日期",
              trigger: "click"
            }]
          },
          {
            label: "总价",
            prop: "totalPrices",
            rules: [{
              required: true,
              message: "请输入总价",
              trigger: "blur"
            }]
          },
        ]
      },
      data: []
    };
  },
  watch: {
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.order_add, false),
        viewBtn: this.vaildData(this.permission.order_view, false),
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
    },
  },
  methods: {
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


    //取消
    rejectYin() {
      this.addYinDialogVisible = false;
    },
    rejectKe() {
      this.addKeDialogVisible = false;
    },
    newAddYin(){
      this.addYinDialogVisible = true;
    },
    newAddKe(){
      this.addKeDialogVisible = true;
    },


    //抓药
    prescription() {
      this.$message({
        type: "success",
        message: "抓药",
      });
      this.dialogVisible = false
    },


    onLoad(page, params = {}) {
      //时间
      const {releaseTimeRange} = params;
      let values = {
        ...params,
      };
      if (releaseTimeRange) {
        values = {
          ...params,
          startTime: releaseTimeRange[0],
          endTime: releaseTimeRange[1],
        };
        values.releaseTimeRange = null;
        this.query.releaseTimeRange = null;
      }
      this.loading = true;
      getList(page.currentPage, page.pageSize, Object.assign(values, this.query)).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    },

    //查看
    lockInfo(row) {
      let url = '';
      if (row.orderType === "jianyao") {
        url = "/api/taocao-order/order/decoctingSelectByOrderId"
      } else if (row.orderType === "tiaopei") {
        url = "/api/taocao-order/order/blenderSelectByOrderId"
      } else {
        this.$message({
          type: 'error',
          message: '订单类型不匹配!'
        })
        return;
      }
      getInfo(url, row.id).then(res => {
        this.orderInfo = res.data.data;
        if (row.orderType === "jianyao") {
          this.viewYinDialogVisible=true;
        } else if (row.orderType === "tiaopei") {
          this.viewKeDialogVisible=true;
        } else {
          this.$message({
            type: 'error',
            message: '订单类型不匹配!'
          })
          return;
        }
      })
    },

  }
};
</script>
