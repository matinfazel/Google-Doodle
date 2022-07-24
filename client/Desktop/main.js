//import { io } from "socket.io-client"

const canvas = document.getElementById("canvas")
canvas.height = window.innerHeight
canvas.width = window.innerWidth
const imgconverted = document.querySelector("#imgConverted")
const ctx = canvas.getContext("2d")

let prevX = null
let prevY = null

ctx.lineWidth = 10
ctx.lineCap = "round";
let draw = false
//io = require('socket.io-client')
//const socket = io('http://127.0.0.1:3000');

let clrs = document.querySelectorAll(".clr")
clrs = Array.from(clrs)
clrs.forEach(clr => {
    clr.addEventListener("click", () => {
        ctx.strokeStyle = clr.dataset.clr
    })
})

let clearBtn = document.querySelector(".clear")
clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
})

// Saving drawing as image
let saveBtn = document.querySelector(".save")
saveBtn.addEventListener("click", () => {
    var response;
    let data = canvas.toDataURL("image/png")
    
    let a = document.createElement("a")
    a.href = data
    //a.download = "sketch.png"
    // var data1 = JSON.stringify({
    //     "image": `${a}`,

    //   });
      
    //var xhr = new XMLHttpRequest();

    // xhr.addEventListener("readystatechange", function() {
    //     if(this.readyState === 4) {
    //       console.log(this.responseText);
    //     }
    //   });
      
    // xhr.open("POST", "http://localhost:8000/tensor");
    // xhr.setRequestHeader("Content-Type", "application/json");
      
    // xhr.send(data1);


//     var myHeaders = new Headers();
// myHeaders.append("Content-Type", "application/json");

// var requestOptions = {
//   method: 'GET',
//   headers: myHeaders,
  
//   redirect: 'follow'
// };

// fetch("http://127.0.0.1:8000/tensor", requestOptions)
//   .then(response => response.text())
//   .then(result => console.log(result))
//   .catch(error => console.log('error', error));
     
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
    "image": `${a}`,
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

    fetch("http://127.0.0.1:8000/paint", requestOptions)
  .then(response => response.text())
  .then(result => alert(result))
  .catch(error => console.log('error', error));


})



window.addEventListener("mousedown", (e) => draw = true)
window.addEventListener("mouseup", (e) => draw = false)

window.addEventListener("mousemove", (e) => {
    if(prevX == null || prevY == null || !draw){
        prevX = e.clientX
        prevY = e.clientY
        return
    }

    let currentX = e.clientX
    let currentY = e.clientY

    ctx.beginPath()
    ctx.moveTo(prevX, prevY)
    ctx.lineTo(currentX, currentY)
    ctx.stroke()

    prevX = currentX
    prevY = currentY
})