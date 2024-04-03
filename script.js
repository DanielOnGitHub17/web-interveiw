identify()
function makeQuestion(question, index) {
    let questionHolder = make('li');
    [['span', 'questionnumber', index], ['span', 'question', question],
     ['button', 'removebutton', 'X'], ['div', 'upanddown']].forEach(e=>{
         questionHolder.appendChild((questionHolder[e[1]]=make(e[0]))).className=e[1];
         questionHolder[e[1]].textContent=e[2];
         //appendChild would return the element so you can add a className
     });
    [['up', '/\\'], ['down', '\\/']].forEach((a)=>{
        questionHolder.upanddown
        .appendChild(questionHolder[a[0]]=make('button')).className=a[0];
        questionHolder[a[0]].textContent=a[1]
    });
    questionHolder.question.contentEditable=true;//make contentEditable
    questionslist.append(questionHolder);//add to DOM
    //start filling in
    questionHolder.questionnumber.textContent=index;
    questionHolder.question.value=question;
    //events
    questionHolder.removebutton.onclick=()=>questionHolder.remove();//for deleting the question
    questionHolder.upanddown.onclick=()=>{
        if (event.target.parentElement!=questionHolder.upanddown)return;//so that I can use ternary ifelse
        let dir = event.target.className;
        (event.target.className=='up')
        ?(questionslist.firstElementChild!=questionHolder)
            &&questionslist
            .insertBefore(questionHolder, questionHolder.previousElementSibling)
        :(questionslist.lastElementChild!=questionHolder)
            &&((questionslist.lastElementChild
                .previousElementSibling==questionHolder)
              ?questionslist.appendChild(questionHolder)
               :questionslist.insertBefore(questionHolder
                , questionHolder.nextElementSibling.nextElementSibling)
              )
    };
    questionHolder.onclick=()=>questionslist.querySelectorAll('.questionnumber').forEach((n, i)=>n.textContent=i+1);
    questionHolder.question.focus()
}
(function loader(){
    window.loading = make(); loading.id = 'loading';
    for (let n = 0; n<8; n++){
        let c = make(); c.id = 'c'+n;
        c.style.animationDelay = n/8+'s';
//         use other numbers appart from .125 to see effects;
        loading.appendChild(c); loading.hidden = 1;
    }
    document.body.appendChild(loading);
})();
Object.defineProperty(loading, 'loading', {
    set: function (b) {
        eval(b)?document.body.appendChild(loading):loading.remove();
    },
    get: function () {
        return loading.isConnected;
    }
})