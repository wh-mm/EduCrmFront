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

<!--        <el-button type="danger"-->
<!--                   size="small"-->
<!--                   icon="el-icon-delete"-->
<!--                   plain-->
<!--                   v-if="permission.check_delete"-->
<!--                   :open="handleDelete">删 除-->
<!--        </el-button>-->
        <el-button type="danger"
                   size="small"
                   plain
                   @click="opencheckDialog()">创建盘点单
        </el-button>
        <el-button type="danger"
                   size="small"
                   plain
                   @click="openUpdateDialog()">审批
        </el-button>
        <el-button type="danger"
                   size="small"
                   plain
                   @click="handleExport()">导出盘点单
        </el-button>
      </template>

      <template slot="menu" slot-scope="scope">
    <el-button
        type="text"
        size="small"
        @click="detailNewss(scope.row)">
    查看
    </el-button>
<!--      <el-button type="text"-->
<!--                 size="small"-->
<!--                 @click="saveCheckInWarehouse(scope.row)"-->
<!--                 v-if="scope.row.checkStatus==101"-->
<!--                >保存盘点记录</el-button>-->
        <el-button type="text"
                 size="small"
                 @click="updateCheckStatus(scope.row)"
                   v-if="scope.row.checkStatus==1"
                >编辑</el-button>
      </template>
<!--      <template slot="realRepertoryQuantity" slot-scope="scope">-->
<!--        <el-input-number :disabled="datas" size="mini"  v-model="scope.row.realRepertoryQuantity" ></el-input-number>-->
<!--      </template>-->

      <template slot="profitAndLoss" slot-scope="scope">
        {{scope.row.realRepertoryQuantity - scope.row.repertoryQuantity }}
      </template>

    </avue-crud>
    <el-dialog
      title="审批"
      :visible.sync="dialogApprove"
      width="30%"
      :modal="false"
      :before-close="handleClose">
      <avue-form ref="form" v-model="objApprove" :option="optionApprove">
      </avue-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateFatherCheckStatus(102)">驳 回</el-button>
        <el-button type="primary" @click="updateFatherCheckStatus(101)">同 意</el-button>
      </span>
    </el-dialog>


    <el-dialog title="开启盘点"
               append-to-body
               :visible.sync="checkDialog"
               width="1700px">
      <avue-crud ref="crud" :option="option0"
                 @row-update="updateRows"
                 @row-click="handleRowClick"
                 :page.sync="pageNew"
                 :data="tableData"
                 @selection-change="selectionChange"
                 @size-change="sizeChange"
                 @refresh-change="refreshChangeOut"
                 @row-dblclick="detailNewss"
                 @current-change="currentChanges"
                 @search-reset="searchResetOut"
                 @row-save="rowSave"
                 @search-change="searchChangeOut"
                 @on-load="onLoadNew">

        <template slot="menuLeft">
          <el-button @click="open()">导入盘点数据</el-button>
          <el-button @click="saveCheck()">保存盘点单</el-button>
          <el-button @click="deleteCheck()">清空</el-button>
        </template>
        <template slot="realRepertoryQuantity" slot-scope="scope">
          <el-input-number :disabled="datas" size="mini" v-model="scope.row.realRepertoryQuantity" ></el-input-number>
        </template>

        <template slot="profitAndLoss" slot-scope="scope">
          {{scope.row.realRepertoryQuantity - scope.row.repertoryQuantity }}
        </template>

        <template slot-scope="{row,index}" slot="menu">
          <el-button type="text" size="small" @click="rowCell(row,index)">{{row.$cellEdit?'保存':'修改'}}</el-button>
            <el-button type="text" size="small" @click="rowDelNew(row)">删除</el-button>
        </template>

      </avue-crud>
    </el-dialog>

    <el-dialog title="盘点模板导入"
               append-to-body
               :visible.sync="infoDialog"
               width="555px"
    >
      <avue-form :option="excelOption" v-model="excelForm" :upload-after="importCheckData">
      </avue-form>
      <el-button @click="a">赋值</el-button>
    </el-dialog>

    <el-dialog title="查看盘点单详情"
               append-to-body
               :visible.sync="detailDialog"
               v-if="detailDialog"
               width="1200px"
    >
      <template>
      <avue-crud :option="option0"
                 :table-loading="loading"
                 :data="detailData"
                 :page.sync="pageCrud"
                 :before-open="beforeOpenNewCrud"
                 v-model="detailDataNewCrud"
                 ref="crud"
                 @search-reset="searchResetNewCrud"
                 @selection-change="selectionChangeNewCrud"
                 @current-change="currentChangeNewCrud"
                 @size-change="sizeChangeNewCrud"
                 @refresh-change="refreshChangeNewCrud"
                 @on-load="detailNewCrud">

        <template slot="profitAndLoss" slot-scope="scope">
          {{scope.row.realRepertoryQuantity - scope.row.repertoryQuantity }}
        </template>

         <template slot="menu" slot-scope="scope">
           <el-button type="text" size="small" v-if="scope.row.checkStatus==0" @click="updateCheckStatus(scope.row,2)">审核</el-button>

        </template>

        <template slot="menuLeft" slot-scope="scope">
      <el-button   type="primary" size="small" @click="updateAllCheckStatus()"> 一键审核</el-button>
      <el-button   type="primary" size="small" @click="updateAllsCheckStatus()"> 全部审核</el-button>
        </template>

      </avue-crud>
      </template>
    </el-dialog>



  </basic-container>


</template>
<script>
  import {getList,getDetail, add, update, remove,saveCheckOrder,updateRow,detailNew,updateFatherCheckStatus,checkDetailInWarehouse} from "@/api/warehouse/check/check";
  import {updateCheckStatus,updateAllCheckStatus,updateAllsCheckStatus} from "@/api/warehouse/check/checkdetail";
  import {lock} from "@/api/warehouse/warehouse";
  import {saveImportExcelData,getListTemporary,deleteCheckTemporary,deleteCheck} from "@/api/warehouse/check/checktemporary";
  import {mapGetters} from "vuex";
  import {getToken} from "@/util/auth";

  export default {
    data() {
      return {
        detailDataNewCrud: {},
        datas:false,
        tableData: [],
        deleteStatus: 0,
        Id: '',
        detailData: [],
        warehouseDetail:[
          {
            lockStatus: ''
          }
        ],
        props: {
          label: 'name',
          value: 'id'
        },
        tabPosition: 'left',
        form: {},
        warehouseForm: {},
        query: {},
        queryOut: {},
        queryNewCrud: {},
        checkDialog:false,
        dialogApprove:false,
        infoDialog:false,
        lockDialog:false,
        detailDialog:false,
        data1: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        pageNew: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        pageCrud: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        selectionListNewCrud: [],
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
              label: "订单号",
              prop: "orderNumber",
              sortable:true,
            },
            {
              label:'类型',
              prop:'type',
              sortable:true,
            },
            {
              label:'审核状态',
              prop:'checkStatus',
              type:"select",
              sortable:true,
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=check_father_status"
            },
            {
              label:'审批原因',
              prop:'rejectText',
              sortable:true,
            },
            {
              label:'创建时间',
              prop:'createTime',
              sortable:true,
            },

          ]
        },
        option0: {
          editBtn: false,
          addBtn:false,
          delBtn: false,
          height:'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          selection: true,
          rowKey:"goodsCode",
          dialogClickModal: false,
          column: [
            {
              label:'库存Id',
              prop:'repertoryId'
            },
            {
              label: "仓库",
              prop: "warehouseName",
              cell: true,
              sortable:true,
              type:'select',
              props: {
                label: 'title',
                value: 'value'
              },
              rules: [{
                required: true,

                message: "请输入仓库",
                trigger: "blur"
              }],
              dicUrl:'/api/erp-wms/warehouse/tree'
            },
            {
              label:'商品编码',
              prop:'goodsCode'
            },
            {
              label: "商品",
              prop: "goodsName",
              type:'select',
              sortable:true,
              cell: true,
              rules: [{
                required: true,
                message: "请输入商品id",
                trigger: "blur"
              }],
              props: {
                label: 'goodsName',
                value: 'id'
              },
              dicMethod:"post",
              dicUrl: 'api/erp-wms/goods/selecListGoods',
            },
            {
              label:'规格等级',
              prop:'specificationLevel'
            },
            {
              label:'生产商',
              prop:'manufacturer'
            },
            {
              label:'包装规格',
              prop:'packageSpecification'
            },
            {
              label: "批号",
              prop: "batchNumber",
              cell: true,
            },
            {
              label: "库存总量",
              prop: "repertoryQuantity",
              sortable:true,
            },
            {
              label: "实际数量",
              prop: "realRepertoryQuantity",
              type:'number',
              cell: true,
            },
            {
              label: "差值",
              prop: "profitAndLoss",
              slot:true,

            },
            {
              label: "审核状态",
              prop: "checkStatus",
              type:"select",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=check_status",
            },

          ]
        },
        objApprove: {
          rejectText: ''
        },
        optionApprove: {
          emptyBtn: false,
          submitBtn: false,
          column: [{
            label: "驳回理由",
            prop: "rejectText",
            type: 'textarea',
            span: 24,
          },
          ]
        },
        data: [],
        dataNew: [],
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
              // propsHttp: {
              //   res: 'data'
              // },
              tip: '请上传 .xls,.xlsx 标准格式文件',
              action: "/api/wh-check/check/importInit"
            }
          ]
        },
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.check_add, false),
          viewBtn: this.vaildData(this.permission.check_view, false),
          delBtn: this.vaildData(this.permission.check_delete, false),
          editBtn: this.vaildData(this.permission.check_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      },
      checkStatuss() {
        let checkStatuss = [];
        this.selectionList.forEach(ele => {
          checkStatuss.push(ele.checkStatus);
        });
        return checkStatuss.join(",");
      },
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
      beforeOpenNewCrud(done, type) {
        if (["edit", "view"].includes(type)) {
          getDetail(this.form.id).then(res => {
            this.detailDataNewCrud = res.data.data;
          });
        }
        done();
      },
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },
      searchResetOut() {
        this.queryOut = {};
        this.onLoadNew(this.pageNew);
      },
      searchResetNewCrud() {
        this.queryNewCrud = {};
        this.detailNewCrud(this.pageCrud);
      },
      searchChange(params, done) {
        this.query = params;
        this.page.currentPage = 1;
        this.onLoad(this.page, params);
        done();
      },
      searchChangeOut(params, done) {
        this.queryOut = params;
        this.pageNew.currentPage = 1;
        this.onLoadNew(this.pageNew, params);
        done();
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      selectionChangeNewCrud(list) {
        this.selectionListNewCrud = list;
      },
      selectionClear() {
        this.selectionList = [];
        this.$refs.crud.toggleSelection();
      },
      currentChange(currentPage) {
        this.page.currentPage = currentPage;
      },
      currentChangeNewCrud(currentPage) {
        this.pageCrud.currentPage = currentPage;
      },
      sizeChange(pageSize) {
        this.page.pageSize = pageSize;
      },
      sizeChangeNewCrud(pageSize) {
        this.pageCrud.pageSize = pageSize;
      },
      refreshChange() {
        this.onLoad(this.page, this.query);
      },
      refreshChangeOut() {
        this.onLoadNew(this.pageNew, this.queryOut);
      },
      refreshChangeNewCrud() {
        this.detailNewCrud(this.pageCrud, this.queryNewCrud);
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
      check() {
        this.checkDialog = true;
      },

      lock(id, lockStatus) {
        lock(id, lockStatus).then(res => {
          if (res.data.success) {
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        });
        this.lockDialog = false;
        this.refreshChange();

      },
      saveCheckInWarehouse(row) {
        checkDetailInWarehouse(row.id).then(res => {
          this.$message.success(res.data.msg);
        });
      },
      updateCheckStatus(row,checkStatus) {
        this.$confirm("确定是否审核?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return updateCheckStatus(row.id,checkStatus);
          })
          .then(() => {
            this.detailNewCrud(this.pageCrud);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      updateAllCheckStatus() {
        updateAllCheckStatus(this.detailData).then(() => {
          this.detailNewCrud(this.pageCrud);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.refreshChangeNewCrud();
        }, error => {
          window.console.log(error);
        });
      },
      updateAllsCheckStatus() {
        updateAllsCheckStatus(this.detailData[0].checkId).then(() => {
          this.detailNewCrud(this.pageCrud);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.refreshChangeNewCrud();
        }, error => {
          window.console.log(error);
        });
      },
      opencheckDialog() {
        this.checkDialog = true;
      },
      open() {
        this.infoDialog = true;
      },
      importCheckData(res, done) {
        this.data1 = res.data;
        done();
      },
      rowDelNew(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return deleteCheckTemporary(row.id);
          })
          .then(() => {
            this.onLoadNew(this.pageNew);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
        // console.log(this.deleteStatus)
        // this.tableData.splice(index,1);
        // this.pageNew.total = this.data1.length;
        // this.tableData = this.tableData;
      },
      a(done, loading) {
        saveImportExcelData(this.data1).then(() => {
          this.onLoadNew(this.pageNew);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          setTimeout(()=>{
            this.infoDialog = false;
            this.onLoadNew(this.pageNew);
          },10000);
        }, error => {
          loading();
          window.console.log(error);
        });
        // this.dataNew = this.excelForm;
        // console.log(  this.data1 );
        // //this.tableData = this.data1;
        // let datas = [];
        // for (let i = 0; i < this.pageNew.pageSize; i++) {
        //   datas.push(this.data1[this.pageNew.currentPage * this.pageNew.pageSize - 9 + i]);
        // }
        // this.tableData = datas;
        // this.pageNew.total = this.data1.length;
        // //this.pageNew.total = this.data1.splice(this.pageNew.currentPage*this.pageNew.pageSize-9,this.pageNew.currentPage*this.pageNew.pageSize);
      },
      currentChanges(currentPage) {
        this.pageNew.currentPage = currentPage;
      },
      onLoadNew(pageNew, params = {}) {
        // let datas = [];
        // // debugger
        // let num = this.data1.length - ((page.currentPage - 1) * this.pageNew.pageSize);
        // num = num > this.pageNew.pageSize ? this.pageNew.pageSize : num;
        // for (let i = 0; i < num; i++) {
        //   datas.push(this.data1[((page.currentPage - 1) * this.pageNew.pageSize) + i]);
        // }
        // this.tableData = datas;
        // this.pageNew.total = this.data1.length;
        this.loading = true;
        getListTemporary(pageNew.currentPage, pageNew.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.pageNew.total = data.total;
          this.tableData = data.records;
          this.loading = false;
          this.selectionClear();
        });
      },


      rowCell(row, index) {
        this.$refs.crud.rowCell(row, index)
      },
      updateRows(row, index, done){
        this.$message({
          showClose: true,
          message: '序号21212121' + row.$index,
          type: 'success',
        });

        updateRow(row.id,row.realRepertoryQuantity).then(res=>{
          if (res.data.success) {
            this.searchReset();
            this.$message.success(res.data.msg);
            done();
          } else {
            this.searchReset();
            this.$message.error(res.data.msg);
            done();
          }
      })

      },
      handleRowClick(row) {
        this.$message({
          showClose: true,
          message: '序号' + row.$index,
          type: 'success',
        });
      },
      addUpdate(form, index, done, loading) {

        setTimeout(() => {
          this.$message.success('正在关闭按钮，请等待等待')
          loading()
        }, 1000)
        setTimeout(() => {

          done()
        }, 2000)
      },
      saveCheck(done, loading) {
        saveCheckOrder().then(() => {
          this.onLoadNew(this.page);
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
      deleteCheck() {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return deleteCheck();
          })
          .then(() => {
            this.onLoadNew(this.pageNew);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });

      },

      detailNewss(row) {
        this.Id = row.id;
        this.detailDialog = true;
      },

      detailNewCrud(pageCrud, params = {}) {
        params.id = this.Id;
        detailNew(pageCrud.currentPage, pageCrud.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.pageCrud.total = data.total;
          this.detailData = data.records;
          this.loading = false;
          this.selectionClear();
        });
      },
      openUpdateDialog(){
        if (this.selectionList.length === 0) {
          return this.$message.error("请选择需要的商品！");
        }if (this.checkStatuss ==102) {
          return this.$message.error("该订单已经驳回无法修改！");
        }if (this.checkStatuss ==101) {
          return this.$message.error("该订单已经完成无法修改！");
        }
         this.dialogApprove = true;
      },
      updateFatherCheckStatus(checkStatus){
        if (checkStatus === 102 && this.objApprove.rejectText === '') {
          return this.$message.error("请输入失败理由!");
        }
        updateFatherCheckStatus(this.ids,checkStatus,this.objApprove.rejectText).then(res => {
          if (res.data.success) {
            this.dialogApprove = false;
            this.searchReset();
            this.$message.success(res.data.msg);
          } else {
            this.dialogApprove = false;
            this.searchReset();
            this.$message.error(res.data.msg);
          }
        })
      },
      handleExport() {
        if (this.selectionList.length === 0 || this.selectionList.length>1){
          return this.$message.error("请选择一条盘点单！");
        }
        this.$confirm("是否导出盘点单数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          window.open( `/api/wh-check/check/exportCheckRepertory?${this.website.tokenHeader}=${getToken()}&checkId=${this.ids}`);
        });
      }



    }
  };
</script>

<style>
</style>
