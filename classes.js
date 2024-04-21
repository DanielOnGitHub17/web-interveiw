class Question{
    constructor(question){
        this.question = question;
        this.build()
    }
}


function makeQuestion(question, index) {
    let questionHolder = make('li');
    [['span', 'question', question],
     ['button', 'removebutton', 'X']].forEach(e=>{
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