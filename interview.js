
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
        if (this.useVideo){
            this.layoutButton.switch.click();  // switch layout
            return;
        }
        // end video specific

        PLAYORPAUSE.remove();
        SAY.remove();
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
                    target.textContent = target.textContent == "PAUSE"?"RESUME":"PAUSE";
                    this[target.textContent.toLowerCase()]();
                    break;
            
                default:
                    break;
            }
        }
        if (this.useVideo){
            // TALK.voice = getVoice(speechSearch.value);
            TALK.onstart=()=>{
                this.disenable();
                // disable repeat, previous, next
            }
            TALK.onpause=()=>{

                this.disenable();
                // switch between pause and RESUME, pause video
                // disable previous, next, repeat (onstart())
            };
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
                say(`Good ${time}. ${choice(Interview.starters)}`).then(begin=>{
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
                    this.video(mediaStream);
                }).catch((error)=>{
                    console.log(error);
                    this.exit("Permission Denied. Click to restart.")
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
    video(mediaStream){
        this.mediaStream = mediaStream;
        this.videoRecorder = new MediaRecorder(mediaStream, {
            mimeType: "video/webm; codecs=vp9"
        });
        // event
        this.videoRecorder.ondataavailable=(event)=>{
            this.videoResponse(event);
        }
        this.videoRecorder.start();
        VIDEO.srcObject = this.mediaStream;
        VIDEO.muted =  true;
    }
    next(){
        let ended =this.index >= this.questions.length - 1
        if (ended){
            confirm("Do you want to complete your interview?").then(bool=>{
                if (!bool) return;
                REFRESHER.disabled = false;
                if (this.useVideo){
                    say(TEXTAFTER.value).then(resp=>{
                        this.mediaStream.getTracks().forEach(i=>i.stop());
                        this.videoRecorder.stop();
                    });
                    return;
                }
                this.textResponse(this.questions, this.answers);
            });
            return;
        }
        if (this.useVideo){
            // maybe check if speechrecog text is plenty enough
        } else if (ANSWERBOX.value.trim() == ""){
            return alert("Enter a response to proceed!");
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
    }
    resume(){
        speechSynthesis.resume();
    }
    blur(){
        this.questionBox.setAttribute("disabled", "true");
        setTimeout(()=>this.questionBox.removeAttribute("disabled"), 200)
    }
    exit(message="Sorry, an error occured. You will have to restart."){
        alert(message).then(()=>location.reload());
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
        this.videoFile = new Blob([event.data], {type: "video/webm"});
        VIDEORESPONSE.src = URL.createObjectURL(this.videoFile);
        (SAVE.downloader = make('a')).download = "ai-interview.webm";
        SAVE.downloader.href = VIDEORESPONSE.src;
        SAVE.onclick = ()=>{SAVE.downloader.click()};
        hideLoading();
    }
    static containers = [TEXTINTERVIEW, VIDEOINTERVIEW];
    static starters = ["We will begin now."
    , "Welcome to your interview.", "Make sure you are ready."
    , "Your interview starts now.", "This interview will test your knowledge"]
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