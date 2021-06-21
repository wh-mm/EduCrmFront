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
                   v-if="permission.basiccourseservice_delete"
                   @click="handleDelete">删 除
        </el-button>
        <el-button type="primary"
                   size="small"
                   icon="el-icon-edit">批量
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {getList, getDetail, add, update, remove} from "@/api/baiscservice/basiccourseservice";
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
        viewBtn: true,
        selection: true,
        dialogClickModal: false,
        column: [
          {
            label: "所属学校",
            prop: "schoolId",
            type: "tree",
            cascaderItem: ['teacherId'],
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
            label: "授课教师",
            prop: "teacherId",
            type: "tree",
            cascaderItem: ['courseId'],
            rules: [
              {
                required: true,
                message: "请输入授课教师",
                trigger: "blur"
              }
            ],
            dicUrl: '/api/teacher/selectTeacherBySchoolId?schoolId={{key}}',
            props: {
              label: "nameTeacher",
              value: "id"
            }
          },
          {
            label: "课程名称",
            prop: "courseId",
            type: "tree",
            rules: [
              {
                required: true,
                message: "请输入课程名称",
                trigger: "blur"
              }
            ],
            // dicUrl: "/api/course/selectAll",
            dicUrl: '/api/course/selectCourseByTeacherId?teacherId={{key}}',
            props: {
              label: "nameCourse",
              value: "id"
            }
          },
          {
            label: "开始时间",
            prop: "courseStartTime",
            type: 'datetime',
            valueFormat: 'yyyy-MM-dd hh:mm:ss',
            format: 'yyyy-MM-dd hh:mm',
            rules: [{
              message: "请输入开始时间",
              trigger: "blur"
            }]
          },
          {
            label: "结束时间",
            prop: "courseEndTime",
            type: 'datetime',
            valueFormat: 'yyyy-MM-dd hh:mm:ss',
            format: 'yyyy-MM-dd hh:mm',
            rules: [{
              message: "请输入结束时间",
              trigger: "blur"
            }]
          },
          {
            label: "备注",
            prop: "remarkStu",
            rules: [{
              required: true,
              message: "请输入备注",
              trigger: "blur"
            }]
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
        addBtn: this.vaildData(this.permission.basiccourseservice_add, false),
        viewBtn: this.vaildData(this.permission.basiccourseservice_view, false),
        delBtn: this.vaildData(this.permission.basiccourseservice_delete, false),
        editBtn: this.vaildData(this.permission.basiccourseservice_edit, false)
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
