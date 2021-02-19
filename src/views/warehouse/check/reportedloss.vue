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
                   v-if="permission.reportedloss_delete"
                   @click="handleDelete">删 除
        </el-button>

      </template>

      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          icon="el-icon-check"
          size="small"
          v-if="scope.row.checkStatus != 2 "
          plain @click.stop="handleEdit(scope.row,scope.index)">编辑</el-button>

        <el-button type="text"
                   size="small"
                   v-if="scope.row.checkStatus == 0"
                   @click="updateCheckStatusOfRepertored(scope.row,1)">审核</el-button>
        <el-button
          type="text"
          size="small"
          v-if="scope.row.checkStatus == 1"
          @click="updateRepertoryRepertored(scope.row,2)">修改库存</el-button>

      </template>
      <template slot="profitAndLoss" slot-scope="scope">
        {{scope.row.realRepertoryQuantity - scope.row.repertoryQuantity }}
      </template>
    </avue-crud>

  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove,updateCheckStatusOfRepertored,updateRepertoryRepertored} from "@/api/warehouse/check/reportedloss";
  import {mapGetters} from "vuex";
  import {getGoodsDetail} from "@/api/warehouse/goods";
  import {selectByBatchNumber} from "@/api/warehouse/repertory";

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
          viewBtn: true,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "库存id",
              prop: "repertoryId",
              addDisplay:false,
              editDisplay:false,
              disabled:true,
              hide:true
            },
            {
              label: "仓库",
              prop: "warehouseId",
              type:'tree',
              span:24,
              rules: [{
                required: true,
                message: "请输入仓库",
                trigger: "blur"
              }],
              props: {
                label: 'title',
                value: 'value'
              },
              cascaderItem:['goodsId'],
              dicUrl:'/api/erp-wms/warehouse/tree'
            },
            {
              label: "商品",
              prop: "goodsId",
              type: 'tree',
              span:24,
              rules: [{
                required: true,
                message: "请输入商品",
                trigger: "blur"
              }],
              props: {
                label: 'goodsName',
                value: 'goodsId'
              },
              dicMethod: 'post',
              dicUrl: '/api/erp-wms/repertory/selectRepertoryGoodsByWarehouseId?warehouseId={{key}}',
              change: ({value}) => {
                getGoodsDetail(value).then(res => {
                  let selectValue = res.data.data;
                  this.form.goodsCode = selectValue.goodsCode;
                });
                selectByBatchNumber(null,value,null).then(res => {
                  let selectValues = res.data.data;
                  selectValues.forEach(detail=>{
                    this.form.repertoryQuantity=detail.repertoryQuantity;
                    this.form.repertoryId=detail.id;

                  });


                });
              },
            },


            {
              label: "商品编码",
              prop: "goodsCode",
              disabled: true,
              span:24,
              rules: [{
                required: true,
                message: "请输入商品编码",
                trigger: "blur"
              }]
            },
            {
              label: "库存数量",
              prop: "repertoryQuantity",
              disabled: true,
              rules: [{
                required: true,
                message: "请输入库存数量",
                trigger: "blur"
              }]
            },
            {
              label: "实际数量",
              prop: "realRepertoryQuantity",
              rules: [{
                required: true,
                message: "请输入实际数量",
                trigger: "blur"
              }]
            },
            {
              label: "差值",
              addDisplay:false,
              editDisplay:false,
              prop: "profitAndLoss",
              slot:true,
            },
            {
              label: "审核状态",
              prop: "checkStatus",
              addDisplay:false,
              editDisplay:false,
              type:"select",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=check_status_of_reportedloss"
            },
            {
              label: "备注",
              prop: "remark",
              rules: [{
                message: "请输入备注",
                trigger: "blur"
              }]
            },
            {
              label: "创建时间",
              prop: "updateTime",
              addDisplay:false,
              editDisplay:false,
              rules: [{
                message: "请输入备注",
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
          addBtn: this.vaildData(this.permission.reportedloss_add, false),
          viewBtn: this.vaildData(this.permission.reportedloss_view, false),
          delBtn: this.vaildData(this.permission.reportedloss_delete, false),
          editBtn: false,
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
      updateCheckStatusOfRepertored(row,checkStatus){
        updateCheckStatusOfRepertored(row.id,checkStatus).then(res=>{
          this.$message({
            type:'info',
            message:res.data.msg
          })
          this.searchReset();
        });
      },
      updateRepertoryRepertored(row,checkStatus){
        updateRepertoryRepertored(row.id,row.repertoryId,checkStatus).then(res=>{
          this.$message({
            type:'info',
            message:res.data.msg
          })
          this.searchReset();
        });
      },
      handleEdit (row, index) {
        this.$refs.crud.rowEdit(row, index);
      },
    }
  };
</script>

<style>
</style>
