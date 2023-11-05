import { expect } from "chai";
import fs from "fs";
import { describe, it } from "mocha";
import * as os from "os";
import path from "path";
import supertest from "supertest";
import app from "../src/app";
import StatusCode from "../src/3-models/status-code";

describe("Testing the vacations-controller", () => {

    // GET - display all vacations:
it("Should return all vacations", async () => {
    const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MSwiZmlyc3ROYW1lIjoiQWRtaW4iLCJsYXN0TmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJwYXNzd29yZCI6ImQwMTQzNTFiZDQ1N2NkMzQxZjdkYTlmMWVlMmJkYjI4ODg1M2JhZDhiZWRjZWQyMjdmODQwYmVlZWY5MWZkNDg4NTNiNjRlOWY4NTU5MmY4NGMwYjI0ZGFiNjgwMzhjMDY5YWNmOTk5Yzc5ODM0M2E2MjZlMTUxYjU2NmIxZmM5Iiwicm9sZUlkIjoxfSwiaWF0IjoxNjk2Nzg5MzUxLCJleHAiOjE2OTY4MDAxNTF9.CPScp6JhGVPPAfnOncYoixQ7XzKaerxG9rcH2xP1-_I";
    
    const response = await supertest(app)
        .get("/api/vacations")
        .set("Authorization", token);

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
    expect(response.body.length).to.be.greaterThan(0);
});

    // POST - add new vacation:
    it("Should add a new vacation and return it", async () => {
        const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MSwiZmlyc3ROYW1lIjoiQWRtaW4iLCJsYXN0TmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJwYXNzd29yZCI6ImQwMTQzNTFiZDQ1N2NkMzQxZjdkYTlmMWVlMmJkYjI4ODg1M2JhZDhiZWRjZWQyMjdmODQwYmVlZWY5MWZkNDg4NTNiNjRlOWY4NTU5MmY4NGMwYjI0ZGFiNjgwMzhjMDY5YWNmOTk5Yzc5ODM0M2E2MjZlMTUxYjU2NmIxZmM5Iiwicm9sZUlkIjoxfSwiaWF0IjoxNjk2Nzg5MzUxLCJleHAiOjE2OTY4MDAxNTF9.CPScp6JhGVPPAfnOncYoixQ7XzKaerxG9rcH2xP1-_I";

        // Mock vacation data:
        const vacationData = {
            destination: "Miami",
            description: "Miami, a city pulsating with energy and cultural diversity, is renowned for its vibrant beaches, glamorous lifestyle, and iconic art scene.",
            startDate: "2023-11-25",
            endDate: "2023-12-25",
            price: 6500,
            photo: "http://localhost:4000/photo.jpg"
        };

        const response = await supertest(app)
            .post("/api/vacations")
            .set("Authorization", token)
            .field("destination", vacationData.destination)
            .field("description", vacationData.description)
            .field("startDate", vacationData.startDate)
            .field("endDate", vacationData.endDate)
            .field("price", vacationData.price)
            .field("photo", vacationData.photo)

        expect(response.status).to.equal(StatusCode.Created);
        expect(response.body).to.have.property("vacationId");
        expect(parseFloat(response.body.price)).to.equal(vacationData.price);
        
    });

    // PUT - update existing vacation:
    it("Should update an existing vacation", async () => {
        const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MSwiZmlyc3ROYW1lIjoiQWRtaW4iLCJsYXN0TmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJwYXNzd29yZCI6ImQwMTQzNTFiZDQ1N2NkMzQxZjdkYTlmMWVlMmJkYjI4ODg1M2JhZDhiZWRjZWQyMjdmODQwYmVlZWY5MWZkNDg4NTNiNjRlOWY4NTU5MmY4NGMwYjI0ZGFiNjgwMzhjMDY5YWNmOTk5Yzc5ODM0M2E2MjZlMTUxYjU2NmIxZmM5Iiwicm9sZUlkIjoxfSwiaWF0IjoxNjk2Nzg5MzUxLCJleHAiOjE2OTY4MDAxNTF9.CPScp6JhGVPPAfnOncYoixQ7XzKaerxG9rcH2xP1-_I";
        const vacationIdToUpdate = 164; // Provide a valid vacation ID.

        // Mock updated vacation data:
        const updatedVacationData = {
            destination: "Germany",
            description: "Germany, a nation steeped in history, boasts cultural richness and efficiency. Its picturesque landscapes are complemented by diverse communities, fostering innovation and influence.",
            startDate: "2024-02-15",
            endDate: "2024-02-25",
            price: 9500
        };

        const imageBuffer = Buffer.from("updated-image-data.jpg");
        const tempImagePath = path.join(os.tmpdir(), "updatedMockImage.jpg");
        fs.writeFileSync(tempImagePath, imageBuffer);

        const response = await supertest(app)
            .put(`/api/vacations/${vacationIdToUpdate}`)
            .set("Authorization", token)
            .field("destination", updatedVacationData.destination)
            .field("description", updatedVacationData.description)
            .field("startDate", updatedVacationData.startDate)
            .field("endDate", updatedVacationData.endDate)
            .field("price", updatedVacationData.price)
            .attach("photo", tempImagePath);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("vacationId");
        expect(parseFloat(response.body.price)).to.equal(updatedVacationData.price);

        // Clean up: Remove the temporary file
        fs.unlinkSync(tempImagePath);
    });

    // DELETE - existing vacation:
    it("Should delete an existing vacation", async () => {
        const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MSwiZmlyc3ROYW1lIjoiQWRtaW4iLCJsYXN0TmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJwYXNzd29yZCI6ImQwMTQzNTFiZDQ1N2NkMzQxZjdkYTlmMWVlMmJkYjI4ODg1M2JhZDhiZWRjZWQyMjdmODQwYmVlZWY5MWZkNDg4NTNiNjRlOWY4NTU5MmY4NGMwYjI0ZGFiNjgwMzhjMDY5YWNmOTk5Yzc5ODM0M2E2MjZlMTUxYjU2NmIxZmM5Iiwicm9sZUlkIjoxfSwiaWF0IjoxNjk2Nzg5MzUxLCJleHAiOjE2OTY4MDAxNTF9.CPScp6JhGVPPAfnOncYoixQ7XzKaerxG9rcH2xP1-_I";
        const vacationIdToDelete = 164;  

        const response = await supertest(app)
            .delete(`/api/vacations/${vacationIdToDelete}`)
            .set("Authorization", token);

        expect(response.status).to.equal(204);
    });
});