 <template class="flex flex-center">
  <q-page>
    <!-- Page title -->
    <div class="q-pa-md row">
      <div class="row col-12">
        <div class="col">
          <h1 class="text-center">PorT ScanneR</h1>
        </div>
      </div>

      <div class="row col-12 justify-center">
        <q-card class="login-card row">
          <!-- App logo -->
          <q-card-section class="col-lg-7 col-md-12 col-sm-12">
            <img src="../assets/images/network.gif" style="width: 100%" />
          </q-card-section>

          <!-- Login Form -->
          <div class="col-lg-5 col-md-12 col-sm-12">
            <!-- Login errors display -->
            <div class="q-pt-md text-center col-12" v-if="errors.global.length">
              <div
                class="text-negative"
                v-for="(error, index) in errors.global"
                :key="index"
              >{{ error.msg }}</div>
            </div>
            <q-card-section class="items-center">
              <login-form />
            </q-card-section>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import LoginForm from "./../components/Login/LoginForm/LoginForm.vue";
import isElectron from "is-electron";

export default {
  name: "Login",
  components: { "login-form": LoginForm },
  data() {
    return {
      errors: {
        global: []
      },
      electron: isElectron()
    };
  },
  created() {
    localStorage.removeItem("token");
    this.$root.$on("errors", errors => {
      this.errors = errors;
    });
  },
  beforeDestroy() {
    this.$root.$off("errors");
  }
};
</script>


<style scoped>
h1 {
  font-family: networkFont, sans-serif;
}

.login-card {
  width: 45vw;
}
</style>
