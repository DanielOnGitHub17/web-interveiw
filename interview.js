
class Interview{
    constructor(questions, useVideo){
        window.x = this;
        [this.questions, this.useVideo] = [questions, useVideo];
        this.answers = [];
        this.index = 0;
        this.configure();
    }
    get question(){
        return this.questions[this.index];
    }
    get answer(){
        return this.answers[this.index];
    }
    configure(){
        // general
        // choose the container video/text
        this.container = Interview.containers[this.useVideo+0];
        this.container.append(CONTROLS);
        this.layoutButton = new Switch(CONTROLS
            , CONTROLS, "layout", [1, 0]);
        switchScreen(this.container.id);
        // events
        this.event()
        // end general
        // video specific
        this.questionBox = this.useVideo?CC:QUESTIONBOX;
        SAY.remove();
        if (this.useVideo){
            // this.layoutButton.switch.click();  // switch layout
            return;
        }
        // end video specific

        PLAYORPAUSE.remove();
        /* this will be refactored to sth else: SAY.textcontent=REWRITE...
        there will be up to three pregenerated text for answer
        probably in this.suggestions = ...[[], []]
        this.get:suggestion():
        choice(this.suggestions[this.index])
        for both text and video interview
         */
        
    }
    event(){
        CONTROLS.onclick=(event)=>{
            event.stopImmediatePropagation();
            event.stopPropagation();
            let target = event.target;
            switch (event.target.id) {
                case "PREV":
                    this.previous();
                    break;

                case "NEXT":
                    this.next();
                    break;

                case "PLAYORPAUSE":
                    this[target.textContent.toLowerCase()]();
                    target.textContent = target.textContent == "PAUSE"?"RESUME":"PAUSE";
                    break;
            
                default:
                    break;
            }
        }
        if (this.useVideo){
            // TALK.voice = getVoice(speechSearch.value);
            TALK.onstart = TALK.onresume = VIDEO.onpause = ()=>{
                this.disenable();
                // disable repeat, previous, next
            }
            TALK.onerror=()=>console.log;

            // VIDEO event (try onload too, "DOMCONTENTLOADED...")
            // the real 'start' for video usage
            VIDEO.onloadstart=()=>{
                hideLoading();
                this.disenable();
                VIDEO.play();
                let hours = new Date().getHours(), time;
                if (hours > 17){
                    time = "evening";
                } else{
                    time = hours > 11?"afternoon":"morning";
                }
                say(`Good ${time}. ${FIRSTSAY.value}`).then(begin=>{
                    this.ask(0);
                })
            }

            return;
        }
        ANSWERBOX.oninput=()=>{
            this.answers[this.index] = ANSWERBOX.value;
        }        
    }
    disenable(bool=true){
        [...SAY.children].forEach(i=>i.disabled=bool);
        [PREV, NEXT].forEach(button=>button.disabled=bool);
    }
    ask(){
        if (this.useVideo){
            say(this.question).then(resp=>{
                this.disenable(false);
            });
        } else{
            this.questionBox.textContent = this.question;
            ANSWERBOX.value = this.answer?this.answer:"";
            ANSWERBOX.focus();
        }
    }
    start(){
        if (this.useVideo){
            // say setting things up
            showLoading("setting up...");
            say("setting things up, the interview will start soon").then(resp=>{
                if (!navigator.mediaDevices){
                    return this.exit("Sorry, your browser cannot record video.");
                }
                //  remove audio: true from getUserMedia later, screen record will
                // handle that
                // options for recording...
                navigator.mediaDevices.getUserMedia({
                    audio: true, video: true, facingMode: {exact: "user"}
                }).then(mediaStream=>{
                    if (isPhone()){
                        // ha! (back to old implementation of spe)
                        this.video(mediaStream);
                        return
                    } 
                    navigator.mediaDevices.getDisplayMedia({
                        audio: true, video: true
                    }).then(screenStream=>{
                        // check if user followed instructions.
                        let track = screenStream.getAudioTracks()[0];
                        if (!track || track.label != "System Audio"){
                            throw "Did not follow instructions";
                        }
                        this.video(mediaStream, screenStream);
                    }).catch(error=>{
                        console.log(error);
                        this.exit("You <i><b>must </b></i> share <b>entire</b> screen and system audio.");
                    })
                }).catch((error)=>{
                    console.log(error);
                    this.exit("You should allow all permissions!");
                })
            })

            // ask for video, audio permission,
            // add a mediarecorder attribute
            // give it to VIDEO as a src
            // play video
            // more events for pause/end/ondataavailable in this.event

            // ask for record screen (only this page), will be needed for audio 
            // (check if you can crop video off the recorded portion)
            return;
        }
        this.ask(0);
    }
    video(mediaStream, screenStream){
        // for playing around, add the screen's stream
        // get the video track
        if (screenStream){
            this.mdStm = mediaStream;
            this.videoTrack = mediaStream.getVideoTracks()[0];
            // stop screen's videoTrack
            let screenVideo = screenStream.getVideoTracks()[0];
            screenVideo.stop();
            screenStream.removeTrack(screenVideo);
            // merge the two streams into one audio stream
            let audioCtx = new AudioContext()
            , destination = audioCtx.createMediaStreamDestination();
            [...arguments].forEach(stream=>{
                audioCtx.createMediaStreamSource(stream).connect(destination);
            })
            this.dest = destination.stream;
            // get the one audio track from the gotten stream
            this.audioTrack= destination.stream.getAudioTracks()[0];

            // create a new media stream to be used
            this.mediaStream = new MediaStream();
            // add video and audio tracks to this one stream
            ["audio", "video"].forEach(track=>{
                this.mediaStream.addTrack(this[track+"Track"]);
            });
        } else{
            this.mediaStream = mediaStream;
        }
        this.mediaRecorder = new MediaRecorder(
            this.mediaStream, {mimeType: "video/webm; codecs=vp9"}
        );
        this.screenStream = screenStream;
        this.mediaRecorder.ondataavailable=(event)=>{
            this.videoResponse(event);
        }
        this.mediaRecorder.start();
        VIDEO.srcObject = this.mediaStream;
        VIDEO.muted =  true;
    }
    next(){
        let ended =this.index >= this.questions.length - 1
        if (!this.useVideo && ANSWERBOX.value.trim() == ""){
            return alert("Enter a response to proceed!");
        }
        if (ended){
            confirm("Do you want to complete your interview?").then(bool=>{
                if (!bool) return;
                REFRESHER.disabled = false;
                if (this.useVideo){
                    say(FINALSAY.value).then(resp=>{
                        (isPhone()?["media"]:["screen", "media"]).forEach(type=>{
                            this[type+"Stream"].getTracks().forEach(i=>i.stop());
                        })
                        this.mediaRecorder.stop();
                    });
                    return;
                }
                this.textResponse(this.questions, this.answers);
            });
            return;
        }
        if (this.useVideo){
            // maybe check if speechrecog text is plenty enough
        } else{
            this.blur();
        }
        this.ask(++this.index);
    }
    previous(){
        if (this.index <= 0){
            return alert("Err... this is the first question...");
        }
        if (this.useVideo){
            // maybe check if speechrecog text is plenty enough
        } else{
                this.blur();
        }
        this.ask(--this.index);
    }
    pause(){
        speechSynthesis.pause();
        VIDEO.pause();
        this.mediaRecorder.pause();
        // pause audio recorder (screen recording)
    }
    resume(){
        // resume audio recorder (screen recording)
        this.mediaRecorder.resume();
        VIDEO.play();
        speechSynthesis.resume();
        if (!speechSynthesis.speaking && !speechSynthesis.paused){
            this.disenable(false);
        }
    }
    blur(){
        this.questionBox.setAttribute("disabled", "true");
        setTimeout(()=>this.questionBox.removeAttribute("disabled"), 200)
    }
    exit(message="Sorry, an error occured. You will have to restart."){
        alert(message, ["RESTART"]).then(()=>location.reload());
    }
    textResponse(){
        switchScreen("TXTRESP");
        for (let index in questions){  // proper way to loop??? :)
            let row = add(make("tr"), TEXTRESPONSE);
            index = +index;
            ["questions", "answers"].forEach(
                arg=>add(make("td"), row).textContent=this[arg][index]
            )
        }
    }
    videoResponse(event){
        showLoading("making video...");
        switchScreen("VIDRESP");
        this.videoFile = event.data;
        VIDEORESPONSE.src = URL.createObjectURL(this.videoFile);
        (SAVE.downloader = make('a')).download = "ai-interview.webm";
        SAVE.downloader.href = VIDEORESPONSE.src;
        SAVE.onclick = ()=>{SAVE.downloader.click()};
        hideLoading();
    }
    static containers = [TEXTINTERVIEW, VIDEOINTERVIEW];
    // in SETUP, do a starter.
}

// set some things for CONTROLS
Object.defineProperty(CONTROLS, "layout", {
    get: function(){return CONTROLS.classList.contains("side")},
    set: function(value){
        let property = value?"add":"remove";
        CONTROLS.classList[property]("side");
        CONTROLS.parentElement.classList[property]("side");
    }
})
function layout(){
    CONTROLS
}