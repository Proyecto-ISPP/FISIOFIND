console.log('In main.js!')

var mapPeers = {};

var usernameInput = document.querySelector('#username');
var btnJoin = document.querySelector('#btn-join');

var username;

var webSocket;

function webSocketOnMessage(event){
    var parsedData = JSON.parse(event.data);
    
    var peerUsername = parsedData['peer'];
    var action = parsedData['action'];

    if(username == peerUsername){
        return;
    }

    var receiver_channel_name = parsedData['message']['receiver_channel_name'];

    if(action == 'new-peer'){
        createOfferer(peerUsername, receiver_channel_name);

        return;
    }

    if(action == 'new-offer'){
        var offer = parsedData['message']['sdp'];

        createAnswerer(offer, peerUsername, receiver_channel_name);
        
        return;
    }

    if(action == 'new-answer'){
        var answer = parsedData['message']['sdp'];

        var peer = mapPeers[peerUsername][0];

        peer.setRemoteDescription(answer);

        return;
    }

    console.log('message: ', message)
}

btnJoin.addEventListener('click', () => {
    username = usernameInput.value;

    console.log('username: ', username)

    if(username == ''){
        return;
    }

    usernameInput.value = '';
    usernameInput.disabled = true;
    usernameInput.style.visibility = 'hidden';

    btnJoin.disabled = true;
    btnJoin.style.visibility = 'hidden';

    var labelUsername = document.querySelector('#label-username');
    labelUsername.innerHTML = username;

    var loc = window.location;
    var wsStart = 'ws://';

    if(loc.protocol == 'https:'){
        wsStart = 'wss://';
    }

    var endPoint = wsStart + loc.host + loc.pathname;

    console.log('endPoint: ', endPoint)

    webSocket = new WebSocket(endPoint)

    webSocket.addEventListener('open', (e) => {
        console.log('Connection Opened!');

        sendSignal('new-peer',{});
    });
    webSocket.addEventListener('message', webSocketOnMessage);

    webSocket.addEventListener('close', (e) => {
        console.log('Connection Closed!');
    });
    
    webSocket.addEventListener('error', (e) => {
        console.log('Error Occurred!');
    });
});

var localStream = new MediaStream();

const constraints = {
    'video': true,
    'audio': true
};

const localVideo = document.querySelector('#local-video');

const btnToggleAudio = document.querySelector('#btn-toggle-audio');

const btnToggleVideo = document.querySelector('#btn-toggle-video');

var userMedia = navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        localStream = stream;
        localVideo.srcObject = localStream;
        localVideo.muted = true;

        var audioTracks = stream.getAudioTracks();
        var videoTracks = stream.getVideoTracks();

        audioTracks[0].enabled = true;
        videoTracks[0].enabled = true;

        // Referencias a las imágenes dentro de los botones
        const audioIcon = document.querySelector('#btn-toggle-audio img');
        const videoIcon = document.querySelector('#btn-toggle-video img');

        btnToggleAudio.addEventListener('click', () => {
            audioTracks[0].enabled = !audioTracks[0].enabled;

            if (audioTracks[0].enabled) {
                audioIcon.src = "/static/icons/microphone.svg";  // Icono de micrófono activo
            } else {
                audioIcon.src = "/static/icons/microphone-mute.svg";  // Icono de micrófono muteado
            }
        });

        btnToggleVideo.addEventListener('click', () => {
            videoTracks[0].enabled = !videoTracks[0].enabled;

            if (videoTracks[0].enabled) {
                videoIcon.src = "/static/icons/video.svg";  // Icono de cámara activa
            } else {
                videoIcon.src = "/static/icons/video-off.svg";  // Icono de cámara apagada
            }
        });
    })
    .catch(error => {
        console.log('Error accessing media devices.', error);
    });


    var btnSendMsg = document.querySelector("#btn-send-msg");
    var messageList = document.querySelector("#message-list");
    var messageInput = document.querySelector("#msg");
    
    btnSendMsg.addEventListener("click", sendMsgOnClick);
    
    function sendMsgOnClick() {
        var message = messageInput.value.trim(); // Elimina espacios en blanco al inicio y final
    
        // Evita que se envíen mensajes vacíos o con solo espacios
        if (message === "") {
            alert("No puedes enviar un mensaje vacío.");
            return;
        }
    
        var li = document.createElement("li");
        li.appendChild(document.createTextNode("Me: " + message));
        messageList.appendChild(li);
    
        var dataChannels = getDataChannels();
    
        message = username + ": " + message;
    
        for (index in dataChannels) {
            dataChannels[index].send(message);
        }
    
        messageInput.value = ""; // Limpia el input después de enviar
    }
    

function sendSignal(action, message){
    var jsonStr = JSON.stringify({
        'peer': username,
        'action': action,
        'message': message,
    });

    webSocket.send(jsonStr);
}

function createOfferer(peerUsername, receiver_channel_name){
    var peer = new RTCPeerConnection(null);

    addLocalTracks(peer);

    var dc = peer.createDataChannel('channel');
    dc.addEventListener('open', () => {
        console.log('Connection opened!');
    });
    dc.addEventListener('message', dcOnMessage);

    var remoteVideo = createVideo(peerUsername);
    setOnTrack(peer, remoteVideo);

    mapPeers[peerUsername] = [peer, dc];

    peer.addEventListener('iceconnectionstatechange', () => {
        var iceConnectionState = peer.iceConnectionState;
    
        if (iceConnectionState === 'failed' || iceConnectionState === 'disconnected' || iceConnectionState === 'closed') {
            console.log("El usuario remoto se ha desconectado.");
    
            delete mapPeers[peerUsername];
    
            if (iceConnectionState !== 'closed') {
                peer.close();
            }
    
            // Obtener el video remoto y eliminarlo completamente
            const remoteVideo = document.getElementById(peerUsername + '-video'); 
    
            if (remoteVideo) {
                console.log("Eliminando el video remoto de", peerUsername);
                
                remoteVideo.srcObject = null; // Liberar el stream para evitar pantalla negra
                remoteVideo.remove();  // Elimina el elemento completamente del DOM
            }
        }
    });
    

    peer.addEventListener('icecandidate', (event) => {
        if(event.candidate){
            console.log('New ice candidate: ', JSON.stringify(peer.localDescription));

            return;
        }

        sendSignal('new-offer', {
            'sdp': peer.localDescription,
            'receiver_channel_name': receiver_channel_name
        });
    });

    peer.createOffer()
        .then(o => peer.setLocalDescription(o))
        .then(() => {
            console.log('Local description set successfully.');
        });
}

function createAnswerer(offer, peerUsername, receiver_channel_name){
    var peer = new RTCPeerConnection(null);

    addLocalTracks(peer);

    var remoteVideo = createVideo(peerUsername);
    setOnTrack(peer, remoteVideo);

    peer.addEventListener('datachannel', e => {
        peer.dc = e.channel;
        peer.dc.addEventListener('open', () => {
            console.log('Connection opened!');
        });
        peer.dc.addEventListener('message', dcOnMessage);
        
        mapPeers[peerUsername] = [peer, peer.dc];
    });

    peer.addEventListener('iceconnectionstatechange', () => {
        var iceConnectionState = peer.iceConnectionState;
    
        if (iceConnectionState === 'failed' || iceConnectionState === 'disconnected' || iceConnectionState === 'closed') {
            console.log("El usuario remoto se ha desconectado.");
    
            delete mapPeers[peerUsername];
    
            if (iceConnectionState !== 'closed') {
                peer.close();
            }
    
            // Obtener el video remoto y eliminarlo completamente
            const remoteVideo = document.getElementById(peerUsername + '-video'); 
    
            if (remoteVideo) {
                console.log("Eliminando el video remoto de", peerUsername);
                
                remoteVideo.srcObject = null; // Liberar el stream para evitar pantalla negra
                remoteVideo.remove();  // Elimina el elemento completamente del DOM
            }
        }
    });
    

    peer.addEventListener('icecandidate', (event) => {
        if(event.candidate){
            console.log('New ice candidate: ', JSON.stringify(peer.localDescription));

            return;
        }

        sendSignal('new-answer', {
            'sdp': peer.localDescription,
            'receiver_channel_name': receiver_channel_name
        });
    });

    peer.setRemoteDescription(offer)
        .then(() => {
            console.log('Remote description set succesfully for %s.', peerUsername);

            return peer.createAnswer();
        })
        .then(a => {
            console.log('Answer created!');

            peer.setLocalDescription(a);
        })
}

function addLocalTracks(peer) {
    localStream.getTracks().forEach(track => {
        let sender = peer.addTrack(track, localStream);
        senders.push(sender); // Guardamos los senders para poder reemplazarlos luego
    });

    return;
}

//function addLocalTracks(peer){
//    localStream.getTracks().forEach(track => {
//        peer.addTrack(track, localStream);
//    });

//    return;
//}

function dcOnMessage(event){
    var message = event.data;

    var li = document.createElement('li');
    li.appendChild(document.createTextNode(message));
    messageList.appendChild(li);
}

function createVideo(peerUsername){
    var videoContainer = document.getElementById('video-container');

    var remoteVideo = document.createElement('video');
    remoteVideo.id = peerUsername + '-video';  // Identificarlo con el nombre de usuario
    remoteVideo.autoplay = true;
    remoteVideo.playsInline = true;
    remoteVideo.style.width = "100%";
    remoteVideo.style.height = "100%";
    remoteVideo.style.borderRadius = "15px";
    remoteVideo.style.backgroundColor = "black";

    var videoWrapper = document.createElement('div');
    videoWrapper.classList.add("video-wrapper");

    videoContainer.appendChild(videoWrapper);
    videoWrapper.appendChild(remoteVideo);

    console.log("Se creó el video para", peerUsername);

    return remoteVideo;
}


function setOnTrack(peer, remoteVideo){
    var remoteStream = new MediaStream();

    // Asignamos el stream al video remoto
    remoteVideo.srcObject = remoteStream;

    peer.addEventListener('track', (event) => {
        console.log('Recibiendo pista remota:', event.track.kind);

        remoteStream.addTrack(event.track);

        // Si es la primera pista de video, asegurarse de mostrar el video
        if (event.track.kind === 'video') {
            remoteVideo.style.display = "block";  // Asegura que se vea
            remoteVideo.style.opacity = "1";
        }
    });

    console.log("Se configuró el evento 'ontrack' correctamente para", remoteVideo.id);
}


function remoteVideo(video){
    var videoWrapper = video.parentNode;

    videoWrapper.parentNode.removeChild(videoWrapper);
}

function getDataChannels(){
    var dataChannels = [];

    for(peerUsername in mapPeers){
        var dataChannel = mapPeers[peerUsername][1];

        dataChannels.push(dataChannel);
    }

    return dataChannels;
}

//Share Screen
var senders = [];
var btnShareScreen = document.querySelector('#btn-share-screen');
btnShareScreen.addEventListener('click', () => {
    shareScreen();
});

function shareScreen() {
    navigator.mediaDevices.getDisplayMedia({ video: { width: 1280, height: 720 }, cursor: true })
        .then(stream => {
            const screenTrack = stream.getTracks()[0];

            // Crear el contenedor de la pantalla compartida si no existe
            let screenContainer = document.getElementById('screen-container');
            if (!screenContainer) {
                screenContainer = document.createElement('div');
                screenContainer.id = 'screen-container';
                screenContainer.style.position = 'absolute';
                screenContainer.style.bottom = '10px';
                screenContainer.style.right = '10px';
                screenContainer.style.width = '30vw';  // Ocupa 1/3 de la pantalla
                screenContainer.style.height = 'auto';
                screenContainer.style.border = '2px solid #0AB9A3';
                screenContainer.style.borderRadius = '10px';
                screenContainer.style.overflow = 'hidden';
                screenContainer.style.zIndex = '1000';
                screenContainer.style.backgroundColor = 'black';
                document.body.appendChild(screenContainer);
            }

            // Crear un video para la pantalla compartida
            let screenVideo = document.getElementById('screen-video');
            if (!screenVideo) {
                screenVideo = document.createElement('video');
                screenVideo.id = 'screen-video';
                screenVideo.autoplay = true;
                screenVideo.playsInline = true;
                screenVideo.style.width = '100%';
                screenVideo.style.height = '100%';
                screenVideo.style.objectFit = 'cover'; // Mantiene aspecto estable
                screenContainer.appendChild(screenVideo);
            }

            // Asignar el stream al video
            screenVideo.srcObject = new MediaStream([screenTrack]);

            // Reemplazar el track de video en WebRTC
            let videoSender = senders.find(sender => sender.track.kind === 'video');
            if (videoSender) {
                videoSender.replaceTrack(screenTrack);
            }

            // Cuando el usuario deja de compartir pantalla
            screenTrack.onended = function () {
                let cameraTrack = localStream.getVideoTracks()[0]; // Recuperar cámara

                if (videoSender) {
                    videoSender.replaceTrack(cameraTrack);
                }

                // Restaurar la cámara en el video local
                localVideo.srcObject = localStream;

                // Remover el contenedor de la pantalla compartida
                screenContainer.remove();
            };
        })
        .catch(error => {
            console.error('Error sharing screen: ', error);
        });
}

const btnHangup = document.getElementById('btn-hangup');

btnHangup.addEventListener('click', () => {
    console.log("Cerrando la llamada...");
    
    // Cierra todas las conexiones WebRTC activas
    for (let peerUsername in mapPeers) {
        let peer = mapPeers[peerUsername][0];
        peer.close();
        delete mapPeers[peerUsername];
    }

    // Cierra el WebSocket si está activo
    if (webSocket) {
        webSocket.close();
    }

    // Redirigir a otra página o recargar para salir de la llamada
    window.location.href = "/";
});
