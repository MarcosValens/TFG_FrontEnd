<template>
  <q-form class="q-gutter-md" @submit="login($event)">
    <q-dialog v-model="shouldOpenRegisterModal" persistent>
      <register-modal />
    </q-dialog>
    <div class="q-gutter-xs row col-md-12 col-sm-12">
      <q-input
        standard
        :rules="[val => !!val && val.length <=254 || 'Email is missing', isValidEmail]"
        stack-label
        class="q-gutter-xs col-md-12 col-sm-12"
        type="email"
        v-model="user.email"
        label="Email"
      />
    </div>
    <div class="q-gutter-xs row col-md-12 col-sm-12">
      <q-input
        standard
        stack-label
        class="q-gutter-xs col-md-12 col-sm-12"
        :rules="[ val => val.length >= 8 && val.length <= 50 || 'Please use between 8 and 50 characters']"
        v-model="user.password"
        type="password"
        label="Password"
      />
    </div>
    <q-card-actions vertical align="center">
      <q-spinner color="primary" size="2em" v-if="loggingIn" />
      <q-btn type="submit" color="primary" size="md" class="q-mt-md full-width" label="Login" />
    </q-card-actions>
    <q-card-actions>
      <div class="col-lg-12 col-md-12 col-sm-12">
        <q-btn
          color="primary"
          size="md"
          class="full-width q-gutter-x-xs googleButton"
          type="a"
          :href="googleLink"
        >
          <div id="google-icon">
            <q-img
              alt="google_icon"
              class="q-mx-sm col"
              width="16px"
              height="16px"
              src="./../../../assets/images/32px-Google__G__Logo.svg.png"
            />
          </div>
          <span class="col">Sign in with google</span>
        </q-btn>
      </div>
    </q-card-actions>

    <q-card-actions align="around">
      <p class="registerText text-grey text-right">
        You can
        <a @click="shouldOpenRegisterModal = true" class="text-primary">register</a>
        too!
      </p>
      <q-space v-if="!electron" />

      <div v-if="!electron" class="text-grey">
        <p>
          You can also <a @click="$router.push('/installers')" class="text-primary text-">download</a> our products
        </p>
      </div>
    </q-card-actions>
  </q-form>
</template>

<script>
import methods from "./methods";
import RegisterModal from "./../Modals/RegisterModal/RegisterModal.vue";
import getters from "./../../../utils/getters";
import isElectron from "is-electron";

const loginGetter = getters.login;
export default {
  components: { "register-modal": RegisterModal },
  data() {
    return {
      shouldOpenRegisterModal: false,
      loggingIn: false,
      googleLink: loginGetter.google(),
      electron: isElectron(),
      user: {
        password: "",
        email: ""
      }
    };
  },
  created() {
    this.$root.$on("userRegistered", user => {
      this.user.email = user.email;
    });
  },
  methods
};
</script>

<style>
#google-icon {
  background-color: white;
}

.registerText {
  font-size: small;
}

.registerText a {
  cursor: pointer;
}
</style>