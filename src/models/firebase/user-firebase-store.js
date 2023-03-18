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

// Initialize Firebase now called on init if requires so as not to cause errors when loading with test .env
let app = null; // initializeApp(firebaseConfig);
let db = null ; // getDatabase(app);
let UsersRef = null // ref(db, "users");

export const userFirebaseStore = {
 async config(){
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    UsersRef = ref(db, "users");
  },
  async getAllUsers() {
    const aUsers = [];
    await get(child(UsersRef, "/")).then((snapshot) => {
      if (snapshot.exists()) {
        //  console.log("get all = ", snapshot.val());
        aUsers.length = 0;
        snapshot.forEach((childSnapshot) => {
          aUsers.push(childSnapshot.val());
        });
      }
    }).catch((error) => {
      console.error(error);
      return null;
    });
    return aUsers;
  },

  async getUserById(id) {
    let retVal = null;
    if (id) {
      try {
        await get(child(UsersRef, `${id}`)).then((snapshot) => {
          if (snapshot.exists()) {
            // console.log(snapshot.val());
            retVal = snapshot.val();
          }
        }).catch((error) => {
          console.error(error);
          retVal = null;
        });
      } catch (ex) {
        console.log(`getUserById error ${ex.message}`);
      }
    }
    return retVal;
  },

  async addUser(user) {
    const userData = {
      _id: v4(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      userType: user.userType
    };
    let addedUser = null;
    // Get a key for a new Post.
    await set(ref(db, `users/${userData._id}`), userData).then(async () => {
      // console.log("user added");
      await get(ref(db, `users/${userData._id}`)).then((snapshot) => {
        if (snapshot.exists()) {
          // console.log(snapshot.val());
          addedUser = {
            _id: userData._id,
            firstName: snapshot.val().firstName,
            lastName: snapshot.val().lastName,
            email: snapshot.val().email,
            password: snapshot.val().password,
            userType: snapshot.val().userType
          };
        }
      }).catch((error) => {
        console.error(error);
      });
    });
    return addedUser;
  },

  async getUserByEmail(email) {
    let retVal = null;
    if (email) {
      try {
        const aUsers1 = await this.getAllUsers();
        const iLength = aUsers1.length;
        let i = 0;
        while (i < iLength) {
          if (aUsers1[i].email === email) {
            retVal = aUsers1[i];
            break;
          }
          i += 1;
        }
      } catch (ex) {
        console.log(`getUserByEmail error ${ex.message}`);
      }
    }
    return retVal;
  },

  async suspendUserById(id) {
    let retVal = null;
    if (id) {
      const myUser = await this.getUserById(id);
      if (myUser) {
        myUser.userType = "suspended";
        await update(ref(db, `users/${myUser._id}`), {
          userType: "suspended"
        })
          .then(() => {
            // Data updated successfully!
            retVal = myUser;
          })
          .catch((ex) => {
            // The write failed...
            console.log(`suspendUserById error ${ex.message}`);
          });
      }
    }
    return retVal;
  },

  async userIsAdminById(id) {
    let retVal = null;
    if (id) {
      const myUser = await this.getUserById(id);
      if (myUser) {
        myUser.userType = "admin";
        await update(ref(db, `users/${myUser._id}`), {
          userType: "admin"
        })
          .then(() => {
            // Data updated successfully!
            retVal = myUser;
          })
          .catch((ex) => {
            // The write failed...
            console.log(`userIsAdminById error ${ex.message}`);
          });
      }
    }
    return retVal;
  },

  async userIsNormalById(id) {
    let retVal = null;
    if (id) {
      const myUser = await this.getUserById(id);
      if (myUser) {
        myUser.userType = "normal";
        await update(ref(db, `users/${myUser._id}`), {
          userType: "normal"
        })
          .then(() => {
            // Data updated successfully!
            retVal = myUser;
          })
          .catch((ex) => {
            // The write failed...
            console.log(`userIsNormalById error ${ex.message}`);
          });
      }
    }
    return retVal;
  },

  async deleteUserById(id) {
    let retVal = null;
    if (id) {
      await remove(ref(db, `users/${id}`))
        .then(() => {
          // Data updated successfully!
          retVal = 1;
        })
        .catch((ex) => {
          // The write failed...
          console.log(`deleteUserById error ${ex.message}`);
        });
    }
    return retVal;
  },

  async deleteAll() {
    const dbRef = ref(db, "users");
    await remove(dbRef).then(() => {
      ;// console.log("All users removed");
    });
  }
};
