<script setup lang="ts">
import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";

let video = ref()
let canvas = ref()

function takeSnap() {
  canvas.value.width = video.value.width
  canvas.value.height = video.value.height

  canvas.value.getContext('2d').drawImage(video, 0, 0, canvas.value.width, canvas.value.height);
}

onMounted(() => {
  //约束条件
  const constraints: MediaStreamConstraints = {
    //禁用音频
    audio: false,
    //启用视频
    video: true
  };

  navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError)
})

//获取视频成功
let handleSuccess = (stream: MediaStream) => {
  //将视频源指定为视频流
  video.value.srcObject = stream;
}

//错误处理
let handleError = (error) => {
  console.log('navigator.MediaDevices.getUserMedia error: ', error);
}


</script>

<template>
  <div>
    <h3>
      截取视频示例
    </h3>
    <div>
      <video ref='video' playsInline autoPlay></video>
      <canvas ref='canvas'></canvas>
    </div>
    <el-button @click=takeSnap>截屏</el-button>
  </div>
</template>

<style scoped>

</style>