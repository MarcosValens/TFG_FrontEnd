<template>
  <div>
    <q-dialog v-model="createNetworkDialog" persistent>
      <create-network-dialog />
    </q-dialog>
    <div v-if="networks.length" class="col-lg-3 col-sm-12">
      <q-table
        dark
        color="ambar"
        :data="networks"
        :columns="networkColumns"
        :visible-columns="visibleNetworkColumns"
        :filter="filter"
        row-key="index"
        binary-state-sort
        virtual-scroll
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
        :virtual-scroll-sticky-size-start="48"
      >
        <template v-slot:body="props">
          <q-tr :props="props" @click="loadNetwork(props)">
            <q-td key="networkName" :props="props">{{ props.row.name }}</q-td>
            <q-td
              key="gateway"
              :props="props"
              @click.stop="loadNetwork(props)"
            >{{ props.row.gateway }}</q-td>
            <q-td key="icon">
              <div class="row text-center" v-if="isSelectedNetwork(props)">
                <div class="col">
                  <q-chip
                    icon="save"
                    text-color="white"
                    color="primary"
                    clickable
                    @click="sendOpenUpdateNetworkDialog()"
                    :disable="currentNetwork.locked || currentHost.locked"
                  >Update</q-chip>
                  <q-dialog v-model="openNetworkUpdateDialog" persistent>
                    <update-network-dialog :allNetworks="networks" :networkId="currentNetwork._id" />
                  </q-dialog>

                  <q-chip
                    icon="delete"
                    text-color="white"
                    color="negative"
                    clickable
                    @click="confirmDeleteNetworkDialog(props)"
                    :disable="currentNetwork.locked || currentHost.locked"

                  >Delete</q-chip>
                </div>
              </div>
            </q-td>
          </q-tr>
        </template>

        <template v-slot:top-left>
          <q-btn
            class="bg-primary text-white"
            rounded
            icon="add_circle"
            label="Create Network"
            size="1rem"
            @click="sendOpenCreateNetworkDialog()"
            :disabled="currentNetwork.locked || currentHost.locked"

          ></q-btn>
        </template>

        <template v-slot:top-right>
          <div class="flex">
            <div class="justify-center">
              <q-input
                borderless
                dense
                debounce="300"
                v-model="filter"
                placeholder="Search Network"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </template>
      </q-table>
    </div>
    <div class="text-center" v-else>
      <h4>There are no networks...</h4>
      <q-btn
        icon="add_circle"
        class="bg-primary text-white"
        rounded
        size="1.5rem"
        @click="createNetworkDialog = true"
      >Create one</q-btn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import isElectron from "is-electron";

import CreateNetworkDialog from "./Dialogs/CreateNetworkDialog/CreateNetworkDialog.vue";
import UpdateNetworkDialog from "./Dialogs/UpdateNetworkDialog/UpdateNetworkDialog.vue";

import globalRequestBuilder from "./../../../../utils/globalRequestBuilder.js";
import requests from "./../../../../utils/requests.js";
import getters from "./../../../../utils/getters.js";

const networkGetter = getters.network;

export default {
  name: "NetworkTable",
  components: {
    "create-network-dialog": CreateNetworkDialog,
    "update-network-dialog": UpdateNetworkDialog
  },
  data() {
    return {
      networkColumns: [
        {
          name: "networkName",
          required: true,
          label: "Network",
          align: "left",
          field: row => row.name,
          format: val => `${val}`,
          sortable: true,
          style: "width: 5vh"
        },
        {
          name: "gateway",
          label: "Gateway",
          field: row => row.name,
          format: val => `${val}`,
          sortable: true,
          style: "width: 5vh"
        },
        {
          name: "icon",
          style: "width: 5vh"
        }
      ],
      visibleNetworkColumns: ["networkName", "gateway", "icon"],
      updateNetworkPopUp: false,
      electron: !isElectron(),
      model: null,
      createNetworkDialog: false,
      openNetworkUpdateDialog: false,
      filter: "",
      pagination: {
        rowsPerPage: 5
      }
    };
  },
  computed: {
    ...mapGetters("global", ["networks", "currentNetwork", "autoDetect", "currentHost"])
  },
  async mounted() {
    const allNetworksEndpoint = networkGetter.getAll();
    const networks = await requests.get.call(this, allNetworksEndpoint);
    this.updateNetworksFromBackend(networks);
  },
  methods: {
    ...mapActions("global", [
      "updateNetworksFromBackend",
      "setCurrentNetwork",
      "setCurrentPort",
      "setCurrentHost",
      "deleteNetwork",
      "setHosts",
      "changeAutoDetect"
    ]),
    sendOpenCreateNetworkDialog() {
      if (!this.currentNetwork.locked) {
        this.createNetworkDialog = true;
      }
    },
    async loadNetwork(props) {
      if (this.currentNetwork.locked) return;
      const networkId = props.row._id;
      const endpoint = networkGetter.getOne();
      const network = await requests.get.call(this, endpoint, networkId);
      network.locked = false;
      this.setCurrentNetwork(network);
      this.setHosts(network.hosts);
      this.setCurrentHost({ row: {} });
    },
    sendOpenUpdateNetworkDialog() {
      if (!this.currentNetwork.locked) {
        this.openNetworkUpdateDialog = true;
      }
    },
    isSelectedNetwork(props) {
      return props.row._id === this.currentNetwork._id;
    },
    confirmDeleteNetworkDialog(data) {
      if (this.currentNetwork.locked) return;
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure you want to delete this network",
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          const { endpoint, dataFromBuilder } = globalRequestBuilder(
            "network",
            "delete",
            data.row
          );
          await requests.post.call(this, endpoint, dataFromBuilder);
          this.deleteNetwork(data.row);
          await this.fallback(this.networks[0]);
        });
    },
    async fallback(network) {
      if (network) return await this.loadNetwork({ row: network });
      await this.setCurrentNetwork({});
      await this.setHosts([]);
      await this.setCurrentHost({ row: {} });
    }
  }
};
</script>

<style lang="sass">

thead tr th
  position: sticky
  z-index: 1


  thead tr:last-child th
    top: 48px

    thead tr:first-child th
      top: 0

      .item-dropdown
        border-bottom: 1px solid grey

        .tdIp
          cursor: default
</style>
