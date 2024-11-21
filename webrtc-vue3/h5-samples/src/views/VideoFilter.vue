<script setup lang="ts">
import {onMounted, ref} from "vue";

let video = ref()
let videoClass = ref()
let selected = ref('none')

onMounted(()=>{
  //约束条件
  const constraints = {
    //禁用音频
    audio: false,
    //启用视频
    video: true
  };
  //根据约束获取视频流
  navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
})


//获取视频成功
let handleSuccess = (stream: MediaStream) => {
  //将视频源指定为视频流
  video.value.srcObject = stream;
}

//错误处理
function handleError(error: any) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

//选择框选择改变
let handleChange = () => {
  const value = selected.value
  console.log(`selected ${value}`);
  //设置滤镜
  // video.value.class = value;
  videoClass.value = value;
}

</script>

<template>
  <div>
    <h3>
      视频滤镜示例
    </h3>
    <video ref='video' :class="videoClass"  playsInline autoPlay></video>
    <!--    滤镜属性选择-->
    <select v-model="selected" class="row" style="width: 100px" @change="handleChange">
      <option value="none">没有滤镜</option>
      <option value="blur">模糊</option>
      <option value="grayscale">灰度</option>
      <option value="invert">反转</option>
      <option value="sepia">深褐色</option>
    </select>
  </div>
</template>

<style scoped>
.none {
  -webkit-filter: none;
  filter: none;
}
.blur {
  -webkit-filter: blur(3px);
  filter: blur(3px);
}
.grayscale {
  -webkit-filter: grayscale(1);
  filter: grayscale(1);
}
.invert {
  -webkit-filter: invert(1);
  filter: invert(1);
}
.sepia {
  -webkit-filter: sepia(1);
  filter: sepia(1);
}
</style>