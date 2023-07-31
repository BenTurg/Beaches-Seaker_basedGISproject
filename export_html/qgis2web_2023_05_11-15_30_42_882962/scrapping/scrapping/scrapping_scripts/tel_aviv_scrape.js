const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function scrapedData() {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(
      "https://www.tel-aviv.gov.il/Visitors/Pages/TelAvivBeach.aspx"
    );

    const h3Elements = await page.$$("h3.ng-binding");
    const resultArray = [];

    for (const h3Element of h3Elements) {
      const reversedText = await h3Element.evaluate((node) =>
        node.textContent
          .split("")
          .reverse()
          .join("")
          .replace(/(\d{1,3}) - (\d{1,3})/g, (match, p1, p2) => `${p2} - ${p1}`)
          .replace(/(\d{1,3})-(\d{1,3})/g, (match, p1, p2) => `${p2} - ${p1}`)
      );

      resultArray.push(reversedText);
    }

    await browser.close();

    const exportArray = {
      Height: resultArray[0],
      Temperature: resultArray[2],
      WindDirection: resultArray[3],
      WindSpeed: resultArray[4],
    };

    const reverseArray = {
      beaches_wave_height: reverseTextDirection(resultArray[0]),
      beaches_water_temp: reverseArrayTemperature(resultArray[2]),
      beaches_wind_direction: reverseTextDirection(resultArray[3]),
      beaches_extra: reverseTextDirection(resultArray[4]), //beaches_extra is wind speed and wave direction
    };
    // Function to modify Temperature format
    function reverseArrayTemperature(text) {
      const temperatureValue = text.match(/(\d+)\s*°[CF]/);
      if (temperatureValue && temperatureValue.length > 1) {
        return `${temperatureValue[1]}°C`.replace(":םימה תרוטרפמט", "");
      }
      return text.replace(":םימה תרוטרפמט", "");
    }
    // Reverse function
    function reverseTextDirection(text) {
      return text
        .split("")
        .reverse()
        .join("")
        .replace("גובה הגלים:", "")
        .replace("כיוון הרוח:", "")
        .replace("מהירות הרוח:", "");
    }

    const output = JSON.stringify(reverseArray);

    // Write the output to a file
    const filePath = path.join(
      __dirname,
      "export_html/qgis2web_2023_05_11-15_30_42_882962/scrapping/scrapping/json_output_files/rishon_letizon_output.json",
    );
    fs.writeFile(filePath, output, (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      } else {
        console.log("Output saved to output.txt");
      }
    });

    console.log(exportArray);

    return exportArray;
  } catch (error) {
    console.log("error");
    console.error("An error occurred:", error);
    return null;
  }
}

scrapedData();

/* reformating the text to Consol.log valid format 
          .split("")
          .reverse()
          .join("")
          .replace(
            /(\d{1,3}) - (\d{1,3})/g,
            (match, p1, p2) =>
              `${p2.split("").reverse().join("")} - ${p1
                .split("")
                .reverse()
                .join("")}`
          )
          .replace(
            /(\d{1,3})-(\d{1,3})/g,
            (match, p1, p2) =>
              `${p2.split("").reverse().join("")} - ${p1
                .split("")
                .reverse()
                .join("")}`
          )*/
