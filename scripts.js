// Turn all elements with ID into variables
identify();

// initialize the loading element, that blocks the screen and all
(function loader(){
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
})();


// create switch inside SHOULDVIDEO
const videoSwitch = new Switch(SHOULDVIDEO
    , VIDEOSETTINGS.style, "display", ["none", ""])


// function makeQuestion(question) {
// }
//     let questionHolder = make('li');
//     [['span', 'question', question],
//      ['button', 'removebutton', 'X']].forEach(e=>{
//          questionHolder.appendChild((questionHolder[e[1]]=make(e[0]))).className=e[1];
//          questionHolder[e[1]].textContent=e[2];
//          //appendChild would return the element so you can add a className
//      });
//     [['up', '/\\'], ['down', '\\/']].forEach((a)=>{
//         questionHolder.upanddown
//         .appendChild(questionHolder[a[0]]=make('button')).className=a[0];
//         questionHolder[a[0]].textContent=a[1]
//     });
//     questionHolder.question.contentEditable=true;//make contentEditable
//     questionslist.append(questionHolder);//add to DOM
//     //start filling in
//     questionHolder.questionnumber.textContent=index;
//     questionHolder.question.value=question;
//     //events
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
