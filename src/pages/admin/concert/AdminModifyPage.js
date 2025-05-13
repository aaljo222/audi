import React from "react";
import TicketModifyComponent from "../../../components/admin/concert/TicketModifyComponent";
import AdminMenubar from "../../../components/menu/AdminMenubar";

const AdminModifyPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminMenubar />
      <TicketModifyComponent />
    </div>
  );
};

export default AdminModifyPage;
