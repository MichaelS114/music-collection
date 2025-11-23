<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ApiService from '../api/apiservice'; // Check this path matches your structure

const router = useRouter();
const username = ref('');
const password = ref('');
const errorMsg = ref('');

async function handleLogin() {
  try {
    errorMsg.value = ''; // Clear previous errors
    
    // 1. Call the API Service
    await ApiService.login(username.value, password.value);
    
    // 2. Redirect on success
    router.push('/collection');
    
  } catch (e: any) {
    console.error(e);
    errorMsg.value = 'Login failed. Please check your credentials.';
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
      <h1 class="mb-6 text-center text-3xl font-bold text-gray-800">Museek Login</h1>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Username</label>
          <input 
            v-model="username" 
            type="text" 
            required
            class="w-full rounded-lg border border-gray-300 p-2.5 focus:border-green-500 focus:ring-green-500"
            placeholder="admin"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Password</label>
          <input 
            v-model="password" 
            type="password" 
            required
            class="w-full rounded-lg border border-gray-300 p-2.5 focus:border-green-500 focus:ring-green-500"
            placeholder="••••••••"
          />
        </div>

        <div v-if="errorMsg" class="text-sm text-red-600 text-center font-medium">
          {{ errorMsg }}
        </div>

        <button 
          type="submit"
          class="w-full rounded-lg bg-green-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          Sign In
        </button>
      </form>
      
      <p class="mt-4 text-center text-sm text-gray-500">
        Try <b>admin</b> / <b>12345678</b>
      </p>
    </div>
  </div>
</template>