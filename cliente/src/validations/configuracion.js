export const error = {
    oldPassword: {
        error: false,
        message: "",
    },
    newPassword: {
        error: false,
        message: "",
        data: ""
    },
    newPasswordVerify: {
        error: false,
        message: "",
    }
}

export const validacionCambiarPassword = (e, password) => {
    if (e.target.name === "oldPassword") {
        return { ...error, error: false, message: "" }
    }
    if (e.target.name === "newPassword") {
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
    if (e.target.name === "newPasswordVerify") {
        if (e.target.value.length < 8) {
            return { ...error, error: true, message: "La contraseña debe de tener al menos 8 caracteres" }
        } else if (e.target.value !== password.newPassword) {
            return { ...error, error: true, message: "Las contraseñas no coinciden" }
        }
        else {
            return { ...error, error: false, message: "" }
        }
    }


}