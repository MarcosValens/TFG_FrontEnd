<template>
  <div class="q-gutter-md scannerButtons">
    <div class="col row justify-between q-gutter-xs">
      <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2">
        <template>
          <q-btn
            class="text-white bg-primary"
            size="1.2rem"
            icon="router"
            label="Ping Sweep"
            type="a"
            rounded
            @click="doSweep()"
            style="width: 100%"
            :disabled="currentNetwork.locked || currentHost.locked"
          >
            <q-tooltip content-style="font-size: 16px" :delay="900" @show="sendShow">
              Perform a ping sweep of your network. By ping sweep we mean,
              ping every host in your network by your CIDR and get the ones that reply back.
            </q-tooltip>
          </q-btn>
        </template>
      </div>
      <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2">
        <template>
          <q-btn
            class="text-white bg-primary"
            size="1.2rem"
            icon="search"
            label="Scan Network"
            rounded
            type="a"
            @click="doPerformBasicScan()"
            style="width: 100%"
            :disabled="currentNetwork.locked || currentHost.locked"

          >
            <q-tooltip
              content-style="font-size: 16px" :delay="900"
            >This performs a full scan (ping sweep + port scanner)</q-tooltip>
          </q-btn>
        </template>
      </div>
      <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2">
        <template>
          <q-btn
            class="text-white bg-primary"
            size="1.2rem"
            icon="policy"
            type="a"
            label="Custom Scan"
            rounded
            @click="openCustomScanDialog()"
            style="width: 100%"
            :disabled="currentNetwork.locked || currentHost.locked"
          >
            <q-tooltip
              content-style="font-size: 16px" :delay="900"
            >You can specify a port, ports or range of ports and scan the whole network.</q-tooltip>
          </q-btn>
          <q-dialog v-model="shouldOpenCustomScan" persistent>
            <custom-scan-dialog />
          </q-dialog>
        </template>
      </div>
      <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2">
        <template>
          <q-btn
            class="text-white bg-primary"
            size="1.2rem"
            icon="compare_arrows"
            type="a"
            label="Ping a Host"
            rounded
            @click="openPingHostDialog()"
            style="width: 100%"
            :disabled="currentNetwork.locked || currentHost.locked"
          >
            <q-tooltip
              content-style="font-size: 16px" :delay="900"
            >Introduce an IP and check if the host is alive</q-tooltip>
          </q-btn>
          <q-dialog v-model="shouldOpenPingHostDialog" persistent>
            <ping-host-dialog />
          </q-dialog>
        </template>
      </div>
    </div>
    <div class="col row items-center justify-center" v-if="currentType !== null">
      <div class="text-center" style="font-size: 1.2em">
        <p>{{ persistentMessage }}</p>
        <p>{{ progressMessage }}</p>
        <q-spinner color="primary" size="2em" v-if="currentType.performing"></q-spinner>
        <q-icon
          size="2em"
          :name="currentType.hadError ? 'error' : 'done'"
          :color="currentType.hadError ? 'red' : 'green'"
          v-if="currentType.started && !currentType.performing"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import CustomScanDialog from "./../Dialogs/CustomScanDialog/CustomScanDialog";
import PingHostDialog from "./../Dialogs/PingHostDialog/PingHostDialog";

import methods from "./methods";

export default {
  name: "ScannerButtons",
  components: {
    "custom-scan-dialog": CustomScanDialog,
    "ping-host-dialog": PingHostDialog
  },
  data() {
    return {
      shouldOpenPingHostDialog: false,
      shouldOpenCustomScan: false,
      progressMessage: "",
      persistentMessage: "",
      sweepType: {
        started: false,
        performing: false,
        hadError: false
      },
      scanType: {
        started: false,
        performing: false,
        hadError: false
      },
      customScanType: {
        started: false,
        performing: false,
        hadError: false
      },
      pingHostType: {
        started: false,
        performing: false,
        hadError: false
      },
      currentType: null
    };
  },
  mounted() {
    this.$root.$on("ports", async ports => {
      await this.doFullScanWithPorts(ports);
    });

    this.$root.$on("ip", ip => {
      this.doPing(ip);
    });
  },
  computed: {
    ...mapGetters("global", [
      "currentNetwork",
      "currentHost",
      "hosts",
      "autoDetect"
    ])
  },
  methods: {
    ...mapActions("global", [
      "setHostsFromSweep",
      "setHosts",
      "killHost",
      "reviveHost",
      "lockNetwork",
      "unlockNetwork"
    ]),
    ...methods,
    sendShow(ev) {
      console.log(ev)
    },
    addHosts(hosts) {
      this.setHostsFromSweep(hosts);
    },
    initType(type) {
      this.lockNetwork();
      this.progressMessage = "";
      this.persistentMessage = "";
      this.currentType = type;
      this.currentType.hadError = false;
      this.currentType.started = true;
      this.currentType.performing = true;
    },

    finishAction() {
      this.currentType.performing = false;
      this.persistentMessage = "";
      this.unlockNetwork();

      this.timeout = setTimeout(_ => {
        this.progressMessage = "";
        this.currentType.hadError = false;

        this.currentType = null;
      }, 5000);
    },

    async doFullScanWithPorts(ports) {
      this._scanCall(this.customScanType, ports);
    },

    openPingHostDialog() {
      if (this.currentType && this.currentType.performing) return;
      window.clearTimeout(this.timeout);
      this.shouldOpenPingHostDialog = true;
    },

    openCustomScanDialog() {
      if (this.currentType && this.currentType.performing) return;
      window.clearTimeout(this.timeout);
      this.shouldOpenCustomScan = true;
    },

    async doPing(ip) {
      if (this.currentType && this.currentType.performing) return;
      window.clearTimeout(this.timeout);
      this.initType(this.pingHostType);
      try {
        const hosts = await this.ping(ip);
        if (hosts && hosts.length) {
          this.addHosts(hosts);
        }
      } catch (e) {
        this.currentType.hadError = true;
        this.progressMessage = e.message;
      } finally {
        this.finishAction();
      }
    },

    async doSweep() {
      if (this.currentType && this.currentType.performing) return;
      window.clearTimeout(this.timeout);

      this.initType(this.sweepType);
      try {
        const hosts = await this.sweep();
        if (hosts && !hosts.canAdd) {
          this.setHosts(hosts.hosts);
        }
      } catch (e) {
        this.currentType.hadError = true;
        this.progressMessage = e.message;
      } finally {
        this.finishAction();
      }
    },
    async doPerformBasicScan() {
      this._scanCall(this.scanType, null);
    },

    async _scanCall(type, ports) {
      if (this.currentType && this.currentType.performing) return;
      window.clearTimeout(this.timeout);

      this.initType(type);
      try {
        const hosts = await this.performFullScan(ports, this.autoDetect);
        this.setHosts(hosts);
      } catch (e) {
        this.currentType.hadError = true;
        this.progressMessage = e.message;
      } finally {
        this.finishAction();
      }
    }
  },
  beforeDestroy() {
    this.$root.$off("ip");
    this.$root.$off("ports");
  }
};
</script>

<style scoped>
.scannerButtons {
  height: 250px;
}
</style>
