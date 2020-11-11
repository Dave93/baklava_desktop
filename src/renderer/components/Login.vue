<template>
  <v-app light>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="stretch" justify="start">
          <v-col cols="6">
            <div
              class="auth-back"
              :style="{
                backgroundImage: printLogo,
              }"
            ></div>
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
                        >Авторизация</v-card-title
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
                          placeholder="Выберите менеджера"
                        ></v-select>
                        <v-text-field
                          label="Пароль"
                          :type="show1 ? 'text' : 'password'"
                          v-model="password"
                          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                          :rules="passwordRules"
                          @keyup.enter="tryLogin"
                          required
                          outlined
                          rounded
                          @click:append="show1 = !show1"
                        />
                        <v-btn
                          color="primary"
                          :disabled="!authForm"
                          rounded
                          x-large
                          @click="tryLogin"
                          :loading="isAuthLoading"
                          >Войти</v-btn
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
          <v-card-title class="headline">Настройки приложения</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="saveSettings">
              <v-text-field
                :value="webHook"
                ref="webHook"
                label="Адрес API"
                outlined
                rounded
                @change="saveSettings"
              />
              <v-text-field
                :value="remotePrinterAddress"
                ref="remotePrinterAddress"
                label="Адрес удалённого принтера"
                outlined
                rounded
                @change="saveRemotePrinterAddress"
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
              <v-checkbox
                :value="isOldScale"
                label="Старые весы"
                @change="saveOldScale"
              ></v-checkbox>
              <v-text-field
                :value="comPortName"
                label="Название порта"
                v-if="isOldScale"
                outlined
                rounded
                @change="savePortName"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              :loading="isSavingSettings"
              text
              @click="closeDialog"
              >Сохранить</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="updateSnack" multi-line timeout="-1">
        Найдено обновление и скачивается
        <v-progress-circular
          :rotate="360"
          :size="100"
          :width="15"
          :value="downloadProgress"
          color="teal"
        >
          {{ downloadProgress }}
        </v-progress-circular>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
let { remote, ipcRenderer } = require("electron");
let webContents = remote.getCurrentWebContents();
let printers = webContents.getPrinters(); //list the printers
let printerNames = printers.map((item) => item.name);
export default {
  name: "Login",
  layout: "auth",
  data: () => ({
    printLogo: "static/images/auth.png",
    dialog: false,
    managers: [],
    isSavingSettings: false,
    isManagersFound: false,
    authForm: false,
    manager: "",
    password: "",
    show1: false,
    updateSnack: false,
    downloadProgress: 0,
    managerRules: [(v) => !!v || "Выберите менеджера"],
    passwordRules: [(v) => !!v || "Введите пароль"],
    authError: "",
    isAuthLoading: false,
    printers: printerNames,
  }),
  async mounted() {
    await this.tryGetManagers();
    ipcRenderer.on("updateAvailable", () => {
      this.updateSnack = true;
    });
    ipcRenderer.on(
      "downloadProgress",
      ({ progress, bytesPerSecond, percent }) => {
        this.updateSnack = true;
        this.downloadProgress = { progress, bytesPerSecond, percent };
      }
    );
  },
  computed: {
    ...mapGetters({
      webHook: "settings/webHook",
      chosenPrinter: "settings/chosenPrinter",
      isOldScale: "settings/isOldScale",
      comPortName: "settings/comPortName",
      remotePrinterAddress: "settings/remotePrinterAddress",
    }),
  },
  methods: {
    ...mapActions({
      setWebHook: "settings/setWebHook",
      setUserId: "settings/setUserId",
      setManagerData: "settings/setManagerData",
      setPrinter: "settings/setPrinter",
      setOldScaleCheckbox: "settings/setOldScaleCheckbox",
      setComPortName: "settings/setComPortName",
      setRemotePrinterAddress: "settings/setRemotePrinterAddress",
      setCategories: "setCategories",
      setProducts: "setProducts",
    }),
    saveSettings(val) {
      this.setWebHook({ val });
    },
    savePrinter(val) {
      this.setPrinter({ val });
    },
    saveOldScale(val) {
      this.setOldScaleCheckbox({ val });
    },
    savePortName(val) {
      this.setComPortName({ val });
    },
    saveRemotePrinterAddress(val) {
      this.setRemotePrinterAddress({ val });
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
              customCode: item.CUSTOM_CODE,
              selected: false,
              categoryId: item.ELEMENT_IBLOCK_SECTION_ID,
              image: item.PREVIEW_PICTURE,
              price: item.BASE_PRICE,
              type: item.type,
              totalAmountCount: item.TOTAL_AMOUNT_COUNT,
              childs: item.childs,
            })),
          });
          console.log(productsData);
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
