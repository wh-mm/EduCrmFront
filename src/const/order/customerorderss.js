


export const phonelength = (rule, value, callback) => {
  if (value.length != 11) {
    callback(new Error('请输入正确手机号'));
  } else {
    callback();
  }
};

export function isInteger(rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'));
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入正整数'));
    } else {
      const re = /^[0-9]*[1-9][0-9]*$/;
      const rsCheck = re.test(value);
      if (!rsCheck) {
        callback(new Error('请输入正整数'));
      } else {
        callback();
      }
    }
  }, 0);
}

export function isOneToNinetyNine(rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'));
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入正确年龄'));
    } else {
      const re = /^([1-9]|[1-9]\d|1\d{2}|200)$/;
      const rsCheck = re.test(value);
      if (!rsCheck) {
        callback(new Error('请输入正整数，值为1-200'));
      } else {
        callback();
      }
    }
  }, 0);
}

export const zhongwen = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入姓名'))
  }
  if (!/^[\u0391-\uFFE5A-Za-z]+$/.test(value)) {
    callback(new Error('不可输入特殊字符'))
  } else {
    callback()
  }
}

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
            trigger: "blur",
          }],
        },
        {
          label: "次数",
          prop: "takenum",
          span: 6,
          row: true,
          rules: [{
            trigger: "blur",
          }],
        },
        {
          label: "包装量",
          prop: "packagenum",
          span: 6,
          rules: [{
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
    },
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
          span: 6,
          rules: [{
            required: true,
            validator: zhongwen,
          }],

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
        /*{
          label: "收货地址",
          prop: "dtbaddress",
          rules: [{
            required: true,
            message: "请输入收货地址",
            trigger: "blur",
          },],
          span: 6,
        },*/
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
          /*props: {
            label: "dictValue",
            value: "dictKey"
          },
          dicUrl: "/api/blade-system/dict-biz/dictionary?code=prescription_payment"*/
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
        labelWidth: 110,
        column: [
          {
            label: '药品详情',
            prop: 'dynamic',
            type: 'dynamic',
            span:24,
            children: {
              align: 'center',
              headerAlign: 'center',
              rowAdd:(done)=>{
                //this.$message.success('新增回调');
                done({
                  input:'默认值'
                });
              },
              rowDel:(row,done)=>{
              //  this.$message.success('删除回调'+JSON.stringify(row));
                done();
              },
              column: [
                {
                  label: '*商品',
                  prop: "goodsId",
                  type: 'tree',
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
             /*     cascaderItem: ['batchNumber'],*/
                  /*dicMethod:'post',*/
                  // dicUrl:'/api/erp-wms/goods/selecListGoods',
                  dicUrl: '/api/erp-wms/goods/selecListGoodsByTypeYP',
                  change: ({value}) => {
                    if (value) {
                      getGoodsDetail(value).then(res => {

                        this.obj.unitPrice=res.data.data.unitPrice;
                      });
                    }
                  },
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
              ]
            }
          },

        ]
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
      label: "单剂量",
      prop: "doseHerb",
      slot: true,
    },
   /* {
      label: "当量",
      prop: "equivalent",
      slot: true,
    },*/
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
 /*   {
      label: "次数",
      prop: "tienum",
      slot: true,
    },*/
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
      label: "单剂量",
      prop: "doseHerb",
      slot: true,
    },
   /* {
      label: "当量",
      prop: "equivalent",
      slot: true,
    },*/
    {
      label: "单价",
      prop: "unitPrice",
    },
  ],
};


