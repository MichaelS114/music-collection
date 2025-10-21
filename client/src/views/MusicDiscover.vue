<!-- src/views/MusicDiscover.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MusicCard from '@/components/MusicCard.vue';
import { MusicCatalogService } from '@/api/musiccatalog.service';
import type { MusicItem } from '@/models/models';

const loading = ref(false);
const error = ref<string | null>(null);
const items = ref<MusicItem[]>([]);

const entryByItemId = ref<Map<number, number>>(new Map());

async function fetchAllMusic() {
  loading.value = true;
  error.value = null;
  try {
    const res = await MusicCatalogService.list();
    items.value = res;
  } catch (e: any) {
    error.value = e?.message ?? 'Laden fehlgeschlagen';
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await Promise.all([fetchAllMusic()]);
});

</script>

<template>
  <section class="flex flex-col gap-4">
    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i" class="rounded-2xl border bg-white p-4 animate-pulse">
        <div class="aspect-[16/9] rounded-xl bg-gray-200 mb-3"></div>
        <div class="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        <div class="mt-4 h-8 bg-gray-200 rounded"></div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="rounded-lg border border-red-200 bg-red-50 text-red-800 px-3 py-2">
      {{ error }}
    </div>

    <!-- Empty -->
    <div v-else-if="items.length === 0" class="rounded-2xl border bg-white p-8 text-center text-gray-600">
      No music found!
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <MusicCard
        v-for="m in items"
        :key="m.id"
        :item="m"
        :mode="'browse'"
        class="w-full"     
      />
    </div>
  </section>
</template>

