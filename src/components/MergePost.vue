<template>
  <div>
    <button @click="openMergeModal">
      <font-awesome-icon
        class="fa-cm"
        icon="fa-solid fa-code-merge"
      ></font-awesome-icon>
      Merge Post
    </button>

    <button @click="openDetailsModal" v-if="selectedRequest">
      View Request
    </button>

    <div v-if="showMergeModal" class="modal-overlay">
      <div class="modal">
        <div class="modalContainer">
          <h2>You are merging:</h2>
          <h3>{{ currentRequest.title }}</h3>
          <h2>into</h2>
          <select v-model="selectedRequest" @change="handleSelectionChange">
            <option
              v-for="request in filteredRequests"
              :key="request.id"
              :value="request.id"
            >
              {{ request.title }}
            </option>
          </select>

          <div class="detail-button">
            <button
              v-if="selectedRequest"
              @click="viewDetails"
              class="viewRequestButton"
            >
              <font-awesome-icon
                class="fa-cm"
                icon="fa-solid fa-eye"
              ></font-awesome-icon>
              View Request
            </button>
          </div>

          <div class="buttonContainer">
            <button
              @click="mergeRequests"
              class="mergeButton"
              :disabled="!selectedRequest"
            >
              <font-awesome-icon
                class="fa-cm"
                icon="fa-solid fa-code-merge"
              ></font-awesome-icon
              >Merge
            </button>
            <button @click="closeMergeModal" class="cancelButton">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDetailsModal" class="modal-overlay">
      <div class="details-modal">
        <div class="buttonContainer">
          <h2 class="modal-title">
            <span>{{ selectedRequestDetails.title }}</span>
          </h2>
          <p>{{ selectedRequestDetails.bodyText }}</p>

          <div class="buttonContainer">
            <button @click="closeDetailsModal" class="cancelButton">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showConfirmModal" class="modal-overlay">
      <div class="modal">
        <div class="buttonContainer">
          <h2>Confirm Merge</h2>
          <p>Are you sure you want to merge?</p>
          <div class="buttonContainer">
            <button @click="confirmMerge" class="mergeButton">
              <font-awesome-icon
                class="fa-cm"
                icon="fa-solid fa-code-merge"
              ></font-awesome-icon>
              Yes, Merge
            </button>
            <button @click="cancelMerge" class="cancelButton">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    //gemme tilstand af attributter
    return {
      showMergeModal: false,
      currentRequest: {},
      allRequests: [],
      selectedRequest: null,
      modalTitle: "",
      showDetailsModal: false,
      selectedRequestDetails: {},
      showConfirmModal: false,
    };
  },
  computed: {
    filteredRequests() {
      return this.allRequests.filter(
        (request) => request.id !== this.currentRequest.id && !request.merged
      );
    },
  },
  methods: {
    openMergeModal() {
      const requestId = this.$route.params.requestId;

      axios
        .get(`http://localhost:3001/api/v1/merge/current/${requestId}`)
        .then((response) => {
          this.currentRequest = response.data;
        })
        .catch((error) => {
          console.error("Error fetching current request:", error);
        });

      axios
        .get("http://localhost:3001/api/v1/merge/all")
        .then((response) => {
          this.allRequests = response.data;
        })
        .catch((error) => {
          console.error("Error fetching all requests:", error);
        });

      this.showMergeModal = true;
    },
    closeMergeModal() {
      this.showMergeModal = false;

      this.selectedRequest = null;
    },
    mergeRequests() {
      this.showConfirmModal = true;
    },
    confirmMerge() {
      // Udfør faktisk merge-aktionen her
      const currentRequestId = this.currentRequest.id;
      const selectedRequestId = this.selectedRequest;

      axios
        .post("http://localhost:3001/api/v1/merge", {
          currentRequestId,
          selectedRequestId,
        })
        .then((response) => {
          console.log("Merge successful:", response.data.message);
          this.closeMergeModal();

          this.$router.push({ path: "/" });
        })

        .catch((error) => {
          console.error("Error merging requests:", error);
        })
        .finally(() => {
          this.showConfirmModal = false;
        });
    },
    cancelMerge() {
      this.showConfirmModal = false;
    },
    viewDetails() {
      const selectedRequest = this.allRequests.find(
        (request) => request.id === this.selectedRequest
      );
      this.selectedRequestDetails = selectedRequest;
      this.showDetailsModal = true;
    },
    closeDetailsModal() {
      this.showDetailsModal = false;
    },
  },
};
</script>

<style scoped>
h2 {
  font-size: 18px;
  padding-bottom: 20px;
  font-weight: 300;
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
  z-index: 999;
}

.modal {
  background: white;
  border: 1px solid black;
  border-radius: 5px;
  padding: 50px;
}

.buttonContainer {
  margin-top: 30px;
  text-align: center;
}
.modalContainer {
  margin-top: 20px;
}

.mergeButton {
  color: black;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  border: 1px solid black;
  margin-right: 10px;
}

.cancelButton {
  background-color: rgb(225, 69, 69);
  color: white;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  margin-left: 10px;
  border: 1px solid black;
}

button {
  color: black;
  font-size: 10px;
  padding: 12px;
  margin: 0px;
  cursor: pointer;
  background: white;
  border: 1px solid black;
  border-radius: 5px;
}
h2 {
  font-weight: 700;
}

h3 {
  font-weight: 300;
  padding-bottom: 15px;
}

.details-modal {
  background: white;
  border: 1px solid black;
  border-radius: 5px;
  padding: 20px;
  width: 400px;
}

.modal-title {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;
}

.viewRequestButton {
  color: black;
  font-size: 10px;
  padding: 6px;
  margin: 0px;
  cursor: pointer;
  background: white;
  border: 1px solid black;
  border-radius: 5px;
  margin-top: 15px;
}
.fa-cm {
  margin-right: 5px;
}
select {
  height: 25px;
}
</style>
