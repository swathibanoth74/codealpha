const socket = io(); // Assuming socket.io is used for WebSocket communication
let localStream;
const peers = {};

const startCallButton = document.getElementById('start-call');
const shareScreenButton = document.getElementById('share-screen');
const fileInput = document.getElementById('file-input');
const videoGrid = document.getElementById('video-grid');
const whiteboard = document.getElementById('whiteboard');
const ctx = whiteboard.getContext('2d');

// Get user media and start call
startCallButton.addEventListener('click', async () => {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const localVideo = document.createElement('video');
    localVideo.srcObject = localStream;
    localVideo.autoplay = true;
    localVideo.muted = true;
    videoGrid.appendChild(localVideo);

    socket.emit('join-room', ROOM_ID); // Replace ROOM_ID with actual room identifier

    socket.on('user-connected', userId => {
      connectToNewUser(userId, localStream);
    });

    socket.on('user-disconnected', userId => {
      if (peers[userId]) peers[userId].close();
    });

  } catch (error) {
    console.error('Error accessing media devices:', error);
  }
});

// Function to connect to a new user
function connectToNewUser(userId, stream) {
  const call = peer.call(userId, stream);
  const video = document.createElement('video');
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream);
  });
  call.on('close', () => {
    video.remove();
  });

  peers[userId] = call;
}

// Function to add video stream to the grid
function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.autoplay = true;
  videoGrid.appendChild(video);
}

// Screen sharing functionality using WebRTC
shareScreenButton.addEventListener('click', async () => {
  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const screenVideo = document.createElement('video');
    screenVideo.srcObject = screenStream;
    screenVideo.autoplay = true;
    screenVideo.muted = true;
    videoGrid.appendChild(screenVideo);

    // Broadcast screen sharing to other peers
    Object.keys(peers).forEach(userId => {
      const call = peer.call(userId, screenStream);
      call.on('stream', userScreenStream => {
        addVideoStream(screenVideo, userScreenStream);
      });
    });

  } catch (error) {
    console.error('Error sharing screen:', error);
  }
});

// File sharing functionality
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const data = reader.result;
    socket.emit('send-file', { file, data }); // Implement server-side handling for file transfer
  };
  reader.readAsDataURL(file);
});

// Whiteboard drawing functionality
let drawing = false;
let prevX = 0, prevY = 0;

whiteboard.addEventListener('mousedown', (e) => {
  drawing = true;
  prevX = e.clientX - whiteboard.offsetLeft;
  prevY = e.clientY - whiteboard.offsetTop;
});

whiteboard.addEventListener('mousemove', (e) => {
  if (drawing) {
    const currentX = e.clientX - whiteboard.offsetLeft;
    const currentY = e.clientY - whiteboard.offsetTop;
    drawLine(prevX, prevY, currentX, currentY);
    prevX = currentX;
    prevY = currentY;
  }
});

whiteboard.addEventListener('mouseup', () => {
  drawing = false;
});

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.stroke();
}
