import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { geoTagService } from "./geotag-service.js";
import { Kiln, testCategories } from "../fixtures.js";

suite("Category API tests", () => {
    setup(async () => {
      await geoTagService.deleteAllCategories();
      for (let i = 0; i < testCategories.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        testCategories[i] = await geoTagService.createCategory(testCategories[i]);
      }
    });
    teardown(async () => {});


    test("create a category", async () => {
      const newCategory = await geoTagService.createCategory(Kiln);
      assertSubset(Kiln, newCategory);
      assert.isDefined(newCategory._id);
    });

    test("get a category", async () => {
        const returnedCat = await geoTagService.getCategory(testCategories[0]._id);
        assert.deepEqual(testCategories[0], returnedCat);
    });
    
    test("get a category - bad id", async () => {
      try {
        const returnedCat = await geoTagService.getCategory("1234");
        assert.fail("Should not return a response");
      } catch (error) {
        assert(error.response.data.message === "No category with this id");
        assert.equal(error.response.data.statusCode, 404);
      }
    });
   
    test("delete all categories Api", async () => {
      let returnedCategories = await geoTagService.getAllCategories();
      assert.equal(returnedCategories.length, 3);
      await geoTagService.deleteAllCategories();
      returnedCategories = await geoTagService.getAllCategories();
      assert.equal(returnedCategories.length, 0);
    });

    test("get a category - deleted category", async () => {
      await geoTagService.deleteAllCategories();
      try {
        const returnedCat = await geoTagService.getCategory(testCategories[0]._id);
        assert.fail("Should not return a response");
      } catch (error) {
        assert(error.response.data.message === "No category with this id");
        assert.equal(error.response.data.statusCode, 404);
      }
    });

  test("delete all categories ", async () => {
    let returnedCategories = await geoTagService.getAllCategories();
    assert.equal(returnedCategories.length, 3);
    await geoTagService.deleteAllCategories();
    returnedCategories = await geoTagService.getAllCategories();
    assert.equal(returnedCategories.length, 0);
  });

});