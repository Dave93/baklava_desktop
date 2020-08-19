<template>
  <v-app light>
    <v-container fluid class="py-0 px-0">
      <mainHeader />
      <nuxt />
    </v-container>
  </v-app>
</template>

<script>
import mainHeader from '@/components/mainHeader.vue'
export default {
  name: 'Cash',
  components: { mainHeader }
}
</script>

<style scoped></style>
