<template>
  <q-card>
    <q-card-section>
      <h3 class="code-line text-center" data-line-start="0" data-line-end="1">
        <!--<a id="User_agreement_0"></a> -->User agreement.
      </h3>
    </q-card-section>

    <q-separator />

    <q-card-section style="max-height: 50vh" class="scroll">
      <p class="has-line-data" data-line-start="1" data-line-end="3">
        In order to use this application and it’s features,
        <strong>you must read and accept the following conditions.</strong>
        <br />You can also skip this but once you click the accept button we are exempted out of responsibilities by any misuse of the application.
      </p>
      <h4 class="code-line" data-line-start="4" data-line-end="5">
        <a id="Terms_4"></a>Terms
      </h4>
      <ul>
        <li class="has-line-data" data-line-start="6" data-line-end="7">
          <strong>You must be authorized to perform any of the actions available in our scanner service</strong>, inside the network you’re in (not the one you created in our application).
        </li>
        <li class="has-line-data" data-line-start="7" data-line-end="8">
          <strong>If there’s any security breach within our application, you shall not exploit in for your own benefit.</strong> We log every action performed and we see what everyone does. Though we do not include sensitive information (such as passwords) inside the logs. If needed we will take legal measures.
        </li>
        <li class="has-line-data" data-line-start="8" data-line-end="9">
          <strong>Any misuse of this application exempts us from any responsibility.</strong> If you get caught doing things you should not be doing or you’re not allowed, it’s not our problem. The purpose of this application is to manage networks that you
          <strong>own</strong> or you’re
          <strong>authorized</strong> to perform certain actions in.
        </li>
      </ul>
    </q-card-section>

    <q-separator />

    <q-card-actions align="around">
      <q-btn label="Accept" color="positive" v-close-popup style="width: 15em" @click="agree"/>
      <q-btn label="Decline" color="negative" v-close-popup style="width: 15em" @click="decline" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex';
import requests from './../../../../utils/requests';
import getters from './../../../../utils/getters';

const userGetter = getters.user;

export default {
    name: "UserAgreementDialog",
    methods: {
        ...mapActions("global", ["changeAgreement"]),
        async agree() {
            this.changeAgreement();
            const acceptEndpoint = userGetter.agreement();
            await requests.get.call(this, acceptEndpoint);
        },
        decline() {
            this.$router.push("/login")
        }
    }
};
</script>