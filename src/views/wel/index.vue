<template>
  <FullCalendar defaultView="dayGridMonth" :plugins="calendarPlugins" />
</template>
<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'

export default {
  components: {
    FullCalendar
  },
  data() {
    return {
      calendarPlugins: [ dayGridPlugin ]
    }
  }
}

</script>
<style lang='less'>
//用什么插件必须引入相应的样式表，否则不能正常显示
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
</style>
<!--
<template>
  <basic-container>
    <avue-data-box :option="option"></avue-data-box>
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
        span: 6,
        data: [

     /* {
        click: function (item) {
          alert(JSON.stringify(item));
        },
        count: 100,
        title: '日活跃数',
       // href:'https://avuejs.com',
      //  target:'_blank'
      },*/
          /*{
            title: '库存有效期到期提醒',
            count: 10,
            icon: 'el-icon-warning',
            color: 'rgb(49, 180, 141)',
            //href:'https://avuejs.com',
            //target:'_blank'
          },*/
/*          {
            title: '供应商有效期到期提醒',
            count: 15,
            subtitle: '实时',
            key: '好',
            icon: 'el-icon-warning',
            color: 'rgb(255,192,203)',
            //href:'https://avuejs.com',
            //target:'_blank'
          },*/
        ]
      },
    };
  },
  computed: {},
  methods: {}
};
</script>

<style>
</style>
-->
<!--<template>-->
<!--  <div class="min">-->
<!--    <el-button type="primary"-->
<!--               size="large"-->
<!--               icon="el-icon-camera-solid"-->
<!--               plain-->
<!--              @click="checkFace">人脸检测-->
<!--    </el-button>-->
<!--  </div>-->

<!--</template>-->
