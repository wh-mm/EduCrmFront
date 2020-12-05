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
<!--      <template slot="menuLeft">-->
<!--          <el-button type="button"-->
<!--                     size="small"-->
<!--                     v-if="permission.output_approval"-->
<!--                     @click="updateStatusNew()">审 批-->
<!--          </el-button>-->
<!--      </template>-->
      <template slot-scope="scope" slot="menu">
        <el-button :size="scope.size"  v-if="scope.row.status==101" :type="text" @click="viewReason(scope.row.id)"> 查看驳回理由</el-button>
        <el-button type="primary"
                   icon="el-icon-check"
                   size="small"
                   v-if="scope.row.status==101"
                   plain
                   @click.stop="handleEdit(scope.row,scope.index)">修改采购单</el-button>
      </template>


      <template slot-scope="scope" slot="inventoryToRetrieveForm">
        <el-button :size="scope.size"  @click="inventoryToRetrieve(scope.row.warehouseId)">库 存 检 索</el-button>
      </template>

      <template slot-scope="scope" slot="unitForm">
        <el-button :size="scope.size"  @click="viewCommodity(scope.row.goodsId)">查 看 资 质</el-button>

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
      v-dialogDrag
    >
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

  </basic-container>

</template>
<script>
  import {getList, add, getDetail,update, remove, updateStatus,inventoryToRetrieves,viewReason} from "@/api/purchase/outputorder";
  import {getGoodsDetail} from "@/api/warehouse/goods";
  import {mapGetters} from "vuex";
  import {viewCommodity} from "@/api/purchase/purchaseorder";
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
        reasonialogVisible:false,
        selectionList: [],
        option: {
          height:'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          editBtnText:'出库复核',
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
              label: "出库单号",
              prop: "orderNumber",
              editDisplay: false,
              addDisplay: false,
              search:true,
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
              dicUrl: "/api/blade-system/dict/dictionary?code=purchases_status",
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
              format: "yyyy-MM-dd hh:mm:ss",
              valueFormat: "yyyy-MM-dd hh:mm:ss",
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
                    label: '*出货仓库',
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
                    cascaderItem: ['goodsId'],
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
                    label: '*商品',
                    prop: "goodsId",
                    type: 'tree',
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
                      value: 'goodsId'
                    },
                    dicMethod:'post',
                    dicUrl: '/api/erp-wms/repertory/dropDowns?storageId={{key}}',
                    // dicUrl: '/api/erp-wms/repertory/dropDowns?storageId={{key}}',
                    change: ({value}) => {
                      if (value) {
                        getGoodsDetail(value).then(res => {
                          this.form.sumMoney = 0;
                          this.form.outputOrderDetailList.forEach(val => {
                            console.log(res.goodsSpecification)
                            if (val.goodsId == value) {
                              var detail = res.data.data;
                              val.basicUnit = detail.basicUnit;
                              val.specification = detail.goodsSpecification;


                            }
                            this.form.sumMoney = (this.form.sumMoney * 1 + val.money * val.goodsQuantity).toFixed(2);
                          });
                        });
                      }
                    },
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
                    label: '规格',
                    prop: "specification",
                    disabled: true,
                    placeholder: " ",
                    width: 100,
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
              prop: "repertoryQuantity",
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
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.outputorder_add, false),
          viewBtn: this.vaildData(this.permission.outputorder_view, false),
          delBtn: this.vaildData(this.permission.outputorder_delete, false),
          editBtn: this.vaildData(this.permission.outputorder_edit, false)
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
      inventoryToRetrieve(warehouseId){
        this.dialogVisible = true;
        inventoryToRetrieves(warehouseId).then(res=>{
          if (res.data.success) {
            this.inventoryToRetrievedata = res.data.data;
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
    }
  };
</script>

<style>
</style>
