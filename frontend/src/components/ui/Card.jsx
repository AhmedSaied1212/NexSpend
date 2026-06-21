import React from 'react';
import { formatCurrency } from '@/utils/FormateCurrency';
import { Wallet, TrendingDown, TrendingUp } from 'lucide-react';

const Card = ({ name, total }) => {
  return (
    <div className='bg-card p-6 w-full border border-border rounded-xl transition-all duration-300 shadow-sm'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-muted-foreground font-medium text-sm'>{name}</h1>
        {name === "Balance" ? (
          <Wallet className='bg-blue-500/10 rounded-lg p-1.5 w-8 h-8 text-blue-500'/>
        ) : name === "Expenses" ? (
          <TrendingDown className='bg-red-500/10 rounded-lg p-1.5 w-8 h-8 text-red-500'/>
        ) : (
          <TrendingUp className='bg-green-500/10 rounded-lg p-1.5 w-8 h-8 text-green-500' />
        )}
      </div>
      <h1 className='text-3xl font-bold tracking-wider text-foreground'>
        {formatCurrency(total)}
      </h1>
    </div>
  );
};

export default Card;