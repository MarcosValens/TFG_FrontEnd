import getters from './../utils/getters';
const userGetter = getters.user;
const routes = [
  {
    path: "/login",
    component: () => import("layouts/EmptyLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Login.vue")
      }
    ]
  },
  {
    path: "/installers",
    component: () => import("layouts/EmptyLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Installers.vue")
      }
    ]
  },
  {
    path: "/main",
    component: () => import("layouts/MainLayout"),
    children: [
      {
        path: "",
        component: () => import("pages/Main"),
        async beforeEnter(to, from, next) {
          const token = to.query.token || from.query.token || localStorage.getItem("token");
          try {
            const response = await fetch(userGetter.check(), {
              headers: {
                "Authorization": "Bearer " + token
              }
            });
  
            if (response.status === 401) {
              return next("/login")
            }
            localStorage.setItem("token", token)
            next();
          } catch(e) {
            next("/login")
          }
        }
      }
    ]
  },
  {
    path: "/userProfile",
    component: () => import("layouts/MainLayout"),
    children: [
      {
        path: "",
        component: () => import("pages/UserProfile")
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
