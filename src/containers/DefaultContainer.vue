<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" fixed app>
      <v-list dense>
        <v-list-tile :to="{ name: 'Home' }" @click>
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="{ name: 'Useradd' }" @click>
          <v-list-tile-action>
            <v-icon>person_add</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Add user</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="primary" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>User Manager</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-and-down">
        <template v-if="!user">
          <v-btn flat @click="login">login</v-btn>
        </template>
        <template v-if="user">
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn flat v-on="on" @click>{{ user.name }}</v-btn>
            </template>
            <v-list>
              <v-list-tile @click to="profile">
                <v-list-tile-title>Profile</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click>
                <v-list-tile-title>Settings</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="logout">
                <v-list-tile-title>Logout</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </template>
        <!-- <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn flat v-on="on">login</v-btn>
          </template>
          <v-list>
            <v-list-tile @click>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>-->
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-footer color="primary" app class="pa-3">
      <v-spacer></v-spacer>
      <div class="white--text">&copy; Exom Group {{ new Date().getFullYear() }}</div>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "DefaultContainer",
  data: () => {
    return {
      user: null,
      drawer: null
    };
  },
  computed: {
    name() {
      return this.$route.name;
    },
    list() {
      return this.$route.matched.filter(
        route => route.name || route.meta.label
      );
    }
  },
  mounted() {
    this.setUser();
  },
  methods: {
    logout() {
      this.user = null;
      this.$AuthService.logout();
    },
    login() {
      // this.$AuthService.loginPopup() //with a popup
      this.$AuthService.loginRedirect(); //with a redirect
    },
    setUser() {
      this.user = this.$AuthService.getUser();
    }
  }
};
</script>
