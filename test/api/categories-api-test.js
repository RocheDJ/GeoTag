import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { geoTagService } from "./geotag-service.js";
import { maggie,Kiln, testCategories ,testPOI} from "../fixtures.js";

suite("Category API tests", () => {
    let user = null;
  
    setup(async () => {
      await geoTagService.deleteAllCategories();
      await geoTagService.deleteAllUsers();
      await geoTagService.deleteAllPOI();
      user = await geoTagService.createUser(maggie);
      Kiln.userID =   user._id 
    
      for (let i = 0; i < testCategories.length; i += 1) {
        testCategories[i].userID =   user._id;
        // eslint-disable-next-line no-await-in-loop
        testCategories[i] = await geoTagService.createCategory(testCategories[i]);
      }
      
    });
    teardown(async () => {});


    
    test("Delete a category", async () => {
      let returnedCategories = await geoTagService.getAllCategories();
      assert.equal(returnedCategories.length, 3);
      await geoTagService.deleteCategory(returnedCategories[0]._id);
      returnedCategories = await geoTagService.getAllCategories();
      assert.equal(returnedCategories.length, 2);
  });

    test("Create a category", async () => {
      const newCategory = await geoTagService.createCategory(Kiln);
      assertSubset(Kiln, newCategory);
      assert.isDefined(newCategory._id);
    });


    test("Get a category", async () => {
        const returnedCat = await geoTagService.getCategory(testCategories[0]._id);
        assert.deepEqual(testCategories[0], returnedCat);
    });
    
    test("Get all POI in a Category", async () => {
      // find the test category
      const returnedCat = await geoTagService.getCategory(testCategories[0]._id);
      // add the test points of interest to it
      for (let i = 0; i < testPOI.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await geoTagService.createPOI(returnedCat._id, testPOI[i]);
      }
      // read back the added POI
      const returnedPOIs = await geoTagService.getCategoryPOI(returnedCat._id);
      assert.equal(returnedPOIs.length, testPOI.length);

  });

    test("Get a category - bad id", async () => {
      try {
        const returnedCat = await geoTagService.getCategory("1234");
        assert.fail("Should not return a response");
      } catch (error) {
        assert(error.response.data.message === "No category with this id");
        assert.equal(error.response.data.statusCode, 404);
      }
    });
   
    test("Delete all categories Api", async () => {
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

  test("Delete all categories ", async () => {
    let returnedCategories = await geoTagService.getAllCategories();
    assert.equal(returnedCategories.length, 3);
    await geoTagService.deleteAllCategories();
     returnedCategories = await geoTagService.getAllCategories();
    assert.equal(returnedCategories.length, 0);
  });

});