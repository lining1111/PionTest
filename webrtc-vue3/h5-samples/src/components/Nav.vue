<script setup lang="ts">

import {RouterLink} from "vue-router";
</script>

<template>
  <div class="container-fluid myNav">
    <div class="row">
      <router-link active-class="active" class="list-group-item" to="/camera">摄像头实例</router-link>
      <router-link active-class="active" class="list-group-item" to="/microphone">麦克风示例</router-link>
      <router-link active-class="active" class="list-group-item" to="/canvas">截取视频示例</router-link>
      <router-link active-class="active" class="list-group-item" to="/screenSharing">共享屏幕示例</router-link>
      <router-link active-class="active" class="list-group-item" to="/videoFilter">视频滤镜示例</router-link>
      <router-link active-class="active" class="list-group-item" to="/resolution">视频分辨率示例</router-link>
      <router-link active-class="active" class="list-group-item" to="/audioVolume">音量检测示例</router-link>
      <router-link active-class="active" class="list-group-item" to="/deviceSelect">设备枚举示例</router-link>
      <router-link active-class="active" class="list-group-item" to="/mediaSettings">设置综合示例</router-link>
      <router-link active-class="active" class="list-group-item" to="/recordAudio">录制音频示例</router-link>
      <router-link active-class="active" class="list-group-item" to="/recordVideo">录制视频示例</router-link>
      <router-link active-class="active" class="list-group-item" to="/recordScreen">录制屏幕示例</router-link>
      <router-link active-class="active" class="list-group-item" to="/recordCanvas">录制Canvas示例</router-link>
      <router-link active-class="active" class="list-group-item" to="/mediaStreamAPI">MediaStreamAPI测试示例
      </router-link>
      <router-link active-class="active" class="list-group-item" to="/captureVideo">捕获Video作为媒体流示例
      </router-link>
      <router-link active-class="active" class="list-group-item" to="/captureCanvas">捕获Canvas作为媒体流示例
      </router-link>
      <router-link active-class="active" class="list-group-item" to="/peerConnection">RTCPeerConnection示例
      </router-link>
      <router-link active-class="active" class="list-group-item" to="/peerConnectionVideo">Video发送至远端示例
      </router-link>
      <router-link active-class="active" class="list-group-item" to="/peerConnectionCanvas">电子白板同步示例
      </router-link>
      <router-link active-class="active" class="list-group-item" to="/dataChannel">数据通道发送文本消息示例
      </router-link>
      <router-link active-class="active" class="list-group-item" to="/dataChannelFile">数据通道发送文件示例
      </router-link>
      <router-link active-class="active" class="list-group-item" to="/p2pClient">一对一视频通话示例</router-link>
    </div>
  </div>
</template>

<style scoped>
.myNav {
  float: left;
  width: 30%;
  border: solid purple 10px;
}

.myNav .small {
  font-size: 15px;
}

.myNav .list-group-item {
  float: none;
  min-width: 230px;
}
</style>