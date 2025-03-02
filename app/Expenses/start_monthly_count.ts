import getTransactions from "../../lib/scraper/getTransaction";
import { Transaction } from "../../lib/scraper/scraper";
import { PRIVATE_SUPABASE_SERVICE_KEY, PUBLIC_SUPABASE_URL } from "../../lib/config";
import { createClient } from "@supabase/supabase-js";

/**
 *  sum all transactions in a given month and year for each category
 * @param year year of the month to count
 * @param month month to count in 1-12 format index - example: 1 for January
 * @returns a map of the categories and the amount of each category
 */
export default async function start_monthly_count(year: number, month: number) {
  // let date = `${year}.${month}`;
  console.log("running monthly_count on ", month, ".", year);
  const supabase = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_KEY);
  //get all transactions from the month and year given in the arguments
  //   let all_transactions: Array<Transaction> = await getTransactions(year, month);
  let all_transactions: Array<Transaction> = await supabase
    .from("transactions")
    .select("*")
    .eq("year", year)
    .eq("month", month)
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
TODO: make scraping run on server each day
TODO: divide things like BIT to expenses and income
TODO: add logos to the categories and the site
*/
