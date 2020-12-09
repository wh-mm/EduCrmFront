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
        <el-button type="button"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.approvalprocess_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>

  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/approval/approvalprocess";
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
          menu: false,
          dialogClickModal: false,
          column: [
            {
              label: "审批采购单号",
              prop: "approvalOrderNumber",
              rules: [{
                required: true,
                message: "请输入审批类型",
                trigger: "blur"
              }]
            },
            {
              label: "旧审核状态",
              prop: "oldStatusName",
              rules: [{
                required: true,
                message: "请输入新审核状态",
                trigger: "blur"
              }]
            },
            {
              label: "审批状态",
              prop: "approvalStatusName",
              type:"select",
              rules: [{
                required: true,
                message: "请输入审批状态",
                trigger: "blur"
              }],
            },
            {
              label: "审批人员",
              prop: "approver",
              rules: [{
                required: true,
                message: "请输入审批人员",
                trigger: "blur"
              }]
            },
            {
              label:"记录创建时间",
              prop:"updateTime",
              dateDefault: true,
              addDisplay: false,
              viewDisplay: false,
              type: "datetime",
              searchSpan:12,
              searchRange:true,
              search:true,
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
            },
          ]
        },
        data: [],

      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.approvalprocess_add, false),
          viewBtn: this.vaildData(this.permission.approvalprocess_view, false),
          delBtn: this.vaildData(this.permission.approvalprocess_delete, false),
          editBtn: this.vaildData(this.permission.approvalprocess_edit, false)
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
        const {updateTime} = params;
        let values = {
          ...params,
        };
        if (updateTime) {
          values = {
            ...params,
            start_time: updateTime[0],
            end_time: updateTime[1],
          };
          values.updateTime = null;
          this.query.updateTime = null;
        }
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(values, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      },

    }
  };
</script>

<style>
</style>
