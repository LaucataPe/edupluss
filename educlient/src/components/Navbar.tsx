import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { useLocation } from "react-router-dom";
import { resetActivities } from "../redux/features/activitiesSlice";
import { Avatar } from "primereact/avatar";

import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";

import { Menu } from "primereact/menu";
import { handleSideBar } from "../redux/features/utilsSlice";
import profile from "../assets/profile.png";
import logo from "../assets/edupluss2.png";

function NavBar() {
  const [active, setActive] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const enableSideBar = useSelector(
    (state: RootState) => state.utils.handleSideBar
  );
  const currentEmpresa = useSelector(
    (state: RootState) => state.activities.selectEmpresa.name
  );
  const menu = useRef<Menu>(null);

  const toggleMenu: React.MouseEventHandler<HTMLButtonElement> | undefined = (
    event
  ) => {
    menu.current?.toggle(event);
  };

  const logOut = () => {
    dispatch(resetActivities());
    window.localStorage.removeItem("token");
    window.location.replace("/");
  };

  const overlayMenuItems = [
    {
      label: "Cerrar Sesión",
      icon: "pi pi-sign-out",
      command: logOut,
    },
  ];

  const setShowSideBar = () => {
    setActive(!active);
    dispatch(handleSideBar(!enableSideBar));
  };

  return (
    <>
      <nav className=" navbar_background-color fixed py-3 top-0 px-3 w-full h-16  flex  justify-between items-center z-10">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-5 justify-center items-center ">
            <img
              src={logo}
              alt=""
              className="animation h-14 order-0 cursor-pointer"
            />
            <button
              onClick={() => setShowSideBar()}
              className={`animation cursor-pointer transition-transform duration-500 overflow-hidden relative w-[3rem] h-12 bg-none  ease-in-out  hover:scale-105
  rounded-full ${active ? "active" : ""} `}
            >
              <span className="rounded-md w-7 bg-[#3b82f6] absolute h-1 top-3.5 left-3.5 transition-transform duration-500"></span>
              <span className="rounded-md w-4 bg-[#3b82f6] absolute h-1 left-3.5  top-[24px] transition-transform duration-500"></span>
              <span className="rounded-md w-7 bg-[#3b82f6]  absolute h-1  left-3.5  top-[34px] transition-transform duration-500"></span>
            </button>
          </div>

          <h2 className="text-white font-normal m-0">
            {currentEmpresa ? currentEmpresa : "Selecciona la empresa"}
          </h2>

          <Avatar
            icon="pi pi-user"
            size="large"
            shape="circle"
            onClick={toggleMenu}
            className="animation"
            image={profile}
          ></Avatar>

          <Menu ref={menu} model={overlayMenuItems} popup />
        </div>
      </nav>
    </>
  );
}

export default NavBar;
