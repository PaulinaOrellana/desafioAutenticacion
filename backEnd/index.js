const express = require('express');
const app = express();
const cors = require ('cors')
const jwt = require("jsonwebtoken")
const { secretKey } = require("./secretKey")

const { registrarUsuario, verificarCredenciales, obtenerDatosUsuario } = require('./consultasDb')
const { checkCredentialsExists, tokenVerification } = require("./middlewares")

app.get("/", (req, res) => {
    res.sendFile(__dirname + "../frontEnd/public/index.html")
})

app.listen(3000, console.log("SERVIDOR CONECTADO"))

app.use(cors())
app.use(express.json())

//Utilizaremos el archivo index.js para la creación de nuevas rutas, firma, verificación y decodificación de tokens.

app.post("/usuarios", checkCredentialsExists, async (req, res) => {
    try {
    const usuario = req.body
    await registrarUsuario(usuario)
    res.send("Usuario creado con éxito")
    } catch (error) {
    res.status(500).send(error)
    }   
    })

app.get("/usuarios", tokenVerification, async (req, res) => {
    try{
        const token = req.header("Authorization").split("Bearer")[1]
        const { email } = jwt.decode(token);
        const usuario = await obtenerDatosUsuario(email);
        res.json(usuario)
    } catch(error){
        console.log(error);
        const { code, message} = error
        res.status(code).send(message)
    }
})

app.post("/login", async (req, res) => {
   try {
   const { email, password } = req.body;
   await verificarCredenciales(email, password);
   const token = jwt.sign({ email }, secretKey);
   res.send(token);
     } catch ({code, message }) {
   console.log(message);
   res.status(code).send(message);
        }
      })
    