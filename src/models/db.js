import { userMemStore } from "./mem/user-mem-store.js";

import { categoryMemStore } from "./mem/category-mem-store.js";
import { poiMemStore } from "./mem/poi-mem-store.js";

import { userJsonStore } from "./json/user-json-store.js";
import { playlistJsonStore } from "./json/playlist-json-store.js";
import { trackJsonStore } from "./json/track-json-store.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";
import { playlistMongoStore } from "./mongo/playlist-mongo-store.js";
import { trackMongoStore } from "./mongo/track-mongo-store.js";
import { connectMongo } from "./mongo/connect.js";

export const db = {
  userStore: null,
  categoryStore: null,
  poiStore: null,

  init(storeType) {
    switch (storeType) {
      case "json" :
        this.userStore = userJsonStore;
        this.playlistStore = playlistJsonStore;
        this.poiStore = trackJsonStore;
        break;
      case "mongo" :
        this.userStore = userMongoStore;
        this.playlistStore = playlistMongoStore;
        this.poiStore = trackMongoStore;
        connectMongo();
        break;
      default :
        this.userStore = userMemStore;
        this.categoryStore = categoryMemStore;
        this.poiStore = poiMemStore;
    }
  }
};
