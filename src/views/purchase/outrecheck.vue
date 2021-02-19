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
          <el-button type="button"
                     size="small"
                     v-if="permission.outrechek_approval"
                     @click="updateRevocation()">审 批
          </el-button>

       <el-button
       size="small"
       type="text">
         <el-switch
         style="display: block"
         v-model="value1"
         active-color="#13ce66"
         inactive-color="#ff4949"
         active-text="启用数量同步"
         inactive-text="关闭数量同步"
         @change="changeSwitch()">
       </el-switch>
       </el-button>
      </template>
      <template slot-scope="scope" slot="inventoryToRetrieveForm">
        <el-button :size="scope.size"  @click="inventoryToRetrieve(scope.row.goodsId)">库 存 检 索</el-button>
      </template>

      <template slot-scope="scope" slot="unitForm">
        <el-button :size="scope.size"  @click="viewCommodity(scope.row.goodsId)">查 看 资 质</el-button>
      </template>
      <template slot-scope="scope" slot="menu">
       <el-button icon="el-icon-check"
                            :size="scope.size"
                            :type="scope.type"
                            v-if="scope.row.status==1 || scope.row.status==102|| scope.row.status==103"
                            @click.stop="handleEdit(scope.row,scope.index)">复核数量
      </el-button>
      </template>

     </avue-crud>

    <el-dialog
      title="审批"
      :visible.sync="dialogFormVisible"
      width="30%"
      :modal="false"
      :before-close="handleClose">
      <avue-form ref="form" v-model="obj0" :option="option0">
      </avue-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateStatusNew(101)">驳 回</el-button>
        <el-button @click="updateStatusNew(104)">撤 销</el-button>
        <el-button type="primary" @click="updateStatusNew(2)">同 意</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="商品资质"
      :append-to-body="true"
      :visible.sync="commoditydialogVisible"
       width="50%"
      :modal="false"
      :before-close="handleClose"
      :close-on-click-modal="false"
      v-dialogDrag>
      <avue-crud v-model="form" :data="commoditydata" :option="commoditydataoption"  >
      </avue-crud>
    </el-dialog>

    <el-dialog
      title="库存检索"
      :append-to-body="true"
      :visible.sync="dialogVisible"
       width="50%"
      :modal="false"
      :before-close="handleClose"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <avue-crud v-model="form" :data="inventoryToRetrievedata" :option="inventoryToRetrievedataoption"  >
      </avue-crud>
    </el-dialog>



  </basic-container>

</template>
<script>
  import {getList, add, getDetail,update, remove, updateStatus,inventoryToRetrieve,updaterejectText} from "@/api/purchase/outputorder";
  import {getGoodsDetail} from "@/api/warehouse/goods";
  import {mapGetters} from "vuex";
  import {viewCommodity} from "@/api/purchase/purchaseorder";
  import '@/views/purchase/dialogdrag.ts'
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
        value1: true,
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
        revocationdialogVisible: false,
        dialogVisible:false,
        commoditydialogVisible:false,
        dialogFormVisible: false,
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
          editBtn:false,
          dialogClickModal: false,
          dialogWidth: '80%',
          column: [
            {
              label: "领料出库单号",
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
              label: "类型",
              prop: "type",
              type: "select",
              disabled: true,
              sortable:true,
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=put_type",
              props: {
                label: "dictValue",
                value: "dictKey"
              }
            },
            {
              label: "状态",
              prop: "statusName",
              addDisplay:false,
              editDisplay:false,
              viewDisplay:false,
              sortable:true,
              dicUrl: "/api/blade-system/dict/dictionary?code=output_status",
              props: {
                label: "dictValue",
                value: "dictKey"
              }
            },
            {
              label:"创建时间",
              prop:"updateTime",
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
              prop: 'outputOrderDetailList',
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
                    label: '领料人',
                    prop: "pickingPerson",
                    disabled:true,
                    width: 200,

                  },
                  {
                    label: '*商品',
                    prop: "goodsId",
                    type: 'tree',
                    width: 130,
                    filterable: true,
                    remote: true,
                    display:false,
                    // disabled: true,
                    rules: [{
                      require: true,
                      message: '请选择商品',
                    }],
                    props: {
                      label: 'goodsName',
                      value: 'goodsId'
                    },
                    cascaderItem: ['batchNumber'],
                    dicMethod:'post',
                    // dicUrl:'/api/erp-wms/goods/selecListGoods',
                    dicUrl: '/api/erp-wms/repertory/dropDowns',

                  },
                  {
                    label: "批号",
                    prop: "batchNumber",
                    type:'select',
                    width:170,
                    props: {
                      label: 'batchNumber',
                      value: 'id'
                    },
                    dicMethod:'post',
                    dicUrl: '/api/erp-wms/repertory/dropDownbatchnumber?goodsId={{key}}',
                    change: ({value}) => {
                      this.form.outputOrderDetailList.forEach(vals => {
                      selectByBatchNumber(vals.goodsId,value).then(res => {
                        var detail = res.data.data;
                        detail.forEach(val =>{
                               vals.warehouseId = val.warehouseId;
                               vals.storageRegionId = val.storageRegionId;
                               vals.storageId = val.storageId;
                               vals.repertoryQuantity  = val.repertoryQuantity
                               vals.periodOfValidity  = val.periodOfValidity

                              vals.dateOfManufacture = val.dateOfManufacture
                              vals.placeOfOrigin = val.placeOfOrigin
                              vals.manufacturer = val.manufacturer
                              vals.supplierName = val.supplierName
                              vals.packageQuantity = val.packageQuantity
                              vals.specification = val.specification

                          });
                        });
                      });
                    },
                  },
                  {
                    label: "商品索引码",
                    prop: "goodsCode",
                    disabled:true,
                    width:150
                  },
                  {
                    label:'库存数量(g)',
                    prop: 'repertoryQuantity',
                    disabled: true,
                    width:100,
                  },
                  {
                    label: '出库数量(g)',
                    prop: "goodsQuantity",
                    type: "number",
                    width: 130,
                    disabled: true,
                    rules: [{
                      validator: validateQuantity,
                      trigger: 'blur'
                    }],
                    change: () => {
                      if(this.value1){
                        getGoodsDetail().then(res => {
                          this.form.sumMoney = 0;
                          this.form.outputOrderDetailList.forEach(val => {
                            var detail = res.data.data;
                            if(val.recheckGoodsQuantity ==null || val.recheckGoodsQuantity ==""){
                              val.recheckGoodsQuantity = val.goodsQuantity;
                            }
                            val.basicUnit = detail.basicUnit;
                          });
                        });
                      }

                    },
                  }, {
                    label: '复核出库数量(g)',
                    prop: "recheckGoodsQuantity",
                    type: "number",
                    width: 130,
                    rules: [{
                      validator: validateQuantity,
                      trigger: 'blur'
                    }]
                  },
                  {
                    label: '*出货仓库',
                    prop: "warehouseId",
                    type: "tree",
                    rsearch: true,
                    disabled: true,
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
                    cascaderItem: ['storageId'],
                    dicUrl: '/api/erp-wms/warehouse/tree'
                  },
                  {
                    label:'区域',
                    prop: "storageRegionId",
                    type:'tree',
                    row: true,
                    disabled: true,
                    width:150,
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
                    disabled: true,
                    width:150,
                    props: {
                      label: 'title',
                      value: 'id'
                    },
                    // cascaderItem: ['goodsId'],
                    dicUrl:'/api/erp-wms/storage/tree?warehouseId={{key}}'
                  },
                  {
                    label: "库存检索",
                    prop: "inventoryToRetrieve",
                    type:'input',
                    placeholder: " ",
                    formslot:true,
                    width: 100,
                  },
                  {
                    label: '商品资质',
                    prop: "unit",
                    type:'input',
                    placeholder: " ",
                    formslot:true,
                    width: 100,
                  },
                  {
                    label: "生产日期",
                    prop: "dateOfManufacture",
                    type:'datetime',
                    format: "yyyy-MM-dd",
                    valueFormat: "yyyy-MM-dd",
                    width:150,
                    disabled: true,
                  },
                  {
                    label: "有效期至",
                    prop: "periodOfValidity",
                    type:'datetime',
                    format: "yyyy-MM-dd",
                    valueFormat: "yyyy-MM-dd",
                    width:150,
                    disabled: true,
                  },
                  {
                    label: "产地",
                    prop: "placeOfOrigin",
                    width:150,
                    disabled: true,
                  },
                  {
                    label: "供应商",
                    prop: "supplierName",
                    width:150,
                    disabled: true,
                  },
                  {
                    label: "生产厂家",
                    prop: "manufacturer",
                    width:150,
                    disabled: true,
                  },
                  // {
                  //   label: "基本单位",
                  //   prop: "basicUnit",
                  //   editDisplay: false,
                  //   disabled: true,
                  //   width: 150,
                  //   type:'select',
                  //   props: {
                  //     label: 'dictValue',
                  //     value: 'dictKey'
                  //   },
                  //   dicUrl: "/api/blade-system/dict-biz/dictionary?code=goods_unit",
                  // },
                  {
                    label: '规格',
                    prop: "specification",
                    disabled: true,
                    placeholder: " ",
                    width: 150,
                  },
                  {
                  label: '备注',
                  prop: "remark",
                  type:"textarea"
                }],
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
        inventoryToRetrievedata:[],
        inventoryToRetrievedataoption : {
          addBtn: false,
          menu:false,
          align:'center',
          column:[
            {
              label: "仓库",
              prop: "warehouseId",
              type:'tree',
              props: {
                label: 'title',
                value: 'id'
              },
              // cascaderItem: ['storageId'],
              dicUrl:this.ERP_WMS_NAME + '/warehouse/tree'
            },
            {
              label: "储位",
              prop: "storageId",
              type:'tree',
              props: {
                label: 'name',
                value: 'id'
              },
              dicUrl:this.ERP_WMS_NAME + '/storage/dropDown'
            },
            {
              label: '批号',
              prop:'batchNumber'
            },
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
              label: "库存数量(g)",
              prop: "repertoryQuantity",
              rules: [{
                trigger: "blur"
              }]
            },
          ]
        },
        obj0: {
          rejectText: ''
        },
        option0: {
          emptyBtn: false,
          submitBtn: false,
          column: [{
            label: "驳回理由",
            prop: "rejectText",
            type: 'textarea',
            span: 24,
          }]
        },
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.outrecheck_add, false),
          viewBtn: this.vaildData(this.permission.outrecheck_view, false),
          delBtn: this.vaildData(this.permission.outrecheck_delete, false),
          editBtn: this.vaildData(this.permission.outrecheck_edit, false)
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
      },
      batchNumber1() {
        let batchNumber1 = [];
        this.selectionList.forEach(ele => {
          batchNumber1.push(ele.batchNumber);
        });
        return batchNumber1.join(",");
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
        if (["add", "edit"].includes(type)) {
          setTimeout(()=>{
            this.form.type = 'out';
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
        const {updateTime} = params;
        let values = {
          ...params,
        };
        if (updateTime) {
          values = {
            ...params,
            start_time: updateTime[0],
            end_time: updateTime[1],
          };
          values.updateTime = null;
          this.query.updateTime = null;
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
      updateStatusNew(status) {
        if (status === 101 && this.obj0.rejectText === '') {
          return this.$message.error("请输入驳回理由！");
        }
          updateStatus(this.ids, status,this.obj0.rejectText).then(res => {
            if (res.data.success) {
              this.dialogFormVisible = false;
              this.searchReset();
              this.$message.success(res.data.msg);
            } else {
              this.dialogFormVisible = false;
              this.searchReset();
              this.$message.error(res.data.msg);
            }
          })
      },
      //审批
      updateRevocation() {
        if (this.selectionList.length === 0) {
          return this.$message.error("请选择需要的商品！");
        }if (this.status1 ==2) {
          return this.$message.error("该订单已经完成无法修改！");
        }if (this.status1 ==101) {
          return this.$message.error("该订单已经驳回无法修改！");
        }if (this.status1 ==104) {
          return this.$message.error("该订单已被撤销无法修改！");
        }
        this.dialogFormVisible = true;
      },

      //查看资质
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

      //库存检索
      inventoryToRetrieve(goodsId){
        this.dialogVisible = true;
        inventoryToRetrieve(goodsId).then(res=>{
          if (res.data.success) {
            this.inventoryToRetrievedata = res.data.data;
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      handleEdit(row, index) {
        this.$refs.crud.rowEdit(row, index);
      },
    }
  };
</script>

<style>
</style>
