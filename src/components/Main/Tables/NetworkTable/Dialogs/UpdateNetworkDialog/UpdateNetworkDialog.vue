<template>
  <q-card style="min-width: 350px">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">Network Update</div>

      <q-space />
      <q-btn id="close-popup" icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-card-section>
      <q-form @submit="sendUpdateNetwork($event)">
        <div class="row">
          <div class="col">
            <q-input
              standard
              stack-label
              type="text"
              :rules="[val => !val.length ? myMessage = 'Please input a valid network name' : val.length < 3 || val.length > 25 ? myMessage = 'Name must be between 3 and 25 characters long' : myMessage = null]"
              v-model="network.name"
              :error-message="myMessage"
              :error="myMessage !== null"
              label="Enter network name *"
            />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-input
              standard
              stack-label
              type="text"
              v-model="network.gateway"
              :rules="[isIp]"
              label="Enter gateway address"
            />
          </div>
          <div class="col q-mt-md q-ml-lg" v-if="electron">
            <q-btn label="Auto detect" @click="getGateway" color="primary" />
          </div>
        </div>

        <q-card-actions align="right" class="text-primary">
          <q-spinner v-if="fetching" class="q-mr-lg" size="2em"></q-spinner>
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Update network" type="submit" v-close-popup="canClose" />
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import isElectron from "is-electron";

import isIp from 'is-ip';
import privateIp from 'private-ip';

import { mapActions, mapGetters } from "vuex";
import globalRequestBuilder from "./../../../../../../utils/globalRequestBuilder";
import requests from "./../../../../../../utils/requests";
import getters from "./../../../../../../utils/getters";
export default {
  name: "CreateNetworkDialog",
  props: ["allNetworks", "networkId"],
  data() {
    return {
      canClose: false,
      network: {
        name: "",
        gateway: "",
        _id: ""
      },
      fetching: false,
      electron: isElectron(),
      gatewayErrorMessage: null,
      isNameTaken: "",
      myMessage: null
    };
  },
  async created() {
    const network = this.currentNetwork;
    this.network.name = network.name;
    this.network.gateway = network.gateway;
    this.network._id = network._id;
  },
  computed: {
    ...mapGetters("global", ["currentNetwork"])
  },
  methods: {
    ...mapActions("global", ["updateNetwork"]),
    isIp(val) {
      if (!val) return true;
      if (!isIp(val)) {
        return "Please enter a valid gateway Ex: 192.168.1.1"
      }
      if (!privateIp(val)) {
        return "That's not a private IP"
      }
      return true;
    },
    async getGateway() {
      this.fetching = true;
      const gateway = await requests.get.call(
        this,
        getters.scanner.local.gateway()
      );
      this.network.gateway = gateway;
      this.fetching = false;
    },
    async sendUpdateNetwork(ev) {
      const isChanged = this.isChanged();
      if (!isChanged) {
        this.canClose = true;
        return this.close();
      }
      try {
        this.fetching = true;
        const { endpoint, dataFromBuilder } = globalRequestBuilder(
          "network",
          "update",
          this.network
        );
        const { network } = await requests.post.call(
          this,
          endpoint,
          dataFromBuilder
        );
        this.updateNetwork(network);
        this.close();
      } catch (e) {
        const response = e.response;
        if (response.data.message) {
          this.myMessage = response.data.message;
        }
        if (response.data.errors) {
          this.gatewayErrorMessage =
            response.data.errors.find(({ param }) => param === "gateway").msg ||
            null;
        }
      } finally {
        this.fetching = false;
      }
    },
    close() {
      this.canClose = true;
      document.querySelector("#close-popup").click();
    },

    isChanged() {
      return !(
        this.currentNetwork.name === this.network.name &&
        this.currentNetwork.gateway === this.network.gateway
      );
    }
  }
};
</script>