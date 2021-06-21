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
                   v-if="permission.pack_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/basic/pack";
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
              label: "包含课程",
              prop: "coursePack",
              type: "tree",
              rules: [
                {
                  required: true,
                  message: "请输入包含课程",
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
              label: "包含教师",
              prop: "teacherPack",
              type: "tree",
              rules: [
                {
                  required: true,
                  message: "请输入包含教师",
                  trigger: "blur"
                }
              ],
              dicUrl: "/api/teacher/selectAll",
              props: {
                label: "nameTeacher",
                value: "id"
              }
            },
            {
              label: "所属学校",
              prop: "schoolPack",
              type: "tree",
              rules: [
                {
                  required: true,
                  message: "请选择订单类型",
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
              label: "课包类型",
              prop: "typePack",
              type: 'select',
              span: 6,
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              dicUrl: '/api/blade-system/dict-biz/dictionary?code=packtype',
              rules: [{
                required: true,
                message: "请输入课包类型",
                trigger: "blur"
              }]
            },
            {
              label: "课时",
              prop: "durationPack",
              display:false,
              rules: [{
                required: true,
                message: "请输入课时",
                trigger: "blur"
              }]
            },
            {
              label: "次数",
              prop: "amountPack",
              display:false,
              rules: [{
                required: true,
                message: "请输入次数",
                trigger: "blur"
              }]
            },
            {
              label: "价格",
              prop: "pricePack",
              rules: [{
                required: true,
                message: "请输入价格",
                trigger: "blur"
              }]
            },
            {
              label: "备注",
              prop: "remarkPack",
              type:'textarea',
              minRows:3,
              maxlength:100,
              span:24,
              showWordLimit:true,
              rules: [{
                message: "请输入备注",
                trigger: "blur"
              }]
            },
          ]
        },
        data: []
      };
    },
    watch: {
      'form.typePack': {
        handler(val) {
          let duration = this.findObject(this.option.column, 'durationPack')
          let amount = this.findObject(this.option.column, 'amountPack')
          // let price = this.findObject(this.option.column, 'pricePack')
          if (val == 1) {
            duration.display = true;
            amount.display = false
          } else if (val == 2) {
            duration.display = false;
            amount.display = true
          }
        }
      }
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.pack_add, false),
          viewBtn: this.vaildData(this.permission.pack_view, false),
          delBtn: this.vaildData(this.permission.pack_delete, false),
          editBtn: this.vaildData(this.permission.pack_edit, false)
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
