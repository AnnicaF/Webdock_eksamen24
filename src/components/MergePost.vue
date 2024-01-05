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
        <div class="buttonContainer">
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

          <button v-if="selectedRequest" @click="viewDetails">
            View Request
          </button>

          <div class="buttonContainer">
            <button @click="mergeRequests" class="mergeButton">Merge</button>
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
          <p>{{ selectedRequestDetails.createdAt }}</p>
          <p>{{ selectedRequestDetails.bodyText }}</p>

          <div class="buttonContainer">
            <button @click="closeDetailsModal" class="cancelButton">
              Close
            </button>
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
    return {
      showMergeModal: false,
      currentRequest: {},
      allRequests: [],
      selectedRequest: null,
      modalTitle: "",
      showDetailsModal: false,
      selectedRequestDetails: {},
      showConfirmationModal: false,
    };
  },
  computed: {
    filteredRequests() {
      // Filtrer anmodninger for at udelukke den aktuelle anmodning
      return this.allRequests.filter(
        (request) => request.id !== this.currentRequest.id
      );
    },
  },
  methods: {
    openMergeModal() {
      const requestId = this.$route.params.requestId;

      // Fetch the current request from the backend
      axios
        .get(`http://localhost:3001/api/v1/merge/current/${requestId}`)
        .then((response) => {
          this.currentRequest = response.data;
        })
        .catch((error) => {
          console.error("Error fetching current request:", error);
        });

      // Fetch all requests from the backend
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
    },
    handleSelectionChange() {
      // Handle dropdown selection change if needed
    },
    mergeRequests() {
      // Perform the merge by sending a request to the backend
      axios
        .post("http://localhost:3001/api/v1/merge", {
          currentRequestId: this.currentRequest.id,
          selectedRequestId: this.selectedRequest,
        })
        .then((response) => {
          console.log("Merge successful:", response.data.message);
          this.closeMergeModal();
        })
        .catch((error) => {
          console.error("Error merging requests:", error);
        });
    },
    viewDetails() {
      // Fetch details for the selected request
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
  width: 400px; /* Juster bredden efter behov */
}

.modal-title {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;
}
</style>
