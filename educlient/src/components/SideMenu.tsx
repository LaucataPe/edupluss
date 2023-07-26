import AppMenuitem from './AppMenuitem';
import { AppMenuItem } from '../utils/types/types';

import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

const AppMenu = () => {
    const areas = useSelector((state: RootState) => state.areas.areas)
    const logUser = useSelector((state: RootState) => state.user.logUser)

    const navItems = areas.map((area) => {
        return {
            label: area.name,
            icon: 'pi pi-fw pi-angle-right',
            to: `${area.id}`, 
            area: area
        }
    })

    const model: AppMenuItem[] = [
        {
            label: 'Áreas',
            items: navItems
        }
    ];
    const xd: AppMenuItem[] = [
        {
            label: 'Inicio',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/crud' }]
        },
        {
            label: 'Áreas',
            items: navItems
        },
        {
            label: 'Crear Áreas',
            items: [
                {  label: 'Crear', icon: 'pi pi-plus-circle', to: `/addArea` }
            ]
        }
    ];
    
    const menuItems = logUser.tipo === 'admin' ? xd : model;

    return (
      <nav className="layout-menu border-2 p-3 h-[100%] w-[14rem]">
        {menuItems.map((item, i) => (
          !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>
        ))}
      </nav>
    );
};

export default AppMenu;
