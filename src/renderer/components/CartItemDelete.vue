<template>
  <v-btn fab x-small color="red" @click="removeCartItem">
    <v-icon color="white">
      mdi-delete
    </v-icon>
  </v-btn>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  methods: {
    removeCartItem() {
      this.params.context.componentParent.removeCartItem(this.params.node);
    },
  },
});
</script>

<style scoped></style>
