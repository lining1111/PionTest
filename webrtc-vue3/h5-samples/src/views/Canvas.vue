<script setup lang="ts">
import {onMounted, ref} from "vue";

let video = ref()
let canvas = ref()

function takeSnap() {
  canvas.value.width = video.value.videoWidth
  canvas.value.height = video.value.videoHeight

  canvas.value.getContext('2d').drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
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
    <div class="container align-items-center">
      <video class="small-video" ref='video' playsInline autoPlay></video>
      <canvas class="small-canvas" ref='canvas'></canvas>
    </div>
    <el-button @click=takeSnap>截屏</el-button>
  </div>
</template>

<style lang="css" scoped>
/*留个疑问，video 和canvas怎么水平垂直对齐*/
/*小视频样式*/
.small-video {
  background: #222;
  width: 320px;
  height: 240px;
}

/*小画布样式*/
.small-canvas {
  background-color: #ccc;
  width: 320px;
  height: 240px;
}
</style>