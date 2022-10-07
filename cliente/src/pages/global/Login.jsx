import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignIn from "../../components/login/SignIn";
import SignUp from "../../components/login/SignUp";

import { Modal, Button } from "@mui/material";

import bgLogin from "../../assets/bg-login.jpg";

import Close from "@mui/icons-material/Close";
import ReplyIcon from '@mui/icons-material/Reply';

export default function Login() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    //Comprobar si el usuario ya esta logueado
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }

  }, [navigate]);

  const handleOpen = () => setOpen(!open);

  const handleBack = () => navigate(-1);

  

  return (
    <div>
      <img src={bgLogin} alt="bgLogin" style={{ width: "100%", height: "100%", position: "fixed", zIndex: "-1" }} />
      <div className="flex justify-center items-center h-screen">
        <div className="w-96 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-2xl duration-500  sm:p-6 lg:p-8 ">
          <div className="flex justify-end">
            <Button onClick={handleBack} className="text-red-500 hover:text-red-700 duration-500">
              <ReplyIcon />
            </Button>
          </div>
          <div className="flex justify-center items-center">
            <h1 className="text-2xl font-bold text-gray-700">Iniciar Sesión</h1>
          </div>
          <SignIn />
          <div className="flex justify-center items-center mt-4">
            <span className="text-gray-500">¿No tienes cuenta?</span>
            <Button onClick={handleOpen} className="text-blue-500 hover:text-orange-500 duration-500 ml-2">Registrate</Button>
          </div>

        </div>
      </div>

      <Modal open={open}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }} className="bg-white border rounded-xl ">
          <div className="flex justify-end">
            <Button onClick={handleOpen} className="text-red-500 hover:text-red-700 duration-500">
              <Close />
            </Button>
          </div>

          <h1 className="text-2xl font-bold text-center">Registro</h1>
          <div className="flex justify-center items-center mb-5 p-5">
            <SignUp close={handleOpen} />
          </div>
        </div>
      </Modal>

    </div>
  )
}
