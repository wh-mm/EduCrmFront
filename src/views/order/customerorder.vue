<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" plain @click="newAdd">新 增</el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="text" icon="el-icon-view" size="small" @click.stop="lockInfo(scope.row)">查 看</el-button>
        <el-button type="text" icon="el-icon-check" size="small" @click.stop="prescription()">抓 药</el-button>
      </template>
    </avue-crud>
    <el-dialog title="药品列表" :visible.sync="selectDrugDialogVisible" width="80%" :modal="false"
               :close-on-click-modal="false" :before-close="handleClose">
      <avue-crud :option="drugList.option" :table-loading="drugList.loading" :data="drugList.data"
                 :page.sync="drugList.page"  v-model="drugList.form" ref="crud"
                 @search-change="drugSearchChange" @search-reset="drugSearchReset"
                 @selection-change="drugSelectionChange" @current-change="currentChange" @size-change="drugSizeChange"
                 @refresh-change="drugRefreshChange" @on-load="drugOnLoad">
        <template slot="tienum" slot-scope="scope">
          <el-input v-model="scope.row.tienum" type="number" placeholder="请输入贴数"></el-input>
        </template>
      </avue-crud>
      <span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="selectDrugBtn()">保 存</el-button>
			<el-button @click="toggleSelection()">清 空</el-button>
		</span>
    </el-dialog>
    <el-dialog title="新 增" :visible.sync="addDialogVisible" width="90%" :modal="false" :close-on-click-modal="false"
               :before-close="handleClose">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>基础信息</span>
        </div>
        <avue-form ref="form" v-model="addInfo.order" :option="newAddOption"></avue-form>
      </el-card>
      <div v-if="machineType == 2">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>订单信息</span>
          </div>
          <avue-form ref="form" v-model="addInfo.decoctingList" :option="newAddDrugOption">
          </avue-form>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>药品列表</span>
          </div>
          <avue-crud :data="addInfo.decoctingDrugList" :option="newAddListOption">
            <template slot="menuLeft">
              <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" plain @click="selectDrug">选择药品
              </el-button>
            </template>
          </avue-crud>
        </el-card>
      </div>
      <div v-if="machineType == 1">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>订单信息</span>
          </div>
          <avue-form ref="form" v-model="addInfo.blender" :option="newAddGrainOption">
          </avue-form>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>药品列表</span>
          </div>
          <avue-crud :data="addInfo.blenderDetailsList" :option="newAddListOption1">
            <template slot="menuLeft">
              <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" plain @click="selectDrug">选择药品
              </el-button>
            </template>
          </avue-crud>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="prescription()">保 存</el-button>
			<el-button @click="reject()">取 消</el-button>
		</span>
    </el-dialog>
    <el-dialog title="订单详情" :visible.sync="dialogVisible" width="90%" :modal="false" :close-on-click-modal="false"
               :before-close="handleClose">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>基础信息</span>
        </div>
        <avue-form ref="form" v-model="orderInfo.order" :data="orderInfo" :option="baseOption"></avue-form>
      </el-card>
      <div v-if="orderType == 2">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>订单信息</span>
          </div>
          <avue-form ref="form" v-model="orderInfo.decoctingList" :option="drugOption">
          </avue-form>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>药品列表</span>
          </div>
          <avue-crud :data="orderInfo.decoctingDrugList" :option="listOption">
          </avue-crud>
        </el-card>
      </div>
      <div v-if="orderType == 1">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>订单信息</span>
          </div>
          <avue-form ref="form" v-model="orderInfo.blenderList" :option="grainOption">
          </avue-form>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>药品列表</span>
          </div>
          <avue-crud :data="orderInfo.blenderDetailsList" :option="listOption1">
          </avue-crud>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="prescription()">抓 药</el-button>
		</span>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove, getInfo, getDrugList} from "@/api/order/order";
  import {mapGetters} from "vuex";

  export default {
    data() {
      var phonelength = (rule, value, callback) => {
        console.log(value.length);
        if (value.length != 11) {
          callback(new Error('请输入正确手机号'));
        } else {
          callback();
        }
      };

      return {
        selectDrugDialogVisible: false,
        drugList: {
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
            height: 'auto',
            calcHeight: 30,
            tip: false,
            searchShow: true,
            searchMenuSpan: 6,
            border: true,
            index: false,
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
                label: "货物大类别",
                prop: "parentId",
                type: "tree",
                props: {
                  label: 'dictValue',
                  value: 'id'
                },
                cascaderItem: ['goodsCategory'],
                search: true,
                dicUrl: '/api/blade-system/dictCategory/dictionaryByParentId?parentId=0'
              },
              {
                label: "货物小类别",
                prop: "goodsCategory",
                type: "tree",
                props: {
                  label: 'dictValue',
                  value: 'id'
                },
                cascaderItem: ['goodsName'],
                search: true,
                dicUrl: "/api/blade-system/dictCategory/dictionaryByParentId?parentId={{key}}"
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
                label: "贴数",
                prop: "tienum",
                slot: true
              }
            ]
          },
        },
        machineType: 0,
        addDialogVisible: false,
        orderType: 1,
        dialogVisible: false,
        addInfo: {
          blender: {},
          order: {},
          blenderDetailsList: []
        },
        orderInfo: {},
        newAddBaseOption: {
          height: "auto",
          calcHeight: 30,
          tip: false,
          border: true,
          index: true,
          viewBtn: false,
          selection: true,
          dialogClickModal: false,
          menuBtn: false,
          column: [{
            label: "医院名称",
            prop: "hospitalId",
            span: 6,
          },
            {
              label: "订单编号",
              prop: "id",
              span: 6,
            },
            {
              label: "订单状态",
              prop: "orderStatic",
              span: 6,
            },
            {
              label: "订单类型",
              prop: "orderType",
              span: 6,
            },
            {
              label: "收货地址",
              prop: "address",
              span: 6,
            },
            {
              label: "收件人",
              prop: "addressee",
              span: 6,
            },
            {
              label: "收件人电话",
              prop: "addresseePhone",
              span: 6,
            },
            {
              label: "订单时间",
              prop: "orderTime",
              type: 'date',
              span: 6,
            },
          ],
        },
        newAddDrugOption: {
          height: "auto",
          calcHeight: 30,
          tip: false,
          border: true,
          index: true,
          viewBtn: false,
          selection: true,
          dialogClickModal: false,
          menuBtn: false,
          column: [{
            label: "委托单号",
            prop: "delnum",
            span: 6,
          },

            {
              label: "医院名称",
              prop: "hospitalName",
              span: 6,
            },
            {
              label: "处方号",
              prop: "pspnum",
              span: 6,
            },
            {
              label: "患者姓名",
              prop: "name",
              span: 6,
            },
            {
              label: "性别",
              prop: "sex",
              type: "select",
              span: 6,
             /* props: {
                label: "dictValue",
                value: "dictKey"
              },
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=006"*/
            },
            {
              label: "年龄",
              prop: "age",
              span: 6,
            },
            {
              label: "电话",
              prop: "phone",
              span: 6,
            },
            {
              label: "地址",
              prop: "address",
              span: 6,
            },
            {
              label: "科室",
              prop: "department",
              span: 6,
            },
            {
              label: "病区",
              prop: "inpatientarea",
              span: 6,
            },
            {
              label: "病房",
              prop: "ward",
              span: 6,
            },
            {
              label: "病床",
              prop: "sickbed",
              span: 6,
            },
            {
              label: "诊断结果",
              prop: "diagresult",
              span: 6,
            },
            {
              label: "贴数",
              prop: "dose",
              span: 6,
            },
            {
              label: "次数",
              prop: "takenum",
              span: 6,
            },
            {
              label: "取药时间",
              prop: "getdrugtime",
              span: 6,
            },
            {
              label: "取药序号",
              prop: "getdrugnum",
              span: 6,
            },
            {
              label: "煎药方案",
              prop: "decscheme",
              span: 6,
            },
            {
              label: "一煎时间",
              prop: "oncetime",
              span: 6,
            },
            {
              label: "二煎时间",
              prop: "twicetime",
              span: 6,
            },
            {
              label: "包装量",
              prop: "packagenum",
              span: 6,
            },
            {
              label: "记录时间",
              prop: "dotime",
              span: 6,
            },
            {
              label: "操作人员",
              prop: "doperson",
              span: 6,
            },
            {
              label: "收件方",
              prop: "dtbcompany",
              span: 6,
            },
            {
              label: "收件地址",
              prop: "dtbaddress",
              span: 18,
            },
            {
              label: "联系电话",
              prop: "dtbphone",
              span: 6,
            },
            {
              label: "快递类型",
              prop: "dtbtype",
              span: 6,
            },
            {
              label: "浸泡加水量",
              prop: "soakwater",
              span: 6,
            },
            {
              label: "浸泡时间",
              prop: "soaktime",
              span: 6,
            },
            {
              label: "标签数量",
              prop: "labelnum",
              span: 6,
            },
            {
              label: "备注",
              prop: "remark",
              span: 12,
            },
            {
              label: "医生",
              prop: "doctor",
              span: 6,
            },
            {
              label: "医生脚注",
              prop: "footnote",
              span: 6,
            },
            {
              label: "下单时间",
              prop: "ordertime",
              span: 6,
            },
            {
              label: "处方状态",
              prop: "curstate",
              span: 6,
            },
            {
              label: "煎药方式",
              prop: "decmothed",
              span: 6,
            },
            {
              label: "服用方法",
              prop: "takeway",
              span: 6,
            },
            {
              label: "服用方式",
              prop: "takemethod",
              span: 6,
            },
            {
              label: "备注A",
              prop: "remarkA",
              span: 6,
            },
            {
              label: "备注B",
              prop: "remarkB",
              span: 6,
            },
            {
              label: "药品总量",
              prop: "drugCount",
              span: 6,
            },
            {
              label: "是否代煎",
              prop: "isDaijian",
              span: 6,
            },
            {
              label: "支付方式",
              prop: "payment",
              span: 6,
            },
            {
              label: "医嘱",
              prop: "yizhu",
              span: 6,
            },
            {
              label: "金额",
              prop: "money",
              span: 6,
            },
            {
              label: "病历号，健康卡号，病人ID，社保号，门诊号",
              prop: "outpatientNumber",
              span: 12,
              labelWidth: 300,
            },
            {
              label: "序号",
              prop: "outpatientIndex",
              span: 6,
            },
            {
              label: "处方类型",
              prop: "ptype",
              span: 6,
            },
            {
              label: "身份验证",
              prop: "token",
              span: 6,
            },
          ],
        },
        newAddListOption: {
          height: "auto",
          calcHeight: 30,
          tip: false,
          border: true,
          index: true,
          viewBtn: false,
          addBtn: false,
          menu: false,
          page: false,
          dialogClickModal: false,
          menuBtn: false,
          column: [
            {
              label: "委托单号",
              prop: "delnum",
            },
            {
              label: "药品编号",
              prop: "drugnum",
            },
            {
              label: "药品名称",
              prop: "drugname",
            },
            {
              label: "规格",
              prop: "drugposition",
            },
            {
              label: "单剂量",
              prop: "drugallnum",
            },
            {
              label: "药品脚注",
              prop: "drugdescription",
            },
            {
              label: "贴数",
              prop: "tienum",
            },
            {
              label: "总剂量",
              prop: "drugweight",
            },
            {
              label: "说明",
              prop: "description",
            },
            {
              label: "单价",
              prop: "retailprice",
            },
          ],
        },
        newAddGrainOption: {
          height: "auto",
          calcHeight: 30,
          tip: false,
          border: true,
          index: true,
          viewBtn: false,
          selection: true,
          dialogClickModal: false,
          menuBtn: false,
          column: [{
            label: "订单ID",
            prop: "orderId",
            span: 6,
          },
            {
              label: "处方编号",
              prop: "presId",
              span: 6,
            },
            {
              label: "患者姓名",
              prop: "name",
              span: 6,
            },
            {
              label: "患者性别",
              prop: "sex",
              span: 6,
            },
            {
              label: "患者年龄",
              prop: "age",
              span: 6,
            },
            {
              label: "详细年龄",
              prop: "detailedAge",
              span: 6,
            },
            {
              label: "患者联系电话",
              prop: "tele",
              span: 6,
            },
            {
              label: "患者联系地址",
              prop: "address",
              span: 6,
            },
            {
              label: "处方类型",
              prop: "isInpatient",
              span: 6,
            },
            {
              label: "住院处方床号信息",
              prop: "hospitalBedNo",
              span: 6,
            },
            {
              label: "就诊卡号",
              prop: "visitingCard",
              span: 6,
            },
            {
              label: "处方付数",
              prop: "quantity",
              span: 6,
            },
            {
              label: "分服次数",
              prop: "separateFrequency",
              span: 6,
            },
            {
              label: "医生姓名",
              prop: "doctorName",
              span: 6,
            },
            {
              label: "科室名称",
              prop: "departmentName",
              span: 6,
            },
            {
              label: "处方名称",
              prop: "presName",
              span: 6,
            },
            {
              label: "处方开具时间",
              prop: "presTime",
              span: 6,
            },
            {
              label: "处方创建人姓名",
              prop: "creater",
              span: 6,
            },
            {
              label: "处方划价员姓名",
              prop: "valuerName",
              span: 6,
            },
            {
              label: "处方划价时间",
              prop: "valuationTime",
              span: 6,
            },
            {
              label: "挂单号",
              prop: "registerId",
              span: 6,
            },
            {
              label: "处方缴费类型",
              prop: "paymentType",
              span: 6,
            },
            {
              label: "缴费状态",
              prop: "paymentStatus",
              span: 6,
            },
            {
              label: "处方单付价格",
              prop: "unitPrice",
              span: 6,
            },
            {
              label: "处方总价",
              prop: "total",
              span: 6,
            },
            {
              label: "对应明细表条数",
              prop: "drugCount",
              span: 6,
            },
            {
              label: "处方备注说明",
              prop: "remarks",
              span: 6,
            },
            {
              label: "处方使用方法",
              prop: "usageMethod",
              span: 6,
            },
          ],
        },
        newAddListOption1: {
          height: "auto",
          calcHeight: 30,
          tip: false,
          border: true,
          index: true,
          viewBtn: false,
          menu: false,
          page: false,
          addBtn: false,
          dialogClickModal: false,
          menuBtn: false,
          column: [{
            label: "处方ID",
            prop: "presId",
          },
            {
              label: "颗粒序号",
              prop: "drugNo",
            },
            {
              label: "院方库颗粒名称",
              prop: "drugName",
            },
            {
              label: "院库颗粒编号",
              prop: "drugId",
            },
            {
              label: "颗粒批号",
              prop: "batchNumber",
            },
            {
              label: "饮片剂量",
              prop: "doseHerb",
            },
            {
              label: "当量",
              prop: "equivalent",
            },
            {
              label: "颗粒剂量",
              prop: "dose",
            },
            {
              label: "药品饮片单价",
              prop: "herbPrice",
            },
            {
              label: "药品颗粒单价",
              prop: "dosePrice",
            },
            {
              label: "品种备注",
              prop: "remarks",
            },
          ],
        },
        newAddOption: {
          height: "auto",
          calcHeight: 30,
          tip: false,
          border: true,
          index: true,
          viewBtn: false,
          selection: true,
          dialogClickModal: false,
          menuBtn: false,
          column: [{
            label: "医院名称",
            prop: "hospitalId",
            type: "select",
            props: {
              label: "hospitalName",
              value: "id"
            },
            span: 6,
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
              span: 6,
              search: true,
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=order_status"
            },
            {
              label: "订单类型",
              prop: "orderType",
              type: "select",
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              span: 6,
              search: true,
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=order_type",
              change: ({
                         value
                       }) => {
                console.log(value);
                this.machineType = value
              }
            },
            {
              label: "收件人",
              prop: "addressee",
              rules: [{
                required: true,
                message: "请输入收件人",
                trigger: "blur",
              },],
              span: 6,
            },
            {
              label: "收件人电话",
              prop: "addresseePhone",
              rules: [{
                required: true,
                validator: phonelength,
                trigger: 'blur'
              }],
              span: 6,
            },
            {
              label: "收货地址",
              prop: "address",
              rules: [{
                required: true,
                message: "请输入收货地址",
                trigger: "blur",
              },],
              span: 6,
            },


            {
              label: "订单时间",
              prop: "orderTime",
              type: 'datetime',
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
              span: 6,
            },


          ],
        },
        baseOption: {
          height: "auto",
          calcHeight: 30,
          tip: false,
          border: true,
          index: true,
          viewBtn: false,
          selection: true,
          dialogClickModal: false,
          menuBtn: false,
          column: [{
            label: "医院名称",
            prop: "hospitalId",
            disabled: true,
            span: 6,
          },
            {
              label: "订单编号",
              prop: "id",
              disabled: true,
              span: 6,
            },
            {
              label: "订单状态",
              prop: "orderStatic",
              disabled: true,
              span: 6,
            },
            {
              label: "订单类型",
              prop: "orderType",
              disabled: true,
              span: 6,
            },
            {
              label: "收货地址",
              prop: "address",
              disabled: true,
              span: 6,
            },
            {
              label: "收件人",
              prop: "addressee",
              disabled: true,
              span: 6,
            },
            {
              label: "收件人电话",
              prop: "addresseePhone",

              disabled: true,
              span: 6,
            },
            {
              label: "订单时间",
              prop: "orderTime",
              type: 'date',
              span: 6,
            },
          ],
        },
        drugOption: {
          height: "auto",
          calcHeight: 30,
          tip: false,
          border: true,
          index: true,
          viewBtn: false,
          selection: true,
          dialogClickModal: false,
          menuBtn: false,
          column: [{
            label: "委托单号",
            prop: "delnum",
            disabled: true,
            span: 6,
          },

            {
              label: "医院名称",
              prop: "hospitalName",
              disabled: true,
              span: 6,
            },
            {
              label: "处方号",
              prop: "pspnum",
              disabled: true,
              span: 6,
            },
            {
              label: "患者姓名",
              prop: "name",
              disabled: true,
              span: 6,
            },
            {
              label: "性别",
              prop: "sex",
              disabled: true,
              type: "select",
              span: 6,
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=006"
            },
            {
              label: "年龄",
              prop: "age",
              disabled: true,
              span: 6,
            },
            {
              label: "电话",
              prop: "phone",
              disabled: true,
              span: 6,
            },
            {
              label: "地址",
              prop: "address",
              disabled: true,
              span: 6,
            },
            {
              label: "科室",
              prop: "department",
              disabled: true,
              span: 6,
            },
            {
              label: "病区",
              prop: "inpatientarea",
              disabled: true,
              span: 6,
            },
            {
              label: "病房",
              prop: "ward",
              disabled: true,
              span: 6,
            },
            {
              label: "病床",
              prop: "sickbed",
              disabled: true,
              span: 6,
            },
            {
              label: "诊断结果",
              prop: "diagresult",
              disabled: true,
              span: 6,
            },
            {
              label: "贴数",
              prop: "dose",
              disabled: true,
              span: 6,
            },
            {
              label: "次数",
              prop: "takenum",
              disabled: true,
              span: 6,
            },
            {
              label: "取药时间",
              prop: "getdrugtime",
              disabled: true,
              span: 6,
            },
            {
              label: "取药序号",
              prop: "getdrugnum",
              disabled: true,
              span: 6,
            },
            {
              label: "煎药方案",
              prop: "decscheme",
              disabled: true,
              span: 6,
            },
            {
              label: "一煎时间",
              prop: "oncetime",
              disabled: true,
              span: 6,
            },
            {
              label: "二煎时间",
              prop: "twicetime",
              disabled: true,
              span: 6,
            },
            {
              label: "包装量",
              prop: "packagenum",
              disabled: true,
              span: 6,
            },
            {
              label: "记录时间",
              prop: "dotime",
              disabled: true,
              span: 6,
            },
            {
              label: "操作人员",
              prop: "doperson",
              disabled: true,
              span: 6,
            },
            {
              label: "收件方",
              prop: "dtbcompany",
              disabled: true,
              span: 6,
            },
            {
              label: "收件地址",
              prop: "dtbaddress",
              disabled: true,
              span: 18,
            },
            {
              label: "联系电话",
              prop: "dtbphone",
              disabled: true,
              span: 6,
            },
            {
              label: "快递类型",
              prop: "dtbtype",
              disabled: true,
              span: 6,
            },
            {
              label: "浸泡加水量",
              prop: "soakwater",
              disabled: true,
              span: 6,
            },
            {
              label: "浸泡时间",
              prop: "soaktime",
              disabled: true,
              span: 6,
            },
            {
              label: "标签数量",
              prop: "labelnum",
              disabled: true,
              span: 6,
            },
            {
              label: "备注",
              prop: "remark",
              disabled: true,
              span: 12,
            },
            {
              label: "医生",
              prop: "doctor",
              disabled: true,
              span: 6,
            },
            {
              label: "医生脚注",
              prop: "footnote",
              disabled: true,
              span: 6,
            },
            {
              label: "下单时间",
              prop: "ordertime",
              disabled: true,
              span: 6,
            },
            {
              label: "处方状态",
              prop: "curstate",
              disabled: true,
              span: 6,
            },
            {
              label: "煎药方式",
              prop: "decmothed",
              disabled: true,
              span: 6,
            },
            {
              label: "服用方法",
              prop: "takeway",
              disabled: true,
              span: 6,
            },
            {
              label: "服用方式",
              prop: "takemethod",
              disabled: true,
              span: 6,
            },
            {
              label: "备注A",
              prop: "remarkA",
              disabled: true,
              span: 6,
            },
            {
              label: "备注B",
              prop: "remarkB",
              disabled: true,
              span: 6,
            },
            {
              label: "药品总量",
              prop: "drugCount",
              disabled: true,
              span: 6,
            },
            {
              label: "是否代煎",
              prop: "isDaijian",
              disabled: true,
              span: 6,
            },
            {
              label: "支付方式",
              prop: "payment",
              disabled: true,
              span: 6,
            },
            {
              label: "医嘱",
              prop: "yizhu",
              disabled: true,
              span: 6,
            },
            {
              label: "金额",
              prop: "money",
              disabled: true,
              span: 6,
            },
            {
              label: "病历号，健康卡号，病人ID，社保号，门诊号",
              prop: "outpatientNumber",
              disabled: true,
              span: 12,
              labelWidth: 300,
            },
            {
              label: "序号",
              prop: "outpatientIndex",
              disabled: true,
              span: 6,
            },
            {
              label: "处方类型",
              prop: "ptype",
              disabled: true,
              span: 6,
            },
            {
              label: "身份验证",
              prop: "token",
              disabled: true,
              span: 6,
            },
          ],
        },
        listOption: {
          height: "auto",
          calcHeight: 30,
          tip: false,
          border: true,
          index: true,
          viewBtn: false,
          menu: false,
          page: false,
          header: false,
          dialogClickModal: false,
          menuBtn: false,
          column: [{
            label: "委托单号",
            prop: "delnum",
            disabled: true,
          },
            {
              label: "药品编号",
              prop: "drugnum",
              disabled: true,
            },
            {
              label: "药品名称",
              prop: "drugname",
              disabled: true,
            },
            {
              label: "规格",
              prop: "drugposition",
              disabled: true,
            },
            {
              label: "单剂量",
              prop: "drugallnum",
              disabled: true,
            },
            {
              label: "药品脚注",
              prop: "drugdescription",
              disabled: true,
            },
            {
              label: "贴数",
              prop: "tienum",
              disabled: true,
            },
            {
              label: "总剂量",
              prop: "drugweight",
              disabled: true,
            },
            {
              label: "说明",
              prop: "description",
              disabled: true,
            },
            {
              label: "单价",
              prop: "retailprice",
              disabled: true,
            },
          ],
        },
        grainOption: {
          height: "auto",
          calcHeight: 30,
          tip: false,
          border: true,
          index: true,
          viewBtn: false,
          selection: true,
          dialogClickModal: false,
          menuBtn: false,
          column: [{
            label: "订单ID",
            prop: "orderId",
            disabled: true,
            span: 6,
          },
            {
              label: "处方编号",
              prop: "presId",
              disabled: true,
              span: 6,
            },
            {
              label: "患者姓名",
              prop: "name",
              disabled: true,
              span: 6,
            },
            {
              label: "患者性别",
              prop: "sex",
              disabled: true,
              span: 6,
            },
            {
              label: "患者年龄",
              prop: "age",
              disabled: true,
              span: 6,
            },
            {
              label: "详细年龄",
              prop: "detailedAge",
              disabled: true,
              span: 6,
            },
            {
              label: "患者联系电话",
              prop: "tele",
              disabled: true,
              span: 6,
            },
            {
              label: "患者联系地址",
              prop: "address",
              disabled: true,
              span: 6,
            },
            {
              label: "处方类型",
              prop: "isInpatient",
              disabled: true,
              span: 6,
            },
            {
              label: "住院处方床号信息",
              prop: "hospitalBedNo",
              disabled: true,
              span: 6,
            },
            {
              label: "就诊卡号",
              prop: "visitingCard",
              disabled: true,
              span: 6,
            },
            {
              label: "处方付数",
              prop: "quantity",
              disabled: true,
              span: 6,
            },
            {
              label: "分服次数",
              prop: "separateFrequency",
              disabled: true,
              span: 6,
            },
            {
              label: "医生姓名",
              prop: "doctorName",
              disabled: true,
              span: 6,
            },
            {
              label: "科室名称",
              prop: "departmentName",
              disabled: true,
              span: 6,
            },
            {
              label: "处方名称",
              prop: "presName",
              disabled: true,
              span: 6,
            },
            {
              label: "处方开具时间",
              prop: "presTime",
              disabled: true,
              span: 6,
            },
            {
              label: "处方创建人姓名",
              prop: "creater",
              disabled: true,
              span: 6,
            },
            {
              label: "处方划价员姓名",
              prop: "valuerName",
              disabled: true,
              span: 6,
            },
            {
              label: "处方划价时间",
              prop: "valuationTime",
              disabled: true,
              span: 6,
            },
            {
              label: "挂单号",
              prop: "registerId",
              disabled: true,
              span: 6,
            },
            {
              label: "处方缴费类型",
              prop: "paymentType",
              disabled: true,
              span: 6,
            },
            {
              label: "缴费状态",
              prop: "paymentStatus",
              disabled: true,
              span: 6,
            },
            {
              label: "处方单付价格",
              prop: "unitPrice",
              disabled: true,
              span: 6,
            },
            {
              label: "处方总价",
              prop: "total",
              disabled: true,
              span: 6,
            },
            {
              label: "对应明细表条数",
              prop: "drugCount",
              disabled: true,
              span: 6,
            },
            {
              label: "处方备注说明",
              prop: "remarks",
              disabled: true,
              span: 6,
            },
            {
              label: "处方使用方法",
              prop: "usageMethod",
              disabled: true,
              span: 6,
            },
          ],
        },
        listOption1: {
          height: "auto",
          calcHeight: 30,
          tip: false,
          border: true,
          index: true,
          viewBtn: false,
          menu: false,
          page: false,
          header: false,
          dialogClickModal: false,
          menuBtn: false,
          column: [{
            label: "处方ID",
            prop: "presId",
            disabled: true,
          },
            {
              label: "颗粒序号",
              prop: "drugNo",
              disabled: true,
            },
            {
              label: "院方库颗粒名称",
              prop: "drugName",
              disabled: true,
            },
            {
              label: "院库颗粒编号",
              prop: "drugId",
              disabled: true,
            },
            {
              label: "颗粒批号",
              prop: "batchNumber",
              disabled: true,
            },
            {
              label: "饮片剂量",
              prop: "doseHerb",
              disabled: true,
            },
            {
              label: "当量",
              prop: "equivalent",
              disabled: true,
            },
            {
              label: "颗粒剂量",
              prop: "dose",
              disabled: true,
            },
            {
              label: "药品饮片单价",
              prop: "herbPrice",
              disabled: true,
            },
            {
              label: "药品颗粒单价",
              prop: "dosePrice",
              disabled: true,
            },
            {
              label: "品种备注",
              prop: "remarks",
              disabled: true,
            },
          ],
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
          column: [{
            label: "医院名称",
            prop: "hospitalId",
            type: "select",
            disabled: true,
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
              disabled: true,
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              required: true,
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=order_status",
              trigger: "blur"
            },


            {
              label: "订单类型",
              prop: "orderType",
              type: "select",
              disabled: true,
              props: {
                label: 'dictValue',
                value: 'dictKey'
              },
              required: true,
              dicUrl: "/api/blade-system/dict-biz/dictionary?code=order_type",
              trigger: "blur"
            },
            {
              label: "收货地址",
              prop: "address",
              disabled: true,
              rules: [{
                required: true,
                message: "请输入收货地址",
                trigger: "blur"
              }]
            },
            {
              label: "收件人",
              prop: "addressee",
              disabled: true,
              rules: [{
                required: true,
                message: "请输入收件人",
                trigger: "blur"
              }]
            },
            {
              label: "收件人电话",
              prop: "addresseePhone",
              disabled: true,
              rules: [{
                required: true,
                validator: phonelength,
                trigger: 'blur'
              }]
            },
            {
              label: "订单时间",
              prop: "orderTime",
              disabled: true,
              type: 'datetime',
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
            },
            {
              label: "总价",
              prop: "totalPrices",
              disabled: true,
              rules: [{
                required: true,
                message: "请输入总价",
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
          addBtn: this.vaildData(this.permission.order_add, false),
          viewBtn: this.vaildData(this.permission.order_view, false),
          delBtn: this.vaildData(this.permission.order_delete, false),
          editBtn: this.vaildData(this.permission.order_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
      rowSave(row, done, loading) {
        add(row).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        }, error => {
          loading();
          window.console.log(error);
        });
      },
      rowUpdate(row, index, done, loading) {
        update(row).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        }, error => {
          loading();
          console.log(error);
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getDetail(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        done();
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
      onLoad(page, params = {}) {
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      },
      //确认选择
      selectDrugBtn() {
        console.log(this.drugList.selectionList);
        this.addInfo.blenderDetailsList = this.drugList.selectionList
        this.addInfo.decoctingDrugList = this.drugList.selectionList
        this.selectDrugDialogVisible = false
        this.$refs.crud.toggleSelection();
      },
      //取消
      reject() {
        this.$refs.crud.toggleSelection();
        this.addDialogVisible = false
      },
      //清空选择
      toggleSelection() {
        this.$refs.crud.toggleSelection();
      },
      //选择药品
      selectDrug() {
        this.selectDrugDialogVisible = true
      },
      //新增
      newAdd() {
        console.log(this.addDialogVisible)
        this.addDialogVisible = true
      },
      //抓药
      prescription() {
        this.$message({
          type: "success",
          message: "抓药",
        });
        this.dialogVisible = false
      },
      lockInfo(row) {
        console.log(row);
        let par = {
          url: "",
          params: {
            orderId: row.id
          }
        }
        this.orderType = row.orderType
        if (row.orderType == "1") {
          par.url = "/api/taocao-order/order/blenderSelectByOrderId"
        } else if (row.orderType == "2") {
          par.url = "/api/taocao-order/order/decoctingSelectByOrderId"
        }
        this.dialogVisible = true;
        console.log(par);
        getInfo(par).then(res => {
          console.log(res);
          this.orderInfo = res.data.data;
          console.log(this.orderInfo);
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
        console.log(page);
        console.log(params);
        console.log(this.drugList.query);
        getDrugList(page.currentPage, page.pageSize, Object.assign(params, this.drugList.query)).then(res => {
          console.log(res);
          const data = res.data.data;
          data.records.forEach((value) => {
            value.tienum = 0
          })
          this.drugList.page.total = data.total;
          this.drugList.data = data.records;
          this.drugList.loading = false;
          this.drugSelectionClear();
        });
      }
    }
  };
</script>

<style>
</style>
