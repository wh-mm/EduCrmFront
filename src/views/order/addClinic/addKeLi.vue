<template>
  <basic-container>
    <avue-form ref="addForm" v-model="form" :option="addOption"></avue-form>
    <avue-crud ref="crud" :option="option" :data="data" @row-update="addUpdate">
      <template slot="menuLeft">
        <el-button @click="addRow" size="small">添加5条</el-button>
        <el-button @click="addXdf" size="small">添加协定发</el-button>
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

import {isOneToNinetyNine, phonelength, zhongwen,isInteger} from "@/const/order/customerorder";
import {getGoodsDetail} from "@/api/warehouse/goods";
import {clinicReceiveBlender} from "@/api/order/order";
import {getSelectListByDrug} from "@/api/parties/orderpartiesdrug";

export default {
  name: "addKeLi",
  data(){
    return {
      data:[
      ],
      option:{
        addBtn:false,
        editBtn:false,
        addRowBtn:true,
        cellBtn:true,
        menuWidth:250,
        column: [
          {
            label: '*药品',
            prop: "goodsName",
            type: 'tree',
            filterable: true,
            remote: true,
            rules: [{
              require: true,
              message: '请选择商品',
            }],
            props: {
              label: 'goodsName',
              value: 'id'
            },
            dicUrl: '/api/erp-wms/goods/likeListKL',
            change: ({value}) => {
              if (value) {
                getGoodsDetail(value).then(res => {
                  for (let i = 0; i<this.data.length; i++){
                    if(this.data[i].goodsName === value){
                      this.data[i].unitPrice = res.data.data.goodsPrice;
                    }
                  }
                });
              }
            },
          },
          {
            label: "单剂量",
            prop: "doseHerb",
            cell: true,
          },
          {
            label: "单价",
            prop: "unitPrice",
            disabled:true,
          },
        ]
      },
      //煎药
      addOption :{
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
                label: "处方付数（几副药）",
                prop: "quantity",
                span: 6,
                rules: [{
                  required: true,
                  validator: isInteger,
                  trigger: 'blur'
                }],
              },
              {
                label: "日服（每日吃几次）",
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
          {
            icon: 'el-icon-info',
            label: '药方信息',
            collapse: true,
            prop: 'group1',
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
                search: true,
                cascaderItem: ['partiesName'],
                dicUrl: "/api/parties/orderpartiescategory/tree",
              },
              {
                label: "协定方名称",
                prop: "partiesName",
                type: "select",
                labelWidth: 130,
                props: {
                  label: 'partiesName',
                  value: 'id'
                },
                dicFlag: false,
                dicUrl: '/api/parties/orderparties/selectByPrescriptionCategoryID?partiesCategory={{key}}',
              },

            ],
          },

        ],
      },
    }
  },
  methods:{
    addUpdate(form,index,done,loading){
      done();
    },
    addXdf() {
      //获取值然后进行查询
      this.$message.success('正在添加，请稍后')
      setTimeout(() => {
        let leibieID = this.form.partiesName;
        getSelectListByDrug(leibieID).then(res => {
          let data = res.data.data;
          console.log(res)
          console.log(data)
          for (let i = 0; i < data.length; i++) {
            this.$refs.crud.rowCellAdd({
              goodsName: data[i].goodsId,
              doseHerb: data[i].consumption,
              unitPrice: data[i].goodsPrice,
            });
          }
        });
      }, 500)
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
    addNextRow(index){
      this.data.splice(index+1,0,{
        $cellEdit:true
      })
    },
    addBreakRow(index){
      this.data.splice(index==0?0:(index-1),0,{
        $cellEdit:true
      })
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
              params.orderType = 'tiaopei';
              params.drugList = this.data;
              clinicReceiveBlender(params).then(res => {
                if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: res.data.msg,
                  })
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
