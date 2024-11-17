<script setup lang="ts">
import {ref} from "vue";

let video = ref()
let selected = ref('none')

//获取视频成功
let handleSuccess = (stream:MediaStream) => {
  // window.stream = stream;
  //将视频源指定为视频流
  video.value.srcObject = stream;
}

//错误处理
function handleError(error:any) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

//选择框选择改变
let handleChange = () => {
  const value = selected.value
  console.log(`selected ${value}`);
  //设置滤镜
  video.value.class = value;
}

</script>

<template>
  <div>
    <h3>
      视频滤镜示例
    </h3>
<!--    视频渲染-->
    <video ref='video' playsInline autoPlay></video>
<!--    滤镜属性选择-->
    <select v-model="selected"  style= "width: 100px " @change=handleChange()>
    <option value="none">没有滤镜</option>
    <option value="blur">模糊</option>
    <option value="grayscale">灰度</option>
    <option value="invert">反转</option>
    <option value="sepia">深褐色</option>
    </select>
  </div>
</template>

<style scoped>

</style>