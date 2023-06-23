const fs = require("fs");

// Read the contents of "hofim032023_1.js" file
const hofimData = fs.readFileSync("../data/hofim032023_1.js", "utf8");

// Evaluate the contents to make the `json_hofim032023_1` variable accessible
eval(hofimData);

// Check if the CITY property is "תל אביב" and update the relevant properties
json_hofim032023_1.features.forEach((feature) => {
  if (feature.properties.CITY === "תל אביב") {
    feature.properties.beaches_wave_height = '90 - 20 ס"מ';
    feature.properties.beaches_water_temp = "C° 42";
    feature.properties.beaches_wind_direction = "צפון מזרחית עד דרום מזרחית";
    feature.properties.beaches_extra = '25 - 10 קמ"ש';
  }
});

// Convert the updated data back to a string
const updatedData = `let json_hofim032023_1 = ${JSON.stringify(
  json_hofim032023_1,
  null,
  2
)};`;

// Write the updated data to a new file called "data_to_transfer.json"
fs.writeFileSync("data_to_transfer.json", updatedData);

console.log("Data transfer complete.");
