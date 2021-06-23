<template>
  <basic-container>
    <avue-form :option="option" v-model="form">
      <template  slot="menuForm">
        <el-button size="small" icon="el-icon-refresh" type="primary" @click=event()>查找</el-button>
      </template>
    </avue-form>
  <FullCalendar :options="calendarOptions"/>
  </basic-container>
</template>




<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import {selectAll, selectCourseByCourseId,selectAllBySchoolId} from "../../api/baiscservice/basicstudentcourseservice";


export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
      form: {},
      option: {
        submitBtn: false,
        emptyBtn: false,
        column: [
          {
            label: "学校名称",
            prop: "schoolId",
            props: {
              label: 'nameSchool',
              value: 'id'
            },
            dicUrl: "/api/school/selectAll",
            addDisplay: false,
            editDisplay: false,
            span: 6,
            type: 'select'
          },
        ]
      },
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
        initialView: 'timeGridWeek',
        firstDay: 1, // 设置一周中显示的第一天是哪天，周日是0，周一是1，类推
        locale: 'zh-cn', // 切换语言，当前为中文
        eventColor: '#7cd4f6', // 全部日历日程背景色
        timeGridEventMinHeight: '20', // 设置事件的最小高度
        aspectRatio: 1.55, // 设置日历单元格宽度与高度的比例。
        eventLimit: true, // 设置月日程，与all-day slot的最大显示数量，超过的通过弹窗显示
        headerToolbar: { // 日历头部按钮位置
          left: 'prevYear prev',
          center: 'title',
          right: 'next nextYear today dayGridMonth,timeGridWeek,timeGridDay'
        },
        buttonText: {
          today: '今天',
          month: '月',
          week: '周',
          day: '日'
        },
        slotLabelFormat: {
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
          hour12: false // 设置时间为24小时
        },
        eventLimitNum: { // 事件显示数量限制(本地测试未能生效)
          dayGrid: {
            eventLimit: 5
          },
          timeGrid: {
            eventLimit: 2 // adjust to 6 only for timeGridWeek/timeGridDay
          }
        },
        // 事件
        eventDblClick: this.handleEventDblClick, // 双击日历日程事件 (这部分是在源码中添加的)
        eventClickDelete: this.eventClickDelete, // 点击删除标签事件 (这部分是在源码中添加的)
        eventDrop: this.eventDrop, // 拖动日历日程事件
        eventResize: this.eventResize, // 修改日历日程大小事件
        select: this.handleDateSelect, // 选中日历格事件
        eventDidMount: this.eventDidMount, // 安装提示事件
        eventMouseEnter: this.eventMouseEnter, // 鼠标滑过
        allowContextMenu: false,
        editable: true, // 是否可以进行（拖动、缩放）修改
        eventStartEditable: true, // Event日程开始时间可以改变，默认true，如果是false其实就是指日程块不能随意拖动，只能上下拉伸改变他的endTime
        eventDurationEditable: true, // Event日程的开始结束时间距离是否可以改变，默认true，如果是false则表示开始结束时间范围不能拉伸，只能拖拽
        selectable: true, // 是否可以选中日历格
        selectMirror: true,
        selectMinDistance: 0, // 选中日历格的最小距离
        dayMaxEvents: true,
        weekends: true,
        navLinks: true, // 天链接
        selectHelper: false,
        slotEventOverlap: false, // 相同时间段的多个日程视觉上是否允许重叠，默认true允许
        resultAll: [],
        events: [],
        eventClick: this.openDialog,
      },
      detailsBox: false,
      popup: false,
      data: [],
    }
  },
  methods: {
    handleDateClick: function (arg) {
      alert('date click' + arg.dateStr)
      console.log(arg)
    },
    handleEventDblClick() {
      this.popup = true;
    },
    mounted: function () {
      this.event();
    },
    event() {
      let schoolId = this.form.schoolId;
      selectAllBySchoolId(schoolId).then(allList => {
        console.log(schoolId)
        console.log(allList)
        allList.data.data.forEach((item, index) => {
          this.calendarOptions.events.push({
            title: allList.data.data[index].nameCourse,
            start: item.courseStartTime,
            end: item.courseEndTime,
            backgroundColor: allList.data.data[index].colorCourse,
          })
        })
      })
    },
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        getDetail(this.form.id).then(res => {
          this.form = res.data.data;
        });
      }
      done();
    },
  },
}
</script>
<style>
h2 {
  color: #fd0505;
}

a {
  color: #049393;
}
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
