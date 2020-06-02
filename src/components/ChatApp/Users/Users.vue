<template>
  <q-list separator>
    <q-item v-for="chatUser in chatUsers" :key="chatUser._id" class="q-my-sm" clickable v-ripple>
      <q-item-section avatar>
        <q-avatar>
          <q-img :src="getImage(chatUser)" id="userPic" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>
          {{ chatUser.name }} {{ chatUser.surname }}
          <q-icon name="group_work" v-if="chatUser.electron" size="1.5em" color="primary" />
        </q-item-label>
        <q-item-label caption lines="1">{{ chatUser.email }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import isElectron from "is-electron";
import { mapGetters } from "vuex";

import getters from "./../../../utils/getters";

const userGetter = getters.user;

export default {
  name: "Users",
  data() {
    return {
      chatUsers: [],
      electron: isElectron()
    };
  },
  computed: {
    ...mapGetters("global", ["user"])
  },
  created() {
    if (!this.user._id) return this.$router.push("/main")
    console.log(this.user)
    this.chatUsers.push(this.user);
    this.$root.$on("new-user", data => {
      const usersFiltered = this.removeDuplicates(data.users, "_id")
      this.chatUsers = usersFiltered;
    });
    this.$root.$on("user-disconnected", user => {
      this.chatUsers = this.chatUsers.filter(
        chatUser => chatUser._id !== user._id
      );
    });
  },
  methods: {
    getImage(user) {
      return userGetter.image(user._id);
    },
    removeDuplicates(array, prop) {
      return array.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
      });
    }
  },
  beforeDestroy() {
    this.$root.$off("new-user");
    this.$root.$off("user-disconnected");
  }
};
</script>