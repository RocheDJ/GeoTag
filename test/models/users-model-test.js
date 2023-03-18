import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testDBType,maggie, testUsers } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("User Model tests", () => {

  setup(async () => {
    db.init(testDBType);
    await db.userStore.deleteAll();
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testUsers[i] = await db.userStore.addUser(testUsers[i]);
    }
  });

  test("create a user", async () => {
    const newUser = await db.userStore.addUser(maggie);
    assertSubset(maggie, newUser);
  });

  test("delete all users", async () => {
    let returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, 3);
    await db.userStore.deleteAll();
    returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, 0);
  });

  test("get a user - success", async () => {
    const user = await db.userStore.addUser(maggie);
    const returnedUser1 = await db.userStore.getUserById(user._id);
    assert.deepEqual(user, returnedUser1);
    const returnedUser2 = await db.userStore.getUserByEmail(user.email);
    assert.deepEqual(user, returnedUser2);
  });

  test("delete One User - success", async () => {
    await db.userStore.deleteUserById(testUsers[0]._id);
    const returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, testUsers.length - 1);
    const deletedUser = await db.userStore.getUserById(testUsers[0]._id);
    assert.isNull(deletedUser);
  });

  test("get a user - bad params", async () => {
    assert.isNull(await db.userStore.getUserByEmail(""));
    assert.isNull(await db.userStore.getUserById(""));
    assert.isNull(await db.userStore.getUserById());
  });

  test("delete One User - fail", async () => {
    await db.userStore.deleteUserById("bad-id");
    const allUsers = await db.userStore.getAllUsers();
    assert.equal(testUsers.length, allUsers.length);
  });

  test("Demote User", async () => {
    // add user
    let userData = await db.userStore.addUser(maggie);
    // demote user
    await db.userStore.userIsNormalById(userData._id);
    // read back from DB user value
    userData = await db.userStore.getUserById(userData._id);
    // check maggie is now normal
    assert.equal(userData.userType, "normal");
  });

  test("Promote User", async () => {
    await db.userStore.deleteUserById(testUsers[0]._id);
    let userData = await db.userStore.getUserById(testUsers[1]._id);
    userData.userType = "admin";
    await db.userStore.userIsAdminById(userData._id);
    // read back user data
    userData = await db.userStore.getUserById(userData._id);
    // check maggie is now normal
    assert.equal(userData.userType, "admin");
  });



});
