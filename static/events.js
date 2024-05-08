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
// add event listeners
addEventListener("keyup", (event)=>{
    if (event.key == 'b' && event.ctrlKey){
        Question.restoreLast();
    }
})
// add question button
ADDQUESTION.onclick=()=>(new Question).text.focus();

// restore question button
RESTOREQUESTION.onclick=()=>Question.restoreLast();

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

STARTBUTTON.onclick=()=>{
    saveData();
    if (!INTERVIEW.questions.length){
        return alert("You have to add at least one question");
    } else if (videoSwitch.on && !speechSearch.value) {
        return alert("Please, choose a voice!");
    }
    confirm("Are you sure you want to begin?", ["No", "Yes"])
    .then(resp=>{
        if (resp){
            (
                interview = new Interview(
                    INTERVIEW.questions
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