<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               :row-style="rowStyle"
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
                   v-if="permission.orderparties_delete"
                   @click="handleDelete">删 除
        </el-button>
        <el-button type="warning"
                   size="small"
                   plain
                   icon="el-icon-download"
                   v-if="permission.orderparties_export"
                   @click="handleExport">导出
        </el-button>
        <el-button type="success"
                   size="small"
                   plain
                   icon="el-icon-upload2"
                   @click="handleImport">导 入
        </el-button>
      </template>
    </avue-crud>
    <el-dialog title="协定方导入"
               append-to-body
               :visible.sync="excelBox"
               width="555px">
      <avue-form :option="excelOption" v-model="excelForm" :upload-after="uploadAfter">
        <template slot="excelTemplate">
          <el-button type="primary" @click="handleTemplate">
            点击下载<i class="el-icon-download el-icon--right"></i>
          </el-button>
        </template>
      </avue-form>
    </el-dialog>
  </basic-container>
</template>

<script>
import {getList, getDetail, add, update, remove} from "@/api/parties/orderparties";
import {zremove} from "@/api/parties/orderpartiesdrug";
import {mapGetters} from "vuex";
import {getToken} from "@/util/auth";

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
        dialogClickModal: false,
        column: [
        /*  {
            label: "医院名称",
            prop: "hospitalName",
            sortable:true,
            type: "select",
            labelWidth: 130,
            searchLabelWidth: 130,
            rules: [{
              required: true,
              message: "请选择医院名称",
              trigger: "blur"
            }],
            props: {
              label: "hospitalName",
              value: "id"
            },
            search: true,
            dicUrl: '/api/taocao-hisHospital/hospital/selectHosptal'
          },*/
          {
            label: "协定方名称",
            sortable:true,
            prop: "partiesName",
            labelWidth: 130,
            searchLabelWidth: 130,
            rules: [{
              required: true,
              message: "请输入协定方名称",
              trigger: "blur"
            }],
            search: true,
          },
          {
            label: "协定方类型",
            sortable:true,
            prop: "partiesCategory",
            type: 'tree',
            labelWidth: 130,
            searchLabelWidth: 130,
            rules: [{
              required: true,
              message: "请选择协定方类型",
              trigger: "blur"
            }],
            props: {
              label: 'title',
              value: 'id'
            },
            search: true,
            dicUrl: "/api/parties/orderpartiescategory/tree",
          },
          {
            label: "功能/治疗原则",
            sortable:true,
            prop: "therapeuticPrinciples",
            labelWidth: 130,
            searchLabelWidth: 130,
            rules: [{
              required: true,
              message: "请输入功能/治疗原则",
              trigger: "blur"
            }],
            search: true,
          },
          {
            label: "主治",
            prop: "indications",
            sortable:true,
            labelWidth: 130,
            searchLabelWidth: 130,
            rules: [{
              required: true,
              message: "请输入主治",
              trigger: "blur"
            }],
            search: true,
          },
          {
            label: "疗程",
            prop: "courseOfTreatment",
            sortable:true,
            labelWidth: 130,
            rules: [{
              required: true,
              message: "请输入疗程",
              trigger: "blur"
            }]
          },
          {
            label: "服法",
            prop: "dosage",
            sortable:true,
            labelWidth: 130,
            rules: [{
              required: true,
              message: "请输入服法",
              trigger: "blur"
            }]
          },
          {
            label: "备注",
            prop: "remarks",
            sortable:true,
            labelWidth: 130,
            rules: [{
              message: "请输入备注",
              trigger: "blur"
            }]
          },
          {
            label: '药品组成',
            prop: 'orderPartiesDrugs',
            type: 'dynamic',
            span: 24,
            children: {
              align: 'center',
              headerAlign: 'center',
              rowAdd: (done) => {
                // this.$message.success('新增');
                done({
                  input: '默认值'
                });
              },
              rowDel: (row, done) => {
                if (row.id==""||row.id==null){
                  this.$message({
                    type: "success",
                    message: "操作成功!"
                  });
                }else{
                  zremove(row.id);
                  this.$message({
                    type: "success",
                    message: "操作成功!"
                  });
                }
                done();
              },
              column: [
                {
                  label: "药品id",
                  prop: "id",
                  hide:true,
                },
                {
                  label: "*药品",
                  prop: "drugName",
                  sortable:true,
                  type: 'select',
                  filterable: true,
                  display:false,
                  rules: [{
                    require: true,
                    message: '请选择药品',
                  }],
                  props: {
                    label: 'goodsName',
                    value: 'id'
                  },
                  remote: true,
                  dicUrl: '/api/erp-wms/goods/selectListGoodsByName?name={{key}}'
                },
                {
                  label: "数量(克/g)",
                  prop: "drugSpecs",
                  sortable:true,
                  rules: [{
                    required: true,
                    message: "请输入数量规格",
                    trigger: "blur"
                  }]
                },
              ]
            }
          },
        ]
      },
      data: [],
      excelBox: false,
      excelForm: {},
      excelOption: {
        submitBtn: false,
        emptyBtn: false,
        column: [
          {
            label: '模板上传',
            prop: 'excelFile',
            type: 'upload',
            drag: true,
            loadText: '模板上传中，请稍等',
            span: 24,
            propsHttp: {
              res: 'data'
            },
            tip: '请上传 .xls,.xlsx 标准格式文件',
            action: "api/parties/orderparties/import-OrderParties"
          },
          {
            label: '模板下载',
            prop: 'excelTemplate',
            formslot: true,
            span: 24,
          }
        ]
      },
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.orderparties_add, false),
        viewBtn: this.vaildData(this.permission.orderparties_view, false),
        delBtn: this.vaildData(this.permission.orderparties_delete, false),
        editBtn: this.vaildData(this.permission.orderparties_edit, false),
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
    //导出
    handleExport() {
      if (this.selectionList.length === 0) {
        return this.$message.error("请选择需要的商品");
      }
      this.dialogVisible = true;
      this.$confirm("是否导出协定方信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        console.log(this.selectionList)
        alert(this.selectionList.length)
        // eslint-disable-next-line no-unused-vars
        let sendids = "";
        for (let i = 0; i < this.selectionList.length; i++) {
            sendids += this.selectionList[i].id +","
        }
      //  window.open(`/api/parties/orderparties/export-orderParties?${this.website.tokenHeader}=${getToken()}'8&ids=`+sendids);
    //    window.open(`/api/parties/orderparties/export-orderParties?ids=`+sendids);

        window.open(`/api/parties/orderparties/export-orderParties?${this.website.tokenHeader}=${getToken()}&ids=`+sendids);
      });
    },
    uploadAfter(res, done, loading, column) {
      window.console.log(column);
      console.log(res);
      this.excelBox = false;
      this.excelForm = {};
      this.refreshChange();
      done();
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

    handleTemplate() {
      window.open(this.ERP_WMS_NAME + `/goods/export-template?${this.website.tokenHeader}=${getToken()}`);
    },
    handleImport() {
      this.excelBox = true;
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
    }
  }
};
</script>

<style>
</style>
