import React from "react";
import TicketAddComponent from "../../../components/admin/concert/TicketAddComponent";
import AdminMenubar from "../../../components/menu/AdminMenubar";


const AdminAddPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminMenubar />
      <TicketAddComponent />
    </div>
  );
};

export default AdminAddPage;
