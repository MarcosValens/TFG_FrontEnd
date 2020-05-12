<template>
  <q-layout view="lHh Lpr lFf">
    <div v-if="electron">
      <updater />
    </div>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import isElectron from 'is-electron';
import Updater from 'components/Updater';

export default {
  name: 'EmptyLayout',
  components: {
    "updater": Updater
  },
  data() {
    return {
      electron: isElectron()
    };
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
