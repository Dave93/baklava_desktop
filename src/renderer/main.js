import Vue from 'vue'
import axios from 'axios'
import Serialport from 'serialport';
// import { AgGridVue } from "ag-grid-vue";

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
    const parser = new Readline();
    localPort.pipe(parser);
    // const setWeights = {};
    parser.on('data', (data) => {
      console.log(data);
      const content = data.toString('utf8');
      console.log(content);
      const re = new RegExp('U.*([0-9]+\\.[0-9]+)');
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


listenForScale();

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  vuetify,
  template: '<App/>'
}).$mount('#app')
