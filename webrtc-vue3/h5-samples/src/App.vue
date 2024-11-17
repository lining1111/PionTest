<script setup lang="ts">
import {RouterView} from 'vue-router'
import Nav from "@/components/Nav.vue";
</script>

<template>
  <div class="myMain">
    <!--    标题-->
    <h1 class="title">
      WebRTC-Vue3通信示例
    </h1>
    <hr>
    <!--      导航+显示-->
    <div class="navAndShow">
      <!--    导航区-->
      <Nav/>
      <!--     展示区-->
      <div class="myShow">
        <router-view></router-view>
      </div>
    </div>

  </div>

</template>

<style scoped>
.myMain {
  border: solid black 10px;
  min-width: 1000px;
}

.title {
  padding: 20px;
  text-align: center;
  min-width: 610px;
}

.navAndShow {
  border: solid red 10px;
}

.myShow {
  float: right;
  width: 70%;
  margin-left: auto;
  border: solid green 10px;
  padding-left: 10px;
}

</style>
