import React from "react";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import { UserContextProvider } from "./UserContext";

const Home = () => {
  return (
    <UserContextProvider>
      <TopBar />
      <Dashboard />
    </UserContextProvider>
  );
};

export default Home;