const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "database.db");
let db = null;
const corsOptions = {
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};

app.use(cors(corsOptions))

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DataBase Error: ${error.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

app.get('/products/:sort/', async (request, response) => {
  const { sort } = request.params;
  const sortDirection = sort.toUpperCase()
  if(sortDirection==='ASC' || sortDirection==='DESC'){
    const getAllProductsQuery = `SELECT * FROM Products ORDER BY Price ${sortDirection}`;
    const allProducts = await db.all(getAllProductsQuery);
    response.send(allProducts);
  }
});

module.exports = app;