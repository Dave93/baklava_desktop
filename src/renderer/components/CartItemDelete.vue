<template>
  <div>
    <v-btn
      fab
      x-small
      @click="plusCartItem"
      v-if="params.data.type === 'set'"
      class="mr-2"
    >
      <v-icon>
        mdi-plus
      </v-icon>
    </v-btn>
    <v-btn fab x-small color="red" @click="removeCartItem">
      <v-icon color="white">
        mdi-delete
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  methods: {
    removeCartItem() {
      this.params.context.componentParent.removeCartItem(this.params.node);
    },
    plusCartItem() {
      this.params.context.componentParent.plusSetCartItem(this.params.node);
    },
  },
});
</script>

<style scoped></style>
