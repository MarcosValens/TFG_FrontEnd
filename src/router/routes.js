import getters from './../utils/getters';
const userGetter = getters.user;

async function beforeEnter(to, from, next) {
  const token = to.query.token || from.query.token || localStorage.getItem("token");
  const refreshToken = to.query.refresh_token || from.query.refresh_token || localStorage.getItem("refresh-token") 
  try {
    const response = await fetch(userGetter.check(), {
      headers: {
        "Authorization": "Bearer " + token,
        "X-Refresh-Token": refreshToken
      }
    });

    if (response.status === 401) {
      return next("/login")
    }
    localStorage.setItem("token", token)
    localStorage.setItem("refresh-token", refreshToken)
    next();
  } catch(e) {
    next("/login")
  }
}

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
    beforeEnter,
    children: [
      {
        path: "",
        component: () => import("pages/Main")
      },
      {
        path: "port-form",
        component: () => import("pages/PortCommunication")
      },
      {
        path: "chat",
        component: () => import("pages/ChatApp")
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
