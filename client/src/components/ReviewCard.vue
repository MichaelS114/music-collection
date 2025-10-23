<script setup lang="ts">
import { ReviewsService } from '@/api/reviews.service';
import type { Review, UpdateReviewDto } from '@/models/models';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  review: Review,
  currentUserId?: number;
}>();

const emit = defineEmits<{
  (e: 'deleted', id: number): void;
}>();

const busy = ref(false);
const isEditing = ref(false);
const maxStars = 5;

const username = computed(() => props.review.user?.username ?? `User ${props.review.userId}`);
const canManage = computed(() => props.currentUserId === props.review.userId);

const currentComment = ref(props.review.comment);
const currentRating  = ref<number>(props.review.rating ?? 0);
const editText = ref(props.review.comment);
const editRating  = ref<number>(props.review.rating ?? 0);

watch(() => props.review.comment, (v) => {
  if (!isEditing.value) currentComment.value = v;
  editText.value = v;
});
watch(() => props.review.rating, (v) => {
  const val = v ?? 0;
  if (!isEditing.value) currentRating.value = val;
  editRating.value = val;
});

const stars = computed(() => {
  const r = Math.max(0, Math.min(5, Math.round(currentRating.value ?? 0)));
  return '★'.repeat(r) + '✩'.repeat(5 - r);
});

const createdLabel = computed(() => {
  const d = new Date(props.review.createdAt);
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('de-AT', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(d);
});

async function deleteReview() {
  if (!canManage.value) return;
  if (busy.value) return;

  try {
    busy.value = true;
    await ReviewsService.remove(props.review.id);
    emit('deleted', props.review.id); 
  } catch (e: any) {
    alert(`Failed to delete review: ${e?.message ?? 'Unknown error'}`);
  } finally {
    busy.value = false;
  }
}

function startEdit() {
  if (!canManage.value || busy.value) return;
  editText.value = currentComment.value;
  editRating.value = currentRating.value;
  isEditing.value = true;
}
function cancelEdit() {
  if (busy.value) return;
  isEditing.value = false;
  editText.value = currentComment.value;
  editRating.value = currentRating.value;
}
async function saveEdit() {
  if (!canManage.value || busy.value) return;
  const text = editText.value.trim();
  if (!text) return;

  try {
    busy.value = true;
    const payload: UpdateReviewDto = 
    { 
      comment: text, 
      userId: props.currentUserId, 
      musicId: props.review.musicId,
      rating: editRating.value
    };
    const res = await ReviewsService.update(props.review.id, payload);
    const updated = res.data as Review;
    currentComment.value = updated.comment;
    currentRating.value = updated.rating;
    isEditing.value = false;
  } catch (e: any) {
    alert(`Failed to update review: ${e?.message ?? 'Unknown error'}`);
  } finally {
    busy.value = false;
  }
}

function setEditRating(n: number) {
  editRating.value = n;
}
function onEditStarKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
    e.preventDefault();
    editRating.value = Math.min(maxStars, (editRating.value || 0) + 1);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
    e.preventDefault();
    editRating.value = Math.max(1, (editRating.value || 0) - 1);
  }
}

</script>


<template>
  <article class="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
    <!-- Header -->
    <div class="flex items-start justify-between gap-3 mb-3">
      <h3 class="text-sm font-semibold text-white/90">
        {{ username }}
        <span v-if="createdLabel" class="ml-2 text-xs font-normal text-white/50">{{ createdLabel }}</span>
      </h3>
      <div class="flex items-center gap-2">
        <div class="text-sm tabular-nums text-white/80">
          <span class="text-emerald-400">{{ stars }}</span>
          <span class="ml-2 text-white/50">({{ currentRating ?? 0 }}/5)</span>
        </div>

        <!-- Actions -->
        <div v-if="canManage" class="flex items-center gap-1">
          <button
            v-if="!isEditing"
            class="px-2 py-1 rounded-md border border-white/20 text-xs text-white hover:bg-white/10"
            :disabled="busy"
            @click.stop="startEdit"
          >
            Edit
          </button>
          <button
            class="px-2 py-1 rounded-md border text-xs border-red-400 text-red-400 hover:bg-red-500/10 disabled:opacity-50"
            :disabled="busy"
            @click.stop="deleteReview"
          >
            {{ busy && !isEditing ? 'Deleting…' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Comment -->
    <template v-if="!isEditing">
      <p class="mt-2 whitespace-pre-wrap break-all text-white/90 leading-relaxed">
        {{ currentComment }}
      </p>
    </template>
    <template v-else>

      <div class="mb-3 flex items-center gap-2">
        <label class="text-sm text-white/70">Rating</label>
        <div
          class="flex items-center"
          role="radiogroup"
          aria-label="Rating in Sternen"
          tabindex="0"
          @keydown="onEditStarKey"
        >
          <button
            v-for="n in maxStars"
            :key="n"
            type="button"
            class="px-1 text-lg leading-none rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
            :aria-checked="editRating >= n"
            role="radio"
            :title="`${n} von ${maxStars}`"
            @click="setEditRating(n)"
          >
            <span :class="editRating >= n ? 'text-emerald-400' : 'text-white/30'">★</span>
          </button>
        </div>
        <span class="text-sm text-white/60">({{ editRating }}/5)</span>
      </div>

      <textarea
        v-model="editText"
        rows="4"
        class="mt-2 w-full bg-transparent border border-white/20 rounded-md px-3 py-2 text-white/90 focus:outline-none focus:ring-2 focus:ring-white/20"
        @keydown.enter.exact.prevent="saveEdit"
        @keydown.esc.prevent="cancelEdit"
        placeholder="Edit review…"
      ></textarea>

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
          :disabled="busy || !editText.trim()"
          @click="saveEdit"
        >
          {{ busy ? 'Saving…' : 'Save' }}
        </button>
      </div>
    </template>
  </article>
</template>