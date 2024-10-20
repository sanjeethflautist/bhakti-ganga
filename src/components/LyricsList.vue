<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <input v-model="search" placeholder="Search" class="form-control w-100" />
    </div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>
            <div @click="sortBy('title')">Title</div>
            <input v-model="filters.title" type="text" placeholder="Filter by title" class="form-control" />
          </th>
          <th>
            <div @click="sortBy('written_by')">Written By</div>
            <input v-model="filters.written_by" type="text" placeholder="Filter by author" class="form-control" />
          </th>
          <th>
            <div @click="sortBy('tags')">Tags</div>
            <input v-model="filters.tags" type="text" placeholder="Filter by a tag" class="form-control" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="lyric in sortedAndFilteredLyrics" :key="lyric.id">
          <td><router-link :to="'/lyrics/' + lyric.id">{{ lyric.title }}</router-link></td>
          <td>{{ lyric.written_by || 'Unknown' }}</td>
          <td>{{ lyric.tags ? lyric.tags.join(', ') : 'No tags available' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { fetchLyrics } from '../supabaseService';

export default {
  data() {
    return {
      lyrics: [],
      search: '',
      sortKey: 'title',
      sortAsc: true,
      filters: {
        title: '',
        written_by: '',
        tags: ''
      }
    };
  },
  computed: {
    sortedAndFilteredLyrics() {
      const searchLower = this.search.toLowerCase();
      const filteredLyrics = this.lyrics.filter(lyric => {
        const titleMatch = lyric.title.toLowerCase().includes(searchLower);
        const tagsMatch = lyric.tags && lyric.tags.some(tag => tag.toLowerCase().includes(searchLower));
        const filterTitleMatch = lyric.title.toLowerCase().includes(this.filters.title.toLowerCase());
        const filterAuthorMatch = lyric.written_by.toLowerCase().includes(this.filters.written_by.toLowerCase());
        const filterTagsMatch = lyric.tags.some(tag => tag.toLowerCase().includes(this.filters.tags.toLowerCase()));
        return (titleMatch || tagsMatch) && filterTitleMatch && filterAuthorMatch && filterTagsMatch;
      });

      return filteredLyrics.sort((a, b) => {
        let result = 0;
        if (a[this.sortKey] < b[this.sortKey]) result = -1;
        if (a[this.sortKey] > b[this.sortKey]) result = 1;
        return this.sortAsc ? result : -result;
      });
    }
  },
  methods: {
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = true;
      }
    }
  },
  async created() {
    try {
      this.lyrics = await fetchLyrics(true);
    } catch (error) {
      console.error('Error fetching lyrics:', error);
    }
  }
};
</script>