<script setup>
import { ref, onMounted, getCurrentInstance, computed } from "vue";
import axios from "axios";
import PostDetail from "@/components/PostDetail.vue";
import CommentSection from "@/components/CommentSection.vue";
import NavBar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";
import AdminPanel from "@/components/AdminPanel.vue";
import { useStore } from "vuex";

const store = useStore();
const isAdmin = computed(() => store.state.roleID === 1);

const { proxy } = getCurrentInstance();
const selectedPost = ref(null);
const loading = ref(true);

const fetchPostDetails = async () => {
  const requestId = proxy.$route.params.requestId;
  try {
    const response = await axios.get(
      `http://localhost:3001/api/v1/request/${requestId}`
    );
    selectedPost.value = response.data;
    console.log(selectedPost.value);
  } catch (error) {
    console.error("Error fetching post details:", error);
  } finally {
    loading.value = false;
  }
};

const doComment = (newComment) => {
  let data = {
    bodyText: newComment,
    userID: localStorage.getItem("userId"),
    requestID: selectedPost.value.id,
  };
  axios
    .post(
      `http://localhost:3001/api/v1/request/${selectedPost.value.id}/comment`,
      data
    )
    .then((response) => {
      console.log("Response:", response.data);
      fetchPostDetails(selectedPost.value.id);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
fetchPostDetails();
</script>

<template>
  <div>
    <NavBar />
    <template v-if="loading">
      <p>Loading...</p>
    </template>
    <template v-else>
      <PostDetail :post="selectedPost" />
      <template v-if="isAdmin && selectedPost">
        <AdminPanel
          :requestId="selectedPost.id"
          :status="selectedPost.StatusId"
        />
      </template>
      <CommentSection
        :comments="selectedPost.Comments"
        @addComment="doComment"
      />
    </template>
  </div>
</template>

<script>
import PostDetail from "@/components/PostDetail.vue";
import CommentSection from "@/components/CommentSection.vue";
import axios from "axios";
import { ref, onMounted, computed } from "vue";

export default {
  props: {
    roleID: Number,
    requestId: Number,
  },
  components: {
    PostDetail,
    CommentSection,
    NavBar,
    AdminPanel,
  },
};
</script>

<style>
@import "@/assets/main.css";
</style>