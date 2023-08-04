import React, {useRef} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate, useLocation } from "react-router-dom";
import { resetActivities } from "../redux/features/activitiesSlice";
import { Avatar } from 'primereact/avatar';

import { Menu } from 'primereact/menu';


function NavBar() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const {pathname} = useLocation();
    
  const currentEmpresa = useSelector((state: RootState) => state.activities.selectEmpresa.name)
  const menu = useRef<Menu>(null);

    const toggleMenu: React.MouseEventHandler<HTMLButtonElement> | undefined = (event) => {
    menu.current?.toggle(event);
};

    const logOut = () => {
      dispatch(resetActivities())
      window.localStorage.removeItem("token");
		  navigate('/');
    }

    const overlayMenuItems = [
      {
          label: 'Cerrar Sesión',
          icon: 'pi pi-sign-out',
          command: logOut
      }
  ];

    return (
      <>
      <nav className=" py-3 bg-blue-500 flex relative justify-center items-center">
        <p className="text-3xl font-bold text-white m-0">{currentEmpresa ? currentEmpresa : 'Selecciona la empresa'}</p>
        {pathname !== '/' && pathname !== '/login' ?
        <Avatar icon='pi pi-user' size="large" shape="circle"  onClick={toggleMenu} className="absolute right-2"></Avatar>: '' }
        <Menu ref={menu} model={overlayMenuItems} popup />
      </nav>
      </>
    );
  }
  
  export default NavBar;