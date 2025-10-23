<script setup>
import Logo from './assets/logo-museek.png';
</script>

<template>
  <div class="p-4">
    <nav class="nav-bar mb-4">
      <div class="flex items-center gap-1">
        <img :src="Logo" alt="Logo" class="h-8" />
        <h1 class="green font-bold text-2xl uppercase">Museek</h1>
      </div>
      <RouterLink class="fancy-hover" to="/collection">My Collection</RouterLink>
      <RouterLink class="fancy-hover" to="/discover">Discover</RouterLink>
      <RouterLink class="fancy-hover" to="/admin">Admin</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>


<style scoped>
  .nav-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3rem;
  }

  .fancy-hover:hover {
    padding: 5px 10px;
    border-radius: 18px;
  }
</style>