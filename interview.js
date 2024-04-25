
class Interview{
    constructor(questions, useVideo){
        window.x = this;
        [this.questions, this.useVideo] = [questions, useVideo];
        this.index = 0;
        this.configure();
    }
    get question(){
        return this.questions[this.index];
    }
    configure(){
        // choose the container video/text
        this.container = Interview.containers[this.useVideo+0];
        this.container.append(CONTROLS);
        this.layoutButton = new Switch(CONTROLS
            , CONTROLS, "layout", [1, 0]);
        // build what should be built
        // add controls to that place...
        // setup controls.event 
        // maybe move this class to another file (interview.js)
        // ...
    }
    start(){
        //
        alert("Not yet implemented")
    }
    next(){
        //
    }
    previous(){
        // this and next will use should useVideo
    }
    static containers = [TEXTINTERVIEW, VIDEOINTERVIEW];
}

// set some things for CONTROLS
Object.defineProperty(CONTROLS, "layout", {
    get: function(){return false},
    set: function(value){
        if (value){
            CONTROLS.classList.add("side");
            CONTROLS.parentElement.classList.add("side");
        } else{
            CONTROLS.classList.remove("side");
            CONTROLS.parentElement.classList.remove("side");
        }
    }
})
function layout(){
    CONTROLS
}