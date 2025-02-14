import styles from "./page.module.css";
import data from "./mockData.json";
export interface categorySummary {
  name: string;
  amount: number;
  id?: number;
}

export default function ExpensesPage() {
  const totalRegularExpenses = data.expenses
    .filter((element) => {
      return element.name === "קניות" || element.name === "מסעדות";
    })
    .reduce((acc, expense) => {
      return acc + expense.amount;
    }, 0);
  const totalExpenses = data.expenses.reduce((acc, expense) => {
    return acc + expense.amount;
  }, 0);
  const totalIncome = data.income.reduce((acc, income) => {
    return acc + income.amount;
  }, 0);

  return (
    <div className={styles.expensesPage}>
      <div className={`${styles.SumRow} ${styles.expensesRowLayout}`}>
        <h3>תזרים חודשי</h3>
        <h3 className={`${styles.red}`}>{totalRegularExpenses}</h3>
      </div>
      <h2>הוצאות</h2>
      <div className={`${styles.SumRow} ${styles.expensesRowLayout}`}>
        <h3>סה"כ הוצאות קבועות</h3>
        <h3 className={`${styles.red}`}>{totalRegularExpenses}</h3>
      </div>
      <div className={styles.SumRow}>
        <h3>סה"כ הוצאות</h3>
        <h3 className={`${styles.red}`}>{totalExpenses}</h3>
      </div>
      {data.expenses.map((expense) => {
        return (
          <details key={expense.id} style={{ width: "100%" }}>
            <summary className={`${styles.expenseRow} ${styles.expensesRowLayout}`}>
              <div className={`${styles.categoryHeader}`}>
                <div>
                  <img src="globe.svg" alt="globe" className={styles.expenseIcon} />
                </div>
                <h4>{expense.name}</h4>
              </div>
              <h4 className={`${styles.red}`}>{expense.amount}</h4>
            </summary>
            {expense.transactions.map((transaction) => {
              return (
                <div key={transaction.id} className={`${styles.transactionRow} ${styles.expensesRowLayout}`}>
                  <h5>{transaction.description}</h5>
                  <h5>{transaction.date}</h5>
                  <h5 className={`${styles.red}`}>{transaction.amount}</h5>
                </div>
              );
            })}
          </details>
        );
      })}
      <h2>הכנסות</h2>
      <div className={`${styles.SumRow} ${styles.expensesRowLayout}`}>
        <h3>סה"כ הכנסות</h3>
        <h3 className={`${styles.green}`}>{totalIncome}</h3>
      </div>
      {data.income.map((income) => {
        return (
          <details key={income.id} className={`${styles.expensesRowLayout}`}>
            <summary className={styles.expenseRow}>
              <div>
                <img src="globe.svg" alt="globe" className={styles.expenseIcon} />
              </div>
              <h4>{income.name}</h4>
              <h4 className={`${styles.green}`}>{income.amount}</h4>
            </summary>
            <div>
              {income.transactions.map((transaction) => {
                return (
                  <div key={transaction.id} className={`${styles.transactionRow} ${styles.expensesRowLayout}`}>
                    <h5>{transaction.description}</h5>
                    <h5>{transaction.date}</h5>
                    <h5 className={`${styles.green}`}>{transaction.amount}</h5>
                  </div>
                );
              })}
            </div>
          </details>
        );
      })}
    </div>
  );
}
