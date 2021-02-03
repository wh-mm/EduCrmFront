<template>
  <basic-container>
    <!--<avue-data-box :option="option"></avue-data-box>-->
    <el-calendar v-model="value">
    </el-calendar>
  </basic-container>
</template>




<script>


  export default {
    data() {
      return {
        value: new Date(),
        option: {
          span:6,
          data: [
            {
              title: '库存有效期到期提醒',
              count: 4,
              icon: 'el-icon-warning',
              color: 'rgb(49, 180, 141)',
              //href:'https://avuejs.com',
              //target:'_blank'
            },
          ]
        },
      };
    },
    computed: {},
    methods: {

    }
  };
</script>

<style>
</style>
