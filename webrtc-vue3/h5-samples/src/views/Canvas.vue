<script setup lang="ts">
import {onMounted, ref} from "vue";

let video = ref()
let canvas = ref()

function takeSnap() {
  canvas.value.width = video.value.width
  canvas.value.height = video.value.height

  canvas.value.getContext('2d').drawImage(video, 0, 0, canvas.value.width, canvas.value.height);
}

onMounted(()=>{
  //约束条件
  const constraints:MediaStreamConstraints = {
    //禁用音频
    audio: false,
    //启用视频
    video: true
  };

  navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError)
})

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


</script>

<template>
  <div>
    <h3>
      截取视频示例
    </h3>
    <div>
      <video className="small-video" ref='video' playsInline autoPlay></video>
      <!--      画布Canvas -->
      <canvas className="small-canvas" ref='canvas'></canvas>
    </div>
    <Button className="button" @click=takeSnap>截屏</Button>
  </div>
</template>

<style scoped>

</style>