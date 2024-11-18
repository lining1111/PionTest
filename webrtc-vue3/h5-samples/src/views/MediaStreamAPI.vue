<script setup lang="ts">
import {onMounted, ref} from "vue";

//MediaStream对象
let stream;
onMounted(() => {
  openDevice()
})


//打开音视频设备
let openDevice = async () => {
  try {
    //根据约束条件获取媒体
    stream = await navigator.mediaDevices.getUserMedia({
      //启用音频
      audio: true,
      //启用视频
      video: true
    });
    let myVideo = ref();
    myVideo.value.srcObject = stream;
  } catch (e) {
    console.log(`getUserMedia错误:` + e);
  }
}

//获取音频轨道列表
let btnGetAudioTracks = () => {
  console.log("getAudioTracks");
  //返回一个数据
  console.log(stream.getAudioTracks());
}

//根据Id获取音频轨道
let btnGetTrackById = () => {
  console.log("getTrackById");
  console.log(stream.getTrackById(stream.getAudioTracks()[0].id));
}

//删除音频轨道
let btnRemoveAudioTrack = () => {
  console.log("removeAudioTrack()");
  stream.removeTrack(stream.getAudioTracks()[0]);
}

//获取所有轨道,包括音频及视频
let btnGetTracks = () => {
  console.log("getTracks()");
  console.log(stream.getTracks());
}

//获取视频轨道列表
let btnGetVideoTracks = () => {
  console.log("getVideoTracks()");
  console.log(stream.getVideoTracks());
}

//删除视频轨道
let btnRemoveVideoTrack = () => {
  console.log("removeVideoTrack()");
  stream.removeTrack(stream.getVideoTracks()[0]);
}


</script>

<template>
  <div>
    <h3>
      MediaStreamAPI测试示例
    </h3>
    <video className="video" ref="myVideo" autoPlay playsInline></video>
    <el-button @click=btnGetTracks :style="{width:120}">获取所有轨道</el-button>
    <el-button @click=btnGetAudioTracks :style="{width:120}">获取音频轨道</el-button>
    <el-button @click=btnGetTrackById :style="{width:200}">根据Id获取音频轨道</el-button>
    <el-button @click=btnRemoveAudioTrack :style="{width:120}">删除音频轨道</el-button>
    <el-button @click=btnGetVideoTracks :style="{width:120}">获取视频轨道</el-button>
    <el-button @click=btnRemoveVideoTrack :style="{width:120}">删除视频轨道</el-button>
  </div>
</template>

<style scoped>

</style>