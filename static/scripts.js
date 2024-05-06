
// get user consent for recording screen and making video (remove)
function consentToRecording(){
    confirm(`
    To use this app's video feature, you must share your entire screen
    <br> and allow the app to record system audio<br>
    The app does not store recorded data after usage.<br>
    <b>Your privacy is paramount</b>
    `, ["decline", "agree"]).then(bool=>{
        // create a toggle to switch video options
        createVideoToggle();
        if (bool){
            // create voice search ui
            createVoiceSearchUI();
        
            // initialize SpeechSynthesisUtterance
            TALK = new SpeechSynthesisUtterance();
            TALK.onend=()=>say.resolve(true);
        } else{
            videoSwitch.switch.click();
            SHOULDVIDEO.remove();
        }
    })
}


// get questions. Monitor disableness of button
function setupAIQuestions() {
    let rep = AIGEN.reportValidity.bind(AIGEN);
    AIGEN.reportValidity = ()=>{
        return rep() &&
        (textTopic.on?TOPIC:TEXT).value
    }
    AIGEN.onsubmit = (event)=>{
        event.preventDefault();
        if (AIGEN.reportValidity()){
            GEN.disabled = true;
            alert("Questions are being generated in the background. They will appear soon.");
            let type = (textTopic.on?"topic":"text")
            , data = new FormData(AIGEN),
            body = {};
            body[type] = data.get(type);
            body["number"] = parseInt(data.get("questno"));
            // flag
            DONE = false
            fetch("/ai/questions/", {
                method: "post",
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': getS(`[name=csrfmiddlewaretoken]`).value
                },
            
            //make sure to serialize your JSON body
                body: JSON.stringify(body)
            }).then(response=>{
                console.log(response)
                if (response.status != 200){
                    throw "rejected with error "+response.statusText
                }
                response.json().then(obj=>{
                    console.log(obj);
                    if (!obj || ["Passed", "Failed"].includes(obj.trim())){
                        throw "rejected "+obj;
                        // return;
                    }
                    alert("Questions will now be added");
                    Interview.generateQuestions(JSON.parse(obj)["questions"]);
                }).catch(error=>{
                    console.log(error);
                    alert("Failed to generate questions!");
                })
            }).catch(error=>{
                console.log(error);
                alert("Failed to generate questions!");
            });
        }
    }
}

// initialize the loading element, that blocks the screen and all
function loader(){
    let loading;
    (loading = make()).id = "LOADING";
    showLoading = (text="") => add(loading).style.setProperty("--content", `"${text}"`);
    hideLoading = () => loading.remove();
    isPageLoading = () => loading.isConnected;
    const N = 10
    for (let n = 0; n < N; n++){
        let c;
        (c = make()).id = 'c'+n;
        c.style.animationDelay = n/N+'s';
        // use other numbers appart from .1 to see effects;
        // will have to change animation-duration and dimensions too
        loading.append(c);
    }
};


// create switch inside SHOULDVIDEO
function createVideoToggle(){
    videoSwitch = new Switch(SHOULDVIDEO
        , VIDEOSETTINGS.style, "display", ["none", ""])
}

// create text or topic switch
function createTextOrTopic(){
    textTopic = new Switch(AISWITCHOLD
    , AIGEN, "ariaSort", ["topic", "text"])
}

// create search ui for voices
function createVoiceSearchUI(){
    speechSearch = new SearchUI(VOICETHINGS
        , ()=>speechSynthesis.getVoices().map(i=>i.name)
    ) 
}

// for "data persistence"...
function saveData(){
    if (window.SHARED) return;
    // copy interview (in case it will be used to get originals)
    let interviewObj = copy(INTERVIEW);
    interviewObj.questions = [...QUESTIONLIST.children].map(q=>q.obj.question);
    // FIRST|FINAL-->SAY
    ["FIRSTSAY", "FINALSAY"].forEach(phrase=>{
        if (window[phrase]){
            interviewObj[phrase] = window[phrase].value;
        }
    });
    local("AI_INTERVIEW", jsonStr(interviewObj));
}
onerror=(event)=>{
    localStorage.error = String(event);
}
function restoreSavedData(){
    // check if interview is a shared page
    INTERVIEW = window.SHARED?window.SHARED:
    local("AI_INTERVIEW")?jsonObj(local("AI_INTERVIEW")):{};
    const QUESTIONS = INTERVIEW.questions?INTERVIEW.questions:[];
    QUESTIONS.forEach(q=>(new Question(q)));
    ["FIRSTSAY", "FINALSAY"].forEach(pos=>{
        if (INTERVIEW[pos]){
            window[pos].value = INTERVIEW[pos];
        }
    })
}

// say function to speak
function say(text="", voice){
    // global variable talk
    speechSynthesis.cancel();
    TALK.text = text;
    if (voice){
        TALK.voice = voice;
    }
    speechSynthesis.speak(TALK);
    return new Promise((resolve)=>say.resolve=resolve);
}


// get voice from voice name
function getVoice(name){
    return speechSynthesis.getVoices().find(i=>i.name == name);
}