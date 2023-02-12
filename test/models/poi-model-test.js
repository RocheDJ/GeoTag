import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testCategories, testPOI, Kiln,testKiln } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("POI Model tests", () => {

  let categoryList = null;

  setup(async () => {
    db.init("mem");
    // delete all catagories form the list
    await db.categoryStore.deleteAllCategories();
    await db.poiStore.deleteAllPOI();
    // add a new category
    categoryList = await db.categoryStore.addCategory(testCategories);
    // add the test points to the category
    for (let i = 0; i < testPOI.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPOI[i] = await db.poiStore.addPOI(categoryList._id, testPOI[i]);
    }
  });

  test("create single POI", async () => {
    const kilnList = await db.categoryStore.addCategory(Kiln);
    const poi = await db.poiStore.addPOI(kilnList._id, testKiln)
    assert.isNotNull(poi._id);
    assertSubset (testKiln, poi);
  });

  test("Read multiple POIs", async () => {
    const aPOI = await db.categoryStore.getCategoryById(categoryList._id);
    assert.equal(testPOI.length, aPOI.length);
  });

  test("delete all POIs", async () => {
    const aPOIs = await db.poiStore.getAllPOI();
    assert.equal(testPOI.length, aPOIs.length);
    await db.poiStore.deleteAllPOI();
    const newPOIS = await db.poiStore.getAllPOI();
    assert.equal(0, newPOIS.length);
  });

  test("get a POI - success", async () => {
    const testCategory = await db.categoryStore.addCategory(Kiln);
    const poi = await db.poiStore.addPOI(testCategory._id, testKiln)
    const newPOI = await db.poiStore.getPOIById(poi._id);
    assertSubset (testKiln, newPOI);
  });

  test("delete One POI - success", async () => {
    await db.poiStore.deletePOIById(testPOI[0]._id);
    const aPOIs = await db.poiStore.getAllPOI();
    assert.equal(aPOIs.length, testPOI.length - 1);
    const deletedPOI = await db.poiStore.getPOIById(testPOI[0]._id);
    assert.isNull(deletedPOI);
  });

  test("get a poi - bad params", async () => {
    assert.isNull(await db.poiStore.getPOIById(""));
    assert.isNull(await db.poiStore.getPOIById());
  });

  test("delete one poi - fail", async () => {
    await db.poiStore.deletePOIById("bad-id");
    const aPOIs = await db.poiStore.getAllPOI();
    assert.equal(aPOIs.length, testPOI.length);
  });
});
