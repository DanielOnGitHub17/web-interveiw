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
  , hide = (what) => what.style.display="none";


// switch screen
function switchScreen(screenID){
    get(screenID).style.display = ""
}