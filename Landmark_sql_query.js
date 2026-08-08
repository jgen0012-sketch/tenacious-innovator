const axios = require("axios");
const { Client } = require("pg");

// ----------------------
// 1. POSTGRES CONNECTION
// ----------------------
const client = new Client({
  host: "localhost",
  user: "postgres",
  password: "your_password",
  database: "your_database",
  port: 5432
});

// ----------------------
// 2. API URL
// ----------------------
const API_URL =
  "https://data.melbourne.vic.gov.au/api/explore/v2.1/catalog/datasets/landmarks-and-places-of-interest-including-schools-theatres-health-services-spor/records?limit=200";

// ----------------------
// 3. MAIN FUNCTION
// ----------------------
async function pushDataToDB() {
  await client.connect();
  console.log("Connected to PostgreSQL");

  const res = await axios.get(API_URL);
  const records = res.data.results;

  const categoryMap = new Map();
  const landmarkMap = new Map();

  let nextCategoryId = 1;
  let nextLandmarkId = 1;

  for (const r of records) {
    const theme = r.theme;
    const sub_theme = r.sub_theme;
    const feature_name = r.feature_name;

    let latitude = null;
    let longitude = null;

    if (r.co_ordinates) {
      latitude = r.co_ordinates.lat;
      longitude = r.co_ordinates.lon;
    }

    // ----------------------
    // CATEGORY ID GENERATION
    // ----------------------
    const categoryKey = `${theme}|${sub_theme}`;

    if (!categoryMap.has(categoryKey)) {
      categoryMap.set(categoryKey, nextCategoryId);

      await client.query(
        `INSERT INTO category (category_id, theme, sub_theme)
         VALUES ($1, $2, $3)`,
        [nextCategoryId, theme, sub_theme]
      );

      console.log(`Inserted category: ${theme} - ${sub_theme}`);
      nextCategoryId++;
    }

    const category_id = categoryMap.get(categoryKey);

    // ----------------------
    // LANDMARK ID GENERATION
    // ----------------------
    const landmarkKey = `${latitude}|${longitude}`;

    if (!landmarkMap.has(landmarkKey)) {
      landmarkMap.set(landmarkKey, nextLandmarkId);

      await client.query(
        `INSERT INTO landmark (landmark_id, feature_name, latitude, longitude, category_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [nextLandmarkId, feature_name, latitude, longitude, category_id]
      );

      console.log(`Inserted landmark: ${feature_name}`);
      nextLandmarkId++;
    }
  }

  console.log("All data inserted successfully.");
  await client.end();
}

pushDataToDB().catch(console.error);
