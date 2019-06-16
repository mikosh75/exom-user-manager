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

// Authentication
const CheckTest = () => import("@/views/test/Check");

Vue.use(Router);

export default new Router({
  mode: "history", // https://router.vuejs.org/api/#mode
  linkActiveClass: "open active",
  scrollBehavior: () => ({
    y: 0
  }),
  routes: [{
      path: "/exom-user-manager",
      redirect: {
        name: "Dashboard"
      },
      name: "Home",
      component: DefaultContainer,
      children: [{
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
        },
        {
          path: "test",
          meta: {
            label: "Test"
          },
          name: "Test",
          component: CheckTest
        },
      ]
    },
    {
      path: "/exom-user-manager/auth",
      redirect: {
        name: "AuthTest"
      },
      name: "Auth",
      component: {
        render(c) {
          return c("router-view");
        }
      },
      children: [{
        path: "test",
        name: "AuthTest",
        component: AuthTest
      }]
    }
    /*     {
          path: "/exom-user-manager/test",
          redirect: { name: "CheckTest" },
          name: "Test",
          component: {
            render(c) {
              return c("router-view");
            }
          },
          children: [
            {
              path: "check",
              name: "CheckTest",
              component: CheckTest
            }
          ]
        } */
  ]
});