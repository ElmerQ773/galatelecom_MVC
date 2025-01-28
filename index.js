import express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import principalRoutes from './routes/principalRoutes.js'
import db from './config/db.js'



// Crear la app
const app = express();

//Habilitar lectura de datos de formulario
app.use(express.urlencoded({extended: true}))

//Hbilitar Cookie Parser
app.use(cookieParser())

//Habilitar CSRF
// let csrfProtection = csrf({ cookie: true });
// app.use("/auth", csrfProtection, usuarioRoutes );

//Conexion a la base de datos
try{
    await db.authenticate();
    db.sync()
    console.log('Conexion Correcta a la Base de Datos')
} catch (error) {
    console.log(error)
}

//Habilitar Pug
app.set('view engine', 'pug');
app.set('views', './views')

//Carpeta publica (archivos estaticos)
app.use(express.static('public'))

// Routing
app.use('/auth', usuarioRoutes)
app.use('/', principalRoutes)


// Definir un Puerto y Arrancar el Proyecto

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`El servidor Esta funcionando en el puerto ${port}`);
});