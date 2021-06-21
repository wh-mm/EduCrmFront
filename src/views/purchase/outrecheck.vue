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
                     v-if="permission.outrechek_approval"
                     @click="updateRevocation()">审 批
          </el-button>

      </template>
      <template slot-scope="scope" slot="menu">
       <el-button icon="el-icon-check"
                            :size="scope.size"
                            :type="scope.type"
                            v-if="scope.row.status==1 || scope.row.status==102|| scope.row.status==103"
                            @click.stop="handleEdit(scope.row,scope.index)">复核数量
      </el-button>
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
      <template slot="checkboxForm" slot-scope="scope">
      <el-checkbox v-model="scope.row.checked" @change="checkValue(scope.row)">选中当前行</el-checkbox>

      </template>

     </avue-crud>

    <el-dialog
      title="审批"
      :visible.sync="dialogFormVisible"
      width="30%"
      :modal="false"
      :before-close="handleClose">
      <avue-form ref="form" v-model="obj0" :option="option0">
      </avue-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateStatusNew(101)">驳 回</el-button>
        <el-button @click="updateStatusNew(104)">撤 销</el-button>
        <el-button type="primary" @click="updateStatusNew(2)">同 意</el-button>
      </span>
    </el-dialog>
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




  </basic-container>

</template>
<script>
  import {getList, add, getDetail,update, remove, updateStatus} from "@/api/purchase/outputorder";
  import {mapGetters} from "vuex";
  import '@/views/purchase/dialogdrag.ts'
  import {
    dropDownbatchnumber,
    selectByBatchNumber, selectRepertoryByGoodsId,
    selectRepertoryGoods
  } from "@/api/warehouse/repertory";
  export default {

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
        expireDialog:false,
        options: [],
        optionss: [],
        tableDatas: [],
        index:'',
        checked:false,
        goodsId:'',
        pickingPerson:'',
        deptName:'',
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
        revocationdialogVisible: false,
        dialogVisible:false,
        commoditydialogVisible:false,
        dialogFormVisible: false,
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
              label: "领料出库单号",
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
              dicUrl: "/api/blade-system/dict/dictionary?code=output_status",
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
                      goodsId: this.goodsId,
                      pickingPerson: this.pickingPerson,
                     deptName: this.deptName,
                      goodsQuantity: 1,
                      discountPercentage: 0,
                   });
                 },
                 rowDel:(row,done)=>{
                     done();
                 },
                column: [
                  {
                    width: 200,
                    label: '选中',
                    prop: "checkbox",
                    type: 'checkbox',
                    formslot: true,
                  },
                  {
                    label: '领料人',
                    prop: "pickingPerson",
                    disabled:true,
                    width: 200,

                  },{
                    label: '部门',
                    prop: "deptName",
                    disabled:true,
                    width: 200,

                  },
                  {
                    label: '*商品',
                    prop: "goodsId",
                    type: 'tree',
                    width: 130,
                    filterable: true,
                    remote: true,
                    display:false,
                    formslot: true,
                    cascaderItem: ['batchNumber'],
                  },
                  {
                    label: "批号",
                    prop: "batchNumber",
                    type:'select',
                    width:170,
                    props: {
                      label: 'batchNumber',
                      value: 'id'
                    },
                    dicMethod:'post',
                    dicUrl: '/api/erp-wms/repertory/dropDownbatchnumber?goodsId={{key}}',
                    change: ({value}) => {
                      this.form.outputOrderDetailList.forEach(vals => {
                        setTimeout(()=>{
                          selectByBatchNumber(vals.batchNumber).then(res => {
                            let detail  = res.data.data;
                            vals.repertoryQuantity = detail.repertoryQuantity
                              vals.warehouseId  =detail.warehouseId
                            vals.dateOfManufacture = detail.dateOfManufacture
                            vals.periodOfValidity = detail.periodOfValidity
                            vals.placeOfOrigin = detail.placeOfOrigin
                            vals.manufacturer = detail.manufacturer
                            vals.supplierName = detail.supplierName
                            vals.packageSpecification = detail.packageSpecification
                            vals.specificationLevel = detail.specificationLevel
                          });
                        },500);

                      });
                    },

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
                    disabled: true,
                  }, {
                    label: '复核出库数量(g)',
                    prop: "recheckGoodsQuantity",
                    type: "number",
                    width: 130,
                    rules: [{
                      validator: validateQuantity,
                      trigger: 'blur',
                      required: true,
                    }]
                  },
                  {
                    label: '出货仓库',
                    prop: "warehouseId",
                    type:'select',
                    width: 200,
                    props: {
                      label: 'title',
                      value: 'id'
                    },
                    dicUrl: '/api/erp-wms/warehouse/tree'
                  },
                  {
                    label:'区域',
                    prop: "storageRegionId",
                    type:"select",
                    width: 200,
                    props: {
                      label: 'name',
                      value: 'id'
                    },
                    dicMethod:'post',
                    dicUrl:'/api/erp-wms/storage/dropDown'
                  },
                  {
                    label: "储位",
                    prop: "storageId",
                    type:'select',
                    width: 200,
                    props: {
                      label: 'name',
                      value: 'id'
                    },
                    dicMethod:'post',
                    dicUrl:'/api/erp-wms/storage/dropDown'
                  },
                  {
                    label: "生产日期",
                    prop: "dateOfManufacture",
                    type:'datetime',
                    format: "yyyy-MM-dd",
                    valueFormat: "yyyy-MM-dd",
                    width:150,
                    disabled: true,
                  },
                  {
                    label: "有效期至",
                    prop: "periodOfValidity",
                    type:'datetime',
                    format: "yyyy-MM-dd",
                    valueFormat: "yyyy-MM-dd",
                    width:150,
                    disabled: true,
                  },
                  {
                    label: "产地",
                    prop: "placeOfOrigin",
                    width:150,
                    disabled: true,
                  },
                  {
                    label: "生产厂家",
                    prop: "manufacturer",
                    width:150,
                    disabled: true,
                  },
                  {
                    label: '规格',
                    prop: "specification",
                    placeholder: " ",
                    disabled: true,
                    width: 140,
                    type: "select",
                    props: {
                      label: 'dictValue',
                      value: 'dictKey'
                    },
                    dicUrl: "/api/blade-system/dict-biz/dictionary?code=specifications"
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
        obj0: {
          rejectText: ''
        },
        option0: {
          emptyBtn: false,
          submitBtn: false,
          column: [{
            label: "驳回理由",
            prop: "rejectText",
            type: 'textarea',
            span: 24,
          }]
        },
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.outrecheck_add, false),
          viewBtn: this.vaildData(this.permission.outrecheck_view, false),
          delBtn: this.vaildData(this.permission.outrecheck_delete, false),
          editBtn: this.vaildData(this.permission.outrecheck_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      },
      status1() {
        let status1 = [];
        this.selectionList.forEach(ele => {
          status1.push(ele.status);
        });
        return status1.join(",");
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
      updateStatusNew(status) {
        if (status === 101 && this.obj0.rejectText === '') {
          return this.$message.error("请输入驳回理由！");
        }
          updateStatus(this.ids, status,this.obj0.rejectText).then(res => {
            if (res.data.success) {
              this.dialogFormVisible = false;
              this.searchReset();
              this.$message.success(res.data.msg);
            } else {
              this.dialogFormVisible = false;
              this.searchReset();
              this.$message.error(res.data.msg);
            }
          })
      },
      //审批
      updateRevocation() {
        if (this.selectionList.length === 0) {
          return this.$message.error("请选择需要的商品！");
        }if (this.status1 ==2) {
          return this.$message.error("该订单已经完成无法修改！");
        }if (this.status1 ==101) {
          return this.$message.error("该订单已经驳回无法修改！");
        }if (this.status1 ==104) {
          return this.$message.error("该订单已被撤销无法修改！");
        }
        this.dialogFormVisible = true;
      },
      handleEdit(row, index) {
        this.$refs.crud.rowEdit(row, index);
      },
      selectRepertoryByGoodsId(index,goodsId){
        this.index = index;
        selectRepertoryByGoodsId(goodsId).then(res=>{
          this.expireGoodsHint(res.data.data)
        });
        dropDownbatchnumber(goodsId).then(ress=>{
          this.form.outputOrderDetailList[index].optionss = ress.data.data;
        });

      },
      selectGoods(index,row) {
        let vals = this.form.outputOrderDetailList[this.index];
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
      selectByBatchNumber(index,row){

        selectByBatchNumber(row.batchNumber).then(res=>{
          let detail = res.data.data;
          let vals =this.form.outputOrderDetailList[index];
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
      checkValue(row){
         this.goodsId= row.goodsId
         this.pickingPerson= row.pickingPerson
         this.deptName= row.deptName
      }
    }
  };
</script>

<style>
</style>
