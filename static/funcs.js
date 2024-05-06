// dom functions
let make = (name='div')=>document.createElement(name)
  , get = (id)=>document.getElementById(id)
  , getE = (selector,value)=>document.querySelector(`[${selector}=${value}]`)
  , getS = (query)=>document.querySelector(query)
  , getAll = (query)=>[...document.querySelectorAll(query)]
  , identify = ()=>getAll('[id]').forEach(i=>window[i.id] = i)
  , add = (what,to=document.body)=>to.appendChild(what)
  , bx = (who)=>who.getBoundingClientRect()
  , show = (what) => what.style.display=""
  , hide = (what) => what.style.display="none"
  , remove = (what, from) => from.splice(from.indexOf(what), 1);


// switch screen (still DOM)
function switchScreen(screenID){
    getAll("body>div").forEach(div=>{if (div.id) div.style.display = "none"});
    get(screenID).style.display = "";
}

// math
// not inclusive of the last one (a is the little one)
function randBtw(a, b){
    return a+parseInt((b-a)*Math.random());
}

// others for data handling
let choice = (array)=>array[randBtw(0, array.length)]
  , jsonStr = (obj)=>JSON.stringify(obj)
  , jsonObj = (str)=>JSON.parse(str)
  , copy = (obj)=>jsonObj(jsonStr(obj))
  , local = (item, value)=>value?localStorage.setItem(item, value):localStorage[item];