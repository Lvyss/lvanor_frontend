import React from "react";
import UserNavbar from "./UserNavbars/UserNavbar";
import UserHome from "./UserHomes/UserHome";
import UserWebListBeforeLogin from "./UserWebList/UserWebListBeforeLogin";
import UserFooter from "./UserFooters/UserFooter";

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
