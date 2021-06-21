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
                   v-if="permission.acceptancerecord_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="{type,size,row}" slot="menu">
        <el-button icon="el-icon-plus" :size="size" option="option0" :type="text" @click="viewMaterialsDelivery(row.purchaseId)">查看收货记录</el-button>
        <el-button :size="size" :type="text"  @click="viewCommodity(row.goodsId)">查看资质</el-button>
      </template>
    </avue-crud>
    <el-dialog
      title="收货记录"
      :visible.sync="dialogVisible"
      width="35%"
      :modal="false"
      :before-close="handleClose">
      <avue-crud v-model="form" :data="datas" :option="option0" @click="viewMaterialsDelivery">
      </avue-crud>
    </el-dialog>

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

  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove,viewMaterialsDelivery} from "@/api/acceptance/acceptancerecord";
  import {mapGetters} from "vuex";
  import {viewCommodity} from "@/api/purchase/purchaseorder";
  import '@/views/purchase/dialogdrag.ts'
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
            {
              label: "商品",
              prop: "goodsName",
              rules: [{
                required: true,
                message: "请输入商品id",
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
              label: "验收员",
              prop: "acceptanceName",
              rules: [{
                required: true,
                message: "请输入验收员",
                trigger: "blur"
              }]
            },
            {
              label: "验收状态",
              prop: "statusName",
              rules: [{
                required: true,
                message: "请输入验收状态",
                trigger: "blur"
              }]
            },
            {
              label: "商品类型",
              prop: "typeOfGoods",
              hide:true,
              rules: [{
                required: true,
                message: "请输入验收状态",
                trigger: "blur"
              }]
            },
            {
              label: "批号",
              prop: "batchNumber",
              rules: [{
                required: true,
                message: "请输入验收状态",
                trigger: "blur"
              }]
            },
            {
              label: "生产日期",
              prop: "dateInProduced",
              rules: [{
                required: true,
                message: "请输入验收状态",
                trigger: "blur"
              }]
            },
            {
              label:"记录创建时间",
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
            }
          ]
        },
        data: [],
        option0 : {
          // border:true,
          // index:true,
          // size:true,
          // selection:true,
          // page:true,
          addBtn: false,
          menu:false,
          align:'center',
          // menuAlign:'center',
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
             label:'收货状态',
             prop:"asReceivedConditionName"
            },
            {
             label:'收货员',
             prop:"name"
            }
          ]
        },
        datas:[],
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
      };
    },

    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.acceptancerecord_add, false),
          viewBtn: this.vaildData(this.permission.acceptancerecord_view, false),
          delBtn: this.vaildData(this.permission.acceptancerecord_delete, false),
          editBtn: this.vaildData(this.permission.acceptancerecord_edit, false)
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
      viewMaterialsDelivery(purchaseid){
        console.log(purchaseid)
        this.dialogVisible = true;
        viewMaterialsDelivery(purchaseid).then(res=>{
          if (res.data.success) {
            this.datas = res.data.data;
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })
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
      }
    }
  };
</script>

<style>
</style>
