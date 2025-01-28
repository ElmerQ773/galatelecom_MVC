import {check, validationResult} from 'express-validator'
import bcrypt from 'bcrypt'
import Usuario from '../models/Usuario.js'
import {generarId, generarJWT} from '../helpers/token.js'
import {emailRegistro} from '../helpers/emails.js'

const  formularioLogin = (req, res) => {
    res.render('auth/login',{
    pagina: 'Inicia Sesion'
    });
}

const autenticar = async (req, res) => {
    // Validacion
    await check('email').isEmail().withMessage('Por favor escribe un email valido').run(req)
    await check('password').notEmpty().withMessage('La contraseña es Obligatoria').run(req)

    let resultado = validationResult(req)

    // Verificar que el resultado este vacio
        if(!resultado.isEmpty()) {
            //Errores
            return res.render('auth/login', {
                pagina:'Iniciar Sesion',
                errores: resultado.array(),
            })
    }

    const {email, password} = req.body
    // comprobar si el usuario existe
    const usuario = await Usuario.findOne({where: {email}})
    if (!usuario) {
        return res.render('auth/login', {
            pagina:'Iniciar Sesion',
            errores: [{msg: 'El Usuario No Existe'}],
        })
    }
    // Comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
        return res.render('auth/login', {
            pagina:'Iniciar Sesion',
            errores: [{msg: 'Tu cuenta no ha sido confirmada'}],
        })
    }
    //Revisar el password
    if(!usuario.verificarPassword(password)) {
        return res.render('auth/login', {
            pagina:'Iniciar Sesion',
            errores: [{msg: 'La contraseña es incorrecta'}]
        })
    }

    //Autenticar al Usuario
    const token = generarJWT({id: usuario.id, nombre: usuario.nombre} );
    console.log(token)

    //Almacenar en un cookie
    return res.cookie('_token', token, {
        httpOnly: true,
        //secure: true
    }).redirect('/principal')

}
const  formularioRegistro = (req, res) => {
    res.render('auth/registro',{
    pagina: 'Crea Una Cuenta',
    //csrfToken: req.csrfToken()
    });
}

const registrar = async (req, res) => {
    //Validation 
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req)
    await check('apellido').notEmpty().withMessage('El apellido es obligatorio').run(req)
    await check('email').isEmail().withMessage('Por favor escribe un email valido').run(req)
    await check('password').isLength({ min: 8 }).withMessage('La contraseña debe contener minimo 8 caracteres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req)

    let resultado = validationResult(req)

    // Verificar que el resultado este vacio
        if(!resultado.isEmpty()) {
            //Errores
            return res.render('auth/registro', {
                pagina:'Crear Cuenta',
                errores: resultado.array(),
                usuario: {
                    nombre: req.body.nombre,
                    apellido: req.body.apellido,
                    email: req.body.email
                },
                //csrfToken: req.csrfToken()
            })
        }
    //Extraer datos
        const { nombre, apellido, email, password } = req.body

    // Verificar que el usuario no este duplicado
        const existeUsiario = await Usuario.findOne( { where : {email}})
            if( existeUsiario){
                return res.render('auth/registro', {
                    pagina:'Crear Cuenta',
                    errores: [{msg: 'El Usuario ya esta Registrado'}],
                    usuario: {
                        nombre: req.body.nombre,
                        apellido: req.body.apellido,
                        email: req.body.email
                    }
                })
            }

        //Almacenar Un usuario
           const usuario = await Usuario.create({
                nombre,
                apellido,
                email,
                password,
                token: generarId()
        });

        //Enviar email de confirmacion
        emailRegistro({
            nombre: usuario.nombre,
            email: usuario.email,
            token: usuario.token
        })

        //Mostrar mensaje de confirmacion
        res.render('templates/mensaje',{
            pagina: 'Cuenta Creada Correctamente',
            mensaje: 'Te enviamos un email de confirmacion'
        })

}

        // Funcion que confirma una cuenta
        const confirmar = async (req, res) => {
            const {token} = req.params;
        
        // verificar si el token es valido
        const usuario = await Usuario.findOne({where: {token}})

            if(!usuario) {
                return res.render('auth/confirmar-cuenta', {
                    pagina: 'Error al confirmar tu cuenta',
                    mensaje: 'Hubo un error al confirmar tu cuenta, Por favor intenta de nuevo',
                    error: true
                })
            }
            //confirmar la cuenta
            usuario.token = null;
            usuario.confirmado = true;
            await usuario.save();

            res.render('auth/confirmar-cuenta', {
                pagina: 'Cuenta Confirmada',
                mensaje: 'La cuenta se confirmo correctamente',

        })
    }

const  formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password',{
    pagina:'Recupera el acceso'
    });
}


export {formularioLogin, autenticar, formularioRegistro, registrar, confirmar, formularioOlvidePassword}