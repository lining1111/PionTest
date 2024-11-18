<script setup lang="ts">
//MediaStream对象
import {onMounted, ref} from "vue";

let stream;
const video = ref();
//画布对象
let canvas = ref();
//画布2D内容
let context;

onMounted((e)=>{
  startCaptureCanvas(e)
})

//开始捕获Canvas
let startCaptureCanvas = async (e) => {
  stream = canvas.value.captureStream(10);

  //将视频对象的源指定为stream
  video.value.srcObject = stream;

  drawLine();
}

//画线
let drawLine = () => {
  //获取Canvas的2d内容
  context = canvas.value.getContext("2d");

  //填充颜色
  context.fillStyle = '#CCC';
  //绘制Canvas背景
  context.fillRect(0,0,320,240);

  context.lineWidth = 1;
  //画笔颜色
  context.strokeStyle = "#FF0000";

  //监听画板鼠标按下事件 开始绘画
  canvas.value.addEventListener("mousedown", startAction);
  //监听画板鼠标抬起事件 结束绘画
  canvas.value.addEventListener("mouseup", endAction);
}

//鼠标按下事件
let startAction = (event) => {
  //开始新的路径
  context.beginPath();
  //将画笔移动到指定坐标，类似起点
  context.moveTo(event.offsetX, event.offsetY);
  //开始绘制
  context.stroke();
  //监听鼠标移动事件
  canvas.value.addEventListener("mousemove", moveAction);
}

//鼠标移动事件
let moveAction = (event) => {
  //将画笔移动到结束坐标，类似终点
  context.lineTo(event.offsetX, event.offsetY);
  //开始绘制
  context.stroke();
}

//鼠标抬起事件
let endAction = () => {
  //移除鼠标移动事件
  canvas.value.removeEventListener("mousemove", moveAction);
}
</script>

<template>
  <div>
    <h3>
      捕获Canvas作为媒体流示例
    </h3>
    <div>
      <div class="small-canvas">
        {/* Canvas不设置样式 */}
        <canvas ref='canvas'></canvas>
      </div>
      <video class="small-video" ref='video' playsInline autoPlay></video>
    </div>
  </div>
</template>

<style scoped>

</style>