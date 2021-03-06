var WebcamRecorder = function(videoRecord, playBackVideo, recordBtn,  startRecordingText, stopRecordingText, maxTime, countDownDiv, constraints, functioncallBackRecordedFinished, canvas) {
    var mediaSource = new MediaSource();
    mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
    var mediaRecorder;
    var recordedBlobs;
    var sourceBuffer;

    var videoRecord = document.querySelector(videoRecord);
    var playBackVideo = document.querySelector(playBackVideo);
    var recordBtn = document.querySelector(recordBtn);
    var countDownDiv = document.querySelector(countDownDiv);
    var intervalID = null;

    recordBtn.onclick = toggleRecording;
    recordBtn.innerHTML = startRecordingText;
    setCountDown(maxTime);

    function setCountDown(countDown) {
        if (countDown < 10) {
            countDown = '0'+countDown;
        }
        countDownDiv.innerHTML = '00:'+countDown
    }


    function handleSuccess(stream) {
        recordBtn.disabled = false;
        console.log('getUserMedia() got stream: ', stream);
        window.stream = stream;
        if (canvas) {
            console.log('drawVisualization');
            drawVisualization(stream, canvas);
        }
        videoRecord.srcObject = stream;
    }

    function handleError(error) {
        console.log('navigator.getUserMedia error: ', error);
    }

    this.setContraints = function(contraints) {
        navigator.mediaDevices.getUserMedia(constraints).
        then(handleSuccess).catch(handleError);
    }

    navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);

    function handleSourceOpen(event) {
        console.log('MediaSource opened');
        var mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
        var mimeCodec = 'video/webm; codecs="vp8"'
        sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
        console.log('Source buffer: ', sourceBuffer);
    }

    playBackVideo.addEventListener('error', function (ev) {
        console.error('MediaRecording.recordedMedia.error()');
        alert('Your browser can not play\n\n' + playBackVideo.src
            + '\n\n media clip. event: ' + JSON.stringify(ev));
    }, true);

    function handleDataAvailable(event) {
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    }

    function handleStop(event) {
        console.log('Recorder stopped: ', event);
    }

    this.stop = function() {
        if (stream.getVideoTracks().length) {
            stream.getVideoTracks()[0].stop();
        }
        if (stream.getAudioTracks().length) {
            stream.getAudioTracks()[0].stop();
        }
        playBackVideo.pause();
        playBackVideo.style.display = 'none';
    }

    this.getBlob = function() {
        return new Blob(recordedBlobs, {type: 'video/webm'});
    }

    drawVisualization = function(stream, canvas) {
        var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
        var analyser = audioCtx.createAnalyser();
        source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 2048;
        var bufferLength = analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);

        var canvasCtx = canvas.getContext('2d');

        function draw() {
            drawVisual = requestAnimationFrame(draw);
            analyser.getByteTimeDomainData(dataArray);
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            canvasCtx.lineWidth = 1;
            canvasCtx.strokeStyle = '#000000';
            canvasCtx.beginPath();
            var sliceWidth = canvas.width * 1.0 / bufferLength;
            var x = 0;
            for (var i = 0; i < bufferLength; i++) {
                var v = dataArray[i] / 128.0;
                var y = v * canvas.height / 2;
                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }
                x += sliceWidth;
            }
            canvasCtx.lineTo(canvas.width, canvas.height / 2);
            canvasCtx.stroke();
        }
        draw();
    }


    this.uploadToPHPServer = function(uploadHTTP, fileName) {
        return new Blob(recordedBlobs, {type: 'video/webm'});
        // create FormData
        var formData = new FormData();
        formData.append('a', 'uploadWebcam');
        formData.append('filename', fileName);
        formData.append('blob', blob);

        makeXMLHttpRequest(uploadHTTP, formData, function(res) {
            console.log('File uploaded', res);
        });
    }

    function makeXMLHttpRequest(url, data, callback) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function(res) {
            if (request.readyState == 4 && request.status == 200) {
                callback(res);
            }
        };
        request.open('POST', url);
        request.send(data);
    }


    function toggleRecording() {
        if (recordBtn.innerHTML === startRecordingText) {
            startRecording();
        } else {
            stopRecording();
        }
    }

    function startRecording() {
        startInterval(maxTime);
        setCountDown(maxTime);

        recordedBlobs = [];
        playBackVideo.style.display = 'none';

        var options = {mimeType: 'video/webm;codecs=h264'};
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.log(options.mimeType + ' is not Supported');
            options = {mimeType: 'video/webm;codecs=vp8'};
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                console.log(options.mimeType + ' is not Supported');
                options = {mimeType: 'video/webm'};
                if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                    console.log(options.mimeType + ' is not Supported');
                    options = {mimeType: ''};
                }
            }
        }
        try {
            options.audioBitsPerSecond = 64000;
            options.videoBitsPerSecond = 128000;
            mediaRecorder = new MediaRecorder(window.stream, options);
        } catch (e) {
            console.error('Exception while creating MediaRecorder: ' + e);
            alert('Exception while creating MediaRecorder: '
                + e + '. mimeType: ' + options.mimeType);
            return;
        }
        console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
        recordBtn.innerHTML = stopRecordingText;

        mediaRecorder.onstop = handleStop;
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start(10); // collect 10ms of data
        console.log('MediaRecorder started', mediaRecorder);
    }

    function stopRecording() {
        recordBtn.innerHTML = startRecordingText;
        playBackVideo.style.display = 'initial';
        mediaRecorder.stop();
        stopInterval();
        console.log('Recorded Blobs: ', recordedBlobs);
        playBackVideo.controls = true;
        play();
        setCountDown(maxTime);
        functioncallBackRecordedFinished();
    }

    function play() {
        var superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
        playBackVideo.src = window.URL.createObjectURL(superBuffer);
    }

    function download() {
        var blob = new Blob(recordedBlobs, {type: 'video/webm'});
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'test.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }

    function stopInterval() {
        clearInterval(intervalID);
    }

    function startInterval(countDown) {
        intervalID = setInterval(function() {
            setCountDown(countDown);
            if(countDown <= 0) {
                stopRecording();
            }
            countDown--;
        }, 1000);
    }
}



        
