<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               ref="crud"
               v-model="form"
               :permission="permissionList"
               :before-open="beforeOpen"
               :before-close="beforeClose"
               @row-del="rowDel"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad"
               @tree-load="treeLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   v-if="permission.menu_delete"
                   plain
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          icon="el-icon-circle-plus-outline"
          size="small"
          @click.stop="handleAdd(scope.row,scope.index)"
        >新增子项
        </el-button>
      </template>
      <template slot-scope="{row}"
                slot="source">
        <div style="text-align:center">
          <i :class="row.source"/>
        </div>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getLazyList, remove, update, add, getDetail,getScopeTree} from "@/api/base/scope";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        form: {},
        query: {},
        loading: true,
        selectionList: [],
        parentId: 0,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0,
        },
        option: {
          height:'auto',
          lazy: true,
          tip: false,
          menuFixed:false,
          simplePage: true,
          searchShow: true,
          searchMenuSpan: 6,
          dialogWidth: "60%",
          tree: true,
          border: true,
          index: false,
          selection: true,
          viewBtn: true,
          menuWidth: 300,
          dialogClickModal: false,
          column: [
            {
              label: "经营范围",
              prop: "name",
              search: true,
              rules: [
                {
                  required: true,
                  message: "请输入分类名称",
                  trigger: "blur"
                },
                { min: 1, max: 50, message: '经营范围长度在 1 到 50个字符', trigger: 'blur' }
              ]
            },
            {
              label: "上级菜单",
              prop: "parentId",
              type: "tree",
              dicData: [],
              hide: true,
              props: {
                label: "title",
                value: "id"
              },
              rules: [
                {
                  required: false,
                  message: "请选择上级菜单",
                  trigger: "click"
                }
              ]
            },
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters([ "permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.warehouse_add, false),
          viewBtn: this.vaildData(this.permission.warehouse_view, false),
          delBtn: this.vaildData(this.permission.warehouse_delete, false),
          editBtn: this.vaildData(this.permission.warehouse_edit, false)
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
      initData() {
        getScopeTree().then(res => {
          const column = this.findObject(this.option.column, "parentId");
          column.dicData = res.data.data;
        });
      },
      handleAdd(row) {
        this.$refs.crud.value.parentId = row.id;
        this.$refs.crud.option.column.filter(item => {
          if (item.prop === "parentId") {
            item.value = row.id;
            item.addDisabled = true;
          }
        });
        getScopeTree().then(res => {
          this.$refs.crud.updateDic("parentId", res.data.data);
        });
        this.$refs.crud.rowAdd();
      },
      rowSave(row, done, loading) {
        add(row).then((res) => {
          // 获取新增数据的相关字段
          const data = res.data.data;
          row.id = data.id;
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          // 数据回调进行刷新
          done(row);
        }, error => {
          this.$message({
            type: "error",
            message: error.data.msg
          });
          loading();
        });
      },
      rowUpdate(row, index, done, loading) {
        update(row).then(() => {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          // 数据回调进行刷新
          done(row);
        }, error => {
          this.$message({
            type: "error",
            message: error.data.msg
          });
          loading();
        });
      },
      rowDel(row, index, done) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            // 数据回调进行刷新
            done(row);
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
            // 刷新表格数据并重载
            this.data = [];
            this.parentId = 0;
            this.$refs.crud.refreshTable();
            this.$refs.crud.toggleSelection();
            // 表格数据重载
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      searchReset() {
        this.query = {};
        this.parentId = 0;
        this.onLoad(this.page);
      },
      searchChange(params, done) {
        this.query = params;
        this.parentId = '';
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
      beforeOpen(done, type) {
        if (["add", "edit"].includes(type)) {
          this.initData();
        }
        if (["edit", "view"].includes(type)) {
          getDetail(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        done();
      },
      beforeClose(done) {
        this.$refs.crud.tableForm = {};
        this.$refs.crud.value.parentId = "";
        this.$refs.crud.value.addDisabled = false;
        this.$refs.crud.option.column.filter(item => {
          if (item.prop === "parentId") {
            item.value = "";
            item.addDisabled = false;
          }
        });
        done();
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
        getLazyList(this.parentId, Object.assign(params, this.query)).then(res => {
          this.data = res.data.data;
          this.loading = false;
          this.selectionClear();
        });
      },
      treeLoad(tree, treeNode, resolve) {
        const parentId = tree.id;
        getLazyList(parentId).then(res => {
          resolve(res.data.data);
        });
      }
    }
  };
</script>

<style>
</style>
