import React from "react";
import UserNavbar from "./UserNavbars";
import UserHome from "./UserHomes";
import UserWebListBeforeLogin from "./UserWebList/UserWebListBeforeLogin";
import UserFooter from "./UserFooters";

const StartPage = () => {
  return (
    <div>
      <UserNavbar />
      <UserHome />
      <UserWebListBeforeLogin />
      <UserFooter />
    </div>
  );
};

export default StartPage;
