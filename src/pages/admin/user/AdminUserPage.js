import React from "react";
import AdminUserListComponent from "../../../components/admin/user/AdminUserListComponent";
import AdminMenubar from "../../../components/menu/AdminMenubar";

const AdminUserPage = () => {
  return (
    <div>
      <div className="flex min-h-screen bg-gray-100">
        <AdminMenubar />
        <AdminUserListComponent />
      </div>
    </div>
  );
};

export default AdminUserPage;
