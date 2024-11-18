<script setup lang="ts">
import {RouterView} from 'vue-router'
import Nav from "@/components/Nav.vue";
</script>

<template>
    <!--    标题-->
    <h1 class="title">
      WebRTC-Vue3通信示例
    </h1>
    <hr>
    <div style="display:grid; grid-template-columns: 1fr 4fr;">
      <!--    导航区-->
      <div class="myNav">
        <Nav/>
      </div>
      <!--     展示区-->
      <div class="myShow">
        <router-view></router-view>
      </div>
    </div>
</template>

<style scoped>

.title {
  padding: 1px;
  text-align: center;
  width: 100%;
}

.myNav {
  border: solid purple 1px;
}

.myShow {
  padding-left: 5px;
  border: solid green 1px;
}

</style>
