<template>
  <div>
    <q-dialog v-model="displayNewUpdatePopup">
      <q-card>
        <q-card-section>
          <div class="text-h6">New update</div>
        </q-card-section>

        <q-card-section class="q-pt-none">There's a new update in your client.</q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="displayUpdateDownloadedPopup" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Update downloaded</div>
        </q-card-section>

        <q-card-section
          class="q-pt-none"
        >The update has been downloaded, please restart the application.</q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="restartApp()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import isElectron from "is-electron";

let ipcRenderer = null;
if (isElectron()) {
  ipcRenderer = require("electron").ipcRenderer;
}
export default {
  name: "Updater",
  data() {
    return {
      displayNewUpdatePopup: false,
      displayUpdateDownloadedPopup: false
    };
  },
  async mounted() {
    if (!ipcRenderer) return;
    
    ipcRenderer.on("update_available", () => {
      ipcRenderer.removeAllListeners("update_available");
      this.displayNewUpdatePopup = true;
    });
    ipcRenderer.on("update_downloaded", () => {
      ipcRenderer.removeAllListeners("update_downloaded");
      this.displayUpdateDownloadedPopup = true;
    });
  },
  methods: {
    restartApp() {
      ipcRenderer.send("restart_app");
    }
  }
};
</script>