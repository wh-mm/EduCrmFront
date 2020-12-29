<template>
  <!--医院接口-->
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
                   v-if="permission.hospital_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
     <template slot="hospitalSwitch" slot-scope="scope">
       <div style="color: green" v-if="scope.row.hospitalSwitch=='true'?true:false">开</div>
       <div style="color: red" v-else>关</div>
      </template>

    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove,
    selectHosptalByHospintl,receiveDecocting} from "@/api/hisHospital/hospital";
  import {mapGetters} from "vuex";
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
          height:'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          cancelBtn:false,
          dialogClickModal: false,
          column: [
            {
              label: "医院名字",
              prop: "hospitalName",
            },
            {
              label: "医院地址",
              prop: "hospitalProfile",
            }
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.hospital_add, false),
          viewBtn: this.vaildData(this.permission.hospital_view, false),
          delBtn: this.vaildData(this.permission.hospital_delete, false),
          editBtn: this.vaildData(this.permission.hospital_edit, false)
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
    //医院开关
    methods: {
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
          data.records.forEach((value)=>{
            value.$cellEdit = true
          })
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      }
    }
  };
</script>
