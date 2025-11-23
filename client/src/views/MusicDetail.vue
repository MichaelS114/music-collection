<script setup lang="ts">
import { ReviewsService } from '@/api/reviews.service';
import { MusicCatalogService } from '@/api/musiccatalog.service';
import type { MusicItem, Review, CreateReviewDto } from '@/models/models';
import ReviewCard from '@/components/ReviewCard.vue';
import { onMounted, reactive, ref, watch, computed } from 'vue'; // Added computed
import { useRoute } from 'vue-router';
import { authState } from '@/api/apiservice'; 

// Get dynamic User ID from AuthState
const userId = computed(() => authState.user?.id || 0);

const route = useRoute();
const musicId = ref<number>(Number(route.params.id));

const loadingMusic = ref(false);
const music = ref<MusicItem | null>(null);

const loadingReviews = ref(false);
const reviews = ref<Review[]>([]);
const maxStars = 5;
const error = ref<string | null>(null);

watch(() => route.params.id, (v) => {
  musicId.value = Number(v);
  loadAll();
});

onMounted(loadAll);

async function loadMusic() {
  loadingMusic.value = true;
  try {
    const res = await MusicCatalogService.getById(musicId.value.toString());
    music.value = res.data as MusicItem;
  } catch (e: any) {
    error.value = e?.message ?? 'Music loading failed';
    music.value = null;
  } finally {
    loadingMusic.value = false;
  }
}

async function loadReviews() {
  loadingReviews.value = true;
  try {
    const res = await ReviewsService.listForMusic(musicId.value);
    reviews.value = res.data as Review[];
  } catch (e: any) {
    error.value = e?.message ?? 'Reviews loading failed';
    reviews.value = [];
  } finally {
    loadingReviews.value = false;
  }
}

async function loadAll() {
  error.value = null;
  await Promise.all([loadMusic(), loadReviews()]);
}

const creating = ref(false);
const createForm = reactive<CreateReviewDto>({
  musicId: musicId.value,
  rating: 5,
  comment: '',
  userId: userId.value 
});

async function submitCreate() {
  if (creating.value) return;
  if (!createForm.comment.trim()) return;

  creating.value = true;
  try {
    const payload: CreateReviewDto = {
      musicId: musicId.value,
      rating: createForm.rating,
      comment: createForm.comment.trim(),
      userId: userId.value //  Use the computed dynamic ID
    };
    const createdRes = await ReviewsService.create(payload);
    reviews.value.unshift(createdRes.data);

    createForm.comment = '';
    createForm.rating = 5;
  } catch (e: any) {
    alert(e?.message ?? 'Creating failed.');
  } finally {
    creating.value = false;
  }
}

function setRating(n: number) {
  createForm.rating = n;
}
function onStarKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
    e.preventDefault();
    createForm.rating = Math.min(maxStars, (createForm.rating || 0) + 1);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
    e.preventDefault();
    createForm.rating = Math.max(1, (createForm.rating || 0) - 1);
  }
}
</script>

<template>
  <section class="max-w-3xl mx-auto p-4">
    <div class="mb-4 flex items-start justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">
          {{ music?.title ?? ('Music #' + musicId) }}
        </h1>
        <p class="text-white/70" v-if="music?.artist">{{ music.artist }}</p>
        <p class="text-white/50 text-sm" v-if="music">
          <span v-if="music.album">Album:
            <span class="text-white/70">{{ music.album }}</span>
          </span>
          <span v-if="music.year" class="ml-3">Year:
            <span class="text-white/70">{{ music.year }}</span>
          </span>
          <span v-if="music.genre" class="ml-3">Genre:
            <span class="text-white/70">{{ music.genre }}</span>
          </span>
        </p>
      </div>
      <div v-if="loadingMusic" class="text-white/60">Loading Music…</div>
    </div>

    <div v-if="error" class="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-red-200">
      {{ error }}
    </div>

    <div class="mb-6 rounded-xl bg-white/5 border border-white/10 p-4">
      <h2 class="text-lg font-semibold mb-3">Add Review</h2>

      <div class="flex items-center gap-1 mb-3">
        <label class="text-sm text-white/70">Rating</label>

        <div class="flex items-center" role="radiogroup" aria-label="Rating in Sternen" tabindex="0" @keydown="onStarKey">
          <button v-for="n in maxStars" :key="n" type="button"
            class="px-1 text-lg leading-none rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
            :aria-checked="createForm.rating >= n" role="radio" :title="`${n} von ${maxStars}`" @click="setRating(n)">
            <span :class="createForm.rating >= n ? 'text-emerald-400' : 'text-white/30'">
              ★
            </span>
          </button>
        </div>
        <span class="text-sm text-white/60">({{ createForm.rating }}/5)</span>
      </div>

      <textarea v-model="createForm.comment" rows="3" placeholder="How do you like the track?"
        class="w-full bg-transparent border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
        @keydown.enter.exact.prevent="submitCreate"></textarea>

      <div class="flex items-center gap-2">
        <button
          class="px-3 py-1.5 rounded-lg border border-white/30 text-white hover:bg-white/10 disabled:opacity-50"
          :disabled="creating || !createForm.comment.trim()" @click="submitCreate">
          Send
        </button>
        <span v-if="creating" class="text-white/60 text-sm">Sending...</span>
      </div>
    </div>

    <div class="mb-2 flex items-center justify-between">
      <h2 class="text-lg font-semibold">Reviews</h2>
    </div>

    <div v-if="loadingReviews" class="text-white/60">Loading Reviews…</div>

    <ul class="space-y-3">
      <li v-for="r in reviews" :key="r.id">
        <ReviewCard :review="r" :currentUserId="userId" @deleted="id => { reviews = reviews.filter(x => x.id !== id); }" />
      </li>
    </ul>
  </section>
</template>