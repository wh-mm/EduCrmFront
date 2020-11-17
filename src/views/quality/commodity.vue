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
                   v-if="permission.inspector_approval"
                   @click="updateInspectorNew()">审 批
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/quality/commodity";
  import {mapGetters} from "vuex";
  import {updateInspector} from "@/api/purchase/purchaseorder";

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
          viewBtn: true,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "公司名称",
              prop: "corporateName",
              search: true,
              display: false
            },
            {
              label: "商品名称",
              prop: "tradeName",
              search: true,
              display: false
            }
          ],
          group: [
            {
              icon: 'el-icon-info',
              label: '基本信息',
              collapse: true,
              prop: 'group1',
              column: [
                {
                  label: "公司名称",
                  prop: "corporateName",
                  rules: [{
                    required: true,
                    message: "请输入公司名称",
                    trigger: "blur"
                  }]
                },
                {
                  label: "商品名称",
                  prop: "tradeName",
                  rules: [{
                    required: true,
                    message: "请输入商品名称",
                    trigger: "blur"
                  }]
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
              ],
            },
            {
              icon: 'el-icon-info',
              label: '质量填报信息',
              collapse: true,
              prop: 'group1',
              column: [
                {
                  label: "公司id",
                  prop: "companyId",
                  rules: [{
                    required: true,
                    message: "请输入公司id",
                    trigger: "blur"
                  }]
                },
                {
                  label: "打印规格",
                  prop: "printSpecifications",
                  rules: [{
                    required: true,
                    message: "请输入打印规格",
                    trigger: "blur"
                  }]
                },

                {
                  label: "进项税",
                  prop: "inputTax",
                  rules: [{
                    required: true,
                    message: "请输入进项税",
                    trigger: "blur"
                  }]
                },
                {
                  label: "销项税",
                  prop: "outputTax",
                  rules: [{
                    required: true,
                    message: "请输入销项税",
                    trigger: "blur"
                  }]
                },
                {
                  label: "采购状态",
                  prop: "purchasingStatus",
                  rules: [{
                    required: true,
                    message: "请输入采购状态",
                    trigger: "blur"
                  }]
                },
                {
                  label: "产品分类",
                  prop: "productClassification",
                  rules: [{
                    required: true,
                    message: "请输入产品分类",
                    trigger: "blur"
                  }]
                },
                {
                  label: "分包装企业",
                  prop: "subPackagingEnterprises",
                  rules: [{
                    required: true,
                    message: "请输入分包装企业",
                    trigger: "blur"
                  }]
                },
                {
                  label: "剂型",
                  prop: "dosageForm",
                  rules: [{
                    required: true,
                    message: "请输入剂型",
                    trigger: "blur"
                  }]
                },
                {
                  label: "经营范围",
                  prop: "natureOfBusiness",
                  rules: [{
                    required: true,
                    message: "请输入经营范围",
                    trigger: "blur"
                  }]
                },
                {
                  label: "存储期限",
                  prop: "storageLife",
                  rules: [{
                    required: true,
                    message: "请输入存储期限",
                    trigger: "blur"
                  }]
                },
                {
                  label: "存储期限类型",
                  prop: "storagePeriodType",
                  rules: [{
                    required: true,
                    message: "请输入存储期限类型",
                    trigger: "blur"
                  }]
                },
                {
                  label: "特管药品",
                  prop: "specialDrugs",
                  rules: [{
                    required: true,
                    message: "请输入特管药品",
                    trigger: "blur"
                  }]
                },
                {
                  label: "特殊药品",
                  prop: "specialDrug",
                  rules: [{
                    required: true,
                    message: "请输入特殊药品",
                    trigger: "blur"
                  }]
                },
                {
                  label: "otc标志",
                  prop: "sign",
                  rules: [{
                    required: true,
                    message: "请输入otc标志",
                    trigger: "blur"
                  }]
                },
                {
                  label: "国产/进口标示",
                  prop: "domesticImportIndication",
                  rules: [{
                    required: true,
                    message: "请输入国产/进口标示",
                    trigger: "blur"
                  }]
                },
                {
                  label: "产品二级分类",
                  prop: "secondaryProductClassification",
                  rules: [{
                    required: true,
                    message: "请输入产品二级分类",
                    trigger: "blur"
                  }]
                },
                {
                  label: "存储条件",
                  prop: "storageConditions",
                  rules: [{
                    required: true,
                    message: "请输入存储条件",
                    trigger: "blur"
                  }]
                },
                {
                  label: "批准文号",
                  prop: "approvalNumber",
                  rules: [{
                    required: true,
                    message: "请输入批准文号",
                    trigger: "blur"
                  }]
                },
                {
                  label: "税收分类",
                  prop: "taxClassification",
                  rules: [{
                    required: true,
                    message: "请输入税收分类",
                    trigger: "blur"
                  }]
                },
                {
                  label: "公司ID",
                  prop: "corporateId",
                  rules: [{
                    required: true,
                    message: "请输入公司ID",
                    trigger: "blur"
                  }]
                },

              ]
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
        if (this.selectionList.length > 1) {
          return this.$message.error("选中一行数据");
        }
        if (this.selectionList[0].status != 1) {
          return this.$message.error("该任务已经完成");
        }
        var id = this.selectionList[0].id;
        let status;
        this.$confirm("请确认是否审批?", {
          confirmButtonText: "确认",
          cancelButtonText: "驳回",
          type: "warning"
        })
          .then(() => {
            status = 0;
          })
          .catch(() => {
            status = 3;
          }).finally(() => {
          updateInspector(id, status).then(res => {
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
