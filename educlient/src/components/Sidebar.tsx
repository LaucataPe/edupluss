import {
  Activity,
  BarChart3,
  FolderTree,
  ListChecks,
  UserCheck,
  Users,
} from "lucide-react";
import SidebarWrapper, { SidebarItem } from "./SidebarItems";

const Sidebar = () => {
  return (
    <SidebarWrapper>
      <SidebarItem icon={<BarChart3 />} text={"Dashboard"} url={"/dashboard"} />
      <SidebarItem icon={<Users />} text={"Usuarios"} url={"/crud"} />
      <SidebarItem icon={<UserCheck />} text={"Progresos"} url={"/progress"} />
      <SidebarItem
        icon={<ListChecks />}
        text={"Evaluaciones"}
        url={"/evaluationsList"}
      />
      <SidebarItem icon={<FolderTree />} text={"Áreas"} url={"/areas"} />
    </SidebarWrapper>
  );
};

export default Sidebar;
