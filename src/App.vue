<template>
  <Header />
  <Loading :progress="loadingProgress" />
  <notifications group="dapp" position="bottom right" duration="5" />
  <notifications
    group="moneyBag"
    position="top center"
    classes="vue-notification moneybag-notice"
    duration="5"
  />
  <main data-scroll-container>
    <Hero id="hero" :loading="isLoading"></Hero>
    <Card id="card"></Card>
  </main>
  <!-- <DevColumn/> -->
</template>
<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Header from "./components/header/index.vue";
import DevColumn from "./components/DevColumn.vue";
import Loading from "./components/Loading.vue";

import Hero from "./components/section/hero.vue";
import Card from "./components/section/card.vue";

import { onMounted, reactive, ref, watch, inject } from "@vue/runtime-core";
import { createApp, provide } from "vue";
import LocomotiveScroll from "locomotive-scroll";
import ImagesLoaded from "imagesloaded";
import viewport from "@/compositions/viewport";

const app = createApp();
viewport();

// ------ Blockchain global ref -------
// contract addr : mainnet
// const chainIdToUse = 137;
// const BFFAddress = "0x0cCDe8834f16035bb116cDC17aF024df508E5A6D";
// const marketplaceAddress = "";

// contract addr : testnet
const chainIdToUse = ref(80001);
const BFFAddress = ref("0xB80ae96b55379A82Fa9AABee850C6683D6157533");
const marketplaceAddress = ref("0xd0b62655d7095AF74868E2bAe7679Ab9a4e819d9");
const openseaURL = ref("https://testnets.opensea.io/assets/mumbai/");
provide("chainIdToUse", chainIdToUse);
provide("BFFAddress", BFFAddress);
provide("marketplaceAddress", marketplaceAddress);
provide("openseaURL", openseaURL);

// ------ Marketplace global ref -------
const marketplaceConfig = ref({ status: null, balance: 0 });
const selectedChainId = ref(0);
const isChainChanged = ref(false);
const switchError = ref(false);
const providerActivated = ref();
const signerActivated = ref();
provide("marketplaceConfig", marketplaceConfig);
provide("selectedChainId", selectedChainId);
provide("isChainChanged", isChainChanged);
provide("switchError", switchError);
provide("providerActivated", providerActivated);
provide("signerActivated", signerActivated);

let isLoading = ref(true);
const loadingProgress = ref(0);

const loadImage = () => {
  return new Promise((resolve) => {
    new ImagesLoaded("#app", (instance) => {
      resolve(instance);
    }).on("progress", (instance, image) => {
      loadingProgress.value = instance.progressedCount / instance.images.length;
    });
  });
};

watch(
  () => isLoading.value,
  (value) => {
    if (!value) {
      document.body.classList.add("loaded");
      setTimeout(() => {
        window.$scroll.update();
      }, 1);
    }
  }
);

onMounted(() => {
  loadImage().then(() => {
    isLoading.value = false;
  });
  window.$scroll = new LocomotiveScroll({
    el: document.querySelector("[data-scroll-container]"),
    smooth: true,
    getDirection: true,
    getSpeed: true,
    smartphone: {
      smooth: false,
      getDirection: true,
      getSpeed: true,
      multiplier: 2,
    },
    tablet: {
      smooth: false,
      getDirection: true,
      getSpeed: true,
    },
  });
  if (window.innerWidth > 768) {
    let observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("aos-animate");
        } else {
          entry.target.classList.remove("aos-animate");
        }
      });
    });
    document.querySelectorAll("[data-aos]").forEach((aosElem) => {
      observer.observe(aosElem);
    });
  }
});
</script>
<style lang="scss">
.-animation-text {
  overflow: hidden;

  span,
  svg {
    display: block;
    transform: translate3d(0, 100%, 0);
    transition: transform 1s cubic-bezier(0.76, 0, 0.24, 1);
  }
}
header {
  opacity: 0;
  transform: translate3d(0, -2rem, 0);
  transition: all 1s 0.3s cubic-bezier(0.76, 0, 0.24, 1);
}
body.loaded {
  .-animation-text {
    span,
    svg {
      transform: translate3d(0, 0, 0);
    }

    &:nth-child(2) {
      transition-delay: 0.1s;
    }
  }
}
</style>
