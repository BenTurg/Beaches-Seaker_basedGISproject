const puppeteer = require("puppeteer");
const fs = require("fs");

async function scrapeWebsite() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://gosurf.co.il/forecast/bat-yam");

  const data = [];

  // Look for the div with class "desktop_grid_right"
  const desktopGridRightDiv = await page.$("div.desktop_grid_right");

  // Check if the div with class "desktop_grid_right" exists
  if (desktopGridRightDiv) {
    // Look for the first div with class "day fw" (with a space)
    const dayFwDiv = await desktopGridRightDiv.$("div.day.fw");

    // Check if the div with class "day fw" exists
    if (dayFwDiv) {
      // Look for the first h2 element inside the div
      const h2Data = await dayFwDiv.$eval("h2", (element) =>
        element.innerText.trim()
      );
      data.push({ date: h2Data });

      const divElements = await page.$$("div.day_overflow_cont.scroll_touch");

      // Flag to stop after the first occurrence of div with class "day fw"
      let stopScraping = false;

      for (const divElement of divElements) {
        const tableElement = await divElement.$("table");
        const tbodyElement = await tableElement.$("tbody");

        // Look for the fifth tr element with class "chart_tr"
        const chartTrElements = await tbodyElement.$$("tr.chart_tr");
        const fifthTrElement = chartTrElements[4];

        const tempElement = await fifthTrElement.$("div.temp");
        const tempData = await tempElement.evaluate((element) =>
          element.innerText.trim()
        );

        const wavesElement = await fifthTrElement.$("td.waves");
        const spanData = await wavesElement.$eval("span", (element) =>
          element.innerText.trim()
        );

        const tdElements = await fifthTrElement.$$("td");

        let wavesHeight = null;
        let wavesDire = null;

        // Loop through the td elements
        for (let i = 0; i < tdElements.length; i++) {
          const tdElement = tdElements[i];

          // Check the class of the td element
          if (
            await tdElement.evaluate((element) =>
              element.classList.contains("wave_height_desc")
            )
          ) {
            wavesHeight = await tdElement.evaluate((element) =>
              element.innerText.trim()
            );
          } else if (
            await tdElement.evaluate((element) =>
              element.classList.contains("wind")
            )
          ) {
            wavesDire = await tdElement.evaluate((element) =>
              element.getAttribute("title")
            );
          }
        }

        data.push({
          temp: tempData,
          height: spanData,
          waves_height: wavesHeight || null,
          waves_dire: wavesDire || null,
        });

        // Check if the current div is the first occurrence of div with class "day fw"
        if (divElement === dayFwDiv) {
          stopScraping = true;
        }

        if (stopScraping) {
          break;
        }
      }
    } else {
      console.log('No div with class "day fw" found.');
    }
  } else {
    console.log('No div with class "desktop_grid_right" found.');
  }

  // Write the data to a JSON file
  fs.writeFileSync(
    "../json_output_files/bat_yam_output.json",
    JSON.stringify(data, null, 2)
  );

  await browser.close();
}

scrapeWebsite();
