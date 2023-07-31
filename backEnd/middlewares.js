const jwt = require("jsonwebtoken")
const { secretKey } = require("./secretKey")

const checkCredentialsExists = (req, res, next) => {
    const { email, password } = req.body
    if(!email || !password){
        res.status(401).send({ message : "no se recibieron las credenciales de la consulta"})
    }
    next()
}

const tokenVerification = (req, res, next) =>{
    const token = req.header("Authorizarion").split("Bearer ")[1]
    if (!token) throw { code: 401, message: "Debe incluir el token en las cabeceras (Authorization)"}

    try {

    const tokenValido = jwt.verify(token, secretKey)
    if (!tokenValido) throw { code: 401, message: "El token es inválido"}
    next()
} catch (error){
    throw {code: 401, message: "El token es inválido o ha expirado" }
}
}

module.exports = { checkCredentialsExists, tokenVerification}