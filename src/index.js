import localforage from 'localforage';

/* ----------------------- Mixin ------------------------ */

/** This mixin adds:
 * - `isOnline`, `isOffline` data properties
 * - `online`, `offline` in-component events
 * */
export const VueOfflineMixin = {
  data() {
    return {
      isOnline: false,
      isOffline: false,
    };
  },
  mounted() {
    if (typeof window !== 'undefined') {
      navigator.onLine ? (this.isOnline = true) : (this.isOffline = true);

      const onlineHandler = () => {
        this.$emit('online');
        this.isOnline = true;
        this.isOffline = false;
      };

      const offlineHandler = () => {
        this.$emit('offline');
        this.isOffline = true;
        this.isOnline = false;
      };

      window.addEventListener('online', onlineHandler);
      window.addEventListener('offline', offlineHandler);

      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('online', onlineHandler);
        window.removeEventListener('offline', offlineHandler);
      });
    }
  },
};

/* ----------------------- Storage ------------------------ */

export const VueOfflineStorage = {
  init(options = {}) {
    const localforageInstances = localforage.createInstance(options);

    if (!options.instances) {
      return localforageInstances;
    }

    for (const instance of options.instances) {
      const name = instance.storeName || instance.name;

      if (!name) {
        continue;
      }

      localforageInstances[name] = localforage.createInstance(instance);
    }
  },
};

/* ----------------------- Plugin ------------------------ */

/** Registers VueOfflineMixin in whole application giving you access to:
 * - isOnline, isOffline data properties
 * - online, offline in-component events
 */
export const VueOfflinePlugin = {
  install(Vue, options = {}) {
    const defaultOptions = {
      mixin: true,
      storage: {},
    };

    const pluginOptions = {
      ...defaultOptions,
      ...options,
    };
    if (pluginOptions.storage)
      Vue.prototype.$offlineStorage = VueOfflineStorage.init(options.storage);
    if (pluginOptions.mixin) Vue.mixin(VueOfflineMixin);
  },
};

export default VueOfflinePlugin;
