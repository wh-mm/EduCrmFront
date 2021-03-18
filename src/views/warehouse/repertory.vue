<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               :permission="permissionList"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
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
                   v-if="permission.repertory_import_init"
                   @click="handleImportInit">初始化导入
        </el-button>
        <el-button type="success"
                   size="small"
                   plain
                   icon="el-icon-upload2"
                   v-if="permission.repertory_import"
                   @click="handleImport">导入
        </el-button>
        <el-button type="warning"
                   size="small"
                   plain
                   icon="el-icon-download"
                   v-if="permission.repertory_export"
                   @click="handleExport">导出
        </el-button>
        <el-button type="warning"
                   size="small"
                   plain
                   icon="el-icon-download"
                   v-if="permission.repertory_export"
                   @click="handleCheckExportDialog">导出盘点模板
        </el-button>
      </template>


    <template slot="menu" slot-scope="scope">
      <el-button type="text" size="small"  v-if="permission.repertory_realDelete" icon="el-icon-warning" @click="deleteRepertory(scope.row.id)">删除</el-button>
<!--      &lt;!&ndash;全部&ndash;&gt;-->
<!--      <el-button type="text" size="small" @click="oneTransferDialog(scope.row)" >全移库</el-button>-->
      <!--单体-->
      <el-button type="text" size="small" @click="AllTransferDialog(scope.row)" >移库</el-button>
    </template>


    </avue-crud>
<!--    <el-dialog title="全移库"-->
<!--               append-to-body-->
<!--               :visible.sync="dialogOne"-->
<!--               width="555px">-->
<!--      <template slot-scope="scope">-->
<!--        <avue-form :option="optionOne"  v-model="formOne"  @submit="oneTransfer">-->
<!--        </avue-form>-->
<!--      </template>-->

<!--    </el-dialog>-->
    <el-dialog title="移库"
               append-to-body
               :visible.sync="dialogAll"
               width="555px">
      <template slot-scope="scope">
        <avue-form :option="optionAll"  v-model="formAll"  @submit="saveALLTransfer">
        </avue-form>
      </template>

    </el-dialog>

    <el-dialog title="库存数据导入"
               append-to-body
               :visible.sync="excelBox"
               width="555px">
      <avue-form :option="excelOption" v-model="excelForm" :upload-after="uploadAfter">
      </avue-form>
    </el-dialog>

    <el-dialog title="盘点模板导出"
               append-to-body
               :visible.sync="checkDialog"
               width="555px">
      <avue-form :option="excelCheckOption" v-model="excelCheckForm" :upload-after="uploadAfter">
        <template slot="excelTemplate">
          <el-button type="primary" @click="handleCheckExport">
            点击下载<i class="el-icon-download el-icon--right"></i>
          </el-button>
        </template>
      </avue-form>
    </el-dialog>

    <el-dialog title="初始化库存数据导入"
               append-to-body
               :visible.sync="excelBoxInit"
               width="555px">
      <avue-form :option="excelOptionInit" v-model="excelFormInit" :upload-after="uploadAfterInit">
        <template slot="excelTemplate">
          <el-button type="primary" @click="handleTemplate">
            点击下载<i class="el-icon-download el-icon--right"></i>
          </el-button>
        </template>
      </avue-form>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {getList,deleteRepertory,update} from "@/api/warehouse/repertory";
  import {add} from "@/api/warehouse/warehouseinoutput";
  import {mapGetters} from "vuex";
  import {getToken} from "@/util/auth";
  import { saveALLTransfer } from "@/api/warehouse/transfer/alltransfer";
  export default {
    data() {

      return {
        formOne: {},
        formAll: {},
        form: {},
        query: {},
        loading: true,
        checkStatus:0,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        obj:{},
        title: '' ,
        dialogVisible:false,
        checkDialog:false,
        dialogOne:false,
        dialogAll:false,
        selectionList: [],
        option: {
          height:'auto',
          calcHeight: 10,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          menu: true,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "仓库",
              prop: "warehouseId",
              type:'tree',
              row: true,
              search:true,
              sortable:true,
              span: 24,
              props: {
                label: 'title',
                value: 'value'
              },
              cascaderItem: ['storageRegionId','storageId'],
              dicUrl:'/api/erp-wms/warehouse/tree'
            },

            {
              label: "区域",
              prop: "storageRegionId",
              type:'tree',
              search:true,
              sortable:true,
              props: {
                label: 'title',
                value: 'id'
              },
              dicUrl:'/api/erp-wms/storage/queryRegionTree?warehouseId={{key}}'
            },
            {
              label: "储位",
              prop: "storageName",
              type:'tree',
              sortable:true,
            },
            {
              label: "商品",
              prop: "goodsId",
              type:'tree',
              search:true,
              sortable:true,
              props: {
                label: 'goodsName',
                value: 'id'
              },
              dicMethod:"post",
              dicUrl: 'api/erp-wms/goods/selecListGoods',

            },
            {
              label: "索引码",
              prop: "goodsCode",
              width:90,
              search:true,
              sortable:true,
            },
            {
              label: "批号",
              prop: "batchNumber",
              search:true,
              sortable:true,
            },
            {
              label: "生产日期",
              prop: "dateOfManufacture",
              type:'datetime',
              format: "yyyy-MM-dd",
              valueFormat: "yyyy-MM-dd",
              sortable:true,
              width:100,
            },
            {
              label: "有效期至",
              prop: "periodOfValidity",
              type:'datetime',
              format: "yyyy-MM-dd",
              valueFormat: "yyyy-MM-dd",
              sortable:true,
              width:100,
            },
            {
              label: "产地",
              prop: "placeOfOrigin",
              sortable:true,
            },
            {
              label: "生产厂家",
              prop: "manufacturer",
              sortable:true,
              width:100,
            },
            {
              label: "供应商",
              prop: "supplierName",
              sortable:true,
              type:'select',
              width:100,
              props:{
                label:'supplierName',
                value:'id'
              },
              dicUrl: '/api/quality/information/dropDownsss'
            },
            {
              label: "库存数量",
              prop: "repertoryQuantity",
              sortable:true,
              width:100,
            },
            {
              label: '规格',
              prop: "specification",
              placeholder: " ",
              width: 140,
              type: "select",
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=specifications"
            },
            {
              label: "包装规格",
              prop: "packageSpecification",
              sortable:true,
              width:100,
            },
            {
              label: "包装数量",
              prop: "packageQuantity",
              sortable:true,
              width:100,
            },
            {
              label: "规格等级",
              prop: "specificationLevel",
              sortable:true,
              width:100,
            },
            {
              label: "备注",
              prop: "remark",
              sortable:true,
            },

            {
              label: "入库时间",
              prop: "createTime",
              dateDefault: true,
              addDisplay: false,
              viewDisplay: false,
              type: "datetime",
              width:100,
              searchSpan:12,
              searchRange:true,
              sortable:true,
              search:true,
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
            },
          ],
          showSummary: false,
          sumColumnList: [
            {
              label:'总数:',
              name: 'repertoryQuantity',
              type: 'sum',
              decimals:1
            }
          ],
        },
        data: [],
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
              action: this.ERP_WMS_NAME + "/repertory/import"
            },
          ]
        },
        excelCheckForm: {},
        excelCheckOption: {
          submitBtn: false,
          emptyBtn: false,
          column: [
            {
              label: "仓库",
              prop: "warehouseId",
              type:'tree',
              row: true,
              search:true,
              sortable:true,
              span: 24,
              props: {
                label: 'title',
                value: 'value'
              },
              cascaderItem: ['storageRegionId','storageId'],
              rules: [{
                required: true,
                message: "请输入仓库",
                trigger: "blur"
              }],
              dicUrl:'/api/erp-wms/warehouse/tree'
            },
            {
              label: '模板下载',
              prop: 'excelTemplate',
              formslot: true,
              span: 24,
            }
          ]
        },

        excelBoxInit: false,
        excelFormInit: {},
        excelOptionInit: {
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
              action: this.ERP_WMS_NAME + "/repertory/importInit"
            },
            {
              label: '模板下载',
              prop: 'excelTemplate',
              formslot: true,
              span: 24,
            }
          ]
        },
        optionOne: {
          column: [
            {
              label: "仓库",
              prop: "oldWarehouseId",
              type:'tree',
              row: true,
              search:true,
              sortable:true,
              disabled:true,
              span: 24,
              props: {
                label: 'title',
                value: 'value'
              },
              cascaderItem: ['oldStorageRegionId','oldStorageId'],
              dicUrl:'/api/erp-wms/warehouse/tree'
            },

            {
              label: "区域",
              prop: "oldStorageRegionId",
              type:'tree',
              search:true,
              sortable:true,
              disabled:true,
              props: {
                label: 'title',
                value: 'id'
              },
              dicUrl:'/api/erp-wms/storage/queryRegionTree?warehouseId={{key}}'
            },
          {
          label: "储位",
          prop: "oldStorageId",
          type:'tree',
          disabled:true,
          rules: [{
          message: "请输入储位id",
          trigger: "blur"
          }],
            props: {
              label: 'title',
              value: 'id'
            },
            dicUrl:'/api/erp-wms/storage/tree?storageRegionId={{key}}'
          },
            {
              label: "商品",
              prop: "goodsId",
              type:'tree',
              search:true,
              sortable:true,
              props: {
                label: 'goodsName',
                value: 'id'
              },
              dicMethod:"post",
              dicUrl: '/api/erp-wms/goods/selecListGoods',
            },
            {
              label: "商品编码",
              prop: "goodsCode",
              disabled:true,
              rules: [{
                message: "请输入商品编码",
                trigger: "blur"
              }]
            },
            {
              label: "规格",
              prop: "specification",
              disabled:true,
              rules: [{
                message: "请输入规格",
                trigger: "blur"
              }]
            },

            {
              label: "仓库",
              prop: "newWarehouseId",
              type:'tree',
              row: true,
              search:true,
              sortable:true,
              span: 24,
              props: {
                label: 'title',
                value: 'value'
              },
              cascaderItem: ['newStorageRegionId','newStorageId'],
              dicUrl:'/api/erp-wms/warehouse/tree'
            },

            {
              label: "区域",
              prop: "newStorageRegionId",
              type:'tree',
              search:true,
              sortable:true,
              props: {
                label: 'title',
                value: 'id'
              },
              dicUrl:'/api/erp-wms/storage/queryRegionTree?warehouseId={{key}}'
            },
            {
              label: "储位",
              prop: "newStorageId",
              type:'tree',
              rules: [{
                message: "请输入储位id",
                trigger: "blur"
              }],
              props: {
                label: 'title',
                value: 'id'
              },
              dicUrl:'/api/erp-wms/storage/tree?storageRegionId={{key}}'
            },
          ]
        },
        optionAll: {
          column: [
            {
              label: "仓库",
              prop: "oldWarehouseId",
              type:'tree',
              disabled:true,
              rules: [{
                required: true,
                message: "请输入仓库id",
                trigger: "blur"
              }],
              props: {
                label: 'title',
                value: 'value'
              },
              cascaderItem: ['oldStorageRegionId','oldStorageId'],
              dicUrl:'/api/erp-wms/warehouse/tree'
            },
            {
              label: "区",
              prop: "oldStorageRegionId",
              type:'tree',
              disabled:true,
              rules: [{
                message: "请输入区id",
                trigger: "blur"
              }],
              props: {
                label: 'title',
                value: 'id'
              },
              dicUrl:'/api/erp-wms/storage/queryRegionTree?warehouseId={{key}}'
            },
            {
              label: "储位",
              prop: "oldStorageId",
              type:'tree',
              disabled:true,
              rules: [{
                message: "请输入储位id",
                trigger: "blur"
              }],
              props: {
                label: 'title',
                value: 'id'
              },
              dicUrl:'/api/erp-wms/storage/tree?storageRegionId={{key}}'
            },
            {
              label: "商品",
              prop: "goodsId",
              type:'select',
              disabled:true,
              rules: [{
                message: "请输入商品id",
                trigger: "blur"
              }],
              props: {
                label: 'goodsName',
                value: 'id'
              },
              dicMethod:"post",
              dicUrl: '/api/erp-wms/goods/selecListGoods',
            },
            {
              label: "商品编码",
              prop: "goodsCode",
              disabled:true,
              rules: [{
                message: "请输入商品编码",
                trigger: "blur"
              }]
            },
            {
              label: "规格",
              prop: "specification",
              disabled:true,
              rules: [{
                message: "请输入规格",
                trigger: "blur"
              }]
            },
            {
              label:"原有数量",
              prop:'oldQuantity',
              disabled: true,
              type:'number'
            },
            {
              label:"转移数量",
              prop:'newQuantity',
              type:'number'
            },
            {
              label:"批号",
              prop:'newBatchNumber',
            },
            {
              label: "仓库",
              prop: "newWarehouseId",
              type:'tree',
              rules: [{
                required: true,
                message: "请输入仓库id",
                trigger: "blur"
              }],
              props: {
                label: 'title',
                value: 'value'
              },
              cascaderItem: ['newStorageRegionId'],
              dicUrl:'/api/erp-wms/warehouse/tree'
            },
            {
              label: "区",
              type:'tree',
              prop: "newStorageRegionId",
              rules: [{
                message: "请输入区id",
                trigger: "blur"
              }],
              props: {
                label: 'title',
                value: 'id'
              },
              cascaderItem: ['newStorageId'],
              dicUrl:'/api/erp-wms/storage/queryRegionTree?warehouseId={{key}}'
            },
            {
              label: "储位",
              type:'tree',
              prop: "newStorageId",
              rules: [{
                message: "请输入储位id",
                trigger: "blur"
              }],
              props: {
                label: 'title',
                value: 'id'
              },
              dicUrl:'/api/erp-wms/storage/tree?storageRegionId={{key}}'
            },
          ]
        },
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: false,
          viewBtn: this.vaildData(this.permission.repertory_view, false),
          delBtn: false,
          editBtn: this.vaildData(this.permission.repertory_edit, false),
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
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },
      searchChange(params, done) {
        this.query = params;
        this.page.currentPage = 1;
        this.onLoad(this.page, params);
        done();
        setTimeout(()=>{
          if(this.data.length>0){
            console.log("长度大于0")
          }
        },1000);

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
        const {createTime} = params;
        let values = {
          ...params,
        };
        if (createTime) {
          values = {
            ...params,
            start_time: createTime[0],
            end_time: createTime[1],
          };
          values.createTime = null;
          this.query.createTime = null;
        }
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(values, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          data.records.forEach((d) => {
            d.checkStatus = 0;
          })
          this.loading = false;
          this.selectionClear();
        });
      },
      submit(form, done) {
        add(form).then(res => {
          done();
          if (res.data.success) {
            this.$refs.form.resetForm();
            this.$message.success(res.data.msg);
            this.dialogVisible = false;
            this.onLoad(this.page, this.query);
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(() => {
          done();
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
        this.$confirm("是否导出库存数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          window.open(this.ERP_WMS_NAME + `/repertory/export?${this.website.tokenHeader}=${getToken()}`);
        });
      },
      handleCheckExportDialog() {
        this.checkDialog = true;
      },
      handleCheckExport() {
        this.$confirm("是否导出盘点库存数据模板?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          window.open(this.ERP_WMS_NAME + `/repertory/exportCheck?${this.website.tokenHeader}=${getToken()}&warehouseId=${this.excelCheckForm.warehouseId}`);
        });
      },

      handleImportInit() {
        this.excelBoxInit = true;
      },
      uploadAfterInit(res, done, loading, column) {
        window.console.log(column);
        this.excelBoxInit = false;
        this.searchReset();
        done();
      },
      handleTemplate() {
        window.open(this.ERP_WMS_NAME + `/repertory/export-template?${this.website.tokenHeader}=${getToken()}`);
      },

      deleteRepertory(id) {
        deleteRepertory(id).then(res => {
          this.$message({
            type: 'info',
            message: res.data.msg
          })
        })
      },
      AllTransferDialog(row) {
        this.dialogAll = true;
        this.rowId = row.id
        this.formAll.oldWarehouseId = row.warehouseId;
        this.formAll.oldStorageRegionId = row.storageRegionId;
        this.formAll.oldStorageId = row.storageId;
        this.formAll.goodsId = row.goodsId;
        this.formAll.goodsCode = row.goodsCode;
        this.formAll.specification = row.specification;
        this.formAll.unit = row.unit;
        this.formAll.conversionUnit = row.conversionUnit;
        this.formAll.oldQuantity = row.repertoryQuantity;
        this.formAll.newBatchNumber = row.batchNumber;

      },
      saveALLTransfer(row, done) {
        saveALLTransfer(this.rowId, row).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.checkDialog = false;
          this.checkObj = null;
          done();
          this.refreshChange();
        }, error => {
          window.console.log(error);
        });

      },
    }
  };
</script>

<style>
</style>
