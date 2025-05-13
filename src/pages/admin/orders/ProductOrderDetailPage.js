import React from "react";
import ProductOrderDetailComponent from "../../../components/admin/orders/ProductOrderDetailComponent";
import AdminMenubar from "../../../components/menu/AdminMenubar";

const ProductOrderDetailPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminMenubar />
      <ProductOrderDetailComponent />
    </div>
  );
};

export default ProductOrderDetailPage;
