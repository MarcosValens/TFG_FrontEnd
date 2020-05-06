<template>
  <q-item
    clickable
    tag="a"
    target="_blank"
    @click="redirect"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon"/>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
  import requests from './../utils/requests';
  import getters from './../utils/getters';
  const userGetter = getters.user;
  export default {
    name: 'EssentialLink',
    props: {
      title: {
        type: String,
        required: true
      },

      to: {
        type: String,
        default: '#'
      },

      icon: {
        type: String,
        default: '#'
      }
    },
    methods: {
      async redirect() {
        if (this.to === "login") {
          await requests.get.call(this, userGetter.logout())
        }
        this.$router.push(`${this.to}`)
      }
    }
  }
</script>
