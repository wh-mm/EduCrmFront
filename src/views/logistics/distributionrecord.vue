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
    </avue-crud>

  </basic-container>
</template>

<script>
  import {record} from "@/api/logistics/distributionrecord";
  import {getHospitalDetail} from "@/api/hisHospital/hospital";
  import {mapGetters} from "vuex";

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
        option: {
          height: 'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: false,
          excelBtn:true,
          menu: false,
          viewBtn: false,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "单号",
              prop: "orderNumber",
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
              prop: "distributionStatus",
              type: 'select',
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              search: true,
              dicUrl: "/api/blade-system/dict/dictionary?code=distribution_status"
            },
            {
              label: "处方号",
              prop: "pspnum",
            },
            {
              label: "类型",
              prop: "orderType",
              type: 'select',
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
              prop: "receivingDate",
              type: "date",
              format: "yyyy-MM-dd",
              valueFormat: "yyyy-MM-dd",
            },
            {
              label: "患者姓名",
              prop: "addresseeName",
              search: true,
            },
            {
              label: "患者性别",
              prop: "addresseeSex",
            },
            {
              label: "患者年龄",
              prop: "addresseeAge",
            },
            {
              label: "患者地址",
              prop: "addresseeAddress",
              width: 180,
            },
            {
              label: "剂数",
              prop: "dose",
            },
            {
              label: "患者手机号",
              prop: "addresseePhone",
              width: 180,
              search: true,
              searchLabelWidth: 130,
            },
            {
              label: "备注",
              prop: "remark",
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
          addBtn: this.vaildData(this.permission.distributionrecord_add, false),
          viewBtn: this.vaildData(this.permission.distributionrecord_view, false),
          delBtn: this.vaildData(this.permission.distributionrecord_delete, false),
          editBtn: this.vaildData(this.permission.distributionrecord_edit, false)
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
        record(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      },

    }
  };
</script>

<style>

</style>
