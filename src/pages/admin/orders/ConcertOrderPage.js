import React from "react";
import AdminMenubar from "../../../components/menu/AdminMenubar";
import ConcertOrderComponent from "../../../components/admin/orders/ConcertOrderComponent";

const ConcertOrderPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminMenubar />
      <ConcertOrderComponent />
    </div>
  );
};

export default ConcertOrderPage;
