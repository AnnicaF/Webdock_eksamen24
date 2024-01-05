import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faUserSecret,
  faComment,
  faCaretUp,
  faCaretDown,
  faTrashCan,
  faCodeMerge,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.css";
import "./assets/app-layout.css";
import router from "./router";
import store from "./store/store";

library.add(faUserSecret);
library.add(faComment);
library.add(faCaretUp);
library.add(faCaretDown);
library.add(faTrashCan);
library.add(faCodeMerge);
library.add(faEye);

const app = createApp(App);

app.use(router);
app.use(store);

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  next();
});

app.component("font-awesome-icon", FontAwesomeIcon).mount("#app");
