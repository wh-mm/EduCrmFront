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
      <template slot-scope="scope" slot="menu">
        <el-button icon="el-icon-check" :size="scope.size" :type="scope.type"
                   @click="maintenance(scope.row.repertoryId)">养护</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList,saveMaintenance} from "@/api/warehouse/taskMaintenance";
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
          index: true,
          selection: false,
          addBtn: false,
          viewBtn: false,
          delBtn: false,
          editBtn: false,
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
              dicUrl:this.ERP_WMS_NAME +'/storage/dropDown?warehouseId={{key}}'
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
              dicUrl:this.ERP_WMS_NAME + '/goods/dropDown'
            },
            {
              label: "库存数量",
              prop: "repertoryQuantity",
            },
            {
              label: "养护时间",
              prop: "maintainTime",
            }
          ],

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
      maintenance(repertoryId){
        saveMaintenance(repertoryId).then( res => {
          this.$message.info(res.data.msg);
          this.refreshChange();
        })
      }
    }
  };
</script>

<style>
</style>
