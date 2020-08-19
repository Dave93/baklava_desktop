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
                  <nuxt />
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
            <v-form>
              <v-text-field label="Site address" outlined rounded />
              <v-text-field label="API Token" outlined rounded />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialog = false"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'Auth',
  data: () => ({
    dialog: false
  })
}
</script>

<style scoped>
.auth-back {
  background-image: url('~assets/images/auth.png');
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
