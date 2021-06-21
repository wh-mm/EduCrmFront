<template>
  <basic-container>
  <avue-form :option="option" v-model="obj"  @submit="submit()" >
    <template slot-scope="{row}" slot="discountPrice">
      {{(row.goodsPrice*row.discountPercentage/100*row.goodsQuantity).toFixed(2)}}
    </template>
    <template slot-scope="{row}" slot="totalPrice">
      {{(row.goodsPrice*(1-row.discountPercentage/100)*row.goodsQuantity).toFixed(2)}}
    </template>
  </avue-form>
  </basic-container>
</template>

<script>
  import { add }  from "@/api/purchase/purchaseorder";
  import { getGoodsDetail } from "@/api/warehouse/goods";

  export default {
    data() {
        var validateQuantity = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入数量'));
          } else if (value <= 0) {
            callback(new Error('数量不能小于0'));
          } else {
            callback();
          }
        };
        return {
          //基础数据
          obj:{
            purchaseOrderDetailLists: [{
              goodsQuantity: 1,
              discountPercentage: 0,
              goodsPrice: 0
            }, {
              goodsQuantity: 1,
              discountPercentage: 0,
              goodsPrice: 0
            }, {
              goodsQuantity: 1,
              discountPercentage: 0,
              goodsPrice: 0
            }, {
              goodsQuantity: 1,
              discountPercentage: 0,
              goodsPrice: 0
            }, {
              goodsQuantity: 1,
              discountPercentage: 0,
              goodsPrice: 0
            }]
          },
          option: {
            height:'auto',
            labelWidth: 110,
            column: [
            {
              label: "供应商",
              prop: "cusId",
              type:'select',
              row: true,
              props: {
                    label: 'supName',
                    value: 'id'
              },
              rules: [{
                required: true,
                message: "请输入供应商",
                trigger: "blur"
              }],
              dicMethod:"post",
              dicUrl:'/api/yue-base/sup/dropDown'
            },
            {
              label: '商品列表',
              prop: 'purchaseOrderDetailList',
              type: 'dynamic',
              span:24,
              children: {
                align: 'center',
                headerAlign: 'center',
                rowAdd:(done)=>{
                  done({
                    goodsQuantity: 1,
                    discountPercentage: 0,
                    goodsPrice: 0});
                },
                rowDel:(row,done)=>{
                    done();
                },
                column: [{
                  label: '商品',
                  prop: "goodsId",
                  type: 'select',
                  width: 150,
                  rules:[{
                    type:'select',
                    require:true,
                    message:'请选择商品',
                  }],
                  props: {
                    label: 'goodsName',
                    value: 'id'
                  },
                  dicMethod:"post",
                  dicUrl:'/api/yue-base/goods/dropDown',
                  change: ({ value }) => {
                    if(value){
                      getGoodsDetail(value).then(res => {
                        this.obj.purchaseOrderDetailList.forEach(val => {
                          if(val.goodsId == value){
                            val.unit = res.data.data.unitName;
                            val.goodsPrice =res.data.data.goodsPrice;
                            val.totalPrice =res.data.data.goodsPrice;
                            console.log(value)
                          }
                        });
                      });
                    }
                  }
                }, {
                  label: '单位',
                  prop: "unit",
                  disabled: true,
                  placeholder: " ",
                  width: 100,
                }, {
                  label: '单价(元)',
                  prop: "goodsPrice",
                  disabled: true,
                  placeholder: " ",
                  width: 100,
                },{
                  label: '数量',
                  prop: "goodsQuantity",
                  type: "number",
                  width: 100,
                  rules: [{
                    validator: validateQuantity,
                    trigger: 'blur' ,
                  }]
                },{
                  label: '采购仓库',
                  prop: "warehouseId",
                  type: "tree",
                  props: {
                    label: 'title',
                    value: 'id'
                  },
                  dicMethod:"post",
                  dicUrl:'/api/yue-wms/warehouse/tree'
                },{
                  label: '折扣率(%)',
                  prop: "discountPercentage",
                  width: 120,
                  placeholder: " ",
                  precision: 2,
                  type: "number",
                }, {
                  label: '折扣额',
                  prop: "discountPrice",
                  disabled: true,
                  formslot: true,
                  width: 80,
                }, {
                  label: '购货金额',
                  prop: "totalPrice",
                  disabled: true,
                  formslot: true,
                  width: 80,
                }, {
                  label: '备注',
                  prop: "remark",
                }],
              }
            },
            ]
          },
        }
    },
    methods:{
      submit(done){
        add(this.obj).then(res => {
          this.$message.success(res.data.msg);
          done();
        },err =>{
          this.$message.success(err.data.msg);
          done();
        })

      }
    }
  }
</script>

<style>
</style>
