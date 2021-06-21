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
                     v-if="permission.financing_approval"
                     @click="updateFinancingNew()">审批
          </el-button>
          <el-button type="button"
                     size="small"
                     v-if="status1 == '104'"
                     @click="dialogFormVisible = true">填写驳回理由
          </el-button>
      </template>

      <template slot-scope="{row}" slot="totalPriceForm">
        {{(row.money*row.goodsQuantity).toFixed(2)}}
      </template>
      <template slot-scope="scope" slot="unitForm">
        <el-button :size="scope.size"  @click="viewCommodity(scope.row.goodsId)">查看资质</el-button>
      </template>
    </avue-crud>

    <el-dialog
      title="商品资质"
      :append-to-body="true"
      :visible.sync="commoditydialogVisible"
      width="50%"
      :modal="false"
      :before-close="handleClose"
      :close-on-click-modal="false"
      v-dialogDrag >
      <avue-crud v-model="form" :data="commoditydata" :option="commoditydataoption"  >
      </avue-crud>
    </el-dialog>

    <el-dialog title="驳回理由" :visible.sync="dialogFormVisible" :modal="false">
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
  import {getList, add, getDetail, update, remove, updateFinancing, viewCommodity,updaterejectText} from "@/api/purchase/purchaseorder";
  import {mapGetters} from "vuex";
  import '@/views/purchase/dialogdrag.ts'
  import {getGoodsDetail} from "@/api/warehouse/goods";
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
              label: "采购合同照片",
              prop: "purchaseContractPhotos",
              dataType: 'array',
              labelWidth: 110,
              type: 'upload',
              hide: true,
              propsHttp: {
                res: 'data',
                url: 'link',
              },
              span: 12,
              listType: 'picture-card',
              tip: '只能上传jpg/png文件，且不超过500kb',
              action: "/api/oss/goods/imgUpload"
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
              viewDisplay: false

            },
            {
              label:"创建时间",
              prop:"updateTime",
              dateDefault: true,
              addDisplay: false,
              viewDisplay: false,
              type: "datetime",
              searchSpan:12,
              searchRange:true,
              search:true,
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
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
                    dicUrl: '/api/quality/information/dropDownsss?name={{key}}',
                  },
                  {
                    label: '*商品',
                    prop: "goodsId",
                    type: 'select',
                    width: 130,
                    filterable: true,
                    remote: true,
                    display:false,
                    rules: [{
                      require: true,
                      message: '请选择商品',
                    }],
                    props: {
                      label: 'goodsName',
                      value: 'id'
                    },
                    // dicUrl: '/api/quality/commodity/tree?informationId={{key}}',
                    dicMethod:'post',
                    dicUrl: '/api/erp-wms/goods/dropDowns?informationId={{key}}',
                    change: ({value}) => {
                      if (value) {
                        getGoodsDetail(value).then(res => {
                          this.form.sumMoney = 0;
                          this.form.purchaseOrderDetailList.forEach(val => {
                            console.log(val.goodsId)
                            if (val.goodsId == value) {
                              var detail = res.data.data;
                              console.log(detail.basicUnit)
                              val.basicUnit = detail.basicUnit;

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
                    label: "基本单位",
                    prop: "basicUnit",
                    editDisplay: false,
                    disabled: true,
                    type:'select',
                    props: {
                      label: 'dictValue',
                      value: 'dictKey'
                    },
                    dicUrl: "/api/blade-system/dict-biz/dictionary?code=goods_unit",
                  },
                  {
                    label: '商品资质',
                    prop: "unit",
                    type:'input',
                    placeholder: " ",
                    formslot:true,
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
        data: [],
        commoditydata:[],
        commoditydataoption : {
          addBtn: false,
          menu:false,
          align:'center',
          calcHeight: 30,
          dialogWidth: '80%',
          column: [

            {
              label: "公司名称",
              prop: "companyId",
              props: {
                label: 'supplierName',
                value: 'id'
              },
              dicUrl: '/api/quality/information/dropDownsss?name={{key}}',
            },
            {
              label: "通用名",
              prop: "commonName",
              tip: '通用名',
            },
            {
              label: "商品名",
              prop: "tradeName",
            },
            {
              label: "基本单位",
              prop: "basicUnit",
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=goods_unit",
            },
            {
              label: "产地",
              prop: "placeOfOrigin"
            },
            {
              label: "生产厂家",
              prop: "manufacturer"
            },

            {
              label: "规格(型号)",
              prop: "specifications"
            },
            {
              label: "最小销售包装规格",
              prop: "minimumSalesSpecification",
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              required: true,
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=package_size",
            },
            {
              label: "进项税",
              prop: "inputTax",
              type: 'number',
            },
            {
              label: "销项税",
              prop: "outputTax",
              type: 'number',
            },
            {
              label: "剂型",
              prop: "dosageForm",
              type: 'tree',
              rules: [{
                required: true,
                message: "请选择剂型",
                trigger: "blur",
              }],
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=dosage_form",
            },
            {
              label: "产品分类",
              prop: "productClassification",
              props: {
                label: 'title',
                value: 'id'
              },
              dicUrl: "/api/erp-wms/goods-type/tree",
            },

            {
              label: "存储期限",
              prop: "storageLife",
            },
            {
              label: "存储期限类型",
              prop: "storagePeriodType",
            },
            {
              label: "特管药品",
              prop: "specialDrugs",
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=special_drug",
            },
            {
              label: "特殊药品",
              prop: "specialDrug",
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=special_drugs",
            },

            {
              label: "存储条件",
              prop: "storageConditions",
            },
            {
              label: "税收分类",
              prop: "taxClassification",
            },
            {
              label: "是否可拆零",
              prop: "scattered",
              type: 'radio',
              value: 0,
              dicData: [{
                label: '是',
                value: 0
              }, {
                label: '否',
                value: 1,
              }]
            },
            {
              label: "OTC标志",
              prop: "sign",
              type: 'radio',
              value: '1',
              dicData: [{
                label: '有',
                value: '1'
              }, {
                label: '无',
                value: '2',
              }]
            },
            {
              label: 'OTC标志',
              prop: 'signTow',
              display: true,
              type: 'select',
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=otc_sign",
            },
            {
              label: '国产/进口标示',
              prop: 'domesticImportIndication',
              type: 'radio',
              labelWidth: 110,
              // viewDisplay: true,   true是可已查看
              value: '1',
              dicData: [{
                label: '国产',
                value: '1'
              }, {
                label: '进口',
                value: '2'
              }]
            },
            {
              label: "批准文号",
              prop: "approvalNumber",
              display: true,
              rules: [],
            },
            {
              label: "进口注册证",
              labelWidth: 110,
              prop: "importRegistrationCertificate",
              rules: [],
            },
            {
              label: "分包装企业",
              prop: "subPackagingEnterprises",
              labelWidth: 110,
              rules: [],
            },
            {
              label: "分包装批准文号",
              labelWidth: 130,
              prop: "approvalNumberOfSubPackage",
              rules: [],
            },
          ],
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
          addBtn: this.vaildData(this.permission.financing_add, false),
          viewBtn: this.vaildData(this.permission.financing_view, false),
          delBtn: this.vaildData(this.permission.financing_delete, false),
          editBtn: this.vaildData(this.permission.financing_edit, false)
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
      updateFinancingNew() {
        if (this.selectionList.length >1 ){
          return this.$message.error("选中一行数据");
        }
        if (this.selectionList[0].status != 4 && this.selectionList[0].status !=105){
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
            status = 5;
          })
          .catch(() => {
            status = 104;
          }).finally(() => {
          updateFinancing(id, status).then(res => {
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
        if(this.status1 === 104 && this.obj0Reason.rejectText === '' ){
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
