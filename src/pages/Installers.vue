<template>
  <div class="row">
    <span class="title q-pa-md" @click="redirect()">PorT ScanneR</span>
    <div class="row col-12 justify-center items-center q-mt-lg q-pa-lg q-gutter-lg">
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
        <q-card>
          <q-card-section class="black text-white">
            <div class="text-h6 text-center">Download PortScanner for {{platform.name}}</div>
          </q-card-section>
          <q-card-actions class="black q-gutter-lg" align="center">
            <q-btn class="bg-orange-7 col-7 " flat @click="download(selectedLink)">Download</q-btn>
            <q-select
              label="Installer package"
              transition-show="flip-up"
              transition-hide="flip-down"
              filled
              v-model="selectedLink"
              :options="platform.links"
              style="width: 250px"
            />
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
            style="opacity: 0;"
            :class="currentPlatform.name === otherPlatform.name ? `${animate} ${currentPlatform.btnColor}` : ''"
            align="center"
            @click="download(otherPlatform.defaultLink)"
          >
            <q-btn flat @click.stop="download(otherPlatform.defaultLink)">Download</q-btn>
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
      platform: {},
      electron: isElectron(),
      currentPlatform: {},
      selectedLink: "",
      otherPlatforms: [
        {
          defaultLink: "https://github.com/rochismo/port-scanner/releases/download/v1.1.0-rc/Port-Scanner-Setup-1.1.0-rc.exe",
          placeholder: "Windows",
          name: "Windows",
          img: "./statics/windowsLogo.png",
          bgColor: "",
          btnColor: "bg-grey-14",
          links: [
            {
              label: "Nsis",
              value: "https://github.com/rochismo/port-scanner/releases/download/v1.1.0-rc/Port-Scanner-Setup-1.1.0-rc.exe",
            }
          ]
        },
        {
          placeholder: "Linux",
          name: "Linux",
          img: "./statics/tuxLogo.webp",
          bgColor: "bg-yellow-14",
          defaultLink: "https://github.com/rochismo/port-scanner/releases/download/v1.1.0-rc/portscanner_1.1.0-rc_amd64.deb",
          btnColor: "bg-yellow-10",
          links: [
            {
              label: "Debian package",
              value: "https://github.com/rochismo/port-scanner/releases/download/v1.1.0-rc/portscanner_1.1.0-rc_amd64.deb",
            },
            {
              label: "AppImage (not recommended)",
              value: "https://github.com/rochismo/port-scanner/releases/download/v1.1.0-rc/Port-Scanner-1.1.0-rc.AppImage"
            }
          ]
        },
        {
          placeholder: "Macintosh",
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
    const platform = navigator.userAgent.match(/windows|linux|macintosh/gi)[0];
    const currentPlatform = this.otherPlatforms.find(({placeholder}) => placeholder.toLowerCase().includes(platform.toLowerCase()))
    this.platform = currentPlatform;
    if (this.isElectron) {
      this.$router.back();
    }
  },
  methods: {
    redirect() {
      this.$router.back();
    },
    download(data) {
      let link = data.value;
      if (!data.value) link = this.platform.defaultLink;
      const a = document.createElement("a");
      a.href = link;
      a.target = "_blank";
      a.click();
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
