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
      <template  slot-scope="scope" slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.transfer_delete"
                   @click="handleDelete">删 除
        </el-button>


      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="text"
                   size="small"
                   plain
                   v-if="scope.row.updateStatus==1"
                   @click="updateTransfer(scope.row.id,2)">转 库
        </el-button>

      </template>

    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove,updateTransfer} from "@/api/warehouse/transfer";
  import {mapGetters} from "vuex";
  import {selectByBatchNumber} from "@/api/warehouse/repertory";

  export default {
    data() {
      var validateQuantity = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入数量'));
        } else if (value <= 0) {
          callback(new Error('数量不能小于0'));
        } else {
          callback();
        }
      };
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
          excelBtn:true,
          printBtn:true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: '商品',
              prop: "goodsId",
              type: 'tree',
              width: 130,
              sortable:true,
              filterable: true,
              // disabled: true,
              search:true,
              rules: [{
                required: true,
                message: '请选择商品',
              }],
              props: {
                label: 'goodsName',
                value: 'goodsId'
              },
              cascaderItem: ['batchNumber' ],
              dicMethod:'post',
              dicUrl: '/api/erp-wms/repertory/dropDowns',
            },
            {
              label: "批号",
              prop: "batchNumber",
              type:'select',
              width:170,
              sortable:true,
              rules: [{
                required: true,
                message: '请选择批号',
              }],
              props: {
                label: 'batchNumber',
                value: 'id'
              },
              dicMethod:'post',
              dicUrl: '/api/erp-wms/repertory/dropDownbatchnumber?goodsId={{key}}',
              change: ({value}) => {
                  selectByBatchNumber(null,this.form.goodsId,value).then(ress => {
                    var detail = ress.data.data;
                    detail.forEach(val =>{
                      if (value==this.form.batchNumber) {
                      this.form.oldWarehouseId = val.warehouseId;
                      this.form.oldStorageRegionId = val.storageRegionId;
                      this.form.oldStorageId = val.storageId;
                      this.form.repertoryQuantity  = val.repertoryQuantity
                      this.form.oldQuantity  = val.repertoryQuantity
                      }
                    });
                  });

              },
            },
            {
              label: "旧仓库",
              prop: "oldWarehouseId",
              type: "tree",
              disabled: true,
              sortable:true,
              rules: [{
                message: "请输入旧仓库",
                trigger: "blur"
              }],
              props: {
                label: 'title',
                value: 'id'
              },
              cascaderItem: ['storageId'],
              dicUrl: '/api/erp-wms/warehouse/tree'
            },
            {
              label: "旧区",
              prop: "oldStorageRegionId",
              type: "select",
              disabled: true,
              sortable:true,
              rules: [{
                message: "请输入旧区",
                trigger: "blur"
              }],
              props: {

                label: 'title',
                value: 'id'
              },
              dicUrl:'/api/erp-wms/storage/queryRegionTree?warehouseId={{key}}'
            },
            {
              label: "旧储位",
              prop: "oldStorageId",
              type: "select",
              disabled: true,
              sortable:true,
              rules: [{
                message: "请输入旧储位",
                trigger: "blur"
              }],
              props: {
                label: 'name',
                value: 'id'
              },
              // cascaderItem: ['goodsId'],
              dicUrl:'/api/erp-wms/storage/dropDown'
            },
            {
              label:'库存数量(g)',
              prop: 'repertoryQuantity',
              disabled: true,
              hide:true,
              row:true,
              sortable:true,
              width:100,
            },
            {
              label: "变动数量",
              prop: "oldQuantity",
              sortable:true,
              rules: [{
                required: true,
                validator: validateQuantity,
                message: "请输变动数量",
                trigger: "blur"
              }]
            },
             {
              label: '新仓库',
              prop: "newWarehouseId",
              type: "tree",
              rsearch: true,
              sortable:true,
              width:150,
              rules: [{
                required: true,
                message: "请输入仓库",
                trigger: "blur"
              }],
              props: {
                label: 'title',
                value: 'id'
              },
              cascaderItem: ['newStorageRegionId'],
              dicUrl: '/api/erp-wms/warehouse/tree'
            },
            {
              label:'新区域',
              prop: "newStorageRegionId",
              type:'tree',
              width:150,
              sortable:true,
              props: {
                label: 'title',
                value: 'id'
              },
              cascaderItem: ['newStorageId'],
              dicUrl:'/api/erp-wms/storage/queryRegionTree?warehouseId={{key}}'
            },
            {
              label: "新储位",
              prop: "newStorageId",
              type:'tree',
              sortable:true,
              props: {
                label: 'title',
                value: 'id'
              },
              dicUrl:'/api/erp-wms/storage/tree?storageRegionId={{key}}'
            },
            {
              label: "转移状态",
              prop: "statusName",
              addDisplay: false,
              editDisplay: false,
              width:150,
              sortable:true,
            },
            {
              label:"创建时间",
              prop:"createTime",
              dateDefault: true,
              addDisplay: false,
              editDisplay: false,
              viewDisplay: false,
              type: "datetime",
              searchSpan:12,
              searchRange:true,
              sortable:true,
              search:true,
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
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
          addBtn: this.vaildData(this.permission.transfer_add, false),
          viewBtn: this.vaildData(this.permission.transfer_view, false),
          delBtn: this.vaildData(this.permission.transfer_delete, false),
          editBtn: false,
          excelBtn: this.vaildData(this.permission.transfer_excel,false),
          printBtn: this.vaildData(this.permission.transfer_print,false),
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

        if(row.oldQuantity>row.repertoryQuantity){
                this.onLoad(this.page);
                this.$message.error("数量不足！");
                loading();
                return;
        }else{
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
        }


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
      updateTransfer(id,updateStatus){
        updateTransfer(id,updateStatus).then(res=>{
          if (res.data.success) {
            this.commoditydata = res.data.data;
            this.searchReset();
            this.$message.success(res.data.msg);

          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      handleEdit(row) {
        this.$refs.crud.rowEdit(row);
      }
    }
  };
</script>

<style>
</style>
