import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, set, push, update, remove } from "firebase/database";

import dotenv from "dotenv";
import { v4 } from "uuid";

const result = dotenv.config();

const firebaseConfig = {
  apiKey: process.env.firebase_apiKey,
  authDomain: process.env.firebase_authDomain,
  databaseURL: process.env.firebase_databaseURL,
  projectId: process.env.firebase_projectId,
  storageBucket: process.env.firebase_storageBucket,
  messagingSenderId: process.env.firebase_messagingSenderId,
  appId: process.env.firebase_appId,
  measurementId: process.env.firebase_measurementId
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const UsersRef = ref(db, "users");

const aUsers = [];
export const userFirebaseStore = {

  async getAllUsers() {
    await get(child(UsersRef, "/")).then((snapshot) => {
      if (snapshot.exists()) {
        console.log("get all = ", snapshot.val());
        aUsers.length = 0;
        snapshot.forEach((childSnapshot) => {
          aUsers.push(childSnapshot.val());
        });
      }
      return aUsers;
    }).catch((error) => {
      console.error(error);
      return null;
    });
  },

  async getUserById(id) {
    if (id) {
      let retVal = null;
      await get(child(UsersRef, `/${id}`)).then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          retVal = snapshot.val();
          return retVal;
        }
        console.log("No data available");
        return null;

      }).catch((error) => {
        console.error(error);
        return null;
      });
    }
  },

  async addUser(user) {
    let userData = {
      _id: v4(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      userType: user.userType
    };
    // Get a key for a new Post.
    await set(ref(db, `users/${userData._id}`), userData).then(async () => {
      console.log("user added");
      await get(ref(db, `users/${userData._id}`)).then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          const retVal = snapshot.val();
          userData = {
            _id: userData._id,
            firstName: snapshot.val().firstName,
            lastName: snapshot.val().lastName,
            email: snapshot.val().email,
            password: snapshot.val().password,
            userType: snapshot.val().userType
          };
          return userData;
        }
        console.log("No data available");
        return null;

      }).catch((error) => {
        console.error(error);
        return null;
      });
    });
  },

  async getUserByEmail(email) {
    return null;
  },

  async suspendUserById(id) {
  ;
  },

  async userIsAdminById(id) {
   ;
  },

  async userIsNormalById(id) {
    ;
  },
  async deleteUserById(id) {
    ;
  },

  async deleteAll() {
    const dbRef = ref(db, "users");
    await remove(dbRef).then(() => {
      console.log("All users removed");
    });
  }
};
