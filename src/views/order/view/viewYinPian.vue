<template>
  <basic-container>
    <avue-form ref="addForm" v-model="orderInfo.form" :option="viewOption"></avue-form>
    <avue-crud ref="crud" :option="option" :data="orderInfo.drugList">
    </avue-crud>
  </basic-container>
</template>

<script>

export default {
  name: "viewYinPian",
  props: ['orderInfo'],
  data(){
    return {
      option:{
        addBtn:false,
        editBtn:false,
        addRowBtn:false,
        cellBtn:false,
        menu:false,
        column: [
          {
            label: '*药品',
            prop: "drugName",
            width: 130,
          },
          {
            label: "单剂量/g",
            prop: "drugAllnum",
          },
          {
            label: "药品脚注",
            prop: "drugDescription",
          },
          {
            label: "说明",
            prop: "description",
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
          }


        ],
      },
    }
  },
  methods:{

  }
}
</script>

<style>

</style>
