<script setup>
import Modal from "../components/Modal.vue";
import axios from "axios";
import { mapState } from "vuex";
import { ref } from "vue";

const categories = ref(null);

axios
  .get("http://localhost:3000/api/v1/category")
  .then((response) => (categories.value = response.data))
  .then(console.log(categories))

  .catch((err) => {
    console.log("error: " + err);
  });
</script>

<template>
  <div class="line-container">
    <hr class="line" />
  </div>
  <div class="filter_container">
    <button @click="openModal">Create Post</button>
    <Modal v-if="isAuthenticated" />
    <div>
      <ul class="filter_bar">
        <li
          :class="{ selected: activeTab === 'New' }"
          @click="setActiveTab('New')"
        >
          New
        </li>
        <li
          :class="{ selected: activeTab === 'Top' }"
          @click="setActiveTab('Top')"
        >
          Top
        </li>
        <li
          :class="{ selected: activeTab === 'trending' }"
          @click="setActiveTab('trending')"
        >
          Trending
        </li>
        <li>
          <label for="categorySelect">{{ categoryLabel }}</label>
          <select id="categorySelect" @change="selectCategory">
            <option value="">All Categories</option>
            <option
              v-for="(category, index) in categories"
              :value="category.id"
              :key="index"
            >
              {{ category.name }}
            </option>
          </select>
        </li>
      </ul>
    </div>
  </div>
  <div class="line-container">
    <hr class="line" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: "top",
    };
  },
  components: {
    Modal,
  },
  computed: {
    ...mapState(["isAuthenticated"]),
  },
  methods: {
    openModal() {
      if (this.isAuthenticated) {
        const modal = document.getElementById("modal");
        modal.classList.add("show");
      } else {
        alert("Du skal logge ind for at oprette en post.");
      }
    },
    setActiveTab(tabName) {
      this.activeTab = tabName;
    },
    selectCategory() {
      this.$emit(
        "callCategory",
        document.getElementById("categorySelect").value
      );
    },
  },
};
</script>

<style scoped>
@import "@/assets/base.css";
.filter_container {
  display: flex;
  justify-content: center;
}

.filter_bar {
  display: flex;
}

.filter_bar {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: space-around;
}

.filter_bar li {
  cursor: pointer;
  font-size: 18px;
  color: #000;
  text-decoration: none;
  padding: 10px;
  padding-left: 30px;
}

.filter_bar li.selected {
  text-decoration: underline;
}

button {
  background-color: var(--green-primary);
  color: var(--white);
  border-radius: 5px;
  font-size: 16px;
  padding: 4px 12px;
  border: solid var(--green-primary);
  cursor: pointer;
}

button:hover {
  background-color: var(--white);
  color: var(--green-primary);
}

.line-container {
  display: flex;
  justify-content: center;
}

.line {
  width: 600px;
  border: none;
  border-top: 2px solid var(--grey-mid);
  margin: 10px 0;
}

select {
  border: none;
  font-size: 18px;
}
label {
  font-size: 18px;
}
</style>
