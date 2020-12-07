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
        <!--<el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.commodity_delete"
                   @click="handleDelete">删 除
        </el-button>-->
        <el-button type="button"
                   size="small"
                   icon="el-icon-mouse"
                   v-if="permission.commodity_button"
                   @click="openInspectorNew()">审 批
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          :size="scope.size"
          :type="scope.type"
          icon="el-icon-delete"
          v-if="permission.commodity_delete  && scope.row.purchasingStatus === '1'"
          @click="rowDel(scope.row)">删 除
        </el-button>
        <el-button icon="el-icon-check"
                   :size="scope.size"
                   :type="scope.type"
                   v-if="permission.commodity_edit  && scope.row.purchasingStatus === '1'"
                   @click.stop="handleEdit(scope.row,scope.index)">编 辑
        </el-button>
        <el-button icon="el-icon-check"
                   :size="scope.size"
                   :type="scope.type"
                   v-if="permission.commodity_edit && scope.row.purchasingStatus === '1'"
                   @click.stop="handleStart(scope.row.id)">发起
        </el-button>
        <el-button icon="el-icon-check"
                   :size="scope.size"
                   :type="scope.type"
                   @click.stop="handleTimeline (scope.row.id)">审 批 查 看
        </el-button>
      </template>
    </avue-crud>
    <el-dialog
      title="审批"
      :visible.sync="dialogVisible"
      width="30%"
      :modal="false"
      :before-close="handleClose">
      <avue-form ref="form" v-model="obj0" :option="option0">
      </avue-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateInspectorNew(2)">驳 回</el-button>
        <el-button type="primary" @click="updateInspectorNew(1)">同 意</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="审批过程"
      :visible.sync="dialogVisibleTimeline"
      width="30%"
      :modal="false">
      <div class="block">
        <div class="radio">
          排序：
          <el-radio-group v-model="reverse">
            <el-radio :label="true">倒序</el-radio>
            <el-radio :label="false">正序</el-radio>
          </el-radio-group>
        </div>
        <el-divider></el-divider>
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.createTime">
            {{activity.userName}} {{activity.operation === 1 ?'同意了您的申请':'驳回了您的申请,驳回理由:'}}
            {{activity.operation === 2?activity.rejectText:''}}
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {
    getList,
    getCommodityDetail,
    add,
    update,
    remove,
    updateInspector,
    submitInspector
  } from "@/api/quality/commodity";
  import {timeLine} from "@/api/log/approvalrecord"
  import {mapGetters} from "vuex";
  export default {
    data() {
      return {
        obj: {
          radio1: 0,
          radio2: 0,
          checkbox1: [0, 1],
          checkbox2: [0, 1]
        },
        form: {},
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        dialogVisible: false,
        dialogVisibleTimeline: false,
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
              rules: [{
                required: true,
                trigger: "blur"
              }],
              props: {
                label: 'supplierName',
                value: 'id'
              },
              search: true,
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
                message: "商品名",
                trigger: "blur"
              }],
              maxlength: 10,
              showWordLimit: true
            },
            {
              label: "基本单位",
              prop: "basicUnit",
              type: 'tree',
              hide: true,
              rules: [{
                required: true,
                message: "商品名",
                trigger: "blur"
              }],
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              required: true,

              dicUrl: "/api/blade-system/dict-biz/dictionary?code=goods_unit",
            },
            {
              label: "产地",
              prop: "placeOfOrigin",
              rules: [{
                message: "请输入产地",
                trigger: "blur"
              }]
            },
            {
              label: "生产厂家",
              prop: "manufacturer",
              hide: true,
              rules: [{
                required: true,
                message: "请输入生产厂家",
                trigger: "blur"
              }]
            },

            {
              label: "规格(型号)",
              prop: "specifications",
              hide: true,
              rules: [{
                required: true,
                message: "请输入规格(型号)",
                trigger: "blur"
              }]

            },
            {
              label: "最小销售包装规格",
              prop: "minimumSalesSpecification",
              labelWidth: 140,
              type: 'select',
              hide: true,
              rules: [{
                required: true,
                message: "请输入规格(型号)",
                trigger: "blur"
              }],
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              required: true,
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=package_size",
            },

            /*{
              label: "打印规格",
              prop: "printSpecifications",
            },*/
            {
              label: "进项税",
              prop: "inputTax",
              type: 'number',
              hide: true,
              /*rules: [{
                validator: isInteger,
                trigger: "blur"
              }]*/
            },
            {
              label: "销项税",
              prop: "outputTax",
              type: 'number',
              hide: true,
              /*rules: [{
                validator: isInteger,
                trigger: "blur"
              }]*/
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
              type: 'tree',
              rules: [{
                required: true,
                message: "请输入产品分类",
                trigger: "blur"
              }],
              props: {
                label: 'title',
                value: 'id'
              },
              search: true,
              dicUrl: "/api/erp-wms/goods-type/tree",
            },
            {
              label: "审批状态",
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
            {
              label: "存储期限",
              prop: "storageLife",
              hide: true,
              tip: '按每月',
            },
            {
              label: "存储期限类型",
              prop: "storagePeriodType",
              hide: true,
              labelWidth: 110,
            },
            {
              label: "特管药品",
              prop: "specialDrugs",
              hide: true,
              type: 'select',
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=special_drug",
            },
            {
              label: "特殊药品",
              prop: "specialDrug",
              hide: true,
              type: 'select',
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=special_drugs",
            },

            {
              label: "存储条件",
              prop: "storageConditions",
              hide: true,
              rules: [{
                required: true,
                message: "请输入产品分类",
                trigger: "blur"
              }],
            },
            {
              label: "税收分类",
              prop: "taxClassification",
              hide: true,
            },
            {
              label: "是否可拆零",
              prop: "scattered",
              type: 'radio',
              hide: true,
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
              viewDisplay: true,
              hide: true,
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
              rules: [],
              hide: true,
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
              hide: true,
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
              hide: true,
              rules: [],
            },
            {
              label: "进口注册证",
              labelWidth: 110,
              hide: true,
              prop: "importRegistrationCertificate",
              rules: [],
            },
            {
              label: "分包装企业",
              prop: "subPackagingEnterprises",
              labelWidth: 110,
              hide: true,
              rules: [],
            },
            {
              label: "分包装批准文号",
              labelWidth: 130,
              hide: true,
              prop: "approvalNumberOfSubPackage",
              rules: [],
            },
          ],
        },
        data: [],
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
        reverse: true,
        activities: []
      };
    },
    watch: {
      //otc 事件
      'form.sign': {
        handler(val) {
          var signTow = this.findObject(this.option.column, 'signTow')
          var signs = this.findObject(this.option.column, 'sign')
          if (val == 1) {
            signs.viewDisplay = true
            signTow.display = true
            // signTow.viewDisplay = true
            signTow.rules = [{
              required: true,
              message: "请选择OTC标志",
              trigger: "blur"
            }]
          } else {
            signTow.display = false
            signs.viewDisplay = false
            signTow.rules = []
          }
        },
        immediate: true
      },
      'form.domesticImportIndication': {
        handler(val) {
          var approvalNumber = this.findObject(this.option.column, 'approvalNumber')
          var importRegistrationCertificate = this.findObject(this.option.column, 'importRegistrationCertificate')
          var subPackagingEnterprises = this.findObject(this.option.column, 'subPackagingEnterprises')
          var approvalNumberOfSubPackage = this.findObject(this.option.column, 'approvalNumberOfSubPackage')

          if (val == 1) {
            approvalNumber.display = true
            approvalNumberOfSubPackage.viewDisplay = false
            approvalNumber.rules = [{
              required: true,
              message: "请输入批准文号",
              trigger: "blur"
            }];
            importRegistrationCertificate.display = false
            importRegistrationCertificate.rules = []
            subPackagingEnterprises.display = false
            subPackagingEnterprises.rules = []
            approvalNumberOfSubPackage.display = false
            approvalNumberOfSubPackage.rules = []
          } else {
            approvalNumber.display = false
            approvalNumber.rules = [];
            importRegistrationCertificate.display = true
            importRegistrationCertificate.rules = [{
              required: true,
              message: "请输入进口注册证",
              trigger: "blur"
            }];
            subPackagingEnterprises.display = true
            subPackagingEnterprises.rules = [{
              message: "请输入分包装企业",
              trigger: "blur"
            }];
            approvalNumberOfSubPackage.display = true
            approvalNumberOfSubPackage.rules = [{
              message: "请输入分包装批准文号",
              trigger: "blur"
            }];
          }
        },
      },
      /*     //拆零时间
           'form.scattered': {

             immediate: true
           },*/
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.commodity_add, false),
          viewBtn: this.vaildData(this.permission.commodity_view, false),
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
      openInspectorNew() {
        if (this.selectionList.length === 0) {
          return this.$message.error("请选择需要的商品");
        }
        this.dialogVisible = true;
      },
      handleEdit(row, index) {
        this.$refs.crud.rowEdit(row, index);
      },
      handleStart(id) {
        submitInspector(id).then(res => {
          this.$message({
            type: 'info',
            message: res.data.msg
          })
          this.refreshChange();
        })
      },
      handleTimeline(id) {
        this.dialogVisibleTimeline = true;
        timeLine(3, id).then(res => {
          this.activities = res.data.data;
        })
      },
      updateInspectorNew(operation) {
        if (operation === 3 && this.obj0.rejectText === '') {
          return this.$message.error("请输入驳回理由!");
        }
        updateInspector(this.ids, operation, this.obj0.rejectText).then(res => {
          if (res.data.success) {
            this.$message.success(res.data.msg);
            this.dialogVisible = false;
            this.refreshChange();
          } else {
            this.$message.error(res.data.msg);
          }
        })
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
          getCommodityDetail(this.form.id).then(res => {
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
