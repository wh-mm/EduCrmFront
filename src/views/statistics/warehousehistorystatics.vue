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
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="warning"
                   size="small"
                   plain
                   icon="el-icon-download"
                   @click="handleExportDialog">导出仓库报表
        </el-button>
      </template>

    </avue-crud>


    <el-dialog title="仓库报表导出"
               append-to-body
               :visible.sync="exportDialog"
               v-if="exportDialog"
               width="555px">
      <avue-form :option="excelCheckOption" v-model="excelCheckForm" :upload-after="uploadAfter">
        <template slot="excelTemplate">
          <el-button type="primary" @click="handleExport">
            点击下载<i class="el-icon-download el-icon--right"></i>
          </el-button>
        </template>
      </avue-form>
    </el-dialog>

  </basic-container>
</template>
<script>
  import {add, getList, selectWarehouseHistory} from "@/api/warehouse/warehouseinoutput";
  import {mapGetters} from "vuex";
  import {viewCommodity} from "@/api/purchase/purchaseorder";
  import {selectByBatchNumber} from "@/api/warehouse/repertory";
  import {getToken} from "@/util/auth";

  export default {
    filters: {
      rounding(value) {
        return value.toFixed(2)
      },
      formatDate: function (value) {
        let date = new Date(value);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? ('0' + MM) : MM;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let m = date.getMinutes();
        m = m < 10 ? ('0' + m) : m;
        let s = date.getSeconds();
        s = s < 10 ? ('0' + s) : s;
        return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
      }
    },
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
        obj:{},

        title: '' ,
        repertoryQuantity:0,
        dialogVisible:false,
        exportDialog:false,
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
          menu:false,
          dialogClickModal: false,
          column: [
            {
              label: "订单号",
              prop: "orderNumberName",
            },
            {
              label: "仓库",
              prop: "warehouseId",
              type:"select",
              props: {
                label: 'title',
                value: 'id'
              },
              search:true,
              sortable:true,
              dicUrl:'/api/erp-wms/warehouse/tree'
            },
            {
              label: "商品名称",
              prop: "goodsId",
              type:"select",
              sortable:true,
              props: {
                required: true,
                label: 'goodsName',
                value: 'id'
              },
              search:true,
              dicMethod:'post',
              dicUrl:'/api/erp-wms/goods/selecListGoods'
            },
            {
              label: "部门",
              prop: "deptName",
            },
            {
              label: "操作人员",
              prop: "userName",
            },
            {
              label: "来源类型",
              prop: "type",
              type: "select",
              row: true,
              span: 24,
              disabled:true,
              sortable:true,
              search:true,
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=put_type",
            },
            {
              label: "金额流动",
              prop: "money",
            },
            {
              label:"记录时间",
              prop:"createTime",
              dateDefault: true,
              addDisplay: false,
              viewDisplay: false,
              sortable:true,
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
              type:'datetime',
              searchSpan:12,
              searchRange:true,
              search:true,
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
              dicUrl:'/api/erp-wms/warehouse/tree'
            },
            {
              label: "类型",
              prop: "type",
              type:'tree',
              search:true,
              span: 24,
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=report_forms_type",
            },
            {
              label: "日期范围",
              prop: "daterange",
              span:24,
              type: "daterange",
              startPlaceholder: '日期开始范围自定义',
              endPlaceholder: '日期结束范围自定义',
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
            },
            {
              label: '模板下载',
              prop: 'excelTemplate',
              formslot: true,
              span: 24,
            }
          ]
        },
        data: [],

      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: false,
          viewBtn: this.vaildData(this.permission.warehouseinoutput_view, false),
          delBtn: false,
          editBtn: false,

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
        console.log(this.query)
        if (createTime) {
          values = {
            ...params,
            start_time: createTime[0],
            end_time: createTime[1],
          };
          values.createTime = null;
          this.query.createTime = null;
          this.query = values;
        }
        this.loading = true;
        selectWarehouseHistory(page.currentPage, page.pageSize, Object.assign(values,this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
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
      viewCommodity(goodsId) {
        this.commoditydialogVisible = true;
        viewCommodity(goodsId).then(res => {
          if (res.data.success) {
            this.commoditydata = res.data.data;
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      handleExportDialog(){
        this.exportDialog = true;
      },
      handleExport() {

        this.$confirm("是否导出盘点库存数据模板?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          window.open(  `/api/taocao-warehouse/warehouseinoutput/exportWarehouseInOut?${this.website.tokenHeader}=${getToken()}&warehouseId=${this.excelCheckForm.warehouseId}&type=${this.excelCheckForm.type}&startTime=${this.excelCheckForm.daterange[0]}&endTime=${this.excelCheckForm.daterange[1]}`);
        });
      },
    }
  };


</script>

<style>
</style>
