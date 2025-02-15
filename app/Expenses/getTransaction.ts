import { scraper, Transaction } from "./scraper";
import { CompanyTypes } from "israeli-bank-scrapers";

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
  return all_transactions;
}
