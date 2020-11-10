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
               @row-click="handleRowClick"
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
      </template>
      <template slot="hospitalSwitch" slot-scope="scope">
        <el-switch v-model="scope.row.hospitalSwitch" disabled @click="(scope.row)"> </el-switch>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove,
	selectHosptalByHospintl,receiveDecocting} from "@/api/hisHospital/hospital";
  import {mapGetters} from "vuex";
  export default {
    data() {
      var hospitalName = (rule, value, callback)=>{
        if (value === ''){
          callback(new Error("医院名称重复,请从新输入!"))
        }else {
          selectHosptalByHospintl(this.form.id,value).then( res => {
            if(res.data.success){
              callback();
            }else{
              callback(new Error(res.data.msg));
            }
          },err =>{
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
              label: "医院名字",
              prop: "hospitalName",
              rules: [{
                required: true,
                message: "请输入医院名字",
                validator:hospitalName,
                trigger: 'blur' }],
            },

            {
              label: "医院地址",
              prop: "hospitalProfile",
              rules: [{
                required: true,
                message: "请输入医院地址",
                trigger: "blur"
              }]
            },
            {
              label: "医院接口开关",
              prop: "hospitalSwitch",
              slot: true,
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
      handleRowClick(row) {
        console.log(row.hospitalSwitch);
        console.log(row.id);
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
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          data.records.forEach((value)=>{
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
  .el-switch.is-disabled {
    opacity: 1;
  }
  .el-switch.is-disabled .el-switch__core, .el-switch.is-disabled .el-switch__label {
    cursor: pointer !important;;
  }
</style>
