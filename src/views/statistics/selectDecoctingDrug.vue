<template>
  <!--医院接口-->
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
               @refresh-change="refreshChange"
               @on-load="onLoad">
    </avue-crud>
  </basic-container>
</template>
<script>

  import { selectDecoctingDrugPage } from "@/api/statistics/statistics";
  import {mapGetters} from "vuex";
  import {getList} from "@/api/parties/orderparties";
  export default {
    data() {
      return {
        form: {},
        query: {},
        loading: true,
        selectionList: [],
        value1:'',
        option: {
          index: true,
          menu:false,
          excelBtn:true,
          addBtn:false,
          column: [
            {
              label: "医院名字",
              prop: "hospitalId",
              type: "select",
              props: {
                label: "hospitalName",
                value: "id"
              },
              search: true,
              dicUrl: "/api/taocao-hisHospital/hospital/selectHosptal"
            },
            {
              label: "订单类型",
              prop:"orderType",
              //search:true,
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
              label: "处方类型",
              prop: "isDaijian",
              type: "select",
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              search: true,
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=isDaijian",
            },
            {
              label: "药品名称",
              prop: "goodsName",

            },
            {
              label: "药品规格",
              prop: "goods_specification",
            },
            {
              label: "药品单位",
              prop: "unit",
            },
            {
              label: "药品数量",
              prop: "zl",
            },
            {
              label: '金额',
              prop: "zlg",
            },
            {
              label: "订单时间",
              prop: "releaseTimeRange",
              type: "datetime",
              format: "yyyy-MM-dd hh:mm:ss",
              valueFormat: "yyyy-MM-dd hh:mm:ss",
              searchRange: true,
              searchSpan: 12,
              hide: true,
              addDisplay: false,
              editDisplay: false,
              viewDisplay: false,
              search: true,
              rules: [{
                required: true,
                message: "请输入通知时间",
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
          addBtn: this.vaildData(this.permission.hospital_add, false),
        };
      },
    },
    methods: {
      selectionChange(list) {
        this.selectionList = list;
      },
      selectionClear() {
        this.selectionList = [];
      },
      refreshChange() {
        this.onLoad(this.page, this.query);
      },
      searchSubmit(item){
        this.$message.success(JSON.stringify(item))
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

      /*onLoad(page, params = {}) {
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      }*/
      onLoad(page, params = {}) {
        const {releaseTimeRange} = params;
        let values = {
          ...params,
        };
        if (releaseTimeRange) {
          values = {
            ...params,
            startTime: releaseTimeRange[0],
            endTime: releaseTimeRange[1],
          };
          values.releaseTimeRange = null;
          this.query.releaseTimeRange = null;
        }
        this.loading = true;
        //getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
       // selectOrderStatistics((values)).then(res => {
        selectDecoctingDrugPage(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          data.records.forEach((value) => {
            value.$cellEdit = true
          })
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      },
      dateChange(){
        let params = {}
        params.startTime=this.value1[0];
        params.endTime=this.value1[1];
        selectDecoctingDrugPage(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          data.records.forEach((value) => {
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


