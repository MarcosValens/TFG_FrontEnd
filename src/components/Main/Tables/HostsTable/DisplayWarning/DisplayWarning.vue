<template>
  <div class="col-9 text-center items-center">
    <q-icon name="warning" class="text-warning" size="20vw"></q-icon>
    <h4>{{message}}</h4>
  </div>
</template>

<script>
  export default {
    name: "DisplayWarning",
    props: {
      message: {
        type: String
      }
    }
  }
</script>

<style scoped>

</style>
