<template>
  <basic-container>
    <el-row :span="24" :gutter="20" style="margin-left: 0px;">
      <el-col :span="6">
        <avue-input size="small" v-model="specificationName" ></avue-input>
      </el-col>
      <el-col :span="6">
        <el-button size="small" type="primary" @click="addSpecification()">新增规格</el-button>
      </el-col>
    </el-row>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
               @row-del="rowDel"
               @on-load="onLoad">
      <template slot-scope="scope" slot="value">
        <el-button icon="el-icon-delete"
                   size="small" plain
                   v-for="item in scope.row.value" :key="index" @click="rowDel(item.id)">{{item.name}}</el-button>
        <el-row :span="24" :gutter="20" style="margin-top:5px;">
          <el-col :span="6">
            <avue-input size="small" v-model="scope.row.specificationChildrenName" ></avue-input>
          </el-col>
          <el-col :span="6">
            <el-button size="small" type="primary" @click="addChildrenSpecification(scope.row.id,scope.row.specificationChildrenName)">新增规格值</el-button>
          </el-col>
        </el-row>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import { getList, add, remove,update } from "@/api/base/specification";
  export default {
    name: "specification",
    data() {
      return {
        data: [],
        form:{
          id:'',
          name:'',
          parentId:0
        },
        query: {},
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        loading:false,
        specificationName: '',
        specificationChildrenName: '',
        option: {
          height: 'auto',
          calcHeight: 30,
          tip: false,
          page: true,
          border: true,
          addBtn: false,
          columnBtn: false,
          refreshBtn: false,
          menuAlign: 'center',
          column: [
            {
              label: '规格名',
              prop: 'name',
              width: 150,
              renderHeader: (h, { column, $index }) => {
                return h('div',[<i class="el-icon-edit"></i>,column.label])
              },
            },
            {
              label: '规格值',
              prop: 'value',
              slot: true,
              editDisplay: false,
            }
          ]
        }
      }
    },
    methods: {
      addSpecification() {
        this.form.name = this.specificationName;
        this.form.parentId = 0;
        add(this.form).then(res => {
          this.$message({
            type: "success",
            message: "操作成功!"
          })
          this.form.name = '';
          this.specificationName ='';
          this.refreshChange();
        }).catch( res => {
          this.$message({
            type: "error",
            message: res.data.msg
          })
        })
      },
      addChildrenSpecification(parentId,name) {
        this.form.name = name;
        this.form.parentId = parentId;
        add(this.form).then(res => {
            this.$message({
              type: "success",
              message: "操作成功!"
            })
            this.form.name = '';
            this.specificationChildrenName ='';
            this.form.parentId = 0;
            this.refreshChange();
        }).catch( res => {
          this.$message({
            type: "error",
            message: res.data.msg
          })
        })
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
      rowDel(id) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
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
        });
      },
    }
  }
</script>

<style scoped>

</style>
