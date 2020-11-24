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
                   v-if="permission.commodity_delete"
                   @click="handleDelete">删 除
        </el-button>
        <el-button type="button"
                   size="small"
                   icon="el-icon-mouse"
                   v-if="permission.commodity_button"
                   @click="updateInspectorNew()">审 批
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove, updateInspector} from "@/api/quality/commodity";
  import {mapGetters} from "vuex";

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
        selectionList: [],
        option: {
          height: 'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          indexLabel: '序号',
          viewBtn: true,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "公司名称",
              prop: "companyId",
              type: 'select',
              /*
                rules: [{
                required: true,
                message: "请输入公司名称",
                trigger: "blur"
              }],*/
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
              rules: [{
                required: true,
                message: "通用名",
                trigger: "blur"
              }],
              maxlength: 10,
              showWordLimit: true
            },
            {
              label: "商品名",
              prop: "tradeName",
              tip: '商品名',
              rules: [{
                required: true,
                message: "商品名",
                trigger: "blur"
              }],
              maxlength: 10,
              showWordLimit: true
            },
            {
              label: "基本单位",
              prop: "basicUnit",
            },
            {
              label: "生产厂家",
              prop: "manufacturer",
              rules: [{
                required: true,
                message: "请输入生产厂家",
                trigger: "blur"
              }]
            },
            {
              label: "规格(型号)",
              prop: "specifications",
              rules: [{
                required: true,
                message: "请输入规格(型号)",
                trigger: "blur"
              }]
            },
            {
              label: "采购状态",
              prop: "purchasingStatus",
              type: 'select',
              addDisplay: false,
              editDisplay: false,
              viewDisplay: false,
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              search: true,
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=quality_audit",
            },
            /*{
              label: "打印规格",
              prop: "printSpecifications",
            },*/
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
              label: "OTC标志",
              prop: "sign",
              type: 'radio',
              value: 0,
              dicData: [{
                label: '有',
                value: 0
              }, {
                label: '无',
                value: 1,
              }]

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
              search: true,
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
          ],
        },
        data: []
      };
    },
    watch: {
      //otc 事件
      'form.sign': {
        handler(val) {
          var text2 = this.findObject(this.option.column, 'signTow')
          if (val === 0) {
            text2.display = true
            text2.rules = [{
              required: true,
              message: "请输入",
              trigger: "blur"
            }]
          } else {
            text2.display = false
            text2.rules = []
          }
        },
      },
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.commodity_add, false),
          viewBtn: this.vaildData(this.permission.commodity_view, false),
          delBtn: this.vaildData(this.permission.commodity_delete, false),
          editBtn: this.vaildData(this.permission.commodity_edit, false)
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

      //审批
      updateInspectorNew() {
        if (this.selectionList.length === 0) {
          return this.$message.error("请选择需要的商品");
        }
        var ids = this.ids;
        let operation;
        this.$confirm("请确认是否审批?", {
          confirmButtonText: "确认",
          cancelButtonText: "驳回",
          type: "warning",

        })
          .then(() => {
            operation = 1;
          })
          .catch(() => {
            operation = 2;
          }).finally(() => {
          updateInspector(ids, operation).then(res => {
            if (res.data.success) {
              this.$message.success(res.data.msg);
            } else {
              this.$message.error(res.data.msg);
            }
            this.refreshChange();
          })
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
      }
    }
  };
</script>

<style>
</style>
