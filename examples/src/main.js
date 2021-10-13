import Vue from 'vue'
import App from './App.vue'

import VueOffline from "../../src/index";

Vue.config.productionTip = false

Vue.use(VueOffline, {
  storage: {
    // name: 'example-app',
    // storeName: 'store',
    instances: [
      {
        name: 'example-app',
        storeName: 'store-one',
      },
      {
        name: 'example-app',
        storeName: 'store-two',
      },
    ],
  },
});

new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')
