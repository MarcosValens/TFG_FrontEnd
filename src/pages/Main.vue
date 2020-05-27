<template>
  <div class="row">
    <network-table class="col-lg-3 col-xs-12 col-sm-12" />
    <host-table v-if="currentNetwork" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import client from "socket.io-client";

import NetworkTable from "../components/Main/Tables/NetworkTable/NetworkTable.vue";
import HostsTable from "../components/Main/Tables/HostsTable/HostsTable.vue";

export default {
  components: { "network-table": NetworkTable, "host-table": HostsTable },
  computed: {
    ...mapGetters("global", ["currentNetwork"])
  }
};
</script>


