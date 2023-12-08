#--------------------------------------------------------------------
# Instalar con pip install Flask
from flask import Flask, request, jsonify, render_template
#from flask import request

# Instalar con pip install flask-cors
from flask_cors import CORS

# Instalar con pip install mysql-connector-python
import mysql.connector

# Si es necesario, pip install Werkzeug
from werkzeug.utils import secure_filename

# No es necesario instalar, es parte del sistema standard de Python
import os
import time
#--------------------------------------------------------------------

app = Flask(__name__)
CORS(app)  # Esto habilitará CORS para todas las rutas

#--------------------------------------------------------------------
class Usuarios:
    #----------------------------------------------------------------
    # Constructor de la clase
    def __init__(self, host, user, password, database):
        # Primero, establecemos una conexión sin especificar la base de datos
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            db = database
        )
        self.cursor = self.conn.cursor()

        # Intentamos seleccionar la base de datos
        try:
            self.cursor.execute(f"USE {database}")
        except mysql.connector.Error as err:
            # Si la base de datos no existe, la creamos
            if err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                self.cursor.execute(f"CREATE DATABASE {database}")
                self.conn.database = database
            else:
                raise err

        # Una vez que la base de datos está establecida, creamos la tabla si no existe
        self.cursor.execute('''CREATE TABLE IF NOT EXISTS clientes (
            codigo INT AUTO_INCREMENT,
            nombre VARCHAR(30) NOT NULL,
            apellido VARCHAR(30) NOT NULL,
            dni VARCHAR(11) NOT NULL,
            email VARCHAR(30),
            password VARCHAR(30),
            PRIMARY KEY (codigo))
                                            ''')
        self.conn.commit()

        # Cerrar el cursor inicial y abrir uno nuevo con el parámetro dictionary=True
        self.cursor.close()
        self.cursor = self.conn.cursor(dictionary=True)

        #----------------------------------------------------------------
    def agregar_usuario(self, nombre, apellido, dni, email, password):
        # Verificamos si ya existe un usuario con el mismo código
        self.cursor.execute(f"SELECT * FROM clientes WHERE dni = {dni}")
        cliente_existe = self.cursor.fetchone()
        if cliente_existe:
            return False

        sql = "INSERT INTO clientes (nombre, apellido, dni, email, password) VALUES (%s, %s, %s, %s, %s)"
        valores = (nombre, apellido, dni, email, password)

        self.cursor.execute(sql, valores)        
        self.conn.commit()
        return True

        #----------------------------------------------------------------
    def consultar_usuario(self, dni):
        # Consultamos un usuarui a partir de su código
        self.cursor.execute(f"SELECT * FROM clientes WHERE dni = {dni}")
        return self.cursor.fetchone()
    
        #----------------------------------------------------------------
    def validar_usuario(self, email, password):
        # Consultamos un usuarui a partir de su email
        self.cursor.execute(f"SELECT * FROM clientes WHERE email = {email} AND password = {password}")
        return self.cursor.fetchone()

        #----------------------------------------------------------------
    def modificar_usuario(self, nuevo_nombre, nuevo_apellido, nuevo_email, nuevo_password, dni):
        self.cursor.execute(f"UPDATE clientes SET nombre = '{nuevo_nombre}', apellido = '{nuevo_apellido}', email = '{nuevo_email}', password = '{nuevo_password}' WHERE dni = {dni}")
        # sql = "UPDATE clientes SET nombre = %s, apellido = %s, email = %s, password = %s WHERE dni = %s"
        # valores = (nuevo_nombre, nuevo_apellido, nuevo_email, nuevo_password, dni)
        # self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0
    
        #----------------------------------------------------------------
    # def listar_usuarios(self):
    #     self.cursor.execute("SELECT * FROM clientes")
    #     usuarios = self.cursor.fetchall()
    #     return usuarios

        #----------------------------------------------------------------
    def eliminar_usuario(self, dni):
        # Eliminamos un usuario de la tabla a partir de su código
        self.cursor.execute(f"DELETE FROM clientes WHERE dni = {dni}")
        self.conn.commit()
        return self.cursor.rowcount > 0
    
        #----------------------------------------------------------------
    def mostrar_datos(self, email):
        # Mostramos los datos de un usuario a partir de su código
        usuario = self.consultar_usuario(email)
        if usuario:
            print("-" * 40)
            print(f"Código.....: {usuario['codigo']}")
            print(f"Nombre: {usuario['nombre']}")
            print(f"Apellido...: {usuario['apellido']}")
            print(f"Dni.....: {usuario['dni']}")
            print(f"Email..: {usuario['email']}")
            print(f"Contraseña..: {usuario['password']}")
            print("-" * 40)
        else:
            print("Usuario no encontrado.")


#--------------------------------------------------------------------
# Cuerpo del programa
#--------------------------------------------------------------------
# Crear una instancia de la clase Clientes
usuarios = Usuarios(host='localhost', user='root', password='', database='miapp')

# usuarios.agregar_usuario(1, "Ezequiel","Salguero","38601580","asd@hotmail.com")
# usuarios.agregar_usuario("Adan","Cuenca","33550497","asd@hotmail.com")
# catalogo.agregar_producto(3, "Mouse tres botones",11, 3400, "mouse.jpg",1)

# usuarios.eliminar_usuario("33550497")

# usuarios.modificar_usuario("Ezequiel", "Pepito", "38601580", "asd@hotmail.com" )


#--------------------------------------------------------------------
# @app.route("/usuario", methods=["GET"])
# def listar_usuarios():
#     usuario = usuarios.listar_productos()
#     return jsonify(usuario)


#--------------------------------------------------------------------
@app.route("/usuario/<dni>", methods=["GET"])
def mostrar_usuario(dni):
    usuario = usuarios.consultar_usuario(dni)
    if usuario:
        # return "<h1> Hola soy yo </h1>", 201
        return jsonify(usuario), 201
    else:
        return "Usuario no encontrado", 404
    

#--------------------------------------------------------------------
@app.route("/usuario", methods=["POST"])
def agregar_usuario():
    #Recojo los datos del form
    # codigo = request.form['codigo']
    nombre = request.form['nombre']
    apellido = request.form['apellido']
    dni = request.form['dni']
    email = request.form['email'] 
    password = request.form['password']

    if usuarios.agregar_usuario(nombre, apellido, dni, email, password):
        return jsonify({"mensaje": "Usuario agregado"}), 201
    else:
        return jsonify({"mensaje": "Usuario ya existe"}), 400


#--------------------------------------------------------------------
@app.route("/usuario/<dni>", methods=["PUT"])
def modificar_usuario(dni):
    #Recojo los datos del form
    nuevo_nombre = request.form.get("nombre")
    nuevo_apellido = request.form.get("apellido")
    nuevo_email = request.form.get("email")
    nuevo_password = request.form.get("password")
    print(request.form)


    if usuarios.modificar_usuario(nuevo_nombre, nuevo_apellido, nuevo_email, nuevo_password, dni):
        return jsonify({"mensaje": "Usuario modificado"}), 200
    else:
        return jsonify({"mensaje": "Usuario no encontrado"}), 403


#--------------------------------------------------------------------
@app.route("/usuario/<dni>", methods=["DELETE"])
def eliminar_usuario(dni):

    # Elimina el Usuario
    if usuarios.eliminar_usuario(dni):
        return jsonify({"mensaje": "Usuario eliminado"}), 200
    else:
        return jsonify({"mensaje": "Error al eliminar el usuario"}), 500
    

#--------------------------------------------------------------------
@app.route("/usuario/<email>/<password>", methods=["POST"])
def validar_usuario(email, password):
    usuario = usuarios.validar_usuario(email, password)
    if usuario:
        return jsonify(usuario), 201
    else:
        return "Usuario o constraseña incorrecto", 404

#---------------------------- INICIO DE SESION  ----------------------------------------








#--------------------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)
