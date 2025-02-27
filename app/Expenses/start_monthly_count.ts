import getTransactions from "../../lib/scraper/getTransaction";
import { Transaction } from "../../lib/scraper/scraper";
import { PRIVATE_SUPABASE_SERVICE_KEY, PUBLIC_SUPABASE_URL } from "../../lib/config";
import { createClient } from "@supabase/supabase-js";
export default async function start_monthly_count(year: number, month: number) {
  let date = `${year}.${month}`;

  const supabase = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_KEY);
  //get all transactions from the month and year given in the arguments
  //   let all_transactions: Array<Transaction> = await getTransactions(year, month);
  let all_transactions: Array<Transaction> = await supabase
    .from("transactions")
    .select("*")
    .eq("year", year)
    .eq("month", month - 1)
    .then((data) => {
      return data.data as Array<Transaction>;
    });

  console.log(all_transactions);
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

  return { category_count, all_transactions };
}

/* TODO: categorize bank account transactions
TODO: combine aliases of the same category 
TODO: make scraping run on server each 2 hours
TODO: make the function read data from the DB
TODO: search for id of transaction in the scraping data
*/
