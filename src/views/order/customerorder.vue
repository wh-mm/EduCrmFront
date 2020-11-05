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
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" plain @click="newAdd()">新 增</el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="text" icon="el-icon-view" size="small" @click.stop="lockInfo(scope.row)">查 看</el-button>
       <!-- <el-button type="text" icon="el-icon-check" size="small" @click.stop="prescription()">抓 药</el-button>-->
      </template>
    </avue-crud>
    <el-dialog title="药品列表" :visible.sync="selectDrugDialogVisible" width="80%" :modal="false"
               :close-on-click-modal="false" >
      <avue-crud :option="drugList.option" :table-loading="drugList.loading" :data="drugList.data"
                 :page.sync="drugList.page" v-model="drugList.form" ref="crudDrug"
                 @search-change="drugSearchChange" @search-reset="drugSearchReset"
                 @selection-change="drugSelectionChange" @current-change="currentChange" @size-change="drugSizeChange"
                 @refresh-change="drugRefreshChange" @on-load="drugOnLoad">
      </avue-crud>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectDrugBtn()">保 存</el-button>
        <el-button @click="toggleSelection()">清 空</el-button>
		  </span>
    </el-dialog>
    <el-dialog title="新 增" :visible.sync="addDialogVisible" width="90%" :modal="false" :close-on-click-modal="false"
               :before-close="handleClose">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="煎药机" name="jianyao">
        </el-tab-pane>
        <el-tab-pane label="调配机" name="tiaopei">
        </el-tab-pane>
      </el-tabs>
      <avue-form ref="addForm" v-model="addInfo.form" :option="addOption"></avue-form>
      <avue-crud ref="addCrud" :data="addInfo.drugList" :option="newAddListOption">
        <template slot="menuLeft">
          <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" plain @click="selectDrug">选择药品
          </el-button>
        </template>
        <template slot="drugallnum" slot-scope="scope">
          <el-input-number type="textarea" size="mini" placeholder="请输入单剂量"
                           v-model="scope.row.drugallnum"></el-input-number>
        </template>
        <template slot="tienum" slot-scope="scope">
          <el-input-number type="textarea" size="mini" placeholder="请输入贴数"
                           v-model="scope.row.tienum"></el-input-number>
        </template>
        <template slot="drugweight" slot-scope="scope">
          {{scope.row.tienum * scope.row.drugallnum}}
        </template>
        <template slot="drugdescription" slot-scope="scope">
          <avue-input size="mini" placeholder="请输入" v-model="scope.row.drugdescription"></avue-input>
        </template>
        <template slot="description" slot-scope="scope">
          <avue-input size="mini" placeholder="说明" v-model="scope.row.description"></avue-input>
        </template>
      </avue-crud>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bcBtn()">保 存</el-button>
        <el-button @click="reject()">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="订单详情" :visible.sync="dialogVisible" width="90%" :modal="false" :close-on-click-modal="false"
               :before-close="handleClose">
      <avue-form ref="addForm" v-model="orderInfo.form" :option="viewOption"></avue-form>
      <avue-crud ref="addCrud" :data="orderInfo.drugList" :option="newAddDrugListOption"></avue-crud>
      <span slot="footer" class="dialog-footer">
			  <el-button type="primary" @click="prescription()">抓 药</el-button>
		  </span>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {
    getList, getInfo,dictionaryByName,
    selectListByDrugCategory, receiveDecoctingSave, receiveBlenderSave
  } from "@/api/order/order";
  import {mapGetters} from "vuex";
  import {
    newAddDrugOption, newAddListOption,newAddDrugListOption, newAddGrainOption,option
  } from "@/const/order/customerorder"

  export default {
    data() {
      return {
        selectDrugDialogVisible: false,
        activeName: 'jianyao',
        drugList: {
          form: {},
          query: {},
          loading: true,
          page: {
            pageSize: 10,
            currentPage: 1,
            total: 0
          },
          data: [],
          selectionList: [],
          option: {
            height: 'auto',
            calcHeight: 30,
            tip: false,
            searchShow: true,
            searchMenuSpan: 6,
            border: true,
            index: false,
            menu: false,
            header: false,
            selection: true,
            dialogClickModal: false,
            column: [
              {
                label: "颗粒名称/药品名称",
                prop: "goodsName",
              },
              {
                label: "货物小类别",
                prop: "goodsCategory",
                type: "tree",
                props: {
                  label: 'dictValue',
                  value: 'id'
                },
                search: true,
                dicUrl: "/api/blade-system/dictCategory/dictionaryByName"
              },
              {
                label: "规格",
                prop: "unit",
                type: 'select',
                props: {
                  label: 'dictValue',
                  value: 'dictKey'
                },
                search: true,
                dicUrl: "/api/blade-system/dict-biz/dictionary?code=unit"
              }
            ]
          },
        },
        addDialogVisible: false,
        dialogVisible: false,
        addInfo: {
          form: {},
          drugList: [],
        },
        orderInfo: {
          form:{},
          drugList:[]
        },
        orderType: 1,
        addOption: '',
        viewOption:'',
        newAddListOption: newAddListOption,
        newAddDrugListOption:newAddDrugListOption,
        form: {},
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: option,
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.order_add, false),
          viewBtn: this.vaildData(this.permission.order_view, false),
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
      },
    },
    methods: {
      handleClick(tab, event) {
        if (tab.name === 'jianyao') {
          this.addOption = newAddDrugOption;
        } else if (tab.name === 'tiaopei') {
          this.addOption = newAddGrainOption;
        }
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
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      },
      //确认选择
      selectDrugBtn() {
        this.drugList.selectionList.forEach(l =>{
          l.drugallnum = 1;
          l.tienum = 1;
        })
        this.addInfo.drugList = this.drugList.selectionList;
        this.selectDrugDialogVisible = false;
        this.$refs.crud.toggleSelection();
      },
      //保存
      bcBtn() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            this.$confirm("请仔细查阅一经保存无法删除！", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                let params = {};
                console.log(this.addInfo);
                params = this.addInfo.form;
                params.orderType = this.activeName;
                params.drugList = this.addInfo.drugList;
                if (this.activeName === 'tiaopei') {
                  receiveBlenderSave(params).then(res => {
                    if (res.data.code === 200) {
                      this.$message({
                        type: "success",
                        message: res.data.msg,
                      })
                      this.$refs.addForm.resetForm();
                      this.addDialogVisible = false
                      this.refreshChange();
                      this.addInfo.drugList = []
                    } else {
                      this.$message({
                        type: "error",
                        message: res.data.msg
                      })
                    }
                  });
                } else if (this.activeName === 'jianyao') {
                  receiveDecoctingSave(params).then(res => {
                    if (res.data.code === 200) {
                      this.$message({
                        type: "success",
                        message: res.data.msg,
                      })
                      this.$refs.addForm.resetForm();
                      this.addDialogVisible = false
                      this.refreshChange();
                      this.addInfo.drugList = []
                    } else {
                      this.$message({
                        type: "error",
                        message: res.data.msg
                      })
                    }
                  });
                }
              })
          }
        });
      },
      //取消
      reject() {
        this.$refs.addCrud.toggleSelection();
        this.addDialogVisible = false;
      },
      //清空选择
      toggleSelection() {
        this.$refs.crud.toggleSelection();
      },
      //选择药品
      selectDrug() {
        dictionaryByName(this.activeName).then( res => {
          this.$refs.crudDrug.updateDic("goodsCategory",res.data.data);
        });
        this.selectDrugDialogVisible = true;
        this.drugRefreshChange();
      },
      //新增 按钮
      newAdd() {
        this.addDialogVisible = true;
        if (this.activeName === 'jianyao') {
          this.addOption = newAddDrugOption;
        } else if (this.activeName === 'tiaopei') {
          this.addOption = newAddGrainOption;
        }
        this.addOption.detail=false;
      },
      //抓药
      prescription() {
        this.$message({
          type: "success",
          message: "抓药",
        });
        this.dialogVisible = false
      },
      //查看
      lockInfo(row) {
        let url = '';
        if (row.orderType === "jianyao") {
          this.viewOption = newAddDrugOption;
          url = "/api/taocao-order/order/decoctingSelectByOrderId"
        } else if (row.orderType === "tiaopei") {
          this.viewOption = newAddGrainOption;
          url = "/api/taocao-order/order/blenderSelectByOrderId"
        } else {
          this.$message({
            type: 'error',
            message: '订单类型不匹配!'
          })
          return;
        }
        this.viewOption.detail=true;
        this.dialogVisible = true;
        getInfo(url, row.id).then(res => {
          console.log(res.data);
          this.orderInfo = res.data.data;
        })
      },
      drugSearchReset() {
        this.drugList.query = {};
        this.drugOnLoad(this.drugList.page);
      },
      drugSearchChange(params, done) {
        this.drugList.query = params;
        this.drugList.page.currentPage = 1;
        this.drugOnLoad(this.drugList.page, params);
        done();
      },
      drugSelectionChange(list) {
        this.drugList.selectionList = list;
      },
      drugSelectionClear() {
        this.drugList.selectionList = [];
        this.$refs.crud.toggleSelection();
      },
      drugCurrentChange(currentPage) {
        this.drugList.page.currentPage = currentPage;
      },
      drugSizeChange(pageSize) {
        this.drugList.page.pageSize = pageSize;
      },
      drugRefreshChange() {
        this.drugOnLoad(this.drugList.page, this.drugList.query);
      },
      drugOnLoad(page, params = {}) {
        this.drugList.loading = true;
        params.drugCategory = this.activeName;
        selectListByDrugCategory(page.currentPage, page.pageSize, Object.assign(params, this.drugList.query)).then(res => {
          const data = res.data.data;
          if (data.length == 0) {
            this.drugList.loading = false;
            this.drugSelectionClear();
            this.drugList.data = [];
            return;
          }
          data.records.forEach((value) => {
            value.tienum = 0
          })
          this.drugList.page.total = data.total;
          this.drugList.data = data.records;
          this.drugList.loading = false;
          this.drugSelectionClear();
        });
      }
    }
  };
</script>
