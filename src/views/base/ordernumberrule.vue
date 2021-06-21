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
                   v-if="permission.ordernumberrule_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot="fieldTwo" slot-scope="scope">
        <el-tag>{{scope.row.fieldTwo.replace('year','年').replace('month','月').replace('day','日')}}</el-tag>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {
  getList,
  getDetail,
  add,
  update,
  remove
} from "@/api/base/ordernumberrule";
import { mapGetters } from "vuex";
import { setTimeout } from "timers";

export default {
  data() {
    return {
      form: {},
      fieldFourValue: "",
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        height: "auto",
        calcHeight: 30,
        labelWidth: 100,
        tip: false,
        addBtn:true,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        viewBtn: true,
        selection: true,
        dialogClickModal: false,
        column: [
          {
            label: "订单类型",
            prop: "orderType",
            type: "select",
            row: 24,
            rules: [
              {
                required: true,
                message: "请选择订单类型",
                trigger: "blur"
              }
            ],
            dicUrl: "/api/blade-system/dict/dictionary?code=order_number",
            props: {
              label: "dictValue",
              value: "dictKey"
            }
          },

          {
            label: "单号前缀",
            prop: "fieldOne",
            value: "",
            rules: [
              {
                required: true,
                message: "请输入单号前缀",
                trigger: "blur"
              }
            ],
            change: ({ value }) => {
              this.form.example = this.generateExample(
                value,
                this.form.fieldTwo,
                this.form.fieldThree,
                this.form.fieldFour
              );
            }
          },
          {
            label: "时间戳",
            prop: "fieldTwo",
            value: ["year","month","day"],
            slot: true,
            type: "checkbox",
            dicData: [
              {
                label: "年",
                value: "year"
              },
              {
                label: "月",
                value: "month"
              },
              {
                label: "日",
                value: "day"
              }
            ],
            change: ({ value }) => {
              this.form.example = this.generateExample(
                this.form.fieldOne,
                value,
                this.form.fieldThree,
                this.form.fieldFour
              );
            }
          },
          {
            label: "流水号位数",
            prop: "fieldThree",
            type: "number",
            value: 3,
            rules: [
              {
                required: true,
                message: "请输入流水号位数",
                trigger: "blur"
              }
            ],
            change: ({ value }) => {
              this.form.example = this.generateExample(
                this.form.fieldOne,
                this.form.fieldTwo,
                value,
                this.form.fieldFour
              );
            }
          },
          {
            label: "起始编号",
            prop: "fieldFour",
            type: "number",
            value: 1,
            rules: [
              {
                required: true,
                message: "请输入起始编号",
                trigger: "blur"
              }
            ],
            change: ({ value }) => {
              if (value.length > this.form.fieldThree) {
                this.$message.error("起始编号不能超出编码位数");
                setTimeout(() => {
                  this.form.fieldFour = this.oldfieldFour;
                }, 500);
                return;
              }
              this.oldfieldFour = value;
              this.form.example = this.generateExample(
                this.form.fieldOne,
                this.form.fieldTwo,
                this.form.fieldThree,
                value
              );
            }
          },
          {
            label: "范例",
            prop: "example",
            hide:true,
            value: "",
            disabled: true
          }
        ]
      },
      data: [],
      oldfieldFour: ""
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.ordernumberrule_add, false),
        viewBtn: this.vaildData(this.permission.ordernumberrule_view, false),
        delBtn: this.vaildData(this.permission.ordernumberrule_delete, false),
        editBtn: this.vaildData(this.permission.ordernumberrule_edit, false)
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
    //生成范例
    generateExample(fieldOne, fieldTwo, fieldThree, fieldFour) {
      if(fieldOne == null && fieldThree == null || fieldThree != "" && fieldFour == null || fieldFour == ""){
        return ;
      }
      let num = "";
      let myDate = new Date();
      let year = myDate.getFullYear();
      let month =
        myDate.getMonth() < 10 ? "0" + myDate.getMonth() : myDate.getMonth();
      let day =
        myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate();

      if(fieldTwo != "" && fieldTwo != null ){
        let vaData = JSON.parse(JSON.stringify(fieldTwo));
        vaData.forEach(val => {
          if (val == "year") {
            num = num + year;
          } else if (val == "month") {
            num = num + month;
          } else if (val == "day") {
            num = num + day;
          }
        });
      }
      if(fieldThree!= null && fieldThree != "" && fieldFour!= null && fieldFour != ""){
        fieldFour = fieldFour + "";
        for (let i = fieldFour.length; i < fieldThree; i++) {
          fieldFour = "0" + fieldFour ;
        }
      }
      return fieldOne + num + fieldFour;
    },
    rowSave(row, done, loading) {
      row.fieldTwo = row.fieldTwo.join(",");
      add(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        },
        error => {
          loading();
          this.$message({
            type: "error",
            message: error.data.msg
          });
        }
      );
    },
    rowUpdate(row, index, done, loading) {
      row.fieldTwo = row.fieldTwo.join(",");
      update(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        },
        error => {
          loading();
          console.log(error);
        }
      );
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
      getList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query)
      ).then(res => {
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
