import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { activarCuenta } from "../../services/auth"

import { LinearProgress } from "@mui/material"

import { toast } from 'react-toastify'

export default function ActivarCuenta() {

    const { token } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        activarCuenta(token)
            .then(res => {
                console.log(res)
                toast.success(res.data.message, { autoClose: 5000 })
                navigate("/login")
                setLoading(false)
            })
            .catch(err => {
                toast.error(err.response.data.message || err.message)
                navigate('/login')
                console.log(err)
                setLoading(false)
            })
    }, [])


    return (
        <div>
            {loading && <LinearProgress />}
        </div>
    )
}
