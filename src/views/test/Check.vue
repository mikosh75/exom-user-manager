<template>
  <v-container fluid>
    <template v-if="wtf">
      <v-alert v-if="wtf.answer == 'no'" :value="true" type="error">{{ wtf.answer }}</v-alert>
      <template v-if="wtf.answer == 'yes'">
        <v-alert :value="true" type="success">{{ wtf.answer }}</v-alert>
        <v-btn @click="foo()">foo</v-btn>
        <v-btn @click="bar()">bar</v-btn>
        <v-btn @click="baz()">baz</v-btn>
      </template>
    </template>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      wtf: false
    };
  },
  methods: {
    foo() {
      this.$isAuthenticated.foo();
    },
    bar() {
      this.$isAuthenticated.bar();
    },
    baz() {
      this.$isAuthenticated.baz();
    },
    check() {
      this.$isAuthenticated.check().then(data => {
        this.wtf = data;
      });
    }
  },
  mounted() {
    this.check();
  }
};
</script>

<style>
</style>
