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
                   v-if="permission.basicstudentservice_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button icon="el-icon-check" size="small" type="text" @click="openDialog(scope.row)">追踪</el-button>
        <el-button icon="el-icon-view" size="small" type="text"  @click="handleTimeline (scope.row.id)">时间轴</el-button>
      </template>
    </avue-crud>
      <el-dialog title="学生追踪管理"
                 append-to-body
                 :visible.sync="intentionBox"
                 width="1000px">
        <avue-form :option="intentionOption" v-model="intentionForm" :upload-after="uploadAfter"
                   @submit="updateIntention()"/>
      </el-dialog>
      <el-dialog title="时间线" :visible.sync="dialogVisibleTimeline"
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
              v-for="(activity,index) in activities"
              :key="index"
              :timestamp="activity.createTime">
              {{ activity.studentServiceId }}
              {{ activity.intentionStatus }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-dialog>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/baiscservice/basicstudentservice";
  import {mapGetters} from "vuex";
  import {addIntention} from "../../api/baiscservice/basicstudentintention";
  import {timeLine} from "../../api/baiscservice/basicstudentintention";

  export default {
    data() {
      return {
        form: {},
        query: {},
        loading: false,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        dialogVisible: false,
        dialogVisibleTimeline: false,
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
              label: "学生姓名",
              prop: "studentIdStu",
              type: 'tree',
              props: {
                label: "nameStu",
                value: "id"
              },
              dicUrl: '/api/student/selectAll',
              rules: [{
                required: true,
                message: "请输入学生姓名",
                trigger: "blur"
              }]
            },
            {
              label: "学校名称",
              prop: "schoolIdStu",
              type: 'tree',
              cascaderItem: ['teacherIdStu'],
              props: {
                label: "nameSchool",
                value: "id"
              },
              dicUrl: '/api/school/selectAll',
              rules: [{
                required: true,
                message: "请选择学校",
                trigger: "blur"
              }]
            },
            {
              label: "教师",
              prop: "teacherIdStu",
              type: "tree",
              cascaderItem: ['intentionCourseStu'],
              rules: [
                {
                  required: true,
                  message: "请输入教师",
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
              label: "来源",
              prop: "sourceStu",
              type: 'select',
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              dicUrl: '/api/blade-system/dict-biz/dictionary?code=source',
              rules: [{
                required: true,
                message: "请输入来源",
                trigger: "blur"
              }]
            },
            {
              label: "意向",
              prop: "intentionStu",
              type: 'select',
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=intention",
              rules: [{
                required: true,
                message: "请输入意向",
                trigger: "blur"
              }]
            },
            {
              label: "意向课程",
              prop: "intentionCourseStu",
              type: "tree",
              rules: [
                {
                  required: true,
                  message: "请输入意向课程",
                  trigger: "blur",

                }
              ],
              dicUrl: "/api/course/selectAll",
              props: {
                label: "nameCourse",
                value: "id"
              }
            },
            {
              label: "课包id",
              prop: "packIdStu",
              rules: [{
                required: true,
                message: "请输入课包id",
                trigger: "blur"
              }]
            },
          ]
        },
        intentionBox: false,
        intentionForm: {},
        intentionOption: {
          submitBtn: true,
          emptyBtn: true,
          column: [
            {
              label: "学生姓名",
              prop: "studentServiceId",
              disabled: true,
              type: 'select',
              props: {
                label: 'nameStu',
                value: 'id'
              },
              dicUrl: '/api/basicstudentservice/selectStudentByServiceId?studentServiceId',
              rules: [{
                required: true,
                trigger: "blur"
              }]
            },
            {
              label: "追踪状态",
              prop: "intentionStatus",
              type: 'tree',
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              dicUrl: '/api/blade-system/dict-biz/dictionary?code=tracking',
              rules: [{
                required: true,
                message: "请输入追踪状态",
                trigger: "blur"
              }]
            },
            {
              label: "流失原因",
              prop: "lostReason",
              display: false,
              type: 'tree',
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              dicUrl: '/api/blade-system/dict-biz/dictionary?code=loss',
              rules: [{
                required: true,
                message: "请输入流失原因",
                trigger: "blur"
              }]
            },
            {
              label: "反馈",
              prop: "feedback",
              type:'textarea',
              minRows:3,
              maxlength:100,
              span:24,
              showWordLimit:true,
              rules: [{
                message: "请输入反馈",
                trigger: "blur"
              }]
            },
          ]
        },
        reverse:true,
        activities:[],
        data: []
      };
    },
    watch: {
      'intentionForm.intentionStatus': {
        handler(val) {
          let loss = this.findObject(this.intentionOption.column, 'lostReason');
          if (val == 3) {
            loss.display = true;
          } else {
            loss.display = false;
          }
        }
      }
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.basicstudentservice_add, false),
          viewBtn: this.vaildData(this.permission.basicstudentservice_view, false),
          delBtn: this.vaildData(this.permission.basicstudentservice_delete, false),
          editBtn: this.vaildData(this.permission.basicstudentservice_edit, false)
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
      },
      handleTimeline(id) {
        this.dialogVisibleTimeline = true;
        console.log(id);
        timeLine(id).then(res => {
          console.log(res)
          this.activities = res.data.data;

        })
      },
      openDialog(row) {
        this.intentionBox = true;
        this.Id = row.Id;
        this.intentionForm.studentServiceId = row.id;
        this.intentionForm.intentionStatus = row.intentionStatus;
        this.intentionForm.lostReason = row.lostReason;
        this.intentionForm.feedback = row.feedback;
      },
      uploadAfter(res, done, loading, column) {
        window.console.log(column);
        this.intentionBox = false;
        this.refreshChange();
        done();
      },
      updateIntention() {
        addIntention(this.intentionForm).then(() => {
          this.onLoad(this.page);
          this.intentionBox = false;
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.done();
        }, error => {
          this.loading();
          window.console.log(error);
        });
      }
    }
  };
</script>

<style>
</style>
