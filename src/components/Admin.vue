<template>
  <div>
    <h1>Admin Panel</h1>
    <div class="search-container mb-3">
      <input v-model="searchQuery" type="text" placeholder="Search lyrics..." class="form-control" />
    </div>
    <button @click="showAddForm = !showAddForm" v-if="!showEditForm && !showAddForm" class="button mb-3">
      Add New Lyric
    </button>
    <div v-if="showAddForm">
      <form @submit.prevent="addLyric">
        <div class="mb-3">
          <label for="title" class="form-label">Title</label>
          <input v-model="newLyric.title" id="title" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="lyrics" class="form-label">Lyrics</label>
          <textarea v-model="newLyric.lyrics" id="lyrics" class="form-control" required></textarea>
        </div>
        <div class="mb-3">
          <label for="written_by" class="form-label">Written By</label>
          <input v-model="newLyric.written_by" id="written_by" class="form-control" />
        </div>
        <div class="mb-3">
          <label for="tags" class="form-label">Tags (comma separated)</label>
          <input v-model="newLyric.tags" id="tags" class="form-control" />
        </div>
        <div class="button-container">
          <button type="submit" class="button">Add Lyric</button>
          <button type="button" @click="cancelAdd" class="button cancel-button">Cancel</button>
        </div>
      </form>
    </div>
    <div v-if="showEditForm">
      <form @submit.prevent="updateLyric">
        <div class="mb-3">
          <label for="editTitle" class="form-label">Title</label>
          <input v-model="editLyricData.title" id="editTitle" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="editLyrics" class="form-label">Lyrics</label>
          <textarea v-model="editLyricData.lyrics" id="editLyrics" class="form-control" required></textarea>
        </div>
        <div class="mb-3">
          <label for="editWrittenBy" class="form-label">Written By</label>
          <input v-model="editLyricData.written_by" id="editWrittenBy" class="form-control" />
        </div>
        <div class="mb-3">
          <label for="editTags" class="form-label">Tags (comma separated)</label>
          <input v-model="editLyricData.tags" id="editTags" class="form-control" />
        </div>
        <button type="submit" class="button">Update Lyric</button>
        <button type="button" @click="cancelEdit" class="button cancel-button">Cancel</button>
      </form>
    </div>
    <table class="table table-striped mt-4">
      <thead>
        <tr>
          <th>Title</th>
          <th>Written By</th>
          <th>Tags</th>
          <th>Approved</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="lyric in filteredLyrics" :key="lyric.id">
          <td>{{ lyric.title }}</td>
          <td>{{ lyric.written_by || 'Unknown' }}</td>
          <td>{{ lyric.tags ? lyric.tags.join(', ') : 'No tags available' }}</td>
          <td>
            <input type="checkbox" v-model="lyric.approved" @change="toggleApproval(lyric)" class="custom-checkbox" />
          </td>
          <td>
            <div class="button-container">
              <button @click="editLyric(lyric)" class="icon-button">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="deleteLyric(lyric.id)" class="icon-button">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { fetchLyrics, addLyric, updateLyric, deleteLyric } from '../supabaseService';

export default {
  name: 'AdminPanel',
  data() {
    return {
      lyrics: [],
      showAddForm: false,
      showEditForm: false,
      searchQuery: '',
      newLyric: {
        title: '',
        lyrics: '',
        written_by: '',
        tags: ''
      },
      editLyricData: null
    };
  },
  computed: {
    filteredLyrics() {
      if (!this.searchQuery) {
        return this.lyrics;
      }
      return this.lyrics.filter(lyric =>
        lyric.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  async created() {
    this.lyrics = await fetchLyrics();
  },
  methods: {
    async addLyric() {
      try {
        const lyric = {
          ...this.newLyric,
          tags: this.newLyric.tags.split(',').map(tag => tag.trim())
        };
        await addLyric(lyric);
        this.lyrics = await fetchLyrics();
        this.showAddForm = false;
        this.newLyric = { title: '', lyrics: '', written_by: '', tags: '' };
      } catch (error) {
        console.error('Error adding lyric:', error);
        alert('Failed to add lyric. Please try again.');
      }
    },
    editLyric(lyric) {
      this.editLyricData = { ...lyric };
      this.showEditForm = true;
      this.showAddForm = false;
    },
    async updateLyric() {
      try {
        await updateLyric(this.editLyricData);
        this.lyrics = await fetchLyrics();
        this.showEditForm = false;
        this.editLyricData = null;
      } catch (error) {
        console.error('Error updating lyric:', error);
      }
    },
    async deleteLyric(id) {
      await deleteLyric(id);
      this.lyrics = await fetchLyrics();
    },
    async toggleApproval(lyric) {
      try {
        await updateLyric({ id: lyric.id, approved: lyric.approved });
        this.lyrics = await fetchLyrics();
      } catch (error) {
        console.error('Error updating approval status:', error);
      }
    },
    cancelAdd() {
      this.showAddForm = false;
      this.newLyric = { title: '', lyrics: '', written_by: '', tags: '' };
    },
    cancelEdit() {
      this.showEditForm = false;
      this.editLyricData = null;
    }
  }
};
</script>

<style>
.search-container {
  display: flex;
  align-items: center;
}
.search-container input {
  margin-right: 10px;
}
.custom-checkbox {
  accent-color: #ffc107;
}
.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #ffc107;
  font-size: 1.2em;
  margin-right: 5px;
  display: inline-block;
}
.icon-button .fa-trash {
  color: #dc3545;
}
.button-container {
  display: flex;
  align-items: center;
}
.button {
  background-color: #008080;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  margin-right: 10px;
}
.button:hover {
  background-color: #006666;
}
.cancel-button {
  background-color: #dc3545;
}
.cancel-button:hover {
  background-color: #c82333;
}
</style>