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
            <el-col :span="6">
                <div class="total">金额总计：<span>￥{{totalPrices}}</span></div>
            </el-col>
            <el-col :span="6">
                <div class="total">订单总计：<span>{{quantity}}</span></div>
            </el-col>
             <el-col :span="12">
                 <div id="statisticsMoney" class="myChart"></div>
             </el-col>
             <el-col :span="12">
                 <div id="statisticsNumber" class="myChart"></div>
             </el-col>
             <el-col :span="24">
                 <div id="statistics" class="myChart" style="height:400px"></div>
             </el-col>
         </el-row>
      </basic-container>
</template>

<script>
var statisticsMoney;
var statisticsNumber;
var statistics;
import { getOrderTotal } from "@/api/statistics/statistics";
export default {
  name: "statistics",
  data() {
    return {
      timeSlot: [],
      totalPrices: 0,
      quantity: 0,
      pricesList: [],
      orderList: [],
      nameList: [],
    };
  },
  mounted() {
    this.getTime();
    this.orderTotal();
  },
  methods: {
    getTime() {
      Date.prototype.Format = function(fmt) {
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
        console.log(res);
        if (res.data.code == 200) {
          this.pricesList = [];
          this.orderList = [];
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
            this.nameList.push(value.hospital_name);
          });
          res.data.data.orderQuantityHospital.forEach(value => {
            let item = {
              name: value.hospital_name,
              value: value.prices,
            };
            this.pricesList.push(item);
          });
          console.log(this.orderList);
          console.log(this.nameList);
          console.log(this.pricesList);
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
      statistics = this.$echarts.init(document.getElementById("statistics"));
      // 医院金额统计
      statisticsMoney.setOption({
        title: { text: "金额统计" },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : ￥{c} ({d}%)",
        },
        series: [
          // 每个系列，也有 type 描述“子类型”，即“图表类型”。
          {
            name: "金额",
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
      });
      // statisticsNumber
      statisticsNumber.setOption({
        title: { text: "订单统计" },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        series: [
          // 每个系列，也有 type 描述“子类型”，即“图表类型”。
          {
            name: "订单",
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
      });
      // 双统计
      statistics.setOption({
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
              color: "#FF6666",
            },
            data: this.orderList,
          },
          {
            name: "订单",
            type: "bar",
            itemStyle: {
              //柱体的颜色
              //右，下，左，上（1，0，0，0）表示从正右开始向左渐变
              color: "#99CC66",
            },
            data: this.orderList,
          },
        ],
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
  height: 300px;
}
</style>
