import React from "react";
import AdminMenubar from "../../../components/menu/AdminMenubar";
import ProductsReviewsComponent from "../../../components/admin/prouducts/ProductsReviewsComponent";

const AdminReviewListPage = () => {
  return (
    <div>
      <div className="flex min-h-screen bg-gray-100">
        <AdminMenubar />
        <ProductsReviewsComponent />
      </div>
    </div>
  );
};

export default AdminReviewListPage;
