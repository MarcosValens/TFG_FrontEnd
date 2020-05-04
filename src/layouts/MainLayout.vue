<template class="flex flex-center">
  <q-layout view="lHh Lpr lFf">
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
                <q-img :src="imgUrl" id="userPic"/>
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
        <EssentialLink
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
  import EssentialLink from 'components/EssentialLink';
  import moduleName from './../utils/requests';
  import getters from './../utils/getters';
  const userGetter = getters.user;

  export default {
    name: 'MainLayout',

    components: {
      EssentialLink
    },

    data() {
      return {
        user: {},
        imgUrl: "",
        rightDrawerOpen: false,
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

    async created() {
      const response = await this.$axios.get(userGetter.profile());
      
      this.user = response.data;
      this.imgUrl = userGetter.image(this.user._id);
      
      window.onfocus = function () {
        window.hasFocus = true;
      };
      window.onblur = function () {
        window.hasFocus = false;
      }
      this.$q.dark.set(true)
    },
    methods: {
      redirect() {
        this.$router.push('/main')
      }
    }
  }
</script>
