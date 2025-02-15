import getTransactions from "./getTransaction";
import { Transaction } from "./scraper";

export default async function start_monthly_count(year: number, month: number) {
  let date = `${year}.${month}`;

  //get all transactions from the month and year given in the arguments
  let all_transactions: Array<Transaction> = await getTransactions(year, month);

  //create a map to count the amount of each category
  let category_count = new Map<string, number>();
  all_transactions.forEach((transaction) => {
    if (category_count.has(transaction.category)) {
      let cur_amount = category_count.get(transaction.category);
      if (cur_amount != undefined) {
        category_count.set(transaction.category, cur_amount + transaction.amount);
      }
    } else {
      category_count.set(transaction.category, transaction.amount);
    }
  });

  // add the total amount of the month to the csv file
  let total_amount = 0;
  category_count.forEach((value) => {
    total_amount += value;
  });

  // category_count.set('סה"כ הוצאות', total_amount);
  //add the total amount of the cateogries: "מסעדות/קפה", "קניות", "תחבורה,"תקשורת","מכולת/סופר" to the csv file
  let unimportant_categories = ["בתי ספר", "אחרים", "פנאי בילוי", "שונות", "אחר", "מילואים", "תיירות"];
  let important_categories_total = total_amount;
  unimportant_categories.forEach((category) => {
    if (category_count.has(category)) {
      important_categories_total -= category_count.get(category) as number;
    }
  });
  //   category_count.set('סה"כ שוטפות', important_categories_total);
  // write the items in category_count into a csv file, if it already exists, append to it. write the items in 8-utf format
  return { category_count, all_transactions };
  //   saveToCSV(date, category_count);
}

start_monthly_count(2024, 11);

/* TODO: categorize bank account transactions
TODO: combine aliases of the same category
TODO: add each month with a title and in a seperate columns
TODO: check adding to a allready created csv file with 8utf encoding
*/

// Function to save credit card usage data to CSV file
// function saveToCSV(date: string, data: Map<string, number>, fileName = "cashFlow.csv") {
//   // Check if the CSV file exists
//   if (fs.existsSync(fileName)) {
//     // File exists, so we need to append data to the corresponding category
//     appendDataToCSV(date, data, fileName);
//   } else {
//     // File does not exist, so create it and write the header row first
//     createCSVWithHeader(date, data, fileName);
//   }
// }

// Function to create a new CSV file with headers and write the first row of data
// function createCSVWithHeader(date: string, data: Map<string, number>, filePath: string) {
//   const header = ["קטגוריה", date];
//   const allRows = Array.from(data.entries());
//   // console.log(allRows);
//   const rows = allRows.map((entry) => `${entry[0]},${entry[1]}`);

//   // Write header and data to the CSV file
//   const csvContent = [header.join(","), ...rows].join("\n");

//   fs.writeFileSync(filePath, csvContent, "utf-8");
//   console.log("CSV file created and data saved.");
// }

// Function to append new data to an existing CSV file
// function appendDataToCSV(date: string, data: Map<string, number>, filePath: string) {
//   // Read existing CSV file to get current rows
//   const existingData = fs.readFileSync(filePath, "utf-8").split("\n");

//   // create a dict of the category and the corresponding index in the csv file
//   let category_index = new Map<string, number>();
//   for (let i = 0; i < existingData.length; i++) {
//     let cur_category = existingData[i].split(",")[0];
//     category_index.set(cur_category, i);
//   }
//   existingData[0] += `,${date}`;
//   // append the new data to the existing data on the category index
//   data.forEach((value, key) => {
//     if (category_index.has(key)) {
//       existingData[category_index.get(key) as number] += `,${value}`;
//     } else {
//       let columns = existingData[0].split(",").length;
//       let new_row = key;
//       for (let i = 1; i < columns - 1; i++) {
//         new_row += ",";
//       }
//       new_row += `,${value}`;
//       existingData.push(new_row);
//     }
//   });

// const allRows = Array.from(data.entries());
// const rows = allRows.map((entry) => `${entry[0]},${entry[1]}`);
// const updatedContent = [...existingData, ...rows].join("\n");

// Write the updated content back to the CSV file
//   fs.writeFileSync(filePath, existingData.join("\n"), "utf-8");
//   console.log("Data appended to the CSV file.");
// }
