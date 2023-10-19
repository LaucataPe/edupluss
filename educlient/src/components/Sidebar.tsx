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
      <SidebarItem icon={<BarChart3 />} text={"dashboard"} url={"/dashboard"} />
      <SidebarItem icon={<Users />} text={"usuarios"} url={"/crud"} />
      <SidebarItem icon={<UserCheck />} text={"progresos"} url={"/progress"} />
      <SidebarItem
        icon={<ListChecks />}
        text={"actividades"}
        url={"/activitiesList"}
      />
      <SidebarItem icon={<FolderTree />} text={"areas"} url={"/admin"} />
    </SidebarWrapper>
  );
};

export default Sidebar;
