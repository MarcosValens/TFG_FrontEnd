<template>
  <div class="items-center col-9 text-center">
    <q-btn
      rounded
      size="1.2rem"
      label="Open your local client to start scanning"
      @click="open"
      color="primary"
    />
  </div>
</template>

<script>
import customProtocolCheck from "custom-protocol-check";
export default {
  name: "DisplayButton",
  data() {
    return {
      timeout: null
    };
  },

  methods: {
    async open() {
      window.hasFocus = true;
      customProtocolCheck(`portscanner://${localStorage.getItem("token")}`, () => this.$router.push("/installers"));
      //window.location = ;
      this.timeout = setTimeout(() => {
        if (window.hasFocus) {
          ;
        }
      }, 100);
      window.addEventListener("pagehide", this.preventPopup);
    }
  }
};
</script>

<style>
</style>