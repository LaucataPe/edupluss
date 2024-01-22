//@ts-nocheck
import {
  BarChart3,
  FolderTree,
  ListChecks,
  UserCheck,
  Users,
} from "lucide-react";
import { InputSwitch } from "primereact/inputswitch";
import { useSelector } from "react-redux";

import SidebarWrapper, { SidebarItem } from "./SidebarItems";

const Sidebar = ({ isDarkMode, toggleDarkMode }: any) => {
  const expanded = useSelector((state: RootState) => state.utils.handleSideBar);

  return (
    <SidebarWrapper>
      <SidebarItem icon={<BarChart3 />} text={"Dashboard"} url={"/dashboard"} />
      <SidebarItem icon={<Users />} text={"Usuarios"} url={"/crud"} />
      <SidebarItem icon={<UserCheck />} text={"Progreso"} url={"/progress"} />
      <SidebarItem
        icon={<ListChecks />}
        text={"Evaluaciones"}
        url={"/evaluationsList"}
      />
      <SidebarItem icon={<FolderTree />} text={"Áreas"} url={"/areas"} />
      <div
        className={`flex flex-col justify-content-center align-items-center m-4 gap-2 transition-transform ease-in-out ${
          expanded ? "" : "transform translate-x-[-48px]"
        }`}
      >
        <span>
          {isDarkMode ? (
            <i className="pi pi-sun text-4xl" />
          ) : (
            <i className="pi pi-moon text-3xl" />
          )}
        </span>
        <InputSwitch checked={isDarkMode} onChange={toggleDarkMode} />
      </div>
    </SidebarWrapper>
  );
};

export default Sidebar;