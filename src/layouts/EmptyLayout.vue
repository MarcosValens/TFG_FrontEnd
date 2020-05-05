<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'EmptyLayout',

  data() {
    return {};
  },
  computed: {
    darkMode() {
      return this.$store.getters["global/darkMode"];
    }
  },
  created() {
    this.$q.dark.set(this.darkMode)
  }
}
</script>
