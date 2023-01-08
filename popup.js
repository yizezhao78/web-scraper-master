let scrapeEmails = document.getElementById("scrapeEmails");
let download = document.getElementById("download");

var competitors = {a: 1, b: 2};
var test = "123"

//Scrape email logic
async function scrapeEmailsFromPage() {
  //get company name and email
  let company = document.getElementsByClassName("ant-typography");
  company_data = [].map.call(company, (item) => item.textContent);
  let website = document.getElementsByClassName("rpt-company-primaryurl");
  website_data = [].map.call(website, (item) => item.textContent);

  //get competitor table
  let table_body = document.getElementsByClassName(
    "ant-table-row ant-table-row-level-0"
  );
  let table_data = [].map.call(table_body, (item) => item.textContent);

  //find competitors that are in the US
  let us_company = [];
  for (let i = 0; i < table_data.length; i++) {
    if (table_data[i].search(/United States/) != -1) {
      us_company.push(i);
    }
  }

  //get competitors urls
  let urls = document.querySelectorAll("div.company-name-container > div > a");

  //helper function: wait 1s
  const wait = (url) =>
    new Promise((resolve) => setTimeout(() => resolve(url), 1000));
  
  //helper function: open each url
  const openUrls = async () => {
    for (const index of us_company) {
 
      let url = urls[index].href;
      const win = window.open(url);
      await wait("1s")

      win.onload = async function(){
        await wait("1s");
        // alert("DOM fully loaded and parsed");
        let competitor = win.document.getElementsByClassName("ant-typography");
        let competitor_data = [].map.call(competitor, (item) => item.textContent);
        let competitor_website = win.document.getElementsByClassName("rpt-company-primaryurl");
        let competitor_website_data = [].map.call(competitor_website, (item) => item.textContent);
        company_data.push([competitor_data[0], competitor_website_data[0]])
        win.close();      
      };
    };
  };
  await openUrls();
  console.log(company_data);

}



//click "Scrape email" button
scrapeEmails.addEventListener("click", async () => {
  console.log("test")
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true },
    func: scrapeEmailsFromPage,
  });

});


//click "download" button
download.addEventListener("click", () => {
  var wb = XLSX.utils.book_new();
  wb.Props = {
    Title: "SheetJS Tutorial",
    Subject: "Test",
    Author: "Red Stapler",
    CreatedDate: new Date(2017, 12, 19),
  };

  function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }

  wb.SheetNames.push("Test Sheet");
  var ws_data = [["1", "website_data"],["2", "b"]];
  var ws = XLSX.utils.aoa_to_sheet(ws_data);
  wb.Sheets["Test Sheet"] = ws;

  var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
  saveAs(
    new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
    "test.xlsx"
  );

  //   var blob = new Blob([s2ab(atob("data"))], {
  //     type: "text/html",
  //   });

  //   href = URL.createObjectURL(blob);

  //   function s2ab(s) {
  //     var buf = new ArrayBuffer(s.length);
  //     var view = new Uint8Array(buf);
  //     for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  //     return buf;
  //   }
});
