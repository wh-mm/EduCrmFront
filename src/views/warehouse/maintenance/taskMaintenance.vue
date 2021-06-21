<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               :before-open="beforeOpen"
               v-model="form"
               ref="crud"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="success"
                   size="small"
                   plain
                   icon="el-icon-upload2"
                   v-if="permission.taskMaintenance_import"
                   @click="handleImport">导入
        </el-button>
        <el-button type="warning"
                   size="small"
                   plain
                   icon="el-icon-download"
                   v-if="permission.taskMaintenance_export"
                   @click="handleExport">导出
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button :size="scope.size" :type="scope.type" v-if="scope.row.statusTime === '1'||scope.row.statusTime === '3'"
                   @click="maintenanceShow(scope.row.repertoryId)">养护结果
        </el-button>
      </template>
      <template slot="statusTime" slot-scope="scope">
        <span v-if="scope.row.statusTime === '1'" style="color: #1f94f4">等待保养</span>
        <span v-if="scope.row.statusTime === '2'" style="color: #e1aa10">时间未到</span>
        <span v-if="scope.row.statusTime === '3'" style="color: #ed0909">超时</span>
      </template>
    </avue-crud>

    <el-dialog title="养护完成"
               append-to-body
               :visible.sync="maintenanceBox"
               width="555px">
      <avue-form :option="maintenanceOption" v-model="maintenanceForm" @submit="maintenance">
      </avue-form>
    </el-dialog>

    <el-dialog title="库存数据导入"
               append-to-body
               :visible.sync="excelBox"
               width="555px">
      <avue-form :option="excelOption" v-model="excelForm" :upload-after="uploadAfter">
      </avue-form>
    </el-dialog>

  </basic-container>
</template>

<script>
  import {getList,saveMaintenance} from "@/api/warehouse/taskMaintenance";
  import {mapGetters} from "vuex";
  import {getToken} from "@/util/auth";

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
          selection: false,
          addBtn: false,
          viewBtn: false,
          delBtn: false,
          editBtn: false,
          dialogClickModal: false,
          column: [
            {
              label: "状态",
              prop : "statusTime",
              slot : true,
            },
            {
              label: "仓库",
              prop: "warehouseId",
              type: 'tree',
              row: true,
              search: true,
              span: 24,
              props: {
                label: 'title',
                value: 'value'
              },
              cascaderItem: ['storageRegionId', 'storageId'],
              rules: [{
                required: true,
                message: "请输入仓库",
                trigger: "blur"
              }],
              dicUrl: '/api/erp-wms/warehouse/tree'
            },

            {
              label: "区域",
              prop: "storageRegionId",
              type: 'tree',
              search: true,
              row: true,
              span: 24,
              rules: [{
                required: true,
                message: "请输入储位",
                trigger: "blur"
              }],
              props: {
                label: 'title',
                value: 'id'
              },
              dicUrl: '/api/erp-wms/storage/queryRegionTree?warehouseId={{key}}'
            },
            {
              label: "储位",
              prop: "storageId",
              type: 'tree',
              row: true,
              span: 24,
              rules: [{
                required: true,
                message: "请输入储位",
                trigger: "blur"
              }],
              props: {
                label: 'title',
                value: 'id'
              },
              dicUrl: '/api/erp-wms/storage/tree?warehouseId={{key}}'
            },
            {
              label: "商品",
              prop: "goodsId",
              type: 'tree',
              search: true,
              row: true,
              span: 24,
              props: {
                label: 'goodsName',
                value: 'id'
              },
              dicMethod: "post",
              dicUrl: 'api/erp-wms/goods/selecListGoods',
            },
            {
              label: "批号",
              prop: "batchNumber",
              search: true,
            },
            {
              label: "养护时间",
              prop: "maintainTime",
              dateDefault: true,
              type: "date",
              searchSpan: 12,
              searchRange: true,
              search: true,
              width : 150,
              format: "yyyy-MM-dd",
              valueFormat: "yyyy-MM-dd",
            },
            {
              label: "生产日期",
              prop: "dateOfManufacture",
              type: 'date',
              format: "yyyy-MM-dd",
              valueFormat: "yyyy-MM-dd",
            },
            {
              label: "有效期至",
              prop: "periodOfValidity",
              type: 'date',
              format: "yyyy-MM-dd",
              valueFormat: "yyyy-MM-dd",
            },
            {
              label: "产地",
              prop: "placeOfOrigin",
            },
            {
              label: "生产厂家",
              prop: "manufacturer",
            },
            {
              label: "供应商名称",
              prop: "supplierName",
            },
            {
              label: "库存数量",
              prop: "repertoryQuantity",
            },
            {
              label: "包装规格",
              prop: "packageSpecification",
            },
            {
              label: "包装数量",
              prop: "packageQuantity",
            },
            {
              label: "规格等级",
              prop: "specificationLevel",
            },
            {
              label: "入库时间",
              prop: "createTime",
              type: "datetime",
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
            },
          ],
        },
        data: [],
        maintenanceBox: false,
        maintenanceForm: {},
        maintenanceOption: {
          column: [
            {
              label: "养护结果",
              prop: "maintenanceResults",
              row: true,
              span: 24,
            },
            {
              label: "异常情况",
              prop: "abnormalPhenomenon",
              row: true,
              span: 24,
            },
            {
              label: "采取措施",
              prop: "takeSteps",
              row: true,
              span: 24,
            },
            {
              label: "采取措施后的结果",
              prop: "takeStepsResults",
              type: "textarea",
              labelWidth: 150,
              span: 24,
              row: true,
            },
          ],
        },
        excelBox: false,
        excelForm: {},
        excelOption: {
          submitBtn: false,
          emptyBtn: false,
          column: [
            {
              label: '模板上传',
              prop: 'excelFile',
              type: 'upload',
              drag: true,
              loadText: '模板上传中，请稍等',
              span: 24,
              propsHttp: {
                res: 'data'
              },
              tip: '请上传 .xls,.xlsx 标准格式文件',
              action: this.ERP_WMS_NAME + "/task-maintenance/import"
            },
          ]
        },
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
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
        const {maintainTime} = params;
        let values = {
          ...params,
        };
        if (maintainTime) {
          values = {
            ...params,
            startTime: maintainTime[0],
            endTime: maintainTime[1],
          };
          values.maintainTime = null;
          this.query.maintainTime = null;
        }
        getList(page.currentPage, page.pageSize, Object.assign(values, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      },
      maintenanceShow(repertoryId) {
        this.maintenanceForm.repertoryId = repertoryId;
        this.maintenanceBox = true;
      },
      maintenance() {
        saveMaintenance(this.maintenanceForm).then(res => {
          this.maintenanceBox = false;
          this.$message.info(res.data.msg);
          this.searchReset();
        })
      },
      handleImport() {
        this.excelBox = true;
      },
      uploadAfter(res, done, loading, column) {
        window.console.log(column);
        this.excelBox = false;
        this.searchReset();
        done();
      },
      handleExport() {
        this.$confirm("是否导出养护任务数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          window.open(this.ERP_WMS_NAME + `/task-maintenance/export?${this.website.tokenHeader}=${getToken()}`);
        });
      },
    }
  };
</script>

<style>
</style>
