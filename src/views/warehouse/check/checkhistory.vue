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

                   v-if="permission.checkhistory_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot="menu" slot-scope="scope">
    <el-button
      type="text"
      size="small"
      v-if="scope.row.profitAndLoss>0"
      @click="checkGoods(scope.row)">
      盈余入库
    </el-button>
      </template>
    </avue-crud>


    <el-dialog
      title="盈余入库"
      :visible.sync="checkDialog"
      width="30%"
      :modal="false"
      :before-close="handleClose">
      <template slot-scope="scope">
        <avue-form ref="form" v-model="checkObj" :option="optionForm"  @submit="rowSave">
          <template slot="batchNumber" slot-scope="scope">
            <el-select
              v-model="checkObj.batchNumber"
              filterable
              allow-create
              @change="selectChanged(checkObj.batchNumber)"
              placeholder="请选择批号">
              <el-option
                v-for="item in batchNumberData"
                :key="item.id"
                :label="item.newBatchNumber"
                :value="item.id">
              </el-option>
            </el-select>
          </template>

        </avue-form>
      </template>

    </el-dialog>

  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/warehouse/check/checkhistory";
  import {dropDownBatchNumber} from "@/api/warehouse/repertory";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        checkStatus:0,
        form: {},
        query: {},
        checkObj:{},
        batchNumberData:[],
        loading: true,
        checkDialog: false,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: {
          height:'auto',
          calcHeight: 30,
          checkStatus:0,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          menu:false,
          viewBtn: true,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "仓库",
              prop: "warehouseName",
              sortable:true,
              rules: [{
                required: true,
                message: "请输入仓库id",
                trigger: "blur"
              }]
            },
            {
              label: "商品",
              prop: "goodsName",
              sortable:true,
              rules: [{
                required: true,
                message: "请输入商品id",
                trigger: "blur"
              }]
            },
            {
              label: "盈亏数量",
              prop: "profitAndLoss",
              sortable:true,
              rules: [{
                required: true,
                message: "请输入盈亏数量",
                trigger: "blur"
              }]
            },
            {
              label: "盈亏状态",
              prop: "profitAndLossStatus",
              sortable:true,
              rules: [{
                required: true,
                message: "请输入盈亏状态",
                trigger: "blur"
              }]
            },
            {
              label: "类型",
              prop: "type",
              sortable:true,
              rules: [{
                required: true,
                message: "请输入盈亏状态",
                trigger: "blur"
              }]
            },

            {
              label: "记录时间",
              prop: "createTime",
              format: "yyyy-MM-dd",
              valueFormat: "yyyy-MM-dd",
              sortable:true,
              rules: [{
                required: true,
                message: "请输入有效期至",
                trigger: "blur"
              }]
            },
          ]
        },
        data: [],
        optionForm: {
          height:'auto',
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
              label: "*仓库",
              prop: "warehouseId",
              disabled:true,
              type:'tree',
              span:24,
              props: {
                label: 'title',
                value: 'value'
              },
              cascaderItem: ['storageRegionId'],
              dicUrl:'/api/wh-warehouse/warehouse/tree'
            },
            {
              label: "区域",
              prop: "storageRegionId",
              type:'tree',
              span:24,
              props: {
                label: 'title',
                value: 'id'
              },
              cascaderItem: ['storageId'],
              dicUrl:'/api/wh-storage/storage/queryRegionTree?warehouseId={{key}}'
            },
            {
              label: "储位",
              prop: "storageId",
              type:'tree',
              span:24,
              props: {
                label: 'title',
                value: 'id'
              },
              dicUrl:'/api/wh-storage/storage/tree?storageRegionId={{key}}'
            },
            {
              label:"商品",
              prop:"goodsId",
              type:'select',
              disabled:true,
              span:24,
              props: {
                label: 'goodsName',
                value: 'id'
              },
              dicMethod:'get',
              cascaderItem: ['batchNumber'],
              dicUrl:'/api/wh-goods/goods/dropDowns',
            },
            {
              label:"批号",
              prop:"batchNumber",
              span:24,
              formslot:true,
            },
            {
              label:"入库数量",
              prop:"quantity",
              disabled:true,
              span:24
            },
          ]}
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.checkhistory_add, false),
          viewBtn: this.vaildData(this.permission.checkhistory_view, false),
          delBtn: this.vaildData(this.permission.checkhistory_delete, false),
          editBtn: this.vaildData(this.permission.checkhistory_edit, false)
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
          this.checkDialog =false;
          this.checkObj = null;
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
          data.records.forEach( (d) => {
            d.checkStatus=0;
          })
          this.loading = false;
          this.selectionClear();
        });
      },
      checkGoods(row){

        this.checkDialog=true;
        this.checkObj.goodsId=row.goodsId;
        this.checkObj.warehouseId=row.warehouseId;
        this.checkObj.quantity=row.profitAndLoss;

        dropDownBatchNumber(row.goodsId).then(res=>{
          this.batchNumberData  = res.data.data;

        });
      },
      selectChanged(value) {
        this.batchNumberData.forEach( res=>{
          if(res.id == value){
            this.checkObj.storageId  = res.storageId
            this.checkObj.storageRegionId  = res.storageRegionId

          }
        })
      },

    }
  };
</script>

<style>
</style>
