<!-- src/components/MusicCard.vue -->
<script setup lang="ts">
import type { MusicItem } from '@/models/models';
import { computed } from 'vue';

type CardMode = 'browse' | 'my' | 'admin';

const props = defineProps<{
  item: MusicItem;
  mode?: CardMode;            
  collectionEntryId?: number;
}>();

const gradients = [
  'from-indigo-500 via-sky-500 to-emerald-500',
  'from-fuchsia-500 via-pink-500 to-rose-500',
  'from-amber-500 via-orange-500 to-rose-500',
  'from-cyan-500 via-blue-500 to-indigo-500',
];

const album = computed(() => props.item.album ?? '—');
const year  = computed(() => props.item.year  ?? '—');
const genre = computed(() => props.item.genre ?? '—');
const gradientClass = computed(
  () => `bg-gradient-to-br ${gradients[props.item.id % gradients.length]}`
);
const initials = computed(() => {
  const words = (props.item.title || '').trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map(w => w[0]!.toUpperCase()).join('');
});

</script>

<template>
  <article
    class="group overflow-hidden rounded-2xl bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-indigo-200">

    <div :class="['h-28 sm:h-16 w-full flex items-center justify-between p-4 text-white', gradientClass]">
      <div class="text-3xl font-bold tracking-tight select-none">
        {{ initials }}
      </div>
      <span class="inline-flex items-center rounded-full bg-white/20 backdrop-blur px-2 py-0.5 text-xs font-semibold">
        {{ item.type }}
      </span>
    </div>

    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-900 truncate" :title="item.title">
        {{ item.title }}
      </h3>
      <p class="mt-0.5 text-sm text-gray-600 truncate" :title="item.artist">
        {{ item.artist }}
      </p>

      <dl class="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <dt class="text-gray-500">Album</dt>
          <dd class="text-gray-900 truncate" :title="album">{{ album }}</dd>
        </div>
        <div>
          <dt class="text-gray-500">Year</dt>
          <dd class="text-gray-900">{{ year }}</dd>
        </div>
        <div>
          <dt class="text-gray-500">Genre</dt>
          <dd class="text-gray-900 truncate" :title="genre">{{ genre }}</dd>
        </div>
        <div>
          <dt class="text-gray-500">ID</dt>
          <dd class="text-gray-900">#{{ item.id }}</dd>
        </div>
      </dl>
    </div>
  </article>
</template>
