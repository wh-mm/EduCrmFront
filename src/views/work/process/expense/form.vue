<template>
  <basic-container>
    <avue-form :option="option" v-model="form" @submit="handleSubmit"/>
  </basic-container>
</template>

<script>
  import {expenseProcess} from "@/api/work/process";

  export default {
    data() {
      return {
        form: {},
        option: {
          group: [
            {
              icon: 'el-icon-info',
              label: '请假基础信息',
              prop: 'group1',
              column: [
                {
                  label: '审批人员',
                  prop: 'taskUser',
                  type: 'select',
                  dicUrl: `/api/blade-user/user-list`,
                  props: {
                    label: "name",
                    value: "id"
                  },
                  span: 24,
                  rules: [
                    {
                      required: true,
                      message: '请选择审批人员',
                      trigger: 'blur'
                    }
                  ]
                },
                {
                  label: '报销金额',
                  prop: 'expenseMoney',
                  type: 'number',
                  rules: [
                    {
                      required: true,
                      message: '请填写报销金额',
                      trigger: 'blur'
                    }
                  ]
                },
                {
                  label: '报销类型',
                  prop: 'type',
                  type: 'select',
                  rules: [
                    {
                      required: true,
                      message: '请选择报销类型',
                      trigger: 'blur'
                    }
                  ],
                  dicUrl: "/api/blade-system/dict-biz/dictionary?code=expense_type",
                  props: {
                    label: "dictValue",
                    value: "dictKey"
                  },
                },
                {
                  label: '报销理由',
                  prop: 'reason',
                  type: 'textarea',
                  span: 24,
                  rules: [
                    {
                      required: true,
                      message: '请输入报销理由',
                      trigger: 'blur'
                    }
                  ]
                },
              ]
            },
          ],
        }
      }
    },
    methods: {
      handleSubmit() {
        const params = {
          processDefinitionId: this.$route.params.processDefinitionId,
          ...this.form,
        };
        expenseProcess(params).then(resp => {
          const data = resp.data;
          if (data.success) {
            this.$message.success(data.msg);
            this.$router.$avueRouter.closeTag();
            this.$router.push({path: `/work/start`});
          } else {
            this.$message.error(data.msg || '提交失败');
          }
        });
      }
    }
  }
</script>
