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

  import { selectOrderStatistics } from "@/api/statistics/statistics";
  import {mapGetters} from "vuex";

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
              required: true,
              props: {
                label: "hospitalName",
                value: "id"
              },
              search: true,
              dicUrl: "/api/taocao-hisHospital/hospital/selectHosptal",
            },
            {
              label: "订单类型",
              prop:"orderType",
              search:true,
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
              label: "处方总数量",
              prop: "number",
            },
            {
              label: "处方总贴数",
              prop: "dose",
            },
            {
              label: "总收入",
              prop: "prices",
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
        selectOrderStatistics((values)).then(res => {
          const data = res.data.data;
          data.forEach((value)=>{
            value.$cellEdit = true
          })
          this.data = data;
          this.loading = false;
          this.selectionClear();
        });
      },
      dateChange(){
        let params = {}
        params.startTime=this.value1[0];
        params.endTime=this.value1[1];
        selectOrderStatistics( Object.assign(params)).then(res => {
          const data = res.data.data;
          console.log(data)
          data.forEach((value)=>{
            value.$cellEdit = true
          })
          this.data = data;
          this.selectionClear();
        });

      }
    }
  };
</script>


