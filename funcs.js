//make, get, identify, getall, randbtw
let make = (name='div')=>document.createElement(name)
  , get = (id)=>document.getElementById(id)
  , getE = (selector,value)=>document.querySelector(`[${selector}=${value}]`)
  , getS = (query)=>document.querySelector(query)
  , getAll = (query)=>[...document.querySelectorAll(query)];
let identify = ()=>getAll('[id]').forEach(i=>window[i.id] = i)
  , add = (what,to=document.body)=>to.appendChild(what)
  , bx = (who)=>who.getBoundingClientRect();

function randBtw(x=0, y=0, prec=0) {
    let n = `${(y - x + 1) * Math.random() + x}`;
    let s = n.split('.')
      , N = s[0] + s[1].slice(0, prec)
    return Number(N)
}
