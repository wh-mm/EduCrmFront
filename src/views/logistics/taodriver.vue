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
                   v-if="permission.taodriver_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/logistics/taodriver";
  import {mapGetters} from "vuex";

  export default {
    data() {
      var validateIdCard = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入正确的驾驶证号或身份证号'));
        } else {
          if (value !== '') {
            if (12 <= value.length && value.length <= 18) {
              var card = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
              var drivercard = /^[1-8]\d{11}$/;
              if (card.test(value) || drivercard.test(value)) {
                callback();
              } else {
                callback(new Error('请输入有效的驾驶证号或身份证号'));
              }
            } else {
              callback(new Error('请输入12位-18位的驾驶证号或者身份证号'))
            }
          }
          callback();
        }
      };
      var validateDriverYear = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入驾龄'));
        } else {
          if (value <= 0) {
            callback(new Error('请输入正确的驾龄'));
          } else if (value >= 52) {
            callback(new Error('驾龄不能超过52年'));
          } else {
            callback();
          }
        }
      };
      var validateYear = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入年龄'));
        } else {
          if (value <= 18) {
            callback(new Error('请输入18岁以上的年龄'));
          } else if (value >= 70) {
            callback(new Error('年龄不能超过70岁'));
          } else {
            callback();
          }
        }
      };
      var isInteger= (rule, value, callback) => {
        if (!value) {
          return callback(new Error('输入不可以为空'));
        }
        setTimeout(() => {
          if (!Number(value)) {
            callback(new Error('请输入正整数'));
          } else {
            const re = /^[0-9]*[1-9][0-9]*$/;
            const rsCheck = re.test(value);
            if (!rsCheck) {
              callback(new Error('请输入正整数'));
            } else {
              callback();
            }
          }
        }, 0);
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
          height:'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          excelBtn:true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "名字",
              prop: "name",
              labelWidth: 140,
              rules: [{
                required: true,
                message: "请输入名字",
                trigger: "blur"
              }]
            },
            {
              label: "年龄",
              prop: "age",
              labelWidth: 140,
              rules: [{
                validator: validateYear,
                trigger: "blur"
              }]
            },
            {
              label: "驾驶证号,身份证",
              prop: "identityCard",
              labelWidth: 140,
              rules: [{
                required: true,
                validator: validateIdCard,
                trigger: "blur"
              }]
            },

            {
              label: "手机号",
              prop: "phone",
              labelWidth: 140,
              maxlength:11,
              showWordLimit:true,
              rules: [{
                validator: isInteger,
                trigger: "blur"
              }]
            },
            {
              label: "驾龄",
              prop: "driveAge",
              labelWidth: 140,
              rules: [{
                validator:validateDriverYear,
                trigger: "blur"
              }]
            },
            {
              label: "驾驶证开始时间",
              prop: "driveStartTime",
              labelWidth: 140,
              type: "datetime",
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
              rules: [{
                required: true,
                message: "请输入驾驶证开始时间",
                trigger: "blur"
              }]
            },
            {
              label: "驾驶证结束时间",
              prop: "driveEndTime",
              labelWidth: 140,
              type: "datetime",
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
              rules: [{
                required: true,
                message: "请输入驾驶证结束时间",
                trigger: "blur"
              }]
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
          addBtn: this.vaildData(this.permission.taodriver_add, false),
          viewBtn: this.vaildData(this.permission.taodriver_view, false),
          delBtn: this.vaildData(this.permission.taodriver_delete, false),
          editBtn: this.vaildData(this.permission.taodriver_edit, false)
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
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      }
    }
  };
</script>

<style>
</style>
