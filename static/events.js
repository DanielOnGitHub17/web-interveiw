// //all functions and variables if (except all event based) here
onload=()=>{
    // Turn all elements with ID into variables
    identify();
    // make LOADING DIV
    loader();
    // show only SETUP
    switchScreen("SETUP");
    // restore saved questions
    restoreSavedData();
    // consent to recording
    consentToRecording();
    // create topic or text switch
    createTextOrTopic();
    // create AI questions
    setupAIQuestions();
    // TESTS
    // a = alert("Hi!").then(console.log);
    // videoSwitch.switch.click()
}
STARTBUTTON.onclick=()=>{
    // make a scripts function called start
    saveData();
    // too many if/else ifs (:
    if (!INTERVIEW.QUESTIONS.length){
        return alert("You have to add at least one question");
    } else if (videoSwitch.on) {
        if (!speechSearch.value){
            return alert("Please, choose a voice!");
        } else if (!(INTERVIEW.TEXT_AFTER && INTERVIEW.TEXT_BEFORE)){
            return alert("Please specify what to say before <i>and </i> after interview");
        }
    } else if (!DONE){
        return alert("Please wait, questions are being generated");
    }
    confirm("Are you sure you want to begin?", ["No", "Yes"])
    .then(resp=>{
        if (resp){
            (
                interview = new Interview(
                    INTERVIEW.QUESTIONS
                    , videoSwitch.on
        )).start();
        } else{
            alert("Make changes then click START");
        }
    })
}

// video / table download
SAVE.onclick = ()=>{
    confirm("Save as?", ["Table", "Video"])
    .then(bool=>{
        if (bool){
            SAVE.downloader.click();
        }else{
            switchScreen("TXTRESP");
            print();
            switchScreen("VIDRESP");
        }
    })
};

// add question button
ADDQUESTION.onclick=()=>(new Question).text.focus();

// restore question button
RESTOREQUESTION.onclick=()=>Question.restoreLast();

// add event listeners
addEventListener("keyup", (event)=>{
    if (event.key == 'b' && event.ctrlKey){
        Question.restoreLast();
    }
})
// TESTing voices
TESTVOICE.onclick =()=>{
    speechSynthesis.cancel();
    if (!speechSearch.value) return;
    say(`Hi, this is speech synthesis, using ${TALK.voice.name}`)
}

onbeforeunload=()=>{
    speechSynthesis.cancel();
    saveData();
}

onerror = (event)=>{
    local("error", String(event));
}