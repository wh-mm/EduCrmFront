<template>
  <!--医院接口-->
  <basic-container>
    <div class="block">
      <el-date-picker
        v-model="value1"
        type="datetimerange"
        range-separator="至"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      @change="dateChange">
      </el-date-picker>
    </div>

    <avue-crud :option="option"
               :search.sync="search"
               :data="data"
               :permission="permissionList"
               search="true"
               @search-reset="searchReset"
               @refresh-change="refreshChange"
               @on-load="onLoad">
    </avue-crud>
  </basic-container>
</template>

<script>

  import { getselectOrderListMoneyByTime } from "@/api/statistics/statistics";
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
              prop: "hospital_name",
            },
            {
              label: "收入金额",
              prop: "prices",
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
    //医院开关
    methods: {


      selectionChange(list) {
        this.selectionList = list;
      },
      selectionClear() {
        this.selectionList = [];
       // this.$refs.crud.toggleSelection();
      },
      refreshChange() {
        this.onLoad(this.page, this.query);
      },
      searchSubmit(item){
        this.$message.success(JSON.stringify(item))
      },
      searchChange(params,done) {
        done();
        this.$message.success(JSON.stringify(params));
      },
      onLoad(params = {}) {
        this.loading = true;
        getselectOrderListMoneyByTime( Object.assign(params, this.query)).then(res => {
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
        getselectOrderListMoneyByTime( Object.assign(params)).then(res => {
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


