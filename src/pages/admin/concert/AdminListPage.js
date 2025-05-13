import React from "react";
import TicketListComponent from "../../../components/admin/concert/TicketListComponent";
import AdminMenubar from "../../../components/menu/AdminMenubar";

const AdminListPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminMenubar />
      <TicketListComponent />
    </div>
  );
};

export default AdminListPage;
