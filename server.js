const app = require("./src/app")
const connectDb = require("./src/config/db")


connectDb();


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});