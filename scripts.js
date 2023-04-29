var selectedArticle = ""
var articleIndex = 0 

const synth = window.speechSynthesis;

function talk(text, cancel = true) {
  cancel? synth.cancel() : " "
  synth.speak(new SpeechSynthesisUtterance(text))
}

function sayWelcome() {
  talk("Hola bienvenido a la pagina X, si desea leer las acciones de la pagina presione control y enter")
}

document.addEventListener("keydown", (e) => {
  e.preventDefault()
  console.log(e)
  if (e.ctrlKey === true && e.key.toLowerCase() === " ") {
    sayWelcome()
  }

  if (e.ctrlKey === true && e.key.toLowerCase() === "enter") {
    var links = document.getElementsByClassName('text_reader_link')
    for (let i = 0; i < links.length; i++) {
      talk(links[i].textContent, false)
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
