const connectDB = require("../config/db");

(async () => {
    await connectDB();
    // Start your application logic here
})();
