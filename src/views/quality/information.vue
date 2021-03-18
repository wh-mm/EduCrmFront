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
                   v-if="permission.information_delete"
                   @click="handleDelete">删 除
        </el-button>-->
        <el-button type="button"
                   size="small"
                   icon="el-icon-mouse"
                   v-if="permission.information_button"
                   @click="openInspectorNew()">审 批
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          :size="scope.size"
          :type="scope.type"
          icon="el-icon-delete"
          v-if="permission.information_delete  && scope.row.stateExamine === '1'"
          @click="rowDel(scope.row)">删 除
        </el-button>
        <el-button icon="el-icon-check"
                   :size="scope.size"
                   :type="scope.type"
                   v-if="permission.information_edit  && (scope.row.stateExamine === '1' || scope.row.stateExamine=== '52')"
                   @click.stop="handleEdit(scope.row,scope.index)">编 辑
        </el-button>
        <el-button icon="el-icon-check"
                   :size="scope.size"
                   :type="scope.type"
                   v-if="permission.information_edit && scope.row.stateExamine === '1'"
                   @click.stop="handleStart(scope.row.id)">发 起
        </el-button>
        <el-button icon="el-icon-check"
                   :size="scope.size"
                   :type="scope.type"
                   v-if="scope.row.stateExamine !='1' "
                   @click.stop="handleTimeline (scope.row.id)">审 批 查 看
        </el-button>
      </template>

      <template slot="useState" slot-scope="scope">
        <div style="color: green" v-if="scope.row.useState=='1'?true:false">正常使用</div>
        <div style="color: red" v-else>已过期</div>
      </template>

<!--      <template slot="stateExamine" slot-scope="scope">
        <div style="color: green" v-if="scope.row.stateExamine=='1'&'51'&'11'&'21'&'31'&'31'"></div>
        <div style="color: red"  v-else="scope.row.stateExamine=='52' & '12'& '22'& '32'& '42' "></div>
      </template>-->

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
      :modal="false"
    >
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
            {{ activity.userName }}
            {{ activity.operation === "0" ? activity.rejectText : '' }}
            {{ activity.operation === "1" ? '同意了您的申请' : '' }}
            {{ activity.operation === "2" ? '驳回了您的申请,驳回理由:' + activity.rejectText : '' }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>

  </basic-container>
</template>

<script>
import {
  getList,
  getDetail,
  add,
  update,
  remove,
  updateInspector,
  selectName,
  selectTongyi,
  submitInspector,
  validlegalbizLicNum
} from "@/api/quality/information";
import {timeLine} from "@/api/log/approvalrecord"
import {mapGetters} from "vuex";
import {selectHosptalByHospintl} from "@/api/hisHospital/hospital";


export default {
  data() {
    var supplierName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error("供应商名称重复,请从新输入!"))
      } else {
        selectName(this.form.id, value).then(res => {
          if (res.data.success && res.data.msg === "成功") {
            callback();
          } else {
            callback(new Error(res.data.msg));
          }
        }, err => {
          callback(new Error(err.data.msg));
        })
      }
    }
    var Tongyi = (rule, value, callback) => {
      if (value === '') {
        callback(new Error("社会统一码重复,请从新输入!"))
      } else {
        selectTongyi(this.form.id, value).then(res => {
          if (res.data.success && res.data.msg === "成功") {
            callback();
          } else {
            callback(new Error(res.data.msg));
          }
        }, err => {
          callback(new Error(err.data.msg));
        })
      }
    }
    return {
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
            label: "供应商名称",
            prop: "supplierName",
            sortable: true,
            searchLabelWidth: 130,
            labelWidth: 130,
            //maxlength: 20,
            //showWordLimit: true,
            rules: [{
              required: true,
              validator: supplierName,
              trigger: 'blur'
            }],
            search: true,
          },
          {
            label: "企业负责人",
            prop: "enterprisePrincipal",
            sortable:true,
            hide: true,
            labelWidth: 130,
          },
          {
            label: "法人代表",
            prop: "legalRepresentative",
            sortable:true,
            hide: true,
            labelWidth: 130,
          },
          {
            label: "质量负责人",
            prop: "qualityPrincipal",
            hide: true,
            sortable:true,
            labelWidth: 130,
          },
          /*
                    {
                      label: "编码",
                      prop: "id",
                      /!*append: "供应商唯一编号",*!/
                      labelWidth: 110,
                      addDisplay: false,
                      editDisplay: false,
                      viewDisplay: false,
                      search: true,
                      rules: [{
                        required: true,
                        trigger: "blur"
                      }]
                    },
          */

          {
            label: "联系人",
            prop: "contacts",
            labelWidth: 130,
            search: true,
            sortable:true,
          },
          {
            label: "联系人电话",
            prop: "contactPhoneNumber",
            labelWidth: 130,
            maxlength: 11,
            sortable:true,
            showWordLimit: true,
          },
          {

            label: "联系人身份证",
            sortable:true,
            prop: "contactIdCard",
            labelWidth: 130,
            maxlength: 18,
            showWordLimit: true,
            hide: true,
          },
          {
            label: "组织代码",
            prop: "organizationCode",
            hide: true,
            sortable:true,
            maxlength: 18,
            labelWidth: 130,
            showWordLimit: true,
          },
          {
            label: "税号",
            prop: "dutyParagraph",
            labelWidth: 130,
            hide: true,
            sortable:true,
            maxlength: 18,
            showWordLimit: true,
          },
          {
            label: "社会统一信用码",
            prop: "socialUniformCreditCode",
            labelWidth: 130,
            maxlength: 18,
            sortable:true,
            showWordLimit: true,
            rules: [
              {
                required: true,
                validator: validlegalbizLicNum,
                trigger: "blur"
              },
              {
                required: true,
                validator: Tongyi,
                trigger: "blur"
              },
            ]
          },
          {
            label: "注册地址",
            prop: "registeredAddress",
            labelWidth: 130,
            hide: true,
            sortable:true,
            /*rules: [{
              validator: validateContacts,
              trigger: "blur"
            }]*/
          },
          {
            label: "生产或仓库地址",
            labelWidth: 130,
            hide: true,
            sortable:true,
            prop: "productionOrWarehouseAddress",
            /* rules: [{
               validator: validateContacts,
               trigger: "blur"
             }]*/
          },
          /* {
             label: "承付模式",
             prop: "commitmentModel",
             labelWidth: 130,
             hide: true,
             rules: [{
               message: "承付模式",
               trigger: "blur"
             }]
           },*/
          {
            label: "审核状态",
            prop: "stateExamine",
            type: 'select',
            //slot: true,
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
            label: "使用状态",
            prop: "useState",
            type: 'select',
            slot: true,
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            props: {
              label: 'dictValue',
              value: 'dictKey'
            },
            search: true,
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=usage_status",
          },
          {
            label: '证件照',
            prop: 'certificates',
            type: 'dynamic',
            indexLabel: '序号',
            span: 24,
            children: {
              align: 'center',
              type: 'form',
              headerAlign: 'center',
              rowAdd: (done) => {
                this.$message.success('新增成功');
                done({
                  input: '默认值'
                });
              },
              rowDel: (row, done) => {
                this.$message.success('删除成功');
                done();
              },
              column: [{
                label: "供应商证件照名称",
                prop: "nameOfCertificatePhoto",
                labelWidth: 130,
                sortable:true,
                /*rules: [{
                  validator: validateContacts,
                  trigger: "blur"
                }]*/
              },
                {
                  label: "经营范围",
                  prop: "natureOfBusiness",
                  hide: true,
                  sortable:true,
                  labelWidth: 130,
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
                  label: "发证日期",
                  prop: "dateOfIssue",
                  sortable:true,
                  labelWidth: 130,
                  type: "date",
                  format: "yyyy-MM-dd",
                  valueFormat: "yyyy-MM-dd",
                },
                /*{
                  label: "有效期",
                  prop: "term",
                  type: "date",
                  format: "yyyy-MM-dd ",
                  valueFormat: "yyyy-MM-dd ",
                },*/
                {
                  label: "期限至",
                  prop: "termTo",
                  type: "date",
                  labelWidth: 130,
                  format: "yyyy-MM-dd",
                  valueFormat: "yyyy-MM-dd",
                },
                {
                  label: "供应商证件照",
                  prop: "supplierCertificatePhoto",
                  dataType: 'array',
                  labelWidth: 130,
                  type: 'upload',
                  propsHttp: {
                    res: 'data',
                    url: 'link',
                  },
                  span: 24,
                  listType: 'picture-card',
                  tip: '只能上传jpg/png文件，且不超过500kb',
                  action: "/api/oss/goods/imgUpload"
                },
              ],
            },
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
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.information_add, false),
        viewBtn: this.vaildData(this.permission.information_view, false),
        delBtn: false,
        editBtn: false,
      };
    },
    cellStyle({row, columnIndex}){
      if (columnIndex === 1 || columnIndex ===11){
        let prpo = columnIndex === 1 ? "stateExamine" : ""
      }
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
      for (let i = 0; i < row.certificates.length; i++) {
        if (row.certificates[i].supplierCertificatePhoto instanceof Array) {
          row.certificates[i].supplierCertificatePhoto = row.certificates[i].supplierCertificatePhoto.join(",");
        }
        if (row.certificates[i].natureOfBusiness instanceof Array) {
          row.certificates[i].natureOfBusiness = row.certificates[i].natureOfBusiness.join(",");
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
    //审批选择按钮
    openInspectorNew() {
      if (this.selectionList.length === 0) {
        return this.$message.error("请选择审批的信息");
      }
      this.dialogVisible = true;
    },
    rowUpdate(row, index, done, loading) {
      console.log(row.certificates);
      for (let j = 0; j < row.certificates.length; j++) {
        if (row.certificates[j].supplierCertificatePhoto instanceof Array) {
          row.certificates[j].supplierCertificatePhoto = row.certificates[j].supplierCertificatePhoto.join(",");
        }
        if (row.certificates[j].natureOfBusiness instanceof Array) {
          row.certificates[j].natureOfBusiness = row.certificates[j].natureOfBusiness.join(",");
        }
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
    updateInspectorNew(operation) {
      if (operation === 2 && this.obj0.rejectText === '') {
        return this.$message.error("请输入驳回理由!");
      }
      updateInspector(this.ids, operation, this.obj0.rejectText).then(res => {
        if (res.data.success) {
          this.$message.success(res.data.msg);
          this.dialogVisible = false;
          this.refreshChange();
          this.obj0.rejectText = "";
        } else {
          this.$message.error(res.data.msg);
        }
      })
    },
    handleEdit(row, index) {
      this.$refs.crud.rowEdit(row, index);
    },
    handleTimeline(id) {
      this.dialogVisibleTimeline = true;
      timeLine(1, id).then(res => {
        this.activities = res.data.data;
      })
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
