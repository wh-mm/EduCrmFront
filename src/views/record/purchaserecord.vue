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
                   v-if="permission.purchaserecord_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>

      <template slot-scope="scope" slot="menu">
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
      v-dialogDrag
    >
      <avue-crud v-model="form" :data="commoditydata" :option="commoditydataoption"  >
      </avue-crud>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/record/purchaserecord";
  import {viewCommodity} from "@/api/purchase/purchaseorder";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        form: {},
        query: {},
        loading: true,
        commoditydialogVisible:false,
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
          searchMenuSpan: 6,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,

          dialogClickModal: false,
          column: [
            {
              label: "采购单号",
              prop: "ordernumber",
              rules: [{
                required: true,
                message: "请输入采购单号",
                trigger: "blur"
              }]
            },
            {
              label: '商品',
              prop: "goodsName",
              type: 'tree',
              width: 130,
              filterable: true,
              remote: true,
              display:false,

            },
            {
              label: "采购状态",
              prop: "purchaseStatus",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=purchase_status"
            },
            {
              label: "采购员",
              prop: "purchaseUserName",
            },
            {
              label: "创建时间",
              prop: "createTime",
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
          ]
        },
        data: [],
        commoditydata:[],
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
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.purchaserecord_add, false),
          viewBtn: this.vaildData(this.permission.purchaserecord_view, false),
          delBtn: this.vaildData(this.permission.purchaserecord_delete, false),
          editBtn: this.vaildData(this.permission.purchaserecord_edit, false)
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
      viewCommodity(commodityId){
        this.commoditydialogVisible = true;
        viewCommodity(commodityId).then(res=>{
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
