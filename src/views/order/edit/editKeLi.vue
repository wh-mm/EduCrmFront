<template>
  <basic-container>
    <avue-form ref="addForm" v-model="orderEdit.form" :option="editOption"></avue-form>
    <avue-crud ref="crud" :option="option" @row-update="addUpdate" :data="orderEdit.drugList">
      <template slot="menuLeft">
        <el-button @click="addRow" icon="el-icon-circle-plus" size="small">新增</el-button>
        <el-button @click="addXdf" icon="el-icon-s-operation" size="small">添加协定方</el-button>
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

import {getGoodsDetail, likeListKL} from "@/api/warehouse/goods";
import {getSelectListByDrug } from "@/api/parties/orderpartiesdrug";
import {iBlenderDelete} from "@/api/order/order";

export default {
  name: "editKeLi",
  props: ['orderEdit'],
  data() {
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
            prop: "drugId",
            cell: true,
            filterable: true,
            remote: true,
            type: 'select',
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
                   for (let i = 0; i < this.data.length; i++) {
                     if (this.data[i].goodsName === value) {
                       this.data[i].unitPrice = res.data.data.unitPrice;
                       return;
                     }
                   }
                 });
               }
             },
          },
          {
            label: "*单剂量/g",
            prop: "doseHerb",
            cell: true,
            rules: [
              {
                required: true,
                message: '请输入单剂量',
                trigger: 'blur'
              }
            ]
          },
          {
            label: "单价",
            prop: "unitPrice",
          },
        ]
      },

      //煎药
      editOption: {
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
    /* rowCell(row, index) {
       this.$refs.crud.rowCell(row, index)
     },*/
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
              goodsId: data[i].goodsId,
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
      console.log(query)
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
/*    del(id) {
      if (id==null||id==""){
        this.$message.success("请选择取消");
      }else {
        iBlenderDelete(id).then(res => {
          let data = res.data.data;
          console.log(data);
        });
      }
      alert(id)
    },*/

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


<style scoped>

</style>
