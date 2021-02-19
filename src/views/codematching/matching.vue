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
                   v-if="permission.matching_delete"
                   @click="handleDelete">删 除
        </el-button>
        <el-button v-if="permission.region_import"
                   type="primary"
                   size="small"
                   @click="handleImport">导 入
          <i class="el-icon-upload el-icon--right"></i>
        </el-button>
      </template>
    </avue-crud>
    <el-dialog title="导入HIS编码"
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
  import {getList, getDetail, add, update, zremove} from "@/api/codematching/matching";
  import {mapGetters} from "vuex";
  import {getToken} from '@/util/auth';

  export default {
    data() {
      return {
        excelBox: false,
        excelForm: {},
        excelOption: {
          submitBtn: false,
          emptyBtn: false,
          column: [
            {
              label: "医院名称",
              prop: "hospitalId",
              type: "tree",

              cascaderItem:['excelFile'],
              props: {
                label: "hospitalName",
                value: "id"
              },
              search: true,
              dicUrl: "/api/taocao-hisHospital/hospital/selectHosptal"
            },
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
              action: "/api/taocao-codematching/matching/import-region ?  hospitalId={{this}}"
            },
            {
              label: "数据覆盖",
              prop: "isCovered",
              type: "switch",
              align: "center",
              width: 80,
              dicData: [
                {
                  label: "否",
                  value: 0
                },
                {
                  label: "是",
                  value: 1
                }
              ],
              value: 0,
              slot: true,
              rules: [
                {
                  required: true,
                  message: "请选择是否覆盖",
                  trigger: "blur"
                }
              ]
            },
            {
              label: '模板下载',
              prop: 'excelTemplate',
              formslot: true,
              span: 24,
            }
          ]
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
            {
              label: "医院名称",
              prop: "hospitalId",
              type: "tree",
              sortable:true,
              searchLabelWidth: 130,
              props: {
                label: "hospitalName",
                value: "id"
              },
              search: true,
              dicUrl: "/api/taocao-hisHospital/hospital/selectHosptal"
            },
            {
              label: "库房药名称",
              prop: "goodsName",
              addDisplay: false,
              editDisplay: false,
              sortable:true,
            },
            {
              label: "库房药名称",
              prop: "goodsId",
              type: "select",
              searchLabelWidth: 130,
              sortable:true,
              hide: true,
              viewDisplay: true,
              props: {
                label: 'goodsName',
                value: 'id'
              },
              filterable: true,
              remote: true,
              search: true,
              dicUrl: '/api/erp-wms/goods/selecListGoodsByTypeYP?name={{key}}'
            },
            {
              label: "HIS药品码",
              prop: "hisDrugsUmber",
              sortable:true,
              searchLabelWidth: 130,
              rules: [{
                required: true,
                message: "HIS药品码",
                trigger: "blur"
              }],
              search: true,
            },
            {
              label: "HIS药品名称",
              prop: "hisDrugsName",
              sortable:true,
              searchLabelWidth: 130,
              rules: [{
                required: true,
                message: "HIS药品名称",
                trigger: "blur"
              }],
              search: true,
            }
          ]
        },
        data: [],
      };
    },
    watch: {
      'form.tenantId'() {
        if (this.form.tenantId !== '' && this.initFlag) {
          this.initData(this.form.tenantId);
        }
      },
      'excelForm.isCovered'() {
        alert(this.excelForm.hospitalId);
        //if ()
      if (this.excelForm.isCovered !== '') {
          const column = this.findObject(this.excelOption.column, "excelFile");
          column.action = `/api/taocao-codematching/matching/import-matching?isCovered=${this.excelForm.isCovered}&hospitalId=${this.excelForm.hospitalId}`;
        }
      }
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.matching_add, false),
          viewBtn: this.vaildData(this.permission.matching_view, false),
          delBtn: this.vaildData(this.permission.matching_delete, false),
          editBtn: this.vaildData(this.permission.matching_edit, false)
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
      //导入
      handleImport() {
        this.excelBox = true;
      },
      uploadAfter(res, done, loading, column) {
        window.console.log(column);
        this.excelBox = false;
        this.initTree();
        done();
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
      handleTemplate() {
          window.open(`/api/taocao-codematching/matching/export-template?${this.website.tokenHeader}=${getToken()}`);
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
            return zremove(this.ids);
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
      }
    }
  };
</script>

<style>
</style>
