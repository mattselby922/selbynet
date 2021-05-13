/*
Author: Matt Selby
Resources: https://gabrieltanner.org/blog/webrtc-video-broadcast
           https://www.youtube.com/watch?v=DvlyzDZDEq4&t=754s

              "Selbynet was developed as part of a
  capstone project at SUNY Polytechnic University, in Spring of 2021,
              under the supervision of Scott Spetka.">
*/

const myVideo = document.createElement('video')
myVideo.muted = true; // Mutes our own video stream audio so we don't get feedback

navigator.mediaDevices
.getUserMedia(constraints)
.then(stream => {
    video.srcObject = stream;
    socket.emit("broadcaster");
})
.catch(error => console.error(error));

function addVideoStream(video, stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })

}


/*
//RTCPeerConnection
socket.on("watcher", id => {
    const peerConnection = new RTCPeerConnection(config);
    peerConnections[id] = peerConnection;

    let stream = video.srcObject;
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

    peerConnection.onicecandidate = event => {
        if(event.candidate){
            socket.emit("candidate", id, event.candidate);
        }
    };

    peerConnection
        .createOffer()
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => {
            socket.emit("offer", id, peerConnection.localDescription);
        });
});

socket.on("answer", (id, description) => {
    peerConnections[id].setRemoteDescription(description);
});

socket.on("candidate", (id, candidate) => {
    peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
});*/