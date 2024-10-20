<template>
  <div>
    <h1>{{ lyric.title }}</h1>
    <p v-html="formattedLyrics"></p>
    <p><strong>Written By:</strong> {{ lyric.written_by || 'Unknown' }}</p>
    <p><strong>Tags:</strong> {{ lyric.tags ? lyric.tags.join(', ') : 'No tags available' }}</p>
    <button @click="goBack" class="button">Back</button>
  </div>
</template>

<script>
import { fetchLyricById } from '../supabaseService';

export default {
  name: 'LyricsDetail',
  data() {
    return {
      lyric: {}
    };
  },
  computed: {
    formattedLyrics() {
      return this.lyric.lyrics ? this.lyric.lyrics.replace(/\n/g, '<br>') : '';
    }
  },
  async created() {
    try {
      const id = this.$route.params.id;
      this.lyric = await fetchLyricById(id);
    } catch (error) {
      console.error('Error fetching lyric:', error);
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

