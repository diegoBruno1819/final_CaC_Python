
window.addEventListener('load', obtener_localstorage);
const formulario = document.querySelector("#form")

// formulario.addEventListener("submit", validar)
formulario.addEventListener("submit", traerUsuarioAPI)

const btnCart = document.getElementById('login');

const containerCartProducts = document.querySelector('.container-login');

btnCart.addEventListener('click', () => {
    containerCartProducts.classList.toggle('desplegable');
})



function traerUsuarioAPI(event) {
    // fetch('https://randomuser.me/api')
    const URL = "http://127.0.0.1:5000/"
    
    const mail = document.querySelector("#mail").value
    const contra = document.querySelector("#contraseña").value

    // Capturamos el evento de envío del formulario
    
    event.preventDefault(); // Evitamos que se envie el form 
    // console.log(mail);
    var formData = new FormData();

    
    formData.append('mail', mail);
    formData.append('contraseña', contra);


        fetch(URL + 'usuario/'+'"'+ mail +'"/'+contra, { 
        method: 'POST'
        })
            .then(function (response) {
                if (response.ok) { return response.json(); }
                })
            .then(function (data) {
                alert("Bienvenido "  + data.nombre)
                // const pas = data.password
                // console.log(pas)
                let user = data.nombre
                localStorage.setItem('usuario', user)
                usuario1 = localStorage.getItem('usuario')

                let apellido = data.apellido
                localStorage.setItem('apellido', apellido)
                apellido1 = localStorage.getItem('apellido')

                let dni = data.dni
                localStorage.setItem('dni', dni)
                dni1 = localStorage.getItem('dni')

                let email = data.email
                localStorage.setItem('email', email)
                email1 = localStorage.getItem('email')

                let password = data.password
                localStorage.setItem('password', password)
                password1 = localStorage.getItem('password')


                
                // Redirige a la página deseada
                window.location.href = '../pages/usuario.html';


                console.log(user)
                // window.location.replace('../index.html')
                

                })


            .catch(function (error) {
                // Mostramos el error, y no limpiamos el form.
                alert('Usuario o contraseña incorrecto.');
            })

}

function obtener_localstorage(e){
    e.preventDefault()
    // console.log('actualizo la pag')
    if (localStorage.getItem('usuario')){
        usuario1 = localStorage.getItem('usuario')
        // console.log(usuario1)
        document.getElementById("login").innerHTML = `
        <li><a href="../pages/usuario.html">${usuario1}</a></li>
        <li><button id="cerrar-sesion">Cerrar sesion</button></li>`
        
        // console.log(usuario1)
    }else{
        console.log("No hay entradas en el local storage")
    }
    const btn_cerrar_sesion = document.getElementById("cerrar-sesion")

    // function cerrar_sesion() {
    btn_cerrar_sesion.addEventListener("click", function(){
        localStorage.clear()
        document.getElementById("login").innerHTML = `
        <li><a href="../pages/login.html" id="login">Login</a></li>`
        })
    // }
    // cerrar_sesion
}




