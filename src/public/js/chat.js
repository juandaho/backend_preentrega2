const socketClient = io();
const nombreUsuario = document.getElementById("nombreusuario");
const formulario = document.getElementById("formulario");
const inputmensaje = document.getElementById("mensaje");
const chat = document.getElementById("chat");

let usuario = null;

if (!usuario) {
    Swal.fire({
        title: "Nuestros CHAT está diponible para ayudarte",
        text: "Ingresa tu usuario",
        input: "text",
        inputValidator: (value) => {
            if (!value) {
                return "Necesitas ingresar tu Nombre";
            }
        }
    }).then(username => {
        usuario = username.value;
        nombreUsuario.innerHTML = usuario;
        socketClient.emit("nuevousuario", usuario);
    });
}

const handleSubmit = (e) => {
    e.preventDefault();
    const info = {
        user: usuario,
        message: inputmensaje.value
    };
    socketClient.emit("mensaje", info);
    inputmensaje.value = "";
};
formulario.onsubmit = handleSubmit;

const handleChat = (mensaje) => {
    const chatrender = mensaje.map(e => `<p><strong>${e.user}</strong>${e.message}`).join(" ");
    chat.innerHTML = chatrender;
};
socketClient.on("chat", handleChat);

const handleBroadcast = (usuario) => {
    Toastify({
        text: `Ingreso ${usuario} al chat`,
        duration: 5000,
        position: 'right',
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
};
socketClient.on("broadcast", handleBroadcast);

socketClient.on('connect_error', (err) => {
    console.log(`Error de conexión: ${err.message}`);
});
