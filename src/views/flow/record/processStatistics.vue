<template>
  <div>
    <el-card>
      <avue-data-display :option="option"></avue-data-display>
    </el-card>
    <el-card  class="box-card">
      <div id="myChart"></div>
    </el-card>
  </div>
</template>

<script>
  import {statisticsList} from "@/api/flow/record/processStatistics"

  export default {
    name: "process",
    mounted() {
      this.drawLine();
    },
    data() {
      return {
        option: {
          span: 6,
          data: [
            {
              count: 100,
              title: '月请假数',
            },
            {
              count: 3000,
              title: '月报销金额',
            },
            {
              count: 20000,
              title: '月加班小时',
            },
          ]
        },
      }
    },
    methods: {
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById("myChart"));
        statisticsList()
          .then((res=>{
            // 绘制图表
            myChart.setOption({
              title: {
                text: '流程统计'
              },
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                data: ['请假', '加班', '报销']
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              toolbox: {
                feature: {
                  saveAsImage: {}
                }
              },
              xAxis: {
                type: 'category',
                //boundaryGap: false,
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
              },
              yAxis: {
                type: 'value'
              },
              series: [
                {
                  name: '请假',
                  type: 'line',
                  stack: '总量',
                  label: {
                    normal: {
                      show: true,
                      position: 'top'
                    }
                  },
                  smooth: true,
                  data: res.data.leave
                },
                {
                  name: '加班',
                  type: 'line',
                  stack: '总量',
                  label: {
                    normal: {
                      show: true,
                      position: 'top'
                    }
                  },
                  smooth: true,
                  data: res.data.overtime
                },
                {
                  name: '报销',
                  type: 'line',
                  stack: '总量',
                  label: {
                    normal: {
                      show: true,
                      position: 'top'
                    }
                  },
                  smooth: true,
                  data: res.data.expense
                },
              ]
            });
          }))
          .catch(()=>{
            this.$message.error("获取失败!");
        })
      },
    },
  }
</script>

<style scoped>

  .box-card{
    margin-top: 10px;
  }
  #myChart {
    width: 100%;
    height: 400px;
  }
</style>
