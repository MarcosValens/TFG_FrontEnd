<template>
  <div>
    <div class="row">
      <q-toolbar class="text-center col">
        <q-toolbar-title>Messages</q-toolbar-title>
      </q-toolbar>
    </div>
    <q-separator></q-separator>
    <div class="row q-pa-md">
      <div style="width: 100%; max-width: 100vw">
        <q-scroll-area
          :thumb-style="thumbStyle"
          :bar-style="barStyle"
          style="height: 50vh; max-width: 100vw;"
        >
          <q-chat-message
            v-for="(message, index) in messages"
            :key="index"
            :name="message.self ? 'Me' : `${message.sender.name} ${message.sender.surname}`"
            :avatar="message.userImage"
            :text="[message.text]"
            :sent="message.self"
            text-color="white"
            :bg-color="message.self ? 'blue-grey-6' : 'blue-grey-8'"
          />
        </q-scroll-area>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import getters from "./../../../utils/getters";
const userGetter = getters.user;

export default {
  name: "Messages",
  data() {
    return {
      messages: [],
      thumbStyle: {
        right: "4px",
        borderRadius: "5px",
        backgroundColor: "#027be3",
        width: "5px",
        opacity: 0.75
      },

      barStyle: {
        right: "2px",
        borderRadius: "9px",
        backgroundColor: "#027be3",
        width: "9px",
        opacity: 0.2
      }
    };
  },
  computed: {
    ...mapGetters("global", ["user"])
  },
  created() {
    this.$root.$on("new-message", message => {
      if (message.sender._id === this.user._id) {
        message.self = true;
      }
      message.userImage = userGetter.image(message.sender._id);
      this.messages.push(message);
    });
  }
};
</script>