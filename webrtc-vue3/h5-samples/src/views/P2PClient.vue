<script setup lang="js">
import P2PLogin from "@/p2p/P2PLogin.vue";
import P2PVideoCall from '@/p2p/P2PVideoCall'
import LocalVideoView from "@/p2p/LocalVideoView.vue";
import RemoteVideoView from "@/p2p/RemoteVideoView.vue";

let p2pVideoCall = null;
let state = {
  //Users数组
  users: [],
  //自己Id
  userId: null,
  //用户名
  userName: '',
  //房间号
  roomId: '111111',
  //是否正在视频通话
  isVideoCall: false,
  //是否登录房间
  isLogin: false,
  //本地流
  localStream: null,
  //远端流
  remoteStream: null,
  //禁用音频
  audioMuted: false,
  //禁用视频
  videoMuted: false,
};

let connectServer = () => {
  //WebSocket连接url
  var p2pUrl = 'wss://' + window.location.hostname + ':8000/ws';
  var turnUrl = 'https://' + window.location.hostname + ':9000/api/turn?service=turn&username=sample';
  console.log("信令服务器地址:" + p2pUrl);
  console.log("中转服务器地址:" + turnUrl);
  //初始化信令 传入url及名称
  p2pVideoCall = new P2PVideoCall(p2pUrl, turnUrl, state.userName, state.roomId);
  //监听更新用户列表事件
  p2pVideoCall.on('updateUserList', (users, self) => {
    state.users = users;
    state.userId = self;
  });
  //监听新的呼叫事件
  p2pVideoCall.on('newCall', (from, sessios) => {
    state.isVideoCall = true;
  });
  //监听新本地流事件
  p2pVideoCall.on('localstream', (stream) => {
    state.localStream = stream;
  });
  //监听新远端流添加事件
  p2pVideoCall.on('addstream', (stream) => {
    state.remoteStream = stream;
  });
  //监听远端流移除事件
  p2pVideoCall.on('removestream', (stream) => {
    state.remoteStream = null;
  });
  //监听会话结束事件
  p2pVideoCall.on('hangUp', (to, session) => {
    state.isVideoCall = false;
    state.localStream = null;
    state.remoteStream = null;
  });
  //监听离开事件
  p2pVideoCall.on('leave', (to) => {
    state.isVideoCall = false;
    state.localStream = null;
    state.remoteStream = null;
  });
}

//呼叫对方参与会话
let handleStartCall = (remoteUserId, type) => {
  p2pVideoCall.startCall(remoteUserId, type);
}

//挂断处理
let handleUp = () => {
  p2pVideoCall.hangUp();
}

//打开/关闭本地视频
let onVideoOnClickHandler = () => {
  let videoMuted = !state.videoMuted;
  onToggleLocalVideoTrack(videoMuted);
  state.videoMuted = videoMuted;
}

let onToggleLocalVideoTrack = (muted) => {
  //获取所有视频频轨道
  var videoTracks = state.localStream.getVideoTracks();
  if (videoTracks.length === 0) {
    console.log("没有本地视频.");
    return;
  }
  console.log("打开/关闭本地视频.");
  //循环迭代所有轨道
  for (var i = 0; i < videoTracks.length; ++i) {
    //设置每个轨道的enabled值
    videoTracks[i].enabled = !muted;
  }
}

//打开/关闭本地音频
let onAudioClickHandler = () => {
  let audioMuted = !state.audioMuted;
  onToggleLocalAudioTrack(audioMuted);
  state.audioMuted = audioMuted;
}

let onToggleLocalAudioTrack = (muted) => {
  //获取所有音频轨道
  var audioTracks = state.localStream.getAudioTracks();
  if (audioTracks.length === 0) {
    console.log("没有本地音频");
    return;
  }
  console.log("打开/关闭本地音频.");
  //循环迭代所有轨道
  for (var i = 0; i < audioTracks.length; ++i) {
    //设置每个轨道的enabled值
    audioTracks[i].enabled = !muted;
  }
}

let loginHandler = (userName, roomId) => {
  state.isLogin = true;
  state.userName = userName;
  state.roomId = roomId;
  connectServer();
}

</script>

<template>
  <div>
    <h3>
      一对一视频通话示例
    </h3>
    <P2PLogin v-if="!state.isLogin" :loginHandler="loginHandler" />
    <!--    <el-table v-if="state.isVideoCall" bordered title="一对一视频通话案例" :data="state.users" >-->
    <!--      <el-table-column prop="name+id" label="ID">-->
    <!--        <div v-if=""></div>-->
    <!--      </el-table-column>-->
    <!--      {-->
    <!--      //迭代所有的用户-->
    <!--      this.state.users.map((user, i) => {-->
    <!--      return (-->
    <!--      <List.Item key={user.id}>-->
    <!--        <div className="list-item">-->
    <!--          {user.name + user.id}-->
    <!--          {user.id !== this.state.userId &&-->
    <!--          <div>-->
    <!--            <el-button type="link" @click="()=> {handleStartCall(user.id, 'video')}">视频</el-button>-->
    <!--            <el-button type="link" @click="()=> {handleStartCall(user.id, 'screen')}">共享桌面</el-button>-->
    <!--          </div>-->
    <!--          }-->
    <!--        </div>-->
    <!--      </List.Item>-->
    <!--      )-->
    <!--      })-->
    <!--      }-->
    <!--    </el-table>-->

    <div>
      <!--        渲染远端视频-->
      <RemoteVideoView v-if="state.remoteStream" :stream=state.remoteStream id='remoteview'/>
      <!--        渲染本地视频-->
      <LocalVideoView v-if="state.localStream" :stream=state.localStream :muted=state.videoMuted id='localview'/>
    </div>
    <div class="btn-tools">
      <!--        打开/关闭视频-->
      <el-button ghost size="large" round
                 @click=onVideoOnClickHandler>打开/关闭视频
      </el-button>
      <!--        挂断-->
      <el-button ghost size="large" round
                 @click=handleUp>挂断
      </el-button>
      <!--        打开/关闭音频-->
      <el-button ghost size="large" round
                 @click=onAudioClickHandler>打开/关闭音频
      </el-button>
    </div>
  </div>
</template>

<style scoped>

</style>