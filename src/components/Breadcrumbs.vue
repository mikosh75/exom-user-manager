<template>
  <div>
    <v-breadcrumbs :items="items" divider=">"></v-breadcrumbs>
  </div>
</template>

<script>
export default {
  name: "Breadcrumbs",
  data: function() {
    return {};
  },
  props: {
    value: { type: Boolean, default: false },
    message: { type: String, default: "Please wait..." },
    progressColor: { type: String, default: "amber" }
  }
};
</script>

<style>
</style>