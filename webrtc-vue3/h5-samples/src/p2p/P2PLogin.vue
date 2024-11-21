<script setup lang="js">

const props = defineProps(["loginHandler"]);

//提交表单
let handleSubmit = (values) => {
  console.log(values);
  props.loginHandler(values.userName,values.roomId);
};
</script>

<template>
  <el-form ref="values" class="">
    <el-form-item  name="userName">
      <el-input placeholder="请输入用户名"/>
    </el-form-item>
    <el-form-item name="roomId">
      <el-input placeholder="请输入房间号"/>
    </el-form-item>
    <el-form-item>
      <el-button class="login-join-button" @click="handleSubmit('values')">
        登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>

</style>