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
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" plain @click="newAdd()">新 增
        </el-button>
       <!-- <el-button type="primary" size="small" icon="el-icon-upload" plain @click="sendHttp()">推 送
        </el-button>-->

      </template>

      <template slot-scope="scope" slot="menu">
        <el-button type="text" icon="el-icon-view" size="small" @click.stop="lockInfo(scope.row)">查 看</el-button>

        <!--处方中心打印功能-->
        <el-button :type="scope.type" :size="scope.size" icon="el-icon-printer"
                   v-if="scope.row.orderStatic==1"
                   @click.stop="updateOrderStatic(scope.row)">接 单
        </el-button>
        <!-- <el-button type="text" icon="el-icon-check" size="small" @click.stop="prescription()">抓 药</el-button>-->
        <!--        <el-button type="text" @click="dialogFormVisible = true">查看打印格式</el-button>-->
        <el-button :type="scope.type" :size="scope.size" icon="el-icon-printer"
                   v-if="scope.row.orderStatic==2"
                   @click="dayin(scope.row)">打 印 调 配 单
        </el-button>
      </template>
    </avue-crud>
    <el-dialog title="药品列表" :visible.sync="selectDrugDialogVisible" width="80%" :modal="false"
               v-if="selectDrugDialogVisible"
               :close-on-click-modal="false">
      <avue-crud :option="drugList.option" :table-loading="drugList.loading" :data="drugList.data"
                 :page.sync="drugList.page" v-model="drugList.form" ref="crudDrug"
                 @search-change="drugSearchChange" @search-reset="drugSearchReset"
                 @selection-change="drugSelectionChange" @current-change="currentChange" @size-change="drugSizeChange"
                 @refresh-change="drugRefreshChange" @on-load="drugOnLoad">
      </avue-crud>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectDrugBtn()">保 存</el-button>
        <el-button @click="toggleSelection()">清 空</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新 增" :visible.sync="addDialogVisible" v-if="addDialogVisible"
               width="90%" :modal="false" :close-on-click-modal="false"
               :before-close="handleClose">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="饮片" name="jianyao">
        </el-tab-pane>
        <el-tab-pane label="颗粒" name="tiaopei">
        </el-tab-pane>
      </el-tabs>
      <avue-form ref="addForm" v-model="addInfo.form" :option="addOption"></avue-form>
      <avue-crud ref="addCrud" :data="addInfo.drugList" :option="addCrudOption">
        <template slot="menuLeft">
          <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" plain @click="selectDrug">选择药品
          </el-button>
        </template>
        <template slot="doseHerb" slot-scope="scope">
          <el-input type="number" v-model="scope.row.doseHerb" placeholder="请输入饮片剂量" min="0"></el-input>
        </template>
        <template slot="equivalent" slot-scope="scope">
          <el-input type="number" v-model="scope.row.equivalent" placeholder="请输入当量" min="0"></el-input>
        </template>
        <template slot="drugAllnum" slot-scope="scope">
          <el-input type="number" v-model="scope.row.drugAllnum" min=0 placeholder="请输入单剂量"></el-input>
        </template>
        <template slot="tienum" slot-scope="scope">
          <el-input type="number" v-model="scope.row.tienum" min=0 placeholder="请输入贴数"></el-input>
        </template>
        <template slot="drugweight" slot-scope="scope">
          {{scope.row.tienum * scope.row.drugAllnum}}
        </template>
        <template slot="drugDescription" slot-scope="scope">
          <avue-input size="mini" placeholder="请输入" v-model="scope.row.drugDescription"></avue-input>
        </template>
        <template slot="description" slot-scope="scope">
          <avue-input size="mini" placeholder="说明" v-model="scope.row.description"></avue-input>
        </template>
      </avue-crud>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bcBtn()">保 存</el-button>
        <el-button @click="reject()">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="订单详情" :visible.sync="dialogVisible" v-if="dialogVisible"
               width="90%" :modal="false" :close-on-click-modal="false"
               :before-close="handleClose">
      <avue-form ref="viewForm" v-model="orderInfo.form" :option="viewOption"></avue-form>
      <avue-crud ref="viewCrud" :data="orderInfo.drugList" :option="viewCrudOption">
        <template slot="drugAllnum" slot-scope="scope">
          {{scope.row.drugAllnum}}
        </template>
        <template slot="tienum" slot-scope="scope">
          {{scope.row.tienum}}
        </template>
        <template slot="drugweight" slot-scope="scope">
          {{scope.row.tienum * scope.row.drugAllnum}}
        </template>
        <template slot="drugDescription" slot-scope="scope">
          {{scope.row.drugDescription}}
        </template>
        <template slot="description" slot-scope="scope">
          {{scope.row.description}}
        </template>
        <template slot="doseHerb" slot-scope="scope">
          {{scope.row.doseHerb}}
        </template>
        <template slot="equivalent" slot-scope="scope">
          {{scope.row.equivalent}}
        </template>
      </avue-crud>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="prescription()">抓 药</el-button>
      </span>
    </el-dialog>
    <el-dialog title="订单详情" :visible.sync="dialogVisible" v-if="dialogVisible"
               width="90%" :modal="false" :close-on-click-modal="false"
               :before-close="handleClose">
      <avue-form ref="viewForm" v-model="orderInfo.form" :option="viewOption"></avue-form>
      <avue-crud ref="viewCrud" :data="orderInfo.drugList" :option="viewCrudOption">
        <template slot="drugAllnum" slot-scope="scope">
          {{scope.row.drugAllnum}}
        </template>
        <template slot="tienum" slot-scope="scope">
          {{scope.row.tienum}}
        </template>
        <template slot="drugweight" slot-scope="scope">
          {{scope.row.tienum * scope.row.drugAllnum}}
        </template>
        <template slot="drugDescription" slot-scope="scope">
          {{scope.row.drugDescription}}
        </template>
        <template slot="description" slot-scope="scope">
          {{scope.row.description}}
        </template>
        <template slot="doseHerb" slot-scope="scope">
          {{scope.row.doseHerb}}
        </template>
        <template slot="equivalent" slot-scope="scope">
          {{scope.row.equivalent}}
        </template>
      </avue-crud>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="prescription()">抓 药</el-button>
      </span>
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
                <div class="grid-content bg-purple"><p style="font-size: 15px">接方时间：<span>{{printJianYaoData.createTime}}</span>
                </p></div>
              </el-col>
              <el-col :span="8" :offset="3">
                <div class="grid-content bg-purple-light"><p style="font-size: 15px">
                  打印时间：<span>2020年12月5日12:12:29</span></p></div>
              </el-col>
            </el-row>
          </div>

          <hr align="center" width="100%" size="1px" length="10" color="black"/>

          <div class="yinpianshou" style="width: 100%">

            <el-row :gutter="5" style="">
              <el-col :span="6" :offset="1">
                <div class="grid-content bg-purple" style="margin-bottom: 0px"><p style="font-size: 15px;margin: 0px;">
                  医院名称：<span>{{printJianYaoData.hospitalName}}</span></p></div>
              </el-col>
              <el-col :span="6" :offset="1">
                <div class="grid-content bg-purple" style="margin-bottom: 0px"><p style="font-size: 15px;margin: 0px;">
                  姓名：<span>{{printJianYaoData.name}}</span></p></div>
              </el-col>
              <el-col :span="4" :offset="1">
                <div class="grid-content bg-purple" style="margin-bottom: 0px"><p style="font-size: 15px;margin: 0px;">
                  性别：<span>{{printJianYaoData.sex==1?'男':'女'}}</span></p></div>
              </el-col>
              <el-col :span="4" :offset="1">
                <div class="grid-content bg-purple" style="margin-bottom: 0px"><p style="font-size: 15px;margin: 0px;">
                  年龄：<span>{{printJianYaoData.age}}</span></p></div>
              </el-col>
            </el-row>

            <el-row :gutter="5" style="margin-top:-200px;margin-bottom:-200px">
              <el-col :span="6" :offset="1">
                <div class="grid-content bg-purple"><p style="font-size: 15px;margin: 0px;">处方号：<span>{{printJianYaoData.delnum}}</span>
                </p></div>
              </el-col>
              <el-col :span="6" :offset="1">
                <div class="grid-content bg-purple"><p style="font-size: 15px;margin: 0px;">包装量：<span>{{printJianYaoData.packagenum}}</span>
                </p></div>
              </el-col>
              <el-col :span="4" :offset="1">
                <div class="grid-content bg-purple"><p style="font-size: 15px;margin: 0px;">剂数/贴数：<span>{{printJianYaoData.dose}}</span>
                </p></div>
              </el-col>
              <!--<el-col :span="4" :offset="1">
                <div class="grid-content bg-purple"><p style="font-size: 15px;margin: 0px;">次数：<span>{{printJianYaoData.takenum}}</span>
                </p></div>
              </el-col>-->
            </el-row>

            <el-row :gutter="5" style="margin-top:-15px;margin-bottom:-15px">
              <el-col :span="6" :offset="1">
                <div class="grid-content bg-purple"><p style="font-size: 15px;margin: 0px;">浸泡加水量：<span>{{printJianYaoData.soakwater}}</span>
                </p></div>
              </el-col>
              <el-col :span="6" :offset="1">
                <div class="grid-content bg-purple"><p style="font-size: 15px;margin: 0px;">煎药方案：<span>{{printJianYaoData.decscheme}}</span>
                </p></div>
              </el-col>
              <el-col :span="4" :offset="1">
                <div class="grid-content bg-purple"><p style="font-size: 15px;margin: 0px;">服用方式：<span>{{printJianYaoData.takemethod}}</span>
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
                  <span>{{scope.row.drug_allnum / 1 | rounding}}</span>
                </template>
              </el-table-column>

              <el-table-column
                label="总剂量"
                width="166"
                align="center">
                <template slot-scope="scope">
                  {{scope.row.tienum * scope.row.drug_allnum}}

                </template>
              </el-table-column>

            </el-table>

            <hr align="center" width="100%" size="1px" length="10" color="black"/>

            <el-col :span="3" :offset="1">
              <div class="grid-content bg-purple"><p style="font-size: 15px">接方员：<span></span></p></div>
            </el-col>
            <el-col :span="2" :offset="2">
              <div class="grid-content bg-purple-light"><p style="font-size: 15px">调配员：<span></span></p></div>
            </el-col>  <el-col :span="2" :offset="3">
            <div class="grid-content bg-purple-light"><p style="font-size: 15px">浸泡员：<span></span></p></div>
          </el-col>  <el-col :span="2" :offset="3">
            <div class="grid-content bg-purple-light"><p style="font-size: 15px">煎煮员：<span></span></p></div>
          </el-col>  <el-col :span="2" :offset="3">
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
                  接方时间：<span>{{printData.createTime}}</span></p></div>
              </el-col>
              <el-col :span="8" :offset="3">
                <div class="grid-content bg-purple-light"><p style="font-size: 15px">
                  打印时间：<span>2020年12月5日12:12:29</span></p></div>
              </el-col>
            </el-row>
          </div>

          <hr align="center" width="100%" size="1px" length="10" color="black"/>

          <div class="kelishou" style="width: 100%">

            <el-row :gutter="5" style="">
              <el-col :span="6" :offset="1">
                <div class="grid-content bg-purple" style="margin-bottom: 0px"><p style="font-size: 15px;margin: 0px;">
                  医院名称：<span>{{printData.hospitalName}}</span></p></div>
              </el-col>
              <el-col :span="6" :offset="1">
                <div class="grid-content bg-purple" style="margin-bottom: 0px"><p style="font-size: 15px;margin: 0px;">
                  姓名：<span>{{printData.name}}</span></p></div>
              </el-col>
              <el-col :span="4" :offset="1">
                <div class="grid-content bg-purple" style="margin-bottom: 0px"><p style="font-size: 15px;margin: 0px;">
                  性别：<span>{{printData.sex==1?'男':'女'}}</span></p></div>
              </el-col>
              <el-col :span="4" :offset="1">
                <div class="grid-content bg-purple" style="margin-bottom: 0px"><p style="font-size: 15px;margin: 0px;">
                  年龄：<span>{{printData.age}}</span></p></div>
              </el-col>
            </el-row>
            <el-row :gutter="5" style="margin-top: 0;margin-bottom:0">
              <el-col :span="6" :offset="1">
                <div class="grid-content bg-purple"><p style="font-size: 15px;margin: 0px;">处方号：<span>{{printData.presId}}</span>
                </p></div>
              </el-col>
              <el-col :span="6" :offset="1">
                <div class="grid-content bg-purple"><p style="font-size: 15px;margin: 0px;">处方名称：<span>{{printData.presName}}</span>
                </p></div>
              </el-col>
              <el-col :span="4" :offset="1">
                <div class="grid-content bg-purple"><p style="font-size: 15px;margin: 0px;">处方付数：<span>{{printData.quantity==1?'贴数':'剂数'}}</span>
                </p></div>
              </el-col>
              <el-col :span="4" :offset="1">
                <div class="grid-content bg-purple"><p style="font-size: 15px;margin: 0px;">分服次数：<span>{{printData.separateFrequency}}</span>
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
            </el-col>  <el-col :span="2" :offset="3">
            <div class="grid-content bg-purple-light"><p style="font-size: 15px">浸泡员：<span></span></p></div>
          </el-col>  <el-col :span="2" :offset="3">
            <div class="grid-content bg-purple-light"><p style="font-size: 15px">煎煮员：<span></span></p></div>
          </el-col>  <el-col :span="2" :offset="3">
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
    dictionaryByName,
    getInfo,
    getList,
    receiveBlenderSave,
    receiveDecoctingSave,
    selectListByDrugCategory,
    selectByOrderId,
    updateOrderStatic
  } from "@/api/order/order";
  import {mapGetters} from "vuex";
  import JsBarcode from 'jsbarcode';
  import {
    newAddBlenderListOption,
    newAddDrugListOption,
    newAddDrugOption,
    newAddGrainOption,
    newAddListOption,
    option,
    viewAddBlenderListOption,
    viewDrugListOption
  } from "@/const/order/customerorder"

  export default {
    filters: {
      rounding(value) {
        return value.toFixed(2)
      }
    },
    data() {
      return {
        selectDrugDialogVisible: false,
        dialogFormVisible: false,
        activeName: 'jianyao',

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


            // name:'',
            // sex:'',
            // age:'',
            // packagenum:'',
            // drugAllnum:'',
            // soakwater:'',

          }
        ],

        drugList: {
          form: {},
          query: {},
          loading: true,
          page: {
            pageSize: 10,
            currentPage: 1,
            total: 0
          },
          data: [],
          selectionList: [],
          option: {
            height: 'auto',
            calcHeight: 30,
            align: 'center',
            tip: false,
            printBtnText: '打印文案',
            searchShow: true,
            searchMenuSpan: 6,
            border: true,
            index: false,
            printBtn: true,
            addBtn: false,
            menu: false,
            header: false,
            selection: true,
            dialogClickModal: false,
            column: [
              {
                label: "颗粒名称",
                prop: "goodsName",
                type: "tree",
                props: {
                  label: 'goodsName',
                  value: 'id'
                },
                search: true,
                dicMethod: "post",
                dicUrl: this.ERP_WMS_NAME + '/goods/selecListGoods'
              },
              {
                label: "货物类型",
                prop: "goodsType",
                type: "tree",
                rules: [{
                  required: true,
                  message: "请选择货物类型",
                  trigger: "blur"
                }],
                props: {
                  label: 'title',
                  value: 'id'
                },
                search: true,
                dicUrl: this.ERP_WMS_NAME + "/goods-type/tree"
              },
              {
                label: "规格",
                prop: "goodsSpecification",


              },
              {
                label: "单价",
                prop: "unitPrice",
              }
            ]
          },
        },
        addDialogVisible: false,
        dialogVisible: false,
        addInfo: {
          form: {},
          drugList: [],
        },
        orderInfo: {
          form: {},
          drugList: []
        },
        orderType: 1,
        addOption: '',
        addCrudOption: '',
        viewOption: '',
        viewCrudOption: '',
        newAddListOption: newAddListOption,
        newAddDrugListOption: newAddDrugListOption,
        form: {},
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: option,
        data: []
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
          addBtn: this.vaildData(this.permission.order_add, false),
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
      handleClick() {
        this.tabFrom();
        this.addInfo.form = {};
        this.addInfo.drugList = [];
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
      currentChange(currentPage) {
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize) {
        this.page.pageSize = pageSize;
      },
      refreshChange() {
        this.onLoad(this.page, this.query);
      },
      //确认选择
      selectDrugBtn() {
        this.drugList.selectionList.forEach(l => {
          l.drugAllnum = 1;
          l.tienum = 1;
          l.doseHerb = 1;
          l.equivalent = 1;
        })
        this.addInfo.drugList = this.drugList.selectionList;
        this.selectDrugDialogVisible = false;
        this.$refs.crud.toggleSelection();
      },
      //保存
      bcBtn() {
        this.$refs.addForm.validate((valid, callback) => {
          if (valid) {
            this.$confirm("请仔细查阅一经保存无法删除！", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                let params = {};
                params = this.addInfo.form;
                params.orderType = this.activeName;
                params.drugList = this.addInfo.drugList;
                if (this.activeName === 'tiaopei') {
                  receiveBlenderSave(params).then(res => {
                    if (res.data.code === 200) {
                      this.$message({
                        type: "success",
                        message: res.data.msg,
                      })
                      this.$refs.addForm.resetForm();
                      this.addDialogVisible = false
                      this.refreshChange();
                      this.addInfo.drugList = []
                      this.addInfo.form = {};
                    } else {
                      this.$message({
                        type: "error",
                        message: res.data.msg
                      })
                      callback();
                    }
                  });
                } else if (this.activeName === 'jianyao') {
                  receiveDecoctingSave(params).then(res => {
                    if (res.data.code === 200) {
                      this.$message({
                        type: "success",
                        message: res.data.msg,
                      })
                      this.$refs.addForm.resetForm();
                      this.addDialogVisible = false
                      this.refreshChange();
                      this.addInfo.drugList = []
                      this.addInfo.form = {};
                    } else {
                      this.$message({
                        type: "error",
                        message: res.data.msg
                      })
                      callback();
                    }
                  });
                }
              }).catch(() => {
              callback();
            })
          }
        })
      },
      //取消
      reject() {
        this.$refs.addCrud.toggleSelection();
        this.addDialogVisible = false;
      },
      //清空选择
      toggleSelection() {
        this.$refs.crud.toggleSelection();
      },
      //选择药品
      selectDrug() {
        this.selectDrugDialogVisible = true;
        this.drugRefreshChange();
        setTimeout(() => {
          dictionaryByName(this.activeName).then(res => {
            this.$refs.crudDrug.updateDic("goodsCategory", res.data.data);
          });
        }, 20);

      },
      //推送
      sendHttp() {
        this.$alert("业务暂未对接", {},)
      },

      //修改接单状态  //1 未接单  //2 已接单
      updateOrderStatic(row) {
        updateOrderStatic(row.id).then(res => {
          if (res.data.success) {
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
          this.refreshChange();
          this.onLoad(this.page);
        })

      },

      //打印
      dayin(row) {

        if (row.orderType === "jianyao") {

          selectByOrderId(row.id).then(res => {
            if (res.data.success) {
              this.printJianYaoData = res.data.data.form;
              this.printJianYaoDrugData = res.data.data.drugList;
              this.$message.success(res.data.msg);
            } else {
              this.$message.error(res.data.msg);
            }
          })
          //  console.log(row.id);
          // console.log(row.orderType);
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
        } else if (row.orderType === 'tiaopei') {
          selectByOrderId(row.id).then(res => {
            if (res.data.success) {
              this.printData = res.data.data.form;
              this.printDrugData = res.data.data.drugList;
              this.$message.success(res.data.msg);
            } else {
              this.$message.error(res.data.msg);
            }
          })
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
        }

      },
      //新增 按钮
      newAdd() {
        this.addDialogVisible = true;
        this.tabFrom();
        this.addOption.detail = false;
      },
      tabFrom() {
        if (this.activeName === 'jianyao') {
          this.addOption = Object.assign({}, newAddDrugOption);
          this.addCrudOption = Object.assign({}, newAddDrugListOption);
        } else if (this.activeName === 'tiaopei') {
          this.addOption = Object.assign({}, newAddGrainOption);
          this.addCrudOption = Object.assign({}, newAddBlenderListOption);
          setTimeout(() => {
            this.$refs.addForm.updateDic("quantity");
          }, 20);
        }
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
        getList(page.currentPage, page.pageSize, Object.assign(values, this.query)).then(res => {
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

          this.viewOption = Object.assign({}, newAddDrugOption);
          this.viewCrudOption = Object.assign({}, viewDrugListOption);
          url = "/api/taocao-order/order/decoctingSelectByOrderId"
        } else if (row.orderType === "tiaopei") {
          this.viewOption = Object.assign({}, newAddGrainOption);
          this.viewCrudOption = Object.assign({}, viewAddBlenderListOption);
          url = "/api/taocao-order/order/blenderSelectByOrderId"
        } else {
          this.$message({
            type: 'error',
            message: '订单类型不匹配!'
          })
          return;
        }
        this.viewOption.detail = true;
        this.dialogVisible = true;
        getInfo(url, row.id).then(res => {
          this.orderInfo = res.data.data;
        })
      },
      drugSearchReset() {
        this.drugList.query = {};
        this.drugOnLoad(this.drugList.page);
      },
      drugSearchChange(params, done) {
        this.drugList.query = params;
        this.drugList.page.currentPage = 1;
        this.drugOnLoad(this.drugList.page, params);
        done();
      },
      drugSelectionChange(list) {
        this.drugList.selectionList = list;
      },
      drugSelectionClear() {
        this.drugList.selectionList = [];
        this.$refs.crud.toggleSelection();
      },
      drugCurrentChange(currentPage) {
        this.drugList.page.currentPage = currentPage;
      },
      drugSizeChange(pageSize) {
        this.drugList.page.pageSize = pageSize;
      },
      drugRefreshChange() {
        this.drugOnLoad(this.drugList.page, this.drugList.query);
      },
      drugOnLoad(page, params = {}) {
        this.drugList.loading = true;
        params.drugCategory = this.activeName;
        selectListByDrugCategory(page.currentPage, page.pageSize, Object.assign(params, this.drugList.query)).then(res => {
          const data = res.data.data;
          if (data.length == 0) {
            this.drugList.loading = false;
            this.drugSelectionClear();
            this.drugList.data = [];
            return;
          }
          data.records.forEach((value) => {
            value.drugAllnum = 0
            value.tienum = 0
            value.doseHerb = 1
            value.equivalent = 1
          })
          this.drugList.page.total = data.total;
          this.drugList.data = data.records;
          this.drugList.loading = false;
          this.drugSelectionClear();
        });
      },
    }
  };
</script>

