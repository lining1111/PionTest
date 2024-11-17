<script setup lang="js">
import {onMounted, ref} from "vue";

import SoundMeter from '@/utils/soundmeter';

// 'use strict';

let state = ref({
  audioLevel:0,
})

var soundMeter;

onMounted(()=>{
  try {
    //AudioContext是用于管理和播放所有的声音
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    //实例化AudioContext
    window.audioContext = new AudioContext();
  } catch (e) {
    console.log('网页音频API不支持.');
  }
//SoundMeter声音测量,用于做声音音量测算使用的
  soundMeter = new SoundMeter(window.audioContext);

  const constraints = {
    //启用音频
    audio: true,
    //禁用视频
    video: false
  };
  //根据约束条件获取媒体
  navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
})
//获取媒体成功
let handleSuccess = (stream) => {
  //将声音测量对象与流连接起来
  soundMeter.connectToSource(stream);
  //开始实时读取音量值
  setTimeout(soundMeterProcess, 100);
}

//音频音量处理
let soundMeterProcess = () => {
  //读取音量值,再乘以一个系数,可以得到音量条的宽度
  var val = (soundMeter.instant.toFixed(2) * 348) + 1;
  //设置音量值状态
  state.value.audioLevel = val;
  //每隔100毫秒调用一次soundMeterProcess函数,模拟实时检测音频音量
  setTimeout(soundMeterProcess, 100);
}

//错误处理
function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

</script>

<template>
  <div>
    <h3>
      音量检测示例
    </h3>
    {/* 这是使用了一个div来作为音量条的展示,高度固定,宽度根据音量值来动态变化 */}
    <div :style="{
        width: state.audioLevel + 'px',
        height: '10px',
        backgroundColor: '#8dc63f',
        marginTop: '20px',
    }">
  </div>
  </div>
</template>

<style scoped>

</style>