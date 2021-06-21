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
                   v-if="permission.teacher_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/basic/teacher";
  import {mapGetters} from "vuex";
  import {isvalidatemobile,cardid,validatename} from "@/util/validate";


  export default {
    data() {
      const validatePhone = (rule, value, callback) => {
        if (isvalidatemobile(value)[0]) {
          callback(new Error(isvalidatemobile(value)[1]));
        } else {
          callback();
        }
      };
      const iscardid = (rule, value, callback) => {
        if (cardid(value)[0]) {
          callback(new Error(cardid(value)[1]));
        } else {
          callback();
        }
      };
      const isvalidatePhone = (rule, value, callback) => {
        if (validatename(value)[0]) {
          callback(new Error(validatename(value)[1]));
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
              label: "教师姓名",
              prop: "nameTeacher",
              rules: [{
                required: true,
                validator: isvalidatePhone,
                message: "请输入教师姓名",
                trigger: "blur"
              }]
            },

            {
              label: "教师性别",
              prop: "sexTeacher",
              type: "select",
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=sex",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请输入教师性别",
                trigger: "blur"
              }],
            },
            {
              label: "所属学校",
              prop: "schoolIdTeacher",
              type: "tree",
              rules: [
                {
                  required: true,
                  message: "请输入所属学校",
                  trigger: "blur"
                }
              ],
              dicUrl: "/api/school/selectAll",
              props: {
                label: "nameSchool",
                value: "id"
              }
            },

            {
              label: "出生日期",
              prop: "birthTeacher",
              type: "date",
              format: "yyyy-MM-dd",
              valueFormat: "yyyy-MM-dd",
              rules: [{
                required: true,
                message: "请输入出生日期",
                trigger: "blur"
              }]
            },
            {
              label: "联系方式",
              prop: "contactTeacher",
              maxlength: 11,
              showWordLimit:true,
              rules: [{
                required: true,
                validator: validatePhone,
                message: "请输入联系方式",
                trigger: "change"
              }]
            },
            {
              label: "学历",
              prop: "degreeTeacher",
              type: 'select',
              // search:true,
              span: 6,
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              dicUrl: '/api/blade-system/dict-biz/dictionary?code=education',
              rules: [{
                required: true,
                message: "请输入学历",
                trigger: "blur"
              }]
            },
            {
              label: "简介",
              prop: "introduceTeacher",
              rules: [{
                required: false,
                message: "请输入简介",
                trigger: "blur"
              }]
            },
            {
              label: "身份证号",
              prop: "cardTeacher",
              maxlength: 18,

              rules: [{
                required: true,
                validator: iscardid,
                trigger: "blur"
              }]
            },
            // {
            //   label: "备注",
            //   prop: "remarkTeacher",
            //   rules: [{
            //     required: false ,
            //     message: "请输入备注",
            //     trigger: "blur"
            //   }]
            // },
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.teacher_add, false),
          viewBtn: this.vaildData(this.permission.teacher_view, false),
          delBtn: this.vaildData(this.permission.teacher_delete, false),
          editBtn: this.vaildData(this.permission.teacher_edit, false)
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
