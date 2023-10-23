import React, { useState, useRef, useEffect } from "react";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import axios from "axios";
import { UserEdit } from "../utils/interfaces";
import { setLogUser } from "../redux/features/userSlice";
import { Link } from "react-router-dom";

function UserProfile() {
  const logUser = useSelector((state: RootState) => state.user.logUser);
  const dispatch = useDispatch();
  const toast = useRef<Toast>(null);
  const [error, setError] = useState("");

  let [inputs, setInputs] = useState<UserEdit>({
    id: logUser?.id,
    username: logUser?.username,
    email: logUser?.email,
    password: "",
    newPassword: "",
    avatarImage: logUser?.avatarImage,
  });

  const [selectedAvatar, setSelectedAvatar] = useState(logUser?.avatarImage);

  useEffect(() => {
    setInputs({
      ...inputs,
      id: logUser?.id,
      username: logUser?.username,
      email: logUser?.email,
      avatarImage: logUser?.avatarImage,
    });
    setSelectedAvatar(logUser?.avatarImage);
  }, [logUser]);

  const handleInputs = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
    if (
      (name === "password" && value !== "" && inputs.newPassword === "") ||
      (name === "newPassword" && value === "" && inputs.password !== "")
    ) {
      setError("Ingrese una nueva contraseña");
    } else {
      setError("");
    }
  };

  const handleAvatarSelect = (imageUrl: string) => {
    setSelectedAvatar(imageUrl);
    setInputs({ ...inputs, avatarImage: imageUrl });
  };

  const handleSubmit = async () => {
    if (inputs.username) {
      inputs.username.trim();
    }
    if (inputs.email) {
      inputs.email.trim();
    }

    if (logUser.id !== 0) {
      // Filtra las propiedades con cadenas no vacías
      inputs = Object.fromEntries(
        Object.entries(inputs).filter(([key, value]) => value !== "")
      );

      try {
        const { data } = await axios.patch(
          "http://localhost:3001/user/patch",
          inputs
        );
        if (data) {
          if (data.error) {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: data.error,
              life: 3000,
            });
          } else {
            if (data.token && data.user) {
              const token = data.token;
              window.localStorage.setItem("token", token);
              setInputs({
                id: data.user.id,
                username: data.user.username,
                email: data.user.email,
                password: "",
                newPassword: "",
              });
              dispatch(setLogUser(data.user));
            } else {
              setInputs({
                id: data.id,
                username: data.username,
                email: data.email,
                password: "",
                newPassword: "",
              });
              dispatch(setLogUser(data));
            }
            toast.current?.show({
              severity: "success",
              summary: "Éxito",
              detail: "Usuario actualizado",
              life: 3000,
            });
          }
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Ha ocurrido un error",
            life: 2000,
          });
        }
      } catch (error: any) {
        console.error(error);
      }
    }
  };
  return (
    <div className="flex">
      <Toast ref={toast} />
      <div className="flex justify-center ml-2 sm:ml-0 sm:h-[90vh] w-[100%]">
        <div
          className={`card flex flex-col mt-4 mb-4 sm:mb-0 mr-2 sm:mr-0 px-4 py-3 sm:px-5 sm:py-5 overflow-hidden ${
            logUser.tipo === "empleado" ? "sm:h-[70%] md:h-[70%]" : "sm:h-[82%] md:h-[82%]"
          } w-[100%] sm:w-[98%]`}
        >
          <Link to={`/home`}>
            <Button
              icon="hidden pi pi-angle-double-left md:flex "
              label="Atrás"
              className="m-2 absolute mt-3 sm:mt-2 ml-2 w-[60px] h-[40px] text-xs sm:w-[84px] md:w-[100px] md:h-[50px] md:text-base"
              rounded
              severity="secondary"
            />
          </Link>
          <h3 className=" text-center text-2xl md:text-2xl lg:text-4xl">Editar Perfil</h3>
          <div className=" flex flex-col sm:flex-row">
            <div className="  sm:h-[100%] sm:w-[50%] text-center">
              <h4 className=" sm:h-[10%] pt-3 text-xl sm:text-2xl">Seleccione un Avatar</h4>
              <div className=" bg-gray-200 rounded-xl grid grid-cols-2 grid-rows-2 h-[300px] sm:h-[84%] w-[100%] sm ml-0 justify-items-center items-center">
                <div className=" sm:h-[50%] w-[100%] flex pl-4 lg:pl-0 pr-4 lg:pr-0 justify-center items-center gap-6">
                  <div
                    className={` ${
                      logUser.tipo === "empleado"
                        ? "max-h-[140px] max-w-[140px] sm:max-h-[180px] sm:max-w-[180px]"
                        : "max-h-[140px] max-w-[140px] sm:max-h-[200px] sm:max-w-[200px]"
                    } ${
                      selectedAvatar ===
                      "https://cdn.icon-icons.com/icons2/2643/PNG/512/female_woman_person_people_avatar_icon_159366.png"
                        ? "border-4 border-blue-500"
                        : ""
                    }`}
                    onClick={() =>
                      handleAvatarSelect(
                        "https://cdn.icon-icons.com/icons2/2643/PNG/512/female_woman_person_people_avatar_icon_159366.png"
                      )
                    }
                  >
                    <img
                      src="https://cdn.icon-icons.com/icons2/2643/PNG/512/female_woman_person_people_avatar_icon_159366.png"
                      className=" cursor-pointer"
                      alt="Avatar 1"
                    />
                  </div>
                  <div
                    className={` ${
                      logUser.tipo === "empleado"
                        ? "max-h-[140px] max-w-[140px] sm:max-h-[180px] sm:max-w-[180px]"
                        : "max-h-[140px] max-w-[140px] sm:max-h-[200px] sm:max-w-[200px]"
                    } ${
                      selectedAvatar ===
                      "https://cdn.icon-icons.com/icons2/2643/PNG/512/female_woman_people_person_avatar_black_tone_icon_159371.png"
                        ? "border-4 border-blue-500"
                        : ""
                    }`}
                    onClick={() =>
                      handleAvatarSelect(
                        "https://cdn.icon-icons.com/icons2/2643/PNG/512/female_woman_people_person_avatar_black_tone_icon_159371.png"
                      )
                    }
                  >
                    <img
                      src="https://cdn.icon-icons.com/icons2/2643/PNG/512/female_woman_people_person_avatar_black_tone_icon_159371.png"
                      className=" cursor-pointer"
                      alt="Avatar 2"
                    />
                  </div>
                </div>
                <div className=" sm:h-[50%] w-[100%] pl-4 lg:pl-0 pr-4 lg:pr-0 flex justify-center items-center gap-6">
                  <div
                    className={` ${
                      logUser.tipo === "empleado"
                        ? "max-h-[140px] max-w-[140px] sm:max-h-[180px] sm:max-w-[180px]"
                        : "max-h-[140px] max-w-[140px] sm:max-h-[200px] sm:max-w-[200px]"
                    } ${
                      selectedAvatar ===
                      "https://cdn.icon-icons.com/icons2/2643/PNG/512/male_man_people_person_avatar_white_tone_icon_159363.png"
                        ? "border-4 border-blue-500"
                        : ""
                    }`}
                    onClick={() =>
                      handleAvatarSelect(
                        "https://cdn.icon-icons.com/icons2/2643/PNG/512/male_man_people_person_avatar_white_tone_icon_159363.png"
                      )
                    }
                  >
                    <img
                      src="https://cdn.icon-icons.com/icons2/2643/PNG/512/male_man_people_person_avatar_white_tone_icon_159363.png"
                      className=" cursor-pointer"
                      alt="Avatar 3"
                    />
                  </div>
                  <div
                    className={` ${
                      logUser.tipo === "empleado"
                        ? "max-h-[140px] max-w-[140px] sm:max-h-[180px] sm:max-w-[180px]"
                        : "max-h-[140px] max-w-[140px] sm:max-h-[200px] sm:max-w-[200px]"
                    } ${
                      selectedAvatar ===
                      "https://cdn.icon-icons.com/icons2/2643/PNG/512/man_boy_people_avatar_user_person_black_skin_tone_icon_159355.png"
                        ? "border-4 border-blue-500"
                        : ""
                    }`}
                    onClick={() =>
                      handleAvatarSelect(
                        "https://cdn.icon-icons.com/icons2/2643/PNG/512/man_boy_people_avatar_user_person_black_skin_tone_icon_159355.png"
                      )
                    }
                  >
                    <img
                      src="https://cdn.icon-icons.com/icons2/2643/PNG/512/man_boy_people_avatar_user_person_black_skin_tone_icon_159355.png"
                      className=" cursor-pointer"
                      alt="Avatar 4"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" h-[100%] sm:w-[50%] flex flex-col px-4 py-4">
              <div className=" flex flex-col text-xl gap-4 pt-3">
                <div className=" flex flex-col gap-1">
                  <label className=" text-base sm:text-xl">Nombre</label>
                  <InputText
                    type="text"
                    name="username"
                    placeholder="Ingresar nombre de usuario"
                    className=" h-[46px] sm:h-[54px]"
                    value={inputs.username}
                    onChange={(e) => handleInputs(e)}
                  />
                </div>
                {logUser?.tipo === "admin" ? (
                  <div className=" flex flex-col gap-1">
                    <label className=" text-base sm:text-xl">Correo electrónico</label>
                    <InputText
                      type="text"
                      name="email"
                      className=" h-[46px] sm:h-[54px]"
                      value={inputs.email}
                      placeholder="Ingresar correo electrónico"
                      onChange={(e) => handleInputs(e)}
                    />
                  </div>
                ) : null}
                <div className=" flex flex-col gap-1">
                  <label htmlFor="password1" className=" text-base sm:text-xl">Contraseña actual</label>
                  <Password
                    name="password"
                    value={inputs.password}
                    onChange={(e) => handleInputs(e)}
                    toggleMask
                    className="w-[100%] pt-1 h-[46px] sm:h-[54px]"
                    inputClassName="w-full  "
                    placeholder="Ingresar contraseña"
                    feedback={false}
                  ></Password>
                  {/* <p className="p-error font-bold">{error}</p> */}
                </div>
                <div className=" flex flex-col gap-1">
                  <label htmlFor="password2" className=" text-base sm:text-xl">Nueva contraseña</label>
                  <Password
                    name="newPassword"
                    value={inputs.newPassword}
                    onChange={(e) => handleInputs(e)}
                    toggleMask
                    className="w-[100%] pt-1 h-[46px] sm:h-[54px]"
                    inputClassName="w-full  "
                    placeholder="Ingresar nueva contraseña"
                    feedback={false}
                  ></Password>
                  <div className=" min-h-[30px]">
                    <p className="p-error">{error}</p>
                  </div>
                </div>
                <div className=" flex items-center justify-center">
                  <Button
                    label="Guardar"
                    icon=" pi pi-save"
                    severity="info"
                    className="  m-0 w-[100px] h-[40px] text-xs sm:w-[120px] sm:h-[54px] sm:text-base"
                    onClick={handleSubmit}
                    disabled={
                      (inputs.username === "" &&
                        inputs.email === "" &&
                        inputs.password === "") ||
                      error !== ""
                        ? true
                        : false
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
