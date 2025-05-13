import React from "react";
import AdminMenubar from "../../../components/menu/AdminMenubar";
import ProductListComponent from "../../../components/admin/refund/ProductListComponent";

const ProductRefundPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminMenubar />
      <ProductListComponent />
    </div>
  );
};

export default ProductRefundPage;
