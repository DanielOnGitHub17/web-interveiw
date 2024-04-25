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
            if (at && at.obj && at.obj != this){
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
    constructor(where, obj, property, values=[true, false]){
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
    get on(){
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
                add(make("li"), this.list).textContent = voices[i];
            }
        }
        this.searchBox.onfocus=()=>this.list.hidden=false;
        this.searchBox.addEventListener("blur"
        , ()=>setTimeout(()=>this.list.hidden=true, 500));
        this.searchBox.onblur=(event)=>{
            TESTVOICE.test = getVoice(this.searchBox.value);
        }
        this.searchBox.oninput=(event)=>{
            [...this.list.children].forEach(child=>{
                child.hidden = !(child.textContent.toLowerCase().includes(this.searchBox.value.toLowerCase()));
            });
            this.searchBox.onblur();
        }
        this.list.onclick=(event)=>{
            event.stopImmediatePropagation();
            event.stopPropagation();
            if (event.target.parentElement == this.list){
                this.searchBox.value = event.target.textContent;
                TESTVOICE.test = getVoice(this.searchBox.value);
            }
        }
    }
    get value(){
        if (this.values.includes(this.searchBox.value)){
            return this.searchBox.value;
        }
    }
}

// modals
class Modal{
    constructor(buttons){
        this.buttons = buttons;
        this.message = "";
        this.build();
        this.event();
        Modal.modals.push(this);
    }
    build(){
        add(this.modal = make()).className = "modal";
        add(this.messageBox = make('p'), this.modal);
        this.buttons.forEach((button, pos)=>{
            add(this[button] = make("button"), this.modal).textContent = button;
            this[button].pos = pos;
        })
    }
    event(){
        this.modal.onclick=(event)=>{
            if (event.target.nodeName == "BUTTON"){
                this.method(event.target.pos);
                this.close();
            }
        }
    }
    changeButtons(buttons){
        this.buttons.forEach((button, pos)=>{
            this[button].textContent = buttons[pos];
            this[button].pos = pos;
            this[buttons[pos]] = this[button];
        })
        this.buttons = buttons;
    }
    open(message, buttons){
        // do not do anything if a modal is already up
        if (Modal.showing) {
            this.blink();
            return;
        };
        showLoading()
        if (buttons) this.changeButtons(buttons);
        this.messageBox.textContent = message;
        this.modal.classList.add("shown");
        this[this.buttons[this.buttons.length-1]].focus();
        // promise
        // will be given to the event onclick
        return new Promise((resolve)=>this.method = resolve);
    }
    close(){
        this.modal.classList.remove("shown", "blink");
        hideLoading();
    }
    blink(){
        this.modal.classList.add("blink");
        setTimeout(()=>this.modal.classList.remove("blink"), 500);
    }
    get shown(){
        return this.modal.classList.contains("shown");
    }
    static get showing(){
        return Modal.modals.some(modal=>modal.shown);
    }
    static modals = [];
    static alertBox = new Modal(["CLOSE"]);
    static confirmBox = new Modal(["CANCEL", "OK"]);
}
function alert(message, buttons){
    return Modal.alertBox.open(message, buttons);
}
function confirm(message, buttons){
    return Modal.confirmBox.open(message, buttons);
}

// maise: young girl
// make search better by giving properties