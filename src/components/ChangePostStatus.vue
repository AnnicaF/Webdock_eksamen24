<script setup>
import axios from "axios";
</script>

<template>
  <div :class="{ showDropdown: showDropdown }" class="dropdown-container">
    <button @click="toggleDropdown" class="adminButton">
      {{ dropdownItems[status - 2] || "Under Reveiw" }}
      <font-awesome-icon class="fa-cd" icon="fa-solid fa-caret-down" />
    </button>
    <div
      v-show="showDropdown"
      @click.stop="handleDropdownItemClick"
      class="dropdown-content"
    >
      <ul>
        <li
          v-for="(item, index) in dropdownItems"
          :key="index"
          @click="doStatus(item, requestId)"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDropdown: false,
      dropdownItems: ["Planned", "In progress", "Completed"],
    };
  },
  props: {
    status: String,
    requestId: Number,
  },
  mounted() {
    document.addEventListener("click", this.closeDropdownOnOutsideClick);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closeDropdownOnOutsideClick);
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    handleDropdownItemClick() {
      this.showDropdown = false;
    },
    closeDropdownOnOutsideClick(event) {
      if (this.showDropdown && !this.$el.contains(event.target)) {
        this.showDropdown = false;
      }
    },
    doStatus(status, requestId) {
      const data = {
        status: status,
        feature_request_id: requestId,
      };
      axios
        .post("http://localhost:3000/api/v1/request/status", data)
        .then((res) => {
          console.log("successful: ", res);
        })
        .catch((err) => {
          console.log("an error as occurred: ", err);
        });
    },
  },
};
</script>

<style scoped>
div > .showDropdown ul {
  position: relative;
  display: inline-block;
}

div ul {
  display: none;
  position: absolute;
  z-index: 1;
  list-style: none;
  margin: 0;
}

.fa-cd {
  padding-left: 5px;
  margin: 0px;
}

.adminButton {
  color: black;
  font-size: 10px;
  padding: 12px;
  margin: 0px;
  cursor: pointer;
  background: white;
  border: 1px solid black;
  border-radius: 5px;
}

button:hover {
  background-color: var(--grey-mid);
}
.dropdown-container {
  position: relative;
  display: inline-block;
  margin: 0px;
  overflow: visible;
  height: 37px;
}

.dropdown-content {
  color: black;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  position: absolute;
  background-color: var(--grey-light);
}

.dropdown-content ul {
  padding: 0;
}

.dropdown-content li {
  list-style: none;
  text-decoration: none;
  padding: 12px;
  margin: 0px;
  cursor: pointer;
}

.dropdown-content li:hover {
  background-color: #f1f1f1;
}
</style>
