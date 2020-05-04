<template>
  <q-card style="min-width: 350px">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">Network creation</div>
      <q-space />
      <q-btn id="close-popup" icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-card-section>
      <q-form @submit="createNetwork($event)">
        <div class="row">
          <div class="col">
            <q-input
              standard
              stack-label
              type="text"
              :rules="[val => !val.length ? myMessage = 'Please input a valid network name' : val.length < 3 || val.length > 25 ? myMessage = 'Name must be between 3 and 25 characters long' : myMessage = null]"
              v-model="name"
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
              v-model="gateway"
              :error-message="gatewayErrorMessage"
              :error="gatewayErrorMessage !== null"
              label="Enter gateway address"
            />
          </div>
        </div>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Create network" type="submit" v-close-popup="canClose" />
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: "CreateNetworkDialog",
  data() {
    return {
      canClose: false,
      name: "",
      gateway: "",
      gatewayErrorMessage: null,
      isNameTaken: "",
      myMessage: null
    };
  },

  methods: {
    async createNetwork(ev) {
      try {
        await createNetwork.call(this, this.name, this.gateway);
        this.canClose = true;
        document.querySelector("#close-popup").click();
      } catch (e) {
        if (e.message) {
            this.myMessage = e.message;
        }
        if (e.errors) {
          this.gatewayErrorMessage = e.errors.find(({param}) => param === "gateway").msg || null;
        }

      }
    }
  }
};
</script>