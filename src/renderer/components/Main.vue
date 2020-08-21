<template>
  <v-app light>
    <v-main>
      <v-row class="pa-0 ma-0 header-background-color flex align-center">
        <v-col cols="4" class="py-0">
          <v-card class="mx-auto header-background-color" flat>
            <v-list-item>
              <v-list-item-avatar size="40" rounded class="manager-avatar">
                <img
                  src="https://cdn.vuetifyjs.com/images/john.jpg"
                  alt="John"
                />
              </v-list-item-avatar>
              <div class="flex">
                <div class="font-weight-medium white-text">Seller's name</div>
              </div>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="4" class="py-0">
          <div class="ma-auto">
            <span
              class="d-flex headline font-weight-light justify-center ma-auto white-text text-uppercase"
            >
              Gavali
            </span>
          </div>
        </v-col>
        <v-col cols="4" class="d-flex align-center justify-end py-0">
          <div class="">
            <div class="white-text px-2">
              {{ currentDate }}
            </div>
            <h2 class="font-weight-medium px-2 white-text">
              {{ currentTime }}
            </h2>
          </div>
          <v-btn icon color="green" large @click="logout">
            <v-icon>mdi-lock-open-variant-outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-container fluid class="grey lighten-3 px-6 py-0">
        <v-row>
          <v-col cols="7" class="d-flex flex-row">
            <v-card width="100%">
              <v-card-text style="height: 100%;">
                <v-row>
                  <v-col cols="12" class="mt-n3">
                    <v-btn
                      color="grey"
                      x-large
                      width="100%"
                      @click="showSearchDialog = true"
                      >Enter or Search Product</v-btn
                    >
                  </v-col>
                </v-row>
                <div
                  class="d-flex flex-column justify-space-between"
                  style="height: 90%;"
                >
                  <ejs-grid :dataSource="cartItems" ref="grid">
                    <e-columns>
                      <e-column
                        field="name"
                        headerText="Название"
                        width="90"
                      ></e-column>
                      <e-column
                        field="img"
                        headerText="Фото"
                        width="90"
                        :template="cTemplate"
                      ></e-column>
                      <e-column
                        field="price"
                        headerText="Цена"
                        width="90"
                      ></e-column>
                      <e-column
                        field="weight"
                        headerText="Вес"
                        width="90"
                      ></e-column>
                      <e-column
                        field="totalPrice"
                        headerText="Итоговая цена"
                        width="90"
                      ></e-column>
                    </e-columns>
                  </ejs-grid>
                  <div>
                    <v-divider></v-divider>
                    <v-row>
                      <v-col cols="6">
                        <v-row>
                          <v-col cols="6"><h3>SubTotal</h3></v-col>
                          <v-col cols="6"
                            ><h3>{{ subTotalPrice | money }} сум</h3></v-col
                          >
                        </v-row>
                        <v-row>
                          <v-col cols="6"><h3>Discount</h3></v-col>
                          <v-col cols="6"
                            ><h3>{{ discountValue }} %</h3></v-col
                          >
                        </v-row>
                      </v-col>
                      <v-col class="pt-6">
                        <div class="text-right">
                          <h2 class="text-uppercase">Total Price</h2>
                          <h1 class="display-3 font-weight-bold">
                            {{ totalPrice | money }} сум
                          </h1>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="5" class="mt-n3">
            <v-row>
              <v-col cols="7">
                <div>
                  <v-card class="mx-auto selected-product-info" elevation="5">
                    <v-img
                      class="white--text align-end"
                      height="140px"
                      src="static/images/rahat.png"
                    >
                    </v-img>
                    <v-card-title>Rahat Lokum</v-card-title>
                    <v-card-subtitle>Code: 44788523314</v-card-subtitle>
                    <v-card-text>
                      <div class="display-1">50 000 сум</div>
                    </v-card-text>
                  </v-card>
                  <v-card
                    class="keyboard-background px-10 selected-product-weight my-3"
                    elevation="5"
                  >
                    <h1 class="font-weight-medium black--text">
                      {{ currentWeight || "0" }}
                    </h1>
                  </v-card>
                  <v-card
                    class="keyboard-background px-10 weight-keyboard"
                    elevation="5"
                  >
                    <v-row class="mb-n4">
                      <v-col cols="12" class="pl-0">
                        <v-row>
                          <v-col cols="6">
                            <v-btn
                              @click="append('-')"
                              color="black"
                              rounded
                              height="56"
                              width="100%"
                              class="justify-center"
                              ><h1 class="font-weight-bold green--text">
                                -
                              </h1></v-btn
                            >
                          </v-col>
                          <v-col cols="6">
                            <v-btn
                              @click="append('+')"
                              color="black"
                              rounded
                              height="56"
                              width="100%"
                              class="justify-center"
                              ><h1 class="font-weight-bold green--text">
                                +
                              </h1></v-btn
                            >
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="9" class="pl-0">
                        <v-row class="mb-n4">
                          <v-col cols="4">
                            <v-btn fab color="black" @click="append('7')"
                              ><h1 class="font-weight-bold green--text">
                                7
                              </h1></v-btn
                            >
                          </v-col>
                          <v-col cols="4">
                            <v-btn fab color="black" @click="append('8')"
                              ><h1 class="font-weight-bold green--text">
                                8
                              </h1></v-btn
                            >
                          </v-col>
                          <v-col cols="4">
                            <v-btn fab color="black" @click="append('9')"
                              ><h1 class="font-weight-bold green--text">
                                9
                              </h1></v-btn
                            >
                          </v-col>
                        </v-row>
                        <v-row class="mb-n4">
                          <v-col cols="4">
                            <v-btn fab color="black" @click="append('4')"
                              ><h1 class="font-weight-bold green--text">
                                4
                              </h1></v-btn
                            >
                          </v-col>
                          <v-col cols="4">
                            <v-btn fab color="black" @click="append('5')"
                              ><h1 class="font-weight-bold green--text">
                                5
                              </h1></v-btn
                            >
                          </v-col>
                          <v-col cols="4">
                            <v-btn fab color="black" @click="append('6')"
                              ><h1 class="font-weight-bold green--text">
                                6
                              </h1></v-btn
                            >
                          </v-col>
                        </v-row>
                        <v-row class="mb-n4">
                          <v-col cols="4">
                            <v-btn fab color="black" @click="append('1')"
                              ><h1 class="font-weight-bold green--text">
                                1
                              </h1></v-btn
                            >
                          </v-col>
                          <v-col cols="4">
                            <v-btn fab color="black" @click="append('2')"
                              ><h1 class="font-weight-bold green--text">
                                2
                              </h1></v-btn
                            >
                          </v-col>
                          <v-col cols="4">
                            <v-btn fab color="black" @click="append('3')"
                              ><h1 class="font-weight-bold green--text">
                                3
                              </h1></v-btn
                            >
                          </v-col>
                        </v-row>
                        <v-row class="mb-n4">
                          <v-col cols="8" class="pr-0">
                            <v-btn
                              rounded
                              height="56"
                              width="100%"
                              color="black"
                              class="justify-start"
                              @click="append('0')"
                              ><h1 class="font-weight-bold green--text pl-1">
                                0
                              </h1>
                              <v-spacer></v-spacer
                            ></v-btn>
                          </v-col>
                          <v-col cols="4">
                            <v-btn fab color="black" @click="dot(',')"
                              ><h1 class="font-weight-bold green--text">
                                ,
                              </h1></v-btn
                            >
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="3">
                        <v-row class="mb-n4">
                          <v-col cols="12">
                            <v-btn fab color="black"
                              ><h1
                                class="font-weight-bold green--text"
                                @click="substr('currentWeight')"
                              >
                                &larr;
                              </h1></v-btn
                            >
                          </v-col>
                        </v-row>
                        <v-row class="mb-n4">
                          <v-col cols="12">
                            <v-btn @click="clear" fab color="black"
                              ><h1 class="font-weight-bold green--text">
                                C
                              </h1></v-btn
                            >
                          </v-col>
                        </v-row>
                        <v-row class="mb-n4">
                          <v-col cols="12">
                            <v-btn
                              @click="equal"
                              rounded
                              color="black"
                              height="120px"
                              width="56"
                              small
                              ><h1 class="font-weight-bold green--text">
                                &crarr;
                              </h1></v-btn
                            >
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card>
                </div>
              </v-col>
              <v-col cols="5" class="d-flex flex-column justify-space-between">
                <div class="mx-n3">
                  <v-card rounded elevation="5">
                    <v-card-text>
                      <div class="mb-4">
                        <div>Client # 33045059</div>
                        <h2 class="font-weight-medium text--primary">
                          Client Name
                        </h2>
                      </div>
                      <div class="mb-4">
                        <div>
                          Phone
                        </div>
                        <div class="font-weight-bold">
                          +998900000000
                        </div>
                      </div>
                      <div class="mb-4">
                        <div>
                          Email
                        </div>
                        <div class="font-weight-bold">
                          info@gavali.com
                        </div>
                      </div>
                    </v-card-text>
                    <v-card-actions class="justify-lg-space-around">
                      <v-btn icon x-large color="success">
                        <v-icon>mdi-magnify</v-icon>
                      </v-btn>
                      <v-btn icon x-large color="success">
                        <v-icon>mdi-pencil-outline</v-icon>
                      </v-btn>
                      <v-btn icon x-large color="success">
                        <v-icon>mdi-account-plus-outline</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </div>
                <div>
                  <v-row>
                    <v-col cols="4"></v-col>
                    <v-col cols="4">
                      <v-btn
                        color="grey darken-3"
                        class="green--text"
                        width="60"
                        height="70"
                      >
                        <v-icon large>mdi-printer</v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="4" class="pr-0">
                      <v-btn
                        color="grey darken-3"
                        class="red--text"
                        width="60"
                        height="70"
                      >
                        <v-icon large>mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" class="pr-0">
                      <v-btn
                        color="green accent-3"
                        width="100%"
                        height="70"
                        @click="showPayMethodDialog = true"
                      >
                        <v-icon large>mdi-cart-outline</v-icon>
                        <h1 class="font-weight-medium">Shop</h1>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
      <v-dialog v-model="showSearchDialog">
        <div>
          <v-card>
            <v-card-text>
              <v-row class="align-baseline">
                <v-col cols="10">
                  <v-text-field
                    v-model="searchText"
                    placeholder="Search..."
                    rounded
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="2">
                  <v-switch v-model="set" label="Set" dense></v-switch>
                </v-col>
              </v-row>
              <v-row v-show="set">
                <v-col cols="12">
                  <v-text-field
                    label="Set Name"
                    placeholder="Type set name"
                    rounded
                    outlined
                    dense
                  />
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-slide-group show-arrows class="py-6">
                <v-slide-item v-slot:default="{ active, toggle }">
                  <v-card
                    height="75"
                    width="90"
                    :color="active ? 'primary' : ''"
                    class="d-flex align-center mx-2 justify-center my-2"
                    @click="
                      (e) => {
                        toggle(e);
                        categoryToggle(0);
                      }
                    "
                  >
                    <v-card-title class="subtitle-2">All</v-card-title>
                  </v-card>
                </v-slide-item>
                <v-slide-item
                  v-for="category in categories"
                  :key="category.id"
                  v-slot:default="{ active, toggle }"
                >
                  <v-card
                    height="75"
                    width="90"
                    :color="active ? 'primary' : ''"
                    class="d-flex align-center mx-2 justify-center my-2"
                    @click="
                      (e) => {
                        toggle(e);
                        categoryToggle(category.id);
                      }
                    "
                  >
                    <v-card-title class="subtitle-2">{{
                      category.name
                    }}</v-card-title>
                  </v-card>
                </v-slide-item>
              </v-slide-group>
              <v-divider></v-divider>
              <div class="product-list-block">
                <v-item-group class="ml-2 mr-6 py-6" multiple>
                  <v-row>
                    <v-col
                      v-for="item in filteredProducts"
                      :key="item.id"
                      cols="12"
                      md="2"
                    >
                      <v-item v-slot:default="{ active, toggle }">
                        <v-card
                          max-width="200"
                          :color="active ? 'primary' : ''"
                          class="mx-auto"
                          height="200"
                          @click="toggle"
                        >
                          <v-img
                            class="white--text align-end"
                            :src="(item.image ? domainUrl + item.image : '')"
                          >
                          </v-img>
                          <v-card-title> {{ item.name }} </v-card-title>
                        </v-card>
                      </v-item>
                    </v-col>
                  </v-row>
                </v-item-group>
              </div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary">Ok</v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-dialog>
      <v-dialog v-model="showPayMethodDialog" style="width: 400px;">
        <v-card>
          <v-card-text>
            <v-slide-group show-arrows class="py-6">
              <v-slide-item v-slot:default="{ active, toggle }">
                <v-card
                  height="75"
                  width="90"
                  :color="cashBtn ? 'primary' : ''"
                  class="d-flex align-center mx-2 justify-center my-2"
                  @click="() => togglePaymentType('cash')"
                >
                  <v-card-title class="subtitle-2">Cash</v-card-title>
                </v-card>
              </v-slide-item>
              <v-slide-item v-slot:default="{ active, toggle }">
                <v-card
                  height="75"
                  width="90"
                  :color="cardBtn ? 'primary' : ''"
                  class="d-flex align-center mx-2 justify-center my-2"
                  @click="() => togglePaymentType('card')"
                >
                  <v-card-title class="subtitle-2">Card</v-card-title>
                </v-card>
              </v-slide-item>
            </v-slide-group>
          </v-card-text>
        </v-card>
        <v-row style="background-color: #ffffff;" class="mx-md-auto">
          <v-col cols="4" class="">
            <v-card flat class="keyboard-background px-10 weight-keyboard">
              <v-row>
                <v-col cols="9" class="pl-0">
                  <v-row class="mb-n4">
                    <v-col cols="4">
                      <v-btn fab color="black" @click="shopAppend('7')"
                        ><h1 class="font-weight-bold green--text">7</h1></v-btn
                      >
                    </v-col>
                    <v-col cols="4">
                      <v-btn fab color="black" @click="shopAppend('8')"
                        ><h1 class="font-weight-bold green--text">8</h1></v-btn
                      >
                    </v-col>
                    <v-col cols="4">
                      <v-btn fab color="black" @click="shopAppend('9')"
                        ><h1 class="font-weight-bold green--text">9</h1></v-btn
                      >
                    </v-col>
                  </v-row>
                  <v-row class="mb-n4">
                    <v-col cols="4">
                      <v-btn fab color="black" @click="shopAppend('4')"
                        ><h1 class="font-weight-bold green--text">4</h1></v-btn
                      >
                    </v-col>
                    <v-col cols="4">
                      <v-btn fab color="black" @click="shopAppend('5')"
                        ><h1 class="font-weight-bold green--text">5</h1></v-btn
                      >
                    </v-col>
                    <v-col cols="4">
                      <v-btn fab color="black" @click="shopAppend('6')"
                        ><h1 class="font-weight-bold green--text">6</h1></v-btn
                      >
                    </v-col>
                  </v-row>
                  <v-row class="mb-n4">
                    <v-col cols="4">
                      <v-btn fab color="black" @click="shopAppend('1')"
                        ><h1 class="font-weight-bold green--text">1</h1></v-btn
                      >
                    </v-col>
                    <v-col cols="4">
                      <v-btn fab color="black" @click="shopAppend('2')"
                        ><h1 class="font-weight-bold green--text">2</h1></v-btn
                      >
                    </v-col>
                    <v-col cols="4">
                      <v-btn fab color="black" @click="shopAppend('3')"
                        ><h1 class="font-weight-bold green--text">3</h1></v-btn
                      >
                    </v-col>
                  </v-row>
                  <v-row class="mb-n4">
                    <v-col cols="8" class="pr-0">
                      <v-btn
                        rounded
                        height="56"
                        width="100%"
                        color="black"
                        class="justify-start"
                        @click="shopAppend('0')"
                        ><h1 class="font-weight-bold green--text pl-1">0</h1>
                        <v-spacer></v-spacer
                      ></v-btn>
                    </v-col>
                    <v-col cols="4">
                      <v-btn fab color="black"
                        ><h1 class="font-weight-bold green--text">,</h1></v-btn
                      >
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="3">
                  <v-row class="mb-n4">
                    <v-col cols="12">
                      <v-btn
                        fab
                        color="black"
                        @click="substr(['cashPrice', 'cardPrice'])"
                        ><h1 class="font-weight-bold green--text">
                          &larr;
                        </h1></v-btn
                      >
                    </v-col>
                  </v-row>
                  <v-row class="mb-n4">
                    <v-col cols="12">
                      <v-btn fab color="black" @click="cashClear"
                        ><h1 class="font-weight-bold green--text">C</h1></v-btn
                      >
                    </v-col>
                  </v-row>
                  <v-row class="mb-n4">
                    <v-col cols="12">
                      <v-btn
                        rounded
                        color="black"
                        height="120px"
                        width="56"
                        small
                        ><h1 class="font-weight-bold green--text">
                          &crarr;
                        </h1></v-btn
                      >
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>

            <v-btn color="green accent-3" width="100%" height="70">
              <h1 class="font-weight-medium">Total</h1>
            </v-btn>
          </v-col>
          <div class="col-md-4">
            <v-row>
              <v-col cols="6"> <h2>Total Price</h2></v-col>
              <v-col cols="6"
                ><div class="display-1 font-weight-bold">
                  {{ totalPrice | money }} сум
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6"><h3>Cash</h3></v-col>
              <v-col cols="6"
                ><h3>{{ parseInt(cashPrice, 10) || 0 | money }} сум</h3></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="6"><h3>Card</h3></v-col>
              <v-col cols="6"
                ><h3>{{ parseInt(cardPrice, 10) || 0 | money }} сум</h3></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="6"><h3>Change</h3></v-col>
              <v-col cols="6"
                ><div class="display-1 font-weight-bold">
                  {{ change }} сум
                </div></v-col
              >
            </v-row>

            <v-col class="pt-6">
              <div class="text-right"></div>
            </v-col>
          </div>
        </v-row>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import { format } from "date-fns";
import psl from "psl";
import product from "@/store/index";
import { mapGetters, mapActions } from "vuex";

export default {
  data: () => ({
    cashPrice: "",
    cardPrice: "",
    changePrice: "",
    cashBtn: true,
    cardBtn: false,
    currentWeight: "",
    operator: null,
    previous: null,
    operatorClicked: false,
    showSearchDialog: false,
    set: false,
    searchText: "",
    currentCategoryId: 0,
    showPayMethodDialog: false,
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      {
        text: "Image",
        sortable: false,
        value: "img",
      },
      { text: "Price", value: "price", sortable: false },
      { text: "Weight", value: "weight", sortable: false },
      { text: "Total Price", value: "totalPrice" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    cartItems: [],
    discountValue: 10,
    time: new Date(),
    cTemplate: function () {
      return {
        template: Vue.component("columnTemplate", {
          template: ` <v-list-item-avatar
                          size="40"
                          rounded
                          class="manager-avatar"
                        >
                          <img :src="data.img" alt="photo" />
                        </v-list-item-avatar>`,
          data: function () {
            return {
              data: {},
            };
          },
        }),
      };
    },
  }),
  computed: {
    ...mapGetters({
      webHook: "settings/webHook",
    }),
    domainUrl() {
      console.log(this.webHook);
      console.log(this.getHostname(this.webHook));
      return "https://" + this.getHostname(this.webHook);
    },
    subTotalPrice() {
      return this.cartItems.reduce((previousValue, currentValue) => {
        return (
          previousValue.price * +previousValue.weight +
          currentValue.price * +currentValue.weight
        );
      }, 0);
    },
    totalPrice() {
      const totalPrice = this.cartItems.reduce(
        (previousValue, currentValue) => {
          return (
            previousValue.price * +previousValue.weight +
            currentValue.price * +currentValue.weight
          );
        },
        0
      );

      return totalPrice * ((100 - this.discountValue) / 100);
    },
    currentDate() {
      return format(this.time, "d MMM YYY");
    },
    currentTime() {
      return format(this.time, "HH:mm:ss");
    },
    items: () => {
      return product.getters.items;
    },
    categories: () => {
      return product.getters.categories;
    },
    // ...mapGetters({
    //   categories: "product/categories",
    //   items: "product/items",
    // }),
    filteredProducts() {
      if (this.currentCategoryId > 0) {
        return this.items.filter(
          (item) => item.categoryId === this.currentCategoryId
        );
      }
      if (this.searchText.length > 0) {
        return this.items.filter(
          (item) =>
            item.name.toLowerCase().includes(this.searchText) ||
            item.barcode.toString().indexOf(this.searchText) === 0
        );
      }
      return this.items;
    },
    change() {
      // if (res < 0) {
      //   return 0;
      // }
      return +this.cashPrice + +this.cardPrice - +this.totalPrice;
    },
  },
  mounted() {
    setInterval(() => {
      this.time = new Date();
    }, 1000);

    this.$refs.grid.hideSpinner();
    console.log(this.items);
  },
  methods: {
    getHostname: (url) => {
      // use URL constructor and return hostname
      return new URL(url).hostname;
    },
    logout() {
      this.$router.push("/login");
    },
    clear() {
      this.currentWeight = "";
    },
    cashClear() {
      if (this.cashBtn) {
        this.cashPrice = "";
      }
      if (this.cardBtn) {
        this.cardPrice = "";
      }
    },
    append(number) {
      if (["+", "-"].includes(number)) {
        if (!this.currentWeight) {
          return;
        }
        if (this.currentWeight.indexOf(number) === -1) {
          this.currentWeight = this.currentWeight + number;
        }
      } else {
        this.currentWeight = this.currentWeight + number;
      }
    },
    shopAppend(number) {
      if (this.cashBtn) {
        this.cashPrice = this.cashPrice + number;
      }
      if (this.cardBtn) {
        this.cardPrice = this.cardPrice + number;
      }
    },
    substr(param) {
      if (param === "currentWeight") {
        this.currentWeight = this.currentWeight.substring(
          0,
          this.currentWeight.length - 1
        );
      }
      if (param.includes("cashPrice") && this.cashBtn) {
        this.cashPrice = this.cashPrice.substring(0, this.cashPrice.length - 1);
      }
      if (param.includes("cardPrice") && this.cardBtn) {
        this.cardPrice = this.cardPrice.substring(0, this.cardPrice.length - 1);
      }
    },
    dot() {
      if (this.currentWeight.indexOf(",") === -1) {
        this.append(",");
      }
    },
    equal() {
      this.currentWeight = eval(this.currentWeight);
    },
    changeItem(key, val) {},
    categoryToggle(id) {
      this.currentCategoryId = id;
    },
    togglePaymentType(type) {
      if (type === "cash") {
        this.cardBtn = false;
        this.cashBtn = true;
      } else {
        this.cardBtn = true;
        this.cashBtn = false;
      }
    },
  },
  filters: {
    money: (value) => {
      return value && value.toLocaleString();
    },
  },
};
</script>

<style scoped>
.keyboard-background {
  background-color: #79808a !important;
}
.selected-product-info {
  flex: 1;
}
.selected-product-weight {
  flex: 1;
  color: black;
}
.weight-keyboard {
  flex: 1;
}
.manager-avatar {
  border: 2px solid #4caf50 !important;
}
.header-background-color {
  background-color: #4a4a4a !important;
}
.white-text {
  color: #fff !important;
}
.product-list-block {
  height: 400px;
  overflow-y: auto;
}
</style>
