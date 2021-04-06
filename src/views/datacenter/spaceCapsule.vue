<template>
  <basic-container>
    <el-row :span="24" :gutter="20">
      <div class="con left">
        <!--数据总概-->
        <div class="con_div">
          <div class="con_div_text left">
            <div class="con_div_text01 left">
              <img src="../../images/info_1.png" class="left text01_img"/>
              <div class="left text01_div">
                <p>颗粒生产线订单总数</p>
                <p>{{separate[1].number}}</p>
              </div>
            </div>
            <div class="con_div_text01 right">
              <img src="../../images/info_2.png" class="left text01_img"/>
              <div class="left text01_div">
                <p>颗粒生产线订单金额</p>
                <p>{{separate[1].money}}</p>
              </div>
            </div>
          </div>
          <div class="con_div_text left">
            <div class="con_div_text01 left">
              <img src="../../images/info_3.png" class="left text01_img"/>
              <div class="left text01_div">
                <p>饮片生产线订单总数</p>
                <p class="sky">{{separate[0].number}}</p>
              </div>
            </div>
            <div class="con_div_text01 right">
              <img src="../../images/info_4.png" class="left text01_img"/>
              <div class="left text01_div">
                <p>饮片生产线订单金额</p>
                <p class="sky">{{separate[0].money}}</p>
              </div>
            </div>
          </div>
          <div class="con_div_text left">

            <div class="con_div_text01 left">
              <img src="../../images/info_5.png" class="left text01_img"/>
              <div class="left text01_div">
                <p>订单总数</p>
                <p class="org">{{znumber}}</p>
              </div>
            </div>
            <div class="con_div_text01 right">
              <img src="../../images/info_6.png" class="left text01_img"/>
              <div class="left text01_div">
                <p>订单总额</p>
                <p class="org">{{zmoney}}</p>
              </div>
            </div>
          </div>
        </div>
        <!--统计分析图-->
        <div class="div_any">
          <div class="left div_any01">
            <div class="div_any_child">
              <div class="div_any_title"><img src="../../images/title_1.png">各医院订单数量</div>
              <p id="pieChart1" class="p_chart"></p>
            </div>
            <div class="div_any_child">
              <div class="div_any_title"><img src="../../images/title_2.png">各医院订单金额</div>
              <p id="histogramChart" class="p_chart"></p>
            </div>
          </div>
          <div class="div_any02 left ">
            <div class="div_any_child div_height">
              <div class="div_any_title any_title_width"><img src="../../images/title_0.png">泰来县地图</div>
              <div id="mapChart" style="width:97.5%;height:95%;display: inline-block;padding-left: 1.25%;padding-top:2.2%"></div>
            </div>
          </div>
          <div class="right div_any01">
            <div class="div_any_child">
              <div class="div_any_title"><img src="../../images/title_3.png">各医院颗粒订单数量</div>
              <p id="lineChart" class="p_chart"></p>
            </div>
            <div class="div_any_child">
              <div class="div_any_title"><img src="../../images/title_4.png">各医院饮片订单数量</div>
              <p id="lineChart2" class="p_chart"></p>
            </div>
          </div>
        </div>

        <div id="el-dialog" class="">
          <div class="xc_layer"></div>
          <div class="popBox" id="printView">
            <div class="ttBox"><span class="tt" id="reportTitle">第一医院</span><img src="../../images/close.png" style="width: 30px;float: right;cursor: pointer;" title="关闭弹窗" class="close"/></div>
            <div class="txtBox" id="el-dialog_body">
              <div style="height:100%;width: 98%;margin-left: 1%;">
                <div class="left div_any01" style="width: 64%;">
                  <div class="div_any_child">
                    <div class="div_any_title"><div type="text" class="demo-input" id="date1" style="display: inline-block;cursor: pointer;margin-right: 16px;"></div><img src="../../images/title_4.png">颗粒</div>
                    <p id="lineChart3" class="p_chart"></p>
                  </div>
                  <div class="div_any_child">
                    <div class="div_any_title"><div type="text" class="demo-input" id="date2" style="display: inline-block;cursor: pointer;margin-right: 16px;"></div><img src="../../images/title_7.png">饮片</div>
                    <p id="lineChart4" class="p_chart"></p>
                  </div>
                </div>
                <div class="left div_any01"  style="width: 32%;">
                  <div class="div_any_child">
                    <div class="div_any_title"><div type="text" class="demo-input" id="date3" style="display: inline-block;cursor: pointer;margin-right: 16px;"></div><img src="../../images/title_18.png">病人年龄段分布</div>
                    <p id="pieChart2" class="p_chart"></p>
                  </div>
                  <div class="div_any_child">
                    <div class="div_any_title"><div type="text" class="demo-input" id="date4" style="display: inline-block;cursor: pointer;margin-right: 16px;"></div><img src="../../images/title_20.png">颗粒饮片比例</div>
                    <p id="pieChart3" class="p_chart"></p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </el-row>
  </basic-container>
</template>
<script>
import {getOrderTotal} from "@/api/datacenter/SpaceCapsule";
var mapChart;
var lineChart3;
var lineChart
var lineChart2

export default {
  name: "spaceCapsule",
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
      separate:[{
        number:'',
        money:''
      },{
        number:'',
        money:''
      }], //
      znumber:'',//订单总数
      zmoney:'',//订单总额
      variousHospitalOrderNumberName:[], //各医院订单数量和名称
      variousHospitalOrderPrice:[], //各医院订单金额
      variousHospitalOrderName:[], //各医院名称（订单）
      variousHospitalKlName:[], //各医院颗粒
      variousHospitalYpName:[], //各医院饮片
      variousHospitalKlNumber:[], //各医院颗粒数量
      variousHospitalYpNumber:[], //各医院饮片数量
    };
  },

  mounted() {
    this.orderTotal();
    this.drawLine();
    this.init2();
    $("#el-dialog").addClass("hide");
    $(".close").click(function (event) {
      $("#el-dialog").addClass("hide");
    });
  },
  methods: {
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
          let dataAll = res.data.data;//数据集合
          this.znumber = dataAll.sum.znumber;
          this.zmoney = dataAll.sum.zmoney;
          if(dataAll.separate[0].order_type == 'jianyao'){
            this.separate = dataAll.separate;
          }else{
            this.separate = dataAll.separate.reverse()
          }
          for(let i = 0; i < dataAll.hospitalgroup.length; i++){
            this.variousHospitalOrderNumberName.push({value:dataAll.hospitalgroup[i].number,name:dataAll.hospitalgroup[i].hospitalName})
            this.variousHospitalOrderPrice.push(dataAll.hospitalgroup[i].money)
            this.variousHospitalOrderName.push(dataAll.hospitalgroup[i].hospitalName)
          }
          console.log('variousHospitalOrderName',this.variousHospitalOrderName)
          console.log('variousHospitalOrderPrice',this.variousHospitalOrderPrice)
          for(let j = 0; j < dataAll.TypeGroup.length; j++){
            if(dataAll.TypeGroup[j].orderType == 'jianyao'){
              this.variousHospitalYpName.push(dataAll.TypeGroup[j].hospitalName)
              this.variousHospitalYpNumber.push(dataAll.TypeGroup[j].number)
            }else{
              this.variousHospitalKlName.push(dataAll.TypeGroup[j].hospitalName)
              this.variousHospitalKlNumber.push(dataAll.TypeGroup[j].number)
            }
          }
          this.drawLine();
        } else {
          this.$message({
            type: "error",
            message: res.data.msg,
          });
        }
      });
    },
    drawLine(){
      //地图
      var mapChart = echarts.init(document.getElementById('mapChart'));
      mapChart.setOption({
        bmap: {
          center: [118.096435, 24.485408],
          zoom: 12,
          roam: true,

        },
        tooltip: {
          trigger: 'item',
          formatter: function (params, ticket, callback) {
            return params.value[2]
          }
        },
        series: [{
          type: 'scatter',
          coordinateSystem: 'bmap',
          data: [
            [118.096435, 24.485408, '厦门市'],
            [118.094564, 24.457358, '厦门第一医院'],
            [118.104103, 24.477761, '厦门中山医院'],
            [118.14748, 24.506295, '厦门中医院'],
            [118.254841, 24.665349, '厦门第五医院'],
          ]
        }]
      });
      mapChart.on('click', function (params) {
        $("#el-dialog").removeClass('hide');
        $("#reportTitle").html(params.value[2]);
      });

      var bmap = mapChart.getModel().getComponent('bmap').getBMap()
      bmap.addControl(new BMap.MapTypeControl({ mapTypes: [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP] }));
      bmap.setMapStyle({ style: 'midnight' })


      var pieChart1 = echarts.init(document.getElementById('pieChart1')); //环形饼图
      pieChart1.setOption({

        color: ["#87cefa", "#ff7f50", "#32cd32", "#da70d6",],

        legend: {
          y: '260',
          x: 'center',
          textStyle: {
            color: '#ffffff',

          },
          data: ['厦门第一医院', '厦门中山医院', '厦门中医院', '厦门第五医院',],
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a}<br/>{b}<br/>{c}G ({d}%)"
        },
        calculable: false,
        series: [
          {
            name: '采集数据量',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '45%'],
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              },
              emphasis: {
                label: {
                  show: true,
                  position: 'center',
                  textStyle: {
                    fontSize: '20',
                    fontWeight: 'bold'
                  }
                }
              }
            },
            data:this.variousHospitalOrderNumberName
            //   [
            //   { value: 335, name: '厦门第一医院' },
            //   { value: 310, name: '厦门中山医院' },
            //   { value: 234, name: '厦门中医院' },
            //   { value: 135, name: '厦门第五医院' }
            //
            // ]
          }
        ]
      });


      var lineChart = echarts.init(document.getElementById('lineChart'));//各医院颗粒订单数量
      lineChart.setOption({

        color: "#ff7f50",
        calculable: false,
        tooltip: {
          trigger: 'item',
          formatter: "{a}<br/>{b}<br/>{c}条"
        },
        yAxis: [
          {
            type: 'value',
            // axisLine: { onZero: false },
            axisLine: {
              lineStyle: {
                color: '#034c6a'
              },
            },

            axisLabel: {
              textStyle: {
                color: '#fff'
              },
              formatter: function (value) {
                return value + "k条"
              },
            },
            splitLine: {
              lineStyle: {
                width: 0,
                type: 'solid'
              }
            }
          }
        ],
        xAxis: [
          {
            type: 'category',
            data: ['医院1','医院2','医院3','医院4','医院5','医院6','医院7','医院8','医院9','医院10','医院11','医院12','医院13','医院14','医院15','医院16'],
            axisLine: {
              lineStyle: {
                color: '#034c6a'
              },
            },
            // splitLine: {
            //   "show": false
            // },
            axisLabel: {
              textStyle: {
                color: '#fff'
              },
              formatter: function (value) {
                return value + ""
              },
            },
            splitLine: {
              lineStyle: {
                width: 0,
                type: 'solid'
              }
            },
          }
        ],
        dataZoom: [{
          startValue: ''
        }, {
          type: 'inside'
        }],
        grid: {
          left: '5%',
          right: '5%',
          bottom: '20%',
          containLabel: true
        },
        series: [
          {
            name: '厦门第一医院',
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                lineStyle: {
                  shadowColor: 'rgba(0,0,0,0.4)'
                }
              }
            },
            data: [15, 0, 20, 45, 22.1, 25,15, 0, 20, 45, 22.1, 25,15, 0, 20, 45, 22.1, 25,].reverse()
          },
        ]
      });

      var histogramChart = echarts.init(document.getElementById('histogramChart'));//各医院订单金额
      histogramChart.setOption({
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          // data: this.variousHospitalOrderName,
          data:["泰来县妇幼保健院", "泰来县中医医院", "泰来县人民医院", "淘草中医药"],
          // axisLine: { onZero: false },
          axisLine: {
            lineStyle: {
              color: '#034c6a'
            },
          },
          axisLabel: {
            textStyle: {
              color: '#fff'
            },
          },
        },
        yAxis: {
          splitLine: {
            show: false
          },
          // axisLine: { onZero: false },
          axisLine: {
            lineStyle: {
              color: '#034c6a'
            },
          },
          axisLabel: {
            textStyle: {
              color: '#fff'
            },
          },
        },

        dataZoom: [{
          startValue: ''
        }, {
          type: 'inside'
        }],
        visualMap: {
          top: 10,
          right: 10,
          show:false,
          color:'#fff',
          pieces: [{
            gt: 100,
            lte: 500,
            color: '#096'
          }, {
            gt: 500,
            lte: 1000,
            color: '#ffde33'
          }, {
            gt: 1000,
            lte: 1500,
            color: '#ff9933'
          }, {
            gt: 1500,
            lte: 2000,
            color: '#cc0033'
          }, {
            gt: 2000,
            lte: 3000,
            color: '#660099'
          }, {
            gt: 3000,
            color: '#7e0023'
          }],
          outOfRange: {
            color: '#fff'
          }
        },
        series: {
          name: '',
          type: 'line',
          data: this.variousHospitalOrderPrice,
        }

      });

      var lineChart2 = echarts.init(document.getElementById('lineChart2'));//各医院饮片订单数量
      lineChart2.setOption({

        color: "#87cefa",
        calculable: false,
        tooltip: {
          trigger: 'item',
          formatter: "{a}<br/>{b}<br/>{c}条"
        },
        yAxis: [
          {
            type: 'value',
            // axisLine: { onZero: false },
            axisLine: {
              lineStyle: {
                color: '#034c6a'
              },
            },

            axisLabel: {
              textStyle: {
                color: '#fff'
              },
              formatter: function (value) {
                return value + "k条"
              },
            },
            splitLine: {
              lineStyle: {
                width: 0,
                type: 'solid'
              }
            }
          }
        ],
        xAxis: [
          {
            type: 'category',
            data: ['医院1','医院2','医院3','医院4','医院5','医院6','医院7','医院8','医院9','医院10','医院11','医院12','医院13','医院14','医院15','医院16'],
            axisLine: {
              lineStyle: {
                color: '#034c6a'
              },
            },
            // splitLine: {
            //   "show": false
            // },
            axisLabel: {
              textStyle: {
                color: '#fff'
              },
              formatter: function (value) {
                return value + ""
              },
            },
            splitLine: {
              lineStyle: {
                width: 0,
                type: 'solid'
              }
            },
          }
        ],
        dataZoom: [{
          startValue: ''
        }, {
          type: 'inside'
        }],
        grid: {
          left: '5%',
          right: '5%',
          bottom: '20%',
          containLabel: true
        },
        series: [
          {
            name: '厦门第一医院',
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                lineStyle: {
                  shadowColor: 'rgba(0,0,0,0.4)'
                }
              }
            },
            data: [15, 0, 20, 45, 22.1, 25,15, 0, 20, 45, 22.1, 25,15, 0, 20, 45, 22.1, 25,].reverse()
          },
        ]
      });

    },
    init2(){
      var lineChart3 = echarts.init(document.getElementById('lineChart3'));
      lineChart3.setOption({

        color: ["#87cefa", "#ff7f50",],
        legend: {
          y: 'top',
          x: 'center',
          textStyle: {
            color: '#ffffff',

          },
          data: ['门诊人次', '住院人次'],
        },
        calculable: false,
        tooltip: {
          trigger: 'item',
          formatter: "{a}<br/>{b}<br/>{c}人"
        },
        dataZoom: {
          show: true,
          realtime: true,
          start: 0,
          end: 18,
          height: 20,
          backgroundColor: '#f8f8f8',
          dataBackgroundColor: '#e4e4e4',
          fillerColor: '#87cefa',
          handleColor: '#87cefa',
        },
        yAxis: [
          {
            type: 'value',
            // axisLine: { onZero: false },
            axisLine: {
              lineStyle: {
                color: '#034c6a'
              },
            },

            axisLabel: {
              textStyle: {
                color: '#fff'
              },
              formatter: function (value) {
                return value + "人"
              },
            },
            splitLine: {
              lineStyle: {
                width: 0,
                type: 'solid'
              }
            }
          }
        ],
        xAxis: [
          {
            type: 'category',
            data: [1,2,3,4,5,6],
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#034c6a'
              },
            },
            // splitLine: {
            //   "show": false
            // },
            axisLabel: {
              textStyle: {
                color: '#fff'
              },
              formatter: function (value) {
                return value + ""
              },
            },
            splitLine: {
              lineStyle: {
                width: 0,
                type: 'solid'
              }
            },
          }
        ],
        grid: {
          left: '5%',
          right: '5%',
          bottom: '20%',
          containLabel: true
        },
        series: [
          {
            name: '门诊费用',
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                lineStyle: {
                  shadowColor: 'rgba(0,0,0,0.4)'
                }
              }
            },
            data: [1150, 180, 2100, 2415, 1212.1, 3125, 1510, 810, 2100, 2415, 1122.1, 3215, 1510, 801, 2001, 2245, 1232.1, 3245, 1520, 830, 2200, 2145, 1223.1, 3225, 150, 80, 200, 245, 122.1, 325]
          },
          {
            name: '住院费用',
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                lineStyle: {
                  shadowColor: 'rgba(0,0,0,0.4)'
                }
              }
            },
            data: [2500, 1000, 3000, 5005, 3200.1, 3005, 2500, 1000, 3000, 5005, 3200.1, 3005, 2500, 1000, 3000, 5005, 3200.1, 3005, 2500, 1000, 3000, 5005, 3200.1, 3005, 2500, 1000, 3000, 5005, 3200.1, 3005, 2500, 1000, 3000, 5005, 3200.1, 3005,]
          },
        ]
      });


      var lineChart4 = echarts.init(document.getElementById('lineChart4'));
      lineChart4.setOption({

        color: ["#87cefa", "#ff7f50",],
        calculable: false,
        tooltip: {
          trigger: 'item',
          formatter: "{a}<br/>{b}<br/>{c}元"
        },
        dataZoom: {
          show: true,
          realtime: true,
          start: 0,
          end: 18,
          height: 20,
          backgroundColor: '#f8f8f8',
          dataBackgroundColor: '#e4e4e4',
          fillerColor: '#87cefa',
          handleColor: '#87cefa',
        },
        yAxis: [
          {
            type: 'value',
            // axisLine: { onZero: false },
            axisLine: {
              lineStyle: {
                color: '#034c6a'
              },
            },

            axisLabel: {
              textStyle: {
                color: '#fff'
              },
              formatter: function (value) {
                return value + "元"
              },
            },
            splitLine: {
              lineStyle: {
                width: 0,
                type: 'solid'
              }
            }
          }
        ],
        xAxis: [
          {
            type: 'category',
            data: [1,2,3,4,5,6],
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#034c6a'
              },
            },
            // splitLine: {
            //   "show": false
            // },
            axisLabel: {
              textStyle: {
                color: '#fff'
              },
              formatter: function (value) {
                return value + ""
              },
            },
            splitLine: {
              lineStyle: {
                width: 0,
                type: 'solid'
              }
            },
          }
        ],
        grid: {
          left: '5%',
          right: '5%',
          bottom: '20%',
          containLabel: true
        },
        series: [
          {
            name: '医疗费用',
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                lineStyle: {
                  shadowColor: 'rgba(0,0,0,0.4)'
                }
              }
            },
            data: [1500, 800, 1200, 2450, 1122.1, 1325, 1150, 180, 1200, 1245, 1122.1, 1325, 150, 180, 1200, 2145, 1212.1, 3215, 1510, 180, 2100, 2415, 122.1, 325, 150, 80, 200, 245, 122.1, 325].reverse()
          },
        ]
      });

      //年龄分布
      var pieChart2 = echarts.init(document.getElementById('pieChart2'));
      pieChart2.setOption({
        color: ["#32cd32", "#ff7f50", "#87cefa", "#FD6C88", "#4b5cc4", "#faff72"],
        tooltip: {
          trigger: 'item',
          formatter: "{a}<br/>{b}<br/>{c}人"
        },
        calculable: true,
        series: [
          {
            name: '发病人数',
            type: 'pie',
            radius: [30, 110],
            center: ['50%', '50%'],
            roseType: 'area',
            x: '50%',



            sort: 'ascending',
            data: [
              { value: 10, name: '婴儿(1-3岁)' },
              { value: 5, name: '少儿(4-10岁)' },
              { value: 15, name: '少年(10-18岁)' },
              { value: 25, name: '青年(18-45岁)' },
              { value: 125, name: '中年(45-60岁)' },
              { value: 175, name: '老年(60岁以上)' },
            ]
          }
        ]
      })

      //医疗费用组成
      var pieChart3 = echarts.init(document.getElementById('pieChart3'));
      pieChart3.setOption({
        color: ["#32cd32", "#ff7f50", "#87cefa", "#FD6C88", "#4b5cc4", "#faff72"],
        tooltip: {
          trigger: 'item',
          formatter: "{a}<br/>{b}<br/>{c}元"
        },
        calculable: true,
        series: [
          {
            name: '发病人数',
            type: 'pie',
            radius: [30, 110],
            center: ['50%', '50%'],
            roseType: 'area',
            x: '50%',



            sort: 'ascending',
            data: [
              { value: 10, name: '诊察费用' },
              { value: 500, name: '检查费用' },
              { value: 150, name: '检验费用' },
              { value: 250, name: '西药费用' },
              { value: 125, name: '中药费用' },
              { value: 1750, name: '手术费用' },
            ]
          }
        ]
      })
    }

  },
};
</script>
<style scoped>
@import  '../../styles/ksh.css';

</style>
