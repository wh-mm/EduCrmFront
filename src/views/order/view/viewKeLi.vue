<template>
  <basic-container>
    <avue-form ref="addForm" v-model="orderInfo.form" :option="viewOption"></avue-form>
    <avue-crud ref="crud" :option="option" :data="orderInfo.drugList">
    </avue-crud>
  </basic-container>
</template>

<script>

export default {
  name: "viewKeLi",
  props: ['orderInfo'],
  data(){
    return {
      option:{
        addBtn:false,
        editBtn:false,
        addRowBtn:false,
        cellBtn:false,
        delBtn:false,
        menu:false,
        column: [
          {
            label: '*药品',
            prop: "drugName",
          },
          {
            label: "*单剂量/g",
            prop: "doseHerb",
          },
          {
            label: "单价",
            prop: "unitPrice",
          },
        ]
      },
      //煎药
      viewOption :{
        detail: true,
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
        ],
      },
    }
  },
  methods:{
  }
}
</script>

<style scoped>

</style>
