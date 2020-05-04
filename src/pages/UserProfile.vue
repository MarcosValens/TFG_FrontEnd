<template class="flex flex-center">
  <q-page>
    <div class="q-pa-md">
      <q-breadcrumbs class="text-grey">
        <template v-slot:separator>
          <q-icon size="1.5em" name="chevron_right" color="primary"/>
        </template>
        <q-breadcrumbs-el label="Home" icon="home" to="main"/>
        <q-breadcrumbs-el label="User Profile" icon="face"/>
      </q-breadcrumbs>
    </div>
    <user-form/>
  </q-page>
</template>

<script>
  import UserForm from "./../components/UserProfile/UserForm";

  export default {
    name: "UserProfile",
    components: {"user-form": UserForm},
  };
</script>
