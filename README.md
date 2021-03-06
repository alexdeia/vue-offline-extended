# Vue Offline extended version

This library allows you to enhance offline capabilities of your Vue.js application. It's especially useful when you're building offline-first Progressive Web Apps or just want to inform your users that they lost internet connection. 

**TL;DR** Adds `isOnline` `isOffline` `showOnline` data properties, `online`, `offline` events via global mixin and enables offline storage via `Vue.$offlineStorage` based on [localforage](https://github.com/localForage/localForage) library.

This library is fork of original [vue-offline](https://github.com/filrak/vue-offline). Thanks to Filip Rakowski.

- [Vue Offline extended version](#vue-offline-extended-version)
  - [Installation](#installation)
  - [Capabilities](#capabilities)
    - [VueOfflineMixin](#vueofflinemixin)
    - [Additional configuration](#additional-configuration)
    - [VueOfflineStorage](#vueofflinestorage)
    - [Additional configuration](#additional-configuration-1)

Initially made for [Vue Storefront](https://github.com/DivanteLtd/vue-storefront)

## Installation
To install this package as a plugin just type:
````
yarn add vue-offline-extended
````

and add it into your application with
````js
import VueOffline from 'vue-offline-extended'

Vue.use(VueOffline)
````

## Capabilities
This plugin contains two features:

### VueOfflineMixin
Global mixin that'll add following properties to every component in your application:

- `isOnline`
- `isOffline`
- `showOnline`
````html
<template>
    <p v-if="isOnline">This part will be visible only if user is online</p>
    <p v-if="isOffline">This part will be visible only if user is offline</p>
    <p v-if="showOnline">This part will be visible only if user is back online and then this it will be disappear</p>
</template>
````
````js
export default {
    name: 'MyComponent',
    computed: {
        networkStatus () {
            return this.isOnline ? 'My network is fine' : 'I am offline'
        }
    }
}
````
- `online`, `offline` and other events in every component
````js
export default {
    name: 'MyComponent',
    mounted () {
        this.$on('offline', () => {
            alert('You are offline! The website will not work')
        })
    }
}
````

### Additional configuration

By default `VueOfflineMixin` is injected into every component which may be a cause of potential performance problems. You can disable this behavior by setting plugin option `mixin` to `false`. 
````js
Vue.use(VueOffline, {
    mixin: false
})
````

You can still make use of `VueOfflineMixin` by injecting it directly into your components:
````js 
import { VueOfflineMixin } from 'vue-offline-extended'

export default {
    name: 'MyComponent',
    mixins: [VueOfflineMixin],
    computed: {
        networkStatus () {
            return this.isOnline ? 'My network is fine' : 'I am offline'
        }
    },
    mounted () {
        this.$on('offline', () => {
            alert('You are offline! The website will not work')
        })
    }
}
````
### VueOfflineStorage 
 Offline storage that uses [localforage](https://github.com/localForage/localForage) to persist data for offline usage and caching.

The storage object has following properties as localforage [data-api](http://localforage.github.io/localForage/#data-api).

To use this storage inside your app you can either
-  use `this.$offlineStorage` from Vue instance property in your components:
````js
export default {
    methods: {
        async getUserData () {
            if (this.isOnline) {
                // make network request that returns 'userData' object
                this.appData = userData
                await this.$offlineStorage.setItem('user', userData)
            } else {
                await this.appData = this.$offlineStorage.getItem('user')
            }
        }
    }
}
````
- import the `VueOfflineStorage` instance if you want to use it somewhere else (e.g. Vuex store)
````js
import { VueOfflineStorage } from 'vue-offline-extended'

try {
    const cachedData = await VueOfflineStorage.getItem('cached-data');
    // This code runs once the value has been loaded
    // from the offline store.
    console.log(value);
} catch (err) {
    // This code runs if there were any errors.
    console.log(err);
}

````
### Additional configuration

By default `VueofflineStorage` reference is included into every Vue component. You can disable this behavior by setting plugin option `storage` to `false`. 
````js
Vue.use(VueOffline, {
    storage: false
})
````

You can still make use of `VueOfflineStorage` by importing it directly into your components:
````js 
import { VueOfflineStorage } from 'vue-offline-extended'

export default {
    name: 'MyComponent',
    methods: {
        async getUserData () {
            if (this.isOnline) {
                // make network request that returns 'userData' object
                this.appData = userData
                await this.$offlineStorage.setItem('user', userData)
            } else {
                await this.appData = this.$offlineStorage.getItem('user')
            }
        }
    }
}
````

Create single store instance
```js
Vue.use(VueOffline, {
  storage: {
    name: 'db-name',
    storeName: 'store',
  },
});

...

// Get item
await this.$offlineStorage.getItem(key)
```


Create multiple store instances (stores)
```js
Vue.use(VueOffline, {
  storage: {
    instances: [
      {
        name: 'db-name',
        storeName: 'store-one',
      },
      {
        name: 'db-name',
        storeName: 'store-two',
      },
    ],
  },
});

...

// for store-one
await this.$offlineStorage['store-one'].getItem(key)

// for store-two
await this.$offlineStorage['store-two'].setItem(key, value)
```

