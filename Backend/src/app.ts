require("dotenv").config();
import cors from "cors";
import express from "express";
import expressFileUpload from "express-fileupload";
import appConfig from "./2-utils/app-config";
import catchAll from "./4-middleware/catch-all";
import routeNotFound from "./4-middleware/route-not-found";
import sanitize from "./4-middleware/sanitize";
import verbose from "./4-middleware/verbose";
import authController from "./6-controllers/auth-controller";
import followController from "./6-controllers/follow-controller";
import vacationsController from "./6-controllers/vacations-controller";

// Create the server:
const server = express();

// Enable cors:
server.use(cors());

// Support request.body as JSON:
server.use(express.json());

// Strip Tags:
server.use(sanitize);

// Support file upload - set files into request.files:
server.use(expressFileUpload());

// Connect app-level middleware:
server.use(verbose);

// Route requests to our controllers:
server.use("/api", vacationsController);
server.use("/api", followController);
server.use("/api", authController);

// Route not found:
server.use("*", routeNotFound);

// Catch all middleware:
server.use(catchAll);

// Run server:
server.listen(appConfig.port, () => console.log(`Listening on http://localhost:${appConfig.port}`));


export default server;

// ### DIGITAL OCEAN APP.TS ### //

// import cors from "cors";
// import express from "express";
// import expressFileUpload from "express-fileupload";
// import appConfig from "./2-utils/app-config";
// import catchAll from "./4-middleware/catch-all";
// import routeNotFound, { pageNotFound } from "./4-middleware/route-not-found";
// import sanitize from "./4-middleware/sanitize";
// import verbose from "./4-middleware/verbose";
// import authController from "./6-controllers/auth-controller";
// import followController from "./6-controllers/follow-controller";
// import vacationsController from "./6-controllers/vacations-controller";
// import paths from "./2-utils/paths";

// // Create the server:
// const server = express();

// // Enable cors:
// server.use(cors());

// // Support request.body as JSON:
// server.use(express.json());

// server.use("/", express.static(paths.frontendFolder));

// // Strip Tags:
// server.use(sanitize);

// // Support file upload - set files into request.files:
// server.use(expressFileUpload());

// // Connect app-level middleware:
// server.use(verbose);

// // Route requests to our controllers:
// server.use("/api", vacationsController);
// server.use("/api", followController);
// server.use("/api", authController);

// // Route not found:
// server.use("/api/*", routeNotFound);

// server.use("/*", pageNotFound);

// // Catch all middleware:
// server.use(catchAll);

// // Run server:
// server.listen(appConfig.port, () => console.log(`Listening on http://localhost:${appConfig.port}`));


// export default server;