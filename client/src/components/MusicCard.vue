<script setup lang="ts">
import CollectionsService from '@/api/collections.service';
import MusicCatalogService from '@/api/musiccatalog.service';
import { MusicItem, Status, MusicType } from '@/models/models';
import { computed, ref, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';

type CardMode = 'browse' | 'admin';

const props = defineProps<{
  item: MusicItem;
  userId?: number;
  mode?: CardMode;
  collectionEntryId?: number;
  collectionState?: Status;
}>();

const userId = computed(() => props.userId ?? -1);
const album = computed(() => displayItem.value.album ?? '—');
const year  = computed(() => displayItem.value.year  ?? '—');
const genre = computed(() => displayItem.value.genre ?? '—');

const busy = ref(false);
const router = useRouter();
const isAdmin  = computed(() => props.mode === 'admin');

const localEntryId = ref<number | undefined>(props.collectionEntryId);
watch(() => props.collectionEntryId, v => { localEntryId.value = v ?? undefined; });
const localStatus = ref<Status>(props.collectionState ?? Status.NONE);
watch(() => props.collectionState, v => { if (v != null) localStatus.value = v; });
const displayItem = ref<MusicItem>({ ...props.item });
watch(
  () => props.item,
  (v) => { displayItem.value = { ...v }; },
  { deep: true }
);


const emit = defineEmits<{
  (e: 'added', payload: { entryId: number; status: Status; item: MusicItem }): void;
  (e: 'removed', payload: { entryId: number | null; itemId: number }): void;
  (e: 'status-changed', payload: { entryId: number; status: Status; item: MusicItem }): void;
  (e: 'admin-delete', payload: { item: MusicItem }): void;
}>();

const gradients = [
  'from-indigo-500 via-sky-500 to-emerald-500',
  'from-fuchsia-500 via-pink-500 to-rose-500',
  'from-amber-500 via-orange-500 to-rose-500',
  'from-cyan-500 via-blue-500 to-indigo-500',
];
const gradientClass = computed(() => `bg-gradient-to-br ${gradients[displayItem.value.id % gradients.length]}`);
const initials = computed(() => {
  const words = (displayItem.value.title || '').trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map(w => w[0]!.toUpperCase()).join('');
});

const hasEntry = computed(() => !!localEntryId.value);
const hasActiveStatus = computed(() => localStatus.value !== Status.NONE);

const showAdd = computed(() => !hasEntry.value && !hasActiveStatus.value);
const showRemove = computed(() => hasEntry.value || hasActiveStatus.value);

async function addToCollection() {
  if (busy.value || localEntryId.value) return;
  if (userId.value < 0) return alert('No user!');
  busy.value = true;
  try {
    const res = await CollectionsService.add({ userId: userId.value, musicId: props.item.id, status: Status.NONE });
    localEntryId.value = res.data.id;
    localStatus.value = Status.NONE;
    emit('added', { entryId: localEntryId.value, status: localStatus.value, item: displayItem.value });
  } catch (e: any) {
    alert(e?.message ?? 'Adding failed');
  } finally {
    busy.value = false;
  }
}

async function removeFromCollection() {
  if (busy.value) return;
  busy.value = true;
  try {
    if (localEntryId.value == null) return alert('Entry not found.');
    const prevId = localEntryId.value;
    await CollectionsService.remove(localEntryId.value);
    localEntryId.value = undefined;
    localStatus.value = Status.NONE;
    emit('removed', { entryId: prevId, itemId: displayItem.value.id });
  } catch (e: any) {
    alert(e?.message ?? 'Remove failed');
  } finally {
    busy.value = false;
  }
}

async function setStatus(next: Status) {
  if (busy.value) return;
  if (userId.value < 0) return alert('No user!');

  busy.value = true;
  try {
    if (!localEntryId.value) {
      // CASE 1: Create entry with desired status
      const res = await CollectionsService.add({
        userId: userId.value,
        musicId: props.item.id,
        status: next,
      });
      localEntryId.value = res.data.id;
      localStatus.value = next;
      emit('added', { entryId: localEntryId.value, status: localStatus.value, item: displayItem.value });
    } else {
      // CASE 2: Update existing entry
      await CollectionsService.updateEntry(localEntryId.value, { status: next });
      localStatus.value = next;      
      emit('status-changed', { entryId: localEntryId.value, status: localStatus.value, item: displayItem.value });
    }
  } catch (e: any) {
    alert(e?.message ?? 'Update failed');
  } finally {
    busy.value = false;
  }
}

function like()      { return setStatus(Status.LIKE); }
function dislike()   { return setStatus(Status.DISLIKE); }
function favourite() { return setStatus(Status.FAVOURITE); }

function goToDetail() {
  router.push({ name: 'music-detail', params: { id: displayItem.value.id } });
}
function statusBtn(active: boolean) {
  return [
    'px-2.5 py-1 rounded-lg border text-xs font-medium transition',
    active ? 'border-white/10 text-white bg-white/10'
           : 'border-white/20 text-white hover:bg-white/10',
  ].join(' ');
}

function adminDelete() {
  if (busy.value || localEntryId.value) return;
  if (userId.value < 0) return;
  busy.value = true;

  try {
    MusicCatalogService.remove(displayItem.value.id.toString());
    emit('admin-delete', { item: displayItem.value });
  } catch (e: any) {
    alert(e?.message ?? 'Deleting failed');
  } finally {
    busy.value = false;
  }
}

const isEditing = ref(false);
const editForm = reactive({
  title:  displayItem.value.title ?? '',
  artist: displayItem.value.artist ?? '',
  album:  displayItem.value.album ?? '',
  year:   displayItem.value.year ?? (undefined as number | undefined),
  genre:  displayItem.value.genre ?? '',
  type:   displayItem.value.type, 
});
watch(isEditing, (v) => {
  if (v) {
    editForm.title  = displayItem.value.title ?? '';
    editForm.artist = displayItem.value.artist ?? '';
    editForm.album  = displayItem.value.album ?? '';
    editForm.year   = displayItem.value.year ?? undefined;
    editForm.genre  = displayItem.value.genre ?? '';
    editForm.type   = displayItem.value.type;
  }
});

function startEdit() {
  if (busy.value) return;
  isEditing.value = true;
}
function cancelEdit() {
  if (busy.value) return;
  isEditing.value = false;
}
function normalizeYear(e: Event) {
  const v = Number((e.target as HTMLInputElement).value);
  editForm.year = Number.isFinite(v) ? v : undefined;
}
async function saveEdit() {
  if (busy.value) return;
  const payload = {
    title:  editForm.title.trim(),
    artist: editForm.artist.trim(),
    album:  editForm.album.trim() || undefined,
    year:   typeof editForm.year === 'number' ? editForm.year : undefined,
    genre:  editForm.genre.trim() || undefined,
    type:   editForm.type,
  };
  if (!payload.title || !payload.artist) return;

  busy.value = true;
  try {
    const res = await MusicCatalogService.update(displayItem.value.id.toString(), payload);
    const updated = res.data as MusicItem;

    displayItem.value = { ...updated };
    isEditing.value = false;
  } catch (e: any) {
    alert(e?.response?.data?.message ?? e?.message ?? 'Update failed');
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <article class="group overflow-hidden rounded-2xl bg-black/15 transition-all hover:-translate-y-0.5 hover:shadow-lg">
    <!-- Header -->
    <div :class="['h-28 sm:h-16 w-full flex items-center justify-between p-4 text-white', gradientClass]" style="cursor: pointer;" @click="goToDetail">
      <div class="text-3xl font-bold tracking-tight select-none">{{ initials }}</div>
      <span class="inline-flex items-center rounded-full bg-white/20 backdrop-blur px-2 py-0.5 text-xs font-semibold">
        {{ displayItem.type }}
      </span>
    </div>

    <!-- Body -->
    <div class="p-4">
      <h3 class="text-lg font-semibold text-white truncate" :title="item.title">{{ displayItem.title }}</h3>
      <p class="mt-0.5 text-sm text-white/80 truncate" :title="item.artist">{{ displayItem.artist }}</p>

      <dl class="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-white">
        <div><dt class="text-white/60">Album</dt><dd class="truncate" :title="album">{{ album }}</dd></div>
        <div><dt class="text-white/60">Year</dt><dd>{{ year }}</dd></div>
        <div><dt class="text-white/60">Genre</dt><dd class="truncate" :title="genre">{{ genre }}</dd></div>
        <div><dt class="text-white/60">ID</dt><dd>#{{ displayItem.id }}</dd></div>
      </dl>

      <!-- Actions -->
      <div v-if="!isAdmin" class="mt-4">
        <div class="flex flex-wrap items-center gap-2">
          <button :disabled="busy" :class="statusBtn(localStatus === Status.LIKE)"      @click="like()">👍 Like</button>
          <button :disabled="busy" :class="statusBtn(localStatus === Status.DISLIKE)"   @click="dislike()">👎 Dislike</button>
          <button :disabled="busy" :class="statusBtn(localStatus === Status.FAVOURITE)" @click="favourite()">★ Favourite</button>

          <span class="mx-1 h-5 w-px bg-white/20"></span>

          <button
            v-if="showAdd"
            :disabled="busy"
            class="px-2.5 py-1 rounded-lg border text-xs font-medium transition border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
            @click="addToCollection"
            aria-label="Add to my collection"
          >
            Add
          </button>

          <button
            v-if="showRemove"
            :disabled="busy"
            class="px-2.5 py-1 rounded-lg border text-xs font-medium transition border-red-400 text-red-400 hover:bg-red-500/10 disabled:opacity-50"
            @click="removeFromCollection"
            aria-label="Remove from my collection"
          >
            Remove
          </button>
        </div>
      </div>

      <div v-else-if="isAdmin" class="mt-4">
        <div class="flex gap-2">
          <button
            class="px-2.5 py-1 rounded-lg border text-xs font-medium transition border-red-400 text-red-400 hover:bg-red-500/10"
            :disabled="busy"
            @click="adminDelete"
          >
            Delete
          </button>
                    <button
            class="px-2.5 py-1 rounded-lg border text-xs font-medium transition border-white/20 text-white hover:bg-white/10"
            :disabled="busy"
            @click.stop="startEdit"
          >
            Edit
          </button>
        </div>
          <div v-if="isEditing" class="mt-3 rounded-lg border border-white/10 bg-white/5 p-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-white/60 mb-1">Title</label>
                <input
                  v-model="editForm.title"
                  type="text"
                  class="w-full bg-transparent border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div>
                <label class="block text-xs text-white/60 mb-1">Artist</label>
                <input
                  v-model="editForm.artist"
                  type="text"
                  class="w-full bg-transparent border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div>
                <label class="block text-xs text-white/60 mb-1">Album</label>
                <input
                  v-model="editForm.album"
                  type="text"
                  class="w-full bg-transparent border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div>
                <label class="block text-xs text-white/60 mb-1">Year</label>
                <input
                  :value="editForm.year ?? ''"
                  @input="normalizeYear"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  class="w-full bg-transparent border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div>
                <label class="block text-xs text-white/60 mb-1">Genre</label>
                <input
                  v-model="editForm.genre"
                  type="text"
                  class="w-full bg-transparent border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div>
                <label class="block text-xs text-white/60 mb-1">Type</label>
                <select
                  v-model="editForm.type"
                  class="w-full bg-transparent border border-white/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <option class="bg-black green" v-for="t in MusicType" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>
            </div>

            <div class="mt-3 flex items-center justify-end gap-2">
              <button
                class="px-3 py-1.5 rounded-lg border border-white/20 text-white/80 hover:bg-white/10"
                :disabled="busy"
                @click="cancelEdit"
              >
                Cancel
              </button>
              <button
                class="px-3 py-1.5 rounded-lg border border-white/30 text-white hover:bg-white/10 disabled:opacity-50"
                :disabled="busy || !editForm.title.trim() || !editForm.artist.trim()"
                @click="saveEdit"
              >
                {{ busy ? 'Saving…' : 'Save' }}
              </button>
            </div>
          </div>
      </div>

    </div>
  </article>
</template>
