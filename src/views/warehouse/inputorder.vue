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
        <el-button type="success"
                   size="small"
                   plain
                   icon="el-icon-upload2"
                   v-if="permission.repertory_import"
                   @click="handleImport">导入
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button :size="scope.size" v-if="scope.row.status===101" :type="text" @click="viewReason(scope.row.id)"> 查看驳回理由</el-button>
        <el-button :size="scope.size" icon="el-icon-printer" :type="scope.type" @click="print(scope.row)"> 打印入库单</el-button>
      </template>
      <template slot-scope="{row}" slot="totalPriceForm">
        {{(row.price*row.goodsQuantity)}}
      </template>
     </avue-crud>

    <el-dialog title="入库数据导入"
               append-to-body
               :visible.sync="excelBox"
               width="555px">
      <avue-form :option="excelOption" v-model="excelForm" :upload-after="uploadAfter">
        <template slot="excelTemplate">
          <el-button type="primary" @click="handleTemplate">
            点击下载<i class="el-icon-download el-icon--right"></i>
          </el-button>
        </template>
      </avue-form>
    </el-dialog>

    <el-dialog
      title="驳回理由"
      :append-to-body="true"
      :visible.sync="reasonialogVisible"
      width="50%"
      :modal="false"
      :before-close="handleClose"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <avue-crud v-model="form" :data="reasondata" :option="reasondataoption"  >
      </avue-crud>
    </el-dialog>

    <el-dialog
      title="打印入库单"
      :append-to-body="true"
      :visible.sync="printDialogVisible"
      width="800px"
      :modal="false"
      :before-close="handleClose"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <el-button type="primary"
                 size="small"
                 icon="el-icon-plus"
                 plain
                 v-print="'#print'">打印入库单
      </el-button>
      <el-form :model="form1">
        <div id="print" ref="print">
          <!-- 隐藏打印区域，避免用户看到 -->
          <div id="print1" ref="print11">
            <div style="padding: 10px;">
              <el-row>
                <el-col :span="24">
                  <div class="grid-content bg-purple-dark"
                       style="font-size: 24px;text-align: center;margin-bottom: 15px;">
                    入库单
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <p>入库单号 : <span style="margin-left: 10px;">{{printData.orderNumber}}</span></p>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple-light">
                    <p>部门 : <span style="margin-left: 10px;">{{printData.detailData.deptName}}</span></p>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple-light">
                    <p>入库日期 : <span style="margin-left: 10px;">{{date =new Date()|formatDate}}</span></p>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <p>仓库 : <span style="margin-left: 10px;">{{printData.detailData.warehouseName}}</span></p>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <p>原因 : <span style="margin-left: 10px;"></span></p>
                  </div>
                </el-col>

              </el-row>
              <el-table
                :data="printData.tableData"
                border :fit="false"
                style="width: 729px;margin-top: 15px;margin-right: 0px;">
                <el-table-column
                  type="index"
                  label="序号"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="goodsCode"
                  label="品号"
                  width="65">
                </el-table-column>
                <el-table-column
                  prop="goodsName"
                  label="品名"
                  width="95">
                </el-table-column>
                <el-table-column
                  prop="batchNumber"
                  label="批号"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="specificationName"
                  label="规格"
                  width="57">
                </el-table-column>
                <el-table-column
                  prop="dateOfManufacture"
                  label="生产日期"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="manufacturer"
                  label="生产厂家"
                  width="90">
                </el-table-column>
                <el-table-column
                  prop="placeOfOrigin"
                  label="供应商"
                  width="60">
                </el-table-column>
                <el-table-column
                  prop="placeOfOrigin"
                  label="产地"
                  width="60">
                </el-table-column>
                <el-table-column
                  prop="goodsQuantity"
                  label="数量(g)"
                  width="90">
                </el-table-column>
              </el-table>
              <el-row style="margin-top: 20px;">
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple-light">
                    <p><span style="margin-left: 10px;"></span></p>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="grid-content bg-purple">
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="grid-content bg-purple-light">
                    <p>入库人 : <span style="margin-left: 10px;"></span></p>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-form>
    </el-dialog>


  </basic-container>

</template>
<script>
  import {getLists, add, getDetail,update, remove, updateStatus,viewReason,
  printInputorderDetail} from "@/api/purchase/inputorder";
  import {mapGetters} from "vuex";
  import {viewCommodity} from "@/api/purchase/purchaseorder";
  import '@/views/purchase/dialogdrag.ts'
  import {getGoodsDetail} from "@/api/warehouse/goods";
  import {ERP_WMS_NAME} from '@/const/YueConst';
  import {getToken} from "@/util/auth";

  export default {
    filters: {
      rounding(value) {
        return value.toFixed(2)
      },
      formatDate: function (value) {
        let date = new Date(value);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? ('0' + MM) : MM;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let m = date.getMinutes();
        m = m < 10 ? ('0' + m) : m;
        let s = date.getSeconds();
        s = s < 10 ? ('0' + s) : s;
        return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
      }
    },
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
        excelBox: false,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        obj:{},
        title: '' ,
        commoditydialogVisible:false,
        reasonialogVisible:false,
        printDialogVisible:false,
        printData: {
          orderNumber: '',
          detailData:[],
          tableData: [],
        },
        selectionList: [],
        option: {
          height:'auto',
          calcHeight: 30,
          tip: false,
          printBtn:true,
          excelBtn:true,
          searchShow: true,
          editBtnText:'入库复核',
          searchMenuSpan: 6,
          border: true,
          index: true,
          viewBtn: true,
          editBtn: false,
          selection: true,
          dialogClickModal: false,
          dialogWidth: '80%',
          column: [
            {
              label: "入库单号",
              prop: "orderNumber",
              editDisplay: false,
              addDisplay: false,
              search:true,
              sortable:true,
              rules: [{
                required: true,
                trigger: "blur"
              }]
            },
            {
              label:"入库时间",
              prop:"createTime",
              dateDefault: true,
              addDisplay: false,
              editDisplay: false,
              viewDisplay: false,
              type: "datetime",
              searchSpan:12,
              searchRange:true,
              search:true,
              sortable:true,
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
            },
            {
              label: '商品列表',
              prop: 'inputOrderDetailList',
              type: 'dynamic',
              span:24,
              children: {
                align: 'center',
                headerAlign: 'center',
                 rowAdd:(done)=>{
                   done({
                    goodsQuantity: 1,
                    discountPercentage: 0,
                   });
                 },
                 rowDel:(row,done)=>{
                     done();
                 },
                column: [
                  {
                    label: "仓库",
                    prop: "warehouseId",
                    type:'tree',
                    width: 200,
                    props: {
                      label: 'title',
                      value: 'value'
                    },
                    cascaderItem: ['storageRegionId'],
                    rules: [{
                      required: true,
                      message: "请输入仓库",
                      trigger: "blur"
                    }],
                    dicUrl:'/api/erp-wms/warehouse/tree'
                  },
                  {
                    label: "区域",
                    prop: "storageRegionId",
                    type:'tree',
                    width: 200,
                    props: {
                      label: 'title',
                      value: 'id'
                    },
                    cascaderItem: ['storageId'],
                    dicUrl:'/api/erp-wms/storage/queryRegionTree?warehouseId={{key}}'
                  },
                  {
                    label: "储位",
                    prop: "storageId",
                    type:'tree',
                    width: 200,
                    props: {
                      label: 'title',
                      value: 'id'
                    },
                    dicUrl:'/api/erp-wms/storage/tree?storageRegionId={{key}}'
                  },
                  {
                    label: '商品',
                    prop: "goodsId",
                    type: 'select',
                    width: 200,
                    filterable: true,
                    remote:true,
                    display:false,
                    rules: [{
                      required: true,
                      message: "请输入商品",
                      trigger: "blur"
                    }],
                    props: {
                      label: 'goodsName',
                      value: 'id'
                    },
                    dicUrl:'/api/erp-wms/goods/selectListGoodsByName?name={{key}}',
                    change: (value) => {

                      setTimeout(()=>{
                        getGoodsDetail(value.row.goodsId).then(res => {
                          var selectValue = res.data.data;
                          this.form.inputOrderDetailList.forEach(vals => {
                            if(vals.goodsId == value){
                              vals.goodsCode = selectValue.goodsCode
                              vals.salePrice = selectValue.salePrice
                            }
                          });
                        });
                      },1000);
                    },

                  },
                  {
                    label: "批号",
                    prop: "batchNumber",
                    width: 200,
                    rules: [{
                      required: true,
                      message: "请输入批号",
                      trigger: "blur"
                    }],
                  },
                  {
                    label: "商品索引码",
                    prop: "goodsCode",
                    disabled:true,
                    width:150
                  },
                  {
                    label: "商品单价",
                    prop: "price",
                    width:150,
                    change: () => {
                      this.form.sumMoney = 0;
                      this.form.inputOrderDetailList.forEach(val => {
                        if (val.goodsId != "") {
                          this.form.sumMoney = (this.form.sumMoney * 1 + val.price * val.goodsQuantity).toFixed(2);
                        }
                      });
                    },
                  },
                  {
                    label: '*入库数量(g)',
                    prop: "goodsQuantity",
                    type: "number",
                    width: 140,
                    rules: [{
                      required: true,
                      validator: validateQuantity,
                    }],
                    change: () => {
                      this.form.sumMoney = 0;
                      this.form.inputOrderDetailList.forEach(val => {
                        if (val.goodsId != "") {
                          this.form.sumMoney = (this.form.sumMoney * 1 + val.price * val.goodsQuantity).toFixed(2);
                        }
                      });
                    },
                  },
                  {
                    label: "商品总价",
                    prop: "totalPrice",
                    formslot: true,

                  },
                  {
                    label: '供应商',
                    prop: "supplierName",
                    placeholder: " ",
                    width: 140,
                    type:'select',
                    props:{
                      label:'supplierName',
                      value:'id'
                    },
                    dicUrl: '/api/quality/information/dropDownsss'
                  },
                  {
                    label: '规格',
                    prop: "specification",
                    placeholder: " ",
                    width: 140,
                    type: "select",
                    props: {
                      label: 'dictValue',
                      value: 'dictKey'
                    },
                    dicUrl: "/api/blade-system/dict-biz/dictionary?code=specifications"
                  },
                  {
                    label: "生产日期",
                    prop: "dateOfManufacture",
                    type:'date',
                    format: "yyyy-MM-dd",
                    valueFormat: "yyyy-MM-dd",
                    width: 200,
                  },
                  {
                    label: "有效期至",
                    prop: "periodOfValidity",
                    type:'date',
                    format: "yyyy-MM-dd",
                    valueFormat: "yyyy-MM-dd",
                    width: 200,
                  },
                  {
                    label: "生产厂家",
                    prop: "manufacturer",
                    width: 200,
                    type:'select',
                    allowCreate:true,
                    filterable:true,
                    props:{
                      label:'manufacturer',
                      value:'manufacturer',
                    },
                    dicUrl: ERP_WMS_NAME + '/repertory/selectManufacturer',
                  },
                  {
                    label: "产地",
                    prop: "placeOfOrigin",
                    width: 200,
                    type:'select',
                    allowCreate:true,
                    filterable:true,
                    props:{
                      label:'placeOfOrigin',
                      value:'placeOfOrigin',
                    },
                    dicUrl: ERP_WMS_NAME + '/repertory/selectPlaceOfOrigin',
                  },
                  {
                    label: "包装规格",
                    prop: "packageSpecification",
                    width: 140,
                  },
                  {
                    label: "包装数量",
                    prop: "packageQuantity",
                    width: 140,
                  },

                  {
                    label: '备注',
                    prop: "remark",
                    type:"textarea",
                    width: 200,
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
        inventoryToRetrievedataoption : {
          addBtn: false,
          menu:false,
          align:'center',
          column:[
            {
              label:'商品名称',
              prop:'goodsId',
              props: {
                label: 'goodsName',
                value: 'id'
              },
              dicMethod:"post",
              dicUrl: 'api/erp-wms/goods/selecListGoods',
            },
            {
              label: "库存数量",
              prop: "sumrepertoryquantity",
              rules: [{
                trigger: "blur"
              }]
            },

          ]
        },
        reasondata:[],
        reasondataoption : {
          addBtn: false,
          menu:false,
          align:'center',
          column:[
            {
              label:'驳回理由',
              prop:'rejectText',
              type: "textarea",

            }
          ]
        },
        excelForm: {},
        excelOption: {
          submitBtn: false,
          emptyBtn: false,
          column: [
            {
              label: '模板上传',
              prop: 'excelFile',
              type: 'upload',
              drag: true,
              loadText: '模板上传中，请稍等',
              span: 24,
              propsHttp: {
                res: 'data'
              },
              tip: '请上传 .xls,.xlsx 标准格式文件',
              action: "/api/purchase/input-order/import"
            },
            {
              label: '模板下载',
              prop: 'excelTemplate',
              formslot: true,
              span: 24,
            }
          ]
        },

      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.outputorder_add, false),
          viewBtn: this.vaildData(this.permission.outputorder_view, false),
          delBtn: this.vaildData(this.permission.outputorder_delete, false),
          editBtn: this.vaildData(this.permission.outputorder_edit, false),
          printBtn: this.vaildData(this.permission.inputorder_print, false),
          excelBtn: this.vaildData(this.permission.inputorder_excel,false),
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
        let goodslist =row.inputOrderDetailList;
        if(goodslist.length>1){
          for (let i = 0; i < goodslist.length; i++) {
            for (let j = 0; j < i; j++) {
            if(goodslist[i].goodsId==goodslist[j].goodsId){
              this.onLoad(this.page);
              this.$message.error("商品不可以重复");
              loading();
              return;
            }
          }
        }
        }

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
          //商品不可重
          let goodslist =row.inputOrderDetailList;
          for (let i = 0; i < goodslist.length; i++) {
            for (let j = 0; j < goodslist.length; j++) {

              if(goodslist[i].goodsId==goodslist[j].goodsId){
                this.onLoad(this.page);
                this.$message.warning("商品不可以重复");
                loading();
                return
              }
            }
          }



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
        if (["add", "edit"].includes(type)) {
          setTimeout(()=>{
            this.form.type = 'in';
          },10);
        }
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
        getLists(page.currentPage, page.pageSize, Object.assign(values, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      },
      updateStatus(id){
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
          }).finally(()=>{
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
      updateStatusNew() {
        if (this.selectionList.length >1 ){
          return this.$message.error("选中一行数据");
        }
        // if (this.selectionList[0].status != 1){
        //   return this.$message.error("该任务已经完成");
        // }
        var id= this.selectionList[0].id;
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
            status = 101;
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
      viewReason(id){
        this.reasonialogVisible = true;
        viewReason(id).then(res=>{
          if (res.data.success) {
            this.reasondata = res.data.data;
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      handleEdit (row, index) {
        this.$refs.crud.rowEdit(row, index);
      },
      print(row){
        this.printDialogVisible = true;
        this.printData.orderNumber = row.orderNumber;
        printInputorderDetail(row.id).then( res => {
          this.printData.tableData = res.data.data;
          this.printData.tableData.forEach(detail=>{
             this.printData.detailData = detail;
          })
        })
      },
      handleImport() {
        this.excelBox = true;
      },
      handleTemplate() {
        window.open( `/api/purchase/input-order/export-template?${this.website.tokenHeader}=${getToken()}`);
      },
    }
  };
</script>

<style>
  p {
    margin: 0px;
    font-size: 14px;
  }

  #print1 td, #print1 th {
    padding: 2px;
  }

  #print1, #print1 .el-table th, #print1 .el-table td {
    color: #000000;
    font-size: 12px;
  }

  #print1 .el-table tr {
    border-left: 1px solid #000;
  }

  #print1 .el-table td {
    border-top: 1px solid #000;
    border-right: 1px solid #000;
  }

  #print1 .el-table th {
    border-top: 1px solid #000;
    border-left: 1px solid #000;
  }

  #print1 .el-table--border {
    border-bottom: 1px solid #000;
    border-right: 1px solid #000;
  }

  #print1 .el-table__body-wrapper {
    border-left: 1px solid #000;
  }
</style>
