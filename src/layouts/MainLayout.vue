<template class="flex flex-center">
  <q-layout view="lHh Lpr lFf" class="bgImage">
    <vue-particles
      color="#dedede"
      :particleOpacity="0.7"
      :particlesNumber="80"
      shapeType="circle"
      :particleSize="4"
      linesColor="#dedede"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"

    ></vue-particles>
    <div v-if="electron">
      <q-dialog v-model="openUserAgreementDialog" transition-show="rotate" transition-hide="rotate">
        <user-agreement-dialog />
      </q-dialog>
    </div>
    <div class="row items-center">
      <div class="col">
        <q-header elevated class="bg-grey-10">
          <q-toolbar>
            <q-toolbar-title>
              <q-tabs align="left">
                <q-tab @click="redirect()" no-caps>
                  <div class="row">
                    <div class="row col-12 justify-center items-center" style="height: 100px">
                      <img class="above-bg q-mb-sm q-mr-lg" src="../statics/icons/icon-512x512.png" alt="icon" style="height: 64px; width: 64px;"/>
                      <span class="text-center above-bg" style="font-size: 3.8rem;">
                        PORT SCANNER
                      </span>
                    </div>
                  </div>
                </q-tab>
              </q-tabs>
            </q-toolbar-title>
            <div>
              <q-avatar clickable @click="rightDrawerOpen = !rightDrawerOpen" size="3.8rem">
                <q-img :src="userImageUrl" id="userPic" />
              </q-avatar>
            </div>
          </q-toolbar>
        </q-header>
      </div>
    </div>
    <q-drawer v-model="rightDrawerOpen" bordered side="right" content-class="bg-dark text-white">
      <q-list>
        <esential-link v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer elevated class="bg-dark">
      <q-toolbar>
        <q-toolbar-title>Port Scanner&#174</q-toolbar-title>
        <p class>Created by Benjamin Cardona and Marcos Valens. All rights reserved</p>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<style>
.title {
  font-family: networkFont, sans-serif;
  font-size: 5vh;
}
</style>

<script>
import isElectron from "is-electron";
import { mapActions, mapGetters } from "vuex";

import EssentialLink from "components/EssentialLink";
import UserAgreementDialog from "components/Main/Dialogs/UserAgreementDialog/UserAgreementDialog";
import requests from "./../utils/requests";
import getters from "./../utils/getters";

const userGetter = getters.user;

export default {
  name: "MainLayout",

  components: {
    "esential-link": EssentialLink,
    "user-agreement-dialog": UserAgreementDialog
  },

  data() {
    return {
      user: {},
      rightDrawerOpen: false,
      openUserAgreementDialog: false,
      displayNewUpdatePopup: false,
      displayUpdateDownloadedPopup: false,
      electron: isElectron(),
      essentialLinks: [
        {
          title: "Profile",
          icon: "face",
          to: "/userProfile"
        },

        {
          title: "Chat",
          icon: "chat",
          to: "/main/chat",
          separator: true
        },
        {
          title: "Logout",
          icon: "exit_to_app",
          to: "/login?wasLogOut=true"
        }
      ]
    };
  },
  computed: {
    ...mapGetters("global", ["userImageUrl"])
  },
  beforeCreate() {
    this.$store.dispatch("global/init")
  },
  async created() {
    this.user = await requests.get.call(this, userGetter.profile());
    this.init();
    this.setUser(this.user);
    this.setUserImageUrl(userGetter.image(this.user._id));
    this.openUserAgreementDialog = !this.user.userAgreementAccepted;

    window.onfocus = function() {
      window.hasFocus = true;
    };
    window.onblur = function() {
      window.hasFocus = false;
    };
    this.$q.dark.set(true);
  },
  methods: {
    ...mapActions("global", ["setUser", "setUserImageUrl", "init"]),
    redirect() {
      this.$router.push("/main");
    }
  }
};
</script>

<style>
/*.bgImage {
    background-image: url("../assets/images/netwokrFondo.png");
    background-repeat: no-repeat;
    background-size: cover
  }*/
#particles-js {
  background-size: cover;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
