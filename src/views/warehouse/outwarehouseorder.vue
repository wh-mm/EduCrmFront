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
        <!--<el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.outwarehouseorder_delete"
                   @click="handleDelete">删 除
        </el-button>-->
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button :size="scope.size"
                   icon="el-icon-printer"
                   :type="scope.type"
                   @click="print(scope.row)"> 打印出库单</el-button>


      </template>
      <template slot-scope="scope" slot="inventoryToRetrieveForm">
        <el-button :size="scope.size"  @click="selectGoodsGross(scope.row.goodsId)">现 有 库 存 量</el-button>
      </template>






      <template slot="goodsIdForm" slot-scope="scope">
        <el-select
          size="small"
          v-model="scope.row.goodsId"
          filterable
          remote
          reserve-keyword
          placeholder="请输入商品"
          @change="selectRepertoryByGoodsId(scope.index,scope.row.goodsId)"
          :data-index="scope.index"
          :loading="loading">
          <el-option
            v-for="item in options"
            :key="item.goodsId"
            :label="item.goodsName"
            :value="item.goodsId">
          </el-option>
        </el-select>
      </template>
      <template slot="batchNumberForm" slot-scope="scope">
        <el-select
          size="small"
          v-model="scope.row.batchNumber"
          filterable
          remote
          reserve-keyword
          @change="selectByBatchNumber(scope.index,scope.row)"
          placeholder="请输入批号"
          :data-index="scope.index"
          :loading="loading">
          <el-option
            v-for="item in scope.row.optionss"
            :key="item.id"
            :label="item.batchNumber"
            :value="item.id">
          </el-option>
        </el-select>
      </template>

    </avue-crud>

    <el-dialog
      title="商品信息"
      :visible.sync="expireDialog"
      :close-on-click-modal="false"
      width="80%"
      :append-to-body="true"
      :modal="false">
      <template>
        <el-table
          :data="tableDatas"
          style="width: 100%">
          <el-table-column
            prop="goodsName"
            label="商品名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="batchNumber"
            label="商品批号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="repertoryQuantity"
            label="库存数量">
          </el-table-column>
          <el-table-column
            prop="dateOfManufacture"
            label="生产日期">
          </el-table-column>
          <el-table-column
            prop="periodOfValidity"
            label="有效期至">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="selectGoods(scope.$index, scope.row)">选择</el-button>

            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-dialog>

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
      title="打印出库单"
      :append-to-body="true"
      :visible.sync="printDialogVisible"
      width="800px"
      :modal="false"
      :before-close="handleClose"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <el-button type="primary"
                 size="small"
                 icon="el-icon-plus"
                 plain
                 v-print="'#print'">打印出库单
      </el-button>
      <el-form :model="form1">
        <div id="print" ref="print">
          <!-- 隐藏打印区域，避免用户看到 -->
          <div id="print1" ref="print11">
            <div style="padding: 10px;">
              <el-row>
                <el-col :span="24">
                  <div class="grid-content bg-purple-dark"
                       style="font-size: 24px;text-align: center;margin-bottom: 15px;">
                    出库单
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <p>出库单号 : <span style="margin-left: 10px;">{{printData.orderNumber}}</span></p>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple-light">
                    <p>部门 : <span style="margin-left: 10px;">{{printDatas.deptName}}</span></p>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple-light">
                    <p>出库日期 : <span style="margin-left: 10px;">{{date =new Date()|formatDate}}</span></p>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <p>仓库 : <span style="margin-left: 10px;">{{printDatas.warehouseName}}</span></p>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple-light">
                    <p>原因 : <span style="margin-left: 10px;"></span></p>
                  </div>
                </el-col>
                <el-col :span="8">

                </el-col>

              </el-row>
              <el-table
                :data="printData.tableData"
                border :fit="false"
                style="width: 729px;margin-top: 15px;margin-right: 0px;">
                <el-table-column
                  type="index"
                  label="序号"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="goodsCode"
                  label="品号"
                  width="65">
                </el-table-column>
                <el-table-column
                  prop="goodsName"
                  label="品名"
                  width="95">
                </el-table-column>
                <el-table-column
                  prop="batchNumber"
                  label="批号"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="specificationName"
                  label="规格"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="dateOfManufacture"
                  label="生产日期"
                  width="90">
                </el-table-column>
                <el-table-column
                  prop="placeOfOrigin"
                  label="产地"
                  width="90">
                </el-table-column>
                <el-table-column
                  prop="manufacturer"
                  label="生产厂家"
                  width="90">
                </el-table-column>
                <el-table-column
                  prop="goodsQuantity"
                  label="数量(g)"
                  width="90">
                </el-table-column>
              </el-table>
              <el-row style="margin-top: 20px;">
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple-light">
                    <p><span style="margin-left: 10px;"></span></p>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="grid-content bg-purple">
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="grid-content bg-purple-light">
                    <p>出库人 : <span style="margin-left: 10px;"></span></p>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-form>
    </el-dialog>







  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove,printOutWarehouseDetail} from "@/api/warehouse/outwarehouseorder";
  import {selctRepertoryWarnQuantity} from "@/api/warehouse/repertorywarn";
  import {mapGetters, mapState} from "vuex";
  import {getGoodsDetail, likeListKL,selectAlll} from "@/api/warehouse/goods";
  import {selectByBatchNumber,dropDownbatchnumber} from "@/api/warehouse/repertory";
  import {selectGoodsGross} from "@/api/purchase/outputorder";
  import {selectExpireGoods,selectRepertoryByGoodsId,selectRepertoryGoods} from "@/api/warehouse/repertory";

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
        options: [],
        optionss: [],
        index:'',
        selectValue:[],
        selectValues:[],
        form: {},
        query: {},
        loading: true,
        dialogVisible:false,
        viewDialog:false,
        printDialogVisible:false,
        expireDialog:false,
        tableDatas:[],
        printData: {
          orderNumber: '',
          tableData: [],
        },
        printDatas:{},
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
          editBtn:false,
          dialogClickModal: false,
          dialogWidth: '80%',
          column: [
            {
              label: "出库单号",
              prop: "orderNumber",
              editDisplay: false,
              addDisplay: false,
              search:true,
              sortable:true,
              rules: [{
                required: true,
                trigger: "blur"
              }]
            },
            {
              label: "类型",
              prop: "type",
              type: "select",
              disabled:true,
              sortable:true,
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=put_type",
              props: {
                label: "dictValue",
                value: "dictKey"
              }
            },
            /*{
              label: "状态",
              prop: "statusName",
              addDisplay:false,
              editDisplay:false,
              viewDisplay:false,
              dicUrl: "/api/blade-system/dict/dictionary?code=output_status",
              props: {
                label: "dictValue",
                value: "dictKey"
              }
            },*/
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
              prop: 'outwarehouseOrderDetailList',
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
                    width:170,
                    formslot: true,
                  },
                  {
                    label: "批号",
                    prop: "batchNumber",
                    formslot: true,
                    editDisplay:false,
                    width:170,
                  },
                  {
                    label: "商品索引码",
                    prop: "goodsCode",
                    disabled:true,
                    width:150
                  },

                  {
                    label:'库存数量(g)',
                    prop: 'repertoryQuantity',
                    disabled: true,
                    width:100,
                  },
                  {
                    label: '出库数量(g)',
                    prop: "goodsQuantity",
                    type: "number",
                    width: 130,
                    change: () => {
                      if(this.value1 == true){
                        getGoodsDetail().then(res => {
                          this.form.sumMoney = 0;
                          this.form.outwarehouseOrderDetailList.forEach(val => {
                            var detail = res.data.data;
                            val.recheckGoodsQuantity = val.goodsQuantity;
                            val.basicUnit = detail.basicUnit;
                            val.specification = detail.goodsSpecification;

                          });
                        });
                      }
                    },
                  },
                  {
                    label:'生产日期',
                    prop: 'dateOfManufacture',
                    disabled: true,
                    width:100,
                  },
                  {
                    label:'有效期至',
                    prop: 'periodOfValidity',
                    disabled: true,
                    width:100,
                  },
                  {
                    label: '出库仓库',
                    prop: "warehouseId",
                    type: "tree",
                    rsearch: true,
                    disabled: true,
                    width:150,
                    rules: [{
                      required: true,
                      message: "请输入类型",
                      trigger: "blur"
                    }],
                    props: {
                      label: 'title',
                      value: 'id'
                    },
                    cascaderItem: ['storageRegionId'],
                    dicUrl: '/api/erp-wms/warehouse/tree'
                  },
                  {
                    label:'区域',
                    prop: "storageRegionId",
                    type:'select',
                    width:150,
                    disabled: true,
                    props: {
                      label: 'name',
                      value: 'id'
                    },
                    dicMethod:'post',
                    cascaderItem: ['storageId'],
                    dicUrl:'/api/erp-wms/storage/dropDown'
                  },
                  {
                    label: "储位",
                    prop: "storageId",
                    type:'select',
                    disabled: true,
                    width: 150,
                    props: {
                      label: 'name',
                      value: 'id'
                    },
                    dicMethod:'post',
                    dicUrl:'/api/erp-wms/storage/dropDown'
                  },
                  {
                    label: "基本单位",
                    prop: "basicUnit",
                    editDisplay: false,
                    disabled: true,
                    value:"克"
                  },
                  {
                    label: '规格',
                    prop: "specification",
                    placeholder: " ",
                    width: 140,
                    type: "select",
                    disabled:true,
                    props: {
                      label: 'dictValue',
                      value: 'dictKey'
                    },
                    dicUrl: "/api/blade-system/dict-biz/dictionary?code=specifications"
                  },
                  {
                    label: "包装规格",
                    prop: "packageSpecification",
                    disabled: true,
                    width:150,
                  },
                  {
                    label: "规格等级",
                    prop: "specificationLevel",
                    disabled: true,
                    width:150,
                  },
                  {
                    label: "产地",
                    prop: "placeOfOrigin",
                    disabled: true,
                    width:150,
                  },
                  {
                    label: "生产厂家",
                    prop: "manufacturer",
                    disabled: true,
                    width:200,
                  },
                  {
                    label: "供应商",
                    prop: "supplierName",
                    sortable:true,
                    type:'select',
                    props:{
                      label:'supplierName',
                      value:'id'
                    },
                    dicUrl: '/api/quality/information/dropDownsss'
                  },
                  {
                    label: "包装数量",
                    prop: "packageQuantity",
                    disabled: true,
                    width:150,
                  },
                  {
                    label: '备注',
                    prop: "remark",
                    type:"textarea",
                    width:200
                  }],
              }
            },
          ]
        },
        data: [],
        inventoryToRetrievedata:[],
        inventoryToRetrievedataoption : {
          addBtn: false,
          menu:false,
          align:'center',
          column:[
            {
              label:'商品名称',
              prop:'goodsId',
              props: {
                label: 'goodsName',
                value: 'id'
              },
              dicMethod:"post",
              dicUrl: 'api/erp-wms/goods/selecListGoods',
            },
            {
              label: "库存数量",
              prop: "sumrepertoryquantity",
              rules: [{
                trigger: "blur"
              }]
            },

          ]
        },
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.outwarehouseorder_add, false),
          viewBtn: this.vaildData(this.permission.outwarehouseorder_view, false),
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
    created() {
      this.optionsData();
    },
    methods: {
      optionsData() {
        selectRepertoryGoods().then(res => {
          this.options=res.data.data;
        })
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
          setTimeout(()=>{
            this.form.type = 'out';
          },10);
        }
        if (["edit", "view"].includes(type)) {
          console.log("查看")
          getDetail(this.form.id).then(res => {
            console.log(res.data.data);
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
      print(row){
        this.printDialogVisible = true;
        this.printData.orderNumber = row.orderNumber;
        printOutWarehouseDetail(row.id).then( res => {
          this.printData.tableData = res.data.data;
          this.printData.tableData.forEach(ress=>{
            this.printDatas = ress;
          })
        })
      },
      printOut(row){
        this.printOutDialogVisible = true;
        this.printData.orderNumber = row.orderNumber;
        printOutWarehouseDetail(row.id).then( res => {
          this.printData.tableData = res.data.data;

        })
      },
      selectRepertoryByGoodsId(index,goodsId){
        this.index = index;
        selectRepertoryByGoodsId(goodsId).then(res=>{
          this.expireGoodsHint(res.data.data)
        });
        dropDownbatchnumber(goodsId).then(ress=>{
          this.form.outwarehouseOrderDetailList[index].optionss = ress.data.data;
        });
      },
      selectByBatchNumber(index,row){
        selectByBatchNumber(row.batchNumber).then(res=>{
          let detail = res.data.data;
          let vals =this.form.outwarehouseOrderDetailList[index];
              vals.warehouseId = detail.warehouseId;
             vals.storageRegionId = detail.storageRegionId;
             vals.storageId = detail.storageId;
             vals.repertoryQuantity  = detail.repertoryQuantity
             vals.dateOfManufacture = detail.dateOfManufacture
             vals.periodOfValidity = detail.periodOfValidity
             vals.placeOfOrigin = detail.placeOfOrigin
             vals.manufacturer = detail.manufacturer
             vals.supplierName = detail.supplierName
             vals.packageSpecification = detail.packageSpecification
             vals.specificationLevel = detail.specificationLevel
             vals.specification = detail.specification
        })
        },

      expireGoodsHint(expireGoods) {
        this.tableDatas = expireGoods
        if(expireGoods.length>0){
          this.expireDialog = true;
        }
      },
      selectGoods(index,row) {
        let vals = this.form.outwarehouseOrderDetailList[this.index];
        vals.batchNumber = row.id
        vals.warehouseId = row.warehouseId;
        setTimeout(()=>{
          vals.storageRegionId = row.storageRegionId;
        },1500);
         setTimeout(()=>{
           vals.storageId = row.storageId;
        },2000);
        vals.repertoryQuantity  = row.repertoryQuantity
        vals.dateOfManufacture = row.dateOfManufacture
        vals.periodOfValidity = row.periodOfValidity
        vals.placeOfOrigin = row.placeOfOrigin
        vals.manufacturer = row.manufacturer
        vals.supplierName = row.supplierName
        vals.packageSpecification = row.packageSpecification
        vals.specificationLevel = row.specificationLevel
        vals.specification = row.specification
        this.expireDialog = false;
      },
    }
  };
</script>

<style>
</style>
