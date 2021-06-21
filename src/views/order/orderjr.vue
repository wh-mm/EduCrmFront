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

      <template slot-scope="scope" slot="menuLeft">
<!--        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" plain @click="newAddYin()">新增饮片</el-button>
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" plain @click="newAddKe()">新增颗粒</el-button>-->
        <!-- <el-button type="primary" size="small" icon="el-icon-upload" plain @click="sendHttp()">推 送
         </el-button> -->
      </template>

      <template slot-scope="scope" slot="menu">
        <el-button type="text" icon="el-icon-view" size="small" @click.stop="lockInfo(scope.row)">查 看</el-button>

        <el-button type="text" icon="el-icon-view" size="small" v-if="scope.row.orderStatic==1"
                   @click="openDialog(scope.row.id)">审 方
        </el-button>
        <!--处方中心打印功能-->
<!--        <el-button :type="scope.type" :size="scope.size" icon="el-icon-printer"
                   v-if="scope.row.orderStatic==1"
                   @click.stop="updateOrderStatic(scope.row)">接 单
        </el-button>-->
        <!-- <el-button type="text" icon="el-icon-check" size="small" @click.stop="prescription()">抓 药</el-button>-->
        <!--        <el-button type="text" @click="dialogFormVisible = true">查看打印格式</el-button>-->
        <el-button :type="scope.type" :size="scope.size" icon="el-icon-printer"
                   v-if="scope.row.orderStatic==2"
                   @click="dayin(scope.row)">打 印 调 配 单
        </el-button>
        <el-button :type="scope.type" :size="scope.size" icon="el-icon-printer"
                   v-if="scope.row.orderStatic!=1 &&scope.row.orderStatic!=2"
                   @click="dayin(scope.row)">补 打
        </el-button>
      </template>

      <template slot="orderDifferentiation" slot-scope="scope">
        <div style="color:#f391a9" v-if="scope.row.orderDifferentiation =='1'?true:false">手动下单</div>
        <div style="color: #009ad6" v-else>医院下单</div>
      </template>

      <template slot="orderType" slot-scope="scope">
        <div style="color: #1d1626" v-if="scope.row.orderType =='tiaopei'?true:false">颗粒</div>
        <div style="color: #ef5b9c" v-else>饮片</div>
      </template>

    </avue-crud>

    <el-dialog
      title="审批"
      :visible.sync="dialogUpadate"
      width="30%"
      :modal="false"
      :before-close="handleClose">
      <avue-form ref="form" v-model="obj0" :option="option0">

      </avue-form>
      <span slot="footer" class="dialog-footer">

        <el-button type="primary" @click="updateOrderStaticBh(6)">驳 回</el-button>
        <el-button type="primary" @click="updateOrderStatic(2)">同 意</el-button>
         </span>
    </el-dialog>

    <!-- 新增饮片 -->
    <el-dialog title="新增饮片" :visible.sync="addYinDialogVisible" v-if="addYinDialogVisible"
               width="90%" :modal="false" :close-on-click-modal="false">
      <addYinPian @reject="rejectYin"></addYinPian>
    </el-dialog>

    <el-dialog title="新增颗粒" :visible.sync="addKeDialogVisible" v-if="addKeDialogVisible"
               width="90%" :modal="false" :close-on-click-modal="false">
      <addKeLi @reject="rejectKe"></addKeLi>
    </el-dialog>

    <el-dialog title="订单饮片详情" :visible.sync="viewYinDialogVisible" v-if="viewYinDialogVisible"
               width="90%" :modal="false" :close-on-click-modal="false">
      <viewYinPian :orderInfo="orderInfo"></viewYinPian>
    </el-dialog>
    <el-dialog title="订单颗粒详情" :visible.sync="viewKeDialogVisible" v-if="viewKeDialogVisible"
               width="90%" :modal="false" :close-on-click-modal="false">
      <viewKeLi :orderInfo="orderInfo"></viewKeLi>
    </el-dialog>

    <el-form :model="form">
      <div style="display: none" id="printyinpian" ref="printyinpian">
        <!-- 隐藏打印区域，避免用户看到 -->
        <div style="padding: 1px;height: 100px;">
          <div class="yinpianhead" style="width: 100%">
            <el-row>
              <el-col :span="5" :offset="9">
                <div class="grid-content bg-purple">
                  <h1 margin="auto" style="text-align: center;margin-top: 10px;font-size: 50px">调配单</h1></div>
              </el-col>

              <el-col :span="5" :offset="1">
                <div class="grid-content bg-purple-light">
                  <svg id="bigcode" style="padding: 1px;"></svg>
                </div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="10" :offset="3">
                <div class="grid-content bg-purple"><p style="font-size: 15px">
                  接方时间：<span>{{ printJianYaoData.createTime }}</span>
                </p></div>
              </el-col>
              <el-col :span="8" :offset="3">
                <div class="grid-content bg-purple-light"><p style="font-size: 15px">
                  打印时间：<span>{{ time }}</span></p></div>
              </el-col>
            </el-row>
          </div>

          <hr align="center" width="100%" size="1px" length="10" color="black"/>

          <div class="yinpianshou" style="width: 100%">

            <el-row :gutter="5" style="">
              <el-col :span="6" :offset="1">
                <div class="grid-content bg-purple" style="margin-bottom: 0px"><p style="font-size: 15px;margin: 0px;">
                  医院名称：<span>{{ printJianYaoData.hospitalName }}</span></p></div>
              </el-col>
              <el-col :span="6" :offset="1">
                <div class="grid-content bg-purple" style="margin-bottom: 0px"><p style="font-size: 15px;margin: 0px;">
                  姓名：<span>{{ printJianYaoData.name }}</span></p></div>
              </el-col>
              <el-col :span="4" :offset="1">
                <div class="grid-content bg-purple" style="margin-bottom: 0px"><p style="font-size: 15px;margin: 0px;">
                  性别：<span>{{ printJianYaoData.sex == 1 ? '男' : '女' }}</span></p></div>
              </el-col>
              <el-col :span="4" :offset="1">
                <div class="grid-content bg-purple" style="margin-bottom: 0px"><p style="font-size: 15px;margin: 0px;">
                  年龄：<span>{{ printJianYaoData.age }}</span></p></div>
              </el-col>
            </el-row>

            <el-row :gutter="5" style="margin-top:-200px;margin-bottom:-200px">
              <el-col :span="6" :offset="1">
                <div class="grid-content bg-purple"><p style="font-size: 15px;margin: 0px;">
                  处方号：<span>{{ printJianYaoData.delnum }}</span>
                </p></div>
              </el-col>
              <el-col :span="6" :offset="1">
                <div class="grid-content bg-purple"><p style="font-size: 15px;margin: 0px;">
                  包装量：<span>{{ printJianYaoData.packagenum }}</span>
                </p></div>
              </el-col>
              <el-col :span="4" :offset="1">
                <div class="grid-content bg-purple"><p style="font-size: 15px;margin: 0px;">
                  剂数/贴数：<span>{{ printJianYaoData.dose }}</span>
                </p></div>
              </el-col>
              <!--<el-col :span="4" :offset="1">
                <div class="grid-content bg-purple"><p style="font-size: 15px;margin: 0px;">次数：<span>{{printJianYaoData.takenum}}</span>
                </p></div>
              </el-col>-->
            </el-row>

            <el-row :gutter="5" style="margin-top:-15px;margin-bottom:-15px">
              <el-col :span="6" :offset="1">
                <div class="grid-content bg-purple"><p style="font-size: 15px;margin: 0px;">
                  浸泡加水量：<span>{{ printJianYaoData.soakwater }}</span>
                </p></div>
              </el-col>
              <el-col :span="6" :offset="1">
                <div class="grid-content bg-purple"><p style="font-size: 15px;margin: 0px;">
                  煎药方案：<span>{{ printJianYaoData.decscheme }}</span>
                </p></div>
              </el-col>
              <el-col :span="4" :offset="1">
                <div class="grid-content bg-purple"><p style="font-size: 15px;margin: 0px;">
                  服用方式：<span>{{ printJianYaoData.takemethod }}</span>
                </p></div>
              </el-col>
              <el-col :span="4" :offset="1">
                <div class="grid-content bg-purple"><p style="font-size: 15px;margin: 0px;">快递类型：<span>厂内配送</span></p>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="yinpianfooter" style="width: 100%">
            <el-table
              :data="printJianYaoDrugData"
              :row-style="{height: '0'}"
              :cell-style="{padding: '0'}"
              style="border-color: #000000;border-top: 1px solid;font-size: 30px">
              <el-table-column
                label="序号"
                type="index"
                width="90"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="shelf_number"
                label="货位号"
                width="80"
                align="center"
              >
              </el-table-column>

              <el-table-column
                prop="drug_name"
                label="药品名称"
                width="168"
                align="center"
              >
              </el-table-column>

              <el-table-column
                prop="drug_description"
                label="脚注"
                width="168"
                align="center"
              >
              </el-table-column>

              <el-table-column
                prop="description"
                label="说明"
                width="165"
                align="center"
              >
              </el-table-column>

              <el-table-column
                label="单剂量"
                width="165"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.drug_allnum / 1 | rounding }}</span>
                </template>
              </el-table-column>

              <el-table-column
                label="总剂量"
                width="166"
                align="center">
                <template slot-scope="scope">
                  {{ scope.row.tienum * scope.row.drug_allnum }}

                </template>
              </el-table-column>

            </el-table>

            <hr align="center" width="100%" size="1px" length="10" color="black"/>

            <el-col :span="3" :offset="1">
              <div class="grid-content bg-purple"><p style="font-size: 15px">接方员：<span></span></p></div>
            </el-col>
            <el-col :span="2" :offset="2">
              <div class="grid-content bg-purple-light"><p style="font-size: 15px">调配员：<span></span></p></div>
            </el-col>
            <el-col :span="2" :offset="3">
              <div class="grid-content bg-purple-light"><p style="font-size: 15px">浸泡员：<span></span></p></div>
            </el-col>
            <el-col :span="2" :offset="3">
              <div class="grid-content bg-purple-light"><p style="font-size: 15px">煎煮员：<span></span></p></div>
            </el-col>
            <el-col :span="2" :offset="3">
              <div class="grid-content bg-purple-light"><p style="font-size: 15px">包装员：<span></span></p></div>
            </el-col>

          </div>


        </div>
      </div>

    </el-form>

    <el-form :model="form">
      <div style="display: none" id="printkeli" ref="printkeli">
        <!-- 隐藏打印区域，避免用户看到 -->
        <div style="padding: 1px;height: 100px;width: 100%">
          <div class="kelihead" style="width: 100%">
            <el-row>
              <el-col :span="5" :offset="9">
                <div class="grid-content bg-purple">
                  <h1 margin="auto" style="text-align: center;margin-top: 10px;font-size: 50px">调配单</h1></div>
              </el-col>
              <el-col :span="5" :offset="1">
                <div class="grid-content bg-purple-light">
                  <svg id="bigcode2" style="padding: 1px;"></svg>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10" :offset="3">
                <div class="grid-content bg-purple"><p style="font-size: 15px">
                  接方时间：<span>{{ printData.createTime }}</span></p></div>
              </el-col>
              <el-col :span="8" :offset="3">
                <div class="grid-content bg-purple-light"><p style="font-size: 15px">
                  打印时间：<span>{{ time }}</span></p></div>
              </el-col>
            </el-row>
          </div>

          <hr align="center" width="100%" size="1px" length="10" color="black"/>

          <div class="kelishou" style="width: 100%">

            <el-row :gutter="5" style="">
              <el-col :span="6" :offset="1">
                <div class="grid-content bg-purple" style="margin-bottom: 0px"><p style="font-size: 15px;margin: 0px;">
                  医院名称：<span>{{ printData.hospitalName }}</span></p></div>
              </el-col>
              <el-col :span="6" :offset="1">
                <div class="grid-content bg-purple" style="margin-bottom: 0px"><p style="font-size: 15px;margin: 0px;">
                  姓名：<span>{{ printData.name }}</span></p></div>
              </el-col>
              <el-col :span="4" :offset="1">
                <div class="grid-content bg-purple" style="margin-bottom: 0px"><p style="font-size: 15px;margin: 0px;">
                  性别：<span>{{ printData.sex == 1 ? '男' : '女' }}</span></p></div>
              </el-col>
              <el-col :span="4" :offset="1">
                <div class="grid-content bg-purple" style="margin-bottom: 0px"><p style="font-size: 15px;margin: 0px;">
                  年龄：<span>{{ printData.age }}</span></p></div>
              </el-col>
            </el-row>
            <el-row :gutter="5" style="margin-top: 0;margin-bottom:0">
              <el-col :span="6" :offset="1">
                <div class="grid-content bg-purple"><p style="font-size: 15px;margin: 0px;">
                  处方号：<span>{{ printData.presId }}</span>
                </p></div>
              </el-col>
              <el-col :span="6" :offset="1">
                <div class="grid-content bg-purple"><p style="font-size: 15px;margin: 0px;">
                  处方名称：<span>{{ printData.presName }}</span>
                </p></div>
              </el-col>
              <el-col :span="4" :offset="1">
                <div class="grid-content bg-purple"><p style="font-size: 15px;margin: 0px;">
                  处方付数：<span>{{ printData.quantity == 1 ? '贴数' : '剂数' }}</span>
                </p></div>
              </el-col>
              <el-col :span="4" :offset="1">
                <div class="grid-content bg-purple"><p style="font-size: 15px;margin: 0px;">
                  分服次数：<span>{{ printData.separateFrequency }}</span>
                </p></div>
              </el-col>
            </el-row>
            <el-row :gutter="5" style="margin-top: 0;margin-bottom:0">
              <el-col :span="6" :offset="1">
                <div class="grid-content bg-purple"><p style="font-size: 15px;margin: 0px;">快递类型：<span>厂内配送</span></p>
                </div>
              </el-col>
            </el-row>
          </div>

          <div class="kelifooter" style="width: 100%">

            <el-table
              :data="printDrugData"
              :row-style="{height: '1'}"
              :cell-style="{padding: '0'}"
              style="border-color: #000000;border-top: 1px solid">
              <el-table-column
                label="序号"
                type="index"
                width="122"
                align="center"
              >
              </el-table-column>

              <el-table-column
                prop="shelf_number"
                label="货位号"
                width="125"
                align="center"
              >
              </el-table-column>

              <el-table-column
                prop="drug_name"
                label="药品名称"
                width="250"
                align="center"
              >
              </el-table-column>

              <el-table-column
                prop="dose_herb"
                label="饮片剂量"
                width="250"
                align="center"
              >
              </el-table-column>

              <el-table-column
                prop="equivalent"
                label="当量"
                width="247"
                align="center">
              </el-table-column>
            </el-table>

            <hr align="center" width="100%" size="1px" length="10" color="black"/>

            <el-col :span="3" :offset="1">
              <div class="grid-content bg-purple"><p style="font-size: 15px">接方员：<span></span></p></div>
            </el-col>
            <el-col :span="2" :offset="2">
              <div class="grid-content bg-purple-light"><p style="font-size: 15px">调配员：<span></span></p></div>
            </el-col>
            <el-col :span="2" :offset="3">
              <div class="grid-content bg-purple-light"><p style="font-size: 15px">浸泡员：<span></span></p></div>
            </el-col>
            <el-col :span="2" :offset="3">
              <div class="grid-content bg-purple-light"><p style="font-size: 15px">煎煮员：<span></span></p></div>
            </el-col>
            <el-col :span="2" :offset="3">
              <div class="grid-content bg-purple-light"><p style="font-size: 15px">包装员：<span></span></p></div>
            </el-col>
          </div>


        </div>
      </div>
    </el-form>

  </basic-container>
</template>

<script>
import {
  getInfo,
  getListjr,
  selectByOrderId,
  updateOrderStatic, updateOrderStaticBh
} from "@/api/order/order";
import {mapGetters} from "vuex";
import JsBarcode from 'jsbarcode';

import addYinPian from "./add/addYinPian";
import addKeLi from "./add/addKeLi";
import viewYinPian from "./view/viewYinPian";
import viewKeLi from "./view/viewKeLi";

import {shenfang} from "@/api/prescription/review";
export default {
  components: {
    addYinPian,
    addKeLi,
    viewYinPian,
    viewKeLi
  },
  filters: {
    rounding(value) {
      return value.toFixed(2)
    },
    formatDate: function (value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? ('0' + MM) : MM;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      let m = date.getMinutes();
      m = m < 10 ? ('0' + m) : m;
      let s = date.getSeconds();
      s = s < 10 ? ('0' + s) : s;
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
    }
  },
  data() {
    return {
      id:'',
      addYinDialogVisible: false,
      addKeDialogVisible: false,
      viewKeDialogVisible: false,
      viewYinDialogVisible: false,
      dialogFormVisible: false,
      dialogUpadate:false,
      time: '',
      printJianYaoData: [
        {
          /** 煎药**/
          hospitalName: '', //医院名称
          name: '', //患者名称
          sex: '', //性别
          age: '', //年龄
          packagenum: '', //包装量
          takenum: '',//次数
          soakwater: '',//加水量
          delnum: '', //处方号
          takemethod: '',//服用方式
          decscheme: '',//煎药方案
          dtbtype: '',//快递类型
          dose: '',//贴数/处方付数(别名:贴数,剂数;必须填写)
          createTime: '',//创建时间
          doctor: '',//医生姓名
        }
      ],
      printJianYaoDrugData: [
        {
          /** 煎药**/
          drug_name: '',   //药品名称
          // drug_allnum:'', //单剂量
          drug_description: '',//药品脚注
          drugweight: '',//药品总量
          description: '',//药品说明
          shelf_number: '',//货位号

        }
      ],
      printData: [
        {
          hospitalName: '', //医院名称
          name: '', //患者名称
          sex: '', //性别
          age: '', //年龄
          packagenum: '', //包装量
          drugAllnum: '',
          soakwater: '',//加水量
          delnum: '', //处方号
          takemethod: '',//服用方式
          decscheme: '',//煎药方案
          dtbtype: '',//快递类型
          dose: '',//贴数/处方付数(别名:贴数,剂数;必须填写)
          createTime: '',//创建时间
          doctor: '',//医生姓名

          doctorName: '',//医生姓名
          presName: '',//处方名称
          quantity: '',//处方付数
          separateFrequency: '',//分服次数
          presId: '',//处方号
        }
      ],
      printDrugData: [
        {
          drug_name: '',   //药品名称
          drug_allnum: '', //单剂量
          drug_description: '',//药品脚注
          drugweight: '',//药品总量
          description: '',//药品说明
          shelf_number: '',//货位号
          dose_herb: '',//剂量
          equivalent: '',//当量
        }
      ],

      orderInfo: {
        form: {},
        drugList: []
      },
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
        addBtn: false,
        excelBtn: true,
        //printBtn:true,
        height: "auto",
        calcHeight: 30,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        viewBtn: false,
        selection: true,
        dialogClickModal: false,
        column: [
          {
            label: "订单id",
            prop: "id",
            sortable: true,
            width:150,
            search: true,
          },
          {
            label: "医院名称",
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
            label: "订单状态",
            prop: "orderStatic",
            type: "select",
            props: {
              label: 'dictValue',
              value: 'dictKey'
            },
            search: true,
            required: true,
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=order_status",
            trigger: "blur"
          },

          {
            label: "订单类型",
            prop: "orderType",
            type: "select",
            slot: true,
            props: {
              label: 'dictValue',
              value: 'dictKey'
            },
            search: true,
            required: true,
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=order_type",
            trigger: "blur"
          },
          {
            label: "订单区分",
            prop: "orderDifferentiation",
            type: "select",
            slot: true,
            props: {
              label: 'dictValue',
              value: 'dictKey'
            },
            search: true,
            required: true,
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=order_differentiation",
            trigger: "blur"
          },
          {
            label: "收货地址",
            prop: "address",
            rules: [{
              required: true,
              message: "请输入收货地址",
              trigger: "blur"
            }]
          },
          {
            label: "收件人",
            prop: "addressee",
            rules: [{
              required: true,
              message: "请输入收件人",
              trigger: "blur"
            }],
            search: true,
          },
          {
            label: "收件人电话",
            prop: "addresseePhone",
            labelWidth: 100,
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
            rules: [{
              required: true,
              message: "请输入通知时间",
              trigger: "blur"
            }]
          },
          {
            label: "订单时间",
            prop: "orderTime",
            type: "date",
            width: 150,
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            rules: [{
              required: true,
              message: "请输入通知日期",
              trigger: "click"
            }]
          },
          {
            label: "总价",
            prop: "totalPrices",
            rules: [{
              required: true,
              message: "请输入总价",
              trigger: "blur"
            }]
          },
        ]
      },
      data: [],
      obj0: {
        auditorText: '',
        tet:''
      },
      option0: {
        emptyBtn: false,
        submitBtn: false,
        column: [
          {
            label: "冲突名称",
            prop: "tet",
            span: 20,
            disabled:true,
          },
          {
            label: "驳回理由",
            prop: "auditorText",
            type: 'textarea',
            span: 20,
          },
        ]
      },
    };
  },
  watch: {
    addDialogVisible() {
      if (!this.addDialogVisible) {
        this.activeName = 'jianyao';
      }
    }
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: false,
        viewBtn: this.vaildData(this.permission.order_view, false),
        delBtn: false,
        editBtn: false
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
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
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    //取消
    rejectYin() {
      this.addYinDialogVisible = false;
    },
    rejectKe() {
      this.addKeDialogVisible = false;
    },
    newAddYin(){
      this.addYinDialogVisible = true;
    },
    newAddKe(){
      this.addKeDialogVisible = true;
    },

    //审批
    updateRevocation() {
      this.dialogFormVisible = true;
    },

    //清空选择
    toggleSelection() {
      this.$refs.crud.toggleSelection();
    },

    //推送
    sendHttp() {
      this.$alert("业务暂未对接", {},)
    },
    openDialog(rowID){
      shenfang(rowID).then((res) => {
        this.obj0.tet=res.data.data.name;
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        window.console.log(error);
      });
      this.dialogUpadate = true;
      this.Id= rowID;
    },
    //修改接单状态  //1 未接单  //2 已接单
    updateOrderStatic(zt) {
      console.log(zt)
      updateOrderStatic(this.Id, zt).then(res => {
        if (res.data.success) {
          this.$message.success(res.data.msg);
          this.dialogUpadate = false;
        } else {
          this.$message.error(res.data.msg);
        }
        this.refreshChange();
        this.onLoad(this.page);
      })
    },
    updateOrderStaticBh(zt) {
      if (zt === 6 && this.obj0.auditorText === '') {
        return this.$message.error("请输入驳回理由!");
      }
      updateOrderStaticBh(this.Id, zt, this.obj0.auditorText).then(res => {
        if (res.data.success) {
          this.$message.success(res.data.msg);
          this.dialogUpadate = false;
          this.refreshChange();
          this.obj0.auditorText = "";
        } else {
          this.$message.error(res.data.msg);
        }

      })
    },
    //打印
    dayin(row) {
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
      let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
      this.time = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss;
      if (row.orderType === "jianyao") {

        selectByOrderId(row.id).then(res => {
          if (res.data.success) {
            this.printJianYaoData = res.data.data.form;
            this.printJianYaoDrugData = res.data.data.drugList;
            setTimeout(() => {
              JsBarcode("#bigcode", row.id, {
                width: 2,//设置条之间的宽度
                height: 56,//高度
                fontOptions: "bold",//使文字加粗体或变斜体
                textAlign: "center",//设置文本的水平对齐方式
                textMargin: 5,//设置条形码和文本之间的间距
                fontSize: 25,//设置文本的大小
                displayValue: true,//是否在条形码下方显示文字
                margin: 2
              });
              this.$Print(this.$refs.printyinpian);
              /*var prnhtml = document.querySelector("#print11").innerHTML;
              var iframe = document.createElement('IFRAME');
              iframe.setAttribute('style', 'display:none;');
              var doc = null;
              document.body.appendChild(iframe);
              doc = iframe.contentWindow.document;
              doc.write('<html><head><style>'  + '</style></head><body style="zoom: 60%;">' + prnhtml + '</body></html>');
              doc.close();
              iframe.contentWindow.focus();
              iframe.contentWindow.print();
              if (navigator.userAgent.indexOf("MSIE") > 0) {
                document.body.removeChild(iframe);
              }*/
            }, 100);
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })

      } else if (row.orderType === 'tiaopei') {
        selectByOrderId(row.id).then(res => {
          if (res.data.success) {
            this.printData = res.data.data.form;
            this.printDrugData = res.data.data.drugList;
            setTimeout(() => {
              JsBarcode("#bigcode2", row.id, {
                width: 2,//设置条之间的宽度
                height: 56,//高度
                fontOptions: "bold",//使文字加粗体或变斜体
                textAlign: "center",//设置文本的水平对齐方式
                textMargin: 5,//设置条形码和文本之间的间距
                fontSize: 25,//设置文本的大小
                displayValue: true,//是否在条形码下方显示文字
                margin: 2
              });
              this.$Print(this.$refs.printkeli);
            }, 100);
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })
      }
    },
    newshenfang() {
      this.addYinDialogVisible = true;
    },

    //抓药
    prescription() {
      this.$message({
        type: "success",
        message: "抓药",
      });
      this.dialogVisible = false
    },
    //时间
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
      getListjr(page.currentPage, page.pageSize, Object.assign(values, this.query)).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    },
    //查看
    lockInfo(row) {
      let url = '';
      if (row.orderType === "jianyao") {
        url = "/api/taocao-order/order/decoctingSelectByOrderId"
      } else if (row.orderType === "tiaopei") {
        url = "/api/taocao-order/order/blenderSelectByOrderId"
      } else {
        this.$message({
          type: 'error',
          message: '订单类型不匹配!'
        })
        return;
      }
      getInfo(url, row.id).then(res => {
        this.orderInfo = res.data.data;
        if (row.orderType === "jianyao") {
          this.viewYinDialogVisible = true;
        } else if (row.orderType === "tiaopei") {
          this.viewKeDialogVisible = true;
        } else {
          this.$message({
            type: 'error',
            message: '订单类型不匹配!'
          })
          return;
        }
      })
    },
  }
};


</script>

