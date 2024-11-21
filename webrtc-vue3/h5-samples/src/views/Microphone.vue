<script setup lang="ts">
import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";

const constraints: MediaStreamConstraints = {
  //启用音频
  audio: true,
  //禁用视频
  video: false
}
let audio = ref()
onMounted(()=>{
  navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError)
})

function handleSuccess(stream: MediaStream) {

  //获取音频规道
  const audioTracks = stream.getAudioTracks();
  //获取音频设备名称
  console.log('获取的音频设备为: ' + audioTracks[0].label);
  //不活动状态
  stream.onremovetrack = () => {
    console.log('Stream停止');
  };

  // window.stream = stream;

  audio.value.srcObject = stream;
}

function handleError(err:any) {
  ElMessage.error('navigator.MediaDevices.getUserMedia error: ', err.message);
}

</script>

<template>
<div>
  <h3>
    麦克风示例
  </h3>
  <audio ref="audio" controls autoPlay></audio>
  <p class="warning">警告: 如何没有使用头戴式耳机, 声音会反馈到扬声器.</p>
</div>
</template>

<style scoped>

</style>