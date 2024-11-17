<script setup lang="ts">
import PropTypes from "prop-types";
import {onMounted} from "vue";
//视频容器样式
const style = {
  //绝对定位
  position: 'absolute',
  //上下左右为0px表示撑满整个容器
  left: '0px',
  right: '0px',
  top:'0px',
  bottom: '0px',
  //背景色
  backgroundColor: '#323232',
  //远端大视频放在底部
  zIndex: 0,
}

onMounted(()=>{
  //获取到视频对象
  let video = this.refs[this.props.id];
  //指定视频的源为stream
  video.srcObject = this.props.stream;
  //当获取到MetaData数据后开始播放
  video.onloadedmetadata = (e) => {
    video.play();
  };
})

</script>

<template>
  <div key={this.props.id} :style=style>
    {/* 设置ref及id值 视频自动播放 */}
    <video ref={this.props.id} id={this.props.id}
           autoPlay playsInline
           :style="{ width: '100%', height: '100%', objectFit: 'contain' }" />
  </div>
</template>

<style scoped>

</style>