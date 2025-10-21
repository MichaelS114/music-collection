<script setup>
import Logo from './assets/logo-museek.png';
</script>

<template>
  <div class="p-4 min-h-screen">
    <nav class="nav-bar">
      <img :src="Logo" alt="Logo" class="h-8" />
      <h1 class="green font-bold text-2xl uppercase">Museek</h1>
      <RouterLink to="/discover">Discover</RouterLink>
      <RouterLink to="/collection">My Collection</RouterLink>
      <RouterLink to="/admin">Admin</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>


<style scoped>
  .nav-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }
</style>