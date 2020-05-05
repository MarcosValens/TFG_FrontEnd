<template>
  <div class="col-lg-9 col-xs-12 col-sm-12">
    <template>
      <q-dialog v-model="shouldOpenUpdateHostModal">
        <update-host-dialog />
      </q-dialog>

      <q-dialog v-model="shouldOpenUpdatePortModal">
        <update-port-dialog />
      </q-dialog>
    </template>

    <!-- Scanner Buttons and search bar -->
    <div class="row q-pa-md q-gutter-md justify-around">
      <scanner-buttons v-if="electron && currentNetwork._id" />
      <div class="col-2" v-if="hosts.length">
        <template>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </div>
    </div>

    <!-- Warnings -->
    <div v-if="!currentNetwork._id">
      <display-warning message="Please select network" />
    </div>
    <div v-else-if="!hosts.length">
      <display-warning message="There are no hosts" />
      <div v-if="!electron">
        <display-button />
      </div>
    </div>

    <!-- Table -->
    <div v-else>
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
        hide-bottom
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
        :virtual-scroll-sticky-size-start="4"
      >
        <template v-slot:body="props">
          <q-tr :props="props" @click="setCurrentHost(props)">
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

            <q-td key="alive" :props="props">
              <q-icon
                :name="props.row.alive ? 'done' : 'clear'"
                style="font-size: 2em"
                :class="props.row.alive ? 'text-positive' : 'text-negative'"
              />
            </q-td>

            <q-td key="ports" :props="props">
              <q-btn-dropdown color="primary" rounded label="Select port">
                <q-list>
                  <q-item
                    v-for="(port, index) in props.row.ports"
                    :key="index"
                    clickable
                    class="item-dropdown items-center row"
                  >
                    <div class="col-8">
                      <q-item-section @click="onItemClick(props, index)">
                        <q-item-label>{{ port.port }}</q-item-label>
                      </q-item-section>
                    </div>
                    <div class="col-1">
                      <q-item-section>
                        <q-icon
                          name="delete"
                          class="text-red q-ml-sm"
                          style="font-size: 2rem"
                          clickable
                          @click="openConfirmDeletePortDialog(port)"
                        />
                      </q-item-section>
                    </div>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-td>
            <q-td key="icon">
              <div class="row" v-if="isCurrentHost(props)">
                <q-chip
                  icon="delete"
                  text-color="white"
                  color="negative"
                  clickable
                  @click="confirmDeleteHostDialog(props)"
                >Delete</q-chip>
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
          style: "width: 15vw"
        },
        {
          name: "ip",
          align: "center",
          label: "IP",
          field: "ipAddress",
          sortable: true,
          style: "width: 15vw"
        },
        {
          name: "alive",
          align: "center",
          label: "Living",
          field: "living"
        },
        {
          name: "ports",
          align: "center",
          label: "Ports",
          field: "ports",
          sortable: true,
          style: "width: 15vw"
        },
        {
          name: "actions",
          label: "Actions",
          align: "center",
          style: "width: 27vw"
        }
      ],
      shouldOpenUpdateHostModal: false,
      shouldOpenUpdatePortModal: false,
      electron: isElectron(),
      model: {},
      option: [],
      locked: false,
      filter: "",
      pagination: {
        rowsPerPage: 0
      }
    };
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
      "setCurrentHost",
      "setCurrentPort",
      "deleteHost",
      "deletePort"
    ]),
    isCurrentHost(host) {
      return host.row._id === this.currentHost._id;
    },
    onItemClick(props, index) {
      this.setCurrentPort(props.row.ports[index]);
      this.shouldOpenUpdatePortModal = true;
      this.setCurrentHost(props);
    },
    openUpdateHostModal(props) {
      this.setCurrentHost(props);
      this.shouldOpenUpdateHostModal = true;
    },
    confirmDeleteHostDialog(props) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure you want to delete this host?",
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          this.deleteHost(props.row);
          // TODO: Add backend call
        });
    },
    openConfirmDeletePortDialog(port) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure you want to delete this port?",
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          this.deletePort(port);
          // TODO: Add backend call
        });
    }
  }
};
</script>