<template class="flex flex-center">
  <q-layout view="lHh Lpr lFf">
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
                <q-tab @click="redirect()" no-caps><span class="title">PorT ScanneR</span></q-tab>
              </q-tabs>
            </q-toolbar-title>
            <div>
              <q-avatar clickable @click="rightDrawerOpen = !rightDrawerOpen">
                <q-img :src="userImageUrl" id="userPic"/>
              </q-avatar>
            </div>
          </q-toolbar>
        </q-header>
      </div>
    </div>
    <q-drawer
      v-model="rightDrawerOpen"
      bordered
      side="right"
      content-class="bg-dark text-white"
    >
      <q-list>
        <esential-link
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<style>
  .title {
    font-family: networkFont, sans-serif;
    font-size: 5vh;

  }
</style>

<script>
  import isElectron from 'is-electron';
  import { mapActions, mapGetters } from 'vuex';

  import EssentialLink from 'components/EssentialLink';
  import UserAgreementDialog from 'components/Main/Dialogs/UserAgreementDialog/UserAgreementDialog';
  import requests from './../utils/requests';
  import getters from './../utils/getters';

  const userGetter = getters.user;

  export default {
    name: 'MainLayout',

    components: {
      "esential-link": EssentialLink,
      "user-agreement-dialog": UserAgreementDialog,
    },

    data() {
      return {
        user: {},
        rightDrawerOpen: false,
        openUserAgreementDialog: false,
        electron: isElectron(), 
        essentialLinks: [
          {
            title: 'Profile',
            icon: 'face',
            to: 'userProfile'
          },
          {
            title: 'Logout',
            icon: 'exit_to_app',
            to: 'login'
          },
        ]
      }
    },
    computed: {
      ...mapGetters("global", ["userImageUrl"])
    },
    async created() {
      this.user = await requests.get.call(this, userGetter.profile());;
      this.setUser(this.user);
      this.setUserImageUrl(userGetter.image(this.user._id));
      this.openUserAgreementDialog = !this.user.userAgreementAccepted;
      
      window.onfocus = function () {
        window.hasFocus = true;
      };
      window.onblur = function () {
        window.hasFocus = false;
      }
      this.$q.dark.set(true)
    },
    methods: {
      ...mapActions("global", ["setUser", "setUserImageUrl"]),
      redirect() {
        this.$router.push('/main')
      }
    }
  }
</script>
