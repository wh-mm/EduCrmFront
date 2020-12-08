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
      <template slot="productionDate" slot-scope="scope">
        <el-date-picker
          :size="scope.size" :type="scope.type"
          v-model="scope.row.productionDate"
          format ="yyyy-MM-dd"
          value-format = "yyyy-MM-dd"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </template>
      <template slot="expiredDate" slot-scope="scope">
        <el-date-picker
          :size="scope.size" :type="scope.type"
          v-model="scope.row.expiredDate"
          format ="yyyy-MM-dd"
          value-format = "yyyy-MM-dd"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button icon="el-icon-check" :size="scope.size" :type="scope.type"
                   @click="save(scope.row.id,scope.row.productionDate,scope.row.expiredDate)">保存</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList,saveDate} from "@/api/warehouse/repertory";
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
          height:'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          menuWidth: 100,
          selection: false,
          dialogClickModal: false,
          column: [
            {
              label: "仓库",
              prop: "warehouseId",
              type:'tree',
              search:true,
              props: {
                label: 'title',
                value: 'id'
              },
              // cascaderItem: ['storageId'],
              dicUrl:this.ERP_WMS_NAME + '/warehouse/tree'
            },
            {
              label: "储位",
              prop: "storageId",
              type:'tree',
              props: {
                label: 'name',
                value: 'id'
              },
              search:true,
              dicUrl:this.ERP_WMS_NAME + '/storage/dropDown'
            },
            {
              label: "商品",
              prop: "goodsId",
              type:'select',
              row: true,
              span: 24,
              props: {
                label: 'goodsName',
                value: 'id'
              },
              dicMethod:"post",
              dicUrl: 'api/erp-wms/goods/selecListGoods',
            },
            {
              label: "库存数量",
              prop: "repertoryQuantity",
            },
            {
              label: "入库时间",
              prop: "createTime",
            },
            {
              label: "生产日期",
              prop: "productionDate",
              slot: true
            },
            {
              label: "有效期",
              prop: "expiredDate",
              slot: true
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
      save(id,productionDate,expiredDate){
        let row = {};
        row.id = id;
        row.productionDate = productionDate;
        row.expiredDate=expiredDate;
        saveDate(row).then(res =>{
          this.$message({
            type:'success',
            message:res.data.msg
          })
        }).catch( res => {
          this.$message({
            type:'error',
            message:res.data.msg
          })
        })
      }
    }
  };
</script>

<style>
</style>
