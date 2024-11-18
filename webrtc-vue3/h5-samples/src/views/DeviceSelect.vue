<script setup lang="js" name="DeviceSelect">
import {onBeforeMount, onMounted, reactive, ref} from "vue";
let state = reactive({
  //当前选择的音频输入设备
  selectedAudioDevice: "",
  //当前选择的音频输出设备
  selectedAudioOutputDevice: "",
  //当前选择的视频输入设备
  selectedVideoDevice: "",
  //视频输入设备列表
  videoDevices: [],
  //音频输入设备列表
  audioDevices: [],
  //音频输出设备列表
  audioOutputDevices: [],
})


let previewVideo = ref()
onMounted( () => {
  updateDevices().then((data) => {
    console.log(data)
    //判断当前选择的音频输入设备是否为空并且是否有设备
    if (state.selectedAudioDevice === "" && data.audioDevices.length > 0) {
      //默认选中第一个设备
      state.selectedVideoDevice = data.audioDevices[0].deviceId;
    }
    //判断当前选择的音频输出设备是否为空并且是否有设备
    if (state.selectedAudioOutputDevice === "" && data.audioOutputDevices.length > 0) {

      //默认选中第一个设备
      state.selectedAudioOutputDevice = data.audioOutputDevices[0].deviceId
    }
    //判断当前选择的视频输入设备是否为空并且是否有设备
    if (state.selectedVideoDevice === "" && data.videoDevices.length > 0) {
      //默认选中第一个设备
      state.selectedVideoDevice = data.videoDevices[0].deviceId;
    }
    //设置当前设备Id
    state.videoDevices = data.videoDevices;
    state.audioDevices = data.audioDevices;
    state.audioOutputDevices = data.audioOutputDevices;
  })
})


//更新设备列表
let updateDevices = () => {
  return new Promise((pResolve, pReject) => {
    //视频输入设备列表
    let videoDevices = [];
    //音频输入设备列表
    let audioDevices = [];
    //音频输出设备列表
    let audioOutputDevices = [];
    //枚举所有设备
    navigator.mediaDevices.enumerateDevices()
        //返回设备列表
        .then((devices) => {
          //使用循环迭代设备列表
          for (let device of devices) {
            //过滤出视频输入设备
            if (device.kind === 'videoinput') {
              videoDevices.push(device);
              //过滤出音频输入设备
            } else if (device.kind === 'audioinput') {
              audioDevices.push(device);
              //过滤出音频输出设备
            } else if (device.kind === 'audiooutput') {
              audioOutputDevices.push(device);
            }
          }
        }).then(() => {
      //处理好后将三种设备数据返回
      let data = {videoDevices, audioDevices, audioOutputDevices};
      pResolve(data);
    });
  });
}

//开始测试
let startTest = () => {
  //获取音频输入设备Id
  let audioSource = state.selectedAudioDevice;
  //获取视频频输入设备Id
  let videoSource = state.selectedVideoDevice;
  //定义约束条件
  let constraints = {
    //设置音频设备Id
    audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
    //设置视频设备Id
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  //根据约束条件获取数据流
  navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        //成功返回音视频流
        previewVideo.value.srcObject = stream;
      }).catch((err) => {
    console.log(err);
  });
}


//音频输入设备改变
let handleAudioDeviceChange = (e) => {
  console.log('选择的音频输入设备为: ' + JSON.stringify(e));
  state.selectedAudioDevice = e
  setTimeout(startTest, 100);
}
//视频输入设备改变
let handleVideoDeviceChange = (e) => {
  console.log('选择的视频输入设备为: ' + JSON.stringify(e));
  state.selectedVideoDevice = e;
  setTimeout(startTest, 100);
}
//音频输出设备改变
let handleAudioOutputDeviceChange = (e) => {
  console.log('选择的音频输出设备为: ' + JSON.stringify(e));
  state.selectedAudioOutputDevice = e;

  if (typeof previewVideo.value.sinkId !== 'undefined') {
    //调用HTMLMediaElement的setSinkId方法改变输出源
    previewVideo.value.setSinkId(e)
        .then(() => {
          console.log(`音频输出设备设置成功: ${previewVideo.value.sinkId}`);
        })
        .catch((error) => {
          if (error.name === 'SecurityError') {
            console.log(`你需要使用HTTPS来选择输出设备: ${error}`);
          }
        });
  } else {
    console.warn('你的浏览器不支持输出设备选择.');
  }
}

</script>

<template>
  <div>
    <h3>
      设备枚举示例
    </h3>
     音频输入设备列表
    <el-select v-model="state.selectedAudioDevice" :style="{ width: 150,marginRight:'10px' }"
               @change="handleAudioDeviceChange">
      <el-option v-for="device in state.audioDevices"
                 :value="device.deviceId"
                 :key="device.deviceId"
      >{{ device.label }}
      </el-option>
    </el-select>
    音频输出设备列表
    <el-select v-model=state.selectedAudioOutputDevice :style="{ width: 150,marginRight:'10px' }"
            @change=handleAudioOutputDeviceChange>
      <el-option v-for="device in state.audioOutputDevices"
                 :value="device.deviceId"
                 :key="device.deviceId"
      >{{ device.label }}
      </el-option>
    </el-select>
    视频频输入设备列表
    <el-select v-model=state.selectedVideoDevice :style="{ width: 150 }"
            @change=handleVideoDeviceChange>
      <el-option v-for="device in state.videoDevices"
                 :value="device.deviceId"
                 :key="device.deviceId"
      >{{ device.label }}
        </el-option>
    </el-select>
    视频预览展示
    <video ref='previewVideo' autoPlay playsInline :style="{ objectFit: 'contain',marginTop:'10px' }">

    </video>

    <el-button @click=startTest>测试</el-button>
  </div>
</template>

<style scoped>

</style>