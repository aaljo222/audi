import React from "react";
import ProductOrderComponent from "../../../components/admin/orders/ProductOrderComponent";
import AdminMenubar from "../../../components/menu/AdminMenubar";
const ProductOrderPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminMenubar />
      <ProductOrderComponent />
    </div>
  );
};

export default ProductOrderPage;
