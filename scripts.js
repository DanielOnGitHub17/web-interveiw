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
    const videoSwitch = new Switch(SHOULDVIDEO
        , VIDEOSETTINGS.style, "display", ["none", ""])
}

// create search ui for voices
function createVoiceSearchUI(){
    speechSearch = new SearchUI(VOICETHINGS
        , ()=>speechSynthesis.getVoices()
        // , ()=>["Daniel", "Ogirimah", "Enesi"]
    ) 
}

// well...
function restoreSavedQuestions(){
    const QUESTIONS = localStorage.questions?JSON.parse(localStorage.questions):[];
    QUESTIONS.forEach(q=>(new Question(q)));

}

// function makeQuestion(question) {
// }   //events
//     questionHolder.removebutton.onclick=()=>questionHolder.remove();//for deleting the question
//     questionHolder.upanddown.onclick=()=>{
//         if (event.target.parentElement!=questionHolder.upanddown)return;//so that I can use ternary ifelse
//         let dir = event.target.className;
//         (event.target.className=='up')
//         ?(questionslist.firstElementChild!=questionHolder)
//             &&questionslist
//             .insertBefore(questionHolder, questionHolder.previousElementSibling)
//         :(questionslist.lastElementChild!=questionHolder)
//             &&((questionslist.lastElementChild
//                 .previousElementSibling==questionHolder)
//               ?questionslist.appendChild(questionHolder)
//                :questionslist.insertBefore(questionHolder
//                 , questionHolder.nextElementSibling.nextElementSibling)
//               )
//     };
//     questionHolder.onclick=()=>questionslist.querySelectorAll('.questionnumber').forEach((n, i)=>n.textContent=i+1);
//     questionHolder.question.focus()
// }

// a = new Question