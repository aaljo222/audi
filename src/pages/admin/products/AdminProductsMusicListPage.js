import React from "react";
import ProductsListComponent from "../../../components/admin/prouducts/ProductsListComponent";
import AdminMenubar from "../../../components/menu/AdminMenubar";

const AdminProductsMusicListPage = () => {
  return (
    <div>
      <div className="flex min-h-screen bg-gray-100">
        <AdminMenubar />
        <ProductsListComponent />
      </div>
    </div>
  );
};

export default AdminProductsMusicListPage;
