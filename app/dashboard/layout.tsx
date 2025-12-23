import { getUser } from "@/lib/auth";
import { UserProvider } from "@/app/contexts/UserContext";
import DashboardClient from "./DashboardClient";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  return (
    <UserProvider user={user}>
      <DashboardClient>{children}</DashboardClient>
    </UserProvider>
  );
}
