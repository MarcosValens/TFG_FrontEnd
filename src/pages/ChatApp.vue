<template>
  <div class="q-pa-xl">
    <q-breadcrumbs class="text-grey q-mb-md above-bg">
      <template v-slot:separator>
        <q-icon size="1.5em" name="chevron_right" color="primary"/>
      </template>
      <q-breadcrumbs-el label="Home" icon="home" to="main"/>
      <q-breadcrumbs-el label="Chat" icon="chat"/>
    </q-breadcrumbs>
    <div class="row chat bg-dark above-bg">
      <div class="col">
        <div class="row">
          <div class="col-lg-10 col-sm-8 chat-messages scroll">
            <messages :socket="socket" />
          </div>
          <div class="col-lg-2 col-sm-4 chat-users bg-blue-grey-14 scroll personalBorder">
            <q-toolbar class="text-center">
              <q-toolbar-title>Users</q-toolbar-title>
            </q-toolbar>
            <q-separator />
            <users :socket="socket" />
          </div>
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
  created() {
    this.socket = client(process.env.BACKEND_URL);

    this.setupSocketEvents();
  },
  beforeDestroy() {
    this.socket.disconnect();
    this.$root.$off("prepare-message")
    this.socket = {};
  },
  destroyed() {
    this.$destroy();
  }
};
</script>
<style lang="scss">
.personalBorder{border-left-width: 2px; border-color: #0d7377}
</style>
