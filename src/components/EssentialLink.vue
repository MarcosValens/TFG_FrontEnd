<template>
  <q-item clickable tag="a" target="_blank" @click="redirect">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { mapGetters } from "vuex";
import requests from "./../utils/requests";
import getters from "./../utils/getters";
const userGetter = getters.user;
export default {
  name: "EssentialLink",
  props: {
    title: {
      type: String,
      required: true
    },

    to: {
      type: String,
      default: "#"
    },

    icon: {
      type: String,
      default: "#"
    }
  },
  computed: {
    ...mapGetters("global", ["user"])
  },
  methods: {
    async redirect() {
      console.log(this.user)
      if (this.to === "login" && this.user.strategy === "google") {
        await Promise.resolve(new Promise(resolve => {
          const script = document.createElement("script");
          script.src = "https://mail.google.com/mail/u/0/?logout&hl=en";
          document.body.appendChild(script);
          script.onload = function() {
            document.body.removeChild(script);
            resolve();
          }
          script.onerror = function() {
            document.body.removeChild(script);
            resolve();
          }
        }));
        
      }
      this.$router.push(`${this.to}`);
    }
  }
};
</script>
