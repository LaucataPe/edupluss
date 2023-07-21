
import { useNavigate } from 'react-router-dom';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import { CSSTransition } from 'react-transition-group';
import { useAppDispatch } from "../hooks/typedSelectors";
import { AppMenuItem, AppMenuItemProps } from '../utils/types/types';
import { getActivitiesByArea } from '../redux/features/activitiesSlice';
import { setCurrentArea } from '../redux/features/areaSlice';
const AppMenuitem = (props: AppMenuItemProps) => {
    const navigate = useNavigate()
    //const { activeMenu, setActiveMenu } = useContext(MenuContext);
    const item = props.item;
    const key = props.parentKey ? props.parentKey + '-' + props.index : String(props.index);
    
   // const active = activeMenu === key || activeMenu.startsWith(key + '-');
   const dispatch = useAppDispatch()

    const itemClick = (item: AppMenuItem | null) => {
        if(item && item.area){
            dispatch(getActivitiesByArea(item.area?.id ?? 0))
            dispatch(setCurrentArea(item.area))
        }else{
            if(item?.to)
            navigate(item.to)
        }
    };

    const subMenu = item!.items && item!.visible !== false && (
        <CSSTransition timeout={{ enter: 1000, exit: 450 }} classNames="layout-submenu" in={props.root ? true : false} key={item!.label}>
            <ul>
                {item!.items.map((child, i) => {
                    return <AppMenuitem item={child} index={i} className={child.badgeClass} parentKey={key} key={child.label} />;
                })}
            </ul>
        </CSSTransition>
    );

    return (
        <li className={classNames({ 'layout-root-menuitem': props.root})}>
                {props.root && item!.visible !== false && <div className="layout-menuitem-root-text">{item!.label}</div>}
                {(!item!.to || item!.items) && item!.visible !== false ? (
                    <a href={item!.url} onClick={() => itemClick(item ?? null)} className={classNames(item!.class, 'p-ripple')} target={item!.target} tabIndex={0}>
                        <i className={classNames('layout-menuitem-icon', item!.icon)}></i>
                        <span className="layout-menuitem-text">{item!.label}</span>
                        {item!.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                        <Ripple />
                    </a>
                ) : null}

            {item!.to && !item!.items && item!.visible !== false ? (
                <a onClick={() => itemClick(item ?? null)} className={classNames(item!.class, 'p-ripple')} tabIndex={0}>
                    <i className={classNames('layout-menuitem-icon  ', item!.icon)}></i>
                    <span className="layout-menuitem-text">{item!.label}</span>
                    {item!.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                    <Ripple />
                </a>
            ) : null}

            {subMenu}
        </li>
    );
};

export default AppMenuitem;
