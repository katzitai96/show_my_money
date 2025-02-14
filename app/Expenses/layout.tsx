import styles from "./page.module.css";

export default function ExpensesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={styles.expensesPage}>{children}</div>;
}
