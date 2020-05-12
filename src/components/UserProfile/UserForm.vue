<template>
  <div class="row q-pa-md flex justify-center">
    <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 q-pb-md row justify-center avatarRow">
      <q-avatar size="15vh">
        <img :src="userImageUrl" v-if="userImage" />
        <q-icon name="face" color="softPrimary" size="10vw" v-else />
      </q-avatar>
    </div>
    <div class="col q-ml-md col-xs-12 col-md-8 col-lg-8 q-pb-md q-pt-lg">
      <div class="row">
        <q-form @submit="onSubmit" class="q-gutter-lg col-xs-12 col-sm-8 col-md-7 col-lg-5">
          <div class="row items-end q-pb-lg">
            <div class="col-12 formRow">
              <p class="q-gutter-md">
                <span class="formSpan">Name:</span>
                <span>{{name}}</span>
                <span class="showForm text-primary" @click="showName = true">(Change)</span>
              </p>
              <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                <q-input standard v-model="name" v-if="showName" />
              </div>
            </div>
          </div>

          <div class="row items-end q-pb-lg">
            <div class="col-12 formRow">
              <p class="q-gutter-md">
                <span class="formSpan">Surname:</span>
                <span>{{surname}}</span>
                <span class="showForm text-primary" @click="showSurname = true">(Change)</span>
              </p>
              <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                <q-input standard v-model="surname" v-if="showSurname" />
              </div>
            </div>
          </div>

          <div class="row q-pb-lg">
            <div class="col-12">
              <q-file
                standard
                accept=".jpg, image/*"
                v-model="image"
                label="Upload Avatar. Max file size 10 mb"
                :max-total-size="10485760"
              >
                <template v-slot:before>
                  <q-icon name="attachment" />
                </template>

                <template v-slot:append>
                  <q-icon
                    v-if="image !== null"
                    name="close"
                    @click.stop="image = null"
                    class="cursor-pointer"
                  />
                  <q-icon name="search" @click.stop />
                </template>
              </q-file>
            </div>
          </div>

          <div class="row items-start q-pb-lg passwordInput" v-if="strategy === 'local'">
            <div class="col-12 formRow">
              <p class="q-gutter-md">
                <span class="formSpan">Password</span>
                <span class="showForm text-primary" @click="showPassword = true">(Change)</span>
              </p>
              <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                <div class="row q-gutter-lg">
                  <q-input
                    class="col-11"
                    type="password"
                    standard
                    label="New Password"
                    v-model="newPassword"
                    v-if="showPassword"
                    :rules="[ val => val.length >= 8 && val.length <= 50 || 'Please use between 8 and 50 characters']"
                  />
                  <q-input
                    class="col-11"
                    type="password"
                    standard
                    label="Repeat new Password"
                    v-model="confirmPass"
                    v-if="showPassword"
                    :rules="[ val => val === this.newPassword || `Password doesn't match.`]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="q-pt-lg row justify-between">
            <q-btn class="col-3" label="Save" type="submit" color="primary" />
            <p class="text-primary col-3" @click="prompt" style="cursor: pointer;">Delete account</p>
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script>
import methods from "./methods";
import { mapGetters } from "vuex";
import getters from "./../../utils/getters";
import requests from "./../../utils/requests";
const userGetter = getters.user;
export default {
  name: "user-form",
  data() {
    return {
      name: null,
      showName: false,
      surname: null,
      newPassword: null,
      confirmPass: null,
      showSurname: false,
      showPassword: false,
      completeName: this.name + " " + this.surname,
      userId: null,
      strategy: "",
      image: null,
      filesMaxSize: null,
      userImage: "",
      deleteCode: null
    };
  },
  computed: {
    ...mapGetters("global", ["user", "userImageUrl"])
  },
  async created() {
    const user = await requests.get.call(this, getters.user.profile());
    this.name = user.name;
    this.surname = user.surname;
    this.userId = user._id;
    this.userImage = userGetter.image(user._id);
    this.strategy = user.strategy;
  },
  methods
};
</script>

<style scoped>
</style>
