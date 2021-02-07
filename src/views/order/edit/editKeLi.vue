<template>
  <basic-container>
    <avue-form ref="addForm" v-model="orderEdit.form" :option="editOption"></avue-form>
    <avue-crud ref="crud" :option="option" :data="orderEdit.drugList">

      <template slot="drugId" slot-scope="scope">
        <el-select
          size="small"
          v-model="scope.row.drugId"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          @change="getPrice(scope.row.drugId,scope.index)"
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
        <el-button @click="addXdf" size="small">添加协定方</el-button>
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
            <el-button type="primary" @click="xgBtn()">修 改</el-button>
            <el-button type="primary" @click="reject()">取 消</el-button>
          </span>
        </div>
      </el-col>
    </el-row>
  </basic-container>
</template>

<script>

import {getGoodsDetail, likeListKL} from "@/api/warehouse/goods";
import {getSelectListByDrug} from "@/api/parties/orderpartiesdrug";

export default {
  name: "editKeLi",
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
        addRowBtn: true,
        menuWidth: 250,
        cellBtn: true,
        column: [
          {
            label: 'id',
            prop: "id",
          },
          {
            label: '*商品',
            prop: "drugId",
            slot: true,
          },
          {
            label: "单剂量/g",
            prop: "doseHerb",
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
        editBtn:false,
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
                search: true,
              },
              {
                label: "收件人电话",
                prop: "addresseePhone",
                labelWidth: 100,
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
                search: true,
              },
              {
                label: "患者性别",
                prop: "sex",
                type: "select",
                span: 6,
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
                labelWidth: 110,
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
                // search: true,
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
                dicUrl: '/api/parties/orderparties/selectByName',
              },

            ],
          },
        ],
      },
    }
  },
  methods:{
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
              doseHerb: data[i].consumption,
              unitPrice: data[i].goodsPrice,
            });
          }
        });
      }, 500)
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
          likeListKL(query).then(res => {
            this.options = res.data.data;
          })
        }, 200);
      } else {
        this.options = [];
      }
    },

    //取消
    reject() {
      this.$emit("reject");
    },
  },

}
</script>


<style scoped>

</style>
