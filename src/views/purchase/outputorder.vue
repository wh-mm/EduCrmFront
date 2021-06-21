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
<!--      <template slot="menuLeft">-->
<!--          <el-button type="button"-->
<!--                     size="small"-->
<!--                     v-if="permission.output_approval"-->
<!--                     @click="updateStatusNew()">审 批-->
<!--          </el-button>-->
<!--      </template>-->
      <template slot-scope="scope" slot="menu">
        <el-button :size="scope.size"
                   v-if="scope.row.status==101"
                   type="text"
                   @click="viewReason(scope.row.id)"> 查看驳回理由</el-button>

        <el-button :size="scope.size"
                   icon="el-icon-printer"
                   :type="scope.type"
                   @click="print(scope.row)"> 打印领料单</el-button>

        <el-button :type="scope.type"
                   icon="el-icon-check"
                   :size="scope.size"
                   v-if="scope.row.status==101"
                   plain
                   @click.stop="handleEdit(scope.row,scope.index)">修改领料单</el-button>
      </template>


      <template slot-scope="scope" slot="inventoryToRetrieveForm">
        <el-button :size="scope.size"  @click="selectGoodsGross(scope.row.goodsId)">现 有 库 存 量</el-button>
      </template>

     </avue-crud>


    <el-dialog
      title="商品总量"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      width="50%"
      :modal="false"
      :before-close="handleClose"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <avue-crud v-model="form" :data="inventoryToRetrievedata" :option="inventoryToRetrievedataoption"  >
      </avue-crud>
    </el-dialog>

    <el-dialog
      title="驳回理由"
      :append-to-body="true"
      :visible.sync="reasonialogVisible"
      width="50%"
      :modal="false"
      :before-close="handleClose"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <avue-crud v-model="form" :data="reasondata" :option="reasondataoption"  >
      </avue-crud>
    </el-dialog>


    <el-dialog
      title="打印领料单"
      :append-to-body="true"
      :visible.sync="printDialogVisible"
      width="800px"
      :modal="false"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <el-button type="primary"
                 size="small"
                 icon="el-icon-plus"
                 plain
                 v-print="'#print'">打印领料单
      </el-button>
        <div id="print" ref="print">
          <!-- 隐藏打印区域，避免用户看到 -->
            <div style="padding: 10px;">
              <el-row>
                <el-col :span="24">
                  <div class="grid-content bg-purple-dark"
                       style="font-size: 24px;text-align: center;margin-bottom: 15px;">
                    领料出库单
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <p>领料单号 : <span style="margin-left: 10px;">{{printData.orderNumber}}</span></p>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple-light">
                    <p>部门 : <span style="margin-left: 10px;">{{printData.detailData.deptName}}</span></p>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple-light">
                    <p>领料日期 : <span style="margin-left: 10px;">{{date =new Date()|formatDate}}</span></p>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <p>仓库 : <span style="margin-left: 10px;">{{printData.detailData.warehouseName}}</span></p>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple-light">
                    <p>备注 : <span style="margin-left: 10px;"></span></p>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple-light">
                    <p>处方号 : <span style="margin-left: 10px;"></span></p>
                  </div>
                </el-col>
              </el-row>
              <el-table
                :data="printData.tableData"
                border :fit="false"
                style="width: 709px;margin-top: 15px;margin-right: 0px;">
                <el-table-column
                  type="index"
                  label="序号"
                  width="60">
                </el-table-column>
                <el-table-column
                  prop="goodsCode"
                  label="品号"
                  width="60">
                </el-table-column>
                <el-table-column
                  prop="goodsName"
                  label="品名"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="batchNumber"
                  label="批号"
                  width="90">
                </el-table-column>
                <el-table-column
                  prop="specificationName"
                  label="规格"
                  width="90">
                </el-table-column>
                <el-table-column
                  prop="dateOfManufacture"
                  label="生产日期"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="placeOfOrigin"
                  label="产地"
                  width="55">
                </el-table-column>
                <el-table-column
                  prop="manufacturer"
                  label="生产厂家"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="recheckGoodsQuantity"
                  label="数量(g)"
                  width="55">
                </el-table-column>
              </el-table>
              <el-row style="margin-top: 20px;">
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple-light">
                    <p> <span style="margin-left: 10px;"></span></p>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="grid-content bg-purple">
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="grid-content bg-purple-light">
                    <p>领料人 :<span style="margin-left: 10px;"></span></p>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
    </el-dialog>

  </basic-container>

</template>
<script>
  import {getList, add, getDetail,update, remove,selectGoodsGross,viewReason,
    printOutputorderDetail} from "@/api/purchase/outputorder";
  import {getGoodsDetail} from "@/api/warehouse/goods";
  import {mapGetters} from "vuex";
  import {viewCommodity} from "@/api/purchase/purchaseorder";
  import '@/views/purchase/dialogdrag.ts'
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
      var validateQuantity = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入数量'));
        } else if (value <= 0) {
          callback(new Error('数量不能小于0'));
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
        commoditydialogVisible:false,
        reasonialogVisible:false,
        printDialogVisible:false,
        printData: {
          orderNumber: '',
          tableData: [],
          detailData:[]
        },
        selectionList: [],
        option: {
          height:'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          editBtnText:'出库复核',
          searchMenuSpan: 6,
          border: true,
          index: true,
          viewBtn: true,
          editBtn: false,
          selection: true,
          dialogClickModal: false,
          dialogWidth: '80%',
          column: [
            {
              label: "领料单号",
              prop: "orderNumber",
              editDisplay: false,
              addDisplay: false,
              sortable:true,
              search:true,
              rules: [{
                required: true,
                trigger: "blur"
              }]
            },
            {
              label: "类型",
              prop: "type",
              type: "select",
              disabled: true,
              sortable:true,
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=put_type",
              props: {
                label: "dictValue",
                value: "dictKey"
              }
            },
            {
              label: "状态",
              prop: "statusName",
              addDisplay:false,
              editDisplay:false,
              viewDisplay:false,
              sortable:true,
              dicUrl: "/api/blade-system/dict/dictionary?code=purchases_status",
              props: {
                label: "dictValue",
                value: "dictKey"
              }
            },
            {
              label:"创建时间",
              prop:"updateTime",
              dateDefault: true,
              addDisplay: false,
              editDisplay: false,
              viewDisplay: false,
              type: "datetime",
              searchSpan:12,
              searchRange:true,
              search:true,
              sortable:true,
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
            },
            {
              label: '商品列表',
              prop: 'outputOrderDetailList',
              type: 'dynamic',
              span:24,
              children: {
                align: 'center',
                headerAlign: 'center',
                 rowAdd:(done)=>{
                   done({
                    goodsQuantity: 1,
                    discountPercentage: 0,
                   });
                 },
                 rowDel:(row,done)=>{
                     done();
                 },
                column: [
                  {
                    label: '*商品',
                    prop: "goodsId",
                    type: 'tree',
                    width: 200,
                    filterable: true,
                    remote: true,
                    display:false,
                    rules: [{
                      require: true,
                      message: '请选择商品',
                    }],
                    props: {
                      label: 'goodsName',
                      value: 'goodsId'
                    },
                    dicMethod:'post',
                    dicUrl: '/api/erp-wms/repertory/dropDowns',

                  },
                  {
                    label: "商品索引码",
                    prop: "goodsCode",
                    disabled:true,
                    width:150
                  },
                  {
                    label: "库存检索",
                    prop: "inventoryToRetrieve",
                    type:'input',
                    placeholder: " ",
                    formslot:true,
                    width: 100,
                  },
                  {
                    label: '*出库数量(g)',
                    prop: "goodsQuantity",
                    type: "number",
                    width: 200,
                    rules: [{
                      required: true,
                      validator: validateQuantity,
                    }]
                  },
                  {
                  label: '备注',
                  prop: "remark",
                  type:"textarea"
                }],
              }
            },
          ]
        },
        data: [],
        reasondata:[],
        reasondataoption : {
          addBtn: false,
          menu:false,
          align:'center',
          column:[
            {
              label:'驳回理由',
              prop:'rejectText',
              type: "textarea",

            }
          ]
        },
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.outputorder_add, false),
          viewBtn: this.vaildData(this.permission.outputorder_view, false),
          delBtn: this.vaildData(this.permission.outputorder_delete, false),
          editBtn: this.vaildData(this.permission.outputorder_edit, false)
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
        if (["add", "edit"].includes(type)) {
          setTimeout(()=>{
            this.form.type = 'out';
          },10);
        }
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
      viewCommodity(goodsId){
        this.commoditydialogVisible = true;
        viewCommodity(goodsId).then(res=>{
          if (res.data.success) {
            this.commoditydata = res.data.data;
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      selectGoodsGross(goodsId){
        this.dialogVisible = true;
        selectGoodsGross(goodsId).then(res=>{
          if (res.data.success) {
            this.inventoryToRetrievedata = res.data.data;
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      viewReason(id){
        this.reasonialogVisible = true;
        viewReason(id).then(res=>{
          if (res.data.success) {
            this.reasondata = res.data.data;
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      handleEdit (row, index) {
        this.$refs.crud.rowEdit(row, index);
      },
      print(row){
        this.printDialogVisible = true;
        this.printData.orderNumber = row.orderNumber;
        printOutputorderDetail(row.id).then( res => {
          this.printData.tableData = res.data.data;

          this.printData.tableData.forEach(detail=>{
            this.printData.detailData = detail;
          })
        })
      },
      printOut(row){
        this.printOutDialogVisible = true;
        this.printData.orderNumber = row.orderNumber;
        printOutputorderDetail(row.id).then( res => {
          this.printData.tableData = res.data.data;

        })
      }
    }
  };
</script>

<style>
  p {
    margin: 0px;
    font-size: 14px;
  }

  #print td, #print th {
    padding: 2px;
  }

  #print, #print .el-table th, #print .el-table td {
    color: #000000;
    font-size: 12px;
  }

  #print .el-table tr {
    border-left: 1px solid #000;
  }

  #print .el-table td {
    border-top: 1px solid #000;
    border-right: 1px solid #000;
  }

  #print .el-table th {
    border-top: 1px solid #000;
    border-left: 1px solid #000;
  }

  #print .el-table--border {
    border-bottom: 1px solid #000;
    border-right: 1px solid #000;
  }

  #print .el-table__body-wrapper {
    border-left: 1px solid #000;
  }


  #printOut td, #printOut th {
    padding: 2px;
  }

  #printOut, #printOut .el-table th, #printOut .el-table td {
    color: #000000;
    font-size: 12px;
  }

  #printOut .el-table tr {
    border-left: 1px solid #000;
  }

  #printOut .el-table td {
    border-top: 1px solid #000;
    border-right: 1px solid #000;
  }

  #printOut .el-table th {
    border-top: 1px solid #000;
    border-left: 1px solid #000;
  }

  #printOut .el-table--border {
    border-bottom: 1px solid #000;
    border-right: 1px solid #000;
  }

  #printOut .el-table__body-wrapper {
    border-left: 1px solid #000;
  }

</style>
