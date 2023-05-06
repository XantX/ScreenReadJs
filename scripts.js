var active_zoom = false

function makeZoom(event) {
    console.log('click')
    event.preventDefault();
    zoom.to({
      x: event.pageX,
      y: event.pageY,
      scale: 10
    });
}
function activeZoom() {
  console.log("Zoom:", active_zoom)
  if (!active_zoom) {
    document.querySelector('.page-body').addEventListener( 'click', makeZoom);
  } else {
    document.querySelector('.page-body').removeEventListener('click', makeZoom);
  }
  active_zoom = !active_zoom
  console.log("Zoom:", active_zoom)
}

var selectedArticle = ""
var articleIndex = 0 

var selectedLink = ""
var linkIndex = 0

const synth = window.speechSynthesis;

function talk(text, cancel = true) {
  cancel? synth.cancel() : " "
  synth.speak(new SpeechSynthesisUtterance(text))
}

function sayWelcome() {
  talk("Hola bienvenido a la pagina X, si desea leer las acciones de la pagina presione control y enter")
}

document.addEventListener("keydown", (e) => {
  console.log(e)
  if (e.ctrlKey === true && e.key.toLowerCase() === "backspace") {
    activeZoom()
  }

  if (e.ctrlKey === true && e.key.toLowerCase() === " ") {
    sayWelcome()
  }
  if (e.ctrlKey === false && e.key.toLowerCase() === "enter" && selectedLink != "") {
    console.log(selectedLink)
    selectedLink.click()
  }
  if (e.ctrlKey === true && e.key.toLowerCase() === "enter") {
    var links = document.getElementsByClassName('text_reader_link')
    console.log(links[linkIndex].tagName)
    selectedLink = links[linkIndex]
    selectedLink.focus()

    if (links[linkIndex].tagName == 'TEXTAREA') {
      selectedLink.addEventListener('input', function(e) {
        talk(selectedLink.value, true)
      });
      talk('Seleccionado un text area', true)
    } else {
      talk(selectedLink.textContent, true)
    }

    if(linkIndex === links.length - 1) {
      linkIndex = 0
    } else {
      linkIndex+=1
    }
  }

  if (e.ctrlKey === true && e.key.toLowerCase() === "arrowright") {
    var tags = document.getElementsByTagName("article")
    selectedArticle = tags[articleIndex]
    console.log(selectedArticle)
    console.log(articleIndex)

    talk(selectedArticle.textContent)

    if(articleIndex === tags.length - 1) {
      articleIndex = 0
    } else {
      articleIndex+=1
    }
  }

})
