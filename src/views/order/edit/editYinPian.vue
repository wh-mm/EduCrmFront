<template>
  <basic-container>
    <avue-form ref="addForm" v-model="orderEdit.form" :option="editOption"></avue-form>
    <avue-crud ref="crud" :option="option" @row-update="addUpdate" :data="orderEdit.drugList">
      <template slot="menuLeft">
        <el-button @click="addRow" icon="el-icon-circle-plus" size="small">新增</el-button>
<!--        <el-button @click="addXdf" icon="el-icon-s-operation" size="small">添加协定方</el-button>-->
      </template>
      <template slot-scope="{row,index}" slot="menu">
        <el-button type="text" size="small" @click="rowCell(row,index)">{{ row.$cellEdit ? '保存' : '修改' }}</el-button>
        <el-button type="text" size="small" @click="del(row.id)">删 除</el-button>
      </template>
    </avue-crud>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="xgBtn()">修 改</el-button>
            <el-button type="primary" @click="reject()">取 消</el-button>
          </span>
        </div>
      </el-col>
    </el-row>
  </basic-container>
</template>

<script>

import {getSelectListByDrug} from "@/api/parties/orderpartiesdrug";
import {getGoodsDetail, likeListYP} from "@/api/warehouse/goods";
import {iBlenderDelete, updateReceiveDecocting} from "@/api/order/order";

export default {
  name: "editYinPian",
  props: ['orderEdit'],
  data(){
    return {
      data: [],
      options: [],
      value: "",
      list: [],
      form: {},
      selectionList: [],
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      option: {
        addBtn: false,
        editBtn: false,
        addRowBtn: false,
        cellBtn: false,
        delBtn: false,
        column: [
          {
            label: 'id',
            prop: "id",
            hide:true,
          },
          {
            label: '*药品',
            prop: "drugNum",
            cell: true,
            filterable: true,
            remote: true,
            type: 'tree',
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
                  console.log(value);
                  for (let i = 0; i < this.orderEdit.drugList.length; i++) {
                    if (this.orderEdit.drugList[i].drugNum === value) {
                      this.orderEdit.drugList[i].unitPrice = res.data.data.unitPrice;
                      return;
                    }
                  }
                });
              }
            },
          },
          {
            label: "单剂量/g",
            prop: "drugAllnum",
            cell: true,
          },
          {
            label: "药品脚注",
            prop: "drugDescription",
            cell: true,
          },
          {
            label: "说明",
            prop: "description",
            cell: true,
          },
          {
            label: "单价",
            prop: "unitPrice",
          },
        ]
      },
      //煎药
      editOption :{
        detail: false,
        height: "auto",
        calcHeight: 30,
        tip: true,
        border: true,
        index: true,
        viewBtn: false,
        editBtn: false,
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
                span: 6,
                search: true,
                dicUrl: "/api/taocao-hisHospital/hospital/selectHosptal"
              },
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
                row: true,
              },
              {
                label: "包装量",
                prop: "packagenum",
                span: 6,
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
        ],
      },
    }
  },
  methods: {
    rowCell(row, index) {
      this.$refs.crud.rowCell(row, index)
    },
    rowUpdate(form, index, done) {
      this.$message.success(
        '编辑数据' + JSON.stringify(form) + '数据序号' + index
      )
      done()
    },
    addRow() {
      this.$message.success('正在添加，请稍后')
      setTimeout(() => {
        for (let i = 0; i < 1; i++) {
          this.$refs.crud.rowCellAdd({
            drugId: '',
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
    addUpdate(form, index, done, loading) {
      done();
    },
    //修改
    xgBtn(){
      this.$refs.addForm.validate((valid, callback) => {
        if (valid) {
          this.$confirm("请仔细查阅一经保存无法删除！", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              let params = {};
              params = this.orderEdit.form;
              params.orderType = 'jianyao';
              params.drugList = this.orderEdit.drugList;
              updateReceiveDecocting(params).then(res => {
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
    remoteMethod(query) {
      console.log(query)
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
    del(id) {
      console.log(id)
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return iBlenderDelete(id);
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
    //取消
    reject() {
      this.$emit("reject");
    },
  },
  handleRowClick(row, event, column) {
    this.$message({
      showClose: true,
      message: '序号' + row.$index,
      type: 'success',
    });
  }
}
</script>

<style>

</style>
