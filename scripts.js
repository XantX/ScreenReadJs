var active_zoom = false
function makeZoom(event) {
    console.log('click')
    console.log(event)
    event.preventDefault();
    zoom.to({
      x: event.x,
      y: event.y,
      scale: 10
    });

}
active_filter = false
function aplicarFiltro() {
  if(!active_filter) {
    toggleTest(
      'colorBlindness',
      'tritanopia'
    );
  } else {
    removeTests('colorBlindness')
  }
  active_filter = !active_filter
}
/*protanopia   
protanomaly
deuteranopia
deuteranomaly
tritanopia            
tritanomaly            
achromatopsia
achromatomaly
grayscale*/

function addStyleClass() {
  var styleSheet = document.styleSheets[0]; // Asegúrate de seleccionar el stylesheet adecuado
  var cssRule = `.zoom-message-txtbox {  
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        background-color: #243c5a;
        color: #ffffff;
        font-size: 20rem;
        text-align: center;
        width: 80%;
        height: 80%;
    }`;

  // Agrega la regla a la hoja de estilos utilizando insertRule()
  styleSheet.insertRule(cssRule, styleSheet.cssRules.length);
}

function activeZoom() {
  console.log("Zoom:", active_zoom)
  const body = document.querySelector('.page-body');
  const active_message = `<div id="zoom-status" class="zoom-message-txtbox">On</div>`
  const deactive_message = `<div id="zoom-status" class="zoom-message-txtbox">Off</div>`
  addStyleClass()
  if (!active_zoom) {
    body.insertAdjacentHTML("beforebegin", active_message)
    setTimeout(() => {
      const zoom_message = document.getElementById("zoom-status")
      zoom_message.remove()
    }, 2000)
    document.querySelector('.page-body').addEventListener('click', makeZoom);
  } else {
    body.insertAdjacentHTML("beforebegin", deactive_message)
    setTimeout(() => {
      const zoom_message = document.getElementById("zoom-status")
      zoom_message.remove()
    }, 2000)
    document.querySelector('.page-body').removeEventListener('click', makeZoom);
  }
  active_zoom = !active_zoom
  console.log("Zoom:", active_zoom)
}

var selectedArticle = ""
var articleIndex = 0 

var selectedLink = ""
var linkIndex = 0

var screenReaderActive = false

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
  if (!screenReaderActive && e.ctrlKey === true && e.key.toLowerCase() === "backspace") {
    activeZoom()
  }

  if (e.ctrlKey === true && e.key.toLowerCase() === " ") {
    sayWelcome()
    screenReaderActive = !screenReaderActive 
  }
  if (screenReaderActive && e.ctrlKey === false && e.key.toLowerCase() === "enter" && selectedLink != "") {
    console.log(selectedLink)
    selectedLink.click()
  }
  if (screenReaderActive && e.ctrlKey === true && e.key.toLowerCase() === "enter") {
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

  if (screenReaderActive && e.ctrlKey === true && e.key.toLowerCase() === "arrowright") {
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
