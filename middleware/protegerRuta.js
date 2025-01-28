import jwt, { decode } from 'jsonwebtoken'
//import Usuario from '../models/Usuario'

const protegerRuta = async (req, res, next) => {
    //verificar si hay un token
    const {_token} = req.cookies
    if(!_token) {
        return res. redirect('/auth/login')
    }

    //comprobar el token

    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        //const usuario = await Usuario.findByPk(decoded.id)
        


    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login')
    }
    
    next();
}

export {protegerRuta} 