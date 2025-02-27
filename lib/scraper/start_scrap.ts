import getTransactions from "@/lib/scraper/getTransaction";

export const maxDuration = 60;

export default async function start_scrap() {
  console.log("running monthly_count");
  const date = new Date(Date.now());
  const cur_month = date.getMonth() + 1;
  const month_to_fetch = cur_month === 1 ? 12 : cur_month - 1; // fetch the previous month
  const year_to_fetch = cur_month === 1 ? date.getFullYear() - 1 : date.getFullYear();

  await getTransactions(year_to_fetch, month_to_fetch);
  console.log("finished running monthly_count");
  // return new Response("running monthly_count");
}
