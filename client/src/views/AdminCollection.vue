<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import MusicCard from '@/components/MusicCard.vue';
import ApiService, { authState } from '@/api/apiservice'; // Import authState
import { MusicType, type MusicItem } from '@/models/models';

const loading = ref(false);
const error = ref<string | null>(null);
const items = ref<MusicItem[]>([]);

const userId = computed(() => authState.user?.id || 0);

async function fetchAllMusic() {
  loading.value = true;
  error.value = null;
  try {
    const res = await ApiService.get('/music');
    items.value = res.data;
  } catch (e: any) {
    error.value = e?.message ?? 'Loading failed';
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await fetchAllMusic();
});

const creating = ref(false);

const createForm = reactive({
  title: '',
  artist: '',
  album: '',
  year: undefined as number | undefined,
  genre: '',
  type: 'TRACK', // Default string to match Enum
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
    const payload = {
      title: createForm.title.trim(),
      artist: createForm.artist.trim(),
      album: createForm.album?.trim() || undefined,
      year: typeof createForm.year === 'number' ? createForm.year : undefined,
      genre: createForm.genre?.trim() || undefined,
      type: createForm.type,
      creatorId: userId.value, // Use dynamic ID
    };

    // Use ApiService
    const res = await ApiService.post('/music', '', payload);
    
    // Add new item to the top of the list
    items.value.unshift(res.data);

    // Reset Form
    createForm.title = '';
    createForm.artist = '';
    createForm.album = '';
    createForm.year = undefined;
    createForm.genre = '';
    createForm.type = 'TRACK';
  } catch (e: any) {
    alert(e?.message ?? 'Creating failed.');
  } finally {
    creating.value = false;
  }
}

// Implement  Delete Logic
async function handleDelete(item: MusicItem) {
  if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;

  try {
    await ApiService.delete(`/music/${item.id}`);
    // Remove from UI only after success
    items.value = items.value.filter(x => x.id !== item.id);
  } catch (e) {
    alert("Failed to delete item.");
  }
}

function normalizeYear(e: Event) {
  const v = Number((e.target as HTMLInputElement).value);
  if (Number.isFinite(v)) createForm.year = v;
  else createForm.year = undefined;
}
</script>

<template>
  <section class="max-w-6xl mx-auto p-4 flex flex-col gap-8">
    
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p class="text-gray-500">Manage the global music catalog</p>
      </div>
      <div v-if="loading" class="text-green-600 font-medium">Loading data...</div>
    </header>

    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      {{ error }}
    </div>

    <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 class="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Add New Music</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        
        <div class="form-group">
          <label>Title</label>
          <input v-model="createForm.title" type="text" placeholder="Song title" class="input-field" />
        </div>

        <div class="form-group">
          <label>Artist</label>
          <input v-model="createForm.artist" type="text" placeholder="Artist name" class="input-field" />
        </div>

        <div class="form-group">
          <label>Album</label>
          <input v-model="createForm.album" type="text" placeholder="Album name" class="input-field" />
        </div>

        <div class="form-group">
          <label>Year</label>
          <input 
            :value="createForm.year ?? ''" 
            @input="normalizeYear" 
            type="number" 
            placeholder="2025" 
            class="input-field" 
          />
        </div>

        <div class="form-group">
          <label>Genre</label>
          <input v-model="createForm.genre" type="text" placeholder="Pop, Rock..." class="input-field" />
        </div>

        <div class="form-group">
          <label>Type</label>
          <select v-model="createForm.type" class="input-field bg-white">
            <option value="TRACK">TRACK</option>
            <option value="ALBUM">ALBUM</option>
          </select>
        </div>
      </div>

      <div class="flex justify-end">
        <button
          class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!canSubmit"
          @click="submitCreate"
        >
          {{ creating ? 'Saving...' : '+ Create Item' }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <MusicCard
        v-for="m in items"
        :key="m.id"
        :item="m"
        mode="admin"
        :user-id="userId"
        class="w-full"    
        @admin-delete="handleDelete(m)"
      />
    </div>

  </section>
</template>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-group label {
  font-size: 0.875rem; /* text-sm */
  font-weight: 600;
  color: #4b5563; /* text-gray-600 */
}

.input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db; /* border-gray-300 */
  background-color: #ffffff;
  transition: all 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #16a34a; /* green-600 */
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}
</style>