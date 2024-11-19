<script setup lang="js">
import VideocamOffIcon from "mdi-react/VideocamOffIcon";
import {onMounted} from "vue";
const props = defineProps(['id','stream'])
onMounted(()=>{
  let video = document.getElementById(props.id);
  //指定视频的源为stream
  video.srcObject = this.props.stream;
  //当获取到MetaData数据后开始播放
  video.onloadedmetadata = (e) => {
    video.play();
  };
})

//本地小视频样式
const small = reactive({
  display:'flex',
  justifyContent: 'center',
  alignItems: 'center',
  //绝对定位
  position: 'absolute',
  //指定宽
  width: '192px',
  //指定高
  height: '108px',
  //底部
  bottom: '60px',
  //右侧
  right: '10px',
  //边框宽度
  borderWidth: '2px',
  //边框样式
  borderStyle: 'solid',
  //边框颜色
  borderColor: '#ffffff',
  //溢出隐藏
  overflow: 'hidden',
  //设置此属性可以使得视频在最上层
  zIndex: 99,
  //边框弧度
  borderRadius: '4px',
});
//禁止视频图标样式
const videoMuteIcon = reactive({
  position: 'absolute',
  color:'#fff',
})
</script>

<template>
  <div :key=props.id
  :style=small>
<!--  设置ref及id值 视频自动播放 objectFit为cover模式可以平铺整个视频-->
  <video :ref=props.id :id=props.id
         autoPlay playsInline muted=true
         :style='{ width: "100%", height: "100%", objectFit: cover, }' />
<!--  判断禁止视频属性值-->
    <VideocamOffIcon :style=videoMuteIcon></VideocamOffIcon>
  </div>
</template>

<style scoped>

</style>

