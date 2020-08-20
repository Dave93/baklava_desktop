<template>
  <v-app light>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="stretch" justify="start">
          <v-col cols="6">
            <div class="auth-back"></div>
          </v-col>
          <v-col cols="6" class="mt-n6">
            <div>
              <v-row>
                <v-col cols="10"></v-col>
                <v-col cols="2">
                  <v-btn icon @click="dialog = true">
                    <v-icon>mdi-cog</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <div class="auth-right-side">
              <v-row align="center" justify="center">
                <v-col cols="9" class="pt-16">
                  <v-form>
                    <v-card flat align="center">
                      <v-card-title class="headline justify-center"
                        >Sign In222</v-card-title
                      >
                      <v-card-text>
                        <v-select
                          :items="managers"
                          label="Manager"
                          outlined
                          rounded
                          placeholder="Choose your account"
                        ></v-select>
                        <v-text-field
                          label="Password"
                          type="password"
                          outlined
                          rounded
                        />
                        <router-link to="/main">
                          <v-btn color="primary" rounded x-large>Sign In</v-btn>
                        </router-link>
                      </v-card-text>
                    </v-card>
                  </v-form>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-dialog v-model="dialog" persistent max-width="500">
        <v-card>
          <v-card-title class="headline">Site Configs</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="saveSettings">
              <v-text-field
                :value="webHook"
                ref="webHook"
                label="Site address"
                outlined
                rounded
              />
              <v-text-field label="API Token" outlined rounded />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="saveSettings"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import settings from "@/store/index";
export default {
  name: "Login",
  layout: "auth",
  data: () => ({
    dialog: false,
    managers: ["Manager 1", "Manager 2", "Manager 3"],
  }),
  computed: {
    webHook: () => {
      return settings.getters.webHook;
    },
  },
  methods: {
    saveSettings() {
      this.dialog = false;
      settings.dispatch("setWebHook", {
        val: this.$refs.webHook.value,
      });
    },
  },
};
</script>

<style scoped>
.auth-back {
  background-image: url("/static/images/auth.png");
  background-size: contain;
  width: 100%;
  height: 100vh;
  margin-left: -15px;
  margin-bottom: -25px;
  margin-top: -25px;
}
.auth-right-side {
  height: 85vh;
  margin-bottom: -25px;
}
</style>
