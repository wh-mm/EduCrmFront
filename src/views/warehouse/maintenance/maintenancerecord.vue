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
              type:'tree',
              props: {
                label: 'title',
                value: 'id'
              },
              cascaderItem: ['storageId'],
              search:true,
              dicUrl:this.ERP_WMS_NAME + '/warehouse/tree'
            },
            {
              label: "储位",
              prop: "storageId",
              type:'select',
              props: {
                label: 'name',
                value: 'id'
              },
              search:true,
              dicUrl:this.ERP_WMS_NAME + '/storage/dropDown?warehouseId={{key}}'
            },
            {
              label: "商品",
              prop: "goodsId",
              type:'select',
              row: true,
              span: 24,
              props: {
                label: 'name',
                value: 'id'
              },
              dicMethod: "post",
              search:true,
              dicUrl:this.ERP_WMS_NAME + '/goods/dropDown'
            },
            {
              label: "养护时间",
              prop: "createTime",
              type: "datetime",
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
              searchRange: true,
              searchSpan: 8,
              addDisplay: false,
              editDisplay: false,
              viewDisplay: false,
              search: true,
              rules: [{
                required: true,
                message: "请输入养护时间",
                trigger: "blur"
              }]
            },
            {
              label: "养护人",
              prop: "userName",
              rules: [{
                required: true,
                message: "请输入养护人",
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
