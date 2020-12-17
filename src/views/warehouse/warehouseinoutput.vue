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
        <el-button type="primary"
                   size="small"
                   icon="el-icon-plus"
                   v-if="permission.warehouseinoutput_in"
                   plain
                   @click="dialogVisible = true,title = '入 库',obj.type = 'in' ">入 库
        </el-button>
        <el-button type="primary"
                   size="small"
                   icon="el-icon-plus"
                   v-if="permission.warehouseinoutput_out"
                   plain
                   @click="outdialogVisible = true,title = '出 库',obj.type = 'out' ">出 库
        </el-button>

<!--        <el-button type="primary"-->
<!--                   size="small"-->
<!--                   icon="el-icon-plus"-->
<!--                   plain-->
<!--                   @click="outputorderdialogVisible = true,obj.type = 'out' ">出 库 单 出 库-->
<!--        </el-button>-->
      </template>
      <!--<template slot-scope="scope" slot="menu">
        <el-button :size="scope.size" :type="type" @click="viewCommodity(scope.row.goodsId)">查看资质</el-button>
      </template>-->


    </avue-crud>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="40%"
      :modal="false"
      :before-close="handleClose">
      <avue-form ref="form" v-model="obj" :option="optionForm" @submit="submit">
      </avue-form>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="outdialogVisible"
      width="40%"
      :modal="false"
      :before-close="handleClose">
      <avue-form ref="form" v-model="obj" :option="outoptionForm" @submit="submit">
      </avue-form>
    </el-dialog>

    <el-dialog
      title="商品资质"
      :append-to-body="true"
      :visible.sync="commoditydialogVisible"
      width="50%"
      :modal="false"
      :before-close="handleClose"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <avue-crud v-model="form" :data="commoditydata" :option="commoditydataoption"  >
      </avue-crud>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {getList,add,updateStatus} from "@/api/warehouse/warehouseinoutput";
  import {mapGetters} from "vuex";
  import {viewCommodity} from "@/api/purchase/purchaseorder";
  import {selectByBatchNumber} from "@/api/warehouse/repertory";

  export default {
    data() {
      var validateNumber = (rule, value, callback)=>{
        console.log();
        if (value === '') {
          callback(new Error('请输入数量'));
        } else if(value < 1){
          callback(new Error('数量不能少于1'));
        } else if(value > this.repertoryQuantity && this.repertoryQuantity !== 0 && this.obj.type === 'out') {
          callback(new Error('库存数量不足'));
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
        repertoryQuantity:0,
        dialogVisible:false,
        outdialogVisible:false,
        commoditydialogVisible:false,
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
          menu:false,
          dialogClickModal: false,
          column: [
            {
              label: "仓库",
              prop: "warehouseId",
              type:"select",
              props: {
                label: 'title',
                value: 'id'
              },
              cascaderItem: ['storageId'],
             search:true,
             dicUrl:'/api/erp-wms/warehouse/tree'
            },
            {
              label: "储位",
              prop: "storageId",
              type:'tree',
              row: true,
              span: 24,
              rules: [{
                required: true,
                message: "请输入仓库",
                trigger: "blur"
              }],
              props: {
                label: 'title',
                value: 'id'
              },
              dicUrl:'/api/erp-wms/storage/tree?warehouseId={{key}}'
            },
            {
              label: "商品",
              prop: "goodsId",
              type:"select",
              props: {
                required: true,
                label: 'goodsName',
                value: 'id'
              },
              search:true,
              dicMethod:'post',
              dicUrl:'/api/erp-wms/goods/selecListGoods'
            },
            {
              label: "数量(g)",
              prop: "quantity",
              type: "number",
            },
            {
              label: "批号",
              prop: "batchNumber",
              required: true,
              search:true,
            },
            {
              label: "生产日期",
              prop: "dateOfManufacture",
              type:'datetime',
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
              required: true,
            },
            {
              label: "有效期至",
              prop: "periodOfValidity",
              type:'datetime',
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
              required: true,
            },
            {
              label: "生产厂家",
              prop: "manufacturer",
              required: true,
            },
            {
              label: "产地",
              prop: "placeOfOrigin",
              required: true,
            },
            {
              label: "类型",
              prop: "type",
              type: "select",
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=put_type",
              search:true,
              props: {
                label: "dictValue",
                value: "dictKey"
              }
            }, {
              label:"创建时间",
              prop:"createTime",
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
              label: "备注",
              prop: "remark",
            }
          ]
        },
        data: [],
        optionForm : {
          column: [
            {
              label: "商品",
              prop: "goodsId",
              type:'tree',
              row: true,
              span: 24,
              rules:[{
                required: true,
                message: "请输入商品",
                trigger: "blur",
              }],
              props: {
                label: 'goodsName',
                value: 'id'
              },
              dicMethod:'post',
              dicUrl:'/api/erp-wms/goods/selecListGoods'
            },
            {
              label: "批号",
              prop: "batchNumber",
              span: 24,
              rules:[{
                required: true,
              }]
            },
            {
              label: "生产日期",
              prop: "dateOfManufacture",
              type:'datetime',
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
              rules:[{
                required: true,
              }]
            },
            {
              label: "有效期至",
              prop: "periodOfValidity",
              type:'datetime',
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
              rules:[{
                required: true,
              }]
            },
            {
              label: "生产厂家",
              prop: "manufacturer",
              rules:[{
                required: true,
              }]
            },
            {
              label: "产地",
              prop: "placeOfOrigin",
              rules:[{
                required: true,
              }]
            },
            {
              label: "仓库",
              prop: "warehouseId",
              type:'tree',
              row: true,
              span: 24,
              props: {
                label: 'title',
                value: 'value'
              },
              cascaderItem: ['storageId'],
              rules: [{
                required: true,
                message: "请输入仓库",
                trigger: "blur"
              }],
             dicUrl:'/api/erp-wms/warehouse/tree'
            },
            {
              label: "储位",
              prop: "storageId",
              type:'tree',
              row: true,
              span: 24,
              rules: [{
                required: true,
                message: "请输入仓库",
                trigger: "blur"
              }],
              props: {
                label: 'title',
                value: 'id'
              },
              dicUrl:'/api/erp-wms/storage/tree?warehouseId={{key}}'
            },

            {
              label: "数量(g)",
              prop: "quantity",
              type: "number",
              precision: 0,
              value: 1,
              row: true,
              span: 24,
              rules: [{
                required: true,
                validator: validateNumber,
                trigger: 'blur',
              }]
            },
            {
              label: "类型",
              prop: "type",
              type: "select",
              row: true,
              span: 24,
              disabled:true,
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=put_type",
              props: {
                label: "dictValue",
                value: "dictKey"
              }
            },
            {
              label: "备注",
              prop: "remark",
              type: "textarea",
              span: 24,
            }
          ]
        },
        outoptionForm : {
          column: [
            {
              label: "商品",
              prop: "goodsId",
              type:'tree',
              row: true,
              span: 24,
              rules:[{
                message: "请输入商品",
                trigger: "blur",
              }],
              props: {
                label: 'goodsName',
                value: 'id'
              },
              cascaderItem: ['batchNumber'],
              dicMethod:'post',
              dicUrl:'/api/erp-wms/goods/selecListGoods'
            },
            {
              label: "批号",
              prop: "batchNumber",
              type:'select',
              span: 24,
              props: {
                label: 'batchNumber',
                value: 'batchNumber'
              },
              dicMethod:'post',
              dicUrl: '/api/erp-wms/repertory/dropDownbatchnumber?goodsId={{key}}',

              change: ({value}) => {
                  selectByBatchNumber(value).then(res => {
                      var detail = res.data.data;
                      console.log(detail)
                      detail.forEach(val =>{
                        if (value === val.batchNumber) {
                            this.obj.warehouseId = val.warehouseId;
                            this.obj.storageId = val.storageId;
                            this.repertoryQuantity = val.repertoryQuantity;
                        }
                      });
                  });
                },
            },
            {
              label: "仓库",
              prop: "warehouseId",
              row: true,
              type: 'tree',
              span: 24,
              props: {
                label: 'title',
                value: 'value'
              },
              cascaderItem: ['storageId'],
              rules: [{
                required: true,
                message: "请输入仓库",
                trigger: "blur"
              }],
             dicUrl:'/api/erp-wms/warehouse/tree'
            },
            {
              label: "储位",
              prop: "storageId",
              type: 'tree',
              row: true,
              span: 24,
              rules: [{
                required: true,
                message: "请输入仓库",
                trigger: "blur"
              }],
              props: {
                label: 'title',
                value: 'id'
              },
              dicUrl:'/api/erp-wms/storage/tree?warehouseId={{key}}'
            },

            {
              label: "数量(g)",
              prop: "quantity",
              type: "number",
              precision: 0,
              value: 1,
              row: true,
              span: 24,
              rules: [{
                validator: validateNumber,
                trigger: 'blur',
              }]
            },
            {
              label: "类型",
              prop: "type",
              type: "select",
              row: true,
              span: 24,
              disabled:true,
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=put_type",
              props: {
                label: "dictValue",
                value: "dictKey"
              }
            },
            {
              label: "备注",
              prop: "remark",
              type: "textarea",
              span: 24,
            }
          ]
        },
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
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: false,
          viewBtn: this.vaildData(this.permission.warehouseinoutput_view, false),
          delBtn: false,
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
      updateStatus(id){
        let status;
        this.$confirm("请确认是否审批?", {
          confirmButtonText: "确认",
          cancelButtonText: "驳回",
          type: "warning"
        })
          .then(() => {
            console.log(status)
            status = 2;
          })
          .catch(() => {
            console.log(3);
            status = 3;
          }).finally(()=>{
          console.log(status);
          updateStatus(id,status).then(res => {
            if(res.data.success){
              this.$message.success(res.data.msg);
            }else{
              this.$message.error(res.data.msg);
            }
            this.refreshChange();
            this.onLoad(this.page);
          })
        });
      },
      viewCommodity(goodsId){
        this.commoditydialogVisible = true;
        viewCommodity(goodsId).then(res=>{
          if (res.data.success) {
            this.commoditydata = res.data.data;
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
    }
  };


</script>

<style>
</style>
