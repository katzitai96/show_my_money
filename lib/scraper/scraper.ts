import { CompanyTypes, createScraper, ScraperCredentials, ScraperScrapingResult } from "israeli-bank-scrapers";

export interface Transaction {
  description: string;
  amount: number;
  year: number;
  month: number;
  day: number;
  category: string;
}

export async function scraper(
  company: CompanyTypes,
  credentials: ScraperCredentials,
  year: number,
  month: number
): Promise<Transaction[]> {
  let all_transactions: Array<Transaction>;
  try {
    let month_index = month - 2;
    let year_index = year;
    if (month == 1) {
      month_index = 11;
      year_index = year - 1;
    }
    const puppeteer = require("puppeteer-core");
    const browser = await puppeteer.connect({
      browserWSEndpoint: "wss://chrome.browserless.io?token=Rqo90C4fF5Xibx42297674bdc3d5129eb0dafb4634",
    });
    const options = {
      companyId: company,
      startDate: new Date(year_index, month_index, 28),
      browser,
      skipCloseBrowser: false,
      combineInstallments: false,
      showBrowser: false,
      additionalTransactionInformation: true,
    };
    const scraper = createScraper(options);
    const scrapeResult: ScraperScrapingResult = await scraper.scrape(credentials);
    console.log(` --- scraping data from ${company}, from date 1.${month}.${year} ---`);
    if (scrapeResult.success) {
      all_transactions = [];
      let month_str = (options.startDate.getMonth() + 1).toString();
      if (month_str.length == 1) {
        month_str = "0" + month_str;
      }
      scrapeResult.accounts?.forEach((account) => {
        console.log(`   --- scraping account number ${account.accountNumber} ---`);
        account.txns.forEach((transaction) => {
          const d = new Date(transaction.date);
          if (d.getMonth() + 1 == month && d.getFullYear() == year && notCreditCard(transaction.description)) {
            let category = findCategory(transaction.description, transaction.category, transaction.originalAmount);
            // console.log(
            //   transaction.description,
            //   transaction.originalAmount,
            //   `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
            //   category
            // );
            all_transactions.push({
              description: transaction.description,
              amount: transaction.originalAmount,
              year: d.getFullYear(),
              month: d.getMonth(),
              day: d.getDate(),
              category: category,
            });
          }
        });
      });
      console.log(` --- scraping data from ${company} succeeded ---`);
      return all_transactions;
    } else {
      throw new Error(scrapeResult.errorType);
    }
  } catch (e: any) {
    console.log(` --- scraping ${company} failed for the following reason: ${e.message} ---`);
    await scraper(company, credentials, year, month);
    return [];
  }
}

//function that categorizes the transaction by its description
function findCategory(description: string, category: string | undefined, amount: number): string {
  category = category || "אחר";
  if (description.includes("משכורת")) {
    category = "משכורת";
  } else if (description.includes("שיק") && amount == -3250) {
    category = "שכר דירה";
  } else if (
    description.includes("ביט") ||
    description.includes("paybox") ||
    category.includes("פייבוקס") ||
    description.includes("BIT")
  ) {
    if (amount < 0) {
      category = "העברות כספים";
    } else {
      category = "קבלת כספים";
    }
  } else if (category.includes("מלונאות ואירוח")) {
    category = "תיירות";
  } else if (
    category.includes("רשתות שווק מזון") ||
    category.includes("מינימרקטים ומכולות") ||
    category.includes("מעדניות") ||
    category.includes("פארמה")
  ) {
    category = "מכולת/סופר";
  } else if (category.includes("רפואי") || category.includes("בריאות") || category.includes("רפואה")) {
    category = "רפואה";
  } else if (description.includes("התימני") || description.includes("WOLT")) {
    category = "מסעדות/קפה";
  } else if (description.includes('ב"ל מילואים') || description.includes('מופ"ת')) {
    category = "מילואים";
  } else if (description.includes("מקס אמות")) {
    category = "כלי בית";
  } else if (description.includes("Spotify")) {
    category = "מוסיקה";
  } else if (category.includes("שונות") || category.includes("אחר")) {
    category = "אחר";
  } else if (category.includes("רכב")) {
    category = "הוצאות רכב";
  } else if (category.includes("פנאי") || category.includes("תרבות")) {
    category = "פנאי ובילויים";
  } else if (category.includes("בתי ספר") || category.includes("מוסדות לימוד") || category.includes("לימודים")) {
    category = "לימודים";
  }
  return category || "אחר";
}

//function that checks if the transaction is not a credit card payment
function notCreditCard(description: string): boolean {
  return !(description.includes('ישראכרט בע"מ') || description.includes("כרטיסי אשראי") || description.includes("מקט איט"));
}
