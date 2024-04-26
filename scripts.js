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

// create search ui for voices
function createVoiceSearchUI(){
    speechSearch = new SearchUI(VOICETHINGS
        , ()=>speechSynthesis.getVoices().map(i=>i.name)
        // , ()=>["Daniel", "Ogirimah", "Enesi"]
    ) 
}

// for "data persistence"...
function saveData(){
    // questions
    localStorage.questions = JSON.stringify([...QUESTIONLIST.children].map(q=>q.obj.question));
    // FIRST|FINAL-->SAY
    ["FIRSTSAY", "FINALSAY"].forEach(pos=>{
        if (window[pos]){
            localStorage[pos] = window[pos].value;
        }
    })
}
function restoreSavedData(){
    const QUESTIONS = localStorage.questions?JSON.parse(localStorage.questions):[];
    QUESTIONS.forEach(q=>(new Question(q)));
    ["FIRSTSAY", "FINALSAY"].forEach(pos=>{
        if (localStorage[pos]){
            window[pos].value = localStorage[pos];
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
            createVoiceSearchUI()
            if (localStorage.voice){
                speechSearch.value = localStorage.voice;
            }
        
            // initialize SpeechSynthesisUtterance
            TALK = new SpeechSynthesisUtterance();
            TALK.onend=()=>say.resolve(true);
        } else{
            videoSwitch.switch.click();
            SHOULDVIDEO.remove();
        }
    })
}