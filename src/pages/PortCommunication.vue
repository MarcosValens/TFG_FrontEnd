<template>
  <div class="q-pa-lg">
    <div v-if="portErrors.length" class>
      <q-banner
        v-for="(error, index) in errors"
        :key="index"
        inline-actions
        class="text-white bg-red"
      >
        {{ error }}
        <template v-slot:action>
          <q-btn icon="close" flat round dense v-close-popup @click="portErrors.splice(index, 1)"/>
        </template>
      </q-banner>
    </div>
    <div class="row q-gutter-md q-mt-sm">
      <h3 class="q-mt-lg col-6">Looking at host {{ currentHost.ipAddress }}</h3>
      <h4>Payload</h4>
    </div>
    <div class="row q-gutter-md">
      <q-form class="q-gutter-md q-mt-sm col">

        <div class="row">
          <q-input filled v-model="port.port" readonly label="Port Number" class="col q-mr-md"/>
          <div class="col-2 flex justify-center items-center">
            <q-btn-dropdown color="primary" label="Ports" >
              <q-list>
                <q-item clickable v-close-popup @click="setPort(port)" v-for="port in currentHost.ports" :key="port._id">
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

        <q-toggle v-model="port.open" label="Open"/>
        <q-btn label="Check status" color="primary" @click="checkPortStatus" v-if="electron"></q-btn>
        <q-spinner v-if="checkingPortStatus" color="secondary" size="2em"/>

        <div>
          <q-btn label="Save" @click="sendPortUpdate(false)" color="primary"/>
          <q-btn
            label="Save and go home"
            @click="sendPortUpdate(true)"
            color="primary"
            class="q-ml-sm"
          />
          <q-btn label="Delete" @click="removePort()" color="red" class="q-ml-sm"/>
        </div>
      </q-form>
      <q-form class="q-gutter-md q-mt-sm col" v-if="electron">
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
        <q-input v-model="payload" filled type="textarea" label="Write your payload"/>
        <q-btn label="Send Payload" color="primary" @click="sendPayload"></q-btn>
        <q-spinner v-if="sending" color="primary" size="2em"></q-spinner>
      </q-form>
    </div>
    <div class="row">
      <div class="col">
        <h4>Response</h4>
        <q-input v-model="response" readonly filled type="textarea"/>
      </div>

    </div>


  </div>
</template>

<script>
  import isElectron from "is-electron";
  import {mapGetters, mapActions} from "vuex";

  import globalRequestBuilder from "./../utils/globalRequestBuilder";
  import requests from "./../utils/requests";
  import getters from "./../utils/getters";

  const scannerGetter = getters.scanner;

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
        port: {
          port: null,
          open: false,
          service: ""
        }
      };
    },
    computed: {
      ...mapGetters("global", ["currentNetwork", "currentHost", "currentPort"])
    },
    created() {
      if (!this.currentHost.ports || !this.currentHost.ports.length)
        return this.$router.push("/main");
      this.port = this.clonePort(this.currentHost.ports[0]);
      this.setCurrentPort(this.port);
    },
    methods: {
      ...mapActions("global", ["updatePort", "setCurrentPort", "deletePort"]),
      clonePort(port) {
        return JSON.parse(JSON.stringify(port));
      },
      setPort(port){
        this.setCurrentPort(port);
        this.port = this.clonePort(this.currentPort)
      },
      async sendPayload() {
        this.payloadErrors = [];
        try {
          this.sending = true;
          const endpoint = scannerGetter.port.payload();
          const data = {
            port: this.port.port,
            host: this.currentHost.ipAddress,
            payload: this.payload
          };
          const results = await requests.post.call(this, endpoint, data);

          // If the port was opened again, then set it back
          if (!this.port.open && results.open) {
            this.port.open = true;
            await this.sendPortUpdate();
          }
          // We only want to update if the port was open, no need to do it more than once
          if (results.closed || results.timeout) {
            if (this.port.open) {
              this.port.open = false;
              await this.sendPortUpdate();
            }
            return this.payloadErrors.push(
              `Port ${this.port.port} is closed or filtered`
            );
          }
          if (!results.response) {
            return (this.response = "The port didn't provide any answer");
          }
          this.response = results.response;
        } catch (e) {
          this.payloadErrors = e.response.data;
        } finally {
          this.sending = false;
        }
      },
      async removePort() {
        this.$q
          .dialog({
            title: "Confirm",
            message: "Are you sure you want to delete this port?",
            cancel: true,
            persistent: true
          })
          .onOk(async () => {
            this.deletePort(this.currentPort);
            const {endpoint, dataFromBuilder} = globalRequestBuilder.call(
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
            if (!this.currentHost.ports.length) {
              return this.$router.push("/main");
            }
            this.setCurrentPort(this.currentHost.ports[0]);
            this.port = this.clonePort(this.currentPort);
          });
      },
      async checkPortStatus() {
        this.checkingPortStatus = true;
        this.portErrors = [];
        try {
          const data = {
            port: this.port.port,
            host: this.currentHost.ipAddress
          };
          const endpoint = scannerGetter.port.availability();
          const open = await requests.post.call(this, endpoint, data);
          this.port.open = open;
        } catch (e) {
          this.errors.push("Host is not alive");
        } finally {
          this.checkingPortStatus = false;
        }
      },
      async sendPortUpdate(goMain = false) {
        try {
          if (!this.isChanged()) return ev.preventDefault();

          this.updatePort(this.port);
          const {endpoint, dataFromBuilder} = globalRequestBuilder.call(
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
        } catch (e) {
          ev.preventDefault();
        }
      },
      isValidService(service) {
        if (!service) return true;
        if (service.length > 255) {
          return "Service length cannot be of more than 255 characters";
        }
        return true;
      },
      isChanged() {
        return !(
          this.open === this.currentPort.open &&
          this.service === this.currentPort.service
        );
      }
    }
  };
</script>
