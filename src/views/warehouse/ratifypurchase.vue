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

      <template slot-scope="{type,size,row}" slot="menu">
        <el-button v-if="row.status == 0 && this.permission.purchaseorder_view" icon="el-icon-check" :size="size" :type="type"
                   @click="updateStatus(row.id,row.status)">审批
        </el-button>
      </template>
      <template slot-scope="{row}" slot="totalPriceForm">
        {{(row.money*row.goodsQuantity).toFixed(2)}}
      </template>
    </avue-crud>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      :modal="false"
      :before-close="handleClose">
      <avue-form ref="form" v-model="obj" :option="optionForm" @submit="submit">
      </avue-form>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {getList, add, getDetail, update, remove, updateStatus} from "@/api/purchase/purchaseorder";
  import {getGoodsDetail} from "@/api/warehouse/goods";
  import {mapGetters} from "vuex";

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
          height: 'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          dialogClickModal: false,
          dialogWidth: '80%',

          column: [
            {
              label: "采购订单号",
              prop: "orderNumber",
              editDisplay: false,
              addDisplay: false,
              search: true,
              rules: [{
                required: true,
                message: "请输入采购订单号",
                trigger: "blur"
              }]
            },
            {
              label: "类型",
              prop: "type",
              search: true,
              type: "select",
              rules: [{
                required: true,
                message: "请输入类型",
                trigger: "blur"
              }],
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=purchase_type",
              props: {
                label: "dictValue",
                value: "dictKey"
              }
            },
            {
              label: "总价",
              prop: "sumMoney",
              editDisplay: false,
              disabled: true,
            },
            {
              label: "状态",
              prop: "statusName",
              addDisplay: false,
              editDisplay: false,
              viewDisplay:false,
            },
            {
              label: '商品列表',
              prop: 'purchaseOrderDetailList',
              type: 'dynamic',
              span: 24,
              children: {
                align: 'center',
                headerAlign: 'center',
                rowAdd: (done) => {
                  done({
                    goodsQuantity: 1,
                    discountPercentage: 0,
                  });
                },
                rowDel: (row, done) => {
                  done();
                },
                column: [
                  {
                    label: '*商品',
                    prop: "goodsId",
                    type: 'select',
                    width: 150,
                    filterable: true,
                    remote: true,
                    rules: [{
                      type: 'select',
                      require: true,
                      message: '请选择商品',
                    }],
                    props: {
                      label: 'goodsName',
                      value: 'id'
                    },
                    dicMethod: "post",
                    dicUrl: '/api/taocao-warehouse/goods/dropDowns?name={{key}}',
                    change: ({value}) => {
                      if (value) {
                        getGoodsDetail(value).then(res => {
                          this.form.sumMoney = 0;
                          this.form.purchaseOrderDetailList.forEach(val => {
                            if (val.goodsId == value) {
                              var detail = res.data.data;
                              val.unit = detail.unitName;
                              // val.money = detail.money;
                            }
                            this.form.sumMoney = (this.form.sumMoney * 1 + val.money * val.goodsQuantity).toFixed(2);
                          });
                        });
                      }
                    }
                  }, {
                    label: '*数量',
                    prop: "goodsQuantity",
                    type: "number",
                    width: 200,

                    rules: [{
                      validator: validateQuantity,
                      trigger: 'blur'
                    }],
                    change: ({value}) => {
                      console.log(value)
                      this.form.sumMoney = 0;
                      this.form.purchaseOrderDetailList.forEach(val => {
                        if (val.goodsId != "") {
                          this.form.sumMoney = (this.form.sumMoney * 1 + val.money * val.goodsQuantity).toFixed(2);
                        }
                      });
                    },
                  },
                  {
                    label: '单位',
                    prop: "unit",
                    disabled: true,
                    placeholder: " ",
                    width: 100,
                  }, {
                    label: '单价(元)',
                    prop: "money",
                    disabled: false,
                    placeholder: " ",
                    width: 100,
                    change: ({value}) => {
                      console.log(value)
                      this.form.sumMoney = 0;
                      this.form.purchaseOrderDetailList.forEach(val => {
                        if (val.goodsId != "") {
                          this.form.sumMoney = (this.form.sumMoney * 1 + val.money * val.goodsQuantity).toFixed(2);
                        }

                      });
                    }
                  },
                  {
                    label: '*采购仓库(必选)',
                    prop: "warehouseId",
                    type: "tree",
                    rsearch: true,
                    rules: [{
                      required: true,
                      message: "请输入类型",
                      trigger: "blur"
                    }],
                    props: {
                      label: 'name',
                      value: 'id'
                    },
                    dicMethod: "post",
                    dicUrl: '/api/taocao-warehouse/warehouse/dropDown'
                  },
                  {
                    label: "采购额",
                    prop: "totalPrice",
                    formslot: true,
                  },
                  {
                    label: '备注',
                    prop: "remark",
                  }],
              }
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
          viewBtn: this.vaildData(this.permission.purchaseorder_view, false),
          delBtn: false,
          editBtn: this.vaildData(this.permission.purchaseorder_edit, false)
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
      updateStatus(id) {
        let status;
        this.$confirm("请确认是否审批?", {
          confirmButtonText: "确认",
          cancelButtonText: "驳回",
          type: "warning"
        })
          .then(() => {
            status = 2;

          })
          .catch(() => {
            status = 3;

          }).finally(() => {
          updateStatus(id, status).then(res => {
            if (res.data.success) {
              this.$message.success(res.data.msg);
            } else {
              this.$message.error(res.data.msg);
            }
            this.refreshChange();
            this.onLoad(this.page);
          })
        });
      },
    }
  };
</script>

<style>
</style>
