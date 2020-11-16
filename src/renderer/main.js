import Vue from 'vue'
import axios from 'axios'
import Serialport from 'serialport';
// import { AgGridVue } from "ag-grid-vue";

const Store = require('electron-store');

const eStore = new Store();

import App from './App'
import router from './router'
import store from './store'


import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
// Vue.use(AgGridVue)
Vue.use(Vuetify)

const opts = {}

const vuetify = new Vuetify(opts);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

let storeData = eStore.get('isOldScale');
if (storeData) {
  storeData = JSON.parse(storeData);
}
const isOldScale = (storeData || false)

const listenForScale = async () => {
  const ports = await Serialport.list();
  console.log(ports);
  ports.map((port) => {
    const localPort = new Serialport(port.comName, {
      baudRate: 9600,
      databits: 8,
      parity: 'none',
      stopBits: 1,
      flowControl: false,
    });
    const { Readline } = Serialport.parsers;
    const parser = new Readline('W\n');
    localPort.pipe(parser);
    // const setWeights = {};
    parser.on('data', (data) => {
      console.log(data);
      const content = data.toString('utf8');
      console.log(content);
      const re = new RegExp('S.*([0-9]+\\.[0-9]+)');
      if (re.test(content)) {
        const match = re.exec(content);
        // if (!setWeights[match[1].toString()]) {
        //   setWeights[match[1].toString()] = 0;
        // }
        // setWeights[match[1].toString()]++;
        // if (setWeights[match[1].toString()] === 2) {
          const event = new CustomEvent('setWeight', {
            detail: {
              weight: +match[1],
            },
          });
          document.dispatchEvent(event);
          // setWeights[match[1].toString()] = 0;
        // }
      }
    });
    return 0;
  });
};

const listenOldScale  = () => {
  setInterval(async () => {
    try {
      let comPortName = eStore.get('comPortName');
      comPortName = JSON.parse(comPortName);
      let { data } = await axios.get(
          "http://localhost:8888/api/Scale?portName=" + comPortName
      );

      const event = new CustomEvent('setWeight', {
        detail: {
          weight: +data[0]
        },
      });
      document.dispatchEvent(event);
    } catch (e) {}
  }, 100);
};

if (!isOldScale) {
  listenForScale();
} else {
  listenOldScale();
}

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  vuetify,
  template: '<App/>'
}).$mount('#app')
