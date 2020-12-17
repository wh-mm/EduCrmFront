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
        <el-button type="primary"
                   size="small"
                   icon="el-icon-plus"
                   plain
                   @click="viewTransport()">发起运输单
        </el-button>
      </template>
      <template slot="orderNumber" slot-scope="{scope,row}">
        <el-tag>{{row.distributionOrderNumberPrefix+row.distributionOrderNumber}}</el-tag>
      </template>
    </avue-crud>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="80%"
      :modal="false"
      :before-close="handleClose">
      <avue-form ref="transportForm" v-model="obj" :option="transportOption" @submit="submitTransport">
      </avue-form>
      <avue-crud :data="selectionList" :option="transportListOption">
        <template slot="orderNumber" slot-scope="{scope,row}">
          <el-tag>{{row.distributionOrderNumberPrefix+row.distributionOrderNumber}}</el-tag>
        </template>
      </avue-crud>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove,submitTransport} from "@/api/logistics/handoverform";
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
        dialogVisible: false,
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
              label: '单号',
              prop: 'orderNumber',
              slot: true,
              addDisplay: false,
              editDisplay: false,
              width: 180,
              search: true,
            },
            {
              label: "医院名称",
              prop: "hospitalId",
              type: "select",
              props: {
                label: "hospitalName",
                value: "id"
              },
              span: 6,
              search: true,
              filterable: true,
              remote: true,
              dicUrl: "/api/taocao-hisHospital/hospital/selectHosptalByName?name={{key}}"
            },
            {
              label: "状态",
              prop: "statusName",
              addDisplay: false,
              editDisplay: false,
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=handover_form_status",
              props: {
                label: "dictValue",
                value: "dictKey"
              }
            },
          ]
        },
        data: [],
        transportListOption: {
          calcHeight: 30,
          border: true,
          index: false,
          viewBtn: false,
          addBtn: false,
          selection: false,
          columnBtn: false,
          refreshBtn: false,
          menu: false,
          dialogClickModal: false,
          column: [
            {
              label: '单号',
              prop: 'orderNumber',
              slot: true,
            },
            {
              label: "医院名称",
              prop: "hospitalId",
              type: "select",
              props: {
                label: "hospitalName",
                value: "id"
              },
              dicUrl: "/api/taocao-hisHospital/hospital/selectHosptalByName?name={{key}}"
            },
          ]
        },
        transportData: [],
        transportForm: {},
        transportOption: {
          height: 'auto',
          calcHeight: 30,
          border: true,
          menu: false,
          menuPosition: "right",
          dialogClickModal: false,
          column: [
            {
              label: "车辆",
              prop: "carId",
              type: 'select',
              search: true,
              props: {
                label: 'name',
                value: 'id'
              },
              rules: [{
                required: true,
                message: "请选择运送车辆",
                trigger: "blur"
              }],
              dicUrl: '/api/logistics/taocar/selectTaoCar'
            },
            {
              label: "司机",
              prop: "driverId",
              type: 'select',

              props: {
                label: 'name',
                value: 'id'
              },
              rules: [{
                required: true,
                message: "请选择运送人员",
                trigger: "blur"
              }],
              dicUrl: '/api/logistics/taodriver/selectTaodriver'
            },
          ]
        }
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: false,
          viewBtn: false,
          delBtn: false,
          editBtn: false
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
      viewTransport() {
        if(this.ids){
          this.dialogVisible = true;
        }else{
          this.$message({
            type: 'info',
            message: '请选择配送单'
          });
        }
      },
      submitTransport() {
        submitTransport(this.obj.carId,this.obj.driverId,this.ids).then(res => {
          if(res.data.success){
            this.$message({
              type: 'success',
              message: res.data.msg
            });
            this.dialogVisible = false;
            this.refreshChange();
          }

        })
      },
    }
  };
</script>

<style>
</style>
