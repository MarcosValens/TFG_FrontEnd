<template>
  <q-card style="min-width: 350px">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">Update port</div>
      <q-space />
      <q-btn id="close-popup" icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-card-section>
      <q-form @submit="sendPortUpdate($event)">
        <div class="row">
          <div class="col">
            <q-input
              v-model="currentPort.port"
              type="number"
              label="Port"
              dense
              autofocus
              disabled
            />
          </div>
          <div class="col">
            <q-toggle v-model="open" label="Open" color="green" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-input v-model="service" label="Service" dense autofocus :rules="[isValidService]" />
          </div>
        </div>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Update port" type="submit" v-close-popup="canClose" />
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "UpdatePortDialog",
  data() {
    return {
      canClose: false,
      open: false,
      service: ""
    };
  },

  computed: {
    ...mapGetters("global", ["currentNetwork", "currentHost", "currentPort"])
  },

  created() {
    this.open = this.currentPort.open;
    this.service = this.currentPort.service;
  },

  methods: {
    ...mapActions("global", ["updatePort"]),
    async sendPortUpdate(ev) {
      try {
        if (!this.isChanged()) return this.close();
        this.updatePort({open: this.open, service: this.service})
        this.close();
      } catch (e) {
        ev.preventDefault();
      }
    },

    close() {
      document.querySelector("#close-popup").click();
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
