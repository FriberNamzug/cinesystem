export const activarCuenta = (nombre, token) => `
    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 10px; text-align: center; font-family: sans-serif;">
        <h1 style="color: #2d3436;">Bienvenid@ ${nombre} a la plataforma de tu cine</h1>
        <p style="color: #2d3436;">Para activar tu cuenta da click en el siguiente enlace</p>
        <a href="${process.env.CLIENTE}/activar-cuenta/${token}/" style="background-color: #e84393; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Activar cuenta</a>
        <p>Si no puedes dar click en el enlace copia y pega la siguiente dirección en tu navegador</p>
        <p style="color: #2d3436;">${process.env.CLIENTE}/activar-cuenta/${token}/</p>
        </div>
    `

export const recuperarPasswordEmail = (nombre, token) => `
    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 10px; text-align: center; font-family: sans-serif;">
        <h1 style="color: #2d3436;">Hola ${nombre} has solicitado recuperar tu contraseña</h1>
        <p style="color: #2d3436;">Para recuperar tu contraseña da click en el siguiente enlace</p>
        <a href="${process.env.CLIENTE}/recuperar_password/${token}/" style="background-color: #e84393; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Recuperar contraseña</a>
        <p>Si no puedes dar click en el enlace copia y pega la siguiente dirección en tu navegador</p>
        <p style="color: #2d3436;">${process.env.CLIENTE}/recuperar_password/${token}/</p>
        </div>
        <div>
        <p style="color: #2d3436;">Si no has solicitado recuperar tu contraseña ignora este correo</p>
        </div>

    `

export const ordenDeCompra = (nombre, folio, fecha, hora, descripcion, costo) => `
    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 10px; text-align: center; font-family: sans-serif;">
        <h1 style="color: #2d3436;">Hola ${nombre} has realizado una compra en ${process.env.APP_NAME}</h1>
        <p style="color: #2d3436;">Folio de compra: ${folio}</p>
        <p style="color: #2d3436;">Fecha de compra: ${fecha}</p>
        <p style="color: #2d3436;">Hora de compra: ${hora}</p>
        <p style="color: #2d3436;">Descripción de la compra: ${descripcion}</p>
        <p style="color: #2d3436;">Costo de la compra: ${costo}</p>
    </div>
    <div>
        <p style="color: #2d3436;">Si no has realizado esta compra contacta a soporte</p>
    </div>
    `
