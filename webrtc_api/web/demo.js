//https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API

//获取多媒体设备信息
// MediaDevices 的方法 enumerateDevices() 请求一个可用的媒体输入和输出设备的列表，例如麦克风，摄像机，耳机设备等。
// 返回的 Promise 完成时，会带有一个描述设备的 MediaDeviceInfo 的数组。
//https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/mediaDevices
function printDevicesInfo(devices) {
    devices.forEach(function (device) {
        console.log(
            device.kind + ": " + device.label + " id = " + device.deviceId + " groupId = " + device.groupId,
        );
    });
}

function getMediaDevicesInfo() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices()) {
        console.log("不支持 enumerateDevices")
        return
    }
    //列出相机和麦克风
    navigator.mediaDevices.enumerateDevices().then(function (devices) {
        printDevicesInfo(devices)
    }).catch(function (err) {
        console.log(err.name + ":" + err.message)
    })
}


//MediaStream，里面包含了请求的媒体类型的轨道。此流可以包含一个视频轨道（来自硬件或者虚拟视频源，比如相机、视频采集设备和屏幕共享服务等等）、
// 一个音频轨道（同样来自硬件或虚拟音频源，比如麦克风、A/D 转换器等等），也可能是其他轨道类型
//https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStream


//将摄像头显示到界面
//MediaDevices.getUserMedia() 会提示用户给予使用媒体输入的许可，媒体输入会产生一个MediaStream，里面包含了请求的媒体类型的轨道。
// 此流可以包含一个视频轨道（来自硬件或者虚拟视频源，比如相机、视频采集设备和屏幕共享服务等等）、一个音频轨道（同样来自硬件或虚拟音频源，比如麦克风、A/D 转换器等等），
// 也可能是其他轨道类型。
// 它返回一个 Promise 对象，成功后会resolve回调一个 MediaStream 对象。若用户拒绝了使用权限，或者需要的媒体源不可用，
// promise会reject回调一个 PermissionDeniedError 或者 NotFoundError 。
isshowCameraVideo = false

function getCameraMedia() {
    var localVideo = document.getElementById('localCameraVideo')
    navigator.mediaDevices
        .getUserMedia({audio: false, video: true})
        .then(function (stream) {
            stream.getVideoTracks().forEach(track => {
                console.log(`id:${track.id},kind:${track.kind},label:${track.label}`)
            })
            /* 使用这个 stream stream */
            if (!isshowCameraVideo) {
                localVideo.srcObject = stream
                isshowCameraVideo = true
            } else {
                localVideo.srcObject = null
                isshowCameraVideo = false
            }
        })
        .catch(function (err) {
            /* 处理 error */
            console.log(err.name + ":" + err.message)
        });
}

//将桌面显示到桌面
//这个 MediaDevices 接口的 getDisplayMedia() 方法提示用户去选择和授权捕获展示的内容或部分内容（如一个窗口）在一个MediaStream 里。
// 然后，这个媒体流可以通过使用 MediaStream Recording API 被记录或者作为WebRTC 会话的一部分被传输。
isshowScreenVideo = false

function getScreenMedia() {
    var localVideo = document.getElementById('localScreenVideo')
    navigator.mediaDevices
        .getDisplayMedia({audio: false, video: true})
        .then(function (stream) {
            /* 使用这个 stream stream */
            if (!isshowScreenVideo) {
                localVideo.srcObject = stream
                isshowScreenVideo = true
            } else {
                localVideo.srcObject = null
                isshowScreenVideo = false
            }
        })
        .catch(function (err) {
            /* 处理 error */
            console.log(err.name + ":" + err.message)
        });
}

//发送到对端
//RTCPeerConnection 接口表示本地端和远程对等端之间的 WebRTC 连接。它提供了创建远程对等端连接、维护和监视连接，以及在连接不再需要时关闭连接的方法。
//媒体协商流程 A B两个端
//1 A RTCPeerConnection createOffer 将生成的offerSDP通过 RTCPeerConnection 的 setLocalDescription设置为本端描述
//2 A 将offerSDP通过信令服务器发送给B
//3 B收到A发送的offerSDP,调用RTCPeerConnection 的 setRemoteDescription 将其设置为远端描述
//4 B 调用RTCPeerConnection createAnswer 生成 answerSDP,然后将 answerSDP通过RTCPeerConnection setLocalDescription设置为本端描述
//5 B 将answerSDP通过信令服务器发送给A
//6 A 收到B发送的answerSDP 调用RTCPeerConnection 的 setRemoteDescription 将其设置为远端描述

var signaler = null
var pc = null

async function RTPPC_Op() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log(`getUserMedia not supported`)
    } else {
        navigator.mediaDevices.getUserMedia({video: true}).then(function (stream) {
            document.getElementById('localCameraVideo').srcObject = stream
            pc = new RTCPeerConnection();
            signaler = new SignalingChannel();
            stream.getVideoTracks().forEach(track => {
                pc.addTrack(track, stream);
            })
            handlerPC(pc)
            handlerSingaler(signaler)
        }).catch(err => {
            console.log(err.message)
        })

    }
}

function SignalingChannel() {
    var ws = new WebSocket(`ws://localhost:8080/websocket`)

    return ws;
}

function handlerSingaler(signaler) {
    signaler.onclose = () => {
        window.alert('signaler close')
    }
    signaler.onmessage = (ev) => {
        let msg = JSON.parse(ev.data)
        if (!msg) {
            return console.log('failed to parse msg')
        }

        switch (msg.event) {
            case 'offer':
                console.log('ws recv offer')
                let offer = JSON.parse(msg.data)
                if (!offer) {
                    return console.log('failed to parse answer')
                }
                pc.setRemoteDescription(offer)
                pc.createAnswer().then(answer => {
                    pc.setLocalDescription(answer)
                    signaler.send(JSON.stringify({event: 'answer', data: JSON.stringify(answer)}))
                    console.log('send answer to signaler')
                })
                return

            case 'candidate':
                console.log('ws recv candidate')
                let candidate = JSON.parse(msg.data)
                if (!candidate) {
                    return console.log('failed to parse candidate')
                }

                pc.addIceCandidate(candidate)
        }
    }
    signaler.onerror = ev => {
        console.log("ERROR: " + evt.data)
    }
}

function handlerPC(pc) {
    pc.ontrack = function (event) {
        console.log('track get')
        if (event.track.kind === 'audio') {
            return
        }

        //将远程多媒体数据添加到web界面
        addRemoteVideo(event)

    }

    pc.onicecandidate = ev => {
        //将候选者信息通过信令服务器发送到对端
        if (ev.candidate) {
            console.log('send candidate to signaler', ev.candidate)
            var msg = {
                event: 'candidate',
                data: JSON.stringify(ev.candidate)
            }
            signaler.send(JSON.stringify(msg))
        }

    }
}


function addRemoteVideo(event) {
    let el = document.createElement(event.track.kind)
    el.srcObject = event.streams[0]
    el.autoplay = true
    el.controls = true
    document.getElementById('remoteVideos').appendChild(el)
    console.log('add remoteVideo')
    event.track.onmute = function (event) {
        el.play()
    }

    event.streams[0].onremovetrack = ({track}) => {
        if (el.parentNode) {
            el.parentNode.removeChild(el)
        }
    }
}