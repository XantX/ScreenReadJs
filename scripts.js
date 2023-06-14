//---------------------APCA----------------------
function generateRandomColor() {
  var r = Math.floor(Math.random() * 256); // Valor entre 0 y 255
  var g = Math.floor(Math.random() * 256); // Valor entre 0 y 255
  var b = Math.floor(Math.random() * 256); // Valor entre 0 y 255

  var hexR = r.toString(16).padStart(2, "0"); // Asegurar que el valor tenga 2 dígitos
  var hexG = g.toString(16).padStart(2, "0"); // Asegurar que el valor tenga 2 dígitos
  var hexB = b.toString(16).padStart(2, "0"); // Asegurar que el valor tenga 2 dígitos

  var hexColor = "#" + hexR + hexG + hexB;

  return hexColor;
}

function getComplementaryColor(hexColor) {
  hexColor = hexColor.replace("#", "");
  var colorValue = parseInt(hexColor, 16);
  var complementaryValue = 0xffffff ^ colorValue;
  var complementaryColor =
    "#" + complementaryValue.toString(16).padStart(6, "0");
  return complementaryColor;
}

function aplicarColores(colores) {
  console.log("Colores aplicados")
  const {bgColor, complementColor} = colores
  var styleSheet = document.styleSheets[0]; // Asegúrate de seleccionar el stylesheet adecuado
  var cssRule = `.colors {  
      background-color: ${bgColor} !important;
      color: ${complementColor} !important;
    }`;
  console.log(cssRule)
  // Agrega la regla a la hoja de estilos utilizando insertRule()
  styleSheet.insertRule(cssRule, styleSheet.cssRules.length);
}

function generateColorPallete(bgColor) {
  console.log(bgColor);
  //Colores triada
  var triad = generateColorTriad(bgColor);
  console.log("Triad", triad);
  var contrast1 = calcBPCA(triad[0].toUpperCase(), bgColor);
  var contrast2 = calcBPCA(triad[1].toUpperCase(),bgColor);
  var contrast3 = calcBPCA(triad[2].toUpperCase(), bgColor);
  console.log('Triada BPCA: ', contrast1, "/", contrast2, "/", contrast3)
  //Color complementario 
  var complementColor = getComplementaryColor(bgColor);
  console.log("Color complementario", complementColor);
  var contrast4 = calcBPCA(complementColor, bgColor);
  console.log('Color complementario BPCA', contrast4)
  // Color de alto contraste
  const contrastingColors = getContrastingColors(bgColor)
  console.log("Contrasting colors", contrastingColors)

  contrastingColors.forEach((color) => {
    var contrast5 = calcBPCA(color, bgColor);
    console.log('Colores de alto contraste', contrast5)
  })
  const colors = {bgColor, complementColor}
  aplicarColores(colors)
}

//generateColorPallete("#fd8e18");
generateColorPallete("#1234b0");

// ============ Zoom seccion ============================
var active_zoom = false;
function makeZoom(event) {
  console.log("click");
  console.log(event);
  event.preventDefault();
  zoom.to({
    x: event.x,
    y: event.y,
    scale: 10,
  });
}

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
  console.log("Zoom:", active_zoom);
  const body = document.querySelector(".page-body");
  const active_message = `<div id="zoom-status" class="zoom-message-txtbox">On</div>`;
  const deactive_message = `<div id="zoom-status" class="zoom-message-txtbox">Off</div>`;
  addStyleClass();
  if (!active_zoom) {
    body.insertAdjacentHTML("beforebegin", active_message);
    setTimeout(() => {
      const zoom_message = document.getElementById("zoom-status");
      zoom_message.remove();
    }, 2000);
    document.querySelector(".page-body").addEventListener("click", makeZoom);
  } else {
    body.insertAdjacentHTML("beforebegin", deactive_message);
    setTimeout(() => {
      const zoom_message = document.getElementById("zoom-status");
      zoom_message.remove();
    }, 2000);
    document.querySelector(".page-body").removeEventListener("click", makeZoom);
  }
  active_zoom = !active_zoom;
  console.log("Zoom:", active_zoom);
}

//==================== Aplicacion de filtros ==================================
function addFilterStyleClass() {
  const styleSheet = document.styleSheets[0]; // Asegúrate de seleccionar el stylesheet adecuado
  const filter_button = `
      .filter-button {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #243c5a;
        color: #ffffff;
        text-align: center;
        line-height: 50px;
        cursor: pointer;
        z-index: 9999;
      }
  `;
  styleSheet.insertRule(filter_button, styleSheet.cssRules.length);
}

function addFilterBufferStyleClass() {
  const styleSheet = document.styleSheets[0]; // Asegúrate de seleccionar el stylesheet adecuado
  const filter_buffer = `
      .filter-list-buffer {
          position: fixed;
          top: 50%;
          right: 20px;
          transform: translateY(-50%);
          z-index: 9999;
          background-color: #243c5a;
          color: #ffffff;
      }
  `;
  styleSheet.insertRule(filter_buffer, styleSheet.cssRules.length);
}

function addFilterOptionsStyleClass() {
  const styleSheet = document.styleSheets[0]; // Asegúrate de seleccionar el stylesheet adecuado
  const filter_option = `
      .filter-option {
        padding: 0.5rem;
      }
  `;
  styleSheet.insertRule(filter_option, styleSheet.cssRules.length);
}

function buildFilterOption(filterOption) {
  return `
    <div class="filter-option" onClick="startFilter(event)">${filterOption}</div>
  `;
}

function buildColorOptions(colorOption) {
  return `
    <div id="${colorOption}" class="color-options" onClick="startFilter(event)">${colorOption}</div>
  `;
}

function startFilter(event) {
  const component = event.target;
  aplicarFiltro(component.textContent);
}

var filterViewOn = false;

function showFilterOptionsList() {
  if (filterViewOn) {
    const filter_buffer = document.getElementById("filter_buffer");
    filter_buffer.remove();
    filterViewOn = !filterViewOn;
    return;
  }
  const filterList = [
    "protanopia",
    "protanomaly",
    "deuteranopia",
    "deuteranomaly",
    "tritanopia",
    "tritanomaly",
    "achromatopsia",
    "achromatomaly",
    "grayscale",
  ];
   const colorOptions = [
     "colors",
     "filter"
   ];
  const filter_buffer = `
    <div class="filter-list-buffer" id="filter_buffer"></div>
  `;
  const filter_button = document.getElementById("filter_button");
  filter_button.insertAdjacentHTML("beforeend", filter_buffer);
  addFilterBufferStyleClass();

  /*colorOptions.forEach((option) => {
    const filter_buffer = document.getElementById("filter_buffer");
    filter_buffer.insertAdjacentHTML("beforeend", buildColorOptions(option));
  })*/

  filterList.forEach((filter) => {
    const filter_buffer = document.getElementById("filter_buffer");
    filter_buffer.insertAdjacentHTML("beforeend", buildFilterOption(filter));
  });

  addFilterOptionsStyleClass();
  filterViewOn = !filterViewOn;
}

function showFilterOptions() {
  const button_filter = `
    <div id="filter_button" class="filter-button" onClick="showFilterOptionsList()">0</div>
  `;
  addFilterStyleClass();
  const body = document.querySelector(".page-body");
  body.insertAdjacentHTML("beforebegin", button_filter);
}

showFilterOptions();

active_filter = false;
function aplicarFiltro(filtro) {
  if (!active_filter) {
    toggleTest("colorBlindness", filtro);
  } else {
    removeTests("colorBlindness");
  }
  active_filter = !active_filter;
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

//===========================Screen Reader=====================================
var selectedArticle = "";
var articleIndex = 0;

var selectedLink = "";
var linkIndex = 0;

var screenReaderActive = false;

const synth = window.speechSynthesis;

function talk(text, cancel = true) {
  cancel ? synth.cancel() : " ";
  synth.speak(new SpeechSynthesisUtterance(text));
}

function sayWelcome() {
  talk(
    "Hola bienvenido a la pagina X, si desea leer las acciones de la pagina presione control y enter"
  );
}

document.addEventListener("keydown", (e) => {
  console.log(e);
  if (
    !screenReaderActive &&
    e.ctrlKey === true &&
    e.key.toLowerCase() === "backspace"
  ) {
    activeZoom();
  }

  if (e.ctrlKey === true && e.key.toLowerCase() === " ") {
    sayWelcome();
    screenReaderActive = !screenReaderActive;
  }
  if (
    screenReaderActive &&
    e.ctrlKey === false &&
    e.key.toLowerCase() === "enter" &&
    selectedLink != ""
  ) {
    console.log(selectedLink);
    selectedLink.click();
  }
  if (
    screenReaderActive &&
    e.ctrlKey === true &&
    e.key.toLowerCase() === "enter"
  ) {
    var links = document.getElementsByClassName("text_reader_link");
    console.log(links[linkIndex].tagName);
    selectedLink = links[linkIndex];
    selectedLink.focus();

    if (links[linkIndex].tagName == "TEXTAREA") {
      selectedLink.addEventListener("input", function (e) {
        talk(selectedLink.value, true);
      });
      talk("Seleccionado un text area", true);
    } else {
      talk(selectedLink.textContent, true);
    }

    if (linkIndex === links.length - 1) {
      linkIndex = 0;
    } else {
      linkIndex += 1;
    }
  }

  if (
    screenReaderActive &&
    e.ctrlKey === true &&
    e.key.toLowerCase() === "arrowright"
  ) {
    var tags = document.getElementsByTagName("article");
    selectedArticle = tags[articleIndex];
    console.log(selectedArticle);
    console.log(articleIndex);

    talk(selectedArticle.textContent);

    if (articleIndex === tags.length - 1) {
      articleIndex = 0;
    } else {
      articleIndex += 1;
    }
  }
});
