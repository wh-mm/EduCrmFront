<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :search.sync="search"
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
                   v-if="permission.goods_delete"
                   @click="handleDelete">删 除
        </el-button>
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.goods_Alldelete"
                   @click="deleteAllGoods">全 部 删 除
        </el-button>
        <el-button type="success"
                   size="small"
                   plain
                   icon="el-icon-upload2"
                   @click="handleImport">导 入
        </el-button>
        <el-button type="warning"
                   size="small"
                   plain
                   icon="el-icon-download"
                   @click="handleExport">导 出
        </el-button>
      </template>

      <template slot="menu" slot-scope="scope">
<el-button  type="text"
            size="small"
            plain
            @click="openDialog(scope.row)"
           >价格与索引码维护</el-button>

      </template>

    </avue-crud>
    <el-dialog title="价格与编码维护"
               append-to-body
               :visible.sync="priceDialog"
               width="555px">
      <avue-form :option="priceOption" v-model="priceForm" @submit="updatePrice">
      </avue-form>
    </el-dialog>


    <el-dialog title="货品数据导入"
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
  import {getList, getGoodsDetail, add, update, remove, selectGoodsName, selectGoodsCode,updatePrice,deleteAllGoods} from "@/api/warehouse/goods";
  import {mapGetters} from "vuex";
  import {getToken} from "@/util/auth";


  export default {
    data() {
      var selectName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("请输入商品名称！"))
        } else {
          selectGoodsName(this.form.id, value).then(res => {
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
      var selectCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("请输入编码！"))
        } else {
          selectGoodsCode(this.form.id, value).then(res => {
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
        search: {},
        Id:'',
        loading: true,
        priceDialog: false,
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
              label: "商品名称",
              prop: "goodsName",
              sortable:true,
              rules: [{
                required: true,
                validator: selectName,
                trigger: 'blur',
              }],
              search: true,
            },
            {
              label: "货品ID",
              prop: "id",
              addDisplay: false,
              sortable:true,
            },
            {
              label: "货物类型",
              prop: "goodsType",
              type: "tree",
              sortable:true,
              rules: [{
                required: true,
                message: "请选择货物类型",
                trigger: "blur"
              }],
              props: {
                label: 'title',
                value: 'id'
              },
              search: true,
              dicUrl: this.ERP_WMS_NAME + "/goods-type/tree"
            },
            {
              label: "索引码",
              prop: "goodsCode",
              sortable:true,
              rules: [{
                validator: selectCode,
                trigger: "blur"
              }]
            },
            {
              label: "规格",
              prop: "goodsSpecification",
              sortable:true,
              rules: [{
                required: true,
                message: "请输入规格",
                trigger: "blur"
              }],
              type: "select",
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              search: true,
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=specifications"
            },
            {
              label: "基本单位",
              prop: "basicUnit",
              sortable:true,
              rules: [{
                required: true,
                message: "请输入基本单位",
                trigger: "blur"
              }],
              /*type: "select",*/
             /* searchSpan: 7,*/
             /* props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              required: true,
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=goods_unit",*/
            },
            {
              label: "货品价格",
              prop: "unitPrice",
              sortable:true,
              rules: [{
                message: "请输入货品价格",
                trigger: "blur"
              }]
            },
            {
              label: "进货价格",
              prop: "salePrice",
              sortable:true,
              rules: [{
                message: "请输入进货价格",
                trigger: "blur"
              }]
            },
            /*{
              label: "货架号",
              prop: "shelfNumber",
              rules: [{
                message: "请输入货品价格",
                trigger: "blur"
              }]
            },*/
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
              action: this.ERP_WMS_NAME + "/goods/import-goods"
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
        priceForm:{},
        priceOption:{
          column: [
            {
              label: "索引码",
              prop: "goodsCode",
              rules: [{

                trigger: "blur"
              }]
            },
            {
              label: "货品价格",
              prop: "unitPrice",
              rules: [{
                message: "请输入货品价格",
                trigger: "blur"
              }]
            },
            {
              label: "进货价格",
              prop: "salePrice",
              rules: [{
                message: "请输入货品价格",
                trigger: "blur"
              }]
            },
          ]
        }
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.goods_add, false),
          viewBtn: this.vaildData(this.permission.goods_view, false),
          delBtn: this.vaildData(this.permission.goods_delete, false),
          editBtn: this.vaildData(this.permission.goods_edit, false)
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
    watch: {
      'excelForm.isCovered'() {
        if (this.excelForm.isCovered !== '') {
          const column = this.findObject(this.excelOption.column, "excelFile");
          column.action = this.ERP_WMS_NAME + `/goods/import-goods?isCovered=${this.excelForm.isCovered}`;
        }
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
      deleteAllGoods() {
        this.$confirm("确定删除所有数据?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return deleteAllGoods();
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
          getGoodsDetail(this.form.id).then(res => {
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
      handleImport() {
        this.excelBox = true;
      },
      uploadAfter(res, done, loading, column) {
        window.console.log(column);
        console.log(res);
        this.excelBox = false;
        this.refreshChange();
        done();
      },
      handleExport() {
        this.$confirm("是否导出货品数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          window.open( this.ERP_WMS_NAME + `/goods/export-goods?${this.website.tokenHeader}=${getToken()}&goodsType=${this.search.goodsType}`);
        });
      },
      handleTemplate() {
        window.open(this.ERP_WMS_NAME + `/goods/export-template?${this.website.tokenHeader}=${getToken()}`);
      },
      openDialog(row){
        this.Id = row.id;
        this.priceDialog=true;
        this.priceForm.unitPrice = row.unitPrice;
        this.priceForm.goodsCode = row.goodsCode;
      },
      updatePrice(row, done){
        updatePrice(this.Id,this.priceForm.goodsCode,this.priceForm.unitPrice,this.priceForm.salePrice).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.priceDialog=false;
          this.refreshChange();
          done();
        });
      }

    }
  };
</script>

<style>
</style>
