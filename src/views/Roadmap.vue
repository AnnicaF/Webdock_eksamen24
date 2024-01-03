<script setup>
import NavBar from "@/components/NavBar.vue";
import RoadMapPost from "@/components/RoadMapPost.vue";
import axios from "axios";
import { ref } from "vue";

const requests = ref(null);

axios
  .get("http://localhost:3000/api/v1/request")
  .then((response) => {
    requests.value = response.data;
    console.log(response);
  })
  .catch((err) => {
    console.log("error: " + err);
  });
</script>

<template>
  <NavBar />
  <div>
    <RoadMapPost :posts="requests" />
  </div>
  <Footer />
</template>

<script>
export default {
  components: {
    RoadMapPost,
  },
};
</script>
