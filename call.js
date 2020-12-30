let localVideo = document.getElementById('local-video');
let remoteVideo = document.getElementById('remote-video');

localVideo.style.opacity = 0;
remoteVideo.style.opacity = 0;

localVideo.onplaying = () => {
  localVideo.style.opacity = 1;
};
remoteVideo.onplaying = () => {
  remoteVideo.style.opacity = 1;
};

let peer;
function init(userId) {
  peer = new Peer(userId, {
    host: '192.168.254.8',
    port: 3000,
    path: '/video',
  });
  peer.on('open', () => {
    console.log('peer added', userId);
  });
  listen();
}

let localStream;
function listen() {
  peer.on('call', async (call) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      localVideo.srcObject = stream;
      localStream = stream;

      call.answer(stream);
      call.on('stream', (remoteStream) => {
        remoteVideo.srcObject = remoteStream;

        remoteVideo.className = 'primary-video';
        localVideo.className = 'secondary-video';
      });
    } catch (error) {
      console.log('err', error);
    }
  });
}

async function startCall(otherUserId) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    localVideo.srcObject = stream;
    localStream = stream;

    const call = peer.call(otherUserId, stream);
    call.on('stream', (remoteStream) => {
      remoteVideo.srcObject = remoteStream;

      remoteVideo.className = 'primary-video';
      localVideo.className = 'secondary-video';
    });
  } catch (error) {
    console.log('ert', error);
  }
}

function toggleVideo(b) {
  if (b == 'true') {
    localStream.getVideoTracks()[0].enabled = true;
  } else {
    localStream.getVideoTracks()[0].enabled = false;
  }
}

function toggleAudio(b) {
  if (b == 'true') {
    localStream.getAudioTracks()[0].enabled = true;
  } else {
    localStream.getAudioTracks()[0].enabled = false;
  }
}

// document.querySelector('#btn').addEventListener('click', (e) => {
//   console.log('here i am clicked');
//   // init('1');
// });
// document.getElementById('start').addEventListener('click', (e) => {
//   console.log('here i am clicked');
//   init('2');
// });
