<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import MusicCard from '@/components/MusicCard.vue';
import { MusicCatalogService } from '@/api/musiccatalog.service';
import { CollectionsService } from '@/api/collections.service';
import type { MusicItem } from '@/models/models';

const loading = ref(false);
const error = ref<string | null>(null);
const items = ref<MusicItem[]>([]);
const handledIds = ref<Set<number>>(new Set());
const userId = ref<number>(3);


async function fetchAllMusic() {
  loading.value = true;
  error.value = null;
  try {
    const res = await MusicCatalogService.list();
    items.value = res.data;
  } catch (e: any) {
    error.value = e?.message ?? 'Loading failed';
  } finally {
    loading.value = false;
  }
}

async function fetchHandled() {
  try {
    const res = await CollectionsService.getForUser(userId.value);
    const rows = res.data ?? [];

    const set = new Set<number>();
    const map = new Map<number, number>();
    for (const r of rows) {
      set.add(r.musicId);
      map.set(r.musicId, r.id);
    }
    handledIds.value = set;
  } catch (e: any) {
    console.warn('Fetching collection failed:', e);
  }
}

const filteredItems = computed(() =>
  items.value.filter(m => !handledIds.value.has(m.id))
);

function onAdded(p: { item: MusicItem }) {
  handledIds.value.add(p.item.id);
}

onMounted(async () => {
  await Promise.all([fetchAllMusic(), fetchHandled()]);
});

</script>

<template>
  <section class="flex flex-col gap-4">
    <header class="mb-6">
      <h1 class="text-2xl font-bold">Discover</h1>
      <p v-if="loading" class="text-white/60 text-sm mt-1">Loading...</p>
      <p v-if="error" class="text-red-300 text-sm mt-1">{{ error }}</p>
    </header>

    <div
      v-if="!loading && !error && filteredItems.length === 0"
      class="text-white/60 text-l rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6"
    >
      Everything's checked! Check back later for new music.
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <MusicCard
        v-for="m in filteredItems"
        :key="m.id"
        :item="m"
        :mode="'browse'"
        :user-id="userId"
        class="w-full"  
        @added="onAdded"   
      />
    </div>
  </section>
</template>

