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
                   @click="print">打印交接单
        </el-button>
      </template>
      <template slot="distributionOrderNumber" slot-scope="{scope,row}">
        <el-tag>{{row.distributionOrderNumberPrefix+row.distributionOrderNumber}}</el-tag>
      </template>
    </avue-crud>
    <el-dialog
      title="打印交接单"
      :visible.sync="dialogVisible"
      width="800px"
      :modal="false"
      :before-close="handleClose">
      <el-button type="primary"
                 size="small"
                 icon="el-icon-plus"
                 plain
                 v-print="'#print1'">打印交接单
      </el-button>
      <div style="" >
        <div id="print1" ref="print1">
          <el-row>
            <el-col :span="24">
              <div class="grid-content bg-purple-dark"
                   style="font-size: 24px;text-align: center;margin-bottom: 15px;">
                代煎中药配送交接单
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="grid-content bg-purple-dark">
                <p>医院名称 : <span style="margin-left: 10px;">泰来县人民医院</span></p>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <div class="grid-content bg-purple">
                <p>医院地址 : <span style="margin-left: 10px;">齐齐哈尔市泰来县</span></p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple-light">
                <p>联系方式 : <span style="margin-left: 10px;">15500462121</span></p>
              </div>
            </el-col>
          </el-row>
          <el-table
            :data="tableData"
            border
            style="width: 100%;margin-top: 15px">
            <el-table-column
              type="index"
              label="序号"
              width="60">
            </el-table-column>
            <el-table-column
              prop="receivingDate"
              label="接方日期"
              width="100">
            </el-table-column>
            <el-table-column
              prop="pspnum"
              label="处方编号"
              width="150">
            </el-table-column>
            <el-table-column
              prop="name"
              label="患者姓名"
              width="100">
            </el-table-column>
            <el-table-column
              prop="sex"
              label="性别"
              width="60">
            </el-table-column>
            <el-table-column
              prop="age"
              label="年龄"
              width="60">
            </el-table-column>
            <el-table-column
              prop="dose"
              label="剂数"
              width="60">
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注">
            </el-table-column>
          </el-table>
          <el-row style="margin-top: 20px;">
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <p>日期 : <span style="margin-left: 10px;">2020-12-05</span></p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple-light">
                <p>送货人 : <span style="margin-left: 10px;"></span></p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <p>收货人 : <span style="margin-left: 10px;"></span></p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple-light">
                <p>收货日期 : <span style="margin-left: 10px;"></span></p>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {getList} from "@/api/logistics/distributionorder";
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
        tableData:[
          {
            receivingDate:'2020-12-05',
            pspnum:'123456',
            name:'李四',
            sex:'男',
            age:'21',
            dose:'5',
            remark:'测试备注',
          },
          {
            receivingDate:'2020-12-05',
            pspnum:'123456',
            name:'李四',
            sex:'男',
            age:'21',
            dose:'5',
            remark:'测试备注',
          },
          {
            receivingDate:'2020-12-05',
            pspnum:'123456',
            name:'李四',
            sex:'男',
            age:'21',
            dose:'5',
            remark:'测试备注',
          },
          {
            receivingDate:'2020-12-05',
            pspnum:'123456',
            name:'李四',
            sex:'男',
            age:'21',
            dose:'5',
            remark:'测试备注',
          },
          {
            receivingDate:'2020-12-05',
            pspnum:'123456',
            name:'李四',
            sex:'男',
            age:'21',
            dose:'5',
            remark:'测试备注',
          }
        ],
        dialogVisible: false,
        selectionList: [],
        option: {
          height: 'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: false,
          viewBtn: false,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "单号",
              prop: "distributionOrderNumber",
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
              filterable:true,
              remote: true,
              dicUrl: "/api/taocao-hisHospital/hospital/selectHosptalByName?name={{key}}"
            },
            {
              label: "处方号",
              prop: "pspnum",
            },
            {
              label: "类型",
              prop: "orderType",
            },
            {
              label: "接方时间",
              prop: "receivingDate",
              type: "date",
              format: "yyyy-MM-dd",
              valueFormat: "yyyy-MM-dd",
            },
            {
              label: "患者姓名",
              prop: "addresseeName",
            },
            {
              label: "患者性别",
              prop: "sex",
            },
            {
              label: "患者年龄",
              prop: "age",
            },
            {
              label: "患者地址",
              prop: "addresseeAddress",
              width: 180,
            },
            {
              label: "剂数",
              prop: "dose",
            },
            {
              label: "患者手机号",
              prop: "addresseePhone",
              width: 180,
            },
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.distributionrecord_add, false),
          viewBtn: this.vaildData(this.permission.distributionrecord_view, false),
          delBtn: this.vaildData(this.permission.distributionrecord_delete, false),
          editBtn: this.vaildData(this.permission.distributionrecord_edit, false)
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
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      },
      print() {
        this.dialogVisible = true;
        // this.$Print(this.$refs.print1);
      },
    }
  };
</script>

<style>
  p {
    margin: 0px;
    font-size: 14px;
  }
  #print1 td,#print1 th{
    padding: 2px;
  }
  #print1,#print1 .el-table th,#print1 .el-table td{
    color: #000000;
    font-size: 12px;
  }
  #print1 .el-table tr{
    border-left: 1px solid #000;
  }
  #print1 .el-table td{
    border-top : 1px solid #000;
    border-right : 1px solid #000;
  }
  #print1 .el-table th{
    border-top : 1px solid #000;
    border-left : 1px solid #000;
  }
  #print1 .el-table--border{
    border-bottom: 1px solid #000;
    border-right: 1px solid #000;
  }
  #print1 .el-table__body-wrapper{
    border-left : 1px solid #000;
  }
</style>
