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
               @on-load="onLoad"
               @tree-load="treeLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.warehouse_delete"
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
  import {getList,getLazyList, getDetail, add, update, remove,testingOnlyCode,selectName,
    getWarehouseTree} from "@/api/warehouse/warehouse";
  import {mapGetters} from "vuex";

  export default {
    data() {
      var codeTestingOnly = (rule,value,callback) =>{
        if (value === ''){
          callback(new Error("请输入编码！"))
        }else {
          testingOnlyCode(this.form.id,value).then( res => {
            if(res.data.success){
              callback();
            }else{
              callback(new Error(res.data.msg));
            }
          },err =>{
            callback(new Error(err.data.msg));
          })
        }
      }
      var selectWarehouseName = (rule,value,callback) =>{
        if (value === ''){
          callback(new Error("请输入仓库名称！"))
        }else {
          selectName(this.form.id,value).then( res => {
            if(res.data.success){
              callback();
            }else{
              callback(new Error(res.data.msg));
            }
          },err =>{
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
        parentId: 0,
        selectionList: [],
        option: {
          height:'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          tree: true,
          lazy: true,
          viewBtn: true,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "仓库名称",
              prop: "name",
              search: true,
              rules: [{
                required: true,
                validator:selectWarehouseName,
                trigger: "blur"
              },
              { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
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
            {
              label: "编码",
              prop: "code",
              append: "仓库唯一编号",
              rules: [{
                required: true,
                validator: codeTestingOnly,
                trigger: "blur"
              },

               { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
              ]

            },
            {
              label: "地址",
              prop: "addressArray",
              type: "cascader",
              rules: [{
                required: true,
                message: "请输入地址",
                trigger: "blur"
              }],
              props: {
                label: "title",
                value: "id"
              },
              dicUrl: "/api/blade-system/region/lazy-tree",
            },
            {
              label: "详细地址",
              prop: "addressDetail",
              rules: [{
                required: true,
                message: "请输入详细地址",
                trigger: "blur"
              }]
            },
            {
              label:"创建时间",
              prop:"updateTime",
              editDisplay: false,
              addDisplay: false,
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
        getWarehouseTree().then(res => {
          const column = this.findObject(this.option.column, "parentId");
          column.dicData = res.data.data;
        });
      },
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
      handleAdd(row) {
        this.$refs.crud.value.parentId = row.id;
        this.$refs.crud.option.column.filter(item => {
          if (item.prop === "parentId") {
            item.value = row.id;
            item.addDisabled = true;
          }
        });
        this.$refs.crud.rowAdd();
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
