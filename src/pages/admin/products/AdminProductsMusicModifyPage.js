import React from "react";
import ProductsModifyComponent from "../../../components/admin/prouducts/ProductsModifyComponent";
import AdminMenubar from "../../../components/menu/AdminMenubar";

const AdminProductsMusicModifyPage = () => {
  return (
    <div>
      <div className="flex min-h-screen bg-gray-100">
        <AdminMenubar />
        <ProductsModifyComponent />
      </div>
    </div>
  );
};

export default AdminProductsMusicModifyPage;
