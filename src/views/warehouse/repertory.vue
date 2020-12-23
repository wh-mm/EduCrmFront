<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               :permission="permissionList"
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
      </template>
    </avue-crud>

    <el-dialog title="库存数据导入"
               append-to-body
               :visible.sync="excelBox"
               width="555px">
      <avue-form :option="excelOption" v-model="excelForm" :upload-after="uploadAfter">
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
  import {getList} from "@/api/warehouse/repertory";
  import {add} from "@/api/warehouse/warehouseinoutput";
  import {mapGetters} from "vuex";
  import {getToken} from "@/util/auth";

  export default {
    data() {
      var validateNumber = (rule, value, callback)=>{
        if (value === '') {
          callback(new Error('请输入数量'));
        } else if(value < 1){
          callback(new Error('请输入正确的数量'));
        } else {
          callback();
        }
      };
      return {
        form: {},
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        obj:{},
        title: '' ,
        dialogVisible:false,
        selectionList: [],
        option: {
          height:'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          menu: false,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "仓库",
              prop: "warehouseId",
              type:'tree',
              row: true,
              search:true,
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
              label: "区域",
              prop: "storageRegionId",
              type:'tree',
              search:true,
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
              dicUrl:'/api/erp-wms/storage/queryRegionTree?warehouseId={{key}}'
            },
            {
              label: "储位",
              prop: "storageId",
              type:'tree',
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
              dicUrl:'/api/erp-wms/storage/tree?warehouseId={{key}}'
            },
            {
              label: "商品",
              prop: "goodsId",
              type:'tree',
              search:true,
              row: true,
              span: 24,
              props: {
                label: 'goodsName',
                value: 'id'
              },
              dicMethod:"post",
              dicUrl: 'api/erp-wms/goods/selecListGoods',
            },
            {
              label: "批号",
              prop: "batchNumber",
              search:true,
            },
            {
              label: "生产日期",
              prop: "dateOfManufacture",
              type:'datetime',
              format: "yyyy-MM-dd",
              valueFormat: "yyyy-MM-dd",
            },
            {
              label: "有效期至",
              prop: "periodOfValidity",
              type:'datetime',
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
        }
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: false,
          viewBtn: this.vaildData(this.permission.repertory_view, false),
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
      submit(form,done){
        add(form).then( res => {
          done();
          if(res.data.success){
            this.$refs.form.resetForm();
            this.$message.success(res.data.msg);
            this.dialogVisible = false;
            this.onLoad(this.page, this.query);
          }else {
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
          window.open( this.ERP_WMS_NAME + `/repertory/export?${this.website.tokenHeader}=${getToken()}`);
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
    }
  };
</script>

<style>
</style>
