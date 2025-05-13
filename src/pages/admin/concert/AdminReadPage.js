import React from "react";
import TicketReadComponent from "../../../components/admin/concert/TicketReadComponent";
import AdminMenubar from "../../../components/menu/AdminMenubar";

const AdminReadPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminMenubar />
      <TicketReadComponent />
    </div>
  );
};

export default AdminReadPage;
