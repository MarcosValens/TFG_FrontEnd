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

      window.location = `portscanner://${localStorage.getItem("token")}`;
      this.timeout = setTimeout(() => {
        if (window.hasFocus) {
          this.$router.push("/installers");
        }
      }, 100);
      window.addEventListener("pagehide", this.preventPopup);
    }
  }
};
</script>

<style>
</style>