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
  created() {
    this.$q.dark.set(true)
  }
}
</script>
