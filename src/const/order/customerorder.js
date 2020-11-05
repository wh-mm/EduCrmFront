export const phonelength = (rule, value, callback) => {
  if (value.length != 11) {
    callback(new Error('请输入正确手机号'));
  } else {
    callback();
  }
};

export const newAddDrugOption = {
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
        {
          label: "处方号",
          prop: "pspnum",
          span: 6,
          rules: [{
            required: true,
            message: "请选择医院",
            trigger: "blur",
          }],
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
          label: "医嘱",
          prop: "yizhu",
          span: 6,
        },
        {
          label: "药品总量",
          prop: "drugCount",
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
            message: "请选择医院",
            trigger: "blur",
          }],
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
            message: "请输入年龄",
            trigger: "blur",
          },
            {min: 0, max: 200, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ],
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
            message: "请填写贴数",
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
            message: "请填写次数",
            trigger: "blur",
          }],
        },
        {
          label: "包装量",
          prop: "packagenum",
          span: 6,
          rules: [{
            required: true,
            message: "请填写包装量",
            trigger: "blur",
          }],
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
}

export const newAddGrainOption = {
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
          labelWidth: 100,
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
          label: "处方付数",
          prop: "quantity",
          span: 6,
          type: "select",
          props: {
            label: "dictValue",
            value: "dictKey"
          },
          dicUrl: "/api/blade-system/dict-biz/dictionary?code=prescription_plural"
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
      ]
    },
  ],
}

export const newAddListOption = {
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
      label: "规格",
      prop: "unit",
      width: 120,
    },
    {
      label: "单剂量",
      prop: "drugAllnum",
      slot: true,
    },

    {
      label: "贴数",
      prop: "tienum",
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
    },
  ],
};

export const newAddDrugListOption = {
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
      label: "规格",
      prop: "unit",
      width: 120,
    },
    {
      label: "单剂量",
      prop: "drugAllnum",
      slot: true,
    },

    {
      label: "次数",
      prop: "tienum",
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
    },
  ],
};

export const newAddBlenderListOption = {
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
      label: "饮片剂量",
      prop: "doseHerb",
      slot: true,
    },
    {
      label: "当量",
      prop: "equivalent",
      slot: true,
    },
    {
      label: "单价",
      prop: "unitPrice",
    },
  ],
};

export const viewDrugListOption = {
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
      prop: "drugName",
    },
    {
      label: "规格",
      prop: "unit",
      width: 120,
    },
    {
      label: "单剂量",
      prop: "drugAllnum",
      slot: true,
    },

    {
      label: "次数",
      prop: "tienum",
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
    },
  ],
};

export const viewAddBlenderListOption = {
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
      prop: "drugName",
    },
    {
      label: "饮片剂量",
      prop: "doseHerb",
      slot: true,
    },
    {
      label: "当量",
      prop: "equivalent",
      slot: true,
    },
    {
      label: "单价",
      prop: "unitPrice",
    },
  ],
};

export const option = {
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
      required: true,
      dicUrl: "/api/blade-system/dict-biz/dictionary?code=order_type",
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
      }]
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
      prop: "orderTime",
      type: 'datetime',
      format: "yyyy-MM-dd HH:mm:ss",
      valueFormat: "yyyy-MM-dd HH:mm:ss",
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
}
