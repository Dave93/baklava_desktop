<template>
  <span>{{ printValue }}</span>
</template>

<script>
import Vue from "vue";
import currency from "currency.js";

export default Vue.extend({
  computed: {
    printValue() {
      const val = this.params.value || 0;
      return currency(+val, {
        symbol: "",
        separator: " ",
        decimal: ",",
      }).format();
    },
  },
});
</script>

<style scoped></style>
