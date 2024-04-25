
class Interview{
    constructor(questions, useVideo){
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
            , CONTROLS, "layout");
        switchScreen(this.container.id);
        // events
        this.event()
        // end general
        // video specific
        this.questionBox = this.useVideo?CC:QUESTIONBOX;
        if (this.useVideo){
            this.utterance = TALK;
            this.utterance.voice = getVoice(speechSearch.value);
            return;
        }
        PLAYORPAUSE.remove();
        SAY.remove();

        // end video specific

        // build what should be built
        // add controls to that place...
        // setup controls.event 
        // maybe move this class to another file (interview.js)
        // ...
    }
    event(){
        CONTROLS.onclick=(event)=>{
            switch (event.target.id) {
                case "PREV":
                    this.previous();
                    break;

                case "NEXT":
                    this.next();
                    break;

                case "PAUSE":
                    this.pause();
                    break;
            
                default:
                    break;
            }
        }
        if (this.useVideo){
            this.utterance.onend=()=>console.log;
            this.utterance.onstart=()=>console.log;
            this.utterance.onpause=()=>console.log;
            this.utterance.onerror=()=>console.log;

            return;
        }
        ANSWERBOX.oninput=()=>{
            this.answers[this.index] = ANSWERBOX.value;
        }        
    }
    ask(){
        if (this.useVideo){
            //
        } else{
            this.questionBox.textContent = this.question;
            ANSWERBOX.value = this.answer?this.answer:"";
            ANSWERBOX.focus();
        }
    }
    start(){
        this.ask(0);
        if (this.useVideo){
            //
        }
    }
    next(){
        let ended =this.index >= this.questions.length - 1
        if (ended){
            confirm("Do you want to complete your interview?").then(bool=>{
                if (!bool) return;
                if (this.useVideo){
                    say(TEXTAFTER.value).then;
                    speechSynthesis.cancel();
                    Interview.videoResponse();
                    return;
                }
                Interview.textResponse(this.questions, this.answers);
            });
            return;
        }
        if (this.useVideo){
            // maybe check if speechrecog text is plenty enough
            return;
        }
        if (ANSWERBOX.value.trim() == ""){
            return alert("Enter a response to proceed!");
        }
        this.blur();
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
    static containers = [TEXTINTERVIEW, VIDEOINTERVIEW];
    static textResponse(questions, answers){
        switchScreen("TXTRESP");
        for (let index in questions){  // proper way to loop??? :)
            let row = add(make("tr"), TEXTRESPONSE);
            index = +index;
            ["questions", "answers"].forEach(
                arg=>add(make("td"), row).textContent=eval(arg)[index]
            )
        }
    }
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