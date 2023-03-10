let scrapeEmails = document.getElementById("scrapeEmails");
// let download = document.getElementById("download");

//Scrape email logic
async function scrapeEmailsFromPage() {
  //get company name and email
  let company_name = document.getElementsByClassName("ant-typography");

  company_data = [].map.call(company_name, (item) => item.textContent);
  //let company_data = [];
  company_data[0] = ["Competitor", "Website"];

  let website = document.getElementsByClassName("rpt-company-primaryurl");
  website_data = [].map.call(website, (item) => item.textContent);

  //get competitor table
  let table_body = document.getElementsByClassName(
    "ant-table-row ant-table-row-level-0"
  );

  let table_data = [].map.call(table_body, (item) => item.textContent);
  // console.log("Wrong Page or No Competitors")

  //find competitors that are in the US
  let us_company = [];

  for (let i = 0; i < table_data.length; i++) {
    if (table_data.length == 0) {
      alert("wrong");
    } else {
      if (table_data[i].search(/United States/) != -1) {
        us_company.push(i);
      }
    }
  }

  //get competitors urls
  let urls = document.querySelectorAll("div.company-name-container > div > a");

  //helper function: wait 1s
  const wait = (delay) =>
    new Promise((resolve) => setTimeout(() => resolve(true), delay));

  const getDatafromPage = (win) => {
    return new Promise(async (resolve) => {
      let companyName, email;
      await wait(1000);
      let competitor = win.document.getElementsByClassName("ant-typography");
      let competitor_data = [].map.call(competitor, (item) => item.textContent);
      // console.log(competitor);
      let competitor_website = win.document.getElementsByClassName(
        "rpt-company-primaryurl"
      );
      let competitor_website_data = [].map.call(
        competitor_website,
        (item) => item.textContent
      );
      companyName = competitor_data[0];
      email = competitor_website_data[0];

      if (companyName && email) {
        company_data.push([companyName.replace(",", ""), email]);
        // console.log(companyName, email);
        resolve();
      } else {
        competitor = null;
        competitor_data = null;
        competitor_website_data = null;
        competitor_website = null;
        getDatafromPage(win);
      }
    });
  };

  const saveData = (win, index) =>
    new Promise(async (resolve) => {
      // setTimeout(() => {
      //await wait(1000);
      // console.log("in savedata");
      win.onload = async () => {
        await getDatafromPage(win);
        win.close();
        // console.log("close", index);
        resolve(true);
      };
      // console.log("after onload");
      // }, 4000);
    });
  const openUrls = () => {
    return new Promise(async (resolve) => {
      if (table_body.length > 0) {
        let count = 0;
        for (const index of us_company) {
          // console.log("index,", index);
          const url = urls[index].href;
          const win = window.open(url);

          await saveData(win, index);
          count += 1;
          // console.log("saved", company_data, count);
          if (count === us_company.length) {
            resolve(true);
          }
        }
      } else {
        alert("Wrong Page or No Competitors");
        resolve(false);
      }
    });
  };
  // const checkCompetitor = () => {
  //   // console.log("in check")
  //   return new Promise((resolve) => {});
  // };
  // checkCompetitor().then((res) => {
  //   if (res) {
  openUrls().then(
    (res) => {
      // console.log("company data: ", company_data);
      company_name = [].map.call(company_name, (item) => item.textContent);
      if (res) {
        // xls download
        let excelContent = ``;
        if (company_data.length) {
          company_data.forEach((item, index) => {
            excelContent += `${index > 0 ? "\n" : ""}${item[0]},${item[1]}`;
          });
        }
        console.log("excelContent ", excelContent);
        let blob = new Blob([excelContent], {
          type: "text/plain;charset=utf-8",
        });
        //????????????????????????
        blob = new Blob([String.fromCharCode(0xfeff), blob], {
          type: blob.type,
        });
        object_url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = object_url;
        link.download = `${company_name}.xls`; //????????????
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        //csv download
        // let company_name = document.getElementsByClassName("ant-typography")[0].textContent;

        // let CsvString = "";
        // company_data.forEach(function(RowItem, RowIndex) {
        //   RowItem.forEach(function(ColItem, ColIndex) {
        //     CsvString += ColItem + ',';
        //   });
        //   CsvString += "\r\n";
        // });
        // CsvString = "data:application/excel," + encodeURIComponent(CsvString);
        // let x = document.createElement("A");
        // x.setAttribute("href", CsvString );
        // x.setAttribute("download", company_name);
        // document.body.appendChild(x);
        // x.click();
      }
    },
    () => {
      alert("error");
    }
  );
  //   }
  // });
}

//click "Scrape email" button
scrapeEmails.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true },
    func: scrapeEmailsFromPage,
  });
});

//click "download" button
// download.addEventListener("click", () => {
//   var wb = XLSX.utils.book_new();
//   wb.Props = {
//     Title: "SheetJS Tutorial",
//     Subject: "Test",
//     Author: "Red Stapler",
//     CreatedDate: new Date(2017, 12, 19),
//   };

//   function s2ab(s) {
//     var buf = new ArrayBuffer(s.length);
//     var view = new Uint8Array(buf);
//     for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
//     return buf;
//   }

//   wb.SheetNames.push("Test Sheet");
//   var ws_data = [
//     ["1", "website_data"],
//     ["2", "b"],
//   ];
//   var ws = XLSX.utils.aoa_to_sheet(ws_data);
//   wb.Sheets["Test Sheet"] = ws;

//   var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
//   saveAs(
//     new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
//     "test.xlsx"
//   );

// });
