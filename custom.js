var link = document.getElementById('link3')
var sendButton = document.getElementById('send')

link.addEventListener('click', function(event) {
  event.preventDefault(); // previene la acción predeterminada del enlace
  openAlert('Abriendo alert')
});

send.addEventListener('click', function(event) {
  event.preventDefault(); // previene la acción predeterminada del enlace
  openAlert('Enviado')
});

function openAlert(msg) {
  talk(msg, true)
}
