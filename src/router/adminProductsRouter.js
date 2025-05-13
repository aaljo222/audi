import React, { lazy, Suspense } from "react";
import ProtectedRoute from "./ProtectedRoute"; // 추가된 부분

const Loading = (
  <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
    <svg
      className="text-gray-300 animate-spin"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
    >
      <path
       d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
    <p>Loading...</p>
  </div>
);

const MusicAddPage = lazy(() =>
  import("../pages/admin/products/AdminProductsMusicAddPage")
);
const MusicModifyPage = lazy(() =>
  import("../pages/admin/products/AdminProductsMusicModifyPage")
);
const MusicListPage = lazy(() =>
  import("../pages/admin/products/AdminProductsMusicListPage")
);
const ProductOrderPage = lazy(() =>
  import("../pages/admin/orders/ProductOrderPage")
);
const ProductOrderDetailPage = lazy(() =>
  import("../pages/admin/orders/ProductOrderDetailPage")
);
const ProductReviewPage = lazy(() =>
  import("../pages/admin/products/AdminReviewListPage")
);

const adminProductsRouter = () => {
  return [
    {
      path: "add",
      element: (
        <ProtectedRoute>
          <Suspense fallback={Loading}>
            <MusicAddPage />
          </Suspense>
        </ProtectedRoute>
      ),
    },
    {
      path: "modify/:pno",
      element: (
        <ProtectedRoute>
          <Suspense fallback={Loading}>
            <MusicModifyPage />
          </Suspense>
        </ProtectedRoute>
      ),
    },
    {
      path: "list",
      element: (
        <ProtectedRoute>
          <Suspense fallback={Loading}>
            <MusicListPage />
          </Suspense>
        </ProtectedRoute>
      ),
    },
    {
      path: "order/list",
      element: (
        <ProtectedRoute>
          <Suspense fallback={Loading}>
            <ProductOrderPage />
          </Suspense>
        </ProtectedRoute>
      ),
    },
    {
      path: "order/detail/:orderNum",
      element: (
        <ProtectedRoute>
          <Suspense fallback={Loading}>
            <ProductOrderDetailPage />
          </Suspense>
        </ProtectedRoute>
      ),
    },
    {
      path: "reviews/:pno",
      element: (
        <ProtectedRoute>
          <Suspense fallback={Loading}>
            <ProductReviewPage />
          </Suspense>
        </ProtectedRoute>
      ),
    },
  ];
};

export default adminProductsRouter;