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


var StartTouch = function(event) {
    event.preventDefault();
    ctx.beginPath();
};

var MoveTouch = function(event) {
    event.preventDefault();
    ctx.lineTo(event.touches[0].pageX, event.touches[0].pageY - 15);
    ctx.stroke();
};

var EndTouch = function(event) {
    event.preventDefault();
    var img = document.getElementById("scream");
    ctx.drawImage(img, 220, 290, 60, 60);

};


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
    //alert("Hello! I am an alert box!!");
    let data = canvas.toDataURL("image/png")
    
    let a = document.createElement("a")
    a.href = data
    //a.download = "sketch.png"
    var data1 = JSON.stringify({
        "image": `${a}`,

      });
      
      var xhr = new XMLHttpRequest();

      xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
          console.log(this.responseText);
        }
      });
      
      xhr.open("POST", "http://192.168.1.102:3000/paint");
      xhr.setRequestHeader("Content-Type", "application/json");
      
      xhr.send(data1);
      
    console.log(data)
	alert('asdf');
    // var img_data = data.replace(/^data:image\/\w+;base64,/, "");
    // var buf = new Buffer(img_data, 'base64');
    // fs.writeFile('new.png', buf,function(err, result) {
    //   if(err){console.log('error', err);}
    // });


})

canvas.addEventListener("touchstart", StartTouch, false);
canvas.addEventListener("touchmove", MoveTouch, false);
canvas.addEventListener("touchend", EndTouch, false);

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
