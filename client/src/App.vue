<script setup>
import ButtonTest from './components/ButtonTest.vue'
import Logo from './assets/icon.svg'

</script>

<template>
  <div>
    <img
      :src="Logo"
      alt="Music Logo"
      class="logo h-32 mb-4"
    />
    <p class="text-lg font-semibold text-gray-700">Thema 3</p>
     <div class="mt-8">
      <ButtonTest />
    </div>
  </div>

</template>

<style scoped>
/* .logo {
  filter: drop-shadow(0 0 0.5rem rgba(0, 0, 0, 0.2));
} */
</style>
