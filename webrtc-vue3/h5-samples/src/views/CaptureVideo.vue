<script setup lang="ts">

//开始播放
import {ref} from "vue";

let canPlay = () => {

  //源视频对象
  let sourceVideo = ref();
  //播放视频对象
  let playerVideo = ref();

  //MediaStream对象
  let stream;
  //捕获侦率
  const fps = 0;
  //浏览器兼容判断,捕获媒体流
  if (sourceVideo.value.captureStream) {
    stream = sourceVideo.value.captureStream(fps);
  } else if (sourceVideo.value.mozCaptureStream) {
    stream = sourceVideo.value.mozCaptureStream(fps);
  } else {
    console.error('captureStream不支持');
    stream = null;
  }
  //将播放器源指定为stream
  playerVideo.value.srcObject = stream;
}

</script>

<template>
  <div>
    <h3>
      捕获Video作为媒体流示例
    </h3>
    {/* 源视频 显示控制按钮 循环播放 */}
    <video ref="sourceVideo" playsInline controls loop muted onCanPlay={this.canPlay}>
      {/* mp4视频路径 */}
      <source src="./assets/webrtc.mp4" type="video/mp4" />
    </video>
    <video ref="playerVideo" playsInline autoPlay></video>
  </div>
</template>

<style scoped>

</style>