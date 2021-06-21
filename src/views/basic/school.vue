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
                   v-if="permission.school_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot="menuLeft">
        <el-button type="success"
                   size="small"
                   plain
                   icon="el-icon-upload2"
                   @click="handleImport">导入
        </el-button>
      </template>
    </avue-crud>
    <el-dialog title="用户数据导入"
               append-to-body
               :visible.sync="excelBox"
               width="555px">
      <avue-form :option="excelOption" v-model="excelForm" :upload-after="uploadAfter">
        <template slot="excelTemplate">
          <el-button type="primary" @click="handleTemplate">
            点击下载<i class="el-icon-download el-icon--right"></i>
          </el-button>
        </template>
      </avue-form>
    </el-dialog>
  </basic-container>
</template>


<script>
  import {getList, getDetail, add, update, remove, deleteByIdzs} from "@/api/basic/school";
  import {mapGetters} from "vuex";
  import {isvalidatemobile} from "@/util/validate";
  import {getToken} from '@/util/auth';
  export default {
    data() {
      const validatePhone = (rule, value, callback) => {
        if (isvalidatemobile(value)[0]) {
          callback(new Error(isvalidatemobile(value)[1]));
        } else {
          callback();
        }
      };
      return {
        form: {},
        excelBox: false,
        query: {},
        loading: true,
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
          excelBtn:true,
          printBtn:true,
          viewBtn: true,
          selection: true,
          dialogClickModal: false,
          platformBox: false,
          column: [
            {
              label: "学校名",
              prop: "nameSchool",
              type:'input',
              overHidden: true,
              span: 24,
              maxlength:25,
              showWordLimit:true,
              rules: [{
                required: true,
                message: "请输入学校名",
                trigger: "blur"
              }]
            },
            {
              label: "联系方式",
              prop: "contactSchool",
              maxlength: 11,
              rules: [{
                required: true,
                validator: validatePhone,
                message: "请输入联系方式",
                trigger: "change",

              }]
            },
            {
              label: "学校地址",
              prop: "addressSchool",
              type: 'map',
              params:{
                zoom: 10,
                zoomEnable: true,
                dragEnable: true,
              },
              rules: [{
                required: true,
                message: "请输入学校地址",
                trigger: "blur"
              }]
            },
            {
              label: "简介",
              prop: "introduceSchool",
              type:'textarea',
              overHidden: true,
              minRows:4,
              maxlength:200,
              span:22,
              showWordLimit:true,
              rules: [{
                required: true,
                message: "请输入简介",
                trigger: "blur"
              }]
            },
            {
              label: "备注",
              prop: "remarkSchool",
              rules: [{
                required: true,
                message: "请输入备注",
                trigger: "blur"
              }]
            },
          ]
        },
        data: [],
        excelForm: {},
        excelOption: {
          submitBtn: false,
          emptyBtn: false,
          column: [
            {
              label: '模板上传',
              prop: 'excelFile',
              type: 'upload',
              drag: true,
              loadText: '模板上传中，请稍等',
              span: 24,
              propsHttp: {
                res: 'data'
              },
              tip: '请上传 .xls,.xlsx 标准格式文件',
              action: "/api/school/import-school"
            },
            {
              label: "数据覆盖",
              prop: "isCovered",
              type: "switch",
              align: "center",
              width: 80,
              dicData: [
                {
                  label: "否",
                  value: 0
                },
                {
                  label: "是",
                  value: 1
                }
              ],
              value: 0,
              slot: true,
              rules: [
                {
                  required: true,
                  message: "请选择是否覆盖",
                  trigger: "blur"
                }
              ]
            },
            {
              label: '模板下载',
              prop: 'excelTemplate',
              formslot: true,
              span: 24,
            }
          ]
        }
      };
    },
    watch: {
      'excelForm.isCovered'() {
        if (this.excelForm.isCovered !== '') {
          const column = this.findObject(this.excelOption.column, "excelFile");
          column.action = `/api/school/import-school?isCovered=${this.excelForm.isCovered}`;
        }
      }
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.school_add, false),
          viewBtn: this.vaildData(this.permission.school_view, false),
          delBtn: this.vaildData(this.permission.school_delete, false),
          realDelBtn: this.vaildData(this.permission.school_real_delete, false),
          editBtn: this.vaildData(this.permission.school_edit, false)
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
        row.addressSchool = row.addressSchool[2];
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
      rowRealDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return delete(row.id);
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
       Delete() {
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
            return deleteByIdzs(this.ids);
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
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      },
      handlePlatform() {
        this.platformBox = true;
      },
      uploadAfter(res, done, loading, column) {
        window.console.log(column);
        this.excelBox = false;
        this.refreshChange();
        done();
      },
      handleImport() {
        this.excelBox = true;

      },
      handleTemplate() {
        window.open(`/api/school/export-template?${this.website.tokenHeader}=${getToken()}`);
      },
    }
  };
</script>

<style>
</style>
