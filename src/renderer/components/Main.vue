<template>
  <v-app>
    <div class="d-flex justify-space-between">
      <v-tabs v-model="currentTab" centered>
        <v-tab v-for="(n, index) in cartTabs" :key="index">
          {{ n.title }}
        </v-tab>
      </v-tabs>
      <v-btn
        class="mx-2 my-2 accent-3"
        x-small
        fab
        color="green"
        elevation="1"
        @click="addCartTab"
      >
        <v-icon color="black">
          mdi-plus
        </v-icon>
      </v-btn>
    </div>
    <v-tabs-items v-model="currentTab">
      <v-tab-item v-for="(n, index) in cartTabs" :key="index">
        <v-card flat>
          <v-card-text class="px-0 py-0">
            <CartPage @closeTab="closeCurrentTab" />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import CartPage from "./CartPage.vue";
export default {
  components: {
    CartPage
  },
  data: () => ({
    currentTab: null
    // currentScaleWeight: 0,
  }),
  computed: {
    ...mapGetters({
      cartTabs: "cartTabs"
      // comPortName: "settings/comPortName",
    })
  },
  methods: {
    ...mapActions(["appendCartTab", "closeTabByIndex"]),
    addCartTab() {
      this.appendCartTab();
    },
    closeCurrentTab() {
      console.log(this.currentTab);
      if (this.cartTabs.length === 1) {
        this.addCartTab();
      }
      this.closeTabByIndex({ index: this.currentTab });
    }
  },
  mounted: {
    // listenOldScale() {
    //   this.scaleWeightInterval = setInterval(async () => {
    //     try {
    //       let {data} = await this.$http.get(
    //           "http://localhost:8888/api/Scale?portName=" + this.comPortName
    //       );
    //       if (data.length && data[0]) {
    //         this.currentScaleWeight = +data[0];
    //       }
    //     } catch (e) {
    //     }
    //     if (!this.isMinusScale && !this.isPlusScale) {
    //       clearInterval(this.scaleWeightInterval);
    //       this.scaleWeightInterval = null;
    //     }
    //   }, 100);
    // },
  },
};
</script>
