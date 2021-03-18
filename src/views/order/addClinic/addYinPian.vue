<template>
  <basic-container>
    <avue-form ref="addForm" v-model="form" :option="addOption"></avue-form>
    <avue-crud ref="crud" :option="option" :data="data" @row-update="addUpdate" @row-click="handleRowClick">

      <template slot="goodsName" slot-scope="scope">
        <el-select
          size="small"
          v-model="scope.row.goodsName"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          @change="getPrice(scope.row.goodsName,scope.index)"
          :data-index="scope.index"
          :loading="loading">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.goodsName"
            :value="item.id">
          </el-option>
        </el-select>
      </template>


      <template slot="menuLeft">
        <el-button @click="addRow" size="small">添加5条</el-button>
        <el-button @click="addXdf" size="small">增加协定方</el-button>
      </template>
      <template slot="menu" slot-scope="{row,index,size,type}">
        <el-button @click="addBreakRow(index)" :size="size" :type="type">向上添加</el-button>
        <el-button @click="addNextRow(index)" :size="size" :type="type">向下添加</el-button>
      </template>
    </avue-crud>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="bcBtn()">保 存</el-button>
            <el-button type="primary" @click="reject()">取 消</el-button>
          </span>
        </div>
      </el-col>
    </el-row>
  </basic-container>
</template>

<script>

import {isOneToNinetyNine, phonelength, zhongwen} from "@/const/order/customerorder";
import {getGoodsDetail, likeListYP} from "@/api/warehouse/goods";
import {clinicReceiveBlender, clinicReceiveDecoctingSave} from "@/api/order/order";
import {getSelectListByDrug} from "@/api/parties/orderpartiesdrug";


export default {
  name: "addYinPian",
  data() {
    return {
      data: [],
      options: [],
      value: "",
      list: [],
      loading: false,
      option: {
        addBtn: false,
        editBtn: false,
        addRowBtn: true,
        cellBtn: true,
        column: [
          {
            label: '*药品',
            prop: "goodsName",
            slot: true,
          },
          /* type: 'select',
           filterable: true,
           remote: true,
           cell: true,
           rules: [{
             require: true,
             message: '请选择商品',
           }],
           props: {
             label: 'goodsName',
             value: 'id'
           },
           dicUrl: '/api/erp-wms/goods/likeListYP',
           change: ({value}) => {
             if (value) {
               getGoodsDetail(value).then(res => {
                 for (let i = 0; i < this.data.length; i++) {
                   if (this.data[i].goodsName === value) {
                     this.data[i].unitPrice = res.data.data.unitPrice;
                   }
                 }
               });
             }
           },
         },*/
          {
            label: "单剂量",
            prop: "drugAllnum",
            cell: true
          },
          {
            label: "总剂量",
            prop: "drugweight",
            cell: true
          },
          {
            label: "药品脚注",
            prop: "drugDescription",
            cell: true
          },
          {
            label: "说明",
            prop: "description",
            cell: true
          },
          {
            label: "单价",
            prop: "unitPrice",
            disabled: true,
          },
        ]
      },
      //煎药
      addOption: {
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
                label: "医生姓名",
                prop: "doctor",
                span: 6,
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
                maxlength: 11,
                showWordLimit: true,
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
                rules: [{
                  required: true,
                  trigger: 'blur',
                  message: "请输入地址",
                }],
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
                label: "贴数",
                prop: "dose",
                span: 6,
                rules: [{
                  required: true,
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
                  required: true,
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
              {
                label: "特殊处方",
                prop: "isrepetition",
                span: 6,
                type: 'select',
                props: {
                  label: 'dictValue',
                  value: 'dictKey'
                },
                dicUrl: "/api/blade-system/dict-biz/dictionary?code=isrepetition"
              },
              {
                label: "特殊群体",
                prop: "particular",
                span: 6,
                type: 'select',
                props: {
                  label: 'dictValue',
                  value: 'dictKey'
                },
                dicUrl: "/api/blade-system/dict-biz/dictionary?code=particular"
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
          },
          {
            icon: 'el-icon-info',
            label: '协定方',
            collapse: true,
            prop: 'group3',
            column: [
              {
                label: "协定方类型",
                prop: "partiesCategory",
                type: 'tree',
                labelWidth: 130,
                rules: [{
                  message: "请选择协定方类型",
                  trigger: "blur"
                }],
                props: {
                  label: 'title',
                  value: 'id'
                },
                //search: true,
                // cascaderItem: ['partiesName'],
                dicUrl: "/api/parties/orderpartiescategory/tree",
              },
              {
                label: "协定方名称",
                prop: "partiesName",
                type: "tree",
                labelWidth: 130,
                props: {
                  label: 'partiesName',
                  value: 'id'
                },
                //dicFlag: false,
                dicUrl: '/api/parties/orderparties/selectByYp',
              },
            ],
          },
        ],
      },
    }
  },
  created() {
    this.optionsData();
  },
  mounted() {

  },

  methods: {
    optionsData() {
      likeListYP().then(res => {
        this.options = res.data.data;
      })
    },
    getPrice(val, index) {
      getGoodsDetail(val).then(res => {
        console.log(res.data.data);
        this.data[index].unitPrice = res.data.data.unitPrice;
      });
      console.log(this.data);
    },
    addUpdate(form, index, done, loading) {
      done();
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        console.log(query);
        setTimeout(() => {
          this.loading = false;
          likeListYP(query).then(res => {
            this.options = res.data.data;
          })
        }, 200);
      } else {
        this.options = [];
      }
    },
    addRow() {
      this.$message.success('正在添加，请稍后')
      setTimeout(() => {
        for (let i = 0; i < 5; i++) {
          this.$refs.crud.rowCellAdd({
            goodsName: '',
          });
        }
      }, 500)
    },
    addXdf() {
      //获取值然后进行查询
      this.$message.success('正在添加，请稍后')
      setTimeout(() => {
        let leibieID = this.form.partiesName;
        getSelectListByDrug(leibieID).then(res => {
          let data = res.data.data;
          console.log(res)
          for (let i = 0; i < data.length; i++) {
            this.$refs.crud.rowCellAdd({
              goodsName: data[i].goodsId,
              drugAllnum: data[i].consumption,
              unitPrice: data[i].goodsPrice,
            });
          }
        });
      }, 500)
    },
    addNextRow(index) {
      this.data.splice(index + 1, 0, {
        $cellEdit: true
      })
    },
    addBreakRow(index) {
      this.data.splice(index == 0 ? 0 : (index - 1), 0, {
        $cellEdit: true
      })
    },
    handleRowClick(row, event, column) {
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
              params = this.form;
              params.orderType = 'jianyao';
              params.drugList = this.data;
              clinicReceiveDecoctingSave(params).then(res => {
                if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: res.data.msg,
                  })
                  this.$refs.addForm.resetForm();
                  this.data = []
                  this.form = {};
                  this.$emit("reject");
                } else {
                  this.$message({
                    type: "error",
                    message: res.data.msg
                  })
                  callback();
                }
              });
            }).catch(() => {
            callback();
          })
        }
      })
    },
    //取消
    reject() {
      this.$emit("reject");
    },


  }
}
</script>

<style scoped>

</style>
