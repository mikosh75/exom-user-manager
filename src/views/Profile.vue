<template>
  <v-container fluid>
    <Loading :value="dialog"></Loading>
    <v-layout>
      <template v-if="userInfo">
        <pre>
{{ JSON.stringify(userInfo, null, 4) }}
</pre>
      </template>
    </v-layout>
  </v-container>
</template>

<script>
import Loading from "@/components/Loading";

export default {
  name: "profile",
  components: {
    Loading
  },
  data: () => {
    return {
      dialog: true,
      apiCallFailed: false,
      userInfo: false
    };
  },
  watch: {},
  computed: {
    name() {
      return this.$route.name;
    }
  },
  mounted() {
    this.callGraphMe();
  },
  methods: {
    callGraphMe() {
      this.apiCallFailed = false;
      this.$AuthService.getGraphToken().then(
        token => {
          this.$AuthService.getGraphUserInfo(token).then(
            data => {
              this.userInfo = data;
              // setTimeout(() => (this.dialog = false), 500);
              this.dialog = false;
            },
            error => {
              console.error(error);
              this.apiCallFailed = true;
              this.dialog = false;
            }
          );
        },
        error => {
          console.error(error);
          this.apiCallFailed = true;
          this.dialog = false;
        }
      );
    }
  }
};
</script>

<style>
</style>
