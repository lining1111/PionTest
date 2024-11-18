<script setup lang="ts">
import {reactive, ref} from "vue";

let stream;
//录制对象
let mediaRecorder;
//录制数据
let recordedBlobs;
//视频预览,用于录制过程中预览视频
let videoPreview = ref();
//视频播放,用于录制完成后回放视频
let videoPlayer = ref();

let state = reactive({
  status:'start',
})

//打开摄像头并预览视频
let startClickHandler = async (e) => {
  //约束条件
  let constraints = {
    //开启音频
    audio: true,
    //设置视频分辨率为1280*720
    video: {
      width: 1280, height: 720
    }
  };
  console.log('约束条件为:', constraints);
  try {
    //获取音视频流
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    //将视频预览对象源指定为stream
    videoPreview.value.srcObject = stream;
    state.status = 'startRecord'
  } catch (e) {
    console.error('navigator.getUserMedia error:', e);
  }
}

//开始录制
let startRecordButtonClickHandler = (e) => {
  //录制数据
  recordedBlobs = [];
  //指定mimeType类型,依次判断是否支持vp9 vp8编码格式
  let options = { mimeType: 'video/webm;codecs=vp9' };
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error("video/webm;codecs=vp9不支持");
    options = { mimeType: 'video/webm;codecs=vp8' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error("video/webm;codecs=vp8不支持");
      options = { mimeType: 'video/webm' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`video/webm不支持`);
        options = { mimeType: '' };
      }
    }
  }

  try {
    //创建MediaRecorder对象,准备录制
    mediaRecorder = new MediaRecorder(stream, options);
  } catch (e) {
    console.error('创建MediaRecorder错误:', e);
    return;
  }

  //录制停止事件监听
  mediaRecorder.onstop = (event) => {
    console.log('录制停止: ', event);
    console.log('录制的Blobs数据为: ', recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  //开始录制并指定录制时间为10秒
  mediaRecorder.start(10);
  console.log('MediaRecorder started', mediaRecorder);
  //设置录制状态
  state.status = 'stopRecord'
}

let stopRecordButtonClickHandler = (e) => {
  //停止录制
  mediaRecorder.stop();
  //设置录制状态
  state.status = 'play'
}

//回放录制视频
let playButtonClickHandler = (e) => {
  //生成blob文件,类型为video/webm
  const blob = new Blob(recordedBlobs, { type: 'video/webm' });
  videoPlayer.value.src = null;
  videoPlayer.value.srcObject = null;
  //URL.createObjectURL()方法会根据传入的参数创建一个指向该参数对象的URL
  videoPlayer.value.src = window.URL.createObjectURL(blob);
  //显示播放器控件
  videoPlayer.value.controls = true;
  //开始播放
  videoPlayer.value.play();
  //设置录制状态
  state.status = 'download'
}

//点击下载录制文件
let downloadButtonClickHandler = (e) => {
  //生成blob文件,类型为video/webm
  const blob = new Blob(recordedBlobs, { type: 'video/webm' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  //指定下载文件及类型
  a.download = 'test.webm';
  //将a标签添加至网页上去
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    //URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建的对象URL.
    window.URL.revokeObjectURL(url);
  }, 100);
  //设置录制状态
  state.status = 'start'
}

//录制数据回调事件
let handleDataAvailable = (event) => {
  console.log('handleDataAvailable', event);
  //判断是否有数据
  if (event.data && event.data.size > 0) {
    //将数据记录起来
    recordedBlobs.push(event.data);
  }
}


</script>

<template>
  <div>
    <h3>
      录制视频示例
    </h3>
    <video class="small-video" ref="videoPreview" playsInline autoPlay muted></video>
    <video class="small-video" ref="videoPlayer" playsInline loop></video>
    <div>
      <el-button
          :disabled="state.status != 'start'"
          @click=startClickHandler>
        打开摄像头
      </el-button>
      <el-button
          :disabled="state.status != 'startRecord'"
          @click=startRecordButtonClickHandler>
        开始录制
      </el-button>
      <el-button
          :disabled="state.status != 'stopRecord'"
          @click=stopRecordButtonClickHandler>
        停止录制
      </el-button>
      <el-button
          :disabled="state.status != 'play'"
          @click=playButtonClickHandler>
        播放
      </el-button>
      <el-button
          :disabled="state.status != 'download'"
          @click=downloadButtonClickHandler>
        下载
      </el-button>
    </div>
  </div>
</template>

<style scoped>

</style>