<script setup>
import FilterBar from "@/components/FilterBar.vue";
import NavBar from "@/components/NavBar.vue";
import FeaturePost from "@/components/FeaturePost.vue";
import Footer from "@/components/Footer.vue";
import axios from "axios";
import { ref } from "vue";

const requests = ref(null);

function get() {
  axios
    .get("http://localhost:3001/api/v1/request")
    .then((response) => {
      requests.value = response.data;
      console.log(response);
    })
    .catch((err) => {
      console.log("error: " + err);
    });
}

function category(cat) {
  if (!cat) {
    get();
  } else {
    axios
      .get("http://localhost:3001/api/v1/cat", {
        params: {
          c: cat,
        },
      })
      .then((response) => (requests.value = response.data))
      .catch((err) => {
        console.log("error: " + err);
      });
  }
}

function search(searchQuery) {
  console.log(searchQuery);
  axios
    .get("http://localhost:3001/api/v1/search", {
      params: {
        q: searchQuery,
      },
    })
    .then((response) => {
      requests.value = response.data;
      console.log(response);
    })
    .catch((err) => {
      console.log("error: " + err);
    });
}

get();
</script>

<template>
  <NavBar @callsearch="search" />
  <FilterBar @callLoad="get" @callCategory="category" />
  <div class="box">
    <button
      v-for="(request, index) in requests"
      :key="index"
      @click="navigateToDetail(request)"
    >
      <feature-post
        :roleID="roleID"
        :title="request.title"
        :bodyText="request.bodyText"
        :index="index"
        :status="request.Status.name"
        :date="request.createdAt"
        :commentCount="request.Comments"
        :user="request.User.name"
        :upvoteCount="request.Likes"
      />
    </button>
  </div>
  <Footer />
</template>

<script>
export default {
  components: {
    FeaturePost,
    Footer,
  },
  data() {
    return {
      roleID: 1,
    };
  },
  methods: {
    navigateToDetail(request) {
      this.$router.push({
        name: "featurePostDetail",
        params: { requestId: request.id },
      });
    },
  },
};
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
}

button {
  padding: 0;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  margin: 0px;
}

.box {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
