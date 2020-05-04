<template>
  <div class="col-lg-3 col-sm-12" v-if="networks.length">
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
      hide-bottom
      style="height: 100%"
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="4"
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
                  @click="openNetworkUpdateDialog = true"
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
          @click="newNetworkDialog = true"
        ></q-btn>
        <q-dialog v-model="newNetworkDialog" persistent>
          <create-network-dialog />
        </q-dialog>
      </template>

      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search Network">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
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
      @click="networkDialog = true"
    >Create one</q-btn>
    <q-dialog v-model="networkDialog" persistent>
      <create-network-dialog />
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

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
      environment: `${process.env.ENVIRONMENT}`,
      model: null,
      networkDialog: false,
      newNetworkDialog: false,
      firstNetworkDialog: false,
      openNetworkUpdateDialog: false,
      filter: "",
      pagination: {
        rowsPerPage: 0
      }
    };
  },
  computed: {
    ...mapGetters("global", ["networks", "currentNetwork"])
  },
  async mounted() {
    const allNetworksEndpoint = networkGetter.getAll();
    const networks = await requests.get.call(this, allNetworksEndpoint);
    this.updateNetworksFromBackend(networks);
  },
  methods: {
    ...mapActions("global", ["updateNetworksFromBackend", "setCurrentNetwork"]),
    async loadNetwork(props) {
      const networkId = props.row._id;
      const endpoint = networkGetter.getOne();
      const network = await requests.get.call(this, endpoint, networkId);
      this.setCurrentNetwork(network);
    },
    isSelectedNetwork(props) {
      return props.row._id === this.currentNetwork._id;
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
