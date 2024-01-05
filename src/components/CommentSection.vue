<template>
  <div class="section">
    <div class="comment-box" v-if="isAuthenticated">
      <textarea v-model="newComment" placeholder="Leave a comment"></textarea>
      <div class="button-container">
        <button @click="addComment">Submit</button>
      </div>
    </div>
    <div class="container">
      <ul v-if="sortedComments.length > 0">
        <li v-for="comment in sortedComments" :key="comment.id">
          <div class="comment-content">
            <p>
              <strong>{{ comment.User.name }}</strong>
            </p>
            <p>{{ comment.bodyText }}</p>
            <hr />
            <p class="comment-date">
              {{ new Date(comment.createdAt).toLocaleDateString("en-GB") }}
            </p>
          </div>
        </li>
      </ul>
      <p v-else>No comments yet.</p>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  props: {
    comments: Array,
  },
  data() {
    return {
      newComment: "",
    };
  },
  computed: {
    sortedComments() {
      return this.comments
        ? [...this.comments].sort((a, b) => new Date(b.date) - new Date(a.date))
        : [];
    },
    ...mapState(["isAuthenticated"]),
  },

  methods: {
    addComment() {
      this.$emit("addComment", this.newComment);
      console.log(this.newComment);
      // Clear the input field
      this.newComment = "";
    },
    async handleAddComment() {
      const postId = this.selectedPost.id; // Juster dette baseret på din datastruktur
      try {
        const response = await axios.post(
          `http://localhost:3001/api/v1/request/${requestId}/comment`,
          {
            text: this.newComment,
          }
        );

        // Opret en ny kopi af kommentarerne for at bevare reaktivitet
        this.$emit("addComment", response.data); // Dette emitter en begivenhed til forælderen
        this.newComment = ""; // Nulstil inputfeltet
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    },
  },
};
</script>

<style scoped>
.section {
  display: flex;
  justify-content: center;
  max-width: 600px;
  margin: auto;
  flex-direction: column;
}

.container {
  background-color: var(--grey-mid);
}

.comment-box {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

textarea {
  resize: none;
  width: 66%;
  height: 80px;
  padding: 3px;
  margin: 0 auto;
}

.button-container {
  margin: auto;
  width: 66%;
}

.button-container button {
  background-color: var(--green-primary);
  border-style: none;
  border-radius: 4px;
  color: var(--white);
  font-size: 12px;
}
</style>