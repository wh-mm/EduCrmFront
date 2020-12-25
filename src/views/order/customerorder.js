import {
  dictionaryByName,
  getInfo,
  getList,
  clinicReceiveBlender,
  clinicReceiveDecoctingSave,
  selectListByDrugCategory
} from "@/api/order/order";
import {mapGetters} from "vuex";
import {
  newAddBlenderListOption,
  newAddDrugListOption,
  newAddDrugOption,
  newAddGrainOption,
  option,
  viewAddBlenderListOption,
  viewDrugListOption
} from "@/const/order/customerorderss"

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
              label: "医院名称",
              prop: "hospitalId",
            },
            {
              label: "颗粒名称",
              prop: "goodsName",
              type: "tree",
              props: {
                label: 'goodsName',
                value: 'id'
              },
              search: true,
              dicMethod: "post",
              dicUrl: this.ERP_WMS_NAME + '/goods/selecListGoods'
            },
            {
              label: "货物类型",
              prop: "goodsType",
              type: "tree",
              rules: [{
                required: true,
                message: "请选择货物类型",
                trigger: "blur"
              }],
              props: {
                label: 'title',
                value: 'id'
              },
              search: true,
              dicUrl: this.ERP_WMS_NAME + "/goods-type/tree"
            },
            {
              label: "规格",
              prop: "goodsSpecification",


            },
            {
              label: "单价",
              prop: "unitPrice",
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
        form: {},
        drugList: []
      },
      orderType: 1,
      addOption: '',
      addCrudOption: '',
      viewOption: '',
      viewCrudOption: '',
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
  watch: {
    addDialogVisible() {
      if (!this.addDialogVisible) {
        this.activeName = 'jianyao';
      }
    }
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
    handleClick() {
      this.tabFrom();
      this.addInfo.form = {};
      this.addInfo.drugList = [];
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
    //确认选择
    selectDrugBtn() {
      this.drugList.selectionList.forEach(l => {
        l.drugAllnum = 1;
        l.tienum = 1;
        l.doseHerb = 1;
        l.equivalent = 1;
        l.dose = 1;
      })
      var drugList = Object.assign([], this.drugList.selectionList);
      for (let i = 0; i < drugList.length; i++) {
        this.addInfo.drugList.push(drugList[i]);
      }
      this.selectDrugDialogVisible = false;
      this.$refs.crud.toggleSelection();
    },
    //保存
    bcBtn() {
      this.$refs.addForm.validate((valid, callback) => {
        if (valid) {
          this.$confirm("请仔细查阅一经保存无法删除！", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              let params = {};
              params = this.addInfo.form;
              params.orderType = this.activeName;
              params.drugList = this.addInfo.drugList;
              if (this.activeName === 'tiaopei') {
                clinicReceiveBlender(params).then(res => {
                  if (res.data.code === 200) {
                    this.$message({
                      type: "success",
                      message: res.data.msg,
                    })
                    this.$refs.addForm.resetForm();
                    this.addDialogVisible = false
                    this.refreshChange();
                    this.addInfo.drugList = []
                    this.addInfo.form = {};
                  } else {
                    this.$message({
                      type: "error",
                      message: res.data.msg
                    })
                    callback();
                  }
                });
              } else if (this.activeName === 'jianyao') {
                clinicReceiveDecoctingSave(params).then(res => {
                  if (res.data.code === 200) {
                    this.$message({
                      type: "success",
                      message: res.data.msg,
                    })
                    this.$refs.addForm.resetForm();
                    this.addDialogVisible = false
                    this.refreshChange();
                    this.addInfo.drugList = []
                    this.addInfo.form = {};
                  } else {
                    this.$message({
                      type: "error",
                      message: res.data.msg
                    })
                    callback();
                  }
                });
              }
            }).catch(() => {
            callback();
          })
        }
      })
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
      this.selectDrugDialogVisible = true;
      this.drugRefreshChange();
      setTimeout(() => {
        dictionaryByName(this.activeName).then(res => {
          this.$refs.crudDrug.updateDic("goodsCategory", res.data.data);
        });
      }, 20);
    },
    delDrug(){
      this.addInfo.drugList =[];
    },
    //新增 按钮
    newAdd() {
      this.addDialogVisible = true;
      this.tabFrom();
      this.addOption.detail = false;
    },
    tabFrom() {
      if (this.activeName === 'jianyao') {
        this.addOption = Object.assign({}, newAddDrugOption);
        this.addCrudOption = Object.assign({}, newAddDrugListOption);
      } else if (this.activeName === 'tiaopei') {
        this.addOption = Object.assign({}, newAddGrainOption);
        this.addCrudOption = Object.assign({}, newAddBlenderListOption);
        setTimeout(() => {
          this.$refs.addForm.updateDic("quantity");
        }, 20);
      }
    },
    //抓药
    prescription() {
      this.$message({
        type: "success",
        message: "抓药",
      });
      this.dialogVisible = false
    },
    //时间
    onLoad(page, params = {}) {
      const {releaseTimeRange} = params;
      let values = {
        ...params,
      };
      if (releaseTimeRange) {
        values = {
          ...params,
          startTime: releaseTimeRange[0],
          endTime: releaseTimeRange[1],
        };
        values.releaseTimeRange = null;
        this.query.releaseTimeRange = null;
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

    //查看
    lockInfo(row) {
      let url = '';
      this.dialogVisible = true;
      if (row.orderType === "jianyao") {
        this.viewOption = Object.assign({}, newAddDrugOption);
        this.viewCrudOption = Object.assign({}, viewDrugListOption);
        url = "/api/taocao-order/order/decoctingSelectByOrderId"
        setTimeout(() => {
          this.$refs.addForm.updateDic("decscheme");
        }, 20);
      } else if (row.orderType === "tiaopei") {
        this.viewOption = Object.assign({}, newAddGrainOption);
        this.viewCrudOption = Object.assign({}, viewAddBlenderListOption);
        url = "/api/taocao-order/order/blenderSelectByOrderId"
      } else {
        this.$message({
          type: 'error',
          message: '订单类型不匹配!'
        })
        return;
      }
      this.viewOption.detail = true;
      getInfo(url, row.id).then(res => {
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
          value.drugAllnum = 0
          value.tienum = 0
          value.doseHerb = 1
          value.equivalent = 1
        })
        this.drugList.page.total = data.total;
        this.drugList.data = data.records;
        this.drugList.loading = false;
        this.drugSelectionClear();
      });
    },
  }
};

