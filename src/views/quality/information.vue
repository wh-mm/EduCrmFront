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
                   v-if="permission.information_button"
                   @click="updateInspectorNew()">审 批
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove, updateInspector,shenfen} from "@/api/quality/information";
  import {mapGetters} from "vuex";

    const validateIdNo  =(rule, value, callback) => {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (value == '' || value == undefined || value == null) {
      callback();
    } else {
      if ((!reg.test(value)) && value != '') {
        callback(new Error('请输入正确的身份证号码'));
      } else {
        callback();
      }
    }
  };
  export default {
    data() {

      return {
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
              label: "采购状态",
              prop: "stateExamine",
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
              label: "承付模式",
              prop: "commitmentModel",
              hide: true,
              rules: [{
                required: true,
                message: "承付模式",
                trigger: "blur"
              }]
            },
            {
              label: "组织代码",
              prop: "organizationCode",
              hide: true,
              rules: [{
                required: true,
                message: "请输入组织代码",
                trigger: "blur"
              }]
            },
            {
              label: "税号",
              prop: "dutyParagraph",
              hide: true,
              rules: [{
                required: true,
                message: "请输入税号",
                trigger: "blur"
              }]
            },
            {
              label: "法人代表",
              prop: "legalRepresentative",
              hide: true,
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
              hide: true,
              rules: [{
                required: true,
                message: "请输入注册地址",
                trigger: "blur"
              }]
            },
            {
              label: "生产或仓库地址",
              labelWidth: 130,
              hide: true,
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
              hide: true,
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
            /*{
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
              hide: true,
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
              hide: true,
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
              hide: true,
              props: {
                label: 'name',
                value: 'code'
              },
              dicFlag: false,
              dicUrl: '/api/blade-system/region/select?code={{key}}',
            },
            {
              label: "联系人",
              prop: "contacts",
            },
            {
              label: "联系人电话",
              prop: "contactPhoneNumber",
            },
            {
              label: "联系人身份证",
              prop: "contactIdCard",
              validator: shenfen,
              labelWidth: 110,
            },
            /*{
              label: "使用状态",
              prop: "useState",
              hide:true,
              row: true,
              rules: [{
                required: true,
                message: "请输入使用状态",
                trigger: "blur"
              }]
            },*/
            {
              label: '证件照',
              prop: 'dynamic',
              type: 'dynamic',
              indexLabel: '序号',
              span: 24,
              children: {
                align: 'center',
                type: 'form',
                headerAlign: 'center',
                rowAdd: (done) => {
                  /* this.$message.success('新增回调');*/
                  done({
                    input: '默认值'
                  });
                },
                rowDel: (row, done) => {
                  /*this.$message.success('删除回调' + JSON.stringify(row));*/
                  done();
                },
                column: [{
                  label: "供应商证件照名称",
                  prop: "nameOfCertificatePhoto",
                  labelWidth: 130,
                },
                  {
                    label: "签发日期",
                    prop: "dateOfIssue",
                    type: "date",
                  },
                  {
                    label: "期限",
                    prop: "term",
                    type: "date",
                  },
                  {
                    label: "期限至",
                    prop: "termTo",
                    type: "date",
                  },
                  {
                    label: "经营范围",
                    prop: "natureOfBusiness",
                    hide: true,
                    row: true,
                    type: 'tree',
                    multiple: true,
                    props: {
                      label: 'title',
                      value: 'id'
                    },
                    dicUrl: "/api/erp-base/scope/tree",
                  },
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
                ],
              },
            },
          ],
        },

        /* infoOption: {
           calcHeight: 200,
           border: true,
           index: true,
           viewBtn: true,
           addBtn: true,
           menu: false,
           page: false,
           dialogClickModal: false,
           menuBtn: false,

           column: [
             {

             },

             /!*{
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
             },
             {
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
             },*!/

           ]
         },*/


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
        for (let i = 0; i < row.dynamic.length; i++) {
          row.dynamic[i].natureOfBusiness=row.dynamic[i].natureOfBusiness.join(",");
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
        for (let i = 0; i < row.dynamic.length; i++) {
          row.dynamic[i].natureOfBusiness=row.dynamic[i].natureOfBusiness.join(",");
        }
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
      computed: {
        infoData() {
          return this.form.info || []
        }
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
          type: "warning"
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
