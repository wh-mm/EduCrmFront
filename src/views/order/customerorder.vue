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
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" plain @click="newAddYin()">新增饮片
        </el-button>
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" plain @click="newAddKe()">新增颗粒
        </el-button>
      </template>
      <!--修改-->
      <template slot-scope="scope" slot="menu">
        <el-button type="text" icon="el-icon-view" size="small" @click.stop="lockInfo(scope.row)">查 看</el-button>
        <el-button type="text" icon="el-icon-edit" size="small"
                   v-if="scope.row.orderStatic==1"
                   @click.stop="orderEdits(scope.row)">编 辑
        </el-button>
        <el-button type="text" icon="el-icon-delete-solid" size="small" v-if="scope.row.orderStatic==1"
                   @click="handleDelete(scope.row)">删 除
        </el-button>

        <!-- <el-button type="text" icon="el-icon-check" size="small" @click.stop="prescription()">抓 药</el-button>-->
      </template>

      <template slot="orderDifferentiation" slot-scope="scope">
        <div style="color:#f391a9" v-if="scope.row.orderDifferentiation =='1'?true:false">手动下单</div>
        <div style="color: #009ad6" v-else>医院下单</div>
      </template>

      <template slot="orderType" slot-scope="scope">
        <div style="color: #1d1626" v-if="scope.row.orderType =='tiaopei'?true:false">颗粒</div>
        <div style="color: #ef5b9c" v-else>饮片</div>
      </template>
    </avue-crud>

    <!-- 新增饮片 -->
    <el-dialog title="新增饮片" :visible.sync="addYinDialogVisible" v-if="addYinDialogVisible"
               width="90%" :modal="false" :close-on-click-modal="false">
      <addYinPian @reject="rejectYin"></addYinPian>
    </el-dialog>
    <el-dialog title="新增颗粒" :visible.sync="addKeDialogVisible" v-if="addKeDialogVisible"
               width="90%" :modal="false" :close-on-click-modal="false">
      <addKeLi @reject="rejectKe"></addKeLi>
    </el-dialog>
    <el-dialog title="订单饮片详情" :visible.sync="viewYinDialogVisible" v-if="viewYinDialogVisible"
               width="90%" :modal="false" :close-on-click-modal="false">
      <viewYinPian :orderInfo="orderInfo"></viewYinPian>
    </el-dialog>
    <el-dialog title="订单颗粒详情" :visible.sync="viewKeDialogVisible" v-if="viewKeDialogVisible"
               width="90%" :modal="false" :close-on-click-modal="false">
      <viewKeLi :orderInfo="orderInfo"></viewKeLi>
    </el-dialog>
    <el-dialog title="订单颗粒编辑" :visible.sync="editKeLiDialogVisible" v-if="editKeLiDialogVisible"
               width="90%" :modal="false" :close-on-click-modal="false">
      <editKeLi @reject="rerejectKeLi" :orderEdit="orderEdit"></editKeLi>
    </el-dialog>
    <el-dialog title="订单饮片编辑" :visible.sync="editYinPianDialogVisible" v-if="editYinPianDialogVisible"
               width="90%" :modal="false" :close-on-click-modal="false">
      <editYinPian @reject="rerejectYinPian" :orderEdit="orderEdit"></editYinPian>
    </el-dialog>
  </basic-container>
</template>

<script>
import {getInfo, getList, orderDelete} from "@/api/order/order";
import addYinPian from "./addClinic/addYinPian";
import addKeLi from "./addClinic/addKeLi";
import viewYinPian from "./view/viewYinPian";
import viewKeLi from "./view/viewKeLi";
import {mapGetters} from "vuex";
import editKeLi from "./edit/editKeLi";
import editYinPian from "./edit/editYinPian";

export default {
  components: {
    addYinPian,
    addKeLi,
    viewYinPian,
    viewKeLi,
    editKeLi,
    editYinPian
  },
  name: "customerorder",
  data() {
    return {
      addYinDialogVisible: false,
      addKeDialogVisible: false,
      viewKeDialogVisible: false,
      viewYinDialogVisible: false,
      editKeLiDialogVisible: false,
      editYinPianDialogVisible: false,

      orderInfo: {
        form: {},
        drugList: []
      },
      orderEdit: {
        form: {},
        drugList: []
      },

      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        excelBtn: true,
        printBtn: true,
        addBtn: false,
        height: "auto",
        calcHeight: 30,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        viewBtn: false,
        selection: true,
        dialogClickModal: false,
        column: [
          {
            label: "订单id",
            sortable: true,
            prop: "id",
            width: 150,
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
            search: true,
            dicUrl: "/api/taocao-hisHospital/hospital/selectHosptal"
          },
          {
            label: "订单状态",
            prop: "orderStatic",
            type: "select",
            props: {
              label: 'dictValue',
              value: 'dictKey'
            },
            search: true,
            required: true,
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=order_status",
            trigger: "blur"
          },
          {
            label: "订单类型",
            prop: "orderType",
            type: "select",
            slot: true,
            props: {
              label: 'dictValue',
              value: 'dictKey'
            },
            search: true,
            required: true,
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=order_type",
            trigger: "blur"
          },
          {
            label: "订单区分",
            prop: "orderDifferentiation",
            type: "select",
            slot: true,
            props: {
              label: 'dictValue',
              value: 'dictKey'
            },
            search: true,
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=order_differentiation",
            trigger: "blur"
          },
          {
            label: "收货地址",
            prop: "address",
            rules: [{
              required: true,
              message: "请输入收货地址",
              trigger: "blur"
            }]
          },
          {
            label: "收件人",
            prop: "addressee",
            rules: [{
              required: true,
              message: "请输入收件人",
              trigger: "blur"
            }],
            search: true,
          },
          {
            label: "收件人电话",
            prop: "addresseePhone",
            labelWidth: 100,
          },


          {
            label: "订单时间",
            prop: "releaseTimeRange",
            type: "datetime",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            searchRange: true,
            searchSpan: 6,
            hide: true,
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            search: true,
            rules: [{
              required: true,
              message: "请输入通知时间",
              trigger: "blur"
            }]
          },
          {
            label: "订单时间",
            prop: "orderTime",
            type: "date",
            width: 150,
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            rules: [{
              required: true,
              message: "请输入通知日期",
              trigger: "click"
            }]
          },
          {
            label: "总价",
            prop: "totalPrices",
            rules: [{
              required: true,
              message: "请输入总价",
              trigger: "blur"
            }]
          },
        ]
      },
      data: []
    };
  },
  watch: {},
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

    //取消
    rejectYin() {
      this.addYinDialogVisible = false;
      this.refreshChange();
    },
    rejectKe() {
      this.addKeDialogVisible = false;
      this.refreshChange();
    },
    newAddYin() {
      this.addYinDialogVisible = true;
      this.refreshChange();
    },
    newAddKe() {
      this.addKeDialogVisible = true;
      this.refreshChange();
    },
    rerejectKeLi() {
      this.editKeLiDialogVisible = false;
    },
    rerejectYinPian() {
      this.editYinPianDialogVisible = false;
    },

    //抓药
    prescription() {
      this.$message({
        type: "success",
        message: "抓药",
      });
      this.dialogVisible = false
    },


    onLoad(page, params = {}) {
      //时间
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
    //删除
    handleDelete(row) {
      console.log(row.id)
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return orderDelete(row.id);
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
    //编辑
    orderEdits(row) {
      //debugger
      let url = '';
      if (row.orderType === "jianyao") {
        url = "/api/taocao-order/order/decoctingSelectByOrderId"
      } else if (row.orderType === "tiaopei") {
        url = "/api/taocao-order/order/blenderSelectByOrderId"
      } else {
        this.$message({
          type: 'error',
          message: '订单类型不匹配!'
        })
        return;
      }
      getInfo(url, row.id).then(res => {
        this.orderEdit = res.data.data;
        if (row.orderType === "jianyao") {
          this.editYinPianDialogVisible = true;
        } else if (row.orderType === "tiaopei") {
          this.editKeLiDialogVisible = true;
        } else {
          this.$message({
            type: 'error',
            message: '订单类型不匹配!'
          })
          return;
        }
      })
    },

    //查看
    lockInfo(row) {
      let url = '';
      if (row.orderType === "jianyao") {
        url = "/api/taocao-order/order/decoctingSelectByOrderId"
      } else if (row.orderType === "tiaopei") {
        url = "/api/taocao-order/order/blenderSelectByOrderId"
      } else {
        this.$message({
          type: 'error',
          message: '订单类型不匹配!'
        })
        return;
      }
      getInfo(url, row.id).then(res => {
        this.orderInfo = res.data.data;
        if (row.orderType === "jianyao") {
          this.viewYinDialogVisible = true;
        } else if (row.orderType === "tiaopei") {
          this.viewKeDialogVisible = true;
        } else {
          this.$message({
            type: 'error',
            message: '订单类型不匹配!'
          })
          return;
        }
      })
    }
  }
};
</script>
