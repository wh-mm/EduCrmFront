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
                   v-if="permission.check_delete"
                   :open="handleDelete">删 除
        </el-button>
      </template>

      <template slot="menu" slot-scope="scope">

      <el-button type="text"
                 size="small"
                 @click="saveCheckHistory(scope.row)"
                 v-if="scope.row.checkStatus==0"
                >保存盘点记录</el-button>
        <el-button type="text"
                 size="small"
                 @click="updateCheckStatus(scope.row)"
                   v-if="scope.row.checkStatus==1"
                >编辑</el-button>
      </template>
      <template slot="realRepertoryQuantity" slot-scope="scope">
        <el-input-number :disabled="datas" size="mini" v-model="scope.row.realRepertoryQuantity" ></el-input-number>
      </template>

      <template slot="profitAndLoss" slot-scope="scope">
        {{scope.row.realRepertoryQuantity - scope.row.repertoryQuantity }}
      </template>



    </avue-crud>

  </basic-container>


</template>
<script>
  import {getList, getDetail, add, update, remove} from "@/api/warehouse/check/check";
  import {dropDown,lock} from "@/api/warehouse/warehouse";
  import {saveCheckHistory} from "@/api/warehouse/check/checkhistory";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        datas:false,
        checkStatus:0,
        warehouseDetail:[
          {
            lockStatus: ''
          }
        ],
        props: {
          label: 'name',
          value: 'id'
        },
        tabPosition: 'left',
        form: {},
        warehouseForm: {},
        query: {},
        checkDialog:false,
        lockDialog:false,

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
          viewBtn: true,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "仓库id",
              prop: "warehouseId",
              props: {
                label: 'title',
                value: 'value'
              },
              rules: [{
                required: true,
                message: "请输入仓库",
                trigger: "blur"
              }],
              dicUrl:'/api/erp-wms/warehouse/tree'
            },
            {
              label: "商品id",
              prop: "goodsId",
              rules: [{
                required: true,
                message: "请输入商品id",
                trigger: "blur"
              }],
              props: {
                label: 'goodsName',
                value: 'id'
              },
              dicMethod:"post",
              dicUrl: 'api/erp-wms/goods/selecListGoods',
            },
            {
              label: "库存总量",
              prop: "repertoryQuantity",
            },
            {
              label: "实际库存总量",
              prop: "realRepertoryQuantity",
              slot:true,
              cell: true,
            },
            {
              label: "盈亏数量",
              prop: "profitAndLoss",
              slot:true,
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
          addBtn: this.vaildData(this.permission.check_add, false),
          viewBtn: this.vaildData(this.permission.check_view, false),
          delBtn: this.vaildData(this.permission.check_delete, false),
          editBtn: this.vaildData(this.permission.check_edit, false)
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
        const {updateTime} = params;
        let values = {
          ...params,
        };
        if (updateTime) {
          values = {
            ...params,
            start_time: updateTime[0],
            end_time: updateTime[1],
          };
          values.updateTime = null;
          this.query.updateTime = null;
        }
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(values, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          data.records.forEach( (d) => {
            d.checkStatus=0;
          })
          this.loading = false;
          this.selectionClear();
        });
      },
      check() {
        this.checkDialog = true;
      },


      lockWarehouse() {
        this.lockDialog = true;
        dropDown().then(res => {
          this.warehouseDetail = res.data.data;
          console.log(res.data)
        })
      },
      lock(id,lockStatus) {
        lock(id,lockStatus).then(res =>{
          if (res.data.success) {
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        });
        this.lockDialog = false;
        this.refreshChange();

      },
      saveCheckHistory(row) {
        row.checkStatus=1;
        saveCheckHistory(row).then(res =>{
          this.$message.success(res.data.msg);
        });
      },
      updateCheckStatus(row) {
        row.checkStatus=0;
      },

    }
  };
</script>

<style>
</style>
