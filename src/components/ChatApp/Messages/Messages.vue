<template>
  <div>
    <div class="row">
      <q-toolbar class="text-center col">
        <q-toolbar-title>Messages</q-toolbar-title>
      </q-toolbar>
    </div>
    <q-separator></q-separator>
    <div class="row">
      <div style="width: 100%; max-width: 100vw">
        <q-scroll-area
          class="q-ma-sm messages"
          :thumb-style="thumbStyle"
          :bar-style="barStyle"
          style="height: 50vh; max-width: 100vw; "
          ref="messages"
          @scroll="handleScroll"
        >
          <q-chat-message
            class="q-px-lg q-pt-sm"
            v-for="(message, index) in messages"
            :key="index"
            :name="message.self ? 'Me' : `${message.sender.name} ${message.sender.surname}`"
            :avatar="message.userImage"
            :text="[message.text]"
            :sent="message.self"
            text-color="white"
            :stamp="message.sentAtHolder"
            :bg-color="message.self ? 'blue-grey-6' : 'blue-grey-8'"
            text-sanitize
            name-sanitize
          />
          <q-scroll-observer @scroll="checkDirection($event)"></q-scroll-observer>
        </q-scroll-area>
        <q-separator />
        <div class="row chat-actions full-width">
          <options />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import getters from "./../../../utils/getters";
import Options from "./../Options/Options";
const userGetter = getters.user;

export default {
  name: "Messages",
  components: { options: Options },
  data() {
    return {
      messages: [],
      shouldScroll: true,
      updateMessageInterval: 0,
      thumbStyle: {
        right: "10px",
        borderRadius: "10px",
        backgroundColor: "#5c5a5c",
        width: "5px",
        opacity: 0
      },

      barStyle: {
        right: "2px",
        borderRadius: "9px",

        width: "9px",
        opacity: 0.2
      }
    };
  },
  computed: {
    ...mapGetters("global", ["user"])
  },
  methods: {
    handleScroll(scroll) {
      if (this.shouldScroll) {
        scroll.ref.setScrollPosition(scroll.verticalSize);
      }
    },
    checkDirection(scrollInfo) {
      this.shouldScroll = scrollInfo.direction === "down";
    }
  },
  created() {
    this.updateMessageInterval = setInterval(() => {
      this.messages.map(message => {
        message.sentAtHolder = moment(message.sentAt).fromNow(false);
        return message;
      }, 1000);
    }, 1000);
    this.$root.$on("new-message", message => {
      if (message.sender._id === this.user._id) {
        message.self = true;
      }
      message.sentAtHolder = moment(message.sentAt).fromNow(false);
      message.userImage = userGetter.image(message.sender._id);
      this.messages.push(message);
    });
  },
  beforeDestroy() {
    this.$root.$off("new-message");
    clearInterval(this.updateMessageInterval);
  }
};
</script>
