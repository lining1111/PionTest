<script setup lang="ts">
import { Button } from "antd";
import {onMounted, reactive, ref} from "vue";
let stream;
//录制对象
let mediaRecorder;
//录制数据
let recordedBlobs;
//音频播放对象
let audioPlayer = ref();

let state = reactive({
  status:'start',
})

//点击打开麦克风按钮
let startClickHandler = async (e) => {
  try {
    //获取音频数据流
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log('获取音频stream:', stream);

    //设置当前状态为startRecord
    state.status = 'startRecord';

  } catch (e) {
    //发生错误
    console.error('navigator.getUserMedia error:', e);
  }
}

//开始录制
let startRecordButtonClickHandler = (e) => {
  recordedBlobs = [];
  //媒体类型
  let options = { mineType: 'audio/ogg;' };
  try {
    //初始化MediaRecorder对象,传入音频流及媒体类型
    mediaRecorder = new MediaRecorder(stream, options as MediaRecorderOptions);
  } catch (e) {
    console.error('MediaRecorder创建失败:', e);
    return;
  }

  //录制停止事件回调
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
  };
  //当数据有效时触发的事件,可以把数据存储到缓存区里
  mediaRecorder.ondataavailable = handleDataAvailable;
  //录制10秒
  mediaRecorder.start(10);
  console.log('MediaRecorder started', mediaRecorder);

  //设置当前状态为stopRecord
  state.status = 'stopRecord'
}

//停止录制
let stopRecordButtonClickHandler = (e) => {
  mediaRecorder.stop();
  //设置当前状态为play
  state.status = 'play'
}

//播放录制数据
let playButtonClickHandler = (e) => {
  //生成blob文件,类型为audio/ogg
  const blob = new Blob(recordedBlobs, { type: 'audio/ogg' });

  audioPlayer.value.src = null;
  //根据blob文件生成播放器的数据源
  audioPlayer.value.src = window.URL.createObjectURL(blob);
  //播放声音
  audioPlayer.value.play();
  //设置当前状态为download
  state.status = 'download'
}

//下载录制文件
let downloadButtonClickHandler = (e) => {
  //生成blob文件,类型为audio/ogg
  const blob = new Blob(recordedBlobs, { type: 'audio/ogg' });
  //URL.createObjectURL()方法会根据传入的参数创建一个指向该参数对象的URL
  const url = window.URL.createObjectURL(blob);
  //创建a标签
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  //设置下载文件
  a.download = 'test.ogg';
  //将a标签添加至网页上去
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    //URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建的对象URL.
    window.URL.revokeObjectURL(url);
  }, 100);
  //设置当前状态为start
  state.status = 'start';
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
      录制音频示例
    </h3>
    {/* 音频播放器,播放录制音频 */}
    <audio ref="audioPlayer" controls autoPlay></audio>
    <div>
      <Button
          class="button"
          :disabled="state.status != 'start'"
          @click=startClickHandler>
        打开麦克风
      </Button>
      <Button
          class="button"
          :disabled="state.status != 'startRecord'"
          @click=startRecordButtonClickHandler>
        开始录制
      </Button>
      <Button
          class="button"
          :disabled="state.status != 'stopRecord'"
          @click=stopRecordButtonClickHandler>
        停止录制
      </Button>
      <Button
          class="button"
          :disabled="state.status != 'play'"
          @click=playButtonClickHandler>
        播放
      </Button>
      <Button
          class="button"
          :disabled="state.status != 'download'"
          @click="downloadButtonClickHandler">
        下载
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>