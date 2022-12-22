let scrapeEmails = document.getElementById("scrapeEmails");
let download = document.getElementById("download");

var company_data;
var website_data;

async function scrapeEmailsFromPage() {
  function resolveAfter2Seconds() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("resolved");
      }, 2000);
    });
  }

  function waitForElm(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver((mutations) => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  let company = document.getElementsByClassName("ant-typography");
  company_data = [].map.call(company, (item) => item.textContent);
  let website = document.getElementsByClassName("rpt-company-primaryurl");
  website_data = [].map.call(website, (item) => item.textContent);

  console.log(company_data[0]);
  console.log(website_data[0]);
  console.log(typeof company_data);

  console.log("here");

  let table_body = document.getElementsByClassName(
    "ant-table-row ant-table-row-level-0"
  );
  let table_data = [].map.call(table_body, (item) => item.textContent);
  let us_company = [];
  for (let i = 0; i < table_data.length; i++) {
    // console.log(typeof(table_data[i]))
    if (table_data[i].search(/United States/) != -1) {
      us_company.push(i);
      // console.log(us_company)
    }
  }

  let a = document.querySelectorAll("div.company-name-container > div > a");

  //   url = a[0].href;
  //   var win = window.open(url, "competitor"+"1").focus;
  //   resolveAfter2Seconds()
  //   let competiotor = document.getElementsByClassName("ant-typography");
  //   console.log(competiotor.textContent);

  //   await waitForElm(".ant-typography").then((elm) => {
  //     console.log("Element is ready");
  //     console.log(elm.textContent);
  //   });
  for (const index of us_company) {
    // console.log(a[index])
    // a[index].click();
    // const result = resolveAfter2Seconds();
    // console.log(result)
    // // history.back()

    url = a[index].href;

    var win = window.open(url, `competitor ${index}`);
    //   await waitForElm('.ant-typography').then((elm) => {
    //       console.log('Element is ready');
    //       alert(elm.textContent);
    //   });
    document.addEventListener("DOMContentLoaded", function(event) {
        
        let competitor = document.getElementsByClassName("ant-typography");
        let competitor_data = [].map.call(competitor, (item) => item.textContent);
        
      });

    win.close();
  }
  window.open('', `competitor 1`).focus();
}

scrapeEmails.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: scrapeEmailsFromPage,
  });
});

download.addEventListener("click", () => {
//   console.log(company_data);
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
//   var ws_data = [[company_data, website_data]];
//   var ws = XLSX.utils.aoa_to_sheet(ws_data);
//   wb.Sheets["Test Sheet"] = ws;

//   var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
//   saveAs(
//     new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
//     "test.xlsx"
//   );

var blob = new Blob([s2ab(atob("data"))], {
    type: 'text/html'
});

href = URL.createObjectURL(blob);

function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
});




 // let blob = new Blob(["<html>…</html>"], {type: 'text/html'});