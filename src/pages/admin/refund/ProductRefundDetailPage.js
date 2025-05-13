import React from "react";
import AdminMenubar from "../../../components/menu/AdminMenubar";
import ProductDetailComponent from "../../../components/admin/refund/ProductDetailComponent";

const ProductRefundDetailPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminMenubar />
      <ProductDetailComponent />
    </div>
  );
};

export default ProductRefundDetailPage;
