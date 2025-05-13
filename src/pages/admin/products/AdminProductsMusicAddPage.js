import React from "react";
import ProductsAddComponent from "../../../components/admin/prouducts/ProductsAddComponent";
import AdminMenubar from "../../../components/menu/AdminMenubar";

const AdminProductsMusicAddPage = () => {
  return (
    <div>
      <div className="flex min-h-screen bg-gray-100">
        <AdminMenubar />
        <ProductsAddComponent />
      </div>
    </div>
  );
};

export default AdminProductsMusicAddPage;
