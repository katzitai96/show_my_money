import React from "react";
import "../styles/globals.css";
import ExpensesPage from "./Expenses/page";

export default function Home() {
  return (
    <>
      <header>
        <div className="main-header">
          <h1>Show My Money</h1>
        </div>
      </header>
      <main>
        <ExpensesPage></ExpensesPage>
      </main>
      <footer></footer>
    </>
  );
}
