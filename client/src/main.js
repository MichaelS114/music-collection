import './assets/main.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from "vue-router";
import App from './App.vue'

import DiscoverPage from "./views/MusicDiscover.vue";
import DetailPage from "./views/MusicDetail.vue";
import AdminPage from "./views/AdminCollection.vue";
import CollectionPage from "./views/PersonalCollection.vue";

const routes = [
  { path: "/", redirect: "/collection" },
  { path: "/discover", name: "discover", component: DiscoverPage },
  { path: "/collection", name: "collection", component: CollectionPage },
  { path: "/music/:id", name: "music-detail", component: DetailPage, props: true },
  { path: "/admin", name: "admin", component: AdminPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAdmin) {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || user.role !== "ADMIN") return next({ name: "discover" });
  }
  next();
});

createApp(App).use(router).mount("#app");
