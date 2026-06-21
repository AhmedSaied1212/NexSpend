import React from 'react';
import Card from '../ui/Card';

const Cards = ({ transactions }) => {
  const expenses = transactions.filter((t) => t.type === "expense");
  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const incomes = transactions.filter((t) => t.type === "income");
  const totalIncomes = incomes.reduce((sum, item) => sum + Number(item.amount), 0);
  const balance = totalIncomes - totalExpenses;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 md:p-6">
      <Card name="Balance"  total={balance} />
      <Card name="Incomes"  total={totalIncomes} />
      <Card name="Expenses" total={totalExpenses} />
    </div>
  );
};

export default Cards;