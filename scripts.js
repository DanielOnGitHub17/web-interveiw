// initialize the loading element, that blocks the screen and all
function loader(){
    let loading;
    (loading = make()).id = "LOADING";
    showLoading = () => void add(loading);
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

// well...
function restoreSavedQuestions(){
    const QUESTIONS = localStorage.questions?JSON.parse(localStorage.questions):[];
    QUESTIONS.forEach(q=>(new Question(q)));

}

// say function to speak
function say(text, voice){
    // global variable talk
    speechSynthesis.cancel();
    [TALK.text, TALK.voice] = arguments;
    speechSynthesis.speak(TALK);
    return new Promise((resolve)=>say.resolve=resolve);
}


// get voice from voice name
function getVoice(name){
    return speechSynthesis.getVoices().find(i=>i.name == name);
}
// the rest will be at setup.js