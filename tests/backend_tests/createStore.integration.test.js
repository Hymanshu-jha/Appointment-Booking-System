import { jest } from "@jest/globals";
import request from "supertest";

// 👇 ESM-safe mock (MUST be before imports that use it)
await jest.unstable_mockModule(
  "../../backend/db/schema/stores.models.js",
  () => ({
    default: function Store(data) {
      return {
        ...data,
        save: async () => ({
          _id: "store123",
          ...data
        })
      };
    }
  })
);

// AFTER mocking, import app
const { default: app } = await import("./testApp.js");

describe("INTEGRATION TEST → POST /stores (createStore)", () => {

  test("❌ missing required fields → 400", async () => {
    const res = await request(app)
      .post("/stores")
      .send({ storename: "Test Store" });

    expect(res.status).toBe(400);
  });

  test("❌ invalid category → 400", async () => {
    const res = await request(app)
      .post("/stores")
      .send({
        storename: "Test Store",
        category: "invalid",
        description: "desc",
        address: { display_name: "Delhi" },
        coordinates: { lat: 1, lon: 2 }
      });

    expect(res.status).toBe(400);
  });

  test("✅ creates store successfully", async () => {
    const res = await request(app)
      .post("/stores")
      .send({
        storename: "My Salon",
        category: "salon",
        description: "Hair services",
        address: {
          display_name: "Delhi",
          address: { city: "Delhi", country: "India" }
        },
        coordinates: { lat: 28, lon: 77 }
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.savedStore.name).toBe("My Salon");
  });

});
