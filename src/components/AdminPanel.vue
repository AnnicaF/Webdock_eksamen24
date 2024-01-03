<template>
  <div class="adminContainer">
    <MergePost class="adminButton" />
    <button @click="showDeleteModal" class="adminButton">
      <font-awesome-icon class="fa-tc" icon="fa-solid fa-trash-can" />Delete
      Post
    </button>
    <ChangePostStatus
      class="statusButton"
      :status="status"
      :requestId="requestId"
    />
    <div
      :class="{ 'modal-overlay': true, active: isDeleteModalVisible }"
      v-show="isDeleteModalVisible"
    >
      <div class="modal">
        <div class="modal-content">
          <div class="buttonContainer">
            <p>Are you sure you want to delete this post?</p>
            <button @click="deletePost(requestId)" class="deleteButton">
              Delete
            </button>
            <button @click="closeDeleteModal" class="cancelButton">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ChangePostStatus from "./ChangePostStatus.vue";
import MergePost from "./MergePost.vue";
import { ref, defineProps } from "vue";
import axios from "axios";

const props = defineProps(["requestId", "status"]);

const isDeleteModalVisible = ref(false);

const showDeleteModal = () => {
  isDeleteModalVisible.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalVisible.value = false;
};
</script>

<script>
export default {
  methods: {
    goBack() {
      this.$router.push("/");
    },
    deletePost(requestId) {
      if (!requestId) {
        console.error("No requestId provided");

        return;
      }

      axios
        .delete(
          `http://localhost:3000/api/v1/request/${requestId}`
        )
        .then(() => {
          console.log("Request deleted successfully");
          this.$router.push("/");
        })
        .catch((error) => {
          console.error("Error deleting request", error);
        });
    },
  },
};
</script>
<style scoped>
.adminContainer {
  display: flex;
  justify-content: center;
}

.adminContainer > div {
  margin: 5px;
  transition: 0.25s;
}

.adminContainer > div:hover {
  margin-left: 10px;
  margin-right: 10px;
}

.adminButton {
  color: black;
  font-size: 10px;
  cursor: pointer;
  padding: 12px;
  margin: 5px;
  background: white;
  border: 1px solid black;
  border-radius: 5px;
}

button:hover {
  background-color: var(--grey-mid);
  margin-left: 10px;
  margin-right: 10px;
}

.fa-tc {
  padding-right: 5px;
  color: rgb(225, 69, 69);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  border: 1px solid black;
  border-radius: 5px;
  padding: 20px;
}

.buttonContainer {
  text-align: center;
}

.buttonContainer button {
  margin: 5px;
}

.deleteButton {
  background-color: rgb(225, 69, 69);
  color: white;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
}

.deleteButton:hover {
  background-color: rgb(255, 84, 84);
}

.cancelButton {
  background-color: rgb(227, 227, 227);
  color: black;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
}

.cancelButton:hover {
  background-color: var(--grey-mid);
}
</style>
