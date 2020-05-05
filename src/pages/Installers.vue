<template>
  <div class="row">
    <span class="title q-pa-md" @click="redirect()">PorT ScanneR</span>
    <div class="row col-12 justify-center items-center q-mt-lg q-pa-lg q-gutter-lg">
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
        <q-card>
          <q-card-section class="black text-white">
            <div class="text-h6 text-center">Download PortScanner for {{platform}}</div>
          </q-card-section>
          <q-card-actions class="black" align="center">
            <q-btn class="bg-orange-7 col-6" flat>Download</q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <q-img :src="appPicture" spinner-color="white" class="col-xs-12 col-sm-12 col-md-4 col-lg-4" />
    </div>

    <div class="row col-12 justify-center items-center q-mt-lg q-pa-lg q-gutter-lg">
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3" v-for="(otherPlatform, index) in otherPlatforms" :key="index">
        <q-card :class="otherPlatform.bgColor" @mouseover="currentPlatform = otherPlatform">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6 text-center">Download PortScanner for {{otherPlatform.name}}</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="text-center">
            <q-img
              :src="otherPlatform.img"
              spinner-color="primary"
              style="height: 200px; width: 200px"
            />
          </q-card-section>

          <q-card-actions
            style="opacity: 0"
            :class="currentPlatform.name === otherPlatform.name ? `${animate} ${currentPlatform.btnColor}` : ''"
            align="center"
          >
            <q-btn flat>Download</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import isElectron from "is-electron";
export default {
  name: "Installers",
  data() {
    return {
      animate: "text-white animate-flicker",
      appPicture: "../statics/appwin.png",
      platform: "",
      electron: isElectron(),
      currentPlatform: {},
      otherPlatforms: [
        {
          name: "Windows",
          img: "./statics/windowsLogo.png",
          bgColor: "",
          link: "",
          btnColor: "bg-grey-14"
        },
        {
          name: "Linux",
          img: "./statics/tuxLogo.webp",
          bgColor: "bg-yellow-14",
          link: "",
          btnColor: "bg-yellow-10"
        },
        {
          name: "Mac",
          img: "./statics/macLogo.png",
          bgColor: "bg-grey",
          link: "",
          btnColor: "bg-grey-8"
        }
      ]
    };
  },
  mounted() {
    this.platform = navigator.userAgent.match(/windows|linux|macintosh/gi)[0];
    if (this.isElectron) {
      this.$router.back();
    }
  },
  methods: {
    redirect() {
      this.$router.back();
    }
  }
};
</script>

<style>
@keyframes flickerAnimation {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@-o-keyframes flickerAnimation {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@-moz-keyframes flickerAnimation {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@-webkit-keyframes flickerAnimation {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-flicker {
  -webkit-animation: flickerAnimation 1s;
  -moz-animation: flickerAnimation 1s;
  -o-animation: flickerAnimation 1s;
  animation: flickerAnimation 1s;
  animation-fill-mode: forwards;
}

.black {
  background-color: #121212;
}

.title {
  font-family: networkFont, sans-serif;
  font-size: 5vh;
}
</style>
