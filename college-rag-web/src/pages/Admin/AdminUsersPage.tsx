import type { FC } from "react";
import { AdminLayout } from "../../components/Layout/AdminLayout";

export const AdminUsersPage: FC = () => {
  return (
    <AdminLayout>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="w-24 h-24 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Управление пользователями
          </h2>
          <p className="text-gray-600 max-w-md">
            Эта страница находится в разработке. Здесь будет возможность управлять пользователями системы.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};
