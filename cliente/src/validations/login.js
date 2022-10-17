export const error = {
    password: {
        error: false,
        message: "",
    },
    email: {
        error: false,
        message: "",
        data: ""
    },
    nombre: {
        error: false,
        message: "",
    }
}

export const validarNuevoRegistro = (e) => {
    if (e.target.name === "nombre") {
        if (e.target.value.length < 2) {
            return { ...error, error: true, message: "El nombre debe tener al menos 2 caracteres" }
        }
        else if (e.target.value.length > 20) {
            return { ...error, error: true, message: "El nombre debe tener menos de 20 caracteres" }
        }
        else if (!/^[a-zA-Z ]+$/.test(e.target.value)) {
            return { ...error, error: true, message: "El nombre solo puede tener letras y espacios" }
        }
        else {
            return { ...error, error: false, message: "" }
        }
    }
    if (e.target.name === "email") {
        if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(e.target.value)) {
            return { ...error, error: true, message: "El email no es válido" }
        }
        else {
            return { ...error, error: false, message: "" }
        }
    }
    if (e.target.name === "password") {
        if (e.target.value.length < 8) {
            return { ...error, error: true, message: "La contraseña debe tener al menos 8 caracteres" }
        } else if (e.target.value.length > 20) {
            return { ...error, error: true, message: "La contraseña debe tener menos de 20 caracteres" }
        } else if (!/[A-Z]/.test(e.target.value)) {
            return { ...error, error: true, message: "La contraseña debe tener al menos una letra mayuscula" }
        } else if (!/[a-z]/.test(e.target.value)) {
            return { ...error, error: true, message: "La contraseña debe tener al menos una letra minuscula" }
        } else if (!/[0-9]/.test(e.target.value)) {
            return { ...error, error: true, message: "La contraseña debe tener al menos un numero" }
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(e.target.value)) {
            return { ...error, error: true, message: "La contraseña debe tener al menos un caracter especial" }
        } else if (/([0-9])\1{2}/.test(e.target.value)) {
            return { ...error, error: true, message: "La contraseña no puede tener dos numeros consecutivos" }
        } else if (/([a-zA-Z])\1{2}/.test(e.target.value)) {
            return { ...error, error: true, message: "La contraseña no puede tener dos letras consecutivas" }
        }
        else {
            return { ...error, error: false, message: "" }
        }
    }


}