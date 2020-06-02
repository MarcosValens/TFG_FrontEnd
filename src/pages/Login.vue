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
            <img src="../assets/images/network.gif" style="width: 100%; height: 100%;" />
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
import isElectron from "is-electron";
import LoginForm from "./../components/Login/LoginForm/LoginForm.vue";

import requests from './../utils/requests';
import getters from './../utils/getters';
const userGetter = getters.user;
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
  async created() {
    const endpoint = userGetter.invalidate();
    const wasLoggedOut = location.href.split("=")[1]
    // Blacklist Token if we log out
    // Should this go here?
    if (wasLoggedOut) {
      await requests.delete.call(this, endpoint, localStorage.getItem("refresh-token"))
    };
    localStorage.removeItem("hosts");
    localStorage.removeItem("current-host");
    localStorage.removeItem("current-network");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh-token");
    
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
