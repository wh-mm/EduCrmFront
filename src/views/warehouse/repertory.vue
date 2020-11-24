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
        <el-button type="primary"
                   size="small"
                   v-if="permission.repertory_input"
                   icon="el-icon-plus"
                   plain
                   @click="dialogVisible = true,title = '入 库',obj.type = 'in' ">入 库
        </el-button>

      </template>
    </avue-crud>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      :modal="false"
      :before-close="handleClose">
      <avue-form ref="form" v-model="obj" :option="optionForm" @submit="submit">
      </avue-form>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {getList} from "@/api/warehouse/repertory";
  import {add} from "@/api/warehouse/warehouseinoutput";
  import {mapGetters} from "vuex";

  export default {
    data() {
      var validateNumber = (rule, value, callback)=>{
        if (value === '') {
          callback(new Error('请输入数量'));
        } else if(value < 1){
          callback(new Error('请输入正确的数量'));
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
        obj:{},
        title: '' ,
        dialogVisible:false,
        selectionList: [],
        option: {
          height:'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          menu: false,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "仓库",
              prop: "warehouseId",
              type:'tree',
              search:true,
              props: {
                label: 'title',
                value: 'id'
              },
              // cascaderItem: ['storageId'],
              dicUrl: '/api/erp-wms/warehouse/tree'
            },
            {
              label: "商品",
              prop: "goodsId",
              type:'select',
              row: true,
              span: 24,
              props: {
                label: 'goodsName',
                value: 'id'
              },
              dicMethod:"post",
              dicUrl:'/api/taocao-warehouse/goods/dropDown',
            },
            {
              label: "库存数量",
              prop: "repertoryQuantity",
              rules: [{
                trigger: "blur"
              },
              ]
            },
            {
              label: "修改时间",
              prop: "updateTime",
              dateDefault: true,
              addDisplay: false,
              viewDisplay: false,
              type: "datetime",
              searchSpan:12,
              searchRange:true,
              search:true,
              format: "yyyy-MM-dd hh:mm:ss",
              valueFormat: "yyyy-MM-dd hh:mm:ss",
            },
          ]
        },
        data: [],
        optionForm : {
          column: [
            {
              label: "商品",
              prop: "goodsId",
              type:'tree',
              row: true,
              span: 24,
              props: {
                label: 'goodsName',
                value: 'id'
              },
              rules:[{
                required: true,
                message: "请输入商品",
                trigger: "blur",
              }],

              dicMethod:"post",
              dicUrl:'/api/taocao-warehouse/goods/dropDown'
            },
            {
              label: "仓库",
              prop: "warehouseId",
              type:'tree',
              row: true,
              span: 24,
              props: {
                label: 'name',
                value: 'id'
              },
              rules: [{
                required: true,
                message: "请输入仓库",
                trigger: "blur"
              }],
              dicMethod:"post",
              dicUrl:'/api/taocao-warehouse/warehouse/dropDown'
            },
            {
              label: "数量",
              prop: "quantity",
              type: "number",
              precision: 0,
              value: 1,
              row: true,
              span: 24,
              rules: [{
                validator: validateNumber,
                trigger: 'change',
              }]
            },
            {
              label: "类型",
              prop: "type",
              type: "select",
              row: true,
              disabled:true,
              span: 24,

              dicUrl: "/api/blade-system/dict-biz/dictionary?code=put_type",
              props: {
                label: "dictValue",
                value: "dictKey"
              }
            },
            {
              label: "备注",
              prop: "remark",
              type: "textarea",
              span: 24,
            }
          ]
        }
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: false,
          viewBtn: this.vaildData(this.permission.repertory_view, false),
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
        const {updateTime} = params;
        let values = {
          ...params,
        };
        if (updateTime) {
          values = {
            ...params,
            start_time: updateTime[0],
            end_time: updateTime[1],
          };
          values.updateTime = null;
          this.query.updateTime = null;
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
      submit(form,done){
        add(form).then( res => {
          done();
          if(res.data.success){
            this.$refs.form.resetForm();
            this.$message.success(res.data.msg);
            this.dialogVisible = false;
            this.onLoad(this.page, this.query);
          }else {
            this.$message.error(res.data.msg);
          }
        }).catch(() => {
          done();
        })
      },
    }
  };
</script>

<style>
</style>
