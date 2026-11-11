require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");

const testUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Database connected!");

        const user = await User.create({
            name: "Vedant Bhange",
            email: "vedant@example.com",
            password: "TestPassword123",
            role: "customer"
        });

        console.log("User created successfully:");
        console.log(user);

    } catch (error) {
        console.log("Error:", error.message);

    } finally {
        await mongoose.disconnect();
    }
};

testUser();