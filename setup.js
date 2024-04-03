//start from the top
// first get the saved questions if any
let baseli = getS('li'), //the base for adding questions
questions = localStorage.questions && JSON.parse(
    localStorage.questions), currentQueston
    , index = 0, answers = [], userMedia
    , recorder, stream, voices = speechSynthesis.getVoices()
    , voice, question, downloader = make('a');
downloader.download = 'interview.mp4';
if (questions) {
    questions.forEach((q,i)=>{
        makeQuestion(q, 1 + i)
    })
}
function mov() {

    p.then(mediaStream=>{
        m = MediaRecorder;
        video.onloadedmetadata = (x)=>{
            confirm('play?') && video.play();
            a.push(x)
        }
        MediaRecorder.start();
    });

    p.catch(err=>console.log(err))
}
// startbutton.onclick = mov
loading.loading = 0;
