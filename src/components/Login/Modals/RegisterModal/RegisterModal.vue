<template>
  <q-card style="min-width: 350px">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">User register</div>

      <q-space />
      <q-btn id="close-popup" icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-card-section>
      <q-form @submit="register($event)">
        <div class="row q-gutter-md">
          <div class="col">
            <q-input
              standard
              stack-label
              v-model="user.name"
              :rules="[val => !val ? 'Name must not be empty' : val.length < 3 || val.length > 30 ?
              'Name must be between 3 and 30 characters long' : true]"
              label="Your name *"
            />
          </div>
          <div class="col">
            <q-input
              standard
              stack-label
              v-model="user.surname"
              :rules="[val => !val ? 'Surname must not be empty' : val.length < 3 || val.length > 30 ?
              'Surname must be between 3 and 30 characters long' : true]"
              label="Your surname *"
            />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-input
              standard
              stack-label
              type="email"
              v-model="user.email"
              :rules="[val => !!val && val.length <=254 || 'Email is missing', isValidEmail]"
              :error-message="uniqueEmailErrorMessage"
              :error="uniqueEmailErrorMessage !== ''"
              label="Your email *"
            />
          </div>
        </div>
        <div class="row q-gutter-md">
          <div class="col">
            <q-input
              standard
              stack-label
              type="password"
              v-model="user.password"
              :rules="[ val => val.length >= 8 && val.length <= 50 || 'Please use between 8 and 50 characters']"
              label="Your password *"
            />
          </div>
          <div class="col">
            <q-input
              standard
              stack-label
              type="password"
              v-model="passwordToMatch"
              :rules="[ val => !!val && val === this.user.password || `Password doesn't match.`]"
              label="Repeat your password *"
            />
          </div>
        </div>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Register" type="submit" v-close-popup="canClose" />
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import methods from './methods';
export default {
  name: "RegisterModal",
  data() {
    return {
      user: {
        email: "",
        name: "",
        surname: "",
        password: ""
      },
      passwordToMatch: "",
      errors: {},
      canClose: false,
      uniqueEmailErrorMessage: ""
    };
  },
  mounted() {
    this.canClose = false;
  },
  methods
};
</script>
