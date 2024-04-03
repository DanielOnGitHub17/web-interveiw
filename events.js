//all functions and variables if (except all event based) here
onbeforeunload=()=>{
    speechSynthesis.cancel();
    localStorage.questions = JSON.stringify([...questionslist.children].map(i=>i.querySelector('.question').innerText));
}
addquestion.onclick=()=>{
    makeQuestion('Write a question here, write a question here', questionslist.childElementCount+1)
}
startbutton.onclick=()=>{
    if (!(questions=[...questionslist.children].map(i=>i.querySelector('.question').innerText)).length) return errors.innerHTML = 'No question added, Please add at least <i>one</i> questions to proceed';
    if (!confirm('Proceed?')) return
    embassy.style.display='flex'; setup.style.display='none';
    shouldusevideo.checked?you.style.display='none':interviewbox.style.display='none';
    questionbox.innerText=(currentQuestion=questions[index])//setup non-video
    if (!shouldusevideo.checked) return;
    // while (!voice){}
    loading.loading = 1;
    userMedia = navigator.mediaDevices.getUserMedia({
        audio: true, video: true,
        facingMode: {exact: "user"}
    });
    userMedia.then(mediaStream=>{
        //setup video recording
        stream = mediaStream;
        recorder = new MediaRecorder(mediaStream)
        recorder.ondataavailable=()=>{
            loading.loading = 1;
            finalFile = new Blob([event.data], {type:"video/mp4"})
            response.src=URL.createObjectURL(finalFile);
            refresher.style.display='block';
            responseHolder.style.display='flex';
            loading.loading = 0;
        }
        recorder.start();
        video.srcObject = mediaStream; video.muted=true;        
    }).catch(error=>{alert('an error occurred, exitting!!'); location.reload()})
    video.onloadstart=()=>{
        loading.loading=0;
        video.play();
        let hours = new Date(Date.now()).getHours(), time;
        if(hours>16){
            time ='evening'
        }else if(hours>11){
            time='afternoon'
        }else if(hours>=0){
            time='morning'
        }
        question = new SpeechSynthesisUtterance(`
        Good ${time}}. Welcome to your interview.
        Please click the repeat button to repeat any asked question,
        and click the forward button to go to the next question.`);
        question.voice =voice//= voices[+getAll('[name=voice]').filter(v=>v.checked)[0].value]
         voice; question.rate=.8;
        speechSynthesis.speak(question);
        question.onstart=()=>say.disabled=forward.disabled=true;
        question.onend = ()=>{setTimeout(()=>!video.paused&&(say.disabled=forward.disabled=false), randBtw(1000, 2500))};
        // setup q and a
    }
    
}
answerquestion.onclick=()=>{
    event.preventDefault();
    if (!answerbox.reportValidity()) return;
    answers.push(answerbox.value); answerbox.value='';
    if(index+1>=questions.length){
        //submit
        embassy.style.display='none'
        responses.style.display='flex';
        questions.forEach((q, i)=>{
            let r = responses.insertRow();
            (r.insertCell()).innerText = q;
            (r.insertCell()).innerText = answers[i]
        })
        return refresher.style.display='block'
    }
    questionbox.innerText=(currentQuestion = questions[++index])
    if(index+2>questions.length) answerquestion.innerText='End interview';
}
playorpause.onclick=()=>{
    if (video.paused) {
        speechSynthesis.resume(); recorder.resume(); video.play(); playorpause.innerText = 'Pause Recording';
        say.disabled=forward.disabled=false;
    } else {
        speechSynthesis.pause(); recorder.pause(); video.pause();playorpause.innerText = 'Continue Recording';
        question.onstart();
    }
}
forward.onclick=()=>{
    question.onstart();
    if(index>=questions.length){
        //submit
        question.text = after.value?after.value:after.placeholder;
        speechSynthesis.speak(question)
        question.onend=()=>{
            embassy.style.display='none'
            stream.getTracks().forEach(i=>i.stop());
            recorder.stop();
        }
        return
    }
    question.text=(currentQuestion=questions[index++]);
    speechSynthesis.speak(question)
    if(index+1>questions.length) forward.innerText='End interview';
}
say.onclick=()=>{
    speechSynthesis.cancel();
    speechSynthesis.speak(question);
}
// addquestion.click()
//for downloading
save.onclick=()=>{
    downloader.href=response.src;
    downloader.click();
}
getAll('[name=voice]').forEach(v=>{
    v.onchange=()=>{voice=speechSynthesis.getVoices()[+v.value]}
})
