<script setup>
import { useRouter } from 'vue-router';
import Logo from './assets/logo-museek.png';
import ApiService, { authState } from './api/apiservice';

const router = useRouter();

function handleLogout() {
  ApiService.logout();
  router.push('/login');
}
</script>

<template>
  <div class="p-4">
    <nav class="nav-bar mb-4">
      <div class="flex items-center gap-1">
        <img :src="Logo" alt="Logo" class="h-8" />
        <h1 class="green font-bold text-2xl uppercase">Museek</h1>
      </div>

      <template v-if="authState.isAuthenticated">
        <RouterLink class="fancy-hover" to="/collection">My Collection</RouterLink>
        <RouterLink class="fancy-hover" to="/discover">Discover</RouterLink>
        
        <RouterLink 
          v-if="authState.user?.role === 'ADMIN'" 
          class="fancy-hover text-red-500 font-bold" 
          to="/admin"
        >
          Admin
        </RouterLink>
      </template>

      <div class="ml-auto flex gap-4">
        <button 
          v-if="authState.isAuthenticated" 
          @click="handleLogout" 
          class="fancy-hover font-bold text-gray-600"
        >
          Logout
        </button>
        
        <RouterLink 
          v-else 
          class="fancy-hover font-bold text-green-600" 
          to="/login"
        >
          Login
        </RouterLink>
      </div>
    </nav>
    
    <RouterView />
  </div>
</template>

<style scoped>
  .nav-bar {
    display: flex;
    align-items: center;
    gap: 2rem; 
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 1rem;
  }

  .fancy-hover {
    transition: all 0.2s;
    padding: 5px 10px;
  }

  .fancy-hover:hover {
    background-color: #f3f4f6; 
    border-radius: 8px;
  }
  
  /* Helper to push auth buttons to the right */
  .ml-auto {
    margin-left: auto;
  }
</style>