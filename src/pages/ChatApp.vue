<template>
  <div class="q-pa-xl">
    <div class="row q-gutter-sm chat bg-dark">
      <div class="col">
        <div class="row">
          <div class="col-lg-10 col-sm-8 chat-messages scroll">
            <messages :socket="socket" />
          </div>
          <div class="col-lg-2 col-sm-4 chat-users bg-secondary scroll">
            <q-toolbar class="text-center">
              <q-toolbar-title>Users</q-toolbar-title>
            </q-toolbar>
            <q-separator />
            <users :socket="socket" />
          </div>
        </div>
        <div class="row chat-actions bg-accent full-width">
          <options :socket="socket" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import isElectron from "is-electron";
import { mapGetters, mapActions } from "vuex";
import client from "socket.io-client";

import Messages from "./../components/ChatApp/Messages/Messages.vue";
import Options from "./../components/ChatApp/Options/Options.vue";
import Users from "./../components/ChatApp/Users/Users.vue";
// 5ec7e214271a1b6bd66ff5f4
export default {
  components: {
    messages: Messages,
    options: Options,
    users: Users
  },
  name: "ChatApp",
  data() {
    return {
      socket: {}
    };
  },
  computed: {
    ...mapGetters("global", ["user"])
  },
  methods: {
    setupSocketEvents() {
      this.socket.on("connect", this.onConnect.bind(this));
      this.socket.on("new-user", this.onNewUser.bind(this));
      this.socket.on("user-disconnected", this.onUserDisconnected.bind(this));
      this.socket.on("message-sent", this.onMessageSent.bind(this))
    },
    onConnect() {
      const currentUserClone = JSON.parse(JSON.stringify(this.user));
      currentUserClone.electron = isElectron();
      this.socket.emit("client-joined", currentUserClone);
      this.$root.$on("prepare-message", message => {
        message.sender = currentUserClone;
        this.socket.emit("new-message", message);
        this.$root.$emit("new-message", message);
      });
    },
    onNewUser(data) {
      this.$root.$emit("new-user", data);
    },
    onMessageSent(message) {
      this.$root.$emit("new-message", message)
    },
    onUserDisconnected(user) {
      this.$root.$emit("user-disconnected", user);
    }
  },
  mounted() {
    this.socket = client(process.env.BACKEND_URL);

    this.setupSocketEvents();
  },
  beforeDestroy() {
    this.socket.disconnect();
    this.socket = {};
  },
  destroyed() {
    this.$destroy();
  }
};
</script>
<style lang="scss">
.chat {
  height: 65vh;
  .chat-users {
    height: 60vh;
  }
}
</style>