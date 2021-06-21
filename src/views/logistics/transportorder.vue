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
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.transportorderdetail_delete"
                   @click="handleDelete">删 除
        </el-button>

      </template>
      <template slot-scope="{type,size,row}" slot="menu">
        <el-button  :size="size"
                    :type="type"
                    icon="el-icon-check"
                    v-if="row.status === 1"
                    @click="updateById(row.id,row.id)">完成
        </el-button>
        <el-button :type="type" :size="size" v-if="row.transportStatus === 1" icon="el-icon-edit"
                   @click="$refs.crud.rowEdit(row,index)">编辑
        </el-button>
        <el-button :type="type" :size="size" v-if="row.transportStatus === 1" icon="el-icon-delete"
                   @click="$refs.crud.rowDel(row,index)">删除
        </el-button>
        <el-button :type="type" :size="size" v-if="row.transportStatus === 1" icon="el-icon-check"
                   @click="updateStatus(row.id,2)">发布
        </el-button>
        <el-button :type="type" :size="size" v-if="row.transportStatus === 3" icon="el-icon-check"
                   @click="updateStatus(row.id,4)">上车
        </el-button>
        <el-button :type="type" :size="size" v-if="row.transportStatus === 4" icon="el-icon-check"
                   @click="updateStatus(row.id,5)">配送
        </el-button>
        <el-button :type="type" :size="size" v-if="row.transportStatus === 5" icon="el-icon-check"
                   @click="updateStatus(row.id,6)">等待取货
        </el-button>
        <el-button :type="type" :size="size" v-if="row.transportStatus === 6" icon="el-icon-check"
                   @click="updateStatus(row.id,7)">送达
        </el-button>
      </template>
      <template slot-scope="scope" slot="menuForm">
        <el-button @click="saveAndPublish">保存并发布</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {getList, getDetail, add, update, remove, updateStatus} from "@/api/logistics/transportorder";
import {mapGetters} from "vuex";
import {updateById} from "@/api/logistics/handoverform";

export default {
  data() {
    var validateQuantity = (rule, value, callback) => {
      console.log(value);
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
      selectionList: [],
      option: {
        height: 'auto',
        calcHeight: 30,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        viewBtn: true,
        addBtn: false,
        excelBtn: true,
        editBtn: false,
        delBtn: false,
        selection: true,
        dialogClickModal: false,
        labelWidth: 110,
        menuWidth: 250,
        emptyBtn: false,
        submitBtn: false,
        column: [
          {
            label: "运输单",
            prop: "orderNumber",
            editDisplay: false,
            addDisplay: false,
            search: true,
          },
          {
            label: "车辆",
            prop: "carId",
            type: 'select',
            search: true,
            props: {
              label: 'name',
              value: 'id'
            },
            rules: [{
              required: true,
              message: "请选择运送车辆",
              trigger: "blur"
            }],
            dicUrl: '/api/logistics/taocar/selectTaoCar'
          },
          {
            label: "司机",
            prop: "driverId",
            type: 'select',

            props: {
              label: 'name',
              value: 'id'
            },
            rules: [{
              required: true,
              message: "请选择运送人员",
              trigger: "blur"
            }],
            dicUrl: '/api/logistics/taodriver/selectTaodriver'
          },
          {
            label: "状态",
            prop: "transportStatus",
            addDisplay: false,
            editDisplay: false,
            dicUrl: "/api/blade-system/dict/dictionary?code=distribution_status",
            props: {
              label: "dictValue",
              value: "dictKey"
            }
          },
          {
            label: '运输列表',
            prop: 'detailList',
            type: 'dynamic',
            span: 24,
            children: {
              align: 'center',
              headerAlign: 'center',
              rowAdd: (done) => {
                done();
              },
              rowDel: (row, done) => {
                done();
              },
              column: [{
                label: "配送号",
                prop: "businessNumber",
              }, {
                label: '类型',
                prop: "type",
              }],
            }
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
        addBtn: this.vaildData(this.permission.transportorder_add, false),
        viewBtn: this.vaildData(this.permission.transportorder_view, false),
        delBtn: this.vaildData(this.permission.transportorder_delete, false),
        editBtn: this.vaildData(this.permission.transportorder_edit, false)
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
        this.$message({
          type: "error",
          message: error.data.msg
        });
      });
    },
    saveAndPublish() {
      this.$refs.crud.validate((vaild, done) => {
        if (vaild) {
          add(this.form).then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            done();
          }, error => {
            done();
            this.$message({
              type: "error",
              message: error.data.msg
            });
          });
        }
      })
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
    updateById(id) {
      updateById(id).then(res => {
        if (res.data.success) {
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
        this.refreshChange();
        this.onLoad(this.page);
      })
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
    updateStatus(id, status) {
      updateStatus(id, status).then(res => {
        if (res.data.success) {
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
        this.refreshChange();
      })
    }
  }
};
</script>

<style>
</style>
