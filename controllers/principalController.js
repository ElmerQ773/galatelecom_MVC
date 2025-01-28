import jwt, { decode } from 'jsonwebtoken'


const admin = (req, res) => {
    const {_token} = req.cookies

    const decoded = jwt.verify(_token, process.env.JWT_SECRET)
    console.log(decoded.nombre)
    res.render('principal/principal',{
        nombreUsuario: decoded.nombre
    })
    
}

// const leerNombre = (req, res, next) => {
//     //verificar si hay un token
//     const {_token} = req.cookies

//     const decoded = jwt.verify(_token, process.env.JWT_SECRET)
//     console.log(decoded.nombre)
//     next();
// }

export{
    admin
}