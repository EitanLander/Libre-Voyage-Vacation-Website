import { expect } from "chai";
import supertest from "supertest";
import app from "../src/app";  
import StatusCode from "../src/3-models/status-code";

describe("Testing the follow-controller", () => {


    // POST - follow vacation:
    it("Should follow a vacation", async () => {
        const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MiwiZmlyc3ROYW1lIjoiVXNlciIsImxhc3ROYW1lIjoiVXNlciIsImVtYWlsIjoidXNlckB1c2VyLmNvbSIsInBhc3N3b3JkIjoiZDAxNDM1MWJkNDU3Y2QzNDFmN2RhOWYxZWUyYmRiMjg4ODUzYmFkOGJlZGNlZDIyN2Y4NDBiZWVlZjkxZmQ0ODg1M2I2NGU5Zjg1NTkyZjg0YzBiMjRkYWI2ODAzOGMwNjlhY2Y5OTljNzk4MzQzYTYyNmUxNTFiNTY2YjFmYzkiLCJyb2xlSWQiOjJ9LCJpYXQiOjE2OTY3ODkyNjcsImV4cCI6MTY5NjgwMDA2N30.e611XtT1iYmD_BC1Pf07nHy3v8HERDpfDXXdGo8Y-No";  // Provide a valid token

        // Mock follow data:
        const followData = {
            userId: 1,  
            vacationId: 1  // Provide a valid vacation ID
        };

        const response = await supertest(app)
            .post("/api/vacations/follow")
            .set("Authorization", token)
            .send(followData);

        expect(response.status).to.equal(StatusCode.Created);
        expect(response.body).to.have.property("message");
    });

    // DELETE - unfollow vacation:
    it("Should unfollow a vacation", async () => {
        const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MiwiZmlyc3ROYW1lIjoiVXNlciIsImxhc3ROYW1lIjoiVXNlciIsImVtYWlsIjoidXNlckB1c2VyLmNvbSIsInBhc3N3b3JkIjoiZDAxNDM1MWJkNDU3Y2QzNDFmN2RhOWYxZWUyYmRiMjg4ODUzYmFkOGJlZGNlZDIyN2Y4NDBiZWVlZjkxZmQ0ODg1M2I2NGU5Zjg1NTkyZjg0YzBiMjRkYWI2ODAzOGMwNjlhY2Y5OTljNzk4MzQzYTYyNmUxNTFiNTY2YjFmYzkiLCJyb2xlSWQiOjJ9LCJpYXQiOjE2OTY3ODkyNjcsImV4cCI6MTY5NjgwMDA2N30.e611XtT1iYmD_BC1Pf07nHy3v8HERDpfDXXdGo8Y-No";  // Provide a valid token
        const userId = 1;  
        const vacationId = 1;  

        const response = await supertest(app)
            .delete(`/api/vacations/unfollow/${userId}/${vacationId}`)
            .set("Authorization", token);

        expect(response.status).to.equal(StatusCode.NoContent);
    });

    // GET - all followed vacations by user:
    it("Should return all followed vacations by user", async () => {
        const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MiwiZmlyc3ROYW1lIjoiVXNlciIsImxhc3ROYW1lIjoiVXNlciIsImVtYWlsIjoidXNlckB1c2VyLmNvbSIsInBhc3N3b3JkIjoiZDAxNDM1MWJkNDU3Y2QzNDFmN2RhOWYxZWUyYmRiMjg4ODUzYmFkOGJlZGNlZDIyN2Y4NDBiZWVlZjkxZmQ0ODg1M2I2NGU5Zjg1NTkyZjg0YzBiMjRkYWI2ODAzOGMwNjlhY2Y5OTljNzk4MzQzYTYyNmUxNTFiNTY2YjFmYzkiLCJyb2xlSWQiOjJ9LCJpYXQiOjE2OTY3ODkyNjcsImV4cCI6MTY5NjgwMDA2N30.e611XtT1iYmD_BC1Pf07nHy3v8HERDpfDXXdGo8Y-No";  // Provide a valid token
        const userId = 1; 
        const response = await supertest(app)
            .get(`/api/vacations/followed-vacations/${userId}`)
            .set("Authorization", token);


        expect(response.status).to.equal(200);
    });
});
