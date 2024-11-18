<script setup lang="ts">
//QVGA 320*240
import {ref} from "vue";

const qvgaConstraints = {
  video: {width: {exact: 320}, height: {exact: 240}}
};

//VGA 640*480
const vgaConstraints = {
  video: {width: {exact: 640}, height: {exact: 480}}
};

//高清 1280*720
const hdConstraints = {
  video: {width: {exact: 1280}, height: {exact: 720}}
};

//超清 1920*1080
const fullHdConstraints = {
  video: {width: {exact: 1920}, height: {exact: 1080}}
};

//2K 2560*1440
const twoKConstraints = {
  video: {width: {exact: 2560}, height: {exact: 1440}}
};

//4K 4096*2160
const fourKConstraints = {
  video: {width: {exact: 4096}, height: {exact: 2160}}
};

//8K 7680*4320
const eightKConstraints = {
  video: {width: {exact: 7680}, height: {exact: 4320}}
};

let selected = ref('')
let video = ref()
let stream;
let constraints = <MediaTrackConstraints>{}

//根据约束获取视频
let getMedia = (constraints: MediaStreamConstraints) => {
  //判断流对象是否为空
  if (stream) {
    console.log(stream)
    //迭代并停止所有轨道
    stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  //重新获取视频
  navigator.mediaDevices.getUserMedia(constraints)
      //成功获取
      .then(gotStream)
      //错误
      .catch(e => {
        handleError(e);
      });
}
//得到视频流处理
let gotStream = (mediaStream:MediaStream) => {
  stream = mediaStream;
  //将video视频源指定为mediaStream
  video.value.srcObject = mediaStream;
  const track = mediaStream.getVideoTracks()[0];
  constraints = track.getConstraints();
  console.log('约束条件为:' + JSON.stringify(constraints));
}

//错误处理
function handleError(error:any) {
  console.log(`getUserMedia错误: ${error.name}`, error);
}

//选择框选择改变
let handleChange = () => {
  const value = selected.value
  console.log(`selected ${value}`);
  //根据选择框的值获取不同分辨率的视频
  switch (value) {
    case 'qvga':
      getMedia(qvgaConstraints);
      break;
    case 'vga':
      getMedia(vgaConstraints);
      break;
    case 'hd':
      getMedia(hdConstraints);
      break;
    case 'fullhd':
      getMedia(fullHdConstraints);
      break;
    case '2k':
      getMedia(twoKConstraints);
      break;
    case '4k':
      getMedia(fourKConstraints);
      break;
    case '8k':
      getMedia(eightKConstraints);
      break;
    default:
      getMedia(vgaConstraints);
      break;
  }
}

//动态改变分辨率
let dynamicChange = (e:any) => {
  //获取当前的视频流中的视频轨道
  const track = stream?.getVideoTracks()[0];
  //使用超清约束作为测试条件
  console.log('应用高清效果:' + JSON.stringify(hdConstraints));
  track?.applyConstraints(constraints)
      .then(() => {
        console.log('动态改变分辨率成功...');
      })
      .catch(err => {
        console.log('动态改变分辨率错误:', err.name);
      });
}

</script>

<template>
  <div>
    <h3>
      视频分辨率示例
    </h3>
    <!--     视频渲染-->
    <video ref='video' playsInline autoPlay></video>
    <!--    清晰度选择 -->
    <select v-model="selected" :style="{ width: '100px',marginLeft:'20px' }" @change=handleChange>
    <option value="qvga">QVGA</option>
    <option value="vga">VGA</option>
    <option value="hd">高清</option>
    <option value="fullhd">超清</option>
    <option value="2k">2K</option>
    <option value="4k">4K</option>
    <option value="8k">8K</option>
    </select>
    <el-button @click=dynamicChange :style="{ marginLeft:'20px' }">动态设置</el-button>
  </div>
</template>

<style scoped>

</style>