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
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="menuLeft">

        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.check_delete"
                   :open="handleDelete">删 除
        </el-button>
        <el-button type="danger"
                   size="small"
                   plain
                   @click="opencheckDialog()">创建盘点单
        </el-button>
      </template>

      <template slot="menu" slot-scope="scope">

      <el-button type="text"
                 size="small"
                 @click="saveCheckHistory(scope.row)"
                 v-if="scope.row.checkStatus==0"
                >保存盘点记录</el-button>
        <el-button type="text"
                 size="small"
                 @click="updateCheckStatus(scope.row)"
                   v-if="scope.row.checkStatus==1"
                >编辑</el-button>
      </template>
      <template slot="realRepertoryQuantity" slot-scope="scope">
        <el-input-number :disabled="datas" size="mini" v-model="scope.row.realRepertoryQuantity" ></el-input-number>
      </template>

      <template slot="profitAndLoss" slot-scope="scope">
        {{scope.row.realRepertoryQuantity - scope.row.repertoryQuantity }}
      </template>

    </avue-crud>
    <el-dialog title="开启盘点"
               append-to-body
               :visible.sync="checkDialog"
               width="1600px">
      <avue-crud ref="crud" :option="option0"  v-loadmore="handelLoadmore"  :data="filteredData"   @row-save="rowSave"
                 @row-del="rowDel"  @search-change="searchChange" :data-size="tableData.length" >

        <template slot="menuLeft">
          <el-button @click="open()">按钮</el-button>
        </template>



        <template slot="realRepertoryQuantity" slot-scope="scope">
          <el-input-number :disabled="datas" size="mini" v-model="scope.row.realRepertoryQuantity" ></el-input-number>
        </template>

        <template slot="profitAndLoss" slot-scope="scope">
          {{scope.row.realRepertoryQuantity - scope.row.repertoryQuantity }}
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

  </basic-container>


</template>
<script>
  import {getList,getDetail, add, update, remove,checkData} from "@/api/warehouse/check/check";
  import {dropDown,lock} from "@/api/warehouse/warehouse";
  import {saveCheckHistory} from "@/api/warehouse/check/checkhistory";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        datas:false,
        tableData: [],
        checkStatus:0,
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
        checkDialog:false,
        infoDialog:false,
        lockDialog:false,
        data1: {},
        loading: true,
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
          dialogClickModal: false,
          column: [
            {
              label: "仓库",
              prop: "warehouseId",
              cell: true,
              search :true,
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
              prop: "goodsId",
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
              label:'单位',
              prop:'unit'
            },
            {
              label:'规格',
              prop:'specification'
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
              slot:true,
              cell: true,
            },
            {
              label: "差值",
              prop: "profitAndLoss",
              slot:true,
            },

          ]
        },
        option0: {
          height:'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          rowKey:"goodsCode",
          dialogClickModal: false,
          column: [
            {
              label: "仓库",
              prop: "warehouseId",
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
              prop: "goodsId",
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
              label:'单位',
              prop:'unit'
            },
            {
              label:'规格',
              prop:'specification'
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
              slot:true,
              cell: true,
            },
            {
              label: "差值",
              prop: "profitAndLoss",
              slot:true,
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
      filteredData() {
        let list = this.tableData.filter((item, index) => {
          if (index < this.currentStartIndex) {
            return false;
          } else if (index > this.currentEndIndex) {
            return false;
          } else {
            return true;
          }
        });
        return list
      }
    },
    directives:{
      loadmore:{
        componentUpdated: function (el, binding, vnode, oldVnode) {
          // 设置默认溢出显示数量
          var spillDataNum = 20;

          // 设置隐藏函数
          var timeout = false;
          let setRowDisableNone = function (topNum, showRowNum, binding) {
            if (timeout) {
              clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
              binding.value.call(null, topNum, topNum + showRowNum + spillDataNum);
            });
          };
          setTimeout(() => {
            const dataSize = vnode.data.attrs['data-size'];
            const oldDataSize = oldVnode.data.attrs['data-size'];
            if (dataSize === oldDataSize) return;
            const selectWrap = el.querySelector('.el-table__body-wrapper');
            const selectTbody = selectWrap.querySelector('table tbody');
            const selectRow = selectWrap.querySelector('table tr');
            if (!selectRow) {
              return;
            }
            const rowHeight = selectRow.clientHeight;
            let showRowNum = Math.round(selectWrap.clientHeight / rowHeight);

            const createElementTR = document.createElement('tr');
            let createElementTRHeight = (dataSize - showRowNum - spillDataNum) * rowHeight;
            createElementTR.setAttribute('style', `height: ${createElementTRHeight}px;`);
            selectTbody.append(createElementTR);

            // 监听滚动后事件
            selectWrap.addEventListener('scroll', function () {
              let topPx = this.scrollTop - spillDataNum * rowHeight;
              let topNum = Math.round(topPx / rowHeight);
              let minTopNum = dataSize - spillDataNum - showRowNum;
              if (topNum > minTopNum) {
                topNum = minTopNum;
              }
              if (topNum < 0) {
                topNum = 0;
                topPx = 0;
              }
              selectTbody.setAttribute('style', `transform: translateY(${topPx}px)`);
              createElementTR.setAttribute('style', `height: ${createElementTRHeight - topPx > 0 ? createElementTRHeight - topPx : 0}px;`);
              setRowDisableNone(topNum, showRowNum, binding);
            })
          });
        }
      }
    },
    methods: {
      handelLoadmore(currentStartIndex, currentEndIndex) {
        this.currentStartIndex = currentStartIndex;
        this.currentEndIndex = currentEndIndex;
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
          data.records.forEach( (d) => {
            d.checkStatus=0;
          })
          this.loading = false;
          this.selectionClear();
        });
      },
      check() {
        this.checkDialog = true;
      },


      lockWarehouse() {
        this.lockDialog = true;
        dropDown().then(res => {
          this.warehouseDetail = res.data.data;
          console.log(res.data)
        })
      },
      lock(id,lockStatus) {
        lock(id,lockStatus).then(res =>{
          if (res.data.success) {
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        });
        this.lockDialog = false;
        this.refreshChange();

      },
      saveCheckHistory(row) {
        row.checkStatus=1;
        saveCheckHistory(row).then(res =>{
          this.$message.success(res.data.msg);
        });
      },
      updateCheckStatus(row) {
        row.checkStatus=0;
      },
      opencheckDialog() {
        this.checkDialog=true;
      },
      open() {
        this.infoDialog=true;
      },
      importCheckData(res,done){
        console.log( res);
        this.data1 = res;
        done();

      },
      a(){
        //this.dataNew = this.excelForm;
        console.log( this.data1);
        this.tableData = this.data1.data;
      }
    }
  };
</script>

<style>
</style>
