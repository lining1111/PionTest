<script setup lang="ts">
import SoundMeter from '@/utils/soundmeter';
import {onMounted, reactive, ref} from "vue";

interface Data {
  //视频输入设备列表
  videoDevices: MediaDeviceInfo[],
  //音频输入设备列表
  audioDevices: MediaDeviceInfo[],
  //音频输出设备列表
  audioOutputDevices: MediaDeviceInfo[],
}

let state = reactive({
  //是否弹出对话框
  visible: false,
  //视频输入设备列表
  videoDevices :[],
  //音频输入设备列表
  audioDevices: [],
  //音频输出设备列表
  audioOutputDevices: [],
  //分辨率
  resolution: 'vga',
  //当前选择的音频输入设备
  selectedAudioDevice: "",
  //当前选择的视频输入设备
  selectedVideoDevice: "",
  //音频音量
  audioLevel: 0,
})

let stream;
let soundMeter;
let audioContext;

try {
  //AudioContext是用于管理和播放所有的声音
  //实例化AudioContext
  audioContext = new AudioContext();
} catch (e) {
  console.log('网页音频API不支持.');
}
onMounted(() => {
  if (window.localStorage) {
    //读取本地存储信息
    let deviceInfo = localStorage["deviceInfo"];
    if (deviceInfo) {
      //将JSON数据转成对象
      let info = JSON.parse(deviceInfo);
      //设置本地状态值
      state.selectedAudioDevice = info.audioDevice;
      state.selectedVideoDevice = info.videoDevice;
      state.resolution = info.resolution;
    }
  }
  //更新设备
  updateDevices().then((data) => {
    //判断当前选择的音频输入设备是否为空并且是否有设备
    if (state.selectedAudioDevice === "" && data.audioDevices.length > 0) {
      //默认选中第一个设备
      state.selectedAudioDevice = data.audioDevices[0].deviceId;
    }
    //判断当前选择的视频输入设备是否为空并且是否有设备
    if (state.selectedVideoDevice === "" && data.videoDevices.length > 0) {
      //默认选中第一个设备
      state.selectedVideoDevice = data.videoDevices[0].deviceId;
    }
    //设置设备列表状态值
    state.videoDevices = data.videoDevices as [];
    state.audioDevices = data.audioDevices as [];
    state.audioOutputDevices = data.audioOutputDevices as [];
  });
  console.log('state',state)
})

//更新设备
let updateDevices = () => {
  return new Promise<Data>((pResolve, pReject) => {
    //视频输入设备列表
    let videoDevices:MediaDeviceInfo[]=[];
    //音频输入设备列表
    let audioDevices :MediaDeviceInfo[]= [];
    //音频输出设备列表
    let audioOutputDevices:MediaDeviceInfo[] = [];
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

//音频音量处理
let soundMeterProcess = () => {
  //读取音量值,再乘以一个系数,可以得到音量条的宽度
  var val = (soundMeter.instant.toFixed(2) * 348) + 1;
  //设置音量值状态
  state.audioLevel = val;
  if (state.visible) {
    //每隔100毫秒调用一次soundMeterProcess函数,模拟实时检测音频音量
    setTimeout(soundMeterProcess, 100);
  }
}
//视频预览对象
let myDialog = ref();
//开始预览
let startPreview=()=> {
  //判断window对象里是否有stream
  if (stream) {
    //关闭音视频流
    closeMediaStream(stream);
  }
  let videoElement = ref();
  //SoundMeter声音测量,用于做声音音量测算使用的
  soundMeter = new SoundMeter(audioContext);
  // let soundMeterProcess = soundMeterProcess;

  //音频源
  let audioSource = state.selectedAudioDevice;
  //视频源
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
      .then(function (stream) {
        //成功返回音视频流
        videoElement.value.srcObject = stream;
        //将声音测量对象与流连接起来
        soundMeter.connectToSource(stream);
        //每隔100毫秒调用一次soundMeterProcess函数,模拟实时检测音频音量
        setTimeout(soundMeterProcess, 100);
        //返回枚举设备
        return navigator.mediaDevices.enumerateDevices();
      })
      .then((devces) => {
      })
      .catch((erro) => {
      });


}

//停止预览
let stopPreview = () => {
  //关闭音视频流
  if (stream) {
    closeMediaStream(stream);
  }
}

//关闭音视频流
let closeMediaStream = (stream) => {
  //判断stream是否为空
  if (!stream) {
    return;
  }
  var tracks, i, len;
  //判断是否有getTracks方法
  if (stream.getTracks) {
    //获取所有的Track
    tracks = stream.getTracks();
    //迭代所有Track
    for (i = 0, len = tracks.length; i < len; i += 1) {
      //停止每个Track
      tracks[i].stop();
    }
  } else {
    //获取所有的音频Track
    tracks = stream.getAudioTracks();
    //迭代所有音频Track
    for (i = 0, len = tracks.length; i < len; i += 1) {
      //停止每个Track
      tracks[i].stop();
    }
    //获取所有的视频Track
    tracks = stream.getVideoTracks();
    //迭代所有视频Track
    for (i = 0, len = tracks.length; i < len; i += 1) {
      //停止每个Track
      tracks[i].stop();
    }
  }
}

//弹出对话框
let showModal = () => {
  console.log('showModal')
  state.visible = true;
  //延迟100毫秒后开始预览
  setTimeout(startPreview, 100);
}

//点击确定处理
let handleOk = (e) => {
  //关闭对话框
  state.visible = false;
  //判断是否能存储
  if (window.localStorage) {
    //设置信息
    let deviceInfo = {
      //音频设备Id
      audioDevice: state.selectedAudioDevice,
      //视频设备Id
      videoDevice: state.selectedVideoDevice,
      //分辨率
      resolution: state.resolution,
    };
    //使用JSON转成字符串后存储在本地
    localStorage["deviceInfo"] = JSON.stringify(deviceInfo);
  }
  //停止预览
  stopPreview();
}

//取消设置
let handleCancel = (e) => {
  //关闭对话框
  state.visible = false
  //停止预览
  stopPreview();
}

//音频输入设备改变
let handleAudioDeviceChange = (e) => {
  console.log('选择的音频输入设备为: ' + JSON.stringify(e));
  state.selectedAudioDevice = e;
  setTimeout(startPreview, 100);
}
//视频输入设备改变
let handleVideoDeviceChange = (e) => {
  console.log('选择的视频输入设备为: ' + JSON.stringify(e));
  state.selectedVideoDevice = e;
  setTimeout(startPreview, 100);
}
//分辨率选择改变
let handleResolutionChange = (e) => {
  console.log('选择的分辨率为: ' + JSON.stringify(e));
  state.resolution = e;
}
</script>

<template>
  <div>
    <h3>
      设置综合示例
    </h3>
    <button @click=showModal>修改设备</button>

    <el-dialog ref="myDialog"
        title="修改设备"
        v-model="state.visible">
      <el-button @click="handleOk">确定</el-button>
      <el-button @click="handleCancel">取消</el-button>
      <div class="item">
        <span class="item-left">麦克风</span>
        <div class="item-right">
          <el-select v-model=state.selectedAudioDevice :style="{ width: 350 }"
                     @change=handleAudioDeviceChange>
            <el-option v-for="device in (state.audioDevices as MediaDeviceInfo[])"
                       :value="device.deviceId"
                       :key="device.deviceId"
            >{{ device.label }}
            </el-option>
          </el-select>
          <div ref="progressbar" :style="{
               width: state.audioLevel + 'px',
          height: '10px',
          backgroundColor: '#8dc63f',
          marginTop: '20px',
          }">
          </div>
        </div>
      </div>
      <div class="item">
        <span class="item-left">摄像头</span>
        <div class="item-right">
          <el-select v-model=state.selectedVideoDevice :style="{ width: 350 }"
                     @change=handleVideoDeviceChange>
            <el-option v-for="device in (state.videoDevices as MediaDeviceInfo[])"
                       :value="device.deviceId"
                       :key="device.deviceId"
            >{{ device.label }}
            </el-option>
          </el-select>
          <div class="video-container">
            <video id='videoElement' ref='videoElement' autoPlay playsInline
                   :style="{ width: '100%', height: '100%', objectFit: 'contain' }"></video>
          </div>

        </div>
      </div>
      <div class="item">
        <span class="item-left">清晰度</span>
        <div class="item-right">
          <el-select :style="{ width: 350 }" v-model=state.resolution @change=handleResolutionChange>
            <el-option value="qvga">流畅(320x240)</el-option>
            <el-option value="vga">标清(640x360)</el-option>
            <el-option value="hd">高清(1280x720)</el-option>
            <el-option value="fullhd">超清(1920x1080)</el-option>
          </el-select>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>

</style>