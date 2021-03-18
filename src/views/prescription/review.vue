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
                   v-if="permission.review_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>

      <template slot="drugsIdsArrayForm" slot-scope="scope">
        <el-select
          size="small"
          v-model="scope.row.drugsIdsArray"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :data-index="scope.index"
          :loading="loading">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.goodsName"
            :value="item.id">
          </el-option>
<!--          原38行 :disabled="disabled"-->
          </el-select>
      </template>


    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/prescription/review";
  import {mapGetters} from "vuex";
  import {likeListKL, selecListGoods,selectAlll} from "@/api/warehouse/goods";

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
        options:[],
       // disabled:true,
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
              label: "审核方名字",
              prop: "prescriptionName",
              labelWidth: 110,
              sortable: true,
              rules: [{
                required: true,
                message: "请输入审核方名字",
                trigger: "blur"
              }]
            },
            {
              label: '*药品',
              prop: "drugsIdsArray",
              hide:true,
              formslot: true,
            },
            {
              label: '*药品',
              prop: "drugsIdsArrays",
              addDisplay:false,
              editDisplay:false,
              viewDisplay:false,
            },
            {
              label: "备注",
              prop: "remarks",
              labelWidth: 110,
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
          addBtn: this.vaildData(this.permission.review_add, false),
          viewBtn: this.vaildData(this.permission.review_view, false),
          delBtn: this.vaildData(this.permission.review_delete, false),
          editBtn: this.vaildData(this.permission.review_edit, false)
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
    created() {
      this.optionsData();
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        console.log(query);
        setTimeout(() => {
          this.loading = false;
          selectAlll(query).then(res => {
            this.options = res.data.data;
          })
        }, 200);
      } else {
        this.options = [];
      }
    },
    methods: {
      optionsData() {
        likeListKL().then(res => {
          this.options = res.data.data;
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

      remoteMethod(query) {
        console.log(query)
        if (query !== '') {
          this.loading = true;
          console.log(query);
          setTimeout(() => {
            this.loading = false;
            selectAlll(query).then(res => {
              this.options = res.data.data;
            })
          }, 200);
        } else {
          this.options = [];
        }
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getDetail(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        /*if(type === "view"){
          this.disabled = true;
        }else if(type === "edit"){
          this.disabled = false;
        }*/
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
