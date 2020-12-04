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
      <template slot="maintenanceCycle" slot-scope="scope">
        <el-input-number
          :size="scope.size" :type="scope.type"
          v-model="scope.row.maintenanceCycle"></el-input-number>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button icon="el-icon-check" :size="scope.size" :type="scope.type"
        @click="save(scope.row.id,scope.row.maintenanceCycle)">保存</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {pageMaintenanceCycle, getGoodsDetail,saveMaintenanceCycle} from "@/api/warehouse/goods";
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
              label: "名称",
              prop: "goodsName",
              search: true,
            },
            {
              label: "编码",
              prop: "goodsCode",
              search: true,
            },
            {
              label: "类型",
              prop: "type",
              type: "select",
              filterable: true,
              search: true,
              props: {
                label: 'title',
                value: 'id'
              },
              dicUrl: this.ERP_WMS_NAME + '/goods-type/tree'
            },
            {
              label: "基本单位",
              prop: "basicUnit",
              type: "select",
              searchSpan: 7,
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=goods_unit",
            },
            {
              label: "保质期(天)",
              prop: "shelfLife",
              type: "number",
              value: 0,
              rules: [{
                required: true,
                message: "请输入保质期",
                trigger: "blur"
              },
                {
                  pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
                  message: "请输入正确的保质期",
                  trigger: "change"
                }
              ]
            },
            {
              label: "贮藏条件",
              prop: "storageConditions",
              type: "select",
              filterable: true,
              search: true,
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=storage",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
            },
            {
              label: "规格",
              prop: "goodsSpecification",
            },
            {
              label: "养护周期(天)",
              prop: "maintenanceCycle",
              slot: true,
              width:200
            },
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
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getGoodsDetail(this.form.id).then(res => {
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
        pageMaintenanceCycle(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      },
      save(id,maintenanceCycle){
        saveMaintenanceCycle(id,maintenanceCycle).then(res =>{
          this.$message({
            type:'info',
            message:res.data.msg
          })
        })
      }
    }
  };
</script>

<style>
</style>
