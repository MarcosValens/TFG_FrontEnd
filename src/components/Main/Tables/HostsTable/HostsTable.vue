<template>
  <div class="col-lg-9 col-xs-12 col-sm-12">
    <template>
      <q-dialog v-model="shouldOpenUpdateHostModal">
        <update-host-dialog />
      </q-dialog>

      <!--<q-dialog v-model="shouldOpenUpdatePortModal">
        <update-port-dialog />
      </q-dialog>-->
    </template>

    <!-- Scanner Buttons and search bar -->
    <div class="row q-pa-md q-gutter-md justify-around">
      <scanner-buttons v-if="electron && currentNetwork._id" />

      <div class="col-2" v-if="hosts.length" style="z-index: 2">
          <q-toggle
            style="font-size: 0.9rem"
            :value="autoDetect"
            label="Auto-detect services"
            @input="changeAutoDetect"
            :disable="currentHost.locked || currentNetwork.locked"
            color="green"
          />
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
      </div>
    </div>

    <!-- Warnings -->
    <div v-if="!networks.length">
      <display-warning message="Please create a network" />
    </div>
    <div v-else-if="!currentNetwork._id">
      <display-warning message="Please select network" />
    </div>
    <div v-else-if="!hosts.length">
      <display-warning message="There are no hosts" />
      <div v-if="!electron">
        <display-button />
      </div>
    </div>

    <!-- Table -->
    <div v-else class="transparent">
      <div v-if="!electron" class="q-mb-md">
        <display-button />
      </div>
      <q-table
        dark
        color="ambar"
        :data="hosts"
        :columns="hostColumns"
        :filter="filter"
        row-key="index"
        binary-state-sort
        virtual-scroll
        style="height: 100%"
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
        :virtual-scroll-sticky-size-start="4"
      >
        <template v-slot:body="props">
          <q-tr :props="props" @click="checkAndSetCurrentHost(props)">
            <q-td key="description" :props="props">
              <q-avatar
                class="q-ml-sm q-mr-sm description-icon"
                style="font-size: 1.5rem; cursor:pointer;"
                clickable
                color="primary"
                @click.stop="openUpdateHostModal(props)"
              >
                <q-icon name="create" color="white" style="font-size: 1rem"></q-icon>
              </q-avatar>
              {{ props.row.description }}
            </q-td>

            <q-td key="ip" :props="props" class="tdIp">{{ props.row.ipAddress }}</q-td>
            <q-td key="mac" :props="props" class="tdIp">{{ props.row.macAddress }}</q-td>

            <q-td key="alive" :props="props">
              <q-icon
                :name="props.row.alive ? 'done' : 'clear'"
                style="font-size: 2em"
                :class="props.row.alive ? 'text-positive' : 'text-negative'"
              />
            </q-td>

            <q-td key="ports" :props="props">

              <q-btn color="accent" :disabled="currentNetwork.locked || currentHost.locked" rounded :label="!props.row.ports.length ? 'No ports found' : `Check ${props.row.ports.length} ports`" @click="loadPorts(props)" />

            </q-td>
            <q-td key="icon">
              <div class="row" v-if="isCurrentHost(props)">
                <q-avatar
                  class="q-mr-lg"
                  style="font-size: 1.8rem; cursor:pointer;"
                  icon="delete"
                  text-color="white"
                  color="negative"
                  clickable
                  @click="confirmDeleteHostDialog(props)"
                >
                  <q-tooltip>Delete this host</q-tooltip>
                </q-avatar>
                <host-buttons
                  :props="props"
                  :network="currentNetwork"
                  :host="currentHost"
                  :allHosts="hosts"
                  v-if="electron"
                />
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import isElectron from "is-electron";

import UpdateHostDialog from "./Dialogs/UpdateHostDialog/UpdateHostDialog";
import UpdatePortDialog from "./Dialogs/UpdatePortDialog/UpdatePortDialog";
import ScannerButtons from "./ScannerButtons/ScannerButtons";
import DisplayWarning from "./DisplayWarning/DisplayWarning";
import DisplayButton from "./DisplayButton/DisplayButton";
import HostButtons from "./HostButtons/HostButtons";

import requests from "./../../../../utils/requests";
import globalRequestBuilder from "./../../../../utils/globalRequestBuilder";

export default {
  components: {
    "update-host-dialog": UpdateHostDialog,
    "update-port-dialog": UpdatePortDialog,
    "scanner-buttons": ScannerButtons,
    "display-warning": DisplayWarning,
    "host-buttons": HostButtons,
    "display-button": DisplayButton
  },
  data() {
    return {
      hostColumns: [
        {
          name: "description",
          align: "left",
          label: "Description",
          field: "description",
          sortable: true,
          style: "width: 20vw"
        },
        {
          name: "ip",
          align: "center",
          label: "IP",
          field: "ipAddress",
          sortable: true,
          style: "width: 5vw"
        },
        {
          name: "mac",
          align: "center",
          label: "Mac Address",
          field: "macAddress",
          sortable: true,
          style: "width: 8vw"
        },
        {
          name: "alive",
          align: "center",
          label: "Living",
          field: "living",
          style: "width: 1vw"
        },
        {
          name: "ports",
          align: "center",
          label: "Ports",
          field: "ports",
          sortable: true,
          style: "width: 16vw"
        },
        {
          name: "actions",
          label: "Actions",
          align: "center",
          style: "width: 20vw"
        }
      ],
      shouldOpenUpdateHostModal: false,
      shouldOpenUpdatePortModal: false,
      electron: !isElectron(),
      model: {},
      option: [],
      locked: false,
      filter: "",
      pagination: {
        rowsPerPage: 7
      }
    };
  },

  computed: {
    ...mapGetters("global", [
      "hosts",
      "currentNetwork",
      "currentHost",
      "networks",
      "currentPort",
      "autoDetect"
    ])
  },
  methods: {
    ...mapActions("global", [
      "setCurrentHost",
      "setCurrentPort",
      "deleteHost",
      "deletePort",
      "changeAutoDetect"
    ]),
    isHostLocked(host) {
      return host && host.locked;
    },
    checkAndSetCurrentHost(data) {
      if (this.isHostLocked(this.currentHost)) {
        return false;
      }
      this.setCurrentHost(data);
      return true;
    },
    loadPorts(data) {
      if (!this.checkAndSetCurrentHost(data)) {
        return;
      }
      this.$router.push("/main/port-form")
    },
    isCurrentHost(host) {
      return host.row._id === this.currentHost._id;
    },
    openUpdateHostModal(props) {
      if (this.isHostLocked(this.currentHost)) return;
      this.setCurrentHost(props);
      this.shouldOpenUpdateHostModal = true;
    },
    confirmDeleteHostDialog() {
      if (this.isHostLocked(this.currentHost)) return;
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure you want to delete this host?",
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          this.deleteHost(this.currentHost);

          const { endpoint, dataFromBuilder } = globalRequestBuilder.call(
            this,
            "host",
            "delete",
            {
              network: this.currentNetwork,
              host: this.currentHost
            }
          );
          await requests.post.call(this, endpoint, dataFromBuilder);
        });
    }
  }
};
</script>

<style></style>
