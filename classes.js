class Question{
    constructor(question="What do you want to be asked?"){
        this._question = question;
        this.build();
        this.event();
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
    }
    event(){
        this.deleter.onclick=()=>this.delete();
    }
    delete(){
        this.box.remove();
        Question.deletedQuestions.push(this);
    }
    restore(){
        QUESTIONLIST.append(this.box);
    }
    static iconValues = ['<>', 'X'];
    static deletedQuestions = [];
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
        this.holder.className = "switchold off";
        this.switch.tabIndex = -1;
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