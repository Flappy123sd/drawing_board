const canvas = document.getElementById("Canvas");
const context = canvas.getContext("2d");
const erase = document.getElementById("Erase");
const eraserWidthInput = document.getElementById("eraserWidth");
const clearButton = document.getElementById("Clear");
const canvasColorPicker = document.getElementById("canvasColorPicker");
const penColorPicker = document.getElementById("penColorPicker");
const penwidth = document.getElementById("penwidth");

const squaresize = document.getElementById("squaresize");
const squarecolor = document.getElementById("squarecolor");

const circr = document.getElementById("circr");
const circcolor = document.getElementById("circcolor");

const rectlen = document.getElementById("rectlen");
const rectwid = document.getElementById("rectwid");
const rectcolor = document.getElementById("rectcolor");

const trianglesize = document.getElementById("trianglesize");
const trianglecolor = document.getElementById("trianglecolor");

const dot = document.getElementById("dot");

const upload = document.getElementById("upload");
const input = document.getElementById("uploadInput");

const txt = document.getElementById("txt");
const txtcol = document.getElementById("txtcol");
const txtsize = document.getElementById("txtsize");

let eraserColor = "white";

const penWidthInputs = {
  Black: document.getElementById("penwidthblack"),
  Blue: document.getElementById("penwidthblue"),
  Green: document.getElementById("penwidthgreen"),
  Red: document.getElementById("penwidthred"),
  Grey: document.getElementById("penwidthgrey"),
  Yellow: document.getElementById("penwidthyellow"),
  Orange: document.getElementById("penwidthorange"),
};

let isDrawing = false;
var isDrawingDotted = false;
let lastX = 0;
let lastY = 0;

function startDraw(event) {
  isDrawing = true;
  draw(event);
}

function draw(event) {
  if (!isDrawing) return;
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;

  context.lineCap = "round";

  if (isShapeDrawn) {
    isDrawing = false;
    context.beginPath();
    isShapeDrawn = false;
  } else {
    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
    context.closePath();
    lastX = x;
    lastY = y;
    // console.log(x,y);
  }
}

function setWidthForColor(color, lineWidth) {
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
}

function stopDrawing() {
  isDrawing = false;
  context.beginPath();
}

function setupColorButton(color, input) {
  const colorElement = document.getElementById(color);
  colorElement.addEventListener("click", function () {
    const lineWidth = parseInt(input.value, 10);
    setWidthForColor(color.toLowerCase(), lineWidth);
  });

  input.addEventListener("input", function () {
    const lineWidth = parseInt(input.value, 10);
    setWidthForColor(color.toLowerCase(), lineWidth);
  });
}

for (const color in penWidthInputs) {
  setupColorButton(color, penWidthInputs[color]);
}

erase.addEventListener("click", function () {
  setWidthForColor(eraserColor, parseInt(eraserWidthInput.value, 10));
});

eraserWidthInput.addEventListener("input", function () {
  setWidthForColor(eraserColor, parseInt(eraserWidthInput.value, 10));
});

penColorPicker.addEventListener("input", function () {
  setWidthForColor(penColorPicker.value, parseInt(penwidth.value, 10));
});

penwidth.addEventListener("input", function () {
  setWidthForColor(penColorPicker.value, parseInt(penwidth.value, 10));
});

clearButton.addEventListener("click", function () {
  context.clearRect(0, 0, canvas.width, canvas.height);
});

canvasColorPicker.addEventListener("input", function () {
  canvas.style.backgroundColor = canvasColorPicker.value;
  eraserColor = canvas.style.backgroundColor;
  return canvas.style.backgroundColor;
});

squaresize.addEventListener("input", function () {
  squarecolor.addEventListener("input", function () {
    context.fillStyle = `${squarecolor.value.toLowerCase()}`;
    context.fillRect(
      lastX,
      lastY,
      `${squaresize.value}`,
      `${squaresize.value}`
    );
  });
});

rectlen.addEventListener("input", function () {
  rectwid.addEventListener("input", function () {
    rectcolor.addEventListener("input", function () {
      context.fillStyle = `${rectcolor.value.toLowerCase()}`;
      context.fillRect(lastX, lastY, `${rectwid.value}`, `${rectlen.value}`);
    });
  });
});

let isShapeDrawn = false;
circr.addEventListener("input", function () {
  circcolor.addEventListener("input", function () {
    const radius = parseInt(circr.value, 10);
    const color = circcolor.value.toLowerCase();
    context.beginPath();
    context.arc(lastX, lastY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
    context.closePath();
    isShapeDrawn = true;
  });
});

trianglesize.addEventListener("input", function () {
  trianglecolor.addEventListener("input", function () {
    const size = parseInt(trianglesize.value, 10);
    const color = trianglecolor.value.toLowerCase();

    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(lastX + size, lastY);
    context.lineTo(lastX + size / 2, lastY - (Math.sqrt(3) / 2) * size);
    context.closePath();

    context.fillStyle = color;
    context.fill();
    isShapeDrawn = true;
  });
});

txt.addEventListener("input", function () {
  txtsize.addEventListener("input", function () {
    txtcol.addEventListener("input", function () {
      context.fillStyle = txtcol.value.toLowerCase();
      context.font = `${txtsize.value}px Arial`;
      context.fillText(txt.value, lastX, lastY);
    });
  });
});

upload.addEventListener("click", function () {
  if (input.files.length === 0) {
    alert("Please select an image file.");
    return;
  }
  var img = new Image();

  img.src = URL.createObjectURL(input.files[0]);
  img.onload = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
});

dot.addEventListener("change", function () {
  if (dot.checked) {
    setWidthForColor("black", 5);
    context.setLineDash([5, 10]);
    canvas.addEventListener("mousedown", startDrawingDotted);
    canvas.addEventListener("mousemove", drawDotted);
    canvas.addEventListener("mouseup", stopDrawingDotted);
    function startDrawingDotted(e) {
      isDrawingDotted = true;
      context.beginPath();
      context.moveTo(
        e.clientX - canvas.offsetLeft,
        e.clientY - canvas.offsetTop
      );
    }

    function drawDotted(e) {
      if (!isDrawingDotted) return;

      context.lineTo(
        e.clientX - canvas.offsetLeft,
        e.clientY - canvas.offsetTop
      );
      context.stroke();
    }

    function stopDrawingDotted() {
      isDrawingDotted = false;
      context.closePath();
    }
  } else {
    setWidthForColor("black", 5);
    context.setLineDash([0, 0]);
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);
  }
});

// window.addEventListener("beforeunload", function (e) {
//   // Cancel the event
//   e.preventDefault();
//   // Chrome requires returnValue to be set
//   e.returnValue = "";

//   // Display a confirmation alert
//   var confirmationMessage = "Changes you made may not be saved";
//   e.returnValue = confirmationMessage; // Standard for most browsers
//   return confirmationMessage; // For some older browsers
// });

setWidthForColor("black", 5);

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);
