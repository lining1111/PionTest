# 基于Pion的golang 音视频开发

    https://github.com/pion 一个开源的用golang编写的即时音视频库 webrtc
    webrtc （Web Real-Time Communication）的缩写，网页即时通信，是一种支持网页浏览器进行实时语音通话或者视频聊天的技术，是谷歌收购的一项技术
    
    web相关的描述信息可以在 https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API
    
    sip (Session initialization Protocol) 是一个应用层的信令控制协议。用于创建、修改和释放一个或多个参与者的会话。这些会话可以是Internet多媒体会议、IP电话或多媒体分发。会话的参与者可以通过组播（multicast）、网状单播（unicast）或两者的混合体进行通信。
    SDP（会话描述协议）是一个描述 P2P 连接的标准，包含音视频的编解码器、源地址和时间信息
    
    信令服务器：在通信的双方建立连接前，交换必要的信息，比如网络信息、媒体参数等
    STUN服务器：NAT 会话穿越应用程序）是一个用于绕过 NAT（网络地址转换器）传递数据的辅助协议。STUN 会返回一台位于 NAT 背后的已接入网络的计算机的 IP 地址、端口和连通状态
    TURN服务器：使用中继器穿透 NAT）是一个能够让位于网络地址转换（NAT）或者防火墙之后的主机接受和发送数据的协议。WebRTC 使用 TURN 允许互联网上的任何两台设备进入点对点连接。

## webrtc 中重要的东西
    SDP：信令服务器交换会话描述协议
    offer/answer SDP
    candidate ICE候选者（Interactive Connectivity Establishment Candidates）交互式连接建立候选人

    三个服务器：
        信令服务器：将接入的客户端(pc)的SDP交换出去
        STUN服务器：处于公网上，客户端(pc)通过它来确定自己的公网ip和端口
        TURN服务器：不仅用于发现客户端的公网IP地址和端口，还实际参与数据传输。
                    TURN服务器接收客户端的数据，并将其转发到目标客户端。
                    这种方式确保了即使在最复杂的NAT和防火墙环境中，WebRTC通信仍然可以进行


## webrtc_api
    
    webrtc+websocket作即时视频通话
    go pion做的信令服务器，
    //以pc=RTCPeerConnection()
    //signaler = ws() (websocket server)
    //说明交互过程
    pc与signaler之间的交互过程:
    1、服务端起好 websocket server,等待ws客户端接入
    2、pc端，获取多媒体，建立pc，
        设置好pc的ontrack回调，回调内容为：将接入的远端多媒体轨道接入到本地，比如 video标签；
        设置好pc的onicecandidate触发,触发内容为：将接收到的接收的候选者信息发送到signaler
        新建ws客户端，接入到服务器端
    3、signaler接收到客户端接入的信息后，
        新建一个与客户端pc交互的本地pc.
        调用本地pc的AddTransceiverFromKind将音轨和视频轨加入到交互pc，
        将交互pc加入到本地交互pc数组中
        添加交互pc的OnICECandidate回调，回调内容为：将接收到的候选者信息再回送给pc客户端
        将客户端信息存入本地数组，
        添加交互pc的OnConnectionStateChange回调，处理断开情况
        添加交互pc的OnTrack回调，回调内容为：将接收到的多媒体都广播到其他客户端
        处理接入的所有交互pc，向新加入的交互pc发送offer

    所以整个过错是：
    1、signaler 收到新接入的客户端，创建交互pc，
        设置交互pc的OnICECandidate。向客户端发送 candidate
        新建offer，设置本地SDP SetLocalDescription，向新接入的客户端发送offer
    2、pc客户端接收到offer后，将offer设置为远端SDP setRemoteDescription，
        新建answer，设置为本地SDP setLocalDescription，同时发送自己的answer到signaler
    3、singlaer接收到answer后，将客户端的answer内容设置为远端SDP SetRemoteDescription
    4、pc和signaler将自己的候选者信息发送给对方，同时在ws通道内接收到candidate后调用pc的addIceCandidate
    6、pc和signaler的交互pc 设置 ontrack
    
    总结一下：
    ws中客户端与服务器端的交互就是，客户端client 与服务器的接入peer进行，交换信息
    通过这个通道通过发送 offer answer candidate 类型的信息完成信息协商。
    ##很重要的事情
    当 RTCPeerConnection 通过 RTCPeerConnection.setLocalDescription() 方法更改本地描述之后，
    该 RTCPeerConnection 会抛出 icecandidate 事件。该事件的监听器需要将更改后的描述信息传送给远端 RTCPeerConnection，以更新远端的备选源。
    
    该事件会在pc初始化后调用添加本地SDP后，触发OnICECandidate的回调函数    

## RTSPtoWebRTC

    参考 https://github.com/deepch/RTSPtoWebRTC

## RTSPtoWeb
    
    参考 https://github.com/deepch/RTSPtoWeb