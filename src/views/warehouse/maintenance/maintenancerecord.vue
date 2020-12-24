<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               :before-open="beforeOpen"
               v-model="form"
               ref="crud"
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
  import {getList, getDetail} from "@/api/warehouse/maintenancerecord";
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
        column:[],
        option: {
          height:'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          addBtn:  false,
          viewBtn: false,
          delBtn: false,
          editBtn: false,
          menu:false,
          selection: false,
          dialogClickModal: false,
          column: [
            {
              label: "仓库",
              prop: "warehouseId",
              type: 'tree',
              row: true,
              search: true,
              span: 24,
              props: {
                label: 'title',
                value: 'value'
              },
              cascaderItem: ['storageRegionId', 'storageId'],
              rules: [{
                required: true,
                message: "请输入仓库",
                trigger: "blur"
              }],
              dicUrl: '/api/erp-wms/warehouse/tree'
            },

            {
              label: "区域",
              prop: "storageRegionId",
              type: 'tree',
              search: true,
              row: true,
              span: 24,
              rules: [{
                required: true,
                message: "请输入储位",
                trigger: "blur"
              }],
              props: {
                label: 'title',
                value: 'id'
              },
              dicUrl: '/api/erp-wms/storage/queryRegionTree?warehouseId={{key}}'
            },
            {
              label: "储位",
              prop: "storageId",
              type: 'tree',
              row: true,
              span: 24,
              rules: [{
                required: true,
                message: "请输入储位",
                trigger: "blur"
              }],
              props: {
                label: 'title',
                value: 'id'
              },
              dicUrl: '/api/erp-wms/storage/tree?warehouseId={{key}}'
            },
            {
              label: "商品",
              prop: "goodsId",
              type: 'tree',
              search: true,
              row: true,
              span: 24,
              props: {
                label: 'goodsName',
                value: 'id'
              },
              dicMethod: "post",
              dicUrl: 'api/erp-wms/goods/selecListGoods',
            },
            {
              label: "批号",
              prop: "batchNumber",
              search: true,
            },
            {
              label: "养护时间",
              prop: "maintenanceTime",
              dateDefault: true,
              type: "datetime",
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
              width: 200
            },
            {
              label: "养护结果",
              prop: "maintenanceResults",
              width: 120
            },
            {
              label: "异常情况",
              prop: "abnormalPhenomenon",
              width: 120
            },
            {
              label: "采取措施",
              prop: "takeSteps",
              width: 120
            },
            {
              label: "采取措施后的结果",
              prop: "takeStepsResults",
              labelWidth: 145,
              width: 200
            },
            {
              label: "生产日期",
              prop: "dateOfManufacture",
              type: 'datetime',
              format: "yyyy-MM-dd",
              valueFormat: "yyyy-MM-dd",
            },
            {
              label: "有效期至",
              prop: "periodOfValidity",
              type: 'datetime',
              format: "yyyy-MM-dd",
              valueFormat: "yyyy-MM-dd",
            },
            {
              label: "产地",
              prop: "placeOfOrigin",
            },
            {
              label: "生产厂家",
              prop: "manufacturer",
            },
            {
              label: "供应商名称",
              prop: "supplierName",
            },
            {
              label: "库存数量",
              prop: "repertoryQuantity",
            },
            {
              label: "包装规格",
              prop: "packageSpecification",
            },
            {
              label: "包装数量",
              prop: "packageQuantity",
            },
            {
              label: "规格等级",
              prop: "specificationLevel",
            },
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      },

    },
    methods: {
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
      //时间
      onLoad(page, params = {}) {
        const {createTime} = params;
        let values = {
          ...params,
        };
        if (createTime) {
          values = {
            ...params,
            startTime: createTime[0],
            endTime: createTime[1],
          };
          values.createTime = null;
          this.query.createTime = null;
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
    }
  };
</script>

<style>
</style>
