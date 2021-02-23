<template>
  <basic-container>
    <el-container>
      <el-aside width="200px">
      <avue-tree :option="treeOption" :data="treeData" @node-click="nodeClick"></avue-tree>
      </el-aside>
      <el-main>
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
          <template slot="menuLeft" slot-scope="scope">
            <el-button type="primary" icon="el-icon-plus" size="small" plain
                       v-if="permission.storage_add" @click.stop="handleAdd()">新 增</el-button>
<!--            <el-button type="danger"-->
<!--                       size="small"-->
<!--                       icon="el-icon-delete"-->
<!--                       v-if="permission.storage_delete"-->
<!--                       plain-->
<!--                       @click="handleDelete">删 除-->
<!--            </el-button>-->
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button
              type="text"
              icon="el-icon-circle-plus-outline"
              size="small"
              @click.stop="handleAddParent(scope.row,scope.index)"
              v-if="scope.row.type === 1 && permission.storage_add"
            >新增下级
            </el-button>
          </template>
          <template slot-scope="{row}"
                    slot="source">
            <div style="text-align:center">
              <i :class="row.source"/>
            </div>
          </template>
        </avue-crud>
      </el-main>
    </el-container>
  </basic-container>
</template>

<script>
import {
  getLazyList,
  getDetail,
  add,
  update,
  remove,
  dropDown
} from "@/api/warehouse/storage";
import { getWarehouseLazyTree } from "@/api/warehouse/warehouse";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      selectionList: [],
      parentId: 0,
      treeData: [],
      treeId: 0,
      treeOption: {
        nodeKey: "id",
        lazy: true,
        treeLoad: function(node, resolve) {
          const parentId = node.level === 0 ? 0 : node.data.id;
          getWarehouseLazyTree(parentId).then(res => {
            resolve(
              res.data.data.map(item => {
                return {
                  ...item,
                  leaf: !item.hasChildren,
                };
              })
            );
          });
        },
        addBtn: false,
        menu: false,
        size: "small",
        props: {
          labelText: "标题",
          label: "title",
          value: "id",
          children: "children",
        },
      },
      option: {
        height: "auto",
        lazy: true,
        tree: true,
        calcHeight: 30,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: false,
        addBtn: false,
        viewBtn: false,
        selection: false,
        dialogClickModal: false,
        column: [
          {
            label: "名称",
            prop: "name",
            rules: [
              {
                required: true,
                message: "请输入名称",
                trigger: "blur",
              },
              { min: 1, message: "名称最少有1个字符", trigger: "blur" },
            ],
          },
          {
            label: "类型",
            prop: "type",
            type: "radio",
            disabled: false,
            dataType: "number",
            dicData: [
              {
                label: "区",
                value: 1,
              },
              {
                label: "货架",
                value: 2,
              },
              {
                label: "格子",
                value: 3,
              },
            ],
          },
          {
            label: "层",
            prop: "layer",
            type: "number",
            value: 1,
            precision: 0,
            hide:true,
            display: true,
            disabled: false,
            placeholder: "仓库架子层数",
            rules: [
              {
                required: true,
                message: "请输入几层",
                trigger: "blur",
              },
            ],
          },
          {
            label: "格",
            prop: "lattice",
            type: "number",
            value: 1,
            precision: 0,
            hide:true,
            display: true,
            disabled: false,
            placeholder: "仓库一层格子多少",
            rules: [
              {
                required: true,
                message: "请输入几格",
                trigger: "blur",
              },
            ],
          },
          {
            label: "上级",
            prop: "parentId",
            type: "select",
            dicData: [],
            display: true,
            hide: true,
            props: {
              label: "name",
              value: "id",
            },
            rules: [
              {
                required: true,
                message: "请选择上级菜单",
                trigger: "click",
              },
            ],
          },
        ],
      },
      data: [],
    };
  },
  watch: {
    "form.type": {
      handler(val) {
        const layer = this.findObject(this.option.column, "layer");
        const lattice = this.findObject(this.option.column, "lattice");
        const parentId = this.findObject(this.option.column, "parentId");
        if(val === 1){
          parentId.display = false;
          layer.display = false;
          lattice.display = false;
        } else if (val === 2) {
          layer.display = true;
          lattice.display = true;
          parentId.display = true;
          this.initData(1);
        } else if (val === 3) {
          parentId.display = true;
          layer.display = false;
          lattice.display = false;
          this.initData(2);
        }
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.storage_add, false),
        viewBtn: this.vaildData(this.permission.storage_view, false),
        delBtn: this.vaildData(this.permission.storage_delete, false),
        editBtn: this.vaildData(this.permission.storage_edit, false),
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
  },
  methods: {
    initData(type) {
      dropDown(this.treeId,type).then(res => {
        const column = this.findObject(this.option.column, "parentId");
        column.dicData = res.data.data;
      });
    },
    handleAdd() {
      if (this.treeId === 0) {
        this.$message.warning("请选择仓库!");
        return;
      }
      this.$refs.crud.rowAdd();
      this.$refs.crud.option.column.filter(item => {
        if (item.prop === "type") {
          item.value = 1;
          item.disabled = false;
        }
      });
      setTimeout(() => {
        this.form.type = 1;
      }, 10);
    },
    handleAddParent(row) {
      this.$refs.crud.rowAdd();
      this.$refs.crud.value.parentId = row.id;
      this.$refs.crud.option.column.filter(item => {
        if (item.prop === "parentId") {
          item.value = row.id;
          item.addDisabled = true;
        }
        if (item.prop === "type") {
          item.value = row.type + 1;
          item.disabled = true;
        }
      });
    },
    nodeClick(data) {
      this.treeId = data.id;
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    rowSave(row, done, loading) {
      row.warehouseId = this.treeId;
      add(row).then(
        res => {
          // 获取新增数据的相关字段
          if (res.data.success) {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            // 数据回调进行刷新
            done();
            this.refreshChange();
          } else {
            this.$message({
              type: "error",
              message: res.data.msg,
            });
            loading();
          }
        },
        error => {
          loading();
          console.log(error);
          this.$message({
            type: "error",
            message: error.data.msg
          });
        }
      );
    },
    rowUpdate(row, index, done, loading) {
      update(row).then(
        () => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          // 数据回调进行刷新
          done();
          this.refreshChange();
        },
        error => {
          loading();
          console.log(error);
          this.$message({
            type: "error",
            message: error.data.msg
          });
        }
      );
    },
    rowDel(row, index, done) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          // 数据回调进行刷新
          done(row);
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
    searchReset() {
      this.query = {};
      this.parentId = 0;
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.parentId = "";
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
      getLazyList(
        this.parentId,
        this.treeId,
        Object.assign(params, this.query)
      ).then(res => {
        this.data = res.data.data;
        this.loading = false;
        this.selectionClear();
      });
    },
    treeLoad(tree, treeNode, resolve) {
      const parentId = tree.id;
      getLazyList(parentId, this.treeId).then(res => {
        resolve(res.data.data);
      });
    },
  },
};
</script>

<style>
</style>
