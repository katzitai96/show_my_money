import styles from "./page.module.css";
import start_monthly_count from "./start_monthly_count";
import data from "./mockData.json";
import { Transaction } from "./scraper";
export interface categorySummary {
  name: string;
  amount: number;
  id?: number;
}

export default async function ExpensesPage() {
  const { category_count, all_transactions } = await start_monthly_count(2025, 1);
  const totalRegularExpenses: number = 0;
  const totalExpenses: number = category_count
    .values()
    .filter((value) => value < 0)
    .reduce((acc, value) => {
      return acc + value;
    }, 0);
  const totalIncome: number = category_count
    .values()
    .filter((value) => value > 0)
    .reduce((acc, value) => {
      return acc + value;
    }, 0);

  const balance: number = totalIncome + totalExpenses; //expenses are negative

  // create an array of categorySummary objects from the category_count map
  const categories_count: categorySummary[] = Array.from(category_count.entries()).map(([name, amount], index) => {
    return { name, amount, id: index };
  });
  console.log(categories_count, all_transactions);
  return (
    <div className={styles.expensesPage}>
      <ExpensesPageSumRow
        text="תזרים חודשי"
        amount={Math.round(balance)}
        color={`${balance >= 0 ? styles.green : styles.red}`}
      ></ExpensesPageSumRow>
      <h2>הוצאות</h2>
      <ExpensesPageSumRow
        text="סה״כ הוצאות קבועות"
        amount={Math.round(totalRegularExpenses)}
        color={styles.red}
      ></ExpensesPageSumRow>
      <ExpensesPageSumRow text="סה״כ הוצאות" amount={Math.round(totalExpenses)} color={styles.red}></ExpensesPageSumRow>
      {categories_count
        .filter((category) => category.amount <= 0)
        .map((category, index: number) => {
          return (
            <details key={index} className={styles.CategoryRowWrapper}>
              <summary className={styles.CategoryRowWrapper}>
                <ExpensesPageCategoryRow category={category} color={styles.red}></ExpensesPageCategoryRow>
              </summary>
              {all_transactions
                .filter((transaction) => transaction.category === category.name)
                .map((transaction, index2) => {
                  return (
                    <ExpensesPageTransactionRow
                      key={index2}
                      transaction={transaction}
                      color={styles.red}
                    ></ExpensesPageTransactionRow>
                  );
                })}
            </details>
          );
        })}
      <h2>הכנסות</h2>
      <ExpensesPageSumRow text="סה״כ הכנסות" amount={Math.round(totalIncome)} color={styles.green}></ExpensesPageSumRow>
      {categories_count
        .filter((category) => category.amount > 0)
        .map((category, index: number) => {
          return (
            <details key={index} className={styles.CategoryRowWrapper}>
              <summary className={styles.CategoryRowWrapper}>
                <ExpensesPageCategoryRow category={category} color={styles.green}></ExpensesPageCategoryRow>
              </summary>
              <div>
                {all_transactions
                  .filter((transaction) => transaction.category === category.name)
                  .map((transaction, index2) => {
                    return (
                      <ExpensesPageTransactionRow
                        key={index2}
                        transaction={transaction}
                        color={styles.green}
                      ></ExpensesPageTransactionRow>
                    );
                  })}
              </div>
            </details>
          );
        })}
    </div>
  );
}

function ExpensesPageSumRow({ text, amount, color }: { text: string; amount: number; color: string }) {
  return (
    <div className={`${styles.SumRowLayout}`}>
      <h3>{text}</h3>
      <h3 className={`${color} ${styles.left}`}>{Math.round(amount)}</h3>
    </div>
  );
}

function ExpensesPageCategoryRow({ category, color }: { category: categorySummary; color: string }) {
  return (
    <div className={`${styles.CategoryRowLayout}`}>
      <div className={`${styles.categoryHeader}`}>
        <div>
          <img src="globe.svg" alt="globe" className={styles.categoryIcon} />
        </div>
        <h4>{category.name}</h4>
      </div>
      <h4 className={`${color} ${styles.left}`}>{Math.round(category.amount)}</h4>
    </div>
  );
}

function ExpensesPageTransactionRow({ transaction, color }: { transaction: Transaction; color: string }) {
  return (
    <div className={`${styles.transactionRow}`}>
      <h5>{transaction.description}</h5>
      <h5>{`${transaction.day}.${transaction.month}.${transaction.year}`}</h5>
      <h5 className={`${color} ${styles.left}`}>{Math.round(transaction.amount)}</h5>
    </div>
  );
}
