import useAdmin from "../../Hook/useAdmin";
import AdminOverview from "../AdminDashboard/AdminOverview/AdminOverview";
import UserOverview from "../UserDashboard/DashboardOverview/UserOverview";

const DashboardSwitch = () => {
  const [isAdmin, isAdminLoading] = useAdmin();

  if (isAdminLoading) {
    return <div>Loading...</div>;
  }

  return isAdmin ? <AdminOverview/> : <UserOverview/>;
};

export default DashboardSwitch;
