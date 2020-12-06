<template>
  <basic-container>
    <div style="" id="printMe" ref="print" >
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
        <el-button type="primary"
                   size="small"
                   icon="el-icon-plus"
                   plain
                   @click="print">打印交接单
        </el-button>
      </template>
      <template slot="distributionOrderNumber" slot-scope="{scope,row}">
        <el-tag>{{row.distributionOrderNumberPrefix+row.distributionOrderNumber}}</el-tag>
      </template>
    </avue-crud>
    <!--<div style="" id="printMe" ref="print" >
      <el-table
        :data="data"
        border
        style="width: 90%;padding: 0px;margin: 0px;">
        <el-table-column
          label="单号"
          width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.distributionOrderNumberPrefix+scope.row.distributionOrderNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="hospitalName"
          label="医院"
          width="180">
        </el-table-column>
        <el-table-column
          prop="pspnum"
          label="处方号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="orderType"
          label="类型"
          width="180">
        </el-table-column>
      </el-table>-->
    </div>
  </basic-container>
</template>

<script>
  import {getList} from "@/api/logistics/distributionorder";
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
        dialogVisible:false,
        selectionList: [],
        option: {
          height: 'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: false,
          viewBtn: false,
          selection: true,
          printBtn: true,
          dialogClickModal: false,
          column: [
            {
              label: "单号",
              prop: "distributionOrderNumber",
              slot: true,
              addDisplay: false,
              editDisplay: false,
              width: 180,
              search: true,
              rules: [{
                required: true,
                message: "请输入单号",
                trigger: "blur"
              }]
            },
            {
              label: "医院",
              prop: "hospitalName",
            },
            {
              label: "处方号",
              prop: "pspnum",
            },
            {
              label: "类型",
              prop: "orderType",
            },
            {
              label: "接方时间",
              prop: "receivingDate",
              type: "date",
              format: "yyyy-MM-dd",
              valueFormat: "yyyy-MM-dd",
            },
            {
              label: "收件人",
              prop: "addresseeName",
              rules: [{
                required: true,
                message: "请输入收件人",
                trigger: "blur"
              }]
            },
            {
              label: "收件人地址",
              prop: "addresseeAddress",
              width: 180,
              rules: [{
                required: true,
                message: "请输入收件人地址",
                trigger: "blur"
              }]
            },
            {
              label: "收件人手机号",
              prop: "addresseePhone",
              width: 180,
              rules: [{
                required: true,
                message: "请输入收件人手机号",
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
          addBtn: this.vaildData(this.permission.distributionrecord_add, false),
          viewBtn: this.vaildData(this.permission.distributionrecord_view, false),
          delBtn: this.vaildData(this.permission.distributionrecord_delete, false),
          editBtn: this.vaildData(this.permission.distributionrecord_edit, false)
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
      },
      print(){
        this.$Print(this.$refs.print);
      }
    }
  };
</script>

<style>
</style>
