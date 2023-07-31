const bcrypt = require('bcryptjs')

const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'amapola',
  database: 'usuarios',
  allowExitOnIdle: true
});

// en consultas.js escribiremos todo lo relacionado con las funciones que interactúan con la base de datos

const registrarUsuario = async (usuario) => {
    let { email, password, rol, lenguage } = usuario;
    const passwordEncriptada = bcrypt.hashSync(password);
    password = passwordEncriptada;
    const values = [email, passwordEncriptada, rol, lenguage];
    const consulta = "INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)";
    await pool.query(consulta, values);
  };

const obtenerDatosUsuario = async (email) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    const { rows: [usuario], rowCount } = await pool.query(consulta, values)

    if (!rowCount){
        throw { code: 404, message: " No se encontró usuario con este email"}
    }

    delete usuario.password
    return usuario
}


  const verificarCredenciales = async (email, password) => {
    const values = [email];
    const consulta = "SELECT * FROM usuarios WHERE email = $1"; 
    const { rows: [usuario], rowCount } = await pool.query(consulta, values);
    console.log("usuario", usuario);
    console.log("rowCount", rowCount);
    const { password: passwordEncriptada } = usuario;
    const passwordCorrecta = bcrypt.compareSync(password, passwordEncriptada);

    if (!passwordCorrecta || !rowCount)
      throw { code: 401, message: "Email o contraseña incorrecta" };
  };

  module.exports = { registrarUsuario, verificarCredenciales, obtenerDatosUsuario }