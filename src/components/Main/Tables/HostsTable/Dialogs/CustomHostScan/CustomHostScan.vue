<template>
  <q-card style="min-width: 350px">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">Customized host scan</div>
      <q-space/>
      <q-btn id="close-popup" icon="close" flat round dense v-close-popup/>
    </q-card-section>
    <q-card-section>
      <p>Enter the ports separated by commas or in this format: 1-10000. Leave empty to do default scan.</p>
    </q-card-section>
    <q-card-section>
      <q-form @submit="doFullScan($event)">
        <div class="row">
          <div class="col">
            <q-input
              standard
              stack-label
              type="text"
              v-model="ports"
              :error-message="message"
              :error="message !== null"
              label="Input the ports"
            />
          </div>
        </div>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn flat label="Start scan" type="submit" v-close-popup="canClose"/>
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
  import { mapGetters } from "vuex";
  import methods from "./methods"

  export default {
    name: "CustomHostScan",
    data() {
      return {
        canClose: false,
        ports: "",
        message: null
      };
    },
    computed:{
      ...mapGetters('global',['currentHost'])
    },
    methods
  };
</script>
<style scoped>

</style>


