import { scraper, Transaction } from "./scraper";
import { CompanyTypes } from "israeli-bank-scrapers";
import { PRIVATE_SUPABASE_SERVICE_KEY, PUBLIC_SUPABASE_URL } from "../../lib/config";
import { createClient } from "@supabase/supabase-js";

export default async function getTransactions(year: number, month: number): Promise<Array<Transaction>> {
  let all_transactions: Array<Transaction> = [];
  let new_transaction = await scraper(
    CompanyTypes.isracard,
    { id: "208370999", card6Digits: "526028", password: "Tihnun103" },
    year,
    month
  );
  all_transactions = all_transactions.concat(new_transaction);
  new_transaction = await scraper(CompanyTypes.otsarHahayal, { username: "VZ0EFV1", password: "Taabura103!" }, year, month);
  all_transactions = all_transactions.concat(new_transaction);
  new_transaction = await scraper(CompanyTypes.visaCal, { username: "katzitai", password: "Tihnun103" }, year, month);
  all_transactions = all_transactions.concat(new_transaction);

  const supabase = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_KEY);

  await supabase
    .from("transactions")
    .insert({ amount: 100, description: "check", year: 2025, month: 1, day: 5, category: "מסעדות" })
    .select();

  const { data, error } = await supabase.from("transactions").insert(
    all_transactions.map((transaction) => {
      return {
        amount: transaction.amount,
        description: transaction.description,
        year: transaction.year,
        month: transaction.month,
        day: transaction.day,
        category: transaction.category,
      };
    })
  );
  console.log("added transactions to DB");
  console.log(data, error);
  return all_transactions;
}
