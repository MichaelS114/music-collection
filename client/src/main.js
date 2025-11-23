import './assets/main.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from "vue-router";
import { authState } from './api/apiservice';
import App from './App.vue'

// Views
import LoginView from './views/LoginView.vue';
import DiscoverPage from "./views/MusicDiscover.vue";
import DetailPage from "./views/MusicDetail.vue";
import AdminPage from "./views/AdminCollection.vue";
import CollectionPage from "./views/PersonalCollection.vue";

const routes = [
  { path: '/login', name: 'login', component: LoginView },
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

// SECURITY GUARD 
router.beforeEach((to, _from, next) => {
  // If user is NOT authenticated AND trying to go somewhere other than login
  if (!authState.isAuthenticated && to.name !== 'login') {
    return next({ name: 'login' });
  }

  // If user is authenticated and tries to go to login, send them to collection
  if (authState.isAuthenticated && to.name === 'login') {
    return next({ name: 'collection' });
  }

  // If trying to access admin page but role is not ADMIN
  if (to.name === 'admin' && authState.user?.role !== 'ADMIN') {
    alert("Access Denied: You are not an Admin.");
    return next({ name: 'collection' });
  }

  // Allow navigation
  next();
});

createApp(App).use(router).mount("#app");