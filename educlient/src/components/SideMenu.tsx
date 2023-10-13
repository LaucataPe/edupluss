import React, { useState, useEffect } from "react";
import AppMenuitem from "./AppMenuitem";
import { AppMenuItem, MenuModel } from "../utils/types/types";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { Button } from "primereact/button";

const AppMenu = () => {
  const areas = useSelector((state: RootState) => state.areas.areas);
  const logUser = useSelector((state: RootState) => state.user.logUser);
  const navItems: MenuModel[] = areas.map((area) => {
    return {
      label: area.name,
      icon: "pi pi-fw pi-angle-right",
      to: `${area.id}`,
      area: area,
    };
  });

  const editAreas = [...navItems];
  editAreas.unshift({
    label: "Crear",
    icon: "pi pi-plus-circle",
    to: `/addArea`,
  });

  const model: AppMenuItem[] = [
    {
      label: "Áreas",
      items: navItems,
    },
  ];
  const xd: AppMenuItem[] = [
    {
      label: "Inicio",
      items: [
        { label: "Lista de Actividades", icon: "pi pi-check-circle", to: "/activitiesList" },
        { label: "Dashboard", icon: "pi pi-chart-pie", to: "/dashboard" },
        { label: "Progreso de usuarios", icon: "pi pi-list", to: "/progress" },
        { label: "Usuarios", icon: "pi pi-users", to: `/crud` },
      ],
    },
    {
      label: "Áreas",
      items: editAreas,
    },
  ];

  const menuItems = logUser.tipo === "admin" ? xd : model;

  // Estado local para el ancho de la pantalla
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Estado local para controlar la visibilidad del nav
  const [showNav, setShowNav] = useState(windowWidth >= 1600);

  // Función para manejar el cambio de tamaño de la ventana
  const handleWindowResize = () => {
    const newWidth = window.innerWidth;
    setWindowWidth(newWidth);
    if (newWidth >= 1600) {
      setShowNav(true);
    }
  };

  // Suscribirse al evento de cambio de tamaño de ventana
  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const [buttonOpacity, setButtonOpacity] = useState(0.1);
  let timer: any;

  const handleMouseLeave = () => {
    //@ts-ignore

    const timer = setTimeout(() => {
      setButtonOpacity(0.1);
    }, 100); // 2000 milisegundos (2 segundos)
  };

  // Función para cambiar la opacidad a 0.2 después de 2 segundos sin el mouse
  const handleMouseEnter = () => {
    clearTimeout(timer);
    setButtonOpacity(1); // Restablecer la opacidad
  };

  useEffect(() => {
    // Suscribirse al evento de cambio de tamaño de ventana
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <>
      <Button
        className="ml-1 py-5 px-4 rounded-lg h-[2rem] w-[5rem] z-10 shadow-xl"
        severity="info"
        style={{ position: "fixed", opacity: buttonOpacity }} // Aplicar opacidad dinámica
        onClick={() => setShowNav(!showNav)} // Toggle the nav visibility
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <i className="pi pi-bars" style={{ fontSize: "2rem" }}></i>
      </Button>
      <nav
        className={`bg-gray-50 layout-menu border-2 p-3 h-[100%] w-[14rem] my-4 mx-3 rounded-lg col-2 ${
          !showNav ? "hidden" : "block"
        }`}
        style={{
          position: "sticky", // Establece la posición fija
          zIndex: 5, // Asegura que esté por encima de otros elementos
          top: "0", // Lo coloca en la parte superior
          left: "0", // Lo coloca en la parte izquierda
        }}
      >
        {menuItems.map((item, i) =>
          !item?.seperator ? (
            <AppMenuitem item={item} root={true} index={i} key={item.label} />
          ) : (
            <li className="menu-separator" key={`separator-${i}`}></li>
          )
        )}
      </nav>
    </>
  );
};

export default AppMenu;
