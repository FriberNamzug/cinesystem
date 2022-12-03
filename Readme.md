Proyecto de un sistema de un cine, para controlar las peliculas que se muestran.

## Endpoints de la API REST de Peliculas

### Autenticación/Registro

* Registro de usuario
Registra un usuario en la base de datos, envia un email de confirmación al usuario, el cual debe ser confirmado para poder iniciar sesión.
POST /auth/signup
`
{
    "nombre": string
    "email": string
    "password": string
}
`
* Confirmar Email
Confirma el email del usuario, para poder iniciar sesión. Es enviado un email al usuario con un link para confirmar el email.
GET /auth/activar-cuenta/:token

* Reenviar Email de confirmación
Reenvia el email de confirmación al usuario, para poder iniciar sesión. Requiere el email del usuario.
GET /auth/activar-cuenta/reenviar/:email

### Autenticación/Recuperación de contraseña

* Recuperar contraseña
Envia un email al usuario con un link para recuperar la contraseña, requiere el email del usuario.
GET /auth/recuperar/:email

* Cambiar contraseña
Cambia la contraseña del usuario, requiere el token enviado al usuario por email, y la nueva contraseña.
POST /auth/recuperar/:token
`
{
    "password": string
}
`

### Autenticación/2FA
* Crear 2FA
Crea el 2FA para el usuario, requiere la contraseña del usuario, y su token de autenticación enviado por header.
Headers: Authorization Bearer token
POST /auth/2fa/crear
`
{
    "password": string
}
`
* Validar 2FA
Valida el 2FA para el usuario, requiere el token lanzado por el 2FA y el token de autenticación enviado por header.
Headers: Authorization Bearer token
POST /auth/2fa/verificar
`
{
    "token": "500181"
}
`
* Eliminar 2FA
Elimina el 2FA para el usuario, requiere la contraseña del usuario, y el token de autenticación enviado por header.
Headers: Authorization Bearer token
POST /auth/2fa/eliminar
`
{
    "password": string
}
`

### Autenticación/Iniciar sesión

* Iniciar sesión
Inicia sesión en la aplicación, requiere el email y la contraseña del usuario.
POST /auth/signin
`
{
    "email": string
    "password": string
}
`
* Verificar Token
Verifica el token de autenticación del usuario, requiere el token de autenticación enviado por header.
Headers: Authorization Bearer token
GET /auth/verifytoken

### Usuarios/Administrador

* Obtener usuarios
Obtiene todos los usuarios registrados en la base de datos, requiere el token de autenticación enviado por header.
Headers: Authorization Bearer token
GET /usuarios/a/

* Obtener usuario
Obtiene un usuario registrado en la base de datos, requiere el token de autenticación enviado por header.
Headers: Authorization Bearer token
GET /usuarios/a/:id

* Crear usuario
Crea un usuario en la base de datos, requiere el token de autenticación enviado por header; El rol del usuario, 1 para administrador y 2 para usuario.
Headers: Authorization Bearer token
POST /usuarios/a/
`
{
    "nombre": string
    "email": string
    "password": string
    "rol": number
}
`

* Actualizar usuario
Actualiza un usuario en la base de datos, requiere el token de autenticación enviado por header.
Headers: Authorization Bearer token
PUT /usuarios/a/:id
`
{
    "nombre": string
    "email": string
    "rol": number
}
`

* Eliminar usuario
Elimina un usuario en la base de datos, requiere el token de autenticación enviado por header. Realiza una eliminación lógica, cambiando el estado del usuario a 0. El usuario no podrá iniciar sesión. No se puede eliminar el usuario administrador, para esto se debe cambiar el rol del usuario a 2.
Headers: Authorization Bearer token
DELETE /usuarios/a/:id

### Usuarios/Usuario

* Obtener usuario
Obtiene un usuario registrado en la base de datos, requiere el token de autenticación enviado por header.
Headers: Authorization Bearer token
GET /usuarios/u/:id

* Actualizar notificaciones
Actualiza las notificaciones del usuario, requiere el token de autenticación enviado por header.
Headers: Authorization Bearer token
POST /usuarios/u/notificaciones
`
{
    "notificaciones": boolean
}
`

* Actualizar usuario
Actualiza un usuario en la base de datos, requiere el token de autenticación enviado por header.
Headers: Authorization Bearer token
PUT /usuarios/u/
`
{
    "nombre": string
    "email": string
    "telefono": string | null
}
`

* Actualizar contraseña
Actualiza la contraseña del usuario, requiere el token de autenticación enviado por header.
Headers: Authorization Bearer token
PUT /usuarios/u/password
`
{
    "password": string
    "newPassword": string
}
`

* Eliminar usuario
Elimina un usuario en la base de datos, requiere el token de autenticación enviado por header. Realiza una eliminación lógica, cambiando el estado del usuario a 0. El usuario no podrá iniciar sesión.
Headers: Authorization Bearer token
DELETE /usuarios/u/

### Usuarios/Roles

* Obtener roles
Obtiene todos los roles registrados en la base de datos, requiere el token de autenticación enviado por header. Estos roles ya están creados en la base de datos, no se pueden crear nuevos.
Headers: Authorization Bearer token
GET /roles

### Peliculas/Peliculas

* Buscar peliculas
Busca peliculas en la base de datos, requiere parametros de busqueda los cuales se envian por la ruta.
GET /peliculas/search?pagina={number}&limite={number}&busqueda={string}

* Obtener peliculas
Obtiene todas las peliculas registradas en la base de datos, requiere parametros de pagina y limite los cuales se envian por la ruta.
GET /peliculas/p/?pagina={number}&limite={number}

* Obtener pelicula con sus funciones
Obtiene las funciones de una pelicula en especifico, requiere parametros de pagina y limite los cuales se envian por la ruta.
GET /peliculas/p/funciones/{:id_pelicula}?pagina={number}&limite={number}

* Obtener pelicula por genero
Obtiene todas las peliculas registradas en la base de datos por genero.
GET /peliculas/p/genero/{:id_genero}

* Obtener pelicula full 
Obtiene una pelicula registrada en la base de datos con todos sus caracteristicas como actores, directores, generos, idiomas e imagenes, requiere parametros de pagina y limite los cuales se envian por la ruta.
GET /peliculas/p/full?pagina={number}&limite={number}

* Obtener pelicula
Obtiene una pelicula registrada en la base de datos, requiere el id de la pelicula.
GET /peliculas/:id_pelicula

* Obtener peliculas con disponibilidad
Obtiene todas las peliculas registradas en la base de datos con disponibilidad, requiere parametros de pagina y limite los cuales se envian por la ruta.
GET /peliculas/p/disponibilidad?pagina={number}&limite={number}

* Actualizar la disponibilidad de una pelicula
Actualiza la disponibilidad de una pelicula registrada en la base de datos, requiere el id de la pelicula y el estado de la disponibilidad, Requiere el token de autenticación enviado por header.
Headers: Authorization Bearer token
PUT /peliculas/estatus/disponibilidad/:id_pelicula
`
{
    "disponibilidad": boolean
}
`

* Crear nueva pelicula
Crea una nueva pelicula en la base de datos, requiere el token de autenticación enviado por header.
Headers: Authorization Bearer token
POST /peliculas/
`
{
    "titulo": string
    "sinopsis": string
    "fecha_estreno": date
    "duracion": number
    "disponibilidad": boolean
    "generos": array, id de los generos
    "idiomas": array, id de los idiomas
    "actores": array, id de los actores
    "directores": array, id de los directores
}
`

* Actualizar pelicula
Actualiza una pelicula en la base de datos, requiere el id de la pelicula y el token de autenticación enviado por header.
Headers: Authorization Bearer token
PUT /peliculas/:id_pelicula
`
{
    "titulo": string
    "sinopsis": string
    "fecha_estreno": date
    "duracion": number
    "disponibilidad": boolean
    "generos": array, id de los generos
    "idiomas": array, id de los idiomas
    "actores": array, id de los actores
    "directores": array, id de los directores
}
`

* Eliminar pelicula
Elimina una pelicula en la base de datos, requiere el id de la pelicula y el token de autenticación enviado por header. Realiza una eliminación lógica, cambiando el estado de la pelicula a 0. La pelicula no podrá ser mostrada.
Headers: Authorization Bearer token
DELETE /peliculas/:id_pelicula

### Peliculas/Actores

* Buscar actores
Busca actores en la base de datos, requiere parametros de busqueda los cuales se envian por la ruta, requiere parametros de pagina y limite los cuales se envian por la ruta.
GET /actores/search?pagina={number}&limite={number}&busqueda={string}

* Obtener actores
Obtiene todos los actores registrados en la base de datos, requiere parametros de pagina y limite los cuales se envian por la ruta.
GET /actores/?pagina={number}&limite={number}

* Obtener actor
Obtiene un actor registrado en la base de datos, requiere el id del actor.
GET /actores/:id_actor

* Crear nuevo actor
Crea un nuevo actor en la base de datos, requiere el token de autenticación enviado por header.
Headers: Authorization Bearer token
POST /actores/
`
{
    "nombre": string
}
`

* Actualizar actor
Actualiza un actor en la base de datos, requiere el id del actor y el token de autenticación enviado por header.
Headers: Authorization Bearer token
PUT /actores/:id_actor
`
{
    "nombre": string
}
`

* Eliminar actor
Elimina un actor en la base de datos, requiere el id del actor y el token de autenticación enviado por header. Realiza una eliminación lógica, cambiando el estado del actor a 0. El actor no podrá ser mostrado.
Headers: Authorization Bearer token
DELETE /actores/:id_actor

### Peliculas/Directores

* Buscar directores
Busca directores en la base de datos, requiere parametros de busqueda los cuales se envian por la ruta, requiere parametros de pagina y limite los cuales se envian por la ruta.
GET /directores/search?pagina={number}&limite={number}&busqueda={string}

* Obtener directores
Obtiene todos los directores registrados en la base de datos, requiere parametros de pagina y limite los cuales se envian por la ruta.
GET /directores/?pagina={number}&limite={number}

* Obtener director
Obtiene un director registrado en la base de datos, requiere el id del director.
GET /directores/:id_director

* Crear nuevo director
Crea un nuevo director en la base de datos, requiere el token de autenticación enviado por header.
Headers: Authorization Bearer token
POST /directores/
`
{
    "nombre": string
}
`

* Actualizar director
Actualiza un director en la base de datos, requiere el id del director y el token de autenticación enviado por header.
Headers: Authorization Bearer token
PUT /directores/:id_director
`
{
    "nombre": string
}
`

* Eliminar director
Elimina un director en la base de datos, requiere el id del director y el token de autenticación enviado por header. Realiza una eliminación lógica, cambiando el estado del director a 0. El director no podrá ser mostrado.
Headers: Authorization Bearer token
DELETE /directores/:id_director

### Peliculas/Generos

* Buscar generos
Busca generos en la base de datos, requiere parametros de busqueda los cuales se envian por la ruta, requiere parametros de pagina y limite los cuales se envian por la ruta.
GET /generos/search?pagina={number}&limite={number}&busqueda={string}

* Obtener generos
Obtiene todos los generos registrados en la base de datos, requiere parametros de pagina y limite los cuales se envian por la ruta.
GET /generos/?pagina={number}&limite={number}

* Obtener genero
Obtiene un genero registrado en la base de datos, requiere el id del genero.
GET /generos/:id_genero

* Crear nuevo genero
Crea un nuevo genero en la base de datos, requiere el token de autenticación enviado por header.
Headers: Authorization Bearer token
POST /generos/
`
{
    "nombre": string
}
`

* Actualizar genero
Actualiza un genero en la base de datos, requiere el id del genero y el token de autenticación enviado por header.
Headers: Authorization Bearer token
PUT /generos/:id_genero
`
{
    "nombre": string
}
`

* Eliminar genero
Elimina un genero en la base de datos, requiere el id del genero y el token de autenticación enviado por header. Realiza una eliminación lógica, cambiando el estado del genero a 0. El genero no podrá ser mostrado.
Headers: Authorization Bearer token
DELETE /generos/:id_genero

### Peliculas/Idiomas

* Buscar idiomas
Busca idiomas en la base de datos, requiere parametros de busqueda los cuales se envian por la ruta, requiere parametros de pagina y limite los cuales se envian por la ruta.
GET /idiomas/search?pagina={number}&limite={number}&busqueda={string}

* Obtener idiomas
Obtiene todos los idiomas registrados en la base de datos, requiere parametros de pagina y limite los cuales se envian por la ruta.
GET /idiomas/?pagina={number}&limite={number}

* Obtener idioma
Obtiene un idioma registrado en la base de datos, requiere el id del idioma.
GET /idiomas/:id_idioma

* Crear nuevo idioma
Crea un nuevo idioma en la base de datos, requiere el token de autenticación enviado por header.
Headers: Authorization Bearer token
POST /idiomas/
`
{
    "nombre": string
}
`

* Actualizar idioma
Actualiza un idioma en la base de datos, requiere el id del idioma y el token de autenticación enviado por header.
Headers: Authorization Bearer token
PUT /idiomas/:id_idioma
`
{
    "nombre": string
}
`

* Eliminar idioma
Elimina un idioma en la base de datos, requiere el id del idioma y el token de autenticación enviado por header. Realiza una eliminación lógica, cambiando el estado del idioma a 0. El idioma no podrá ser mostrado.
Headers: Authorization Bearer token
DELETE /idiomas/:id_idioma

### Upload

* Subir imagen de pelicula
Sube una imagen de pelicula a la base de datos, requiere el token de autenticación enviado por header, requiere el id de la pelicula y el archivo de imagen, el archivo de imagen debe ser enviado por form-data, si ya existe una imagen de pelicula registrada, la imagen anterior será eliminada y reemplazada por la nueva.
Headers: Authorization Bearer token
POST /upload/p/:id_pelicula
`
{
    "image": file
}
`

* Subir imagen de actor
Sube una imagen de actor a la base de datos, requiere el token de autenticación enviado por header, requiere el id del actor y el archivo de imagen, el archivo de imagen debe ser enviado por form-data, si ya existe una imagen de actor registrada, la imagen anterior será eliminada y reemplazada por la nueva.
Headers: Authorization Bearer token
POST /upload/a/:id_actor
`
{
    "image": file
}
`

* Obtener imagen de pelicula
Obtiene una imagen de pelicula registrada en la base de datos, requiere el id de la pelicula.
GET /upload/p/:id_pelicula

* Obtener imagen de actor
Obtiene una imagen de actor registrada en la base de datos, requiere el id del actor.
GET /upload/a/:id_actor

### Funciones

* Obtener funciones
Obtiene todas las funciones registradas en la base de datos
GET /funciones

* Obtener funcion
Obtiene una funcion registrada en la base de datos, requiere el id de la funcion.
GET /funciones/:id_funcion

* Crear nueva funcion
Crea una nueva funcion en la base de datos, requiere el token de autenticación enviado por header, requiere el id de la pelicula, sala, aforo, horario y la fecha de la funcion(desde: fecha de inicio, hasta: fecha de fin) en la que va a estar disponible la pelicula.
Headers: Authorization Bearer token
POST /funciones/
`
{
    "id_pelicula": number,
    "aforo": number,
    "sala": number,
    "fechas": {
        "desde": date,
        "hasta": date
    },
    "horario": time
}
`

* Actualizar funcion
Actualiza una funcion en la base de datos, requiere el token de autenticación enviado por header,  requiere el id de la pelicula, el id de la funcion, sala, horario y la fecha de la funcion(desde: fecha de inicio, hasta: fecha de fin) en la que va a estar disponible la pelicula.
Headers: Authorization Bearer token
PUT /funciones/:id_funcion
`
{
    "sala": number,
    "fechas": {
        "desde": date,
        "hasta": date
    },
    "horario": time
}
`

* deshabilitar funcion
Deshabilita una funcion en la base de datos, requiere el token de autenticación enviado por header, requiere el id de la funcion.
Headers: Authorization Bearer token
DELETE /funciones/:id_funcion

### Boletos y ordenes de compra

* Crear nueva orden de compra
Crea una nueva orden de compra, genera un boleto y lo guarda como no pagado hasta que el usuario lo pague, requiere el token de autenticación enviado por header, requiere el id de la funcion y fecha de la funcion en la que se va a comprar el boleto.
Headers: Authorization Bearer token
POST /payments/create-order
`
{
    "id_funcion": number,
    "fecha": date
}
`

* Capturar orden de compra
Captura una orden de compra, aqui modificamos el boleto para que indique que ya se encuentra pagado, requiere el token de autenticación enviado por header, requiere payerid token y folio que nos genera Paypal.
Headers: Authorization Bearer token
GET /payments/capture-order?payerid={payerid}&token={token}&folio={folio}

* Cancelar orden de compra
Elimina el boleto que se genero al crear la orden de compra, requiere el token de autenticación enviado por header, requiere el folio del boleto.
Headers: Authorization Bearer token
GET payments/cancel-order?folio=3c05d8b1-eeef-42e0-81c4-0e2d2c36eb0e

* Obtenemos todos los boletos comprados (Por cliente)
Obtiene todos los boletos comprados por un cliente, requiere el token de autenticación enviado por header, y parametros de pagina y limite.
Headers: Authorization Bearer token
GET /boletos?pagina={number}&limite={numer}

* Obtenemos un solo boleto
Obtiene un solo boleto, requiere el token de autenticación enviado por header, y el id del boleto.
Headers: Authorization Bearer token
GET /boletos/:id_boleto