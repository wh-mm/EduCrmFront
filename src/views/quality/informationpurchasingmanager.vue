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
                   v-if="permission.information_delete"
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
  import {getList, getDetail, add, update, remove} from "@/api/quality/information";
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
              label: "供应商名称",
              prop: "supplierName",
              search: true,
              display: false
            },
            {
              label: "质量负责人",
              prop: "qualityPrincipal",
              search: true,
              display: false
            },
            {
              label: "审核状态",
              prop: "stateExamine",
              type: 'select',
              search: true,
              display: false,
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              required: true,
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=quality_audit",
              trigger: "blur"
            },

            /*{
              label: "生产或仓库地址",
              prop: "productionOrWarehouseAddress",
              search: true,
              display: false
            },*/
            /* {
               label: "审核状态",
               prop: "stateExamine",
               slot: true,
               display: false
             }*/
          ],
          group: [
            {
              icon: 'el-icon-info',
              label: '基本信息',
              collapse: true,
              prop: 'group1',
              column: [
                {
                  label: "供应商名称",
                  prop: "supplierName",
                  labelWidth: 110,
                  rules: [{
                    required: true,
                    message: "供应商名称",
                    trigger: "blur"
                  }]
                },
                {
                  label: "承付模式",
                  prop: "commitmentModel",
                  rules: [{
                    required: true,
                    message: "承付模式",
                    trigger: "blur"
                  }]
                },
              ]
            },
            {
              icon: 'el-icon-info',
              label: '质量填报信息',
              collapse: true,
              prop: 'group1',
              column: [
                {
                  label: "组织代码",
                  prop: "organizationCode",
                  rules: [{
                    required: true,
                    message: "请输入组织代码",
                    trigger: "blur"
                  }]
                },
                {
                  label: "税号",
                  prop: "dutyParagraph",
                  rules: [{
                    required: true,
                    message: "请输入税号",
                    trigger: "blur"
                  }]
                },
                {
                  label: "法人代表",
                  prop: "legalRepresentative",
                  rules: [{
                    required: true,
                    message: "请输入法人代表",
                    trigger: "blur"
                  }]
                },
                {
                  label: "社会统一信用码",
                  prop: "socialUniformCreditCode",
                  labelWidth: 130,
                  rules: [{
                    required: true,
                    message: "请输入社会统一信用码",
                    trigger: "blur"
                  }]
                },
                {
                  label: "注册地址",
                  prop: "registeredAddress",
                  rules: [{
                    required: true,
                    message: "请输入注册地址",
                    trigger: "blur"
                  }]
                },

                {
                  label: "生产或仓库地址",
                  labelWidth: 130,
                  prop: "productionOrWarehouseAddress",
                  rules: [{
                    required: true,
                    message: "请输入生产或仓库地址",
                    trigger: "blur"
                  }]
                },
                {
                  label: "质量负责人",
                  prop: "qualityPrincipal",
                  labelWidth: 110,
                  rules: [{
                    required: true,
                    message: "请输入质量负责人",
                    trigger: "blur"
                  }]
                },
                {
                  label: "企业负责人",
                  prop: "enterprisePrincipal",
                  labelWidth: 110,
                  rules: [{
                    required: true,
                    message: "请输入企业负责人",
                    trigger: "blur"
                  }]
                },
                /* {
                     label: "国家",
                     prop: "country",
                     rules: [{
                     required: true,
                     message: "请输入国家",
                     trigger: "blur"
                   }]
                 },*/
                {
                  label: "省份",
                  prop: "regionArea",
                  type: 'select',
                  props: {
                    label: 'name',
                    value: 'code'
                  },
                  cascaderItem: ['metropolitanArea', 'countyArea'],
                  dicUrl: '/api/blade-system/region/select',
                },
                {
                  label: "地市",
                  prop: "metropolitanArea",
                  type: 'select',
                  props: {
                    label: 'name',
                    value: 'code'
                  },
                  dicFlag: false,
                  dicUrl: '/api/blade-system/region/select?code={{key}}',
                },
                {
                  label: "区县",
                  prop: "countyArea",
                  type: 'select',
                  props: {
                    label: 'name',
                    value: 'code'
                  },
                  dicFlag: false,
                  dicUrl: '/api/blade-system/region/select?code={{key}}',
                },
                {
                  label: "使用状态",
                  prop: "useState",
                  row: true,
                  rules: [{
                    required: true,
                    message: "请输入使用状态",
                    trigger: "blur"
                  }]
                },

               /* {
                  label: "有效开始时间",
                  prop: "effectiveStart",
                  format: "yyyy-MM-dd hh:mm:ss",
                  valueFormat: "yyyy-MM-dd hh:mm:ss",
                  type: "date",
                  labelWidth: 130,
                  rules: [{
                    required: true,
                    message: "请输入有效开始时间",
                    trigger: "blur"
                  }]
                },
                {
                  label: "有效结束时间",
                  prop: "effectiveEnd",
                  type: "date",
                  format: "yyyy-MM-dd hh:mm:ss",
                  valueFormat: "yyyy-MM-dd hh:mm:ss",
                  labelWidth: 130,
                  row: true,
                  rules: [{
                    required: true,
                    message: "请输入有效结束时间",
                    trigger: "blur"
                  }]
                },*/
                {
                  label: "供应商证件照",
                  prop: "supplierCertificatePhotos",
                  dataType: 'array',
                  labelWidth: 110,
                  type: 'upload',
                  propsHttp: {
                    res: 'data',
                    url: 'link',
                  },
                  span: 12,
                  listType: 'picture-card',
                  tip: '只能上传jpg/png文件，且不超过500kb',
                  action: "/api/oss/goods/imgUpload"
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
          addBtn: this.vaildData(this.permission.information_add, false),
          viewBtn: this.vaildData(this.permission.information_view, false),
          delBtn: this.vaildData(this.permission.information_delete, false),
          editBtn: this.vaildData(this.permission.information_edit, false)
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
