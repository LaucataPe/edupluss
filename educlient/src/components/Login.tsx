import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setLogUser } from "../redux/features/userSlice";
import { setEmpresa } from "../redux/features/activitiesSlice";
import rightBackground from "../assets/rightBackground.png";
//import logo from '../assets/logo.png'
import edupluss from "../assets/edupluss2.png";

import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState();
  const toast = useRef<Toast>(null);

  const handleInputs = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [event.target.name]: event.target.value });
  };
  const handleSubmit = async () => {
    if (inputs.email && inputs.password) {
      try {
        const { data } = await axios.post("http://localhost:3001/logUser", inputs);
        if (data) {
          toast.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: "Usuario actualizado",
            life: 3000,
          });
          const token = data.token;
          window.localStorage.setItem("token", token);
          
          if(data.user.tipo === "superadmin"){
            dispatch(setLogUser(data.user));
          } else if(data.user.tipo === "admin" || data.user.tipo === "empleado") {
            dispatch(setLogUser(data.user));
            dispatch(setEmpresa(data.company));
          }         
        }

        if (data.user.tipo === "superadmin") {
          navigate("/main");
        } else if (data.user.tipo === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/home");
        }
      } catch (error: any) {
        console.log(error.response.data);
        setError(error.response.data);
      }
    }
  };

  return (
    <>
      <div className="flex align-items-center xl:justify-content-start justify-content-center relative bg-[#FAFAFA]">
        <div
          className="flex flex-col w-[40rem] my-4 xl:my-[100px] p-4 xl:py-8 xl:px-8 sm:px-8 xl:bg-[#FAFAFA] bg-[#ffffff]"
          style={{ borderRadius: "53px" }}
        >
          <div className="hidden xl:block py-0">
            <img
              src={edupluss}
              alt="Logo Edupluss"
              className="h-[80px] absolute z-10 top-3 left-5"
            />
          </div>
          <div className="py-4 z-40">
            <i
              className="pi pi-arrow-left text-black text-4xl cursor-pointer transform transition-transform duration-400 hover:scale-75"
              onClick={() => {
                window.location.href = "/home";
              }}
            />
          </div>
          <img
            src={edupluss}
            alt="Logo Edupluss"
            className="h-[120px] mx-auto my-10 z-10 top-0 left-10 block xl:hidden"
          />
          <h2><span className="text-blue-500 xs:text-2xl">Inicia Sesión</span></h2>
          <div>
            <label className="block text-900 text-xl font-medium mb-2">
              Correo
            </label>
            <InputText
              type="text"
              name="email"
              placeholder="Ingresar correo"
              className="w-full md:w-30rem mb-5"
              style={{ padding: "1rem" }}
              value={inputs.email}
              onChange={(e) => handleInputs(e)}
            />
            <label
              htmlFor="password1"
              className="block text-900 font-medium text-xl mb-2"
            >
              Contraseña
            </label>
            <Password
              name="password"
              value={inputs.password}
              onChange={(e) => handleInputs(e)}
              toggleMask
              className="w-full mb-5"
              inputClassName="w-full p-3 md:w-30rem"
              placeholder="Ingresar contraseña"
              feedback={false}
            ></Password>
            <p className="p-error font-bold">{error}</p>
            <Button
              label="Ingresar"
              className="w-full p-3 text-xl shadow-2xl bg-blue-500"
              onClick={handleSubmit}
              disabled={
                inputs.email === "" || inputs.password === "" ? true : false
              }
            ></Button>
          </div>
        </div>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 50" className="fixed right-0 top-0 z-0 max-h-screen hidden xl:block">
            <circle cx="75" cy="35" r="70" fill="#007bff" />
          </svg>
          <img src={rightBackground} alt="rightBackground" className="h-[70%] fixed right-[8%] top-[15%] z-10 hidden xl:block"
          />
        </div>
      </div>
    </>
  );
}

export default Login;
