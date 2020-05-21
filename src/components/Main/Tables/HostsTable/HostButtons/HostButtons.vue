<template>
  <div class="col q-gutter-lg">
    <q-avatar
      icon="compare_arrows"
      style="font-size: 1.8rem; cursor:pointer;"
      text-color="white"
      color="primary"
      clickable
      @click="doPing()"
    >
      <q-tooltip content-style="font-size: 16px">Send ping request to a host</q-tooltip>
    </q-avatar>
    <q-avatar
      icon="search"
      style="font-size: 1.8rem; cursor:pointer;"
      text-color="white"
      color="primary"
      clickable
      @click="performScan()"
    >
      <q-tooltip content-style="font-size: 16px">Scan this host with the default ports</q-tooltip>
    </q-avatar>
    <q-avatar
      icon="policy"
      style="font-size: 1.8rem; cursor:pointer;"
      text-color="white"
      color="primary"
      clickable
      @click="openCustomHostScanDialog()"
    >
      <q-tooltip content-style="font-size: 16px">Perform a custom port scan with ports or port range</q-tooltip>
    </q-avatar>
    <q-spinner color="primary" size="2em" class="q-ml-lg" v-if="performing"></q-spinner>
    <q-icon
      size="2em"
      class="q-ml-lg"
      :name="hadError ? 'error' : 'done'"
      :color="hadError ? 'red' : 'green'"
      v-if="started && !performing"
    />

    <q-dialog v-model="customScanHostDialog">
      <custom-host-scan-dialog
        :network="currentNetwork"
        :currentHosts="hosts"
        :currentHost="currentHost"
      />
    </q-dialog>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from "vuex";
  import CustomHostScanDialog from "./../Dialogs/CustomHostScanDialog/CustomHostScanDialog";
  import scannerMethods from "./../ScannerButtons/methods";

  export default {
    name: "HostButtons",
    components: {"custom-host-scan-dialog": CustomHostScanDialog},
    data() {
      return {
        customScanHostDialog: false,
        performing: false,
        started: false,
        hadError: false
      };
    },
    // I dont understand why or how this could happend, i need to off it on beforeCreate and beforeDestroy WTF?
    beforeCreate() {
      this.$root.$off("portSingleHost")
    },
    created() {
      this.$root.$on("portSingleHost", async ports => {
        await this.scanHost(ports);
      });
    },
    computed: {
      ...mapGetters("global", [
        "hosts",
        "currentNetwork",
        "currentHost",
        "currentPort"
      ])
    },
    methods: {
      ...mapActions("global", [
        "killHost",
        "reviveHost",
        "lockNetwork",
        "unlockNetwork",
        "lockHost",
        "unlockHost",
        "setHost"
      ]),
      ...scannerMethods,

      openCustomHostScanDialog() {
        if (this.performing) return;
        window.clearTimeout(this.timeout);
        this.customScanHostDialog = true;
      },

      init() {
        this.lockHost();
        this.performing = true;
        this.started = true;
      },
      closeWithError() {
        this.hadError = true;
        this.performing = false;
      },

      delayClose() {
        this.unlockHost();
        this.performing = false;

        this.timeout = setTimeout(_ => {
          this.started = false;
          this.hadError = false;
        }, 5000);
      },

      async doPing() {
        try {
          if (this.performing) return;
          window.clearTimeout(this.timeout);
          this.init();
          await this.ping(this.currentHost.ipAddress);
        } catch (e) {
          this.closeWithError();
        } finally {
          await this.updateHost(this.currentHost);
          this.delayClose();
        }
      },
      async scan(host, ports) {
        try {
          if (this.performing) return;
          window.clearTimeout(this.timeout);
          this.init();
          const host = await this.performSimpleScan(this.currentHost, ports);
          this.setHost(host);
          this.performing = false;
        } catch (e) {
          this.closeWithError();
        } finally {
          this.delayClose();
        }
      },
      async performScan() {
        await this.scan(this.currentHost);
      },
      async scanHost(ports) {
        await this.scan(this.currentHost, ports);
      }
    },
    beforeDestroy() {
      this.$root.$off("portSinglehost");
    }
  };
</script>

<style scoped>
  .divSpinner {
    display: inline;
    width: 20vw;
  }
</style>
