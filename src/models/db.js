import {userMemStore} from "./mem/user-mem-store.js";

import {categoryMemStore} from "./mem/category-mem-store.js";
import {poiMemStore} from "./mem/poi-mem-store.js";

import {userJsonStore} from "./json/user-json-store.js";
import {categoryJsonStore} from "./json/category-json-store.js";
import {poiJsonStore} from "./json/poi-json-store.js";


import {userMongoStore} from "./mongo/user-mongo-store.js";
import {categoryMongoStore} from "./mongo/category-mongo-store.js";
import {poiMongoStore} from "./mongo/poi-mongo-store.js";
import {connectMongo} from "./mongo/connect.js";
import {userFirebaseStore} from "./firebase/user-firebase-store.js";

export const db = {
    userStore: null,
    categoryStore: null,
    poiStore: null,

    async init(storeType) {
        switch (storeType) {
            case "json" :
                this.userStore = userJsonStore;
                this.categoryStore = categoryJsonStore;
                this.poiStore = poiJsonStore;
                break;
            case "mongo" :
                this.userStore = userMongoStore;
                this.categoryStore = categoryMongoStore;
                this.poiStore = poiMongoStore;
                connectMongo();
                break;

            case "firebase":
                await userFirebaseStore.config().then(r => {
                    this.userStore = userFirebaseStore;
                });

                break;
            default :
                this.userStore = userMemStore;
                this.categoryStore = categoryMemStore;
                this.poiStore = poiMemStore;
        }
    }
};
