<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import MusicCard from '@/components/MusicCard.vue';
import { MusicCatalogService } from '@/api/musiccatalog.service';
import { MusicItem, MusicType, CreateMusicItemDto } from '@/models/models';

const loading = ref(false);
const error = ref<string | null>(null);
const items = ref<MusicItem[]>([]);
const userId = ref<number>(4);

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

onMounted(async () => {
  await Promise.all([fetchAllMusic()]);
});

const creating = ref(false);

const createForm = reactive<CreateMusicItemDto>({
  title: '',
  artist: '',
  album: '',
  year: undefined,
  genre: '',
  type: MusicType.TRACK,
  creatorId: userId.value,
});

const canSubmit = computed(() =>
  !!createForm.title.trim() &&
  !!createForm.artist.trim() &&
  !!createForm.type &&
  !creating.value
);

async function submitCreate() {
  if (!canSubmit.value) return;

  creating.value = true;
  try {
    const payload: CreateMusicItemDto = {
      title: createForm.title.trim(),
      artist: createForm.artist.trim(),
      album: createForm.album?.trim() || undefined,
      year: typeof createForm.year === 'number' ? createForm.year : undefined,
      genre: createForm.genre?.trim() || undefined,
      type: createForm.type,
      creatorId: userId.value,
    };

    const res = await MusicCatalogService.create(payload);
    items.value.unshift(res.data);

    createForm.title = '';
    createForm.artist = '';
    createForm.album = '';
    createForm.year = undefined;
    createForm.genre = '';
    createForm.type = MusicType.TRACK;
  } catch (e: any) {
    alert(e?.message ?? 'Creating failed.');
  } finally {
    creating.value = false;
  }
}

function normalizeYear(e: Event) {
  const v = Number((e.target as HTMLInputElement).value);
  if (Number.isFinite(v)) createForm.year = v;
  else createForm.year = undefined;
}

</script>

<template>
  <section class="flex flex-col gap-4">
    <header class="mb-6">
      <h1 class="text-2xl font-bold">Manage</h1>
      <p v-if="loading" class="text-white/60 text-sm mt-1">Loading...</p>
      <p v-if="error" class="text-red-300 text-sm mt-1">{{ error }}</p>
    </header>

    <div class="mb-2 rounded-xl bg-white/5 border border-white/10 p-4">
      <h2 class="text-lg font-semibold mb-3">Add New Music</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label class="block text-xs text-white/60 mb-1">Title</label>
          <input
            v-model="createForm.title"
            type="text"
            placeholder="Song title"
            class="w-full bg-transparent border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
        <div>
          <label class="block text-xs text-white/60 mb-1">Artist</label>
          <input
            v-model="createForm.artist"
            type="text"
            placeholder="Artist"
            class="w-full bg-transparent border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
        <div>
          <label class="block text-xs text-white/60 mb-1">Album</label>
          <input
            v-model="createForm.album"
            type="text"
            placeholder="Album"
            class="w-full bg-transparent border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
        <div>
          <label class="block text-xs text-white/60 mb-1">Year</label>
          <input
            :value="createForm.year ?? ''"
            @input="normalizeYear"
            inputmode="numeric"
            pattern="[0-9]*"
            placeholder="2020"
            class="w-full bg-transparent border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
        <div>
          <label class="block text-xs text-white/60 mb-1">Genre</label>
          <input
            v-model="createForm.genre"
            type="text"
            placeholder="Genre"
            class="w-full bg-transparent border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
        <div>
          <label class="block text-xs text-white/60 mb-1">Type</label>
          <select
            v-model="createForm.type"
            class="w-full bg-transparent border border-white/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option class="bg-black green" v-for="t in MusicType" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="px-3 py-1.5 rounded-lg border border-white/30 text-white hover:bg-white/10 disabled:opacity-50"
          :disabled="!canSubmit"
          @click="submitCreate"
        >
          {{ creating ? 'Creating…' : 'Create' }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <MusicCard
        v-for="m in items"
        :key="m.id"
        :item="m"
        :mode="'admin'"
        :user-id="userId"
        class="w-full"   
        @admin-delete="({ item }) => { items = items.filter(x => x.id !== item.id) }"
      />
    </div>
  </section>
</template>

