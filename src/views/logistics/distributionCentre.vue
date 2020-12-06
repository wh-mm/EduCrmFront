<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      :page.sync="page"
      :permission="permissionList"
      :before-open="beforeOpen"
      v-model="form"
      ref="crud"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template slot="menuLeft">
        <el-button type="primary"
                   size="small"
                   icon="el-icon-plus"
                   plain
                   @click="viewTransport()">发起运输单
        </el-button>
      </template>
      <template slot="orderNumber" slot-scope="{scope,row}">
        <el-tag>{{row.distributionOrderNumberPrefix+row.distributionOrderNumber}}</el-tag>
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
        <template slot="orderNumber" slot-scope="{scope,row}">
          <el-tag>{{row.distributionOrderNumberPrefix+row.distributionOrderNumber}}</el-tag>
        </template>
      </avue-crud>
    </el-dialog>
  </basic-container>
</template>

<script>
import { getList } from '@/api/logistics/distributionCentre';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      form: {},
      obj: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      dialogVisible:false,
      option: {
        height: 'auto',
        calcHeight: 30,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        viewBtn: true,
        selection: true,
        menu:false,
        dialogClickModal: false,
        column: [
          {
            label: '单号',
            prop: 'orderNumber',
            slot: true,
          },
          {
            label: "医院",
            prop: "hospitalName",
          },
          {
            label: "收件人",
            prop: "addresseeName",
            rules: [{
              required: true,
              message: "请输入收件人",
              trigger: "blur"
            }]
          },
          {
            label: "收件人地址",
            prop: "addresseeAddress",
            rules: [{
              required: true,
              message: "请输入收件人地址",
              trigger: "blur"
            }]
          },
          {
            label: "收件人手机号",
            prop: "addresseePhone",
            rules: [{
              required: true,
              message: "请输入收件人手机号",
              trigger: "blur"
            }]
          },
        ]
      },
      transportListOption: {
        calcHeight: 30,
        border: true,
        index: false,
        viewBtn: false,
        addBtn:false,
        selection: false,
        columnBtn:false,
        refreshBtn:false,
        menu:false,
        dialogClickModal: false,
        column: [
          {
            label: '单号',
            prop: 'orderNumber',
            slot: true,
          },
          {
            label: "医院",
            prop: "hospitalName",
          },
          {
            label: "收件人",
            prop: "addresseeName",
            rules: [{
              required: true,
              message: "请输入收件人",
              trigger: "blur"
            }]
          },
          {
            label: "收件人地址",
            prop: "addresseeAddress",
            rules: [{
              required: true,
              message: "请输入收件人地址",
              trigger: "blur"
            }]
          },
          {
            label: "收件人手机号",
            prop: "addresseePhone",
            rules: [{
              required: true,
              message: "请输入收件人手机号",
              trigger: "blur"
            }]
          },
        ]
      },
      data: [],
      transportData:[],
      transportForm:{},
      transportOption:{
        height: 'auto',
        calcHeight: 30,
        border: true,
        menu:false,
        menuPosition:"right",
        dialogClickModal: false,
        column: [
          {
            label: "车辆",
            prop: "carId",
            type:'select',
            search:true,
            rules: [{
              required: true,
              message: "请输入车辆id",
              trigger: "blur"
            }],
            props: {
              label: "name",
              value: "id"
            },
            dicUrl: "/api/logistics/taocar/selectTaoCar"
          },
          {
            label: "司机",
            prop: "driverId",
            type:'select',

            rules: [{
              required: true,
              message: "请选择运送人员",
              trigger: "blur"
            }] ,
              props: {
              label: "name",
              value: "id"
            },
            dicUrl: "/api/logistics/taodriver/selectTaodriver"
          },
        ]
      }
    };
  },
  computed: {
    ...mapGetters(['permission']),
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
      return ids.join(',');
    }
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
    viewTransport(){
      this.dialogVisible = true;
    },
    submitTransport(){

    }
  }
};
</script>

<style></style>
