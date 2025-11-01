import app from "./index.js";
import dotenv from "dotenv";

dotenv.config();

app.listen(process.env.PORT || 8000, () => {
    console.log(`server is running on port ${process.env.PORT}`)
})