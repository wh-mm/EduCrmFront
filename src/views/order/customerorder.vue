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
                   v-if="permission.order_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/order/order";
  import {mapGetters} from "vuex";

  export default {
    data() {
		var phonelength = (rule, value, callback) => {
			console.log(value.length);
			if (value.length != 11) {
				callback(new Error('请输入正确手机号'));
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
			/*
            {
              label: "库存状态",
              prop: "inventoryStatus",
              rules: [{
                required: true,
                message: "请输入库存状态",
                trigger: "blur"
              }]
            },
			*/
            {
              label: "订单状态",
              prop: "orderStatic",
			  type: "select",
              props: {
              	label: 'dictValue',
              	value: 'dictKey'
              },
                required: true,
                dicUrl: "/api/blade-system/dict-biz/dictionary?code=order_status",
                trigger: "blur"
              },
            
			
            {
              label: "订单类型",
              prop: "orderType",
			  type: "select",
				props: {
             	label: 'dictValue',
             	value: 'dictKey'
             },
			 required: true,
			 dicUrl: "/api/blade-system/dict-biz/dictionary?code=order_type",
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
              }]
            },
            {
              label: "收件人电话",
              prop: "addresseePhone",
              rules: [{
              	required: true,
              	validator: phonelength,
              	trigger: 'blur'
              }]
            },
            {
              label: "订单时间",
              prop: "orderTime",
				type: 'datetime',
				format: "yyyy-MM-dd HH:mm:ss",
				valueFormat: "yyyy-MM-dd HH:mm:ss",
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
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.order_add, false),
          viewBtn: this.vaildData(this.permission.order_view, false),
          delBtn: this.vaildData(this.permission.order_delete, false),
          editBtn: this.vaildData(this.permission.order_edit, false)
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
