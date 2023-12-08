const expresiones = {
	usuario: /^[a-zA-Z0-9\_\-]{4,16}$/, // Letras, numeros, guion y guion_bajo
	nombre: /^[a-zA-ZÀ-ÿ\s]{2,16}$/, // Letras y espacios, pueden llevar acentos.
	password: /^.{6,12}$/, // 4 a 12 digitos.
	correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
	dni: /^\d{8,14}$/ // 7 a 14 numeros.
}

const formulario_validacion = document.getElementById('formulario');
const inputs = document.querySelectorAll('#formulario input');

const campos = {
    nombre: false,
    apellido: false,
    dni: false,
    email: false,
    password: false,
}

const validar_formulario = (e) => {
    switch (e.target.name) {
        case "nombre":
            // console.log("nombre")
            validarCampo(expresiones.nombre, e.target, 'nombre');
        break;

        case "apellido":
            // console.log("apellido")
            validarCampo(expresiones.nombre, e.target, 'apellido');
        break;

        case "dni":
            // console.log("dni")
            validarCampo(expresiones.dni, e.target, 'dni');
        break;

        case "email":
            // console.log("email")
            validarCampo(expresiones.correo, e.target, 'email');
            validarEmailConfirm()
        break;

        case "email-confirm":
            // console.log("email 2")
            validarEmailConfirm()
        break;

        case "password":
            // console.log("contra")
            validarCampo(expresiones.password, e.target, 'password');
            validarPasswordConfirm()
        break;

        case "password-confirm":
            // console.log("contra2")
            validarPasswordConfirm()
        break;
    }
}

const validarCampo = (expresion, input, campo) => {
    if(expresion.test(input.value)){
        document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto')
        document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-correcto')
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-circle-check')
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-circle-xmark')
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-active')
        campos[campo] = true;
    } else {
        document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-incorrecto')
        document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto')
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-circle-xmark')
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-circle-check')
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-active')
        campos[campo] = false;
    }
}


const  validarPasswordConfirm = () => {
    const inputPassword1 = document.getElementById('password');
    const inputPasswordConfirm = document.getElementById('password-confirm');

    if(inputPassword1.value !== inputPasswordConfirm.value){
        document.getElementById(`grupo__password-confirm`).classList.add('formulario__grupo-incorrecto')
        document.getElementById(`grupo__password-confirm`).classList.remove('formulario__grupo-correcto')
        document.querySelector(`#grupo__password-confirm i`).classList.add('fa-circle-xmark')
        document.querySelector(`#grupo__password-confirm i`).classList.remove('fa-circle-check')
        document.querySelector(`#grupo__password-confirm .formulario__input-error`).classList.add('formulario__input-error-active')
        campos[password] = false;
    } else {
        document.getElementById(`grupo__password-confirm`).classList.remove('formulario__grupo-incorrecto')
        document.getElementById(`grupo__password-confirm`).classList.add('formulario__grupo-correcto')
        document.querySelector(`#grupo__password-confirm i`).classList.remove('fa-circle-xmark')
        document.querySelector(`#grupo__password-confirm i`).classList.add('fa-circle-check')
        document.querySelector(`#grupo__password-confirm .formulario__input-error`).classList.remove('formulario__input-error-active')
        campos[password] = true;
    }
}

const  validarEmailConfirm = () => {
    const inputEmail1 = document.getElementById('email');
    const inputEmailConfirm = document.getElementById('email-confirm');

    if(inputEmail1.value !== inputEmailConfirm.value){
        document.getElementById(`grupo__email-confirm`).classList.add('formulario__grupo-incorrecto')
        document.getElementById(`grupo__email-confirm`).classList.remove('formulario__grupo-correcto')
        document.querySelector(`#grupo__email-confirm i`).classList.add('fa-circle-xmark')
        document.querySelector(`#grupo__email-confirm i`).classList.remove('fa-circle-check')
        document.querySelector(`#grupo__email-confirm .formulario__input-error`).classList.add('formulario__input-error-active')
    } else {
        document.getElementById(`grupo__email-confirm`).classList.remove('formulario__grupo-incorrecto')
        document.getElementById(`grupo__email-confirm`).classList.add('formulario__grupo-correcto')
        document.querySelector(`#grupo__email-confirm i`).classList.remove('fa-circle-xmark')
        document.querySelector(`#grupo__email-confirm i`).classList.add('fa-circle-check')
        document.querySelector(`#grupo__email-confirm .formulario__input-error`).classList.remove('formulario__input-error-active')
    }
}


inputs.forEach((input) => {
    input.addEventListener('keyup', validar_formulario);
    input.addEventListener('blur', validar_formulario);
})

formulario_validacion.addEventListener('submit', (e) => {
    e.preventDefault();

    if(campos.nombre && campos.apellido && campos.dni && campos.email && campos.password){
        document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
            icono.classList.remove('formulario__grupo-correcto');
            document.getElementById('formulario__mensaje').classList.remove('formulario__mensaje-active')
        });
    } else {
        document.getElementById('formulario__mensaje').classList.add('formulario__mensaje-active')
    }
})