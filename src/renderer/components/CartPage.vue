<template>
  <v-app light>
    <v-main>
      <v-container fluid class="grey lighten-3 px-6 py-0">
        <v-row>
          <v-col cols="9" class="d-flex flex-row">
            <v-card width="100%">
              <v-card-text style="height: 100%;" class="pb-0">
                <v-row>
                  <v-col cols="12" class="mt-n3">
                    <v-btn
                      color="grey"
                      x-large
                      width="100%"
                      @click="openSearchDialog"
                      >Поиск товара</v-btn
                    >
                  </v-col>
                </v-row>
                <div class="d-flex flex-column justify-space-between">
                  <ag-grid-vue
                    :style="
                      showSetsGrid
                        ? 'width: 100%; height: 150px;'
                        : 'width: 100%; height: 400px;'
                    "
                    class="ag-theme-material"
                    :columnDefs="cartColumns"
                    :rowData="singleProducts"
                    rowSelection="single"
                    :context="context"
                    :frameworkComponents="frameworkComponents"
                    @selection-changed="cartItemSelected"
                    :gridOptions="gridOptions"
                    :defaultColDef="defaultColDef"
                  >
                  </ag-grid-vue>
                  <div v-show="showSetsGrid">
                    <h2>Сеты</h2>
                    <ag-grid-vue
                      :style="showSetsGrid ? 'width: 100%; height: 400px;' : ''"
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
                      @firstDataRendered="firstDataRendered"
                    >
                    </ag-grid-vue>
                  </div>
                  <div>
                    <v-divider></v-divider>
                    <v-row>
                      <v-col cols="6">
                        <v-row>
                          <v-col cols="5" class="pr-0"><h3>Сумма</h3></v-col>
                          <v-col cols="6" class="px-0"
                            ><h3>{{ subTotalPrice | money }} сум</h3></v-col
                          >
                        </v-row>
                        <v-row>
                          <v-col cols="5" class="pr-0"><h3>Скидка</h3></v-col>
                          <v-col cols="6" class="px-0"
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
                      <v-col class="pt-6 px-0">
                        <div class="text-right">
                          <h2 class="text-uppercase">Итоговая сумма</h2>
                          <h1 class="display-1 font-weight-bold">
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
          <v-col cols="3">
            <div class="d-flex flex-column justify-space-between">
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
                    <template slot="no-options"> Введите имя клиента </template>
                  </vue-select>
                  <div v-if="currentClient.ID">
                    <div class="mb-4">
                      <div>Client # {{ currentClient.ID }}</div>
                      <h2 class="font-weight-medium text--primary">
                        {{ currentClient.NAME + " " + currentClient.LAST_NAME }}
                      </h2>
                    </div>
                    <div class="mb-4" v-if="currentClient.PERSONAL_PHONE">
                      <div>Phone</div>
                      <div class="font-weight-bold">
                        {{ currentClient.PERSONAL_PHONE }}
                      </div>
                    </div>
                    <div class="mb-4" v-if="currentClient.EMAIL">
                      <div>Email</div>
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
              <div>
                <v-row class="d-flex flex-column mx-auto pt-3">
                  <v-card class="elevation-5">
                    <v-row>
                      <v-col class="mx-auto py-0">
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
                      <v-col cols="9">
                        <v-text-field
                          label="Введите скидку"
                          hide-details
                          ref="discountInput"
                          outlined
                          rows="1"
                          row-height="10"
                          v-model="discountValue"
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
                  <v-col cols="4" class="pb-0">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="grey darken-3"
                          class="green--text"
                          width="60"
                          height="70"
                          @click="showPlusScale"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon large>mdi-scale</v-icon
                          ><span class="headline">+</span>
                        </v-btn>
                      </template>
                      <span>Увеличить вес</span>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="4" class="pb-0">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="grey darken-3"
                          class="green--text"
                          width="60"
                          height="70"
                          @click="showMinusScale"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon large>mdi-scale</v-icon
                          ><span class="headline">-</span>
                        </v-btn>
                      </template>
                      <span>Уменьшить вес</span>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="4" class="pb-0">
                    <v-speed-dial
                      v-model="moreTools"
                      direction="top"
                      open-on-hover
                      transition="slide-y-reverse-transition"
                    >
                      <template v-slot:activator>
                        <v-btn
                          v-model="moreTools"
                          color="grey darken-3"
                          class="green--text"
                          width="60"
                          height="70"
                        >
                          <v-icon v-if="moreTools">
                            mdi-close
                          </v-icon>
                          <v-icon v-else>
                            mdi-dots-horizontal
                          </v-icon>
                        </v-btn>
                      </template>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            color="grey darken-3"
                            class="green--text"
                            width="60"
                            height="70"
                            v-bind="attrs"
                            v-on="on"
                            @click="showOrderDialog"
                          >
                            <v-icon large>mdi-clipboard-list-outline</v-icon>
                          </v-btn>
                        </template>
                        <span>Заказы</span>
                      </v-tooltip>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            color="grey darken-3"
                            class="green--text"
                            width="60"
                            height="70"
                            v-bind="attrs"
                            v-on="on"
                            @click="logout"
                          >
                            <v-icon large>mdi-lock-open-variant-outline</v-icon>
                          </v-btn>
                        </template>
                        <span>Выход</span>
                      </v-tooltip>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            color="grey darken-3"
                            class="green--text"
                            width="60"
                            height="70"
                            v-bind="attrs"
                            v-on="on"
                            @click="loadData"
                          >
                            <v-icon large>mdi-refresh</v-icon>
                          </v-btn>
                        </template>
                        <span>Обновить товары</span>
                      </v-tooltip>
                    </v-speed-dial>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4" class="pb-0">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="grey darken-3"
                          class="green--text"
                          width="60"
                          height="70"
                          :loading="isSetSaving"
                          @click="printSets"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon large>mdi-printer</v-icon>
                        </v-btn>
                      </template>
                      <span>Сохранить сеты и распечатать</span>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="4" class="pr-0 pb-0">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="grey darken-3"
                          class="red--text"
                          width="60"
                          height="70"
                          v-bind="attrs"
                          v-on="on"
                          @click="clearBasket"
                        >
                          <v-icon large>mdi-close</v-icon>
                        </v-btn>
                      </template>
                      <span>Очистить корзину</span>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="3" class="pr-0 pb-0">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="grey darken-3"
                          class="green--text"
                          width="60"
                          height="70"
                          :loading="isPaymentReportLoading"
                          @click="showPaymentReport"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon large>mdi-file-chart</v-icon>
                        </v-btn>
                      </template>
                      <span>Показать отчёт о суммах</span>
                    </v-tooltip>
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
            </div>
            <v-row v-if="false">
              <v-col cols="5" v-if="false">
                <div class="mt-6">
                  <v-card
                    class="keyboard-background px-3 py-3 mt-5 weight-keyboard"
                    elevation="5"
                  >
                    <div class="font-weight-medium white-text subtitle-2">
                      Кассир: {{ managerData.LAST_NAME }} {{ managerData.NAME }}
                    </div>
                    <div class="font-weight-medium white-text subtitle-2"></div>
                  </v-card>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
      <v-dialog v-model="orderDialog">
        <div v-if="orderDialog">
          <v-card>
            <v-card-text>
              <v-row class="d-flex align-center">
                <v-menu
                  v-model="showOrderDatePicker"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :value="orderPickerDateFormatted"
                      label="Период заказов"
                      readonly
                      placeholder="Укажите даты"
                      v-bind="attrs"
                      class="px-4 col-4"
                      outlined
                      allowed-dates
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="orderPickerDate"
                    locale="ru"
                    show-current
                    range
                    no-title
                    @input="showOrderDatePicker = false"
                  >
                  </v-date-picker>
                </v-menu>
                <v-btn
                  color="green accent-3 mb-8"
                  :loading="orderDataLoading"
                  @click="loadOrdersList"
                  >Обновить</v-btn
                >
              </v-row>
              <v-data-table
                :headers="ordersHeaders"
                :items="ordersList"
                :loading="orderDataLoading"
                class="elevation-1"
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon @click="showExistingOrderInfo(item.ID)" class="mr-2">
                    mdi-information-outline
                  </v-icon>
                </template>
                <template v-slot:item.TOTAL_PRICE="{ item }">
                  <span>{{ item.TOTAL_PRICE | money }} сум</span>
                </template>
                <template v-slot:item.PAYMENT="{ item }">
                  <div v-for="payment in item.PAYMENT">
                    {{ payment.LABEL }}: {{ payment.SUM | money }} сум
                  </div>
                </template>
                <template v-slot:no-data>
                  <v-btn color="primary">
                    Reset
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </div>
      </v-dialog>
      <v-dialog
        v-model="showScaleDialog"
        @click:outside="clearScaleDialog"
        max-width="450px"
        persistent
      >
        <v-card
          v-if="showScaleDialog"
          class="keyboard-background overflow-hidden"
        >
          <v-row>
            <v-col cols="5">
              <div
                class="align-center d-flex justify-center"
                style="height: 100%; width: 100%;"
              >
                <div>
                  <div class="font-weight-black">Показатель весов:</div>
                  <div class="headline font-weight-medium">
                    {{ currentScaleWeight }}
                  </div>
                </div>
              </div>
            </v-col>
            <v-col cols="7" class="px-6">
              <div>
                <v-form @submit.prevent="equal">
                  <v-text-field
                    ref="cartItemSelectedInput"
                    v-model="currentWeight"
                    outlined
                    hide-details
                    dense
                    class="keyboard-background selected-product-weight mb-2 text-h5"
                    elevation
                  ></v-text-field>
                </v-form>
                <v-row class="px-3">
                  <v-col cols="9" class="pl-0">
                    <v-row class="mb-n4">
                      <v-col cols="4">
                        <v-btn fab small color="black" @click="append('7')"
                          ><h1 class="font-weight-bold green--text">
                            7
                          </h1></v-btn
                        >
                      </v-col>
                      <v-col cols="4">
                        <v-btn fab small color="black" @click="append('8')"
                          ><h1 class="font-weight-bold green--text">
                            8
                          </h1></v-btn
                        >
                      </v-col>
                      <v-col cols="4">
                        <v-btn fab small color="black" @click="append('9')"
                          ><h1 class="font-weight-bold green--text">
                            9
                          </h1></v-btn
                        >
                      </v-col>
                    </v-row>
                    <v-row class="mb-n4">
                      <v-col cols="4">
                        <v-btn fab small color="black" @click="append('4')"
                          ><h1 class="font-weight-bold green--text">
                            4
                          </h1></v-btn
                        >
                      </v-col>
                      <v-col cols="4">
                        <v-btn fab small color="black" @click="append('5')"
                          ><h1 class="font-weight-bold green--text">
                            5
                          </h1></v-btn
                        >
                      </v-col>
                      <v-col cols="4">
                        <v-btn fab small color="black" @click="append('6')"
                          ><h1 class="font-weight-bold green--text">
                            6
                          </h1></v-btn
                        >
                      </v-col>
                    </v-row>
                    <v-row class="mb-n4">
                      <v-col cols="4">
                        <v-btn fab small color="black" @click="append('1')"
                          ><h1 class="font-weight-bold green--text">
                            1
                          </h1></v-btn
                        >
                      </v-col>
                      <v-col cols="4">
                        <v-btn fab small color="black" @click="append('2')"
                          ><h1 class="font-weight-bold green--text">
                            2
                          </h1></v-btn
                        >
                      </v-col>
                      <v-col cols="4">
                        <v-btn fab small color="black" @click="append('3')"
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
                          height="40"
                          width="100%"
                          color="black"
                          class="justify-start"
                          @click="append('0')"
                          ><h1 class="font-weight-bold green--text pl-1">0</h1>
                          <v-spacer></v-spacer
                        ></v-btn>
                      </v-col>
                      <v-col cols="4">
                        <v-btn fab small color="black" @click="dot(',')"
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
                        <v-btn fab small color="black"
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
                        <v-btn @click="clear" fab small color="black"
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
                          height="88px"
                          width="40"
                          x-small
                          ><h1 class="font-weight-bold green--text">
                            &crarr;
                          </h1></v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
      <v-dialog v-model="showSearchDialog">
        <div v-if="showSearchDialog">
          <v-card>
            <v-card-text>
              <v-row class="align-baseline">
                <v-col cols="10">
                  <v-text-field
                    v-model="searchText"
                    placeholder="Поиск..."
                    ref="searchText"
                    rounded
                    outlined
                    dense
                    @keyup.enter="selectProductBySearch"
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
              <div class="d-flex">
                <v-list dense height="315" style="flex: 3; overflow-y: auto;">
                  <v-list-item
                    :class="{ 'v-list-item--active': currentCategoryId === 0 }"
                    :color="currentCategoryId === 0 ? 'green accent-3' : ''"
                    @click="categoryToggle(0)"
                  >
                    <v-list-item-content>
                      <v-list-item-title>Все</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-for="item in categories"
                    :key="item.id"
                    @click="categoryToggle(item.id)"
                    :class="{
                      'v-list-item--active': currentCategoryId === item.id
                    }"
                    :color="
                      currentCategoryId === item.id ? 'green accent-3' : ''
                    "
                  >
                    <v-list-item-content>
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-divider vertical></v-divider>
                <div class="product-list-block" style="flex: 10;">
                  <v-list dense>
                    <v-virtual-scroll
                      :items="filteredProducts"
                      height="300"
                      item-height="40"
                    >
                      <template v-slot="{ item }">
                        <v-list-item
                          :key="item.id"
                          @click="() => selectProduct(item)"
                          :class="{ 'v-list-item--active': item.selected }"
                          :color="item.selected ? 'green accent-3' : ''"
                        >
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="item.name"
                            ></v-list-item-title>
                          </v-list-item-content>
                          <v-list-item-action>{{
                            item.price | money
                          }}</v-list-item-action>
                          <v-btn icon @click="printBarcodeLabel(item)">
                            <v-icon>mdi-printer</v-icon>
                          </v-btn>
                        </v-list-item>
                      </template>
                    </v-virtual-scroll>
                  </v-list>
                </div>
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
      <v-dialog v-model="showPayMethodDialog" persistent style="width: 400px;">
        <v-card v-if="showPayMethodDialog">
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
                  <v-card-title class="subtitle-2 text-no-wrap"
                    >Наличными</v-card-title
                  >
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
                  <v-card-title class="subtitle-2">Картой</v-card-title>
                </v-card>
              </v-slide-item>
              <v-slide-item v-slot:default="{ active, toggle }">
                <v-card
                  height="75"
                  width="90"
                  :color="udsBtn ? 'primary' : ''"
                  class="d-flex align-center mx-2 justify-center my-2"
                  @click="() => togglePaymentType('uds')"
                >
                  <v-card-title class="subtitle-2">UDS</v-card-title>
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
                        @click="substr(['cashPrice', 'cardPrice', 'udsPrice'])"
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

            <v-btn
              color="green accent-3"
              width="100%"
              height="70"
              @click="payTotalSumm"
              class="mt-1"
            >
              <h1 class="font-weight-medium">Всю сумму</h1>
            </v-btn>
          </v-col>
          <v-col cols="8">
            <v-row>
              <v-col cols="6"> <h2>Итоговая сумма</h2></v-col>
              <v-col cols="6"
                ><div class="display-1 font-weight-bold">
                  {{ totalPrice | money }} сум
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6"><h3>Наличными</h3></v-col>
              <v-col cols="6"
                ><h3>{{ +cashPrice || 0 | money }} сум</h3></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="6"><h3>Картой</h3></v-col>
              <v-col cols="6"
                ><h3>{{ +cardPrice || 0 | money }} сум</h3></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="6"><h3>UDS</h3></v-col>
              <v-col cols="6"
                ><h3>{{ +udsPrice || 0 | money }} сум</h3></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="6"><h3>Сдача</h3></v-col>
              <v-col cols="6"
                ><div>
                  <h3>
                    {{
                      parseInt(changePrice, 10) > 0
                        ? parseInt(changePrice, 10)
                        : 0 | money
                    }}
                    сум
                  </h3>
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
                  :disabled="changePrice < 0 || +orderData.orderId > 0"
                  @click="saveOrder"
                >
                  <h1 class="font-weight-medium">Оплатить</h1>
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  color="green accent-3"
                  width="100%"
                  height="70"
                  @click="clearCompleteBasket"
                >
                  <h1 class="font-weight-medium">Закрыть</h1>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
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
    <v-dialog v-model="showPrintDialog" max-width="590px">
      <v-card v-if="showPrintDialog">
        <v-card-text>
          <div id="order-print" style="width: 540px;">
            <div class="text-center py-3">
              <img :src="printLogo" alt="" />
            </div>
            <div class="text-center py-3">OOO "Gavali Sweets"</div>
            <div class="text-center py-3">
              <div>
                <v-icon>mdi-map-marker</v-icon>
                {{ orderPrintData.address }}
              </div>
            </div>
            <div class="text-center py-3">
              <span>{{ orderPrintData.printTime }}</span>
              <span>Чек №: {{ orderPrintData.orderId }}</span>
              <span>Кассир: {{ orderPrintData.manager }}</span>
            </div>
            <div class="clear-user-agent-styles print-cart-items-table py-3">
              <table>
                <thead>
                  <tr>
                    <th width="30px">Кол-во</th>
                    <th width="50px">Наименование товара</th>
                    <th width="50px">Цена</th>
                    <th width="50px">Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in tabItems" :key="item.id">
                    <td>{{ item.weight }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.price | money }}</td>
                    <td>{{ item.totalPrice | money }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="clear-user-agent-styles py-3">
              <table>
                <tbody>
                  <tr>
                    <td>Сумма с ндс, 15%:</td>
                    <td>{{ orderPrintData.subTotalPrice }}</td>
                  </tr>
                  <tr>
                    <td>Скидка:</td>
                    <td>{{ orderPrintData.discountPrintValue }}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; font-size: 30px;">Итог:</td>
                    <td style="font-weight: bold; font-size: 30px;">
                      {{ orderPrintData.totalPrice }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="text-center py-6">Спасибо за покупку!</div>
            <v-row>
              <v-col cols="6">
                <v-icon>mdi-phone-in-talk-outline</v-icon> +998 97 444-11-00
              </v-col>
              <v-col cols="6"> <v-icon>mdi-web</v-icon> www.gavali.uz </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-icon>mdi-facebook</v-icon> gavali_uzbekistan
              </v-col>
              <v-col cols="6">
                <v-icon>mdi-instagram</v-icon> gavali_uzbekistan
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn icon large @click="printNode('order-print')">
            <v-icon>mdi-cloud-print-outline</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showExistingOrderDialog" max-width="590px">
      <v-card v-if="showExistingOrderDialog" :loading="isLoadingExistingOrder">
        <v-card-text>
          <div
            id="existing-order-print"
            v-if="!isLoadingExistingOrder"
            style="width: 540px;"
          >
            <div class="text-center py-3">
              <img :src="printLogo" alt="" />
            </div>
            <div class="text-center py-3">OOO "Gavali Sweets"</div>
            <div class="text-center py-3">
              <div>
                <v-icon>mdi-map-marker</v-icon>
                {{ existingOrderPrintData.address }}
              </div>
            </div>
            <div class="text-center py-3">
              <span>{{ existingOrderPrintData.printTime }}</span>
              <span>Чек №: {{ existingOrderPrintData.orderId }}</span>
              <span>Кассир: {{ existingOrderPrintData.manager }}</span>
            </div>
            <div class="clear-user-agent-styles print-cart-items-table py-3">
              <table>
                <thead>
                  <tr>
                    <th width="30px">Кол-во</th>
                    <th width="50px">Наименование товара</th>
                    <th width="50px">Цена</th>
                    <th width="50px">Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in existingOrderPrintData.cartItems"
                    :key="item.id"
                  >
                    <td>{{ item.weight }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.price | money }}</td>
                    <td>{{ item.totalPrice | money }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="clear-user-agent-styles py-3">
              <table>
                <tbody>
                  <tr>
                    <td>Сумма с ндс, 15%:</td>
                    <td>{{ existingOrderPrintData.subTotalPrice | money }}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; font-size: 30px;">Итог:</td>
                    <td style="font-weight: bold; font-size: 30px;">
                      {{ existingOrderPrintData.totalPrice | money }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="text-center py-6">Спасибо за покупку!</div>
            <v-row>
              <v-col cols="6">
                <v-icon>mdi-phone-in-talk-outline</v-icon> +998 97 444-11-00
              </v-col>
              <v-col cols="6"> <v-icon>mdi-web</v-icon> www.gavali.uz </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-icon>mdi-facebook</v-icon> gavali_uzbekistan
              </v-col>
              <v-col cols="6">
                <v-icon>mdi-instagram</v-icon> gavali_uzbekistan
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn icon large @click="printNode('existing-order-print')">
            <v-icon>mdi-cloud-print-outline</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showSetPrintDialog" max-width="450px">
      <v-card v-if="showSetPrintDialog">
        <v-card-text>
          <div id="sets-print" style="width: 400px;">
            <div class="text-center">
              <img :src="printLogo" alt="" />
            </div>
            <div class="text-center">OOO "Gavali Sweets"</div>
            <div v-for="set in setPrintData" :key="set.res_id">
              <h2>Сет: {{ set.name }}</h2>
              <div class="clear-user-agent-styles print-cart-items-table">
                <table>
                  <thead>
                    <tr>
                      <th width="30px">Кол-во</th>
                      <th width="50px">Наименование товара</th>
                      <th width="50px">Цена</th>
                      <th width="50px">Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in set.childs" :key="item.id">
                      <td>{{ item.weight }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.price | money }}</td>
                      <td>{{ item.totalPrice | money }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="clear-user-agent-styles">
                <table>
                  <tbody>
                    <tr>
                      <td>Сумма:</td>
                      <td>{{ set.totalPrice | money }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <barcode
                format="CODE128"
                :value="set.barcode"
                :displayValue="false"
              />
            </div>
            <div class="text-center">Спасибо за покупку!</div>
            <v-row>
              <v-col cols="6">
                <v-icon>mdi-phone-in-talk-outline</v-icon> +998 97 444-11-00
              </v-col>
              <v-col cols="6"> <v-icon>mdi-web</v-icon> www.gavali.uz </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-icon>mdi-facebook</v-icon> gavali_uzbekistan
              </v-col>
              <v-col cols="6">
                <v-icon>mdi-instagram</v-icon> gavali_uzbekistan
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn icon large @click="printNode('sets-print')">
            <v-icon>mdi-cloud-print-outline</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showPaymentReportDialog" max-width="450px">
      <v-card v-if="showPaymentReportDialog" class="py-8">
        <v-card-text>
          <div class="subtitle-2 font-weight-bold">
            Период: {{ paymentReportData.DATES }}
          </div>
          <div class="py-3">
            <v-row v-for="price in paymentReportData.PRICES" :key="price.LABEL">
              <v-col cols="6" class="py-0">
                <div class="title font-weight-bold">{{ price.LABEL }}:</div>
              </v-col>
              <v-col cols="6" class="py-0">
                <div class="title font-weight-bold">
                  {{ price.PRICE | money }}
                </div>
              </v-col>
            </v-row>
          </div>
          <v-row>
            <v-col cols="6">
              <div class="title font-weight-bold">Общая сумма без скидок:</div>
            </v-col>
            <v-col cols="6">
              <div class="title font-weight-bold">
                {{ paymentReportData.TOTAL_WITHOUT_DISCOUNT | money }}
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <div class="title font-weight-bold">Общая скидка:</div>
            </v-col>
            <v-col cols="6">
              <div class="title font-weight-bold">
                {{ paymentReportData.TOTAL_DISCOUNT | money }}
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <div class="title font-weight-bold">Общая сумма:</div>
            </v-col>
            <v-col cols="6">
              <div class="title font-weight-bold">
                {{ paymentReportData.TOTAL_PRICE | money }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
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
import loadData from "../mixins/loadData";
import htmlToImage from "html-to-image";
import VueBarcode from "vue-barcode";
import { formatWithOptions, parseISO } from "date-fns/fp";
import { ru } from "date-fns/locale";
import axios from "axios";
const { ipcRenderer } = require("electron");
const escpos = require("escpos");
const path = require("path");
const fs = require("fs");
const electron = require("electron");
// install escpos-usb adapter module manually
escpos.USB = require("escpos-usb");

import ProductItems from "@/store/models/items";
import settings from "electron-settings";

// escpos.Network = require("escpos-network");
ModuleRegistry.registerModules([ClientSideRowModelModule, MasterDetailModule]);
// JSPM.JSPrintManager.auto_reconnect = true;
// JSPM.JSPrintManager.start();

export default {
  props: ["tabIndex"],
  data: () => ({
    showExistingOrderDialog: false,
    isLoadingExistingOrder: false,
    orderDataLoading: false,
    ordersList: [],
    ordersHeaders: [
      {
        text: "Номер заказа",
        align: "start",
        sortable: false,
        value: "ID"
      },
      {
        text: "Дата заказа",
        sortable: false,
        value: "DATE_INSERT"
      },
      {
        text: "Общая сумма",
        sortable: false,
        value: "TOTAL_PRICE"
      },
      {
        text: "Оплаты",
        sortable: false,
        value: "PAYMENT"
      },
      // { text: 'Calories', value: 'calories' },
      // { text: 'Fat (g)', value: 'fat' },
      // { text: 'Carbs (g)', value: 'carbs' },
      // { text: 'Protein (g)', value: 'protein' },
      { text: "Действия", value: "actions", sortable: false }
    ],
    orderPickerDate: [
      new Date().toISOString().substr(0, 10),
      new Date().toISOString().substr(0, 10)
    ],
    orderPickerMinDate: new Date().toISOString().substr(0, 10),
    showOrderDatePicker: false,
    orderDialog: false,
    moreTools: false,
    editingSetId: 0,
    showPaymentReportDialog: false,
    isPaymentReportLoading: false,
    paymentReportData: {},
    printLogo: "static/images/gavali.png",
    cartWeightRequiredSnack: false,
    cartError: "",
    updateSnack: false,
    downloadProgress: 0,
    discountToggle: "percent",
    firstNameRules: [v => !!v || "Фамилия обязательна для заполнения"],
    nameRules: [v => !!v || "Имя обязательно для заполнения"],
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
    udsPrice: "",
    cashBtn: true,
    cardBtn: false,
    udsBtn: false,
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
        width: 450,
        cellRenderer: "agGroupCellRenderer",
        suppressSizeToFit: true,
        flex: 3,
        wrapText: true
      },
      {
        headerName: "Цена",
        field: "price",
        width: 100,
        wrapText: true,
        cellRenderer: "MoneyColumn",
        flex: 2
      },
      { headerName: "Вес", field: "weight", width: 50, flex: 2 },
      {
        headerName: "Итоговая цена",
        field: "totalPrice",
        width: 100,
        wrapText: true,
        cellRenderer: "MoneyColumn",
        flex: 2
      },
      {
        headerName: "",
        field: "id",
        cellRenderer: "CartItemDelete",
        width: 40,
        flex: 1
      }
    ],
    context: null,
    frameworkComponents: null,
    // modules: AllModules,
    selectedCartItem: {},
    options: [],
    currentClient: {
      ID: null,
      NAME: null
    },
    setName: "",
    detailCellRendererParams: null,
    defaultColDef: null,
    savingClientLoading: false,
    savingOrderLoading: false,
    orderData: {},
    currentScaleWeight: 0,
    showPrintDialog: false,
    orderPrintData: {},
    existingOrderPrintData: {},
    isSetSaving: false,
    setPrintData: null,
    showSetPrintDialog: false,
    showScaleDialog: false,
    isPlusScale: false,
    isMinusScale: false,
    cartItems: [],
    portListener: null
  }),
  mixins: [loadData],
  components: { AgGridVue, "vue-select": vSelect, barcode: VueBarcode },
  asyncComputed: {
    async webHook() {
      return await settings.get("webHook");
    },
    async chosenPrinter() {
      return await settings.get("chosenPrinter");
    },
    async isOldScale() {
      return await settings.get("isOldScale");
    },
    async comPortName() {
      return await settings.get("comPortName");
    },
    async remotePrinterAddress() {
      return await settings.get("remotePrinterAddress");
    }
  },
  computed: {
    ...mapGetters({
      // webHook: "settings/webHook",
      // managerData: "settings/managerData",
      // chosenPrinter: "settings/chosenPrinter",
      // isOldScale: "settings/isOldScale",
      // comPortName: "settings/comPortName",
      // remotePrinterAddress: "settings/remotePrinterAddress",
      cartTabItems: "cartTabItems"
    }),
    tabItems() {
      return this.cartTabItems[this.tabIndex];
    },
    orderPickerDateFormatted() {
      const arrival = this.orderPickerDate;
      return Array.isArray(arrival)
        ? arrival
            .sort()
            .map(item => {
              return formatWithOptions({ locale: ru }, "d MMM", parseISO(item));
            })
            .join(" - ")
        : "";
    },
    showSetsGrid() {
      let res = false;
      [...this.tabItems].map(item => {
        if (item.type === "set") {
          res = true;
        }
      });
      return res;
    },
    singleProducts() {
      return this.tabItems.filter(item => item.type !== "set");
    },
    setProducts() {
      return this.tabItems.filter(item => item.type === "set");
    },
    domainUrl() {
      return "https://" + this.getHostname(this.webHook);
    },
    subTotalPrice() {
      let totalPrice = 0;
      [...this.tabItems].map(item => {
        const curPrice = item.price || 0;
        const curWeight = item.weight || 0;
        totalPrice += curPrice * curWeight;
      });
      return totalPrice;
    },
    totalPrice() {
      let totalPrice = 0;

      [...this.tabItems].map(item => {
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
    items: () => {
      return ProductItems.query().all();
    },
    categories: () => {
      return product.getters.categories;
    },
    filteredProducts() {
      if (this.searchText.length > 0) {
        return this.items.filter(item => {
          return (
            (item.name &&
              item.name
                .toLowerCase()
                .includes(this.searchText.toLowerCase())) ||
            (item.barcode && item.barcode.indexOf(this.searchText) >= 0) ||
            (item.customCode && item.customCode.indexOf(this.searchText) >= 0)
          );
        });
      }
      if (this.currentCategoryId > 0) {
        return this.items.filter(
          item => item.categoryId === this.currentCategoryId
        );
      }
      return this.items;
    },
    changePrice() {
      return (
        +this.cashPrice + +this.cardPrice + +this.udsPrice - +this.totalPrice
      );
    }
  },
  beforeMount() {
    this.gridOptions = {};
    this.gridSetOptions = {};
    this.context = { componentParent: this };
    this.frameworkComponents = {
      CartItemDelete,
      MoneyColumn
    };

    this.defaultColDef = { flex: 1, resizable: true };
    this.detailCellRendererParams = {
      detailGridOptions: {
        columnDefs: [
          {
            headerName: "Название",
            field: "name",
            suppressSizeToFit: true,
            flex: 3,
            wrapText: true
          },
          {
            headerName: "Цена",
            field: "price",
            width: 150,
            cellRenderer: "MoneyColumn",
            flex: 2,
            wrapText: true
          },
          { headerName: "Вес", field: "weight", width: 100, flex: 2 },
          {
            headerName: "Итоговая цена",
            field: "totalPrice",
            width: 150,
            cellRenderer: "MoneyColumn",
            flex: 2
          },
          {
            headerName: "",
            field: "id",
            cellRenderer: "CartItemDelete",
            flex: 1
          }
        ],
        context: { componentParent: this },
        defaultColDef: { flex: 1, resizable: true },
        frameworkComponents: {
          CartItemDelete,
          MoneyColumn
        },
        rowSelection: "single",
        onRowSelected: this.cartSetItemSelected
        // events: {
        //   "selection-changed": this.cartSetItemSelected,
        // },
      },
      getDetailRowData: params => {
        params.successCallback(params.data.childs);
      }
    };
  },
  mounted() {
    ipcRenderer.on("updateAvailable", () => {
      this.updateSnack = true;
    });
    ipcRenderer.on(
      "downloadProgress",
      ({ progress, bytesPerSecond, percent }) => {
        this.updateSnack = true;
        this.downloadProgress = percent;
      }
    );
    this.gridApi = this.gridOptions.api;
    this.gridSetApi = this.gridSetOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    document.removeEventListener("setWeight", this.setScaleWeight);
    document.addEventListener("setWeight", this.setScaleWeight);
    this.listenForBarcode();
    this.loadOrdersList();
  },
  beforeDestroy() {
    document.removeEventListener("setWeight", this.setScaleWeight);
  },
  methods: {
    ...mapActions([
      "toggleProduct",
      "toggleProductCart",
      "addProductToCart",
      "removeProductCart",
      "unselectAllItems",
      "setWeight",
      "clearCart",
      "appendSetWithItems",
      "setTabItemsByIndex",
      "pushTabItemByIndex"
    ]),
    openSearchDialog() {
      this.showSearchDialog = true;
      this.selectedCartItem = {};
      setTimeout(() => {
        this.$refs.searchText.focus();
      });
    },
    async showExistingOrderInfo(orderId) {
      this.isLoadingExistingOrder = true;

      this.showExistingOrderDialog = true;
      const webHook = await settings.get("webHook");
      const managerData = await settings.get("managerData");
      let { data } = await this.$http.post(webHook + `mysale.getOrderById`, {
        managerId: managerData.ID,
        orderId
      });

      this.existingOrderPrintData = data.result;

      this.isLoadingExistingOrder = false;
    },
    async loadOrdersList() {
      this.orderDataLoading = true;

      const webHook = await settings.get("webHook");
      const managerData = await settings.get("managerData");
      let { data } = await this.$http.post(webHook + `mysale.getOrderList`, {
        managerId: managerData.ID,
        dateRange: this.orderPickerDate
      });
      this.ordersList = data.result;
      this.orderDataLoading = false;
    },
    async selectProductBySearch() {
      const foundItem = this.filteredProducts[0];
      const foundIndex = this.tabItems.findIndex(prod => {
        return foundItem.id === prod.id;
      });

      const isOldScale = await settings.get("isOldScale");
      if (foundItem.totalAmountCount > 0) {
        if (foundIndex < 0) {
          if (isOldScale) {
            try {
              const comPortName = await settings.get("comPortName");
              let { data } = await this.$http.get(
                "http://localhost:8888/api/Scale?portName=" + comPortName
              );

              foundItem.weight = +data[0];
              foundItem.totalPrice = +foundItem.weight * +foundItem.price;
              this.pushTabItemByIndex({
                item: { ...foundItem, type: "product" },
                index: this.tabIndex
              });
              // this.cartItems.push({ ...foundItem, type: "product" });
              // this.showSearchDialog = false;
            } catch (e) {}
          } else {
            foundItem.weight = this.currentScaleWeight;
            foundItem.totalPrice = +foundItem.weight * +foundItem.price;
            this.pushTabItemByIndex({
              item: { ...foundItem, type: "product" },
              index: this.tabIndex
            });
            // this.cartItems.push({ ...foundItem, type: "product" });
            // this.showSearchDialog = false;
          }
        }
      } else {
        this.cartWeightRequiredSnack = true;
        this.cartError = `Товар "#${foundItem.barcode}: ${foundItem.name}" отсутствует в складах`;
      }
    },
    clearScaleDialog() {
      this.isPlusScale = false;
      this.isMinusScale = false;
    },
    plusSetCartItem(node) {
      this.editingSetId = node.data.id;
      this.showSearchDialog = true;
    },
    async showPaymentReport() {
      this.isPaymentReportLoading = true;
      const webHook = await settings.get("webHook");
      const managerData = await settings.get("managerData");
      let { data } = await this.$http.post(webHook + `mysale.getReport`, {
        managerId: managerData.ID
      });

      this.isPaymentReportLoading = false;

      this.paymentReportData = data.result;

      this.showPaymentReportDialog = true;
    },
    printBarcodeLabel(item) {
      // if (this.jspmWSStatus()) {
      //   //Create a ClientPrintJob
      //   var cpj = new JSPM.ClientPrintJob();
      //   cpj.clientPrinter = new JSPM.InstalledPrinter(this.chosenPrinter);
      //   //Set content to print...
      //   //Create Godex EZPL commands for sample label
      //
      //   var CR = "\x0D";
      //
      //   var cmds = "^Q40,3" + CR;
      //   cmds += "^W54" + CR;
      //   cmds += "^H7" + CR;
      //   cmds += "^P1" + CR;
      //   cmds += "^S3" + CR;
      //   cmds += "^AD" + CR;
      //   cmds += "^C1" + CR;
      //   cmds += "^R0" + CR;
      //   cmds += "~Q+0" + CR;
      //   cmds += "^O0" + CR;
      //   cmds += "^D0" + CR;
      //   cmds += "^E14" + CR;
      //   cmds += "~R255" + CR;
      //   cmds += "^L" + CR;
      //   cmds += "Dy4-me-dd" + CR;
      //   cmds += "Th:m:s" + CR;
      //   cmds += "BU,43,127,3,7,45,0,3," + item.barcode + CR;
      //   cmds += "AA,7,10,1,1,0,0E," + item.name + CR;
      //   cmds += "AA,7,64,1,1,0,0E,Цена:" + CR;
      //   cmds +=
      //     "AA,328,64,1,1,0,0E," +
      //     currency(+item.price, {
      //       symbol: "",
      //       separator: " ",
      //       decimal: ","
      //     }).format() +
      //     CR;
      //   cmds +=
      //     "AD,7,63,1,1,0,0E,............................................\n" +
      //     "E" +
      //     CR;
      //
      //   cpj.printerCommands = cmds;
      //   //Send print job to printer!
      //   cpj.sendToClient();
      // }
    },
    jspmWSStatus() {
      if (JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.Open)
        return true;
      else if (JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.Closed) {
        alert(
          "JSPrintManager (JSPM) is not installed or not running! Download JSPM Client App from https://neodynamic.com/downloads/jspm"
        );
        return false;
      } else if (
        JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.Blocked
      ) {
        alert("JSPM has blocked this website!");
        return false;
      }
    },

    async showPlusScale() {
      if (!this.selectedCartItem.id) {
        this.cartWeightRequiredSnack = true;
        this.cartError = "Не выбран товар";
        return;
      }
      this.isPlusScale = true;
      this.showScaleDialog = true;
      const isOldScale = await settings.get("isOldScale");

      if (isOldScale) {
        this.portListener = setInterval(async () => {
          try {
            const comPortName = await settings.get("comPortName");
            let { data } = await this.$http.get(
              "http://localhost:8888/api/Scale?portName=" + comPortName
            );

            this.currentScaleWeight = +data[0];
          } catch (e) {}
        }, 200);
      }

      setTimeout(() => {
        this.$refs.cartItemSelectedInput.focus();
      });
    },
    async showMinusScale() {
      if (!this.selectedCartItem.id) {
        this.cartWeightRequiredSnack = true;
        this.cartError = "Не выбран товар";
        return;
      }
      this.isMinusScale = true;
      this.showScaleDialog = true;
      const isOldScale = await settings.get("isOldScale");
      if (isOldScale) {
        this.portListener = setInterval(async () => {
          try {
            const comPortName = await settings.get("comPortName");
            let { data } = await this.$http.get(
              "http://localhost:8888/api/Scale?portName=" + comPortName
            );

            this.currentScaleWeight = +data[0];
          } catch (e) {}
        }, 200);
      }
      setTimeout(() => {
        this.$refs.cartItemSelectedInput.focus();
      });
    },
    clearCompleteBasket() {
      if (this.orderData.orderId > 0) {
        this.clearBasket();
        setTimeout(() => {
          this.$emit("closeTab");
        }, 200);
      }

      this.showPayMethodDialog = false;
    },
    clearBasket() {
      this.cartItems = [];
      this.discountValue = "";
      this.currentClient = {};
      this.clientFirstName = "";
      this.clientName = "";
      this.clientPhone = "";
      this.clientEmail = "";
      this.orderData = {};
      this.cashPrice = "";
      this.cardPrice = "";
      this.udsPrice = "";
    },
    payTotalSumm() {
      if (this.cashBtn) {
        this.cashPrice = this.totalPrice;
        this.cardPrice = 0;
        this.udsPrice = 0;
      } else if (this.cardBtn) {
        this.cashPrice = 0;
        this.cardPrice = this.totalPrice;
        this.udsPrice = 0;
      } else if (this.udsBtn) {
        this.cashPrice = 0;
        this.cardPrice = 0;
        this.udsPrice = this.totalPrice;
      }
    },
    async printNode(nodeId) {
      var node = document.getElementById(nodeId);

      htmlToImage
        .toBlob(node)
        .then(async blob => {
          const buffer = await Buffer.from(await blob.arrayBuffer());
          const userDataPath = (electron.app || electron.remote.app).getPath(
            "userData"
          );
          const remotePrinterAddress = await settings.get(
            "remotePrinterAddress"
          );

          if (remotePrinterAddress) {
            const tux = path.join(userDataPath, "remotePhoto.png");
            fs.writeFile(tux, buffer, err => {
              // var bodyFormData = new FormData();
              //bodyFormData.append('uploadedFile', screenshotPath);
              // bodyFormData.append("remotePhoto", fs.createReadStream(tux));

              this.$http.post(remotePrinterAddress + "/print", {
                remotePhoto: buffer.toString("base64")
              });
            });
          } else {
            // Select the adapter based on your printer type
            const device = new escpos.USB();
            // const device = new escpos.Network("192.168.0.106");
            // const device  = new escpos.Serial('/dev/usb/lp0');

            const options = {
              // encoding: "cp1251"
              /*encoding: "GB18030"*/
              /* default */
            };
            const printer = new escpos.Printer(device, options);
            const tux = path.join(userDataPath, "test.png");
            fs.writeFile(tux, buffer, err => {
              escpos.Image.load(tux, img => {
                device.open(error => {
                  printer
                    .align("ct")
                    .image(img, "d24")
                    .then(() => {
                      printer.cut().close();
                    });
                });
              });
            });
          }
        })
        .catch(function(error) {
          console.error("oops, something went wrong!", error);
        });
    },
    async printSets() {
      const sets = [];

      const cartItems = [...this.tabItems];
      cartItems.map(item => {
        if (item.type === "set") {
          sets.push(item);
        }
      });

      if (!sets.length) {
        this.cartWeightRequiredSnack = true;
        this.cartError = `В корзине нет сетов`;
        return;
      }

      this.isSetSaving = true;

      const webHook = await settings.get("webHook");
      let { data: setsData } = await this.$http.post(
        webHook + `mysale.createSets`,
        {
          sets
        }
      );

      this.setPrintData = setsData.result.sets;

      this.isSetSaving = false;

      this.showSetPrintDialog = true;
      setTimeout(() => {
        this.printNode("sets-print");
        this.clearBasket();
      }, 300);
    },
    async printOrder() {
      const sets = [];

      const cartItems = [...this.tabItems];
      const cartItemsTable = [];
      const subTotalPrice = this.subTotalPrice;
      const totalPrice = this.totalPrice;
      const discountValue = this.discountValue;
      const currentTime = format(new Date(), "HH:mm:ss");
      const currentDate = format(new Date(), "d.MM.YYY");
      const managerData = await settings.get("managerData");
      const managerName = managerData.NAME;
      const managerLastName = managerData.LAST_NAME;
      const { orderId, storeData } = this.orderData;
      const address = storeData ? storeData.ADDRESS : "";

      this.showPrintDialog = true;

      let discountPrintValue = "";
      if (discountValue) {
        if (this.discountToggle === "percent") {
          discountPrintValue = discountValue + "%";
        } else {
          discountPrintValue =
            currency(+discountValue, {
              symbol: "",
              separator: ".",
              decimal: ","
            }).format() + " SO'M";
        }
      }

      this.orderPrintData = {
        address,
        discountPrintValue,
        printTime: currentDate + " " + currentTime,
        orderId,
        manager: managerName + " " + managerLastName,
        subTotalPrice:
          currency(+subTotalPrice, {
            symbol: "",
            separator: ".",
            decimal: ","
          }).format() + " SO'M",
        totalPrice:
          currency(+totalPrice, {
            symbol: "",
            separator: ".",
            decimal: ","
          }).format() + " SO'M"
      };

      setTimeout(() => {
        this.printNode("order-print");
      }, 300);
    },
    async saveOrder() {
      if (this.changePrice < 0) {
        this.cartWeightRequiredSnack = true;
        this.cartError = `Не указаны суммы оплат`;
        return;
      }

      this.savingOrderLoading = true;
      const managerData = await settings.get("managerData");
      let orderData = {
        client: this.currentClient,
        cartItems: this.tabItems,
        cashPrice: this.cashPrice,
        cardPrice: this.cardPrice,
        udsPrice: this.udsPrice,
        discount: this.discountValue,
        managerId: managerData.ID,
        discountType: this.discountToggle
      };

      const webHook = await settings.get("webHook");
      let {
        data: { result: order }
      } = await this.$http.post(webHook + `mysale.order.create`, orderData);

      if (order.error) {
        this.cartWeightRequiredSnack = true;
        this.cartError = order.error;
      } else {
        this.orderData = order;
      }
      this.savingOrderLoading = false;
      this.printOrder();
    },
    listenForBarcode() {
      let pressed = false;
      let chars = [];
      let vm = this;
      window.removeEventListener("keypress", () => {});
      window.addEventListener("keypress", e => {
        if (
          e.which == 71 ||
          e.which == 85 ||
          (e.which >= 48 && e.which <= 57)
        ) {
          chars.push(String.fromCharCode(e.which));
        }

        if (pressed === false) {
          setTimeout(function() {
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
      const foundItem = items.filter(item => item.barcode === code)[0];
      const foundIndex = this.tabItems.findIndex(prod => {
        return foundItem.id === prod.id;
      });

      if (foundItem.totalAmountCount > 0) {
        if (foundIndex < 0) {
          this.pushTabItemByIndex({
            item: { ...foundItem, type: "product" },
            index: this.tabIndex
          });
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

      // if (!this.currentClient.ID) {
      //   this.cartWeightRequiredSnack = true;
      //   this.cartError = "Не указан клиент";
      //   return;
      // }

      [...this.tabItems].map(item => {
        if (item.type !== "set" && item.weight === 0) {
          res = false;
        }

        if (item.type === "set") {
          item.childs.map(child => {
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
      } else {
        this.orderData = {};
      }

      this.showPayMethodDialog = res;
    },
    setScaleWeight(data) {
      this.currentScaleWeight = data.detail.weight;
    },
    async saveClient() {
      this.savingClientLoading = true;
      const webHook = await settings.get("webHook");
      if (this.currentClient.ID) {
        const managerData = await settings.get("managerData");
        let { data } = await this.$http.get(
          webHook +
            `myuser.updateUser?id=${this.currentClient.ID}&PHONE=${this.clientPhone}&EMAIL=${this.clientEmail}&NAME=${this.clientName}&LAST_NAME=${this.clientFirstName}`
        );
        this.currentClient = data.result.user;
      } else {
        let { data } = await this.$http.get(
          webHook +
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
    },
    removeCartItem(node) {
      let item = node.data;
      if (item.parentId) {
        const items = [...this.tabItems].map(parent => {
          if (parent.id === item.parentId) {
            parent.childs = parent.childs.filter(child => child.id !== item.id);
            parent.price = parent.childs.reduce(
              (accumulator, child) => accumulator + child.price * child.weight,
              0
            );
            parent.totalPrice = parent.childs.reduce(
              (accumulator, child) => accumulator + child.price * child.weight,
              0
            );
          }
          return parent;
        });
        this.setTabItemsByIndex({ items, index: this.tabIndex });
      } else {
        const items = [...this.tabItems].filter(prod => item.id !== prod.id);
        this.setTabItemsByIndex({ items, index: this.tabIndex });
      }
      setTimeout(() => {
        if (this.gridSetApi) {
          this.gridSetApi.forEachLeafNode(node => {
            node && node.setExpanded(true);
          });
        }
      }, 300);
    },
    cartItemSelected() {
      setTimeout(() => {
        const selectedRows = this.gridApi.getSelectedRows();
        if (selectedRows.length) {
          this.selectedCartItem = selectedRows[0];
        } else {
          this.selectedCartItem = {};
        }
      });
    },
    firstDataRendered() {
      this.gridSetApi.forEachLeafNode(node => {
        node && node.setExpanded(true);
      });
    },
    cartSetItemSelected(event) {
      if (event.node && !event.node.selected) {
        return;
      }
      if (event.node) {
        this.selectedCartItem = event.node.data;
      } else {
        const selectedSetRows = this.gridSetApi.getSelectedRows();
        if (selectedSetRows.length) {
          this.selectedCartItem = selectedSetRows[0];
        } else {
          this.selectedCartItem = {};
        }
      }
      // this.$refs.cartItemSelectedInput.focus();
    },
    getHostname: url => {
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
      if (this.udsBtn) {
        this.udsPrice = "";
      }
    },
    append(number) {
      if (["+", "-"].includes(number)) {
        if (!this.currentWeight) {
          return;
        }
        if (!["+", "-"].includes(this.currentWeight.toString().substr(-1))) {
          this.currentWeight = this.currentWeight + number;
        }
      } else {
        this.currentWeight = this.currentWeight + number;
      }
    },
    shopAppend(number) {
      const udsPrice = this.udsPrice || 0;
      if (this.cashBtn) {
        this.cashPrice = this.cashPrice + number;
        this.cardPrice =
          this.totalPrice - udsPrice - this.cashPrice > 0
            ? this.totalPrice - udsPrice - this.cashPrice
            : 0;
      }
      if (this.cardBtn) {
        this.cardPrice = this.cardPrice + number;
        this.cashPrice =
          this.totalPrice - udsPrice - this.cardPrice > 0
            ? this.totalPrice - udsPrice - this.cardPrice
            : 0;
      }
      if (this.udsBtn) {
        this.udsPrice = this.udsPrice + number;
        // this.cashPrice =
        //     this.totalPrice - this.udsPrice > 0
        //         ? this.totalPrice - this.udsPrice
        //         : 0;
      }
    },
    substr(param) {
      if (param === "currentWeight") {
        this.currentWeight = this.currentWeight
          .toString()
          .substring(0, this.currentWeight.length - 1);
      }
      if (param.includes("cashPrice") && this.cashBtn) {
        this.cashPrice = this.cashPrice
          .toString()
          .substring(0, this.cashPrice.toString().length - 1);
      }
      if (param.includes("cardPrice") && this.cardBtn) {
        this.cardPrice = this.cardPrice
          .toString()
          .substring(0, this.cardPrice.toString().length - 1);
      }
      if (param.includes("udsPrice") && this.udsBtn) {
        this.udsPrice = this.udsPrice
          .toString()
          .substring(0, this.udsPrice.toString().length - 1);
      }
    },
    dot() {
      if (this.currentWeight.toString().indexOf(".") === -1) {
        this.append(".");
      }
    },
    async equal() {
      this.currentWeight = this.currentWeight.replace(",", ".");
      let weight = this.currentWeight
        ? this.currentWeight
        : this.currentScaleWeight;
      const isOldScale = await settings.get("isOldScale");

      if (isOldScale) {
        clearTimeout(this.portListener);
      }

      let { weight: itemWeight } = this.selectedCartItem;
      if (!itemWeight) {
        itemWeight = 0;
      }
      itemWeight = +itemWeight;
      if (this.isPlusScale) {
        itemWeight += +weight;
      }

      if (this.isMinusScale) {
        itemWeight -= +weight;
      }

      let id = this.selectedCartItem.id;
      weight = +parseFloat(itemWeight).toFixed(3);
      if (this.selectedCartItem.parentId) {
        const items = [...this.tabItems].map(parent => {
          parent.totalPrice = 0;
          parent.price = 0;
          parent.weight = 1;
          if (parent.id === this.selectedCartItem.parentId) {
            parent.childs = parent.childs.map(child => {
              if (child.id === id) {
                child.weight = +weight;
                child.totalPrice = +weight * +child.price;
              }
              parent.totalPrice += child.totalPrice || 0;
              parent.price += child.totalPrice || 0;
              return child;
            });
          } else if (parent.childs) {
            parent.childs = parent.childs.map(child => {
              parent.totalPrice += child.totalPrice || 0;
              parent.price += child.totalPrice || 0;
              return child;
            });
          }
          return parent;
        });
        await this.setTabItemsByIndex({ items, index: this.tabIndex });
      } else {
        const items = [...this.tabItems].map(item => {
          if (item.id === id) {
            item.weight = +weight;
            item.totalPrice = +weight * +item.price;
          }
          return item;
        });
        await this.setTabItemsByIndex({ items, index: this.tabIndex });
      }

      this.currentWeight = "";
      this.isPlusScale = false;
      this.isMinusScale = false;
      this.showScaleDialog = false;
      setTimeout(() => {
        if (this.gridSetApi) {
          this.gridSetApi.forEachLeafNode(node => {
            node && node.setExpanded(true);
          });
        }
      }, 300);
    },
    changeItem(key, val) {},
    categoryToggle(id) {
      this.currentCategoryId = id;
    },
    togglePaymentType(type) {
      if (type === "cash") {
        this.cardBtn = false;
        this.udsBtn = false;
        this.cashBtn = true;
        this.cardPrice = "";
      } else if (type === "card") {
        this.cardBtn = true;
        this.cashBtn = false;
        this.udsBtn = false;
        this.cashPrice = "";
      } else if (type === "uds") {
        this.cardBtn = false;
        this.cashBtn = false;
        this.udsBtn = true;
      }
    },

    async onSearch(search, loading) {
      try {
        loading(true);
        const webHook = await settings.get("webHook");
        let { data } = await this.$http.get(
          webHook + `myuser.getList?filter[NAME]=${search}`
        );
        this.options = data.result;
        loading(false);
      } catch (e) {
        console.log(e);
      }
    },
    async addChosenProducts() {
      if (this.editingSetId.length > 0) {
        const selectedForSetItems = [];
        const selectedItems = await ProductItems.query()
          .where("selected", true)
          .all();
        selectedItems.map(item => {
          if (item.selected) {
            selectedForSetItems.push(item);
          }
        });

        let setId = this.editingSetId;
        let items = selectedForSetItems;
        const newItems = [...this.tabItems].map(item => {
          if (item.type === "set" && item.id === setId) {
            items.map(child => {
              const foundIndex = item.childs.findIndex(prod => {
                return child.id === prod.id;
              });
              if (child.totalAmountCount > 0) {
                if (foundIndex < 0) {
                  item.childs.push({ ...child, parentId: setId });
                }
              }
            });
          }

          return item;
        });

        this.setTabItemsByIndex({ items: newItems, index: this.tabIndex });

        this.editingSetId = "";
        setTimeout(() => {
          this.gridSetApi.forEachLeafNode(node => {
            node && node.setExpanded(true);
          });
        }, 300);
      } else {
        if (this.set) {
          const parentId =
            "set_" + Math.floor(Math.random() * Math.floor(99999));
          const item = {
            name: this.setName,
            weight: 1,
            childs: [],
            price: 0,
            totalPrice: 0,
            type: "set",
            id: parentId
          };
          const selectedItems = await ProductItems.query()
            .where("selected", true)
            .all();

          selectedItems.map(prod => {
            if (prod.selected) {
              if (prod.totalAmountCount > 0) {
                item.childs.push({ ...prod, parentId });
              } else {
                this.cartWeightRequiredSnack = true;
                this.cartError = `Товар "#${prod.barcode}: ${prod.name}" отсутствует в складах`;
              }
            }
          });
          const newItem = {
            id: item.id,
            name: item.name,
            barcode: item.barcode,
            img: item.image,
            price: item.price,
            totalPrice: 0,
            weight: 0,
            type: item.type
          };
          if (item.childs) {
            newItem.childs = item.childs;
          }

          this.pushTabItemByIndex({ item: newItem, index: this.tabIndex });

          setTimeout(() => {
            this.gridSetApi.forEachLeafNode(node => {
              node && node.setExpanded(true);
            });
          }, 300);
        } else {
          const selectedItems = await ProductItems.query()
            .where("selected", true)
            .all();

          selectedItems.map(item => {
            if (item.selected) {
              const foundIndex = this.tabItems.findIndex(prod => {
                return item.id === prod.id;
              });

              if (item.totalAmountCount > 0) {
                if (foundIndex < 0) {
                  let newItem = {
                    id: item.id,
                    name: item.name,
                    barcode: item.barcode,
                    img: item.image,
                    price: item.price,
                    totalPrice: 0,
                    weight: 0,
                    type: item.type
                  };
                  if (item.type === "set") {
                    let setTotalPrice = 0;
                    newItem.childs = [];
                    newItem.weight = 1;
                    item.childs.map(child => {
                      setTotalPrice += +child.QUANTITY * +child.BASE_PRICE;
                      newItem.childs.push({
                        id: child.ID,
                        name: child.ELEMENT_NAME,
                        barcode: child.BARCODE_BARCODE,
                        price: child.BASE_PRICE,
                        type: child.type,
                        totalAmountCount: child.TOTAL_AMOUNT_COUNT,
                        img: child.image,
                        totalPrice: +child.QUANTITY * +child.BASE_PRICE,
                        weight: child.QUANTITY,
                        parentId: item.id
                      });
                    });
                    newItem.totalPrice = setTotalPrice;
                  }
                  this.pushTabItemByIndex({
                    item: newItem,
                    index: this.tabIndex
                  });
                }
              } else {
                this.cartWeightRequiredSnack = true;
                this.cartError = `Товар "#${item.barcode}: ${item.name}" отсутствует в складах`;
              }
            }
          });
        }
      }
      this.set = false;
      this.setName = "";
      this.unselectAllItems();
      this.showSearchDialog = false;

      await ProductItems.update({
        where: item => {
          return item.selected;
        },
        data: {
          selected: false
        }
      });
    },
    focusDiscountInput() {
      this.$refs.discountInput.focus();
    },
    showOrderDialog() {
      this.orderDialog = true;
    }
  },
  filters: {
    money: value => {
      return (
        value &&
        currency(+value, { symbol: "", separator: " ", decimal: "," }).format()
      );
    }
  }
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
.clear-user-agent-styles table,
.clear-user-agent-styles thead,
.clear-user-agent-styles tbody,
.clear-user-agent-styles tfoot,
.clear-user-agent-styles tr,
.clear-user-agent-styles th,
.clear-user-agent-styles td {
  display: block;
  width: auto;
  height: auto;
  margin: 0;
  padding: 0;
  border: none;
  border-collapse: inherit;
  border-spacing: 0;
  border-color: inherit;
  vertical-align: inherit;
  text-align: left;
  font-weight: inherit;
  -webkit-border-horizontal-spacing: 0;
  -webkit-border-vertical-spacing: 0;
}
.clear-user-agent-styles th,
.clear-user-agent-styles td {
  display: inline-block;
  vertical-align: top;
}

.clear-user-agent-styles.print-cart-items-table td:first-child,
.clear-user-agent-styles.print-cart-items-table th:first-child {
  width: 12%;
}
.clear-user-agent-styles.print-cart-items-table td:nth-child(2),
.clear-user-agent-styles.print-cart-items-table th:nth-child(2) {
  width: 40%;
}
.clear-user-agent-styles.print-cart-items-table td:nth-child(3),
.clear-user-agent-styles.print-cart-items-table th:nth-child(3),
.clear-user-agent-styles.print-cart-items-table td:nth-child(4),
.clear-user-agent-styles.print-cart-items-table th:nth-child(4) {
  width: 19%;
}

.clear-user-agent-styles.print-cart-items-table th {
  border-bottom: 2px dashed;
}

.clear-user-agent-styles tbody {
  border-bottom: 2px dashed;
}

.clear-user-agent-styles td:first-child,
.clear-user-agent-styles th:first-child {
  width: 40%;
}
.clear-user-agent-styles td:last-child,
.clear-user-agent-styles th:last-child {
  width: 52%;
  text-align: right;
}
#order-print {
  font-size: 20px;
}
</style>

<style>
.ag-cell-value,
.ag-group-value {
  white-space: initial;
  text-overflow: inherit;
  /* overflow-wrap: break-word; */
  line-height: 14px !important;
}
.ag-theme-material {
  font-size: 11px;
}
.ag-theme-material .ag-details-row {
  padding: 0;
}
.ag-center-cols-viewport {
  height: auto !important;
}
</style>
