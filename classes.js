class Question{
    constructor(question="What do you want to be asked?"){
        this._question = question;
        this.build();
        this.event();
        Question.questions.push(this);
    }
    get question(){
        return this.text.value;
    }
    set question(ask){
        this.text.value = ask;
    }
    build(){
        add(
            (this.text = make("input"))
            ,    add(this.box = make("li"), QUESTIONLIST)
        ).value = this._question;
        this.text.type = "text";

        ["mover", "deleter"].forEach((type, i)=>{
            add(
                (this[type] = make("button")), this.box
            ).className = "icon";
            this[type].textContent = Question.iconValues[i];
        });
        ["box", "text", "mover", "deleter"].forEach(dom=>this[dom].obj=this);
        this.mover.draggable = true;
    }
    event(){
        this.deleter.onclick=()=>this.delete();
        this.text.onkeyup=(event)=>{
            event.key=="Enter" && event.ctrlKey && (new Question).text.focus();
        }
        this.mover.onkeydown=(event)=>{
            Question.keys.includes(event.key) && event.preventDefault();
        }
        this.mover.onkeyup=(event)=>{
            if (Question.keys.includes(event.key) &&
             this.box[`${Question.keyMap[event.key]}ElementSibling`]){
                event.preventDefault();
                if (event.key.includes("Up")){
                    QUESTIONLIST.insertBefore(this.box, this.box.previousElementSibling);
                } else{
                    QUESTIONLIST.insertBefore(this.box.nextElementSibling, this.box);
                }
                this.mover.focus();
            }
        }
        this.mover.ondragstart=(event)=>{
            this.box.classList.add("highlight");
        }
        this.mover.ondragend=(event)=>{
            let at = document.elementFromPoint(event.x, event.y);
            if (at.obj && at.obj != this){
                QUESTIONLIST.insertBefore(this.box, at.obj.box)
            }
            this.box.classList.remove("highlight");
        }
        // this.mover.onmouse
    }
    delete(){
        this.box.remove();
        remove(this, Question.questions);
        Question.deletedQuestions.push(this);
    }
    restore(){
        QUESTIONLIST.append(this.box);
    }
    static restoreLast(){
        SETUP.checkVisibility() && Question.deletedQuestions.length && Question.deletedQuestions.pop().restore();
    }
    static questions = [];
    static iconValues = ['<>', 'X'];
    static deletedQuestions = [];
    static keyMap = {"ArrowUp": "previous", "ArrowDown": "next"};
    static keys = Object.keys(Question.keyMap);
}

class Switch{
    constructor(where, obj, property, values){
        [this.container, this.obj, this.property, this.values] = arguments
        this.build();
        this.event();
        Switch.swtiches.push(this);
    }
    build(){
        add((this.switch = make())
        , add((this.holder = make()), this.container)
        ).className = "switch";
        this.holder.className = "switchold";
        // this.switch.tabIndex = -1;
    }
    event(){
        this.switch.onclick = (event)=>{
            event.preventDefault();
            this.holder.classList.contains("off")
            ?this.holder.classList.remove("off")
            :this.holder.classList.add("off");
            this.action();
        }
    }
    on(){
        return !this.holder.classList.contains("off")
    }
    action(){
        // all switches will set a property of something
        // between to two values (flex/none) (true/false)
        // 1/0
        let [obj, property, values] = [this.obj, this.property, this.values]
        obj[property] = obj[property] ==  values[0]?values[1]:values[0]
    }
    static swtiches = [];
}

class Help{
    constructor(){
        this.messages = [
            "Use ctrl+z to restore last delted question"
            , "Hit enter on a question box to add another question"
            , "etc"
        ]
    }
}

class SearchUI{
    // to specific
    constructor(where, values){
        [this.container, this._values] = arguments;
        this.build();
        this.event();
    }
    get values(){
        if (typeof this._values == "function"){
            return this._values();
        } else{
            return this._values;
        }
    }
    build(){
        add((this.searchBox = make("input"))
        , add((this.box = make())
        , this.container)).type = "text";
        this.box.className = "searchui";
        add((this.list = make("ul")), this.box).hidden = true;
        this.list.size = 20
    }
    event(){
        // change onvoice... to event variable/not
        speechSynthesis.onvoiceschanged=(event)=>{
            let voices = this.values;
            for (let i in voices){
                add(make("li"), this.list).textContent = voices[i].name;
            }
        }
        this.searchBox.onfocus=()=>this.list.hidden=false;
        this.searchBox.onblur=()=>setTimeout(()=>this.list.hidden=true, 500);
        this.searchBox.oninput=(event)=>{
            [...this.list.children].forEach(child=>{
                child.hidden = !(child.textContent.toLowerCase().includes(this.searchBox.value.toLowerCase()))
            })
        }
        this.list.onclick=(event)=>{
            event.stopImmediatePropagation();
            event.stopPropagation();
            if (event.target.parentElement == this.list){
                this.searchBox.value = event.target.textContent;
                TESTVOICE.test = this.values[this.values.map(i=>i.name).indexOf(this.searchBox.value)];
            }
        }
    }
    get value(){
        if (this.values.includes(this.searchBox.value)){
            return this.searchBox.value;
        }
    }
}