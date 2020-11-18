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
                   v-if="permission.materialsdelivery_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="{type,size,row}" slot="menu">
        <el-button icon="el-icon-plus" :size="size" option="optionForm" :type="text" @click="viewPurchaseOrder(row.purchaseId)">查看采购单</el-button>
      </template>
    </avue-crud>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="35%"
      :modal="false"
      :before-close="handleClose">
      <avue-crud :data="datas" :option="option0"></avue-crud>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {getList, getDetails, add, update, remove} from "@/api/materialsdelivery/materialsdelivery";
  import { getDetail } from "@/api/purchase/purchaseorder"
  import {mapGetters} from "vuex"

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
        obj:{},
        title: '' ,
        dialogVisible:false,
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
              label: "采购订单号",
              prop: "orderNumber",
              rules: [{
                required: true,
                message: "请输入采购订单号",
                trigger: "blur"
              }]
            },
            // {
            //   label: "采购id",
            //   prop: "purchaseId",
            //   editDisplay: false,
            //   addDisplay: false,
            //   rules: [{
            //     required: true,
            //     message: "请输入采购id",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "商品",
              prop: "goodsName",
              editDisplay: false,
              addDisplay: false,
              rules: [{
                required: true,
                message: "请输入商品id",
                trigger: "blur"
              }]
            },
            {
              label: "商品资质",
              prop: "goodsQuality",
              rules: [{
                required: true,
                message: "请输入商品资质",
                trigger: "blur"
              }]
            },
            {
              label: "商品数量",
              prop: "goodsQuantity",
              rules: [{
                required: true,
                message: "请输入商品数量",
                trigger: "blur"
              }]
            },
            {
              label: "收货状态",
              prop: "asReceivedConditionName",
              editDisplay: false,
              addDisplay: false,
            },
            {
              label: "收货员",
              prop: "name",
              editDisplay: false,
              addDisplay: false,
            },
            {
              label:"创建时间",
              prop:"createTime",
              dateDefault: true,
              addDisplay: false,
              viewDisplay: false,
              type: "datetime",
              searchSpan:12,
              searchRange:true,
              search:true,
              format: "yyyy-MM-dd hh:mm:ss",
              valueFormat: "yyyy-MM-dd hh:mm:ss",
            },


          ]
        },
        data: [],
        datas:[],
        option0 : {
          border:true,
          index:true,
          size:true,
          selection:true,
          page:true,
          menu:false,
          align:'center',
          menuAlign:'center',
          column:[
            {
              label: '*商品',
              prop: "goodsId",
              filterable: true,
              remote: true,
              display: false,
            }
          ]
        }

      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.materialsdelivery_add, false),
          viewBtn: this.vaildData(this.permission.materialsdelivery_view, false),
          delBtn: this.vaildData(this.permission.materialsdelivery_delete, false),
          editBtn: this.vaildData(this.permission.materialsdelivery_edit, false)
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
          getDetails(this.form.id).then(res => {
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
        const {createTime} = params;
        let values = {
          ...params,
        };
        if (createTime) {
          values = {
            ...params,
            start_time: createTime[0],
            end_time: createTime[1],
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
      viewPurchaseOrder(id){
        console.log(id)
        this.dialogVisible = true;
        getDetail(id).then(res=>{
          if (res.data.success) {
            this.obj = res.data.data;
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })
      }
    }
  };
</script>

<style>
</style>
