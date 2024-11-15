var suuid = $('#videoAddr').val();
var pc
let config = {
    iceServers: [{
        urls: ["stun:stun.l.google.com:19302"]
    }]
};

let log = msg => {
    // document.getElementById('div').innerHTML += msg + '<br>'
    console.log(msg)
}

async function handleNegotiationNeededEvent() {
    //对端添加了媒体轨道，比如AddTrack
    console.log('handleNegotiationNeededEvent')
    let offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    getRemoteSdp();
}

function StartVideo() {
    suuid = $('#videoAddr').val();
    console.log('addr:', suuid)
    pc = new RTCPeerConnection(config);

    pc.onnegotiationneeded = handleNegotiationNeededEvent;
    pc.ontrack = function (event) {
        console.log('track kind',event.track.kind)
        let stream = new MediaStream();
        stream.addTrack(event.track);

        document.getElementById('remoteVideo').srcObject = stream;
        log(event.streams.length + ' track is delivered')
    }

    pc.oniceconnectionstatechange = e => log(pc.iceConnectionState)

    getCodecInfo();
}


function getCodecInfo() {
    $.get("http://localhost:8083/stream/codec/" + suuid, function (data) {
        try {
            data = JSON.parse(data);
        } catch (e) {
            console.log(e);
        } finally {
            console.log('codec:',data)
            $.each(data, function (index, value) {
                pc.addTransceiver(value.Type, {
                    'direction': 'sendrecv'
                })
            })
        }
    });
}

let sendChannel = null;

function getRemoteSdp() {
    $.post("http://localhost:8083/stream/receiver/" + suuid, {
        suuid: suuid,
        data: btoa(pc.localDescription.sdp)
    }, function (data) {
        try {
            pc.setRemoteDescription(new RTCSessionDescription({
                type: 'answer',
                sdp: atob(data)
            }))
        } catch (e) {
            console.warn(e);
        }
    });
}
