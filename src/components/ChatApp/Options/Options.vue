<template>
  <div class="col bg-accent">
    <q-form @submit="handleSubmit()">
      <q-input
        filled
        v-model="message.text"
        label="Enter a message"
        class="q-ma-md"
        maxlength="255"
        :error="hadError"
        error-message="Please wait 3 seconds before submitting a new message"
        @keypress.enter.stop="handleSubmit"
      >
        <template v-slot:after>
          <q-btn type="submit" dense flat icon="send" label="Send" />
        </template>
      </q-input>
    </q-form>
  </div>
</template>

<script>
export default {
  name: "Options",
  data() {
    return {
      message: {
        text: ""
      },
      canSend: true,
      hadError: false
    };
  },
  methods: {
    handleSubmit() {
      this.hadError = false;
      if (!this.canSend) {
        this.hadError = true;
        return;
      }
      if (!this.message.text.trim()) {
        return;
      }
      //this.canSend = false;
      this.message.sentAt = Date.now();
      const messageClone = JSON.parse(JSON.stringify(this.message))
      this.$root.$emit("prepare-message", messageClone);
      this.message.text = "";
      setTimeout(() => (this.canSend = true), 3000);
    }
  }
};
</script>