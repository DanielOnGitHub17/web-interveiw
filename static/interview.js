// file is too long. Abstract much things as functions / other classes
// create more JS files, use OOP composition and inheritance largely.
// maybe even define Interview.prototype.manyOtherMethods in another file.
// incorporate TensorFlow/Any free AI tool to check if input to AI is reasonable.
// add 'goto' feature (maybe), goto question i...
class Interview {
    constructor(questions, useVideo) {
        window.x = this;
        [this.questions, this.useVideo] = [questions, useVideo];
        this.answers = [];
        for (let i = 0; i < this.questions.length; i++) {
            this.answers.push("");
        };
        this.index = 0;
        this.rewriteAll();
        this.configure();
        this.event();
    }
    configure() {
        // general
        // choose the container video/text
        this.container = Interview.containers[+this.useVideo];
        // add controls to it
        this.container.append(CONTROLS);
        // create a switch to toggle the control's layout
        this.layoutButton = new Switch(CONTROLS
            , CONTROLS, "layout", [1, 0]);
        // display the container only
        switchScreen(this.container.id);
        // end general

        // video specific
        this.questionBox = this.useVideo ? CC : QUESTIONBOX;
        if (this.useVideo) {
            // this.layoutButton.switch.click();  // switch layout
            // this.transcriber = {};
            (this.transcriber = new (
                window.SpeechRecognition || window.webkitSpeechRecognition
            )())
                .continuous = this.transcribe = true;
            // return;
        } else {
            PLAYORPAUSE.remove();
            SAY.replaceWith(SAY.children[0]);
            (SAY = CONTROLS.children[0]).textContent = "ASK DIFFERENTLY";
        }
        // events
        // end video specific

        /* this will be refactored to sth else: SAY.textcontent=REWRITE...
        there will be up to three pregenerated text for answer
        probably in this.suggestions = ...[[], []]
        this.get:suggestion():
        choice(this.suggestions[this.index])
        for both text and video interview
         */

    }
    event() {
        CONTROLS.onclick = (event) => {
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
                    target.textContent = target.textContent == "PAUSE" ? "RESUME" : "PAUSE";
                    break;

                default:
                    break;
            }
        }
        SAY.onclick = (event) => {
            event.stopImmediatePropagation();
            event.stopPropagation();  // necessary?
            let target = event.target;
            if (!["BUTTON", "SELECT"].includes(target.nodeName)) return;
            this.ask(
                this.index
                , (target.value || target.textContent)
                    .toUpperCase() == "REPEAT" ?
                    this.holdQuestion : this.anotherQuestion
            );
        }
        if (this.useVideo) {
            TALK.onstart = TALK.onresume = VIDEO.onpause = () => {
                this.disenable();
                // disable repeat, previous, next
            }
            TALK.onerror = console.log;
            // no TALK.onend, use say().then -> whatever you want to do THEN.

            // VIDEO event (try onload too, "DOMCONTENTLOADED...")
            // the real '.start' for video usage
            VIDEO.onloadstart = () => {
                hideLoading();
                this.disenable();
                VIDEO.play();
                // resize CC box
                let hours = new Date().getHours(), time;
                if (hours > 17) {
                    time = "evening";
                } else {
                    time = hours > 11 ? "afternoon" : "morning";
                }
                say(`Good ${time}. ${FIRSTSAY.value}`).then(() => {
                    this.ask(0);
                    this.transcriber.start();
                })
            }
            // transcriber CC.
            this.transcriber.onresult = (event) => {
                if (!this.transcribe) return;
                let text = event.results[event.resultIndex][0].transcript + ' ';
                CC.textContent = text;
                this.answers[this.index] += text;
                // scroll to see how big text has become
                CC.scrollTop = CC.scrollHeight;
            }
            this.transcriber.onend = () => {
                if (this.transcribe) this.transcriber.start();
            }
            return;
        }
        ANSWERBOX.oninput = () => {
            this.answers[this.index] = ANSWERBOX.value;
        }
    }
    disenable(bool = true) {
        [...SAY.children].forEach(i => i.disabled = bool);
        [PREV, NEXT].forEach(button => button.disabled = bool);
        this.transcribe = !bool;
    }
    ask(index, question) {
        this.index = index || this.index;  // how to 'goto'
        question = question || this.question;
        if (this.useVideo) {
            say(question).then(resp => {
                this.disenable(false);
            });
        } else {
            this.questionBox.textContent = question;
            ANSWERBOX.value = this.answer || "";
            ANSWERBOX.focus();
        }
    }
    start() {
        if (this.useVideo) {
            // say setting things up
            showLoading("setting up...");
            say("setting things up, the interview will start soon").then(resp => {
                if (!navigator.mediaDevices) {
                    return this.exit("Sorry, your browser cannot record video.");
                }
                //  remove audio: true from getUserMedia later, screen record will
                // handle that
                // options for recording...
                navigator.mediaDevices.getUserMedia({
                    audio: true, video: true, facingMode: { exact: "user" }
                }).then(mediaStream => {
                    // if (isPhone()){
                    //     // ha! (back to old implementation of spe)
                    //     this.video(mediaStream);
                    //     return
                    // } 
                    navigator.mediaDevices.getDisplayMedia({
                        audio: true, video: { displaySurface: "monitor" }
                    }).then(screenStream => {
                        // check if user followed instructions.
                        let track = screenStream.getAudioTracks()[0];
                        if (!track || track.label != "System Audio") {
                            throw "Did not follow instructions";
                        }
                        this.video(mediaStream, screenStream);
                    }).catch(error => {
                        console.log(error);
                        this.exit("You <i><b>must </b></i> share <b>entire</b> screen and system audio.");
                    })
                }).catch((error) => {
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
    video(mediaStream, screenStream) {
        if (screenStream) {
            this.mdStm = mediaStream;
            this.videoTrack = mediaStream.getVideoTracks()[0];
            // stop screen's videoTrack
            let screenVideo = screenStream.getVideoTracks()[0];
            screenVideo.stop();
            screenStream.removeTrack(screenVideo);
            // merge the two streams into one audio stream
            let audioCtx = new AudioContext()
                , destination = audioCtx.createMediaStreamDestination();
            [...arguments].forEach(stream => {
                audioCtx.createMediaStreamSource(stream).connect(destination);
            })
            this.dest = destination.stream;
            // get the one audio track from the gotten stream
            this.audioTrack = destination.stream.getAudioTracks()[0];

            // create a new media stream to be used
            this.mediaStream = new MediaStream();
            // add video and audio tracks to this one stream
            ["audio", "video"].forEach(track => {
                this.mediaStream.addTrack(this[track + "Track"]);
            });
        } else {
            this.mediaStream = mediaStream;
        }
        this.mediaRecorder = new MediaRecorder(
            this.mediaStream, { mimeType: "video/webm; codecs=vp9" }
        );
        this.screenStream = screenStream;
        this.mediaRecorder.ondataavailable = (event) => {
            this.videoResponse(event);
        }
        this.mediaRecorder.start();
        VIDEO.srcObject = this.mediaStream;
        VIDEO.muted = true;
    }
    next() {
        let ended = this.index >= this.questions.length - 1
        if (!this.useVideo && ANSWERBOX.value.trim() == "") {
            return alert("Enter a response to proceed!");
        }
        if (ended) {
            confirm("Do you want to complete your interview?").then(bool => {
                if (!bool) return;
                REFRESHER.disabled = false;
                if (this.useVideo) {
                    say(FINALSAY.value).then(resp => {
                        this.transcribe = false;
                        ["screen", "media"].forEach(type => {
                            this[type + "Stream"].getTracks().forEach(i => i.stop());
                        })
                        this.mediaRecorder.stop();
                    });
                }
                this.textResponse(this.useVideo);
            });
            return;
        }
        if (this.useVideo) {
            // maybe check if speechrecog text is plenty enough
        } else {
            this.blur();
        }
        this.ask(++this.index);
    }
    previous() {
        if (this.index <= 0) {
            return alert("Err... this is the first question...");
        }
        if (this.useVideo) {
            // maybe check if speechrecog text is plenty enough
        } else {
            this.blur();
        }
        this.ask(--this.index);
    }
    pause() {
        speechSynthesis.pause();
        VIDEO.pause();
        this.mediaRecorder.pause();
        // pause audio recorder (screen recording)
    }
    resume() {
        // resume audio recorder (screen recording)
        this.mediaRecorder.resume();
        VIDEO.play();
        speechSynthesis.resume();
        if (!speechSynthesis.speaking && !speechSynthesis.paused) {
            this.disenable(false);
        }
    }
    get anotherQuestion() {
        return (this.holdQuestion = this.various ? choice(this.various[this.index]) : this.holdQuestion);
    }
    rewriteAll() {
        getFromServer(`/ai/rewrite/`, this.questions)
        .then(response=>{
            checkResponse(response, ["Failed"])
            .then(()=>{
                this.various = response.obj;
            }).catch(console.log)
        }).catch(console.log)
    }
    textResponse(hide = False) {
        for (let i = 0; i < INTERVIEW.questions.length; i++) {  // proper way to loop??? :)
            let row = add(make("tr"), TEXTRESPONSE);
            ["questions", "answers"].forEach(
                arg => add(make("td"), row).textContent = this[arg][i]
            )
        }
        if (!hide) switchScreen("TXTRESP");
    }
    videoResponse(event) {
        switchScreen("VIDRESP");
        this.videoFile = event.data;
        VIDEORESPONSE.src = URL.createObjectURL(this.videoFile);
        (SAVE.downloader = make('a')).download = "ai-interview.webm";
        SAVE.downloader.href = VIDEORESPONSE.src;
    }
    blur() {
        this.questionBox.setAttribute("disabled", "true");
        setTimeout(() => this.questionBox.removeAttribute("disabled"), 200)
    }
    exit(message = "Sorry, an error occured. You will have to restart.") {
        alert(message, ["RESTART"]).then(() => location.reload());
    }
    get question() {
        return (this.holdQuestion = this.questions[this.index]);
    }
    get answer() {
        return this.answers[this.index];
    }
    static containers = [TEXTINTERVIEW, VIDEOINTERVIEW];
    static aiGeneratedQuestions = [];
    static generateQuestions(obj) {
        Interview.aiGeneratedQuestions = Interview.aiGeneratedQuestions.concat(obj);
        // make it animated
        let questIndex = 0;
        let animateQUestions = setInterval(() => {
            if (!obj[questIndex]) {
                clearInterval(animateQUestions);
                return DONE = true;
                
            }
            new Question(obj[questIndex++]);
        }, 400);
    }
    // in SETUP, do a starter.
}

// set some things for CONTROLS
Object.defineProperty(CONTROLS, "layout", {
    get: function () { return CONTROLS.classList.contains("side") },
    set: function (value) {
        let property = value ? "add" : "remove";
        CONTROLS.classList[property]("side");
        CONTROLS.parentElement.classList[property]("side");
    }
})
function layout() {
    CONTROLS
}