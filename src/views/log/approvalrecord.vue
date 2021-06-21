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
                   v-if="permission.approvalrecord_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/log/approvalrecord";
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
          menu: false,
          selection: true,
          dialogClickModal: false,
          column: [
            /*{
              label: "审核id",
              prop: "auditId",
              hide:false,
              rules: [{
                required: true,
                message: "请输入审核id",
                trigger: "blur"
              }]
            },*/
            {
              label: "审核人",
              sortable:true,
              prop: "reviewer",
              searchLabelWidth:130,
              rules: [{
                required: true,
                message: "请输入审核人",
                trigger: "blur"
              }],
           //   search: true
            },
            {
              label: "操作",
              prop: "operation",
              searchLabelWidth:130,
             // type: 'select',
             // addDisplay: false,
             // editDisplay: false,
              //viewDisplay: false,
              //search: true,
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              dicUrl: "/api/blade-system/dict/dictionary?code=operation"
            },


            {
              label: "旧审批状态",
              prop: "oldStatus",
              searchLabelWidth:130,
              type: 'select',
              addDisplay: false,
              editDisplay: false,
              viewDisplay: false,
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },

             // search: true,
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=quality_audit",
            },
            {
              label: "新审核状态",
              prop: "newStatus",
              searchLabelWidth:130,
              type: 'select',
              addDisplay: false,
              editDisplay: false,
              viewDisplay: false,
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
             // search: true,
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=quality_audit",
            },
            {
              label: "类型",
              prop: "type",
              rules: [{
                required: true,
                message: "请输入类型",
                trigger: "blur"
              }],
            },
            /*{
              label: "表名",
              prop: "auditTableName",
              rules: [{
                required: true,
                message: "请输入表名",
                trigger: "blur"
              }]
            },*/
            {
              label: "备注",
              prop: "rejectText",
            },
            {
              label: "创建时间",
              prop: "createTime",
              type: "datetime",
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
              searchRange: true,
              searchSpan: 8,
              addDisplay: false,
              editDisplay: false,
              search: true,
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
          addBtn: this.vaildData(this.permission.approvalrecord_add, false),
          viewBtn: this.vaildData(this.permission.approvalrecord_view, false),
          delBtn: this.vaildData(this.permission.approvalrecord_delete, false),
          editBtn: this.vaildData(this.permission.approvalrecord_edit, false)
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
      //时间
      onLoad(page, params = {}) {
        const {createTime} = params;
        let values = {
          ...params,
        };
        if (createTime) {
          values = {
            ...params,
            startTime: createTime[0],
            endTime: createTime[1],
          };
          values.createTime = null;
          this.query.createTime = null;
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
