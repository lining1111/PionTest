<script setup lang="ts">
import { Form,Input, Button } from "antd";

//提交表单
let handleSubmit = (values) => {
  console.log(values);
  this.props.loginHandler(values.userName,values.roomId);
};
</script>

<template>
  <Form onFinish={this.handleSubmit}  className="login-form">
    <Form.Item  name="userName">
      <Input placeholder="请输入用户名"/>
    </Form.Item>
    <Form.Item name="roomId">
      <Input placeholder="请输入房间号"/>
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit" className="login-join-button">
        登录
      </Button>
    </Form.Item>
  </Form>
</template>

<style scoped>

</style>