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
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.repertoryexpirytime_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList} from "@/api/warehouse/repertoryexpirytime";
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
          addBtn: false,
          viewBtn: false,
          delBtn: false,
          editBtn: false,
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
              dicUrl:this.ERP_WMS_NAME + '/warehouse/tree'
            },
            {
              label: "储位",
              prop: "storageId",
              type:'tree',
              props: {
                label: 'name',
                value: 'id'
              },
              search:true,
              dicUrl:this.ERP_WMS_NAME + '/storage/dropDown'
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
              dicUrl: 'api/erp-wms/goods/selecListGoods',
            },
            {
              label: "数量",
              prop: "goodsQuantity",
            },
            {
              label: "到期时间",
              prop: "expiryTime",
            },
            {
              label: "通知消息时间",
              prop: "messageTime",
            },
            {
              label: "通知消息状态",
              prop: "messageStatus",
              type:'select',
              dicUrl: "/api/blade-system/dict/dictionary?code=repertory_expiry_time_message_status",
              props: {
                label: "dictValue",
                value: "dictKey"
              }
            },
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
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
