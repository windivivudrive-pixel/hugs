import { AdminPage } from "@/components/AdminPage";

export const metadata = {
  title: "Admin Dashboard | HUGs Agency",
  robots: { index: false, follow: false },
};

export default function AdminRoute() {
  return <AdminPage />;
}
