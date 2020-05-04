<template>
  <q-card style="min-width: 350px">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">Update host's description</div>
      <q-space/>
      <q-btn id="close-popup" icon="close" flat round dense v-close-popup/>
    </q-card-section>
    <q-form @submit="updateHost($event)">
      <q-card-section class="q-pt-none">

        <div class="row">
          <div class="col">
            <q-input dense
                     v-model="description"
                     autofocus
                     :rules="[val =>  val.length > 30 ? `Description can't be more than 30 characters long` : true]"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup/>
        <q-btn flat label="Update host" type="submit" v-close-popup="canClose"/>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
  import {mapGetters} from "vuex";
  import methods from "./methods"

  export default {
    name: "Updatehost",
    data() {
      return {
        description: "",
        canClose: false,
      }
    },
    computed: {
      ...mapGetters('global', ['currentHost'])
    },
    created() {
      this.description = this.currentHost.description
    },
    methods
  }
</script>

<style scoped>

</style>
