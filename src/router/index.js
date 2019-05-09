import Vue from "vue";
import Router from "vue-router";

// Containers
const DefaultContainer = () => import("@/containers/DefaultContainer");

// Views
const Dashboard = () => import("@/views/Dashboard");
const Profile = () => import("@/views/Profile");

// Users
const UserAdd = () => import("@/views/users/UserAdd");

// Authentication
const AuthTest = () => import("@/views/auth/Test");

Vue.use(Router);

export default new Router({
  mode: "history", // https://router.vuejs.org/api/#mode
  linkActiveClass: "open active",
  scrollBehavior: () => ({
    y: 0
  }),
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
      name: "Home",
      component: DefaultContainer,
      children: [
        {
          path: "dashboard",
          name: "Dashboard",
          component: Dashboard
        },
        {
          path: "profile",
          meta: {
            label: "User profile"
          },
          name: "Profile",
          component: Profile
        },
        {
          path: "useradd",
          meta: {
            label: "Add user"
          },
          name: "Useradd",
          component: UserAdd
          /* component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [{
            path: '',
            name: 'Useradd',
            component: UserAdd,
          }] */
        }
      ]
    },
    {
      path: "/auth",
      redirect: "/auth/test",
      name: "Auth",
      component: {
        render(c) {
          return c("router-view");
        }
      },
      children: [
        {
          path: "test",
          name: "Test",
          component: AuthTest
        }
      ]
    }
  ]
});
