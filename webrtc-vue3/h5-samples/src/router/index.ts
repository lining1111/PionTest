import {createRouter, createWebHistory} from 'vue-router'
import Camera from "@/views/Camera.vue";
import Microphone from "@/views/Microphone.vue";
import Canvas from "@/views/Canvas.vue";
import ScreenSharing from "@/views/ScreenSharing.vue";
import VideoFilter from "@/views/VideoFilter.vue";
import Resolution from "@/views/Resolution.vue";
import AudioVolume from "@/views/AudioVolume.vue";
import DeviceSelect from "@/views/DeviceSelect.vue";
import MediaSettings from "@/views/MediaSettings.vue";
import RecordAudio from "@/views/RecordAudio.vue";
import RecordScreen from "@/views/RecordScreen.vue";
import RecordCanvas from "@/views/RecordCanvas.vue";
import RecordVideo from "@/views/RecordVideo.vue";
import MediaStreamAPI from "@/views/MediaStreamAPI.vue";
import CaptureVideo from "@/views/CaptureVideo.vue";
import CaptureCanvas from "@/views/CaptureCanvas.vue";
import PeerConnection from "@/views/PeerConnection.vue";
import PeerConnectionVideo from "@/views/PeerConnectionVideo.vue";
import PeerConnectionCanvas from "@/views/PeerConnectionCanvas.vue";
import DataChannel from "@/views/DataChannel.vue";
import DataChannelFile from "@/views/DataChannelFile.vue";
import P2PClient from "@/views/P2PClient.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/camera',
            name: 'camera',
            component: Camera,
        },
        {
            path: '/microphone',
            name: 'microphone',
            component: Microphone,
        },
        {
            path: '/canvas',
            name: 'canvas',
            component: Canvas,
        },
        {
            path: '/screenSharing',
            name: 'screenSharing',
            component: ScreenSharing,
        },
        {
            path: '/videoFilter',
            name: 'videoFilter',
            component: VideoFilter,
        },
        {
            path: '/resolution',
            name: 'resolution',
            component: Resolution,
        },
        {
            path: '/audioVolume',
            name: 'audioVolume',
            component: AudioVolume,
        },
        {
            path: '/deviceSelect',
            name: 'deviceSelect',
            component: DeviceSelect,
        },
        {
            path: '/mediaSettings',
            name: 'mediaSettings',
            component: MediaSettings,
        },
        {
            path: '/recordAudio',
            name: 'recordAudio',
            component: RecordAudio,
        },
        {
            path: '/recordScreen',
            name: 'recordScreen',
            component: RecordScreen,
        },
        {
            path: '/recordCanvas',
            name: 'recordCanvas',
            component: RecordCanvas,
        },
        {
            path: '/recordVideo',
            name: 'recordVideo',
            component: RecordVideo,
        },
        {
            path: '/mediaStreamAPI',
            name: 'mediaStreamAPI',
            component: MediaStreamAPI,
        },
        {
            path: '/captureVideo',
            name: 'captureVideo',
            component: CaptureVideo,
        },
        {
            path: '/captureCanvas',
            name: 'captureCanvas',
            component: CaptureCanvas,
        },
        {
            path: '/peerConnection',
            name: 'peerConnection',
            component: PeerConnection,
        },
        {
            path: '/peerConnectionVideo',
            name: 'peerConnectionVideo',
            component: PeerConnectionVideo,
        },
        {
            path: '/peerConnectionCanvas',
            name: 'peerConnectionCanvas',
            component: PeerConnectionCanvas,
        },
        {
            path: '/dataChannel',
            name: 'dataChannel',
            component: DataChannel,
        },
        {
            path: '/dataChannelFile',
            name: 'dataChannelFile',
            component: DataChannelFile,
        },
        {
            path: '/p2pClient',
            name: 'p2pClient',
            component: P2PClient,
        },
    ],
})

export default router
