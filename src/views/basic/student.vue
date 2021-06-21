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
                   v-if="permission.student_delete"
                   @click="handleDelete">删 除
        </el-button>
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button size="small" type="primary">face</el-button>
<!--          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
        </el-upload>
      </template>
    </avue-crud>
  </basic-container>
</template>



<script>
  import {getList, getDetail, add, update, remove} from "@/api/basic/student";
  import {mapGetters} from "vuex";
  import {isvalidatemobile} from "@/util/validate";
  export default {
    data() {
      const validatePhone = (rule, value, callback) => {
        if (isvalidatemobile(value)[0]) {
          callback(new Error(isvalidatemobile(value)[1]));
        } else {
          callback();
        }
      };
      return {
        form: {

        },
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
              label: "学生姓名",
              prop: "nameStu",
              span: 8,
              maxlength: 10,
              showWordLimit:true,
              rules: [{
                required: true,
                message: "请输入学生姓名",
                trigger: "blur"
              }]
            },
            {
              label: "学生性别",
              prop: "sexStu",
              type: "select",
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=sex",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请输入学生性别",
                trigger: "blur"
              }],
            },
            {
              label: "联系方式",
              prop: "contactStu",
              maxlength: 11,
              showWordLimit:true,
              rules: [{
                required: true,
                validator: validatePhone,
                trigger: "change"
              }]
            },
            {
              label: "学生出生日期",
              prop: "birthStu",
              type: "date",
              format: "yyyy-MM-dd",
              valueFormat: "yyyy-MM-dd",
              rules: [{
                required: true,
                message: "请输入学生出生日期",
                trigger: "blur"
              }]
            },
            {
              label: '学生省份',
              prop: 'provinceStu',
              type: 'select',
              props: {
                label: 'name',
                value: 'code'
              },
              cascaderItem: ['cityStu'],
              dicUrl: `/api/blade-system/region/select`,
              rules: [
                {
                  required: true,
                  message: '请输入学生省份',
                  trigger: 'blur'
                }
              ]
            },
            {
              label: "学生城市",
              prop: "cityStu",
              type: 'select',
              props: {
                label: 'name',
                value: 'code'
              },
              cascaderItem: ['districtStu'],
              dicUrl: `/api/blade-system/region/select?code={{key}}`,
              rules: [{
                required: true,
                message: "请输入学生城市",
                trigger: "blur"
              }]
            },
            {
              label: "学生地区",
              prop: "districtStu",
              type: 'select',
              props: {
                label: 'name',
                value: 'code'
              },
              dicUrl: `/api/blade-system/region/select?code={{key}}`,
              rules: [{
                required: true,
                message: "请输入学生地区",
                trigger: "blur"
              }]
            },
            {
              label: "学生详细地址",
              prop: "detailAddressStu",
              type: 'map',
              params:{
                zoom: 10,
                zoomEnable: true,
                dragEnable: true,
              },
              rules: [{
                required: true,
                message: "请输入学生详细地址",
                trigger: "blur"
              }]
            },
            {
              label: "备注",
              prop: "remarkStu",
              rules: [{
                required: false,
                message: "请输入备注",
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
          addBtn: this.vaildData(this.permission.student_add, false),
          viewBtn: this.vaildData(this.permission.student_view, false),
          delBtn: this.vaildData(this.permission.student_delete, false),
          editBtn: this.vaildData(this.permission.student_edit, false)
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
        row.detailAddressStu = row.detailAddressStu[2];
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
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }
    }

  };
</script>

<style>
</style>
