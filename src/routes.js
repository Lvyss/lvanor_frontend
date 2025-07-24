// src/routes.js

const routes = {
  // ✅ Public
  home: "/",
  login: "/login",
  register: "/register",
  exploreWeblist: (id = ":id") => `/explore/weblist/${id}`,

  // ✅ Admin
  admin: "/admin",
  adminUsers: "/admin/users",
  adminCategory: "/admin/category",
  adminWeblist: "/admin/weblist",
  adminWeblistDetailEdit: (id = ":id") => `/admin/weblist/${id}/detail`,
  adminProfile: "/admin/profile",

  // ✅ User
  user: "/user",
  userHome: "/user#Home",
  userProfile: "/user/profile",
  userWeblist: "/user/weblist",
userWeblistEditDetail: (id = ":id") => `/user/weblist/${id}/edit`,
  userWeblistDetailAll: (id = ":id") => `/user/weblist/${id}/detail`,

};

export default routes;
