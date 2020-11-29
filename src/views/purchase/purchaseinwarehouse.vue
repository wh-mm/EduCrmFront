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
                   v-if="permission.purchaseinwarehouseorder_approval"
                   @click="updateStatusNew()">审 批 入 库
        </el-button>

        <el-button type="button"
                   size="small"
                   v-if="status1 == '108'"
                   @click="dialogFormVisible = true">填写驳回理由
        </el-button>
      </template>

      <template slot-scope="{row}" slot="totalPriceForm">
        {{(row.money*row.goodsQuantity).toFixed(2)}}
      </template>
      <template slot-scope="{type,size,row}" slot="menu">
        <el-button icon="el-icon-plus" :size="size" option="option0"  :type="type" @click="viewAcceptanceRecord(row.id)">查看验收记录</el-button>
      </template>

      <template slot-scope="scope" slot="unitForm">
        <el-button :size="scope.size" option = "commoditydataoption" @click="viewCommodity(scope.row.commodityId)">查询</el-button>
      </template>

    </avue-crud>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="35%"
      :modal="false"
      :before-close="handleClose">
      <avue-crud v-model="form" :data="datas" :option="option0" >
      </avue-crud>
    </el-dialog>

    <el-dialog
      :title="商品资质"
      :visible.sync="commoditydialogVisible"
      :append-to-body="true"
      width="35%"
      :modal="false"
      :before-close="handleClose"
      :close-on-click-modal="false"
      v-dialogDrag>
      <avue-crud v-model="form" :data="commoditydata" :option="commoditydataoption"  >
      </avue-crud>
    </el-dialog>

    <el-dialog title="驳回理由" :visible.sync="dialogFormVisible">
      <avue-form ref="form" v-model="obj0Reason" :option="option0Reason">
      </avue-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updaterejectTextNew">提 交</el-button>
      </div>
    </el-dialog>

  </basic-container>
</template>

<script>
  import {
    getList,
    add,
    getDetail,
    update,
    remove,
    updateStatus,
    viewAcceptanceRecord,
    viewCommodity,
    updaterejectText
  } from "@/api/purchase/purchaseorder";
  import {getGoodsDetail} from "@/api/warehouse/goods";
  import {mapGetters} from "vuex";
  import '@/views/purchase/dialogdrag.ts'
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
        commoditydialogVisible:false,
        dialogFormVisible: false,
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
          editBtn: true,
          editBtnText:'复核选库',
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
              disabled: true,
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
              disabled: true,
              type: "select",
              rules: [{
                required: true,
                editDisplay: false,
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
            // {
            //   label: "单据上传",
            //   prop: "shippingListPhotos",
            //   dataType: 'array',
            //   labelWidth: 110,
            //   type: 'upload',
            //   hide: true,
            //   disabled: true,
            //   propsHttp: {
            //     res: 'data',
            //     url: 'link',
            //   },
            //   span: 12,
            //   listType: 'picture-card',
            //   tip: '只能上传jpg/png文件，且不超过500kb',
            //   action: "/api/oss/goods/imgUpload"
            // },
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
              editDisplay: false,
              addDisplay: false,

            },
            {
              label:"创建时间",
              prop:"updateTime",
              dateDefault: true,
              editDisplay: false,
              addDisplay: false,
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
                    editDisplay: false,
                    disabled: true,
                    filterable: true,
                    remote: true,
                    props: {

                      label: 'supplierName',
                      value: 'id'
                    },
                    cascaderItem: ['goodsId'],
                    // cascaderItem: ['goosId'],
                    // dicMethod: "post",
                    dicUrl: '/api/quality/information/dropDownsss?name={{key}}',
                  },
                  {
                    label: '*商品',
                    prop: "commodityId",
                    type: 'tree',
                    width: 130,
                    filterable: true,
                    remote: true,
                    display:false,
                    disabled: true,
                    rules: [{
                      require: true,
                      message: '请选择商品',
                    }],
                    props: {
                      label: 'tradeName',
                      value: 'id'
                    },
                    // : '/api/taocao-warehouse/goods/dropDowns?name={{key}}',
                    dicUrl: '/api/quality/commodity/tree?informationId={{key}}',
                    // dicMethod:'post',
                    // dicUrl: '/api/erp-wms/goods/dropDowns?informationId={{key}}',
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
                    editDisplay: false,
                    disabled: true,
                    rules: [{
                      validator: validateQuantity,
                      trigger: 'blur',
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
                    label: '收货数量',
                    prop: "realQuantity",
                    type: "number",
                    editDisplay: false,
                    disabled: true,
                  },
                  {
                    label: '验收合格数量',
                    prop: "qualifiedQuantity",
                    disabled: true,
                    type: "number",
                  },
                  {
                    label: '商品资质',
                    prop: "unit",
                    type:'input',
                    placeholder: " ",
                    formslot:true,
                    editDisplay: false,
                    width: 100,
                  }, {
                    label: '单价(元)',
                    prop: "money",
                    editDisplay: false,
                    disabled: true,
                    placeholder: " ",

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
                      label: 'title',
                      value: 'id'
                    },
                    cascaderItem: ['storageId'],
                    dicUrl: '/api/erp-wms/warehouse/tree'
                  },
                  {
                    label: "储位",
                    prop: "storageId",
                    type:'tree',
                    props: {
                      label: 'title',
                      value: 'id'
                    },
                    dicUrl:'/api/erp-wms/storage/tree?warehouseId={{key}}'
                  },
                  {
                    label: "预付款",
                    prop: "advancePayment",
                    editDisplay: false,
                    disabled: true,
                    // disabled: true,
                    placeholder: " ",
                  },
                  {
                    label: "采购额",
                    prop: "totalPrice",
                    editDisplay: false,
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
        data: [],
        datas:[],
        commoditydata:[],
        option0 : {
          addBtn: false,
          menu:false,
          align:'center',
          column:[
            {
              label: '*商品',
              prop: "goodsName",
              filterable: true,
              remote: true,
              display: false,
            },
            {
              label:'数量',
              prop:"goodsQuantity"
            },
            {
              label:'验收状态',
              prop:"acceptanceStatusName"
            },
            {
              label:'验收员',
              prop:"acceptanceName"
            }
          ]
        },
        commoditydataoption : {
        addBtn: false,
          menu:false,
          align:'center',
          column:[
          {
            label:'商品名称',
            prop:'tradeName'
          },{
            label:'通用名称',
            prop:'commonName'
          },
          {
            label: "基本单位",
            prop: "basicUnit",
          },
          {
            label:'规格(型号)',
            prop:'specifications'
          },
          {
            label: "生产厂家",
            prop: "manufacturer",
          },
          {
            label: "进项税",
            prop: "inputTax",
          },
          {
            label: "销项税",
            prop: "outputTax",
          },
          {
            label: "分包装企业",
            prop: "subPackagingEnterprises",
            labelWidth: 110,
            rules: [{
              required: true,
              message: "请输入分包装企业",
              trigger: "blur"
            }]
          },
          {
            label: "剂型",
            prop: "dosageForm",
            type: 'tree',
            props: {
              label: 'dictValue',
              value: 'dictKey'
            },
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=dosage_form",

          },
          {
            label: 'OTC标志',
            prop: 'signTow',
            display: true,
            rules: [],
          },
          {
            label: "产品分类",
            prop: "productClassification",
            rules: [{
              required: true,
              message: "请输入产品分类",
              trigger: "blur"
            }],
            type: 'tree',
            props: {
              label: 'title',
              value: 'id'
            },
            dicUrl: "/api/erp-wms/goods-type/tree",
          },
          {
            label: "产品二级分类",
            prop: "productClassificationTow",
            labelWidth: 110,
          },
          {
            label: "存储期限",
            prop: "storageLife",
            tip: '按每月',
          },
          {
            label: "存储期限类型",
            prop: "storagePeriodType",
            labelWidth: 110,
          },
          {
            label: "特管药品",
            prop: "specialDrugs",
          },
          {
            label: "特殊药品",
            prop: "specialDrug",
          },

          {
            label: "国产/进口标示",
            labelWidth: 110,
            prop: "domesticImportIndication",
          },
          /*{
            label: "产品二级分类",
            prop: "secondaryProductClassification",
            rules: [{
              required: true,
              message: "请输入产品二级分类",
              trigger: "blur"
            }]
          },*/
          {
            label: "存储条件",
            prop: "storageConditions",
          },
          {
            label: "批准文号",
            prop: "approvalNumber",
          },
          {
            label: "税收分类",
            prop: "taxClassification",
          },
        ]
      },
        obj0Reason:{
          rejectText:''
        },
        option0Reason:{
          emptyBtn:false,
          submitBtn:false,
          column: [{
            label: "驳回理由",
            prop: "rejectText",
            type:'textarea',
            span: 24,
          }]
        },

      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.purchaseinwarehouseorder_add, false),
          viewBtn: this.vaildData(this.permission.purchaseinwarehouseorder_view, false),
          delBtn: this.vaildData(this.permission.purchaseinwarehouseorder_delete, false),
          editBtn: this.vaildData(this.permission.purchaseinwarehouseorder_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      },
      status1() {
        let status1 = [];
        this.selectionList.forEach(ele => {
          status1.push(ele.status);
        });
        return status1.join(",");
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
      // beforeOpen(done, type) {
      //
      //
      //
      //   if(["add"].includes(type)){
      //     let sp = {
      //         label: '*商品',
      //         prop: "commodityId",
      //         type: 'select',
      //         width: 130,
      //         filterable: true,
      //         remote: true,
      //         display:false,
      //         rules: [{
      //           require: true,
      //           message: '请选择商品',
      //         }],
      //         props: {
      //           label: 'tradeName',
      //           value: 'id'
      //         },
      //         // : '/api/taocao-warehouse/goods/dropDowns?name={{key}}',
      //         dicUrl: '/api/quality/commodity/tree?informationId={{key}}',
      //         change: ({value}) => {
      //           if (value) {
      //             getGoodsDetail(value).then(res => {
      //               this.form.sumMoney = 0;
      //               this.form.purchaseOrderDetailList.forEach(val => {
      //                 if (val.goodsId == value) {
      //                   var detail = res.data.data;
      //                   val.unit = detail.unitName;
      //                   // val.money = detail.money;
      //                 }
      //                 this.form.sumMoney = (this.form.sumMoney * 1 + val.money * val.goodsQuantity).toFixed(2);
      //               });
      //             });
      //           }
      //         },
      //       };
      //     console.log(this.option.column[7].children.column[0]);
      //    this.option.column[7].children.column[1] = sp;
      //   }
      //   if(["view"].includes(type)){
      //     let sp = {
      //         label: '*商品',
      //         prop: "goodsName",
      //       props: {
      //         label: 'tradeName',
      //         value: 'id'
      //       },
      //       // : '/api/taocao-warehouse/goods/dropDowns?name={{key}}',
      //       dicUrl: '/api/quality/commodity/tree?informationId={{key}}',
      //       };
      //    console.log(this.option.column[7].children.column[1]);
      //    this.option.column[7].children.column[1] = sp;
      //     getDetail(this.form.id).then(res => {
      //       let form  = res.data.data;
      //       form.purchaseOrderDetailList.forEach((value,index) => {
      //         getGoodsDetail(value.goodsId).then( res =>{
      //           value.goodsName = res.data.data.goodsName;
      //           if(index == (form.purchaseOrderDetailList.length-1)){
      //             this.form = form
      //
      //           }
      //         })
      //       })
      //     });
      //   }
      //   done();
      // },
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
      updateStatusNew() {
        if (this.selectionList.length >1 ){
          return this.$message.error("选中一行数据");
        }
        if (this.selectionList[0].status != 8){
          return this.$message.error("状态已经完成");
        }
        var id= this.selectionList[0].id;
        let status;
        this.$confirm("请确认是否审批入库?", {
          confirmButtonText: "确认",
          cancelButtonText: "驳回",
          type: "warning"
        })
          .then(() => {
            status = 9;
          })
          .catch(() => {
            status = 108;
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
      updaterejectTextNew() {
        if(this.status1 === 108 && this.obj0Reason.rejectText === '' ){
          return this.$message.error("请输入驳回理由!");
        }
        updaterejectText(this.ids, this.obj0Reason.rejectText).then(res => {
          if (res.data.success) {
            this.$message.success(res.data.msg);
            this.dialogFormVisible =false;
            this.refreshChange();
          } else {
            this.$message.error(res.data.msg);
          }
        })
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
      viewAcceptanceRecord(id){
        console.log(id)
        this.dialogVisible = true;
        viewAcceptanceRecord(id).then(res=>{
          if (res.data.success) {
            this.datas = res.data.data;
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      viewCommodity(commodityId){
        console.log(commodityId)
        this.commoditydialogVisible = true;
        viewCommodity(commodityId).then(res=>{
          if (res.data.success) {
            this.commoditydata = res.data.data;
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
