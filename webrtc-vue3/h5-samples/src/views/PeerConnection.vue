<script setup lang="ts">
import {onMounted, ref} from "vue";

//本地视频
let localVideo = ref();
//远端视频
let remoteVideo = ref();
//本地流
let localStream;
//PeerA连接对象
let peerConnA;
//PeerB连接对象
let peerConnB;

onMounted(()=>{
  //获取本地视频尺寸
  localVideo.value.addEventListener('loadedmetadata', () => {
    console.log(`本地视频尺寸为: videoWidth: ${localVideo.value.videoWidth}px,  videoHeight: ${localVideo.value.videoHeight}px`);
  });

  //获取远端视频尺寸
  remoteVideo.value.addEventListener('loadedmetadata', () => {
    console.log(`远端视频尺寸为: videoWidth: ${remoteVideo.value.videoWidth}px,  videoHeight: ${remoteVideo.value.videoHeight}px`);
  });

  //监听远端视频尺寸大小变化
  remoteVideo.value.addEventListener('resize', () => {
    console.log(`远端视频尺寸为: ${remoteVideo.value.videoWidth}x${remoteVideo.value.videoHeight}`);
  });
})

//开始
let start = async () => {
  console.log('开始获取本地媒体流');
  try {
    //获取音视频流
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    console.log('获取本地媒体流成功');
    //本地视频获取流
    localVideo.value.srcObject = stream;
    localStream = stream;
  } catch (e) {
    console.log("getUserMedia错误:" + e);
  }
}

//呼叫
let call = async () => {
  console.log('开始呼叫...');
  //视频轨道
  const videoTracks = localStream.getVideoTracks();
  //音频轨道
  const audioTracks = localStream.getAudioTracks();
  //判断视频轨道是否有值
  if (videoTracks.length > 0) {
    //输出摄像头的名称
    console.log(`使用的视频设备为: ${videoTracks[0].label}`);
  }
  //判断音频轨道是否有值
  if (audioTracks.length > 0) {
    //输出麦克风的名称
    console.log(`使用的音频设备为: ${audioTracks[0].label}`);
  }

  //设置ICE Server,使用Google服务器
  const configuration = <RTCConfiguration>{
    "iceServers": [
        { urls: ["stun:stun.l.google.com:19302"] }
    ]
  };

  //创建RTCPeerConnection对象
  peerConnA = new RTCPeerConnection(configuration);
  console.log('创建本地PeerConnection成功:peerConnA');
  //监听返回的Candidate信息
  peerConnA.addEventListener('icecandidate', onIceCandidateA);

  //创建RTCPeerConnection对象
  peerConnB = new RTCPeerConnection(configuration);
  console.log('创建本地PeerConnection成功:peerConnB');
  //监听返回的Candidate信息
  peerConnB.addEventListener('icecandidate',  onIceCandidateB);

  //监听ICE状态变化
  peerConnA.addEventListener('iceconnectionstatechange', onIceStateChangeA);
  //监听ICE状态变化
  peerConnB.addEventListener('iceconnectionstatechange', onIceStateChangeB);

  //监听track事件,可以获取到远端视频流
  peerConnB.addEventListener('track', gotRemoteStream);

  //peerConnA.addStream(localStream);
  //循环迭代本地流的所有轨道
  localStream.getTracks().forEach((track) => {
    //把音视频轨道添加到连接里去
    peerConnA.addTrack(track, localStream)
  });
  console.log('将本地流添加到peerConnA里');

  try {
    console.log('peerConnA创建提议Offer开始');
    //创建提议Offer
    const offer = await peerConnA.createOffer();
    //创建Offer成功
    await onCreateOfferSuccess(offer);
  } catch (e) {
    //创建Offer失败
    onCreateSessionDescriptionError(e);
  }
}

//创建会话描述错误
let onCreateSessionDescriptionError = (error) => {
  console.log(`创建会话描述SD错误: ${error.toString()}`);
}

//创建提议Offer成功
let onCreateOfferSuccess = async (desc) => {
  //peerConnA创建Offer返回的SDP信息
  console.log(`peerConnA创建Offer返回的SDP信息\n${desc.sdp}`);
  console.log('设置peerConnA的本地描述start');
  try {
    //设置peerConnA的本地描述
    await peerConnA.setLocalDescription(desc);
    onSetLocalSuccess(peerConnA);
  } catch (e) {
    onSetSessionDescriptionError(e);
  }

  console.log('peerConnB开始设置远端描述');
  try {
    //设置peerConnB的远端描述
    await peerConnB.setRemoteDescription(desc);
    onSetRemoteSuccess(peerConnB);
  } catch (e) {
    //创建会话描述错误
    onSetSessionDescriptionError(e);
  }

  console.log('peerConnB开始创建应答Answer');
  try {
    //创建应答Answer
    const answer = await peerConnB.createAnswer();
    //创建应答成功
    await onCreateAnswerSuccess(answer);
  } catch (e) {
    //创建会话描述错误
    onCreateSessionDescriptionError(e);
  }
}

//设置本地描述完成
let onSetLocalSuccess = (pc) => {
  console.log(`${getName(pc)}设置本地描述完成:setLocalDescription`);
}

//设置远端描述完成
let onSetRemoteSuccess = (pc) => {
  console.log(`${getName(pc)}设置远端描述完成:setRemoteDescription`);
}

//设置描述SD错误
let onSetSessionDescriptionError = (error) => {
  console.log(`设置描述SD错误: ${error.toString()}`);
}

let getName = (pc) => {
  return (pc === peerConnA) ? 'peerConnA' : 'peerConnB';
}

//获取到远端视频流
let gotRemoteStream = (e) => {
  if (remoteVideo.value.srcObject !== e.streams[0]) {
    //取集合第一个元素
    remoteVideo.value.srcObject = e.streams[0];
    console.log('peerConnB开始接收远端流');
  }
}

//创建应答成功
let onCreateAnswerSuccess = async (desc) => {
  //输出SDP信息
  console.log(`peerConnB的应答Answer数据:\n${desc.sdp}`);
  console.log('peerConnB设置本地描述开始:setLocalDescription');
  try {
    //设置peerConnB的本地描述信息
    await peerConnB.setLocalDescription(desc);
    onSetLocalSuccess(peerConnB);
  } catch (e) {
    onSetSessionDescriptionError(e);
  }
  console.log('peerConnA设置远端描述开始:setRemoteDescription');
  try {
    //设置peerConnA的远端描述,即peerConnB的应答信息
    await peerConnA.setRemoteDescription(desc);
    onSetRemoteSuccess(peerConnA);
  } catch (e) {
    onSetSessionDescriptionError(e);
  }
}

//Candidate事件回调方法
let onIceCandidateA = async (event) => {
  try {
    if(event.candidate){
      //将会peerConnA的Candidate添加至peerConnB里
      await peerConnB.addIceCandidate(event.candidate);
      onAddIceCandidateSuccess(peerConnB);
    }
  } catch (e) {
    onAddIceCandidateError(peerConnB, e);
  }
  console.log(`IceCandidate数据:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
}

//Candidate事件回调方法
let onIceCandidateB = async (event) => {
  try {
    if(event.candidate){
      //将会peerConnB的Candidate添加至peerConnA里
      await peerConnA.addIceCandidate(event.candidate);
      onAddIceCandidateSuccess(peerConnA);
    }
  } catch (e) {
    onAddIceCandidateError(peerConnA, e);
  }
  console.log(`IceCandidate数据:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
}

//添加Candidate成功
let onAddIceCandidateSuccess = (pc) => {
  console.log(`${getName(pc)}添加IceCandidate成功`);
}

//添加Candidate失败
let onAddIceCandidateError = (pc, error) => {
  console.log(`${getName(pc)}添加IceCandidate失败: ${error.toString()}`);
}

//监听ICE状态变化事件回调方法
let onIceStateChangeA = (event) => {
  console.log(`peerConnA连接的ICE状态: ${peerConnA.iceConnectionState}`);
  console.log('ICE状态改变事件: ', event);
}

//监听ICE状态变化事件回调方法
let onIceStateChangeB = (event) => {
  console.log(`peerConnB连接的ICE状态: ${peerConnB.iceConnectionState}`);
  console.log('ICE状态改变事件: ', event);
}

//断开连接
let hangup = () => {
  console.log('结束会话');
  //关闭peerConnA
  peerConnA.close();
  //关闭peerConnB
  peerConnB.close();
  //peerConnA置为空
  peerConnA = null;
  //peerConnB置为空
  peerConnB = null;
}


</script>

<template>
  <div>
    <h3>
      RTCPeerConnection示例
    </h3>
    {/* 本地视频 */}
    <video ref="localVideo" playsInline autoPlay muted></video>
    {/* 远端视频 */}
    <video ref="remoteVideo" playsInline autoPlay></video>
    <div>
      <el-button ref="startButton" @click=start :style='{marginRight:"10px"}'>开始</el-button>
      <el-button ref="callButton" @click=call :style='{marginRight:"10px"}'>呼叫</el-button>
      <el-button ref="hangupButton" @click=hangup :style='{marginRight:"10px"}'>挂断</el-button>
    </div>
  </div>
</template>

<style scoped>

</style>