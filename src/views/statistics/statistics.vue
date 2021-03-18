<template>
  <basic-container>
    <el-row :span="24" :gutter="20">
      <el-col :span="12">
        <el-date-picker v-model="timeSlot"
                        type="datetimerange"
                        @change="orderTotal"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['12:00:00']">
        </el-date-picker>
      </el-col>
<!--      <el-col :span="6">
        <el-select v-model="value" filterable placeholder="请选择医院">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>-->
      <el-col :span="6">
        <div class="total">金额总计：<span>￥{{ totalPrices }}</span></div>
      </el-col>
      <el-col :span="6">
        <div class="total">订单总计：<span>{{ quantity }}</span></div>
      </el-col>
      <el-col :span="12">
        <div id="statisticsMoney" class="myChart"></div>
      </el-col>
      <el-col :span="12">
        <div id="statisticsNumber" class="myChart"></div>
      </el-col>
      <el-col :span="12">
        <div id="statisticss" class="myChart"></div>
      </el-col>
      <el-col :span="12">
        <div id="statistics" class="myChart"></div>
      </el-col>
      <!--             <el-col :span="24">
                       <div id="statistics" class="myChart" style="height:400px"></div>
                   </el-col>-->
    </el-row>
  </basic-container>
</template>

<script>
var statisticsMoney;
var statisticsNumber;
var statistics;
var statisticss;
import {getOrderTotal} from "@/api/statistics/statistics";

export default {
  name: "statistics",
  data() {
    return {
      timeSlot: [],
      totalPrices: 0,
      quantity: 0,
      pricesList: [],
      orderList: [],
      legendDataXiaoShou:[],
      selectedXiaoShou:[],
      legendDataJinEr:[],
      selectedJinEr:[],
      //nameList: [],
      orderki: [],
      orderYinP:[],
      legendDataYin:[],
      selectedYin:[],
      legendDataKeLi:[],
      selectedKeLi:[],

    };
  },
  mounted() {
    this.getTime();
    this.orderTotal();
  },
  methods: {
    getTime() {
      Date.prototype.Format = function (fmt) {
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "H+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          S: this.getMilliseconds(), //毫秒
        };
        if (/(y+)/.test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length)
            );
        return fmt;
      };
      let endTime = new Date();
      console.log(endTime.getTime());
      let startTime = new Date(endTime.getTime() - 2592000000);
      this.timeSlot = [
        new Date(startTime).Format("yyyy-MM-dd HH:mm:ss"),
        new Date(endTime).Format("yyyy-MM-dd HH:mm:ss"),
      ];
      console.log(this.timeSlot);
    },
    orderTotal() {
      let params = {
        startTime: this.timeSlot[0],
        endTime: this.timeSlot[1],
      };
      console.log(params);
      getOrderTotal(params).then(res => {
        console.log('res',res);
        if (res.data.code == 200) {
          this.pricesList = [];
          this.orderList = [];
          this.orderki = [];
          this.orderYinP= [];
          this.nameList = [];
          this.hospitalList = [];
          this.totalPrices = res.data.data.orderTotal.totalPrices;
          this.quantity = res.data.data.torderQuantity.Quantity;
          res.data.data.orderQuantityHospital.forEach(value => {
            let item = {
              name: value.hospital_name,
              value: value.count,
            };
            this.orderList.push(item);
            this.legendDataXiaoShou.push(value.hospital_name);
            this.nameList.push(value.hospital_name);
          });
          res.data.data.orderTotalHospital.forEach(value => {
            let item = {
              name: value.hospital_name,
              value: value.prices,
            };
            this.legendDataJinEr.push(value.hospital_name);
            this.pricesList.push(item);
          });
          res.data.data.orderkiLi.forEach(value =>{
            let item = {
              name: value.goodsName,
              value: value.drugNumber,
            }
            this.orderki.push(item);
            this.legendDataKeLi.push(value.goodsName);
            this.nameList.push(value.goodsName);
          });
          res.data.data.orderYinP.forEach(value =>{
            let item ={
              name: value.goodsName,
              value : value.drugNumber,
            }
            this.orderYinP.push(item);
            this.legendDataYin.push(value.goodsName);
            this.nameList.push(value.goodsName);
          });
          console.log(this.orderList);
          console.log(this.nameList);
          console.log(this.orderki);
          console.log(this.orderYinP);
          console.log("集合", this.pricesList);
          this.drawLine();
        } else {
          this.$message({
            type: "error",
            message: res.data.msg,
          });
        }
      });
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      statisticsMoney = this.$echarts.init(
        document.getElementById("statisticsMoney")
      );
      statisticsNumber = this.$echarts.init(
        document.getElementById("statisticsNumber")
      );
      statisticss = this.$echarts.init(
        document.getElementById("statisticss")
      )
      statistics = this.$echarts.init(
        document.getElementById("statistics"));
      // 医院金额统计
      statisticsMoney.setOption({
        title: {text: "销售统计"},
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : ￥{c} ({d}%)",
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: this.legendDataXiaoShou,
          selected: this.selectedXiaoShou,
        },
        series: [
          // 每个系列，也有 type 描述“子类型”，即“图表类型”。
          {
            name: "金额",
            type: "pie",
            // 设置成相对的百分比
            center: ["40%", 160],
            radius: 120,
            data: this.pricesList,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
        color: ['#37A2DA', '#32C5E9', '#67E0E3', '#FFDB5C', '#FF9F7F', '#FB7293', '#E062AE', '#E690D1', '#E7BCF3', '#9D96F5', '#67E0E3', '#96BFFF',]
      });
      // statisticsNumber
      statisticsNumber.setOption({
        title: {text: "处方统计"},
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: this.legendDataJinEr,
          selected: this.selectedJinEr,
        },
        series: [
          // 每个系列，也有 type 描述“子类型”，即“图表类型”。
          {
            name: "数量",
            type: "pie",
            // 设置成相对的百分比
            center: ["40%", 160],
            radius: 120,
            data: this.orderList,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
        color: ['#37A2DA', '#32C5E9', '#67E0E3', '#FFDB5C', '#FF9F7F', '#FB7293', '#E062AE', '#E690D1', '#E7BCF3', '#9D96F5', '#67E0E3', '#96BFFF',]
      });
      // 双统计 订单
      /*      statistics.setOption({
              title: { text: "医院统计" },
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "shadow",
                  label: {
                    show: true,
                  },
                },
              },
              legend: {
                data: ["金额", "订单"],
              },
              xAxis: {
                data: this.nameList,
              },
              yAxis: {},
              dataZoom: [
                {
                  show: true,
                  start: 0,
                  end: 100,
                },
                {
                  type: "inside",
                  start: 0,
                  end: 100,
                },
                {
                  show: true,
                  yAxisIndex: 0,
                  filterMode: "empty",
                  width: 30,
                  height: "80%",
                  showDataShadow: false,
                  left: "0",
                },
              ],
              series: [
              {
                  name: "金额",
                  type: "bar",
                  itemStyle: {
                    //柱体的颜色
                    //右，下，左，上（1，0，0，0）表示从正右开始向左渐变
                    color: "#00C9FF",
                  },
                  data: this.orderList,
                },
                {
                  name: "订单",
                  type: "bar",
                  itemStyle: {
                    //柱体的颜色
                    //右，下，左，上（1，0，0，0）表示从正右开始向左渐变
                    color: "#409EFF",
                  },
                  data: this.orderList,
                },
              ],

            });*/
      statistics.setOption({
        title: {text: "颗粒用量统计"},
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: this.legendDataKeLi,
          selected: this.selectedKeLi
        },
        series: [
          // 每个系列，也有 type 描述“子类型”，即“图表类型”。
          {
            name: "药品",
            type: "pie",
            // 设置成相对的百分比
            center: ["40%", 160],
            radius: 120,
            data: this.orderki,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
        color: ['#37A2DA', '#32C5E9', '#67E0E3', '#FFDB5C', '#FF9F7F', '#FB7293', '#E062AE', '#E690D1', '#E7BCF3', '#9D96F5', '#67E0E3', '#96BFFF',]
      });
      statisticss.setOption({
        title: {text: "饮片用量统计"},
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: this.legendDataYin,
          selected: this.selectedYin
        },
        series: [
          // 每个系列，也有 type 描述“子类型”，即“图表类型”。
          {
            name: "订单",
            type: "pie",
            // 设置成相对的百分比
            center: ["40%", 160],
            radius: 120,
            data: this.orderYinP,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
        color: ['#37A2DA', '#32C5E9', '#67E0E3', '#FFDB5C', '#FF9F7F', '#FB7293', '#E062AE', '#E690D1', '#E7BCF3', '#9D96F5', '#67E0E3', '#96BFFF',]
      });
    },
  },
};
</script>

<style scoped>
.total {
  height: 40px;
  line-height: 40px;
  font-weight: bold;
}

.total span {
  color: #ff0000;
}

.myChart {
  width: 100%;
  height: 375px;
}
</style>
