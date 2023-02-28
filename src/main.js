import { createApp } from "vue";
import App from "./App.vue";
import svgIcon from "./components/Icon.vue";
import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import zhTW from "./locales/zh-TW.json";
import AOS from "aos";
import "aos/dist/aos.css";
import { VueDapp } from "vue-dapp";
import VueLoading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import Notifications from "@kyvg/vue3-notification";

const app = createApp(App);

let defaultLocale = "zh-TW";
if (navigator.languages !== undefined && navigator.languages[0]) {
  defaultLocale = navigator.languages[0];
}
export const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: "zh-TW",
  messages: {
    "zh-TW": zhTW,
    en,
  },
});
app.use(i18n);

app.AOS = new AOS.init();
app.use(AOS);

app.use(Notifications);
app.use(VueLoading);
app.use(VueDapp);

app.component("svg-icon", svgIcon).mount("#app");
