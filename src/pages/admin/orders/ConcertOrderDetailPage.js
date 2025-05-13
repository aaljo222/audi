import React from "react";
import AdminMenubar from "../../../components/menu/AdminMenubar";
import ConcertOrderDetailComponent from "../../../components/admin/orders/ConcertOrderDetailComponent";

const ConcertOrderDetailPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminMenubar />
      <ConcertOrderDetailComponent />
    </div>
  );
};

export default ConcertOrderDetailPage;
