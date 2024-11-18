<script setup lang="ts">

import {ref} from "vue";

const myVideo = ref();

const constraints: MediaStreamConstraints = {
  //禁用音频
  audio: false,
  //启用视频
  video: true
}

//开始捕获桌面
let startScreenShare = async (e:any) => {
  try {
    //调用getDisplayMedia方法,约束设置成{video:true}即可
    const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
    console.log('handleSuccess:');
    handleSuccess(stream);
  } catch (e) {
    handleError(e);
  }
}

//成功捕获,返回视频流
let handleSuccess = (stream:MediaStream) => {

  //获取视频轨道
  const videoTracks = stream.getVideoTracks();
  //读取视频资源名称
  console.log(`视频资源名称: ${videoTracks[0].label}`);
  // window.stream = stream;
  //将视频对象的源指定为stream
  myVideo.value.srcObject = stream;
}

//错误处理
function handleError(error:any) {
  if (error.name === 'ConstraintNotSatisfiedError') {
    const v = constraints.video as MediaTrackConstraints;
    //宽高尺寸错误
    alert(`宽:${v!.width} 高:${v!.height} 设备不支持`);
  } else if (error.name === 'PermissionDeniedError') {
    alert('没有摄像头和麦克风使用权限,请点击允许按钮');
  }
  alert(`getUserMedia错误: ${error.name}`);
}

</script>

<template>
  <div>
    <h3>
      共享屏幕示例
    </h3>
<!--    捕获屏幕数据渲染 -->
    <video  ref="myVideo" autoPlay playsInline></video>
    <el-button @click=startScreenShare>开始共享</el-button>
  </div>
</template>

<style scoped>

</style>