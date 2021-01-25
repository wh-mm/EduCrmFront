<template>
  <!--医院接口-->
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
                   v-if="permission.hospital_delete"
                   @click="handleDelete">删 除
        </el-button>
        <el-button type="warning"
                   size="small"
                   plain
                   icon="el-icon-download"
                   v-if="permission.hospital_export"
                   @click="handleExport">导出
        </el-button>
      </template>
      <!--<template slot="hospitalSwitch" slot-scope="scope,row">
        <el-tag>{{scope.row.hospitalSwitch}}
        </el-tag>
      </template>-->
      <template slot="hospitalSwitch" slot-scope="scope">
        <div style="color: green" v-if="scope.row.hospitalSwitch=='true'?true:false">开</div>
        <div style="color: red" v-else>关</div>
      </template>

    </avue-crud>
  </basic-container>
</template>

<script>
import {
  getList, getDetail, add, update, remove,
  selectHosptalByHospintl
} from "@/api/hisHospital/hospital";
import {mapGetters} from "vuex";
import {getToken} from "@/util/auth";

export default {
  data() {

    var hospitalName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error("医院名称重复,请从新输入!"))
      } else {
        selectHosptalByHospintl(this.form.id, value).then(res => {
          if (res.data.success) {
            callback();
          } else {
            callback(new Error(res.data.msg));
          }
        }, err => {
          callback(new Error(err.data.msg));
        })
      }
    }

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
        selection: true,
        cancelBtn: false,
        dialogClickModal: false,
        column: [
          {
            label: "医院名字",
            sortable:true,
            prop: "hospitalName",
            search: true,
            rules: [{
              required: true,
              message: "请输入医院名字",
              validator: hospitalName,
              trigger: 'blur'
            }],
          },
          {
            label: "key",
            prop: "id",
            sortable:true,
            /*append: "供应商唯一编号",*/
            labelWidth: 110,
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            search: true,
            rules: [{
              required: true,
              trigger: "blur"
            }]
          },
          {
            label: "医院地址",
            sortable:true,
            prop: "hospitalProfile",
            rules: [{
              required: true,
              message: "请输入医院地址",
              trigger: "blur"
            }],
            overHidden: true,
          },
          {
            label: "医院联系方式",
            prop: "hospitalTel",
            sortable:true,
            rules: [{
              required: true,
              message: "医院联系方式",
              trigger: "blur"
            }]
          },
          {
            label: "医院接口开关",
            prop: "hospitalSwitch",
            sortable:true,
            type: 'select',
            searchLabelWidth: 140,
            searchSpan: 7,
            search: true,
            slot: true,
            props: {
              label: 'dictValue',
              value: 'dictKey',
            },
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=hospital_switch",
          },
          {
            label: "医院操作员名称",
            prop: "hospitalUserId",
            sortable:true,
            type: 'tree',
            searchLabelWidth: 140,
            searchSpan: 7,
            search: true,
            props: {
              label: 'name',
              value: 'id',
            },
            dicUrl: "/api/blade-user/selectAllUser",
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
        addBtn: this.vaildData(this.permission.hospital_add, false),
        viewBtn: this.vaildData(this.permission.hospital_view, false),
        delBtn: this.vaildData(this.permission.hospital_delete, false),
        editBtn: this.vaildData(this.permission.hospital_edit, false)
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
  //医院开关
  methods: {
    /*      handleRowClick(row) {
            this.$confirm("请在此确认", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
               // return remove(row.id);

                let params = {
                  hospitalSwitch: !row.hospitalSwitch,
                  id: row.id
                }
                add(params).then((res)=>{
                  console.log(res)
                  if (res.data.code == 200){
                    this.$message({
                      type: "success",
                      message: res.data.msg
                    });
                    this.refreshChange();
                  }else{
                    this.$message({
                      type: "error",
                      message: res.data.msg
                    });
                  }
                })
              })
              .then(() => {
                this.onLoad(this.page);
                this.$message({
                  type: "success",
                  message: "操作成功!"
                });
              });
    /!*        console.log(row.hospitalSwitch);
            console.log(row.id);*!/

          },*/
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
    uploadAfter(res, done, loading, column) {
      window.console.log(column);
      console.log(res);
      this.excelBox = false;
      this.refreshChange();
      done();
    },
    //导出
    handleExport() {
      this.$confirm("是否导出医院信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        window.open(`/api/taocao-hisHospital/hospital/export-hosptal?${this.website.tokenHeader}=${getToken()}`);
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
        data.records.forEach((value) => {
          value.$cellEdit = true
        })
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    }
  }
};
</script>

<style>
/* .el-switch.is-disabled {
   opacity: 1;
 }
 .el-switch.is-disabled .el-switch__core, .el-switch.is-disabled .el-switch__label {
   cursor: pointer !important;;
 }*/
</style>
