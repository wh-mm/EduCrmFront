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
      </template>

      <template slot-scope="scope" slot="menu">
        <el-button type="text" icon="el-icon-view" size="small" @click.stop="lockInfo(scope.row)">查 看</el-button>
        <!-- <el-button type="text" icon="el-icon-check" size="small" @click.stop="prescription()">抓 药</el-button>-->
      </template>
    </avue-crud>
<!--    <el-dialog title="药品列表" :visible.sync="selectDrugDialogVisible" width="80%" :modal="false"
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
    </el-dialog> -->
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
     <avue-form ref="addCrud" v-model="addInfo.drugList" :option="addCrudOption">
     </avue-form>
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
          {{ scope.row.drugAllnum }}
        </template>
        <template slot="tienum" slot-scope="scope">
          {{ scope.row.tienum }}
        </template>
        <template slot="drugweight" slot-scope="scope">
          {{ scope.row.tienum * scope.row.drugAllnum }}
        </template>
        <template slot="drugDescription" slot-scope="scope">
          {{ scope.row.drugDescription }}
        </template>
        <template slot="description" slot-scope="scope">
          {{ scope.row.description }}
        </template>
        <template slot="doseHerb" slot-scope="scope">
          {{ scope.row.doseHerb }}
        </template>
        <template slot="equivalent" slot-scope="scope">
          {{ scope.row.equivalent }}
        </template>
      </avue-crud>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="prescription()">抓 药</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  getInfo,
  getList,
  clinicReceiveBlender,
  clinicReceiveDecoctingSave,
  selectListByDrugCategory
} from "@/api/order/order";
import {mapGetters} from "vuex";
import {getGoodsDetail} from "@/api/warehouse/goods";
import {isOneToNinetyNine, phonelength, zhongwen} from "../../const/order/customerorder";
/*import {
  newAddBlenderListOption,
  newAddDrugListOption,
  newAddDrugOption,
  newAddGrainOption,
  option,
  viewAddBlenderListOption,
  viewDrugListOption
} from "@/const/order/customerorderss"*/

export default {
  data() {
    return {
      selectDrugDialogVisible: false,
      activeName: 'jianyao',
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
        column: [
          {
            label: "订单id",
            prop: "id",
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
            rules: [{
              required: true,
              validator: phonelength,
              trigger: 'blur'
            }],
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
            search: true,
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
      //煎药
      newAddDrugOption :{
        height: "auto",
        calcHeight: 30,
        tip: false,
        border: true,
        index: true,
        viewBtn: false,
        selection: true,
        dialogClickModal: false,
        menuBtn: false,
        group: [
          {
            icon: 'el-icon-info',
            label: '基本信息',
            collapse: true,
            prop: 'group1',
            column: [
              {
                label: "医院名称",
                prop: "hospitalId",
                type: "select",
                props: {
                  label: "hospitalName",
                  value: "id"
                },
                rules: [{
                  required: true,
                  message: "请选择医院",
                  trigger: "blur",
                }],
                span: 6,
                search: true,
                dicUrl: "/api/taocao-hisHospital/hospital/selectHosptal"
              },
              /* {
                 label: "处方号",
                 prop: "pspnum",
                 span: 6,
                 rules: [{
                   required: true,
                   message: "请输入处方号",
                   trigger: "blur",
                 }],
               },*/
              {
                label: "医生姓名",
                prop: "doctor",
                span: 6,
                rules: [{
                  required: true,
                  validator: zhongwen,
                }],
              },
              {
                label: "医生脚注",
                prop: "footnote",
                span: 6,
              },
              {
                label: "医嘱",
                prop: "yizhu",
                span: 6,
              },

            ]
          },
          {
            icon: 'el-icon-info',
            label: '患者信息',
            collapse: true,
            prop: 'group2',
            column: [
              {
                label: "患者姓名",
                prop: "name",
                span: 6,
                rules: [{
                  required: true,
                  validator: zhongwen,
                }],
                search: true,
              },
              {
                label: "性别",
                prop: "sex",
                span: 6,
                rules: [{
                  required: true,
                  message: "请选择性别",
                  trigger: "blur",
                }],
                type: "select",
                props: {
                  label: "dictValue",
                  value: "dictKey"
                },
                dicUrl: "/api/blade-system/dict-biz/dictionary?code=sex_a"
              },
              {
                label: "年龄",
                prop: "age",
                span: 6,
                rules: [{
                  required: true,
                  validator: isOneToNinetyNine,

                },
                  {min: 0, max: 200, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                ],
              },
              {
                label: "电话",
                prop: "phone",
                span: 6,
                rules: [{
                  required: true,
                  validator: phonelength,
                  trigger: 'blur'
                }],
              },
              {
                label: "地址",
                prop: "address",
                span: 6,
                required: true,
                trigger: 'blur'
              },
            ]
          },
          {
            icon: 'el-icon-info',
            label: '煎药信息',
            collapse: true,
            prop: 'group3',
            column: [
              {
                label: "煎药方案",
                prop: "decscheme",
                span: 6,
                rules: [{
                  required: true,
                  message: "请选择煎药方案",
                  trigger: "blur",
                }],
                type: 'select',
                props: {
                  label: 'dictValue',
                  value: 'dictKey'
                },
                dicUrl: "/api/blade-system/dict-biz/dictionary?code=boil_medicine_scheme"
              },
              {
                label: "药品总味数",
                prop: "drugCount",
                span: 6,
                rules: [{
                  message: "药品总味数",
                  trigger: "blur",
                  //validator: isInteger,
                }],
              },
              {
                label: "贴数",
                prop: "dose",
                span: 6,
                rules: [{
                  //required: true,
                  //validator: isInteger,
                  trigger: "blur",
                }],
              },
              {
                label: "次数",
                prop: "takenum",
                span: 6,
                row: true,
                rules: [{
                  //required: true,
                  //validator: isInteger,
                  trigger: "blur",
                }],
              },
              {
                label: "包装量",
                prop: "packagenum",
                span: 6,
                rules: [{
                  //required: true,
                  //validator: isInteger,
                  trigger: "blur",
                }],
              },
              {
                label: "浸泡加水量(ml)",
                labelWidth: 130,
                prop: "soakwater",
                span: 6,
              },
              {
                label: "浸泡时间(分)",
                labelWidth: 130,
                prop: "soaktime",
                span: 6,
              },
              {
                label: "煎药方式",
                prop: "decmothed",
                span: 6,
                type: 'select',
                props: {
                  label: 'dictValue',
                  value: 'dictKey'
                },
                dicUrl: "/api/blade-system/dict-biz/dictionary?code=decmothed"
              },
              {
                label: "服用方式",
                prop: "takemethod",
                span: 6,
                type: 'select',
                props: {
                  label: 'dictValue',
                  value: 'dictKey'
                },
                dicUrl: "/api/blade-system/dict-biz/dictionary?code=takemethod"
              },
              {
                label: "服用方法",
                prop: "takeway",
                span: 6,
                type: 'select',
                props: {
                  label: 'dictValue',
                  value: 'dictKey'
                },
                dicUrl: "/api/blade-system/dict-biz/dictionary?code=takeway"
              },
              {
                label: "是否代煎",
                prop: "isDaijian",
                span: 6,
                type: 'select',
                props: {
                  label: 'dictValue',
                  value: 'dictKey'
                },
                dicUrl: "/api/blade-system/dict-biz/dictionary?code=isDaijian"
              },
              {
                label: "加工类型",
                prop: "processtype",
                span: 6,
                type: 'select',
                props: {
                  label: 'dictValue',
                  value: 'dictKey'
                },
                dicUrl: "/api/blade-system/dict-biz/dictionary?code=processing_type"
              },
              {
                label: "处方类型",
                prop: "ptype",
                span: 6,
                type: 'select',
                props: {
                  label: 'dictValue',
                  value: 'dictKey'
                },
                dicUrl: "/api/blade-system/dict-biz/dictionary?code=prescription_type"
              },
            ]
          },
          {
            icon: 'el-icon-info',
            label: '快递信息',
            collapse: true,
            prop: 'group3',
            column: [
              {
                label: "收件方",
                prop: "dtbcompany",
                span: 6,
                rules: [{
                  required: true,
                  validator: zhongwen,
                }],

              },
              {
                label: "收件地址",
                prop: "dtbaddress",
                span: 18,
                required: true,
                message: "请输入收货地址",
                trigger: 'blur'
              },
              {
                label: "联系电话",
                prop: "dtbphone",
                span: 6,
                rules: [{
                  /*validator: phonelength,*/
                  trigger: 'blur'
                }],
              },
              {
                label: "快递类型",
                prop: "dtbtype",
                span: 6,
                type: 'select',
                props: {
                  label: 'dictValue',
                  value: 'dictKey'
                },
                dicUrl: "/api/blade-system/dict-biz/dictionary?code=dtbtype"
              },
            ]
          }


        ],
      },
      //煎药详情
      newAddDrugListOption : {
        labelWidth: 110,
        submitBtn:false,
        column: [
          {
            label: '子表单',
            prop: 'dynamic',
            type: 'dynamic',
            span:24,
            children: {
              align: 'center',
              headerAlign: 'center',
              rowAdd:(done)=>{
     /*           this.$message.success('新增回调');*/
                done({
                  input:'默认值'
                });
              },
              rowDel:(row,done)=>{
/*                this.$message.success('删除回调'+JSON.stringify(row));*/
                done();
              },
              column: [
                {
                  label: '*商品',
                  prop: "goodsName",
                  type: 'select',
                  width: 130,
                  filterable: true,
                  remote: true,
                  display:false,
                  // disabled: true,
                  rules: [{
                    require: true,
                    message: '请选择商品',
                  }],
                  props: {
                    label: 'goodsName',
                    value: 'id'
                  },
                  /*dicMethod:'post',*/
                  dicUrl: '/api/erp-wms/goods/selecListGoodsByTypeYP?name={{key}}',
                  change: ({value}) => {
                    if (value) {
                      getGoodsDetail(value).then(res => {
                        var detail = res.data.data;
                        console.log(detail)
                        let dynamicList=this.addInfo.drugList.dynamic;
                        for (let i = 0; i <dynamicList.length ; i++) {
                          if (value===dynamicList[i].goodsName){
                            dynamicList[i].unitPrice = detail.unitPrice;
                            dynamicList[i].unit = detail.basicUnit;
                          }
                        }
                      });
                    }
                  },
                },
                {
                  label: "规格",
                  prop: "unit",
                  width: 120,
                  disabled:true,

                },
                {
                  label: "单剂量",
                  prop: "drugAllnum",
                  slot: true,
                },
                {
                  label: "总剂量",
                  prop: "drugweight",
                  slot: true,
                },
                {
                  label: "药品脚注",
                  prop: "drugDescription",
                  slot: true,
                },
                {
                  label: "说明",
                  prop: "description",
                  slot: true,
                },
                {
                  label: "单价",
                  prop: "unitPrice",
                  disabled:true,
                },
              ]
            }
          },

        ]
      },

      newAddGrainOption : {
        height: "auto",
        calcHeight: 30,
        tip: true,
        border: true,
        index: true,
        viewBtn: false,
        selection: true,
        dialogClickModal: false,
        menuBtn: false,
        group: [
          {
            icon: 'el-icon-info',
            label: '基本信息',
            collapse: true,
            prop: 'group1',
            column: [
              {
                label: "收件人",
                prop: "addressee",
                span: 6,
                rules: [{
                  required: true,
                  validator: zhongwen,
                }],
                search: true,
              },
              {
                label: "收件人电话",
                prop: "addresseePhone",
                labelWidth: 100,
                rules: [{
                  required: true,
                  validator: phonelength,
                  trigger: 'blur'
                }],
                span: 6,
              },
              {
                label: "快递类型",
                prop: "dtbtype",
                span: 6,
                type: 'select',
                props: {
                  label: 'dictValue',
                  value: 'dictKey'
                },
                dicUrl: "/api/blade-system/dict-biz/dictionary?code=dtbtype"
              },
            ]
          },
              {
                icon: 'el-icon-info',
                label: '患者信息',
                collapse: true,
                prop: 'group1',
                column: [
                  {
                    label: "患者姓名",
                    prop: "name",
                    span: 6,
                    rules: [{
                      required: true,
                      validator: zhongwen,
                    }],
                    search: true,
                  },
                  {
                    label: "患者性别",
                    prop: "sex",
                    type: "select",
                    span: 6,
                    rules: [{
                      required: true,
                      message: "请选择性别",
                      trigger: "blur",
                    }],
                    props: {
                      label: "dictValue",
                      value: "dictKey"
                    },
                    dicUrl: "/api/blade-system/dict-biz/dictionary?code=sex_a"
                  },
                  {
                    label: "患者年龄",
                    prop: "age",
                    span: 6,
                    rules: [{
                      required: true,
                      validator: isOneToNinetyNine,

                    },
                      {min: 0, max: 200, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ],
                  },
                  {
                    label: "详细年龄",
                    prop: "detailedAge",
                    span: 6,
                    rules: [{
                      validator: isOneToNinetyNine,
                    },
                      {min: 0, max: 200, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ],
                  },
                  {
                    label: "患者联系电话",
                    prop: "tele",
                    span: 6,
                    labelWidth: 110,
                    rules: [{
                      required: true,
                      validator: phonelength,
                      trigger: 'blur'
                    }],
                  },
                  {
                    label: "患者联系地址",
                    prop: "address",
                    span: 6,
                    labelWidth: 110,
                  },
                ]
              },
              {
                icon: 'el-icon-info',
                label: '药方信息',
                collapse: true,
                prop: 'group1',
                column: [
                  {
                    label: "处方名称",
                    prop: "presName",
                    span: 6,
                  },
                  {
                    label: "处方付数",
                    prop: "quantity",
                    //type: "select",
                    span: 6,
                    props: {
                    label: "dictValue",
                    value: "dictKey"
                  },
                    dicUrl: "/api/blade-system/dict-biz/dictionary?code=prescription_payment"
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
                    rules: [{
                    //required: true,
                    validator: zhongwen,
                  }],
                  },
                  ]
                 },
             ],
      },

      newAddBlenderListOption : {
        calcHeight: 200,
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
            label: "药品名称",
            prop: "goodsName",
          },
          {
            label: "单剂量",
            prop: "doseHerb",
            slot: true,
          },
          {
            label: "单价",
            prop: "unitPrice",
          },
        ],
      },

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
                clinicReceiveBlender(params).then(res => {
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
                clinicReceiveDecoctingSave(params).then(res => {
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
    //新增 按钮
    newAdd() {
      this.addDialogVisible = true;
      this.tabFrom();
      this.addOption.detail = false;
    },
    tabFrom() {
      if (this.activeName === 'jianyao') {
        this.addOption = Object.assign({}, this.newAddDrugOption);
        this.addCrudOption = Object.assign({}, this.newAddDrugListOption);

      } else if (this.activeName === 'tiaopei') {
        this.addOption = Object.assign({}, this.newAddGrainOption);
        this.addCrudOption = Object.assign({}, this.newAddBlenderListOption);
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
      this.dialogVisible = true;
      if (row.orderType === "jianyao") {
        this.viewOption = Object.assign({}, this.newAddDrugOption);
        this.viewCrudOption = Object.assign({}, this.viewDrugListOption);
        url = "/api/taocao-order/order/decoctingSelectByOrderId"
        setTimeout(() => {
          this.$refs.addForm.updateDic("decscheme");
        }, 20);
      } else if (row.orderType === "tiaopei") {
        this.viewOption = Object.assign({}, this.newAddGrainOption);
        this.viewCrudOption = Object.assign({}, this.viewAddBlenderListOption);
        url = "/api/taocao-order/order/blenderSelectByOrderId"
      } else {
        this.$message({
          type: 'error',
          message: '订单类型不匹配!'
        })
        return;
      }
      this.viewOption.detail = true;
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
