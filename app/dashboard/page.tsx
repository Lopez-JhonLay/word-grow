"use client";

import { logout } from "../auth/actions";

function Dashboard() {
  return (
    <div>
      <p>Dashboard</p>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

export default Dashboard;
