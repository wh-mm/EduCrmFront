<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      :page.sync="page"
      :permission="permissionList"
      :before-open="beforeOpen"
      v-model="form"
      ref="crud"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template slot="menuLeft">
        <el-button type="primary"
                   size="small"
                   icon="el-icon-plus"
                   plain
                   @click="print">新增并打印交接单
        </el-button>
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
                 v-print="'#print1'"
                 @click="printSave">打印交接单
      </el-button>
      <div id="print1" ref="print11">
        <div style="padding: 10px;">
          <el-row>
            <el-col :span="24">
              <div class="grid-content bg-purple-dark"
                   style="font-size: 24px;text-align: center;margin-bottom: 15px;">
                配送交接单
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="grid-content bg-purple-dark">
                <p>医院名称 : <span style="margin-left: 10px;">{{printData.hospitalName}}</span></p>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <div class="grid-content bg-purple">
                <p>医院地址 : <span style="margin-left: 10px;">{{printData.hospitalAddress}}</span></p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple-light">
                <p>联系方式 : <span style="margin-left: 10px;">{{printData.hospitalTel}}</span></p>
              </div>
            </el-col>
          </el-row>
          <el-table
            :data="printData.tableData"
            border :fit="false"
            style="width: 707px;margin-top: 15px;margin-right: 0px;">
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
              prop="addresseeName"
              label="患者姓名"
              width="90">
            </el-table-column>
            <el-table-column
              prop="addresseeSex"
              label="性别"
              width="55">
              <template slot-scope="scope">
                {{ scope.row.addresseeSex === '1'?'男':'女' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="addresseeAge"
              label="年龄"
              width="55">
            </el-table-column>
            <el-table-column
              prop="dose"
              label="剂数"
              width="55">
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注">
            </el-table-column>
            <el-table-column
              label=""
              width="60">
            </el-table-column>
          </el-table>
          <el-row style="margin-top: 20px;">
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <p>日期 : <span style="margin-left: 10px;">{{printData.time}}</span></p>
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
  import {getList} from '@/api/logistics/distributionCentre';
  import {add} from "@/api/logistics/handoverform";
  import {mapGetters} from 'vuex';
  import {getHospitalDetail} from "@/api/hisHospital/hospital";

  export default {
    data() {
      return {
        form: {},
        obj: {},
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        printData: {
          hospitalName: '',
          time: '',
          hospitalAddress: '',
          hospitalTel: '',
          tableData: [],
        },
        dialogVisible: false,
        selectionList: [],
        option: {
          height: 'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          excelBtn:true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          menu: false,
          dialogClickModal: false,
          column: [
            {
              label: '单号',
              prop: 'orderNumber',
              addDisplay: false,
              editDisplay: false,
              width: 180,
              searchLabelWidth: 130,
              search: true,
            },
            {
              label: "状态",
              prop: "distributionStatus",
              type: 'select',
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              dicUrl: "/api/blade-system/dict/dictionary?code=distribution_status"
            },
            {
              label: "医院名称",
              prop: "hospitalId",
              type: "select",
              searchLabelWidth: 130,
              props: {
                label: "hospitalName",
                value: "id"
              },
              span: 6,
              search: true,
              filterable: true,
              remote: true,
              dicUrl: "/api/taocao-hisHospital/hospital/selectHosptalByName?name={{key}}"
            },
            {
              label: "患者姓名",
              prop: "addresseeName",
              searchLabelWidth: 130,
              rules: [{
                required: true,
                message: "请输入收件人",
                trigger: "blur"
              }],
              search: true,
            },
            {
              label: "患者地址",
              prop: "addresseeAddress",
              rules: [{
                required: true,
                message: "请输入收件人地址",
                trigger: "blur"
              }]
            },
            {
              label: "患者手机号",
              prop: "addresseePhone",
              searchLabelWidth: 130,
              search: true,
              rules: [{
                required: true,
                message: "请输入收件人手机号",
                trigger: "blur"
              }]
            },
          ]
        },
        data: [],
      };
    },
    computed: {
      ...mapGetters(['permission']),
      permissionList() {
        return {
          addBtn: false,
          viewBtn: false,
          delBtn: false,
          editBtn: false
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(',');
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
        if (this.query['hospitalId'] == null) {
          return this.$message.error("请搜索一家医院!");
        } else {
          getHospitalDetail(this.query['hospitalId']).then(res => {
            let data = res.data.data;
            this.printData.hospitalName = data.hospitalName;
            this.printData.hospitalAddress = data.hospitalProfile;
            this.printData.hospitalTel = data.hospitalTel;
          })
        }
        if (this.selectionList.length > 0) {
          let date = new Date();
          let year = date.getFullYear(); // 年
          let month = date.getMonth() + 1; // 月
          let day = date.getDate(); // 日
          this.printData.time = year + '-' + month + '-' + day;
          this.printData.tableData = this.selectionList;
          this.dialogVisible = true;
        } else {
          this.$message.error("请选择配送记录!");
        }

      },
      printSave(){
        add(this.query['hospitalId'],this.ids).then(res =>{
          this.$message.info(res.data.msg);
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

  #print1 td, #print1 th {
    padding: 2px;
  }

  #print1, #print1 .el-table th, #print1 .el-table td {
    color: #000000;
    font-size: 12px;
  }

  #print1 .el-table tr {
    border-left: 1px solid #000;
  }

  #print1 .el-table td {
    border-top: 1px solid #000;
    border-right: 1px solid #000;
  }

  #print1 .el-table th {
    border-top: 1px solid #000;
    border-left: 1px solid #000;
  }

  #print1 .el-table--border {
    border-bottom: 1px solid #000;
    border-right: 1px solid #000;
  }

  #print1 .el-table__body-wrapper {
    border-left: 1px solid #000;
  }
</style>
