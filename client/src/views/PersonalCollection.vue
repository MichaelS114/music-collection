<script setup lang="ts">
import CollectionsService from '@/api/collections.service';
import { UserMusicCollection, MusicItem, Status } from '@/models/models';
import MusicCard from '@/components/MusicCard.vue';
import { onMounted, ref, computed } from 'vue';

const userId = ref<number>(3);

const loading = ref(false);
const error = ref<string | null>(null);
const rows = ref<UserMusicCollection[]>([]);

async function load() {
  if (userId.value == null) return;
  loading.value = true; 
  error.value = null;
  try {
    const res = await CollectionsService.getForUser(userId.value);
    rows.value = res.data ?? [];
  } catch (e: any) {
    error.value = e?.message ?? 'Loading failed!';
    rows.value = [];
  } finally {
    loading.value = false;
  }
}
onMounted(load);

const groups = computed(() => {
  return rows.value.reduce<Record<Status, UserMusicCollection[]>>((acc, r) => {
    const k = (r.status ?? Status.NONE) as Status;
    (acc[k] ||= []).push(r);
    return acc;
  }, { [Status.FAVOURITE]: [], [Status.LIKE]: [], [Status.DISLIKE]: [], [Status.NONE]: [] } as any);
});

const ordered = [
  { key: Status.FAVOURITE, label: 'Favourites' },
  { key: Status.LIKE,      label: 'Likes' },
  { key: Status.DISLIKE,   label: 'Dislikes' },
  { key: Status.NONE,      label: 'Following' },
];

const isEmpty = computed(() =>
  !groups.value[Status.FAVOURITE].length &&
  !groups.value[Status.LIKE].length &&
  !groups.value[Status.DISLIKE].length &&
  !groups.value[Status.NONE].length
);

function onAdded(p: { entryId: number; status: Status; item: MusicItem }) {
  const i = rows.value.findIndex(x => x.id === p.entryId);
  if (i >= 0) {
    rows.value[i].status = p.status;
    (rows.value[i] as any).music = p.item;
    return;
  }
  rows.value.unshift({
    id: p.entryId,
    musicId: p.item.id,
    status: p.status,
    music: p.item,
  } as any);
}

function onRemoved(p: { entryId: number | null; itemId: number }) {
  rows.value = rows.value.filter(x => x.id !== p.entryId);
}

function onStatusChanged(p: { entryId: number; status: Status; item: MusicItem }) {
  const i = rows.value.findIndex(x => x.id === p.entryId);
  if (i >= 0) {
    rows.value[i].status = p.status;
    (rows.value[i] as any).music = p.item;
  }
}
</script>

<template>
  <section class="flex flex-col gap-4">
    <header class="mb-6">
      <h1 class="text-2xl font-bold">My Collection</h1>
      <p v-if="loading" class="text-white/60 text-sm mt-1">Loading...</p>
      <p v-if="error" class="text-red-300 text-sm mt-1">{{ error }}</p>
    </header>

    <div v-if="!loading" class="space-y-10">
      <template v-for="sec in ordered" :key="sec.key">
        <div v-if="groups[sec.key] && groups[sec.key].length">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-lg font-semibold">{{ sec.label }}</h2>
            <span class="text-sm text-white/60">{{ groups[sec.key].length }} Entries</span>
          </div>

          <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <li v-for="c in groups[sec.key]" :key="c.id">
              <MusicCard
                :item="c.music"
                :userId="userId"
                mode="browse"
                :collectionEntryId="c.id"
                :collectionState="c.status"
                @added="onAdded"
                @removed="onRemoved"
                @status-changed="onStatusChanged"
              />
            </li>
          </ul>
        </div>
      </template>

      <div
        v-if="isEmpty"
        class="text-white/60 text-l rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6"
      >
        You haven't added any music to your collection yet. Browse the catalog and add some!
      </div>
      
    </div>
  </section>
</template>