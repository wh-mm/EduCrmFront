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

        <template slot-scope=""  slot="menuLeft">

          <el-button type="button"
                     size="small"
                     v-if="permission.goodsclerk_approval"
                     @click="updateGoodsClerkNew()">审批
          </el-button>

      </template>

      <template slot-scope="{row}" slot="totalPriceForm">
        {{(row.money*row.goodsQuantity).toFixed(2)}}
      </template>

    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, add, getDetail, update, remove, updateGoodsClerk} from "@/api/purchase/purchaseorder";
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
        obj:{},
        title: '' ,
        dialogVisible:false,
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
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=purchase_type"
            },
            {
              label: "预付款状态",
              prop: "advanceStatus",
              search: true,
              type: "select",
              rules: [{
                required: true,
                message: "请输入类型",
                trigger: "blur"
              }],
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=advance",


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
              type:'select',
              addDisplay: false,
              editDisplay: false,
              viewDisplay:false,
              search: true,
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=purchase_status"
            },
            {
              label: "采购员",
              prop:"name",
              addDisplay: false,
              viewDisplay: false,
              editDisplay: false,


            },
            {
              label:"创建时间",
              prop:"updateTime",
              dateDefault: true,
              addDisplay: false,
              viewDisplay: false,
              editDisplay: false,
              type: "datetime",
              searchSpan:12,
              searchRange:true,
              search:true,
              format: "yyyy-MM-dd hh:mm:ss",
              valueFormat: "yyyy-MM-dd hh:mm:ss",
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
                    label:'供应商',
                    prop:'informationId',
                    type:'select',
                    filterable: true,
                    remote: true,
                    display:false,
                    props: {
                      label: 'supplierName',
                      value: 'id'
                    },
                    cascaderItem: ['goodsId'],
                    // cascaderItem: ['goosId'],
                    // dicMethod: "post",
                    dicUrl: '/api/quality/information/dropDowns?name={{key}}',
                  },
                  {
                    label: '*商品',
                    prop: "commodityId",
                    type: 'tree',
                    width: 130,
                    filterable: true,
                    remote: true,
                    display:false,
                    rules: [{
                      type: 'tree',
                      require: true,
                      message: '请选择商品',
                    }],
                    props: {
                      label: 'tradeName',
                      value: 'id'
                    },
                    // : '/api/taocao-warehouse/goods/dropDowns?name={{key}}',
                    dicUrl: '/api/quality/commodity/tree?informationId={{key}}',
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
                    },
                  },
                  {
                    label: '*数量',
                    prop: "goodsQuantity",
                    type: "number",
                    width: 130,

                    rules: [{
                      validator: validateQuantity,
                      trigger: 'blur'
                    }],
                    change: () => {
                      this.form.sumMoney = 0;
                      this.form.purchaseOrderDetailList.forEach(val => {
                        if (val.goodsId != "") {
                          this.form.sumMoney = (this.form.sumMoney * 1 + val.money * val.goodsQuantity).toFixed(2);
                        }
                      });
                    },
                  },
                  {
                    label: '实际数量',
                    prop: "realQuantity",
                    type: "number",
                  },
                  {
                    label: '商品资质',
                    prop: "unit",
                    disabled: true,
                    type:'button',
                    placeholder: " ",
                    width: 100,
                  }, {
                    label: '单价(元)',
                    prop: "money",
                    disabled: false,
                    placeholder: " ",
                    change: () => {
                      this.form.sumMoney = 0;
                      this.form.purchaseOrderDetailList.forEach(val => {
                        if (val.goodsId != "") {
                          this.form.sumMoney = (this.form.sumMoney * 1 + val.money * val.goodsQuantity).toFixed(2);
                        }

                      });
                    }
                  },
                  // {
                  //   label: '*采购仓库(必选)',
                  //   prop: "warehouseId",
                  //   type: "tree",
                  //   rsearch: true,
                  //   rules: [{
                  //     required: true,
                  //     message: "请输入类型",
                  //     trigger: "blur"
                  //   }],
                  //   props: {
                  //     label: 'title',
                  //     value: 'id'
                  //   },
                  //   cascaderItem: ['storageId'],
                  //   dicUrl: '/api/erp-wms/warehouse/tree'
                  // },
                  // {
                  //   label: "储位",
                  //   prop: "storageId",
                  //   type:'tree',
                  //   props: {
                  //     label: 'title',
                  //     value: 'id'
                  //   },
                  //   dicUrl:'/api/erp-wms/storage/tree?warehouseId={{key}}'
                  // },
                  {
                    label: "预付款",
                    prop: "advancePayment",
                    // disabled: true,
                    placeholder: " ",
                    watch:{
                      handler(){

                      }

                    }
                  },
                  {
                    label: "采购额",
                    prop: "totalPrice",
                    formslot: true,
                  },
                  {
                    label: '备注',
                    prop: "remark",
                    type: "textarea",
                    width: 100,
                  }
                ],
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
          addBtn: this.vaildData(this.permission.goodsclerk_add, false),
          viewBtn: this.vaildData(this.permission.goodsclerk_view, false),
          delBtn: this.vaildData(this.permission.goodsclerk_delete, false),
          editBtn: this.vaildData(this.permission.goodsclerk_edit, false)
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

      updateGoodsClerk(id) {
        let status;
        this.$confirm("请确认是否通过申请?", {
          confirmButtonText: "审批通过",
          cancelButtonText: "驳回申请",
          type: "warning"
        })
          .then(() => {
            status = 0;
          })
          .catch(() => {
            status = 3;
          }).finally(() => {
          updateGoodsClerk(id, status).then(res => {
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
      submit(form,done){
        add(form).then( res => {
          done();
          if(res.data.success){
            this.$refs.form.resetForm();
            this.$message.success(res.data.msg);
            this.dialogVisible = false;
            this.onLoad(this.page, this.query);
          }else {
            this.$message.error(res.data.msg);
          }
        }).catch(() => {
          done();
        })
      },
      updateGoodsClerkNew() {
        if (this.selectionList.length >1 ){
          return this.$message.error("选中一行数据");
        }
        if (this.selectionList[0].status != 6){
          return this.$message.error("状态已经完成");
        }
        var id= this.selectionList[0].id;
        let status;
        this.$confirm("请确认是否审批?", {
          confirmButtonText: "确认",
          cancelButtonText: "驳回",
          type: "warning"
        })
          .then(() => {
            status = 7;
          })
          .catch(() => {
            status = 106;
          }).finally(() => {
          updateGoodsClerk(id, status).then(res => {
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
