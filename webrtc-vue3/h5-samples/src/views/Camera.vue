<script setup lang="ts">
//约束条件
import {ref} from "vue";

const constraints: MediaStreamConstraints = {
  //禁用音频
  audio: false,
  //启用视频
  video: true
}

let openCamera = async () => {
  try {
    //根据约束条件获取媒体
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log('openCamera succcess')
    handleSuccess(stream)
  } catch (e) {
    handleError(e)
  }
}
let myVideo = ref()

let handleSuccess = (stream: MediaStream) => {
  console.log('stream', stream)

  console.log('myVieo', myVideo)
  const videoTracks = stream.getVideoTracks();
  console.log('通过设置限制条件获取到流:', constraints)
  console.log(`使用的视频设备: ${videoTracks[0].label}`);
  myVideo.value.srcObject = stream;
}

function handleError(error: any) {
  if (error.name === 'ConstraintNotSatisfiedError') {
    const v = constraints.video;
    //宽高尺寸错误
    alert(`宽:${(v as MediaTrackConstraints).width} 高:${(v as MediaTrackConstraints).height} 设备不支持`);
  } else if (error.name === 'PermissionDeniedError') {
    alert('没有摄像头和麦克风使用权限,请点击允许按钮');
  }
  alert(`getUserMedia错误: ${error.name}`);
}

</script>

<template>
  <div>
    <h3>
      摄像头示例
    </h3>
    <hr>
    <button @click="openCamera" style="float:left">打开摄像头</button>
    <video type="video" ref="myVideo" autoplay playsinline></video>
  </div>

</template>

<style scoped>

</style>