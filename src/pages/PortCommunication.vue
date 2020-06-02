<template>
  <div class="q-pa-lg">
    <q-breadcrumbs class="text-grey">
      <template v-slot:separator>
        <q-icon size="1.5em" name="chevron_right" color="primary" />
      </template>
      <q-breadcrumbs-el label="Home" icon="home" to="main" />
      <q-breadcrumbs-el label="Port Testing" icon="bug_report" />
    </q-breadcrumbs>
    <div class="row q-gutter-md q-mt-sm">
      <h3 class="q-mt-lg col-6">Looking at host {{ currentHost.ipAddress }}</h3>
      <h4 v-if="electron">Payload</h4>
    </div>
    <div class="row q-gutter-md">
      <q-form class="q-gutter-md q-mt-sm q-pr-md col bg-dark">
        <div v-if="portErrors.length" class>
          <q-banner
            v-for="(error, index) in portErrors"
            :key="index"
            inline-actions
            class="text-white bg-red"
          >
            <div style="font-size: 1.5rem;">{{ error }}</div>
            <template v-slot:action>
              <q-btn
                icon="close"
                flat
                round
                dense
                v-close-popup
                @click="portErrors.splice(index, 1)"
              />
            </template>
          </q-banner>
        </div>
        <div class="row">
          <q-input
            filled
            type="number"
            v-model="port.port"
            label="Port Number"
            class="col q-mr-md"
            :rules="[isValidPort]"
            @input="detectPort"
          />
          <div class="col-2 flex justify-center items-center">
            <q-btn-dropdown color="primary" label="Ports">
              <q-list>
                <q-item
                  clickable
                  v-close-popup
                  @click="setPort(port)"
                  v-for="port in currentHost.ports"
                  :key="port._id"
                >
                  <q-item-section>
                    <q-item-label>Port: {{port.port}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>

        <q-input
          filled
          dark
          type="text"
          v-model="port.service"
          label="Port Service"
          :rules="[isValidService]"
        />

        <div class="row">
          <q-toggle v-model="port.open" label="Open" />
          <q-btn
            class="q-ml-md"
            label="Check status"
            color="primary"
            @click="checkPortStatusAndInsertIfNewPort"
            v-if="electron"
          />
          <q-spinner v-if="checkingPortStatus" color="primary" size="2em" class="q-ml-md q-mt-xs" />
        </div>
        <div class="row" v-if="electron">
          <q-toggle :value="autoDetect" label="Auto-Detect" @input="changeAutoDetect"></q-toggle>
          <q-btn
            class="q-ml-md"
            label="Scan"
            color="primary"
            @click="scanPortAndInsertPortIfNewPort"
          />
          <q-spinner v-if="scanningPort" color="primary" size="2em" class="q-ml-md q-mt-xs" />
        </div>

        <div class="q-py-md">
          <q-btn label="Save" @click="sendPortUpdate(false)" color="primary" />
          <q-btn
            label="Save and go home"
            @click="sendPortUpdate(true)"
            color="primary"
            class="q-ml-sm"
          />
          <q-btn label="Delete" @click="removePort()" color="red" class="q-ml-sm" />
        </div>
      </q-form>
      <q-form class="q-gutter-md q-mt-sm q-pr-md col bg-dark" v-if="electron">
        <div v-if="payloadErrors.length" class>
          <q-banner
            v-for="(error, index) in payloadErrors"
            :key="index"
            inline-actions
            class="text-white bg-red"
          >
            {{ error }}
            <template v-slot:action>
              <q-btn
                icon="close"
                flat
                round
                dense
                v-close-popup
                @click="payloadErrors.splice(index, 1)"
              />
            </template>
          </q-banner>
        </div>
        <q-input v-model="payload" filled type="textarea" label="Write your payload" />
        <q-btn label="Send Payload" color="primary" @click="sendPayload"></q-btn>
        <q-spinner v-if="sending" color="primary" size="2em"></q-spinner>
      </q-form>
    </div>
    <div class="row" v-if="electron">
      <div class="col">
        <h4>Response</h4>
        <q-input class="bg-dark" v-model="response" type="textarea" readonly></q-input>
      </div>
    </div>
  </div>
</template>

<script>
import isElectron from "is-electron";
import methods from "./PortCommunicationMethods/methods";
import { mapGetters, mapActions } from "vuex";
import scanner from "./../components/Main/Tables/HostsTable/ScannerButtons/methods";
import globalRequestBuilder from "./../utils/globalRequestBuilder";
import requests from "./../utils/requests";
import getters from "./../utils/getters";

const scannerGetter = getters.scanner;
const { performPortScan, createPorts, updateHost } = scanner;
export default {
  name: "PortCommunication",
  data() {
    return {
      portErrors: [],
      payloadErrors: [],
      ports: [],
      payload: "",
      response: "",
      electron: !isElectron(),
      sending: false,
      checkingPortStatus: false,
      scanningPort: false,
      port: {
        port: null,
        open: false,
        service: ""
      }
    };
  },
  computed: {
    ...mapGetters("global", [
      "currentNetwork",
      "currentHost",
      "currentPort",
      "autoDetect",
      "hosts"
    ])
  },
  created() {
    if (!this.currentHost.ipAddress) return this.$router.push("/main");
    this.getHostPortsSorted();
    this.port = this.clone(this.currentHost.ports[0] || this.port);
    this.setCurrentPort(this.clone(this.port));
  },
  methods: {
    ...mapActions("global", [
      "updatePort",
      "setCurrentPort",
      "setHost",
      "deletePort",
      "getHostPortsSorted",
      "changeAutoDetect",
      "killHost",
      "reviveHost"
    ]),
    performPortScan,
    createPorts,
    updateHost,
    ...methods,
    async scanPortAndInsertPortIfNewPort() {
      const result = await this.checkPortStatusAndInsertIfNewPort(true);
      if (!result) {
        this.scanningPort = false;
        return false;
      }
      try {
        const results = await this.performPortScan(
          this.currentHost.ipAddress,
          this.port.port.toString(),
          this.autoDetect
        );
        const [data] = results;
        // Just checking that we got something, we don't want unexpected errors
        if (!data) return;
        const isNewPort = !this.findPort(this.currentHost);

        if (!isNewPort) {
          await this.insertNewPortAndUpdatePortList(data);
        }
        const { service, open } = data;
        if (!this.port.service) {
          this.port.service = service;
        }
        this.port.open = open;
        await this.sendUpdate(false);
      } catch (e) {
        this.portErrors.push(e.message);
      } finally {
        this.scanningPort = false;
      }
    },
    async sendPayload() {
      if (!this.initPayload()) {
        return;
      }
      try {
        this.sending = true;
        const endpoint = scannerGetter.port.payload();
        const data = {
          port: this.port.port,
          host: this.currentHost.ipAddress,
          payload: this.payload
        };
        const results = await requests.post.call(this, endpoint, data);
        if (!this.currentHost.alive) {
          await this.sendReviveHost(this.currentHost);
        }
        // If the port was opened again, then set it back
        if (!this.port.open && results.open) {
          this.port.open = true;
          await this.sendUpdate(false);
        }
        // We only want to update if the port was open, no need to do it more than once
        if (results.closed) {
          if (this.port.open) {
            this.port.open = false;
            await this.sendUpdate(false);
          }
          return this.payloadErrors.push(
            `Port ${this.port.port} is closed or filtered`
          );
        }
        if (results.timeout) {
          return this.payloadErrors.push(
            `Port ${this.port.port} Timed out the request`
          );
        }
        if (!results.response) {
          return (this.response = "The port didn't provide any answer");
        }
        this.response = results.response;
      } catch (e) {
        if (e.response.data.includes("Host not alive")) {
          await this.sendKillHost(this.currentHost);
        }
        this.payloadErrors = e.response.data;
      } finally {
        this.sending = false;
      }
    },
    async removePort() {
      if (!this.initPort(true)) {
        return;
      }
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure you want to delete this port?",
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          const { endpoint, dataFromBuilder } = globalRequestBuilder.call(
            this,
            "port",
            "delete",
            {
              network: this.currentNetwork,
              host: this.currentHost,
              port: this.port
            }
          );

          await requests.post.call(this, endpoint, dataFromBuilder);
          await this.deletePort(this.currentPort);

          const port = this.clone(this.currentHost.ports[0]);
          if (!port.port) {
            this.port.port = null;
            this.port.service = "";
            return;
          }

          this.setCurrentPort(port);
          this.getHostPortsSorted();
          this.port = this.clone(this.currentPort);
        });
    },
    async checkPortStatusAndInsertIfNewPort(isScanning = false) {
      if (!this.initPort()) return false;
      try {
        this.checkingPortStatus = true && !isScanning;
        this.scanningPort = isScanning
        const data = {
          port: this.port.port,
          host: this.currentHost.ipAddress
        };
        const endpoint = scannerGetter.port.availability();
        const scannerData = await requests.post.call(this, endpoint, data);
        if (!this.currentHost.alive) {
          await this.sendReviveHost(this.currentHost);
        }
        const hostPort = this.findPort(this.currentHost);
        if (!hostPort && scannerData.open) {
          await this.insertNewPortAndUpdatePortList(scannerData);
        }
        this.port.open = scannerData.open;
        return scannerData.open;
      } catch (e) {
        this.portErrors.push("Host is not alive");
        await this.sendKillHost(this.currentHost);
        return false;
      } finally {
        this.checkingPortStatus = false;
      }
    },
    async sendUpdate(goMain) {
      if (!this.isChanged()) return;
      this.updatePort(this.port);
      const { endpoint, dataFromBuilder } = globalRequestBuilder.call(
        this,
        "port",
        "update",
        {
          network: this.currentNetwork,
          host: this.currentHost,
          port: this.port
        }
      );
      await requests.post.call(this, endpoint, dataFromBuilder);
      if (goMain) {
        this.$router.push("/main");
      }
    },
    async sendPortUpdate(goMain = false) {
      try {
        await this.sendUpdate(goMain);
      } catch (e) {
        ev.preventDefault();
      }
    }
  }
};
</script>
