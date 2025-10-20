<script setup>
import { ref } from 'vue'

const count = ref(0)

</script>

<template>
   <button
        @click="count++"
        class="px-5 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all"
      >
        {{ count }} mal geklickt
      </button>
</template>
