<template>
  <v-app light>
    <v-main>
      <v-row class="pa-0 ma-0 header-background-color flex align-center">
        <v-col cols="4" class="py-0">
          <v-card class="mx-auto header-background-color" flat>
            <v-list-item>
              <div class="flex">
                <div class="font-weight-medium white-text">
                  Менеджер: {{ managerData.LAST_NAME }} {{ managerData.NAME }}
                </div>
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
              <v-card-text style="height: 100%;" class="pb-0">
                <v-row>
                  <v-col cols="12" class="mt-n3">
                    <v-btn
                      color="grey"
                      x-large
                      width="100%"
                      @click="
                        () => {
                          this.showSearchDialog = true;
                          this.selectedCartItem = {};
                        }
                      "
                      >Поиск товара</v-btn
                    >
                  </v-col>
                </v-row>
                <div
                  class="d-flex flex-column justify-space-between"
                  style="height: 90%;"
                >
                  <ag-grid-vue
                    :style="(showSetsGrid ? 'width: 100%; height: 200px;' : 'width: 100%; height: 500px;')"
                    class="ag-theme-material"
                    :columnDefs="cartColumns"
                    :rowData="singleProducts"
                    rowSelection="single"
                    :context="context"
                    :frameworkComponents="frameworkComponents"
                    @selection-changed="cartItemSelected"
                    :gridOptions="gridOptions"
                    :detailCellRendererParams="detailCellRendererParams"
                    :defaultColDef="defaultColDef"
                  >
                  </ag-grid-vue>
                  <div v-if="showSetsGrid">
                    <h2>Сеты</h2>
                    <ag-grid-vue
                      :style="(showSetsGrid ? 'width: 100%; height: 250px;' : '')"
                      class="ag-theme-material"
                      :columnDefs="cartColumns"
                      :rowData="setProducts"
                      rowSelection="single"
                      :context="context"
                      :frameworkComponents="frameworkComponents"
                      @selection-changed="cartSetItemSelected"
                      :gridOptions="gridSetOptions"
                      :masterDetail="true"
                      :detailCellRendererParams="detailCellRendererParams"
                      :defaultColDef="defaultColDef"
                    >
                    </ag-grid-vue>
                  </div>
                  <div>
                    <v-divider></v-divider>
                    <v-row>
                      <v-col cols="6">
                        <v-row>
                          <v-col cols="6"><h3>Сумма</h3></v-col>
                          <v-col cols="6"
                            ><h3>{{ subTotalPrice | money }} сум</h3></v-col
                          >
                        </v-row>
                        <v-row>
                          <v-col cols="6"><h3>Скидка</h3></v-col>
                          <v-col cols="6"
                            ><h3>
                              {{ discountValue }}
                              <template v-if="discountValue > 0"
                                ><template v-if="discountToggle === 'percent'"
                                  >%</template
                                >
                                <template v-else>сум</template></template
                              >
                              <template v-else></template></h3
                          ></v-col>
                        </v-row>
                      </v-col>
                      <v-col class="pt-6">
                        <div class="text-right">
                          <h2 class="text-uppercase">Итоговая сумма</h2>
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
              <v-col cols="5">
                <v-card
                  class="mx-auto selected-product-info"
                  elevation="5"
                  min-height="150px"
                >
                  <div v-if="selectedCartItem.id">
                    <v-card-title class="text-break">{{
                      selectedCartItem.name
                    }}</v-card-title>
                    <v-card-subtitle v-show="selectedCartItem.barcode"
                      >Штрих-код:
                      {{ selectedCartItem.barcode }}</v-card-subtitle
                    >
                    <v-card-text>
                      <div class="headline" v-show="selectedCartItem.price">
                        {{ selectedCartItem.price | money }} сум
                      </div>
                    </v-card-text>
                  </div>
                  <div v-else>
                    <div class="title text-center pt-16">
                      Продукт не выбран
                    </div>
                  </div>
                </v-card>
                <div class="mt-6">
                  <v-card rounded elevation="5" min-height="300px">
                    <v-card-text v-if="showClientEditor || showAddEditor">
                      <div class="title">
                        {{
                          showClientEditor && currentClient.ID
                            ? "Редактирование"
                            : "Добавление"
                        }}
                      </div>
                      <v-form ref="form" v-model="valid">
                        <v-text-field
                          v-model="clientFirstName"
                          :rules="firstNameRules"
                          label="Фамилия"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-model="clientName"
                          :rules="nameRules"
                          label="Имя"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-model="clientPhone"
                          label="Телефон"
                        ></v-text-field>
                        <v-text-field
                          v-model="clientEmail"
                          label="Email"
                        ></v-text-field>
                        <v-btn
                          :disabled="!valid"
                          :loading="savingClientLoading"
                          color="green"
                          class="mr-4 accent-3"
                          @click="saveClient"
                        >
                          Сохранить
                        </v-btn>
                      </v-form>
                    </v-card-text>
                    <v-card-text v-else>
                      <vue-select
                        label="NAME"
                        placeholder="Поиск клиента"
                        class="mb-4"
                        v-model="currentClient"
                        :options="options"
                        :clearable="false"
                        @search="onSearch"
                      >
                        <template slot="no-options">
                          Введите имя клиента
                        </template>
                      </vue-select>
                      <div v-if="currentClient.ID">
                        <div class="mb-4">
                          <div>Client # {{ currentClient.ID }}</div>
                          <h2 class="font-weight-medium text--primary">
                            {{ currentClient.NAME }}
                          </h2>
                        </div>
                        <div class="mb-4">
                          <div>
                            Phone
                          </div>
                          <div class="font-weight-bold">
                            {{ currentClient.PERSONAL_PHONE }}
                          </div>
                        </div>
                        <div class="mb-4">
                          <div>
                            Email
                          </div>
                          <div class="font-weight-bold">
                            {{ currentClient.EMAIL }}
                          </div>
                        </div>
                      </div>
                      <div v-else>
                        <div class="title text-center">Клиент не выбран</div>
                      </div>
                    </v-card-text>
                    <v-card-actions class="justify-lg-space-around">
                      <v-btn
                        :icon="!showClientEditor"
                        :x-large="!showClientEditor"
                        :fab="showClientEditor"
                        color="success"
                        :disabled="!currentClient.ID"
                        @click="onEditClient"
                      >
                        <v-icon>mdi-pencil-outline</v-icon>
                      </v-btn>
                      <v-btn
                        :icon="!showAddEditor"
                        :x-large="!showAddEditor"
                        :fab="showAddEditor"
                        color="success"
                        @click="onAddClient"
                      >
                        <v-icon>mdi-account-plus-outline</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </div>
              </v-col>
              <v-col cols="7" class="d-flex flex-column justify-space-between">
                <div>
                  <v-text-field
                    v-model="currentWeight"
                    clearable
                    type="number"
                    outlined
                    hide-details
                    class="keyboard-background selected-product-weight mb-2 text-h5"
                    elevation
                  ></v-text-field>
                  <!--                  <v-card-->
                  <!--                    class="keyboard-background px-10 selected-product-weight mb-4"-->
                  <!--                    elevation="5"-->
                  <!--                  >-->
                  <!--                    <h1 class="font-weight-medium black&#45;&#45;text">-->
                  <!--                      {{  || "0" }}-->
                  <!--                    </h1>currentWeight-->
                  <!--                  </v-card>-->
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
                <div>
                  <v-row class="d-flex flex-column mx-auto pt-3">
                    <v-card class="elevation-5">
                      <v-row>
                        <v-col cols="8" class="mx-auto py-0">
                          <v-card-actions>
                            <v-btn-toggle
                              v-model="discountToggle"
                              @change="focusDiscountInput"
                            >
                              <v-btn
                                width="100%"
                                class="elevation-5"
                                value="percent"
                              >
                                <v-icon>mdi-percent-outline</v-icon>
                              </v-btn>

                              <v-btn
                                width="100%"
                                class="elevation-5"
                                value="cash"
                              >
                                <v-icon>mdi-cash-multiple</v-icon>
                              </v-btn>
                            </v-btn-toggle>
                          </v-card-actions>
                        </v-col>
                      </v-row>
                      <v-row class="mx-auto d-flex flex-row">
                        <v-col cols="10" class="pt-0">
                          <v-text-field
                            label="Введите скидку"
                            hide-details
                            ref="discountInput"
                            outlined
                            rows="1"
                            row-height="10"
                            v-model="discountValue"
                            type="number"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="2" class="d-flex pt-0">
                          <template v-if="discountToggle === 'percent'"
                            ><v-icon>mdi-percent-outline</v-icon></template
                          >
                          <template v-else
                            ><v-icon>mdi-cash-multiple</v-icon></template
                          >
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-row>
                </div>
                <div>
                  <v-row>
                    <v-col cols="6"></v-col>
                    <v-col cols="3">
                      <v-btn
                        color="grey darken-3"
                        class="green--text"
                        width="60"
                        height="70"
                        @click="printOrder"
                      >
                        <v-icon large>mdi-printer</v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="3" class="pr-0">
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
                        @click="showPayDialog"
                      >
                        <v-icon large>mdi-cart-outline</v-icon>
                        <h1 class="font-weight-medium">Оплата</h1>
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
                    placeholder="Поиск..."
                    rounded
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="2">
                  <v-switch v-model="set" label="Режим сета" dense></v-switch>
                </v-col>
              </v-row>
              <v-row v-show="set">
                <v-col cols="12">
                  <v-text-field
                    label="Заголовок сета"
                    placeholder="Укажите название сета"
                    rounded
                    outlined
                    dense
                    v-model="setName"
                  />
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-slide-group show-arrows class="py-6">
                <v-slide-item v-slot:default="{ active, toggle }">
                  <v-card
                    height="75"
                    width="90"
                    :color="active ? 'green accent-3' : ''"
                    class="d-flex align-center mx-2 justify-center my-2"
                    :elevation="active ? 1 : 6"
                    @click="
                      (e) => {
                        toggle(e);
                        categoryToggle(0);
                      }
                    "
                  >
                    <v-card-title class="subtitle-2">Все</v-card-title>
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
                    :color="active ? 'green accent-3' : ''"
                    class="d-flex align-center mx-2 justify-center my-2"
                    :elevation="active ? 1 : 6"
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
                          :color="item.selected ? 'green accent-3' : ''"
                          class="mx-auto"
                          height="180"
                          @click="() => selectProduct(item)"
                          :elevation="item.selected ? 1 : 8"
                        >
                          <v-list-item style="height: 70%;">
                            <v-list-item-content>
                              <v-list-item-title class="text-wrap">{{
                                item.name
                              }}</v-list-item-title>
                              <v-list-item-subtitle
                                >Штрих-код:
                                {{ item.barcode }}</v-list-item-subtitle
                              >
                            </v-list-item-content>
                          </v-list-item>
                          <v-spacer></v-spacer>
                          <v-card-actions>
                            <span class="title"
                              >{{ item.price | money }} сум</span
                            >
                          </v-card-actions>
                        </v-card>
                      </v-item>
                    </v-col>
                  </v-row>
                </v-item-group>
              </div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn color="green accent-3" large @click="addChosenProducts"
                >Добавить</v-btn
              >
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
              <v-col cols="6"><h3>Наличными</h3></v-col>
              <v-col cols="6"
                ><h3>{{ parseInt(cashPrice, 10) || 0 | money }} сум</h3></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="6"><h3>Картой</h3></v-col>
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

            <v-row>
              <v-col cols="6">
                <v-btn
                  color="green accent-3"
                  width="100%"
                  height="70"
                  :loading="savingOrderLoading"
                  @click="saveOrder"
                >
                  <h1 class="font-weight-medium">Оплатить</h1>
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn color="green accent-3" width="100%" height="70" @click="printOrder">
                  <h1 class="font-weight-medium">Распечатать</h1>
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-row>
      </v-dialog>
      <v-snackbar
        v-model="cartWeightRequiredSnack"
        top
        color="error"
        timeout="6000"
      >
        {{ cartError }}
        <template v-slot:action="{ attrs }">
          <v-btn
            dark
            text
            v-bind="attrs"
            @click="cartWeightRequiredSnack = false"
          >
            Закрыть
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
import { format } from "date-fns";
import psl from "psl";
import product from "@/store/index";
import { mapGetters, mapActions } from "vuex";
import { AgGridVue } from "ag-grid-vue";
import "ag-grid-enterprise";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { MasterDetailModule } from "@ag-grid-enterprise/master-detail";
import currency from "currency.js";
import vSelect from "vue-select";
import CartItemDelete from "./CartItemDelete";
import MoneyColumn from "./MoneyColumn";
const {ipcRenderer} = require('electron');

ModuleRegistry.registerModules([ClientSideRowModelModule, MasterDetailModule]);

export default {
  data: () => ({
    cartWeightRequiredSnack: false,
    cartError: "",
    discountToggle: "percent",
    firstNameRules: [(v) => !!v || "Фамилия обязательна для заполнения"],
    nameRules: [(v) => !!v || "Имя обязательно для заполнения"],
    valid: false,
    showAddEditor: false,
    clientFirstName: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    showClientEditor: false,
    gridOptions: null,
    gridApi: null,
    gridSetOptions: null,
    gridSetApi: null,
    columnApi: null,
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
    discountValue: "",
    time: new Date(),
    cartColumns: [
      {
        headerName: "Название",
        field: "name",
        cellRenderer: "agGroupCellRenderer",
      },
      {
        headerName: "Цена",
        field: "price",
        width: 150,
        cellRenderer: "MoneyColumn",
      },
      { headerName: "Вес", field: "weight", width: 100 },
      { headerName: "Итоговая цена", field: "totalPrice", width: 150 },
      { headerName: "Действие", field: "id", cellRenderer: "CartItemDelete" },
    ],
    context: null,
    frameworkComponents: null,
    // modules: AllModules,
    selectedCartItem: {},
    options: [],
    currentClient: {},
    setName: "",
    detailCellRendererParams: null,
    defaultColDef: null,
    savingClientLoading: false,
    savingOrderLoading: false,
  }),
  components: { AgGridVue, "vue-select": vSelect },
  computed: {
    ...mapGetters({
      webHook: "settings/webHook",
      cartItems: "cartItems",
      managerData: "settings/managerData",
      chosenPrinter: 'settings/chosenPrinter'
    }),
    showSetsGrid() {
      let res = false;
      this.cartItems.map((item) => {
        if (item.type === "set") {
          res = true;
        }
      });
      return res;
    },
    singleProducts() {
      return this.cartItems.filter((item) => item.type !== "set");
    },
    setProducts() {
      return this.cartItems.filter((item) => item.type === "set");
    },
    domainUrl() {
      return "https://" + this.getHostname(this.webHook);
    },
    subTotalPrice() {
      let totalPrice = 0;
      this.cartItems.map((item) => {
        const curPrice = item.price || 0;
        const curWeight = item.weight || 0;
        totalPrice += curPrice * curWeight;
      });
      return totalPrice;
    },
    totalPrice() {
      let totalPrice = 0;

      this.cartItems.map((item) => {
        const curPrice = item.price || 0;
        const curWeight = item.weight || 0;
        totalPrice += curPrice * curWeight;
      });
      if (this.discountToggle === "percent") {
        return totalPrice * ((100 - this.discountValue) / 100);
      } else {
        return totalPrice - this.discountValue;
      }
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
      return +this.cashPrice + +this.cardPrice - +this.totalPrice;
    },
  },
  beforeMount() {
    this.gridOptions = {};
    this.gridSetOptions = {};
    this.context = { componentParent: this };
    this.frameworkComponents = {
      CartItemDelete,
      MoneyColumn,
    };

    this.defaultColDef = { flex: 1 };
    this.detailCellRendererParams = {
      detailGridOptions: {
        columnDefs: [
          { headerName: "Название", field: "name" },
          {
            headerName: "Цена",
            field: "price",
            width: 150,
            cellRenderer: "MoneyColumn",
          },
          { headerName: "Вес", field: "weight", width: 100 },
          { headerName: "Итоговая цена", field: "totalPrice", width: 150 },
          {
            headerName: "Действие",
            field: "id",
            cellRenderer: "CartItemDelete",
          },
        ],
        defaultColDef: { flex: 1 },
        frameworkComponents: {
          CartItemDelete,
          MoneyColumn,
        },
      },
      getDetailRowData: (params) => {
        params.successCallback(params.data.childs);
      },
    };
  },
  methods: {
    ...mapActions([
      "toggleProduct",
      "toggleProductCart",
      "addProductToCart",
      "removeProductCart",
      "unselectAllItems",
      "setWeight",
    ]),
    printOrder() {
      const cartItems = [...this.cartItems];
      const cartItemsTable = [];
      const subTotalPrice = this.subTotalPrice
      const totalPrice = this.totalPrice;
      const discountValue = this.discountValue

      cartItems.map(item => {
        cartItemsTable.push([item.name, item.price, item.weight, item.totalPrice])
      });

      console.log(cartItemsTable)
      const data = [
        {
          type: 'text', value: 'g', style: "font-size: 36px; color: 3CAF50; text-align: center; "
        },
        {
          type: 'text', value: 'gavali', style: "font-size: 26px; color: 3CAF50; text-align: center;"
        },
        {
          type: 'text', value: 'OOO "Gavali Sweets"', style: "font-size: 12px; color: 3CAF50; text-align: center;"
        },
        {
          type: 'text', value: 'г.Ташкент, ул.Шахрисабзкая, дом 5-А Бизнес центр SEOUL PLAZA', style: "font-size: 10px; color: 3CAF50; text-align: left"
        },
        {
          type: 'table',
          // style the table
          style: 'border: none',
          // list of the columns to be rendered in the table header
          tableHeader: ['Название', 'Цена', 'Вес', 'Сумма'],
          // multi dimensional array depicting the rows and columns of the table body
          tableBody: cartItemsTable,
          // list of columns to be rendered in the table footer
          tableFooter: [],
          // custom style for the table header
          tableHeaderStyle: 'background-color: white; color: black;',
          // custom style for the table body
          tableBodyStyle: 'border: none',
          // custom style for the table footer
          tableFooterStyle: 'background-color: #white; color: black;',
        },
        {
          type: 'text', value: subTotalPrice, style: "font-size: 14px; color: 3CAF50; text-align: right;"
        },
        {
          type: 'table',
          // style the table
          style: 'border: none',
          // list of the columns to be rendered in the table header
          tableHeader: ['', '', '', ''],
          // multi dimensional array depicting the rows and columns of the table body
          tableBody: [['Скидка:', '', '', discountValue], ['итог:', '', '', totalPrice]],
          // list of columns to be rendered in the table footer
          tableFooter: [],
          // custom style for the table header
          tableHeaderStyle: 'background-color: white; color: black;',
          // custom style for the table body
          tableBodyStyle: 'border: none',
          // custom style for the table footer
          tableFooterStyle: 'background-color: #white; color: black; text-transformation: uppercase; font-size: 14px',
        },
        // {
        //   type: 'text', value: 'Скидка', style: "font-size: 12px; color: 3CAF50; text-align: left;"
        // },
        // {
        //   type: 'text', value: discountValue, style: "font-size: 14px; color: 3CAF50; text-align: left;"
        // },
        // {
        //   type: 'text', value: 'итог', style: "font-size: 16px; color: 3CAF50; text-align: right; text-transform: uppercase"
        // },
        // {
        //   type: 'text', value: totalPrice, style: "font-size: 16px; color: 3CAF50; text-align: right; text-transform: uppercase"
        // },
        {
          type: 'text', value: 'Спасибо за покупку!', style: "font-size: 12px; color: 3CAF50; text-align: right; text-transform: uppercase"
        },
        {
          type: 'table',
          // style the table
          style: 'border: none',
          // list of the columns to be rendered in the table header
          tableHeader: [],
          // multi dimensional array depicting the rows and columns of the table body
          tableBody: [['+998 97 444 1100', 'www.gavali.uz'],
          ['gavali_uzbekistan'],],
          // list of columns to be rendered in the table footer
          tableFooter: [],
          // custom style for the table header
          tableHeaderStyle: 'background-color: white; color: black;',
          // custom style for the table body
          tableBodyStyle: 'border: none',
          // custom style for the table footer
          tableFooterStyle: 'background-color: #white; color: black;',
        },


      ]
      ipcRenderer.send('print', JSON.stringify({
        printerName: this.chosenPrinter,
        data
      }));
    },
    async saveOrder() {
      this.savingOrderLoading = true;
      let orderData = {
        client: this.currentClient,
        cartItems: this.cartItems,
        cashPrice: this.cashPrice,
        cardPrice: this.cardPrice,
        discount: this.discountValue,
        managerId: this.managerData.ID,
        discountType: this.discountToggle,
      };
      let { data } = await this.$http.post(
        this.webHook + `mysale.order.create`,
        orderData
      );
      this.savingOrderLoading = false;
    },
    listenForBarcode() {
      let pressed = false;
      let chars = [];
      let vm = this;
      window.removeEventListener("keypress", () => {});
      window.addEventListener("keypress", (e) => {
        if (
          e.which == 71 ||
          e.which == 85 ||
          (e.which >= 48 && e.which <= 57)
        ) {
          chars.push(String.fromCharCode(e.which));
        }

        if (pressed === false) {
          setTimeout(function () {
            const barcode = chars.join("");
            if (/GU\d{4}/gm.test(barcode)) {
              vm.addByQrCode(barcode);
            }
            chars = [];
            pressed = false;
          }, 200);
        }

        pressed = true;
      });
    },
    addByQrCode(code) {
      this.cartWeightRequiredSnack = false;
      const items = [...this.items];
      const foundItem = items.filter((item) => item.barcode === code)[0];
      const foundIndex = this.cartItems.findIndex((prod) => {
        return foundItem.id === prod.id;
      });

      if (foundItem.totalAmountCount > 0) {
        if (foundIndex < 0) {
          this.addProductToCart({ item: { ...foundItem, type: "product" } });
        }
      } else {
        this.cartWeightRequiredSnack = true;
        this.cartError = `Товар "#${foundItem.barcode}: ${foundItem.name}" отсутствует в складах`;
      }
    },
    showPayDialog() {
      this.cartWeightRequiredSnack = false;
      let res = true;

      if (this.totalPrice <= 0) {
        this.cartWeightRequiredSnack = true;
        this.cartError = "Корзина пуста";
        return;
      }

      if (!this.currentClient.ID) {
        this.cartWeightRequiredSnack = true;
        this.cartError = "Не указан клиент";
        return;
      }

      this.cartItems.map((item) => {
        if (item.type !== "set" && item.weight === 0) {
          res = false;
        }

        if (item.type === "set") {
          item.childs.map((child) => {
            if (child.weight === 0) {
              res = false;
            }
          });
        }
      });
      if (!res) {
        this.cartWeightRequiredSnack = true;
        this.cartError =
          "В корзине есть товар без указанного веса. Указание веса обязательно";
      }
      this.showPayMethodDialog = res;
    },
    setScaleWeight(data) {
      if (this.selectedCartItem.id && data.detail) {
        this.append(data.detail.weight);
        this.equal();
      }
    },
    async saveClient() {
      this.savingClientLoading = true;
      if (this.currentClient.ID) {
        let { data } = await this.$http.get(
          this.webHook +
            `myuser.updateUser?id=${this.currentClient.ID}&PHONE=${this.clientPhone}&EMAIL=${this.clientEmail}&NAME=${this.clientName}&LAST_NAME=${this.clientFirstName}`
        );
        this.currentClient = data.result.user;
      } else {
        let { data } = await this.$http.get(
          this.webHook +
            `myuser.addUser?PHONE=${this.clientPhone}&EMAIL=${this.clientEmail}&NAME=${this.clientName}&LAST_NAME=${this.clientFirstName}`
        );
        this.currentClient = data.result.user;
      }
      this.savingClientLoading = false;
      this.showClientEditor = false;
      this.showAddEditor = false;
    },
    onEditClient() {
      if (!this.showClientEditor) {
        this.clientFirstName = this.currentClient.LAST_NAME;
        this.clientName = this.currentClient.NAME;
        this.clientPhone = this.currentClient.PERSONAL_PHONE;
        this.clientEmail = this.currentClient.EMAIL;
      }
      this.showClientEditor = !this.showClientEditor;
    },
    onAddClient() {
      this.currentClient = {};
      this.clientFirstName = "";
      this.clientName = "";
      this.clientPhone = "";
      this.clientEmail = "";
      this.showClientEditor = !this.showAddEditor;
      this.showAddEditor = !this.showAddEditor;
    },
    selectProduct(item) {
      this.toggleProduct({ item });
      // this.toggleProductCart({ item });
    },
    removeCartItem(node) {
      this.removeProductCart({ item: node.data });
      // this.toggleProductCart({ item: node.data });
    },
    cartItemSelected() {
      console.log("product");
      // this.gridSetApi.deselectAll();
      setTimeout(() => {
        const selectedRows = this.gridApi.getSelectedRows();
        if (selectedRows.length) {
          this.selectedCartItem = selectedRows[0];
        } else {
          this.selectedCartItem = {};
        }
      });
    },
    cartSetItemSelected() {
      console.log(arguments);
      // this.gridApi.deselectAll();
      setTimeout(() => {
        const selectedSetRows = this.gridSetApi.getSelectedRows();
        if (selectedSetRows.length) {
          console.log(selectedSetRows[0]);
          this.selectedCartItem = selectedSetRows[0];
        } else {
          this.selectedCartItem = {};
        }
      });
    },
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
        this.currentWeight = this.currentWeight
          .toString()
          .substring(0, this.currentWeight.length - 1);
      }
      if (param.includes("cashPrice") && this.cashBtn) {
        this.cashPrice = this.cashPrice.substring(0, this.cashPrice.length - 1);
      }
      if (param.includes("cardPrice") && this.cardBtn) {
        this.cardPrice = this.cardPrice.substring(0, this.cardPrice.length - 1);
      }
    },
    dot() {
      if (this.currentWeight.toString().indexOf(".") === -1) {
        this.append(".");
      }
    },
    equal() {
      this.currentWeight = eval(this.currentWeight);
      this.setWeight({
        id: this.selectedCartItem.id,
        weight: this.currentWeight,
      });
      this.currentWeight = "";
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

    async onSearch(search, loading) {
      try {
        loading(true);
        let { data } = await this.$http.get(
          this.webHook + `myuser.getList?filter[NAME]=${search}`
        );
        this.options = data.result;
        loading(false);
      } catch (e) {
        console.log(e);
      }
    },
    addChosenProducts() {
      if (this.set) {
        const item = {
          name: this.setName,
          weight: 1,
          childs: [],
          price: 0,
          totalPrice: 0,
          type: "set",
          id: Math.floor(Math.random() * Math.floor(99999)),
        };
        this.items.map((prod) => {
          if (prod.selected) {
            if (prod.totalAmountCount > 0) {
              item.childs.push(prod);
            } else {
              this.cartWeightRequiredSnack = true;
              this.cartError = `Товар "#${prod.barcode}: ${prod.name}" отсутствует в складах`;
            }
          }
        });
        this.addProductToCart({ item });
      } else {
        this.items.map((item) => {
          if (item.selected) {
            const foundIndex = this.cartItems.findIndex((prod) => {
              return item.id === prod.id;
            });

            if (item.totalAmountCount > 0) {
              if (foundIndex < 0) {
                this.addProductToCart({ item: { ...item, type: "product" } });
              }
            } else {
              this.cartWeightRequiredSnack = true;
              this.cartError = `Товар "#${item.barcode}: ${item.name}" отсутствует в складах`;
            }
          }
        });
      }
      this.set = false;
      this.setName = "";
      this.unselectAllItems();
      this.showSearchDialog = false;
    },
    focusDiscountInput() {
      this.$refs.discountInput.focus();
    },
  },
  mounted() {
    setInterval(() => {
      this.time = new Date();
    }, 1000);

    this.gridApi = this.gridOptions.api;
    this.gridSetApi = this.gridSetOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    document.removeEventListener("setWeight", this.setScaleWeight);
    document.addEventListener("setWeight", this.setScaleWeight);
    this.listenForBarcode();
    window.davr = this;
  },
  beforeDestroy() {
    document.removeEventListener("setWeight", this.setScaleWeight);
  },
  filters: {
    money: (value) => {
      return (
        value &&
        currency(+value, { symbol: "", separator: " ", decimal: "," }).format()
      );
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
  height: 350px;
  overflow-y: auto;
}
.style-chooser .vs__dropdown-menu {
  padding-left: 0 !important;
}
.product-card-title {
  font-weight: 500;
  letter-spacing: 0.0125em;
  line-height: 2rem;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
</style>
