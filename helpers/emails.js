import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
// Looking to send emails in production? Check out our Email API/SMTP product!
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
    }
  });
    
  const {email, nombre, token} = datos

  // Enviar el email
  await transport.sendMail({
    from: 'Portal Interno Galait',
    to: email,
    subject: 'Confirma tu Cuenta en Portal Galait',
    text: 'Confirma tu Cuenta en Portal Galait',
    html: `
            <p>Bienvenid@ ${nombre}, verifica tu cuenta en Portal Galait </p>
            
            <p>Tu cuenta ya esta lista, solo debes confirmarla utilizando el siguiente enlace:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}"> Confirmar Cuenta </a></p>

            <p> Si tu no creaste esta cuenta, puedes ignorar este mensaje<p>
        `
  })
}

export{
    emailRegistro
}