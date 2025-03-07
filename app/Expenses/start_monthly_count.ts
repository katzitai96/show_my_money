import getTransactions from "../../lib/scraper/getTransaction";
import { Transaction } from "../../lib/scraper/scraper";
import { PRIVATE_SUPABASE_SERVICE_KEY, PUBLIC_SUPABASE_URL } from "../../lib/config";
import { createClient } from "@supabase/supabase-js";

export let category_mapping: Map<string, string> = new Map<string, string>([
  ["מסעדות/קפה", "מסעדות/קפה"],
  ["פארמה", "מכולת/סופר"],
  ["מעדניות", "מכולת/סופר"],
  ["שרות רפואי", "רפואה"],
  ["רפואה", "רפואה"],
  ["מכולת/סופר", "מכולת/סופר"],
  ["דלק", "דלק"],
  ["תקשורת", "תקשורת"],
  ["תרבות", "פנאי ובילויים"],
  ["פנאי ובילויים", "פנאי ובילויים"],
  ["העברות כספים פייבוקס D/MS", "העברות כספים"],
  ["העברות כספים", "העברות כספים"],
  ["שירותי רכב", "הוצאות רכב"],
  ["הוצאות רכב", "הוצאות רכב"],
  ["בתי ספר", "לימודים"],
  ["לימודים", "לימודים"],
  ["שכר דירה", "שכר דירה"],
  ["מילואים", "מילואים"],
  ["משכורת", "משכורת"],
  ["אחר", "אחר"],
]);

export let category_images: Map<string, string> = new Map<string, string>([
  ["מסעדות/קפה", "restaurant.svg"],
  ["מכולת/סופר", "shopping-cart.svg"],
  ["דלק", "gasoline.svg"],
  ["תקשורת", "communications.svg"],
  ["דלק", "gasoline.svg"],
  ["רפואה", "health.svg"],
  ["פנאי ובילויים", "party.svg"],
  ["העברות כספים", "cash-flow-icon.svg"],
  ["הוצאות רכב", "car.svg"],
  ["מילואים", "military.svg"],
  ["משכורת", "salary.svg"],
  ["אחר", "globe.svg"],
  ["לימודים", "study.svg"],
  ["שכר דירה", "rent.svg"],
]);

/**
 *  sum all transactions in a given month and year for each category
 * @param year year of the month to count
 * @param month month to count in 1-12 format index - example: 1 for January
 * @returns a map of the categories and the amount of each category
 */
export default async function start_monthly_count(year: number, month: number) {
  const supabase = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_KEY);
  //get all transactions from the month and year given in the arguments
  let all_transactions: Array<Transaction> = await supabase
    .from("transactions")
    .select("*")
    .eq("year", year)
    .eq("month", month)
    .then((data) => {
      return data.data as Array<Transaction>;
    });

  //change the category to the category in the category_mapping
  all_transactions.forEach((transaction: Transaction) => {
    const category = category_mapping.get(transaction.category);
    if (category) {
      transaction.category = category;
    } else {
      transaction.category = transaction.category;
    }
  });
  // console.log(all_transactions);
  //create a map to count the amount of each category
  let category_count = new Map<string, number>();
  all_transactions.forEach((transaction: Transaction) => {
    const category = category_mapping.get(transaction.category);
    if (category && category_count.has(category)) {
      let cur_amount = category_count.get(category);
      if (cur_amount != undefined) {
        category_count.set(category, cur_amount + transaction.amount);
      }
    } else if (category) {
      category_count.set(category, transaction.amount);
    }
  });

  let total_amount = 0;
  category_count.forEach((value) => {
    total_amount += value;
  });

  // category_count.set('סה"כ הוצאות', total_amount);
  //add the total amount of the cateogries: "מסעדות/קפה", "קניות", "תחבורה,"תקשורת","מכולת/סופר" to the csv file
  let unimportant_categories = ["לימודים", "אחר", "פנאי ובילויים", "משכורת", "מילואים"];
  let important_categories_total = total_amount;
  unimportant_categories.forEach((category) => {
    const cat = category_mapping.get(category);
    if (cat && category_count.has(cat)) {
      important_categories_total -= category_count.get(cat) as number;
    }
  });

  return { category_count, all_transactions, important_categories_total };
}

/* TODO: categorize bank account transactions
TODO: add logos to the site
TODO: combine aliases of the same category 
TODO: divide things like BIT to expenses and income
TODO: correct known wrong categories and save them in a file.
TODO: devide the categories to regular and irregular expenses
*/
