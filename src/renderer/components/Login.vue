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
                <v-col cols="9" class="pt-16 block-relative">
                  <v-form v-model="authForm" @submit="tryLogin">
                    <v-overlay :value="!isManagersFound" absolute>
                      <v-progress-circular
                        indeterminate
                        size="64"
                      ></v-progress-circular>
                    </v-overlay>
                    <v-card flat align="center">
                      <v-card-title class="headline justify-center"
                        >Sign In</v-card-title
                      >
                      <v-alert type="error" v-show="authError.length">{{
                        authError
                      }}</v-alert>
                      <v-card-text>
                        <v-select
                          :items="managers"
                          label="Manager"
                          v-model="manager"
                          :rules="managerRules"
                          outlined
                          required
                          rounded
                          placeholder="Choose your account"
                        ></v-select>
                        <v-text-field
                          label="Password"
                          type="password"
                          v-model="password"
                          :rules="passwordRules"
                          required
                          outlined
                          rounded
                        />
                        <v-btn
                          color="primary"
                          :disabled="!authForm"
                          rounded
                          x-large
                          @click="tryLogin"
                          :loading="isAuthLoading"
                          >Sign In</v-btn
                        >
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
                @change="saveSettings"
              />
              <v-select
                outlined
                rounded
                :items="printers"
                :value="chosenPrinter"
                label="Выберите принтер"
                @change="savePrinter"
              >
              </v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              :loading="isSavingSettings"
              text
              @click="closeDialog"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
let { remote } = require("electron");
let webContents = remote.getCurrentWebContents();
let printers = webContents.getPrinters(); //list the printers
let printerNames = printers.map((item) => item.name);
export default {
  name: "Login",
  layout: "auth",
  data: () => ({
    dialog: false,
    managers: [],
    isSavingSettings: false,
    isManagersFound: false,
    authForm: false,
    manager: "",
    password: "",
    managerRules: [(v) => !!v || "Выберите менеджера"],
    passwordRules: [(v) => !!v || "Введите пароль"],
    authError: "",
    isAuthLoading: false,
    printers: printerNames,
  }),
  async mounted() {
    await this.tryGetManagers();
  },
  computed: {
    ...mapGetters({
      webHook: "settings/webHook",
      chosenPrinter: "settings/chosenPrinter",
    }),
  },
  methods: {
    ...mapActions({
      setWebHook: "settings/setWebHook",
      setUserId: "settings/setUserId",
      setManagerData: "settings/setManagerData",
      setPrinter: "settings/setPrinter",
      setCategories: "setCategories",
      setProducts: "setProducts",
    }),
    saveSettings(val) {
      this.setWebHook({ val });
    },
    savePrinter(val) {
      this.setPrinter({ val });
    },
    async closeDialog() {
      this.isSavingSettings = true;
      await this.tryGetManagers();
      this.isSavingSettings = false;
      this.dialog = false;
    },
    async tryGetManagers() {
      try {
        this.managers = [];
        this.isManagersFound = false;
        const { data } = await this.$http.get(
          this.webHook + "mymanager.user.getList?filter[UF_MANAGER]=1"
        );
        if (data.result && data.result.length) {
          this.managers = data.result.map((item) => ({
            value: item.LOGIN,
            text: `${item.LAST_NAME} ${item.NAME}`,
          }));
          this.isManagersFound = true;
        } else {
          this.isManagersFound = false;
        }
      } catch (e) {
        this.isManagersFound = false;
      }
    },
    async tryLogin() {
      this.authError = "";
      this.isAuthLoading = true;
      try {
        let { data } = await this.$http.get(
          `${this.webHook}myuser.manager.auth?login=${
            this.manager
          }&password=${btoa(this.password)}`
        );
        if (data.result && data.result.ID) {
          await this.setUserId({ val: data.result.ID });
          await this.setManagerData({ val: data.result });
          let { data: categoriesData } = await this.$http.get(
            `${this.webHook}mycatalog.section.list`
          );
          await this.setCategories({
            val: categoriesData.result.map((item) => ({
              id: item.ID,
              name: item.NAME,
            })),
          });
          let { data: productsData } = await this.$http.get(
            `${this.webHook}mycatalog.product.list?managerId=${data.result.ID}`
          );
          await this.setProducts({
            val: productsData.result.map((item) => ({
              id: item.ID,
              name: item.ELEMENT_NAME,
              barcode: item.BARCODE_BARCODE,
              selected: false,
              categoryId: item.ELEMENT_IBLOCK_SECTION_ID,
              image: item.PREVIEW_PICTURE,
              price: item.BASE_PRICE,
              totalAmountCount: item.TOTAL_AMOUNT_COUNT,
            })),
          });
          this.isAuthLoading = false;
          await this.$router.push("/main");
        } else {
          this.isAuthLoading = false;
          this.authError = "Неверный пароль";
        }
      } catch (e) {
        console.log(e);
        this.isAuthLoading = false;
        this.authError = "Неверный пароль";
      }
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
.block-relative {
  position: relative;
}
</style>
