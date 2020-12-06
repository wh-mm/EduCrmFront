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
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" plain @click="newAdd()">新 增
        </el-button>
        <el-button type="primary" size="small" icon="el-icon-upload" plain @click="sendHttp()">推 送

        </el-button>

        <el-button type="primary" size="small" icon="el-icon-printer" plain  @click="dayin()">打 印
        </el-button>
      </template>

      <template slot-scope="scope" slot="menu">
        <el-button type="text" icon="el-icon-view" size="small" @click.stop="lockInfo(scope.row)">查 看</el-button>
        <!-- <el-button type="text" icon="el-icon-check" size="small" @click.stop="prescription()">抓 药</el-button>-->
        <el-button type="text" @click="dialogFormVisible = true">查看打印格式</el-button>
        <el-button :type="type" :size="size" icon="el-icon-printer"
                   @click="dayin(row)">打 印
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
    <el-dialog title="打印格式"  :model="false" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <div style="" id="print11" ref="print11">
          <!-- 隐藏打印区域，避免用户看到 -->
          <div style="padding: 1px;height: 100px;">
            <div class="head" >
              <el-row>
                <el-col :span="5" :offset="9"><div class="grid-content bg-purple">
                  <h1 margin="auto" style="text-align: center;margin-top: 10px;font-size: 50px" >调配单</h1></div></el-col>
                <el-col :span="5" :offset="4"><div class="grid-content bg-purple-light">
                  <svg id="bigcode" style="padding: 1px;" ></svg></div></el-col>
              </el-row>

            <div class="code" style="margin-left: 1000px;">
            </div>
              <el-row>
                <el-col :span="10" :offset="3"><div class="grid-content bg-purple"> <p style="font-size: 15px">接方时间：<span>2020年12月5日12:12:29</span></p></div></el-col>
                <el-col :span="8" :offset="3"><div class="grid-content bg-purple-light"><p style="font-size: 15px">打印时间：<span>2020年12月5日12:12:29</span></p></div></el-col>
              </el-row>
            </div>
            <hr  align="center" width="100%" size="1px" length="10" color="black"/>
            <div class="shou" style="">
              <div>

                <table   width="1000px" style="font-size:15px;margin-top: 20px;border: none;align-content: center;margin: auto"  >
                  <tr style="border-left: 50px;" calss="first">
                    <td  style="width:230px;">医院名称：</td>
                    <td style="width:910px;"><span>{{printData.hospitalName}}</span></td>
                    <td style="width:205px;"><b>姓名：</b> </td>
                    <td style="width:100px;"><span>尼古拉斯·艾尔</span></td>
                    <td style="width:160px;">性别：</td>
                    <td style="width:100px;"><span>男</span></td>
                    <td  style="width:100px;">年龄：</td>
                    <td style="width:200px;"><span>48</span></td>


                  </tr>
                  <tr style="border-left: 50px" calss="second">
                    <td >临床诊断：</td>
                    <td ><span>患有严重的先天性心脏病，且血液浓度过高需要进行治疗患有严重的先天性心脏病，且血液浓度过高需要进行治疗</span></td>
                    <td >处方号：</td>
                    <td style="width:250px;"><span>ACT20201205123456</span></td>
                    <td style="width:100px;"><b>包装量：</b></td>
                    <td style="width:100px;"><span>40ml/包</span></td>
                    <td style="width:100px;"><b>剂数：</b></td>
                    <td><span>10剂</span></td>


                  </tr>

                  <tr style="border-left: 100px" calss="third">
                    <td >浸泡加水量：</td>
                    <td><span>每10g加10ml水</span></td>
                    <td ><b>煎药方案：</b> </td>
                    <td><span>先煎后熬</span></td>
                    <td >服用方式：</td>
                    <td><span>口服</span></td>
                    <td >科室：</td>
                    <td><span>心脏病科室</span></td>

                  </tr>

                  <tr style="border-left: 100px" calss="fourth">
                    <td >快递类型：</td>
                    <td><span>顺丰快递</span></td>
                    <td >药品总重量： </td>
                    <td><span>20mg</span></td>
                    <td style="width:100px;" ><b>次数：</b></td>
                    <td><span>10次</span></td>

                  </tr>

                </table>


              </div>
              <div class="footer" >

<!--                <table  align="center" border="1" cellspacing="0" width="1050px" style="margin-top: 20px;margin: auto;border-left: none;border-right: none;"  >-->
<!--                  <tr style="font-size: 15px;" align="center" >-->
<!--                    <td width="50">序号</td>-->
<!--                    <td width="50">货位</td>-->
<!--                    <td width="50">药品名称</td>-->
<!--                    <td width="50">脚注</td>-->
<!--                    <td width="50">单剂量</td>-->
<!--                    <td width="50">总量</td>-->

<!--                  </tr>-->

<!--                  <tr style="font-size: 20px;" align="center">-->
<!--                    <td width="50">1</td>-->
<!--                    <td width="50">A2</td>-->
<!--                    <td width="50">干炒地龙（10g/包）</td>-->
<!--                    <td width="50">脚注</td>-->
<!--                    <td width="50">10ml</td>-->
<!--                    <td width="50">20mg</td>-->

<!--                  </tr>-->

<!--                </table>-->
<!--                <el-table-->
<!--                  :data="tableData"-->
<!--                  :row-style="{height: '0'}"-->
<!--                  :cell-style="{padding: '0'}"-->
<!--                  >-->
<!--                  <el-table-column-->
<!--                    label="序号"-->
<!--                    type="index"-->
<!--                    width="100"-->
<!--                    >-->
<!--                  </el-table-column>-->

<!--                  <el-table-column-->
<!--                    prop="name"-->
<!--                    label="货位"-->
<!--                    width="150">-->
<!--                  </el-table-column>-->

<!--                  <el-table-column-->
<!--                    prop="address"-->
<!--                    label="药品名称"-->
<!--                    width="220">-->
<!--                  </el-table-column>-->

<!--                  <el-table-column-->
<!--                    prop="footer"-->
<!--                    label="脚注"-->
<!--                    width="220">-->
<!--                  </el-table-column>-->

<!--                  <el-table-column-->
<!--                    prop="danji"-->
<!--                    label="单剂量"-->
<!--                    width="160">-->
<!--                  </el-table-column>-->

<!--                  <el-table-column-->
<!--                    prop="sum"-->
<!--                    label="总量"-->
<!--                    width="166">-->
<!--                  </el-table-column>-->

<!--                </el-table>-->
                <el-table
                  float="right"
                  :row-style="{height: '0'}"
                  :cell-style="{padding: '0'}"
                  style="border-color: #000000;border-top: 1px solid">
                  <el-table-column
                    label="序号"
                    type="index"
                    width="165"
                    >
                  </el-table-column>

                  <el-table-column
                    prop="name"
                    label="货位"
                    width="165">
                  </el-table-column>

                  <el-table-column
                    prop="address"
                    label="药品名称"
                    width="168">
                  </el-table-column>

                  <el-table-column
                    prop="footer"
                    label="脚注"
                    width="168">
                  </el-table-column>

                  <el-table-column
                    prop="danji"
                    label="单剂量"
                    width="165">
                  </el-table-column>

                  <el-table-column
                    prop="sum"
                    label="总量"
                    width="166">
                  </el-table-column>


                </el-table>

                <el-row>
                  <el-col :span="10" :offset="3"><div class="grid-content bg-purple"> <p style="font-size: 15px">配方中药师：<span>吴彦祖</span></p></div></el-col>
                  <el-col :span="8" :offset="3"><div class="grid-content bg-purple-light"><p style="font-size: 15px">复核中药师：<span>刘德华</span></p></div></el-col>
                </el-row>

              </div>
            </div>

          </div>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>

    </el-dialog>

  </basic-container>
</template>

<script>
  import {dictionaryByName, getInfo, getList, receiveBlenderSave, receiveDecoctingSave, selectListByDrugCategory} from "@/api/order/order";
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
    data() {
      return {
        selectDrugDialogVisible: false,
        dialogFormVisible: false,
        activeName: 'jianyao',
        printData:[
          {
            hospitalName: '',
            name:'',

          }
        ],
        tableData:[
        //     {
        //   address:"枸杞",
        //   name:"1-1-1",
        //   footer:"脚注11111111111111111111111",
        //   danji:"单剂量",
        //   sum:"500"
        // },
          {
          address:"枸杞",
          name:"1-1-1",
          footer:"脚注11111111111111111111111",
          danji:"单剂量",
          sum:"500"
        },

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
            align:'center',
            tip: false,
            printBtnText:'打印文案',
            searchShow: true,
            searchMenuSpan: 6,
            border: true,
            index: false,
            printBtn:true,
            addBtn:false,
            menu: false,
            header: false,
            selection: true,
            dialogClickModal: false,
            column: [
              {
                label: "颗粒名称/药品名称",
                prop: "goodsName",
              },
              {
                label: "货物类别",
                prop: "goodsCategory",
                type: "tree",
                props: {
                  label: 'dictValue',
                  value: 'id'
                },
                search: true,
                dicFlag: false,
                dicUrl: "/api/blade-system/dictCategory/dictionaryByName"
              },
              {
                label: "规格",
                prop: "unit",
                type: 'select',
                props: {
                  label: 'dictValue',
                  value: 'dictKey'
                },
                search: true,
                dicUrl: "/api/blade-system/dict-biz/dictionary?code=unit"
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
      //打印
      dayin(row) {
        this.printData = row;
        setTimeout(() => {
          JsBarcode("#bigcode", '11213456',{
            width: 3,//设置条之间的宽度
            height: 56,//高度
            fontOptions: "bold",//使文字加粗体或变斜体
            textAlign: "center",//设置文本的水平对齐方式
            textMargin: 5,//设置条形码和文本之间的间距
            fontSize: 26,//设置文本的大小
            displayValue: true,//是否在条形码下方显示文字
            margin: 2
          });
          this.$Print(this.$refs.print11);
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
<!--<style lang="css" >-->
<!--  .first.td{-->

<!--    width: 50px;-->
<!--    align: center;-->
<!--  }-->
<!--  .second{-->
<!--    width: 50px;-->
<!--  }  .third{-->
<!--    width: 50px;-->
<!--  }-->
<!--  td{-->
<!--    width: 50px;-->
<!--  }-->
<!--  .code{-->
<!--    transform:translateX(50%);-->
<!--  }-->

<!--</style>-->
