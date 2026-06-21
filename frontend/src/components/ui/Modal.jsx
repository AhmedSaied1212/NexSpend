import { X } from 'lucide-react';
import Button from './Button';
import CategorySelect from './CategorySelect';

const Modal = ({ 
  isOpen, 
  onClose, 
  childern, 
  loading, 
  handleAddTransaction, 
  type, 
  setType, 
  description, 
  setDescription, 
  category, 
  setCategory, 
  date, 
  setDate, 
  amount, 
  setAmount, 
  isEditing, 
  handleSaveEdit 
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4'>
      <div className='bg-card text-foreground w-full max-w-[500px] shadow-2xl p-6 rounded-xl animate-in fade-in zoom-in-95 duration-200 border border-border'>
        <div className='flex justify-between border-b border-border pb-3 mb-4'>
          <h1 className='text-xl font-bold text-foreground'>
            {isEditing ? 'Edit Transaction' : 'Add Transaction'}
          </h1>
          <button 
            onClick={onClose} 
            className='text-muted-foreground hover:text-foreground duration-300 cursor-pointer'
          >
            <X size={20} />
          </button>
        </div>
        
        <div>
          {/* Transaction Type */}
          <div className='my-4'>
            <h1 className='text-foreground text-sm font-semibold mb-2'>Type</h1>
            <div className='flex items-center gap-4'>
              <button 
                type="button"
                className={`border text-sm font-semibold p-2.5 w-full rounded-lg cursor-pointer duration-350 
                  ${type === "expense" 
                    ? "bg-red-500/10 text-red-500 border-red-500" 
                    : "border-border text-muted-foreground hover:bg-muted"
                  }`} 
                onClick={() => { setType("expense"); setCategory(""); }}
              >
                Expense
              </button>
              <button 
                type="button"
                onClick={() => { setType("income"); setCategory(""); }} 
                className={`border text-sm font-semibold p-2.5 w-full rounded-lg cursor-pointer duration-350 
                  ${type === "income" 
                    ? "bg-green-500/10 border-green-500 text-green-500" 
                    : "border-border text-muted-foreground hover:bg-muted"
                  }`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Description */}
          <div className='my-4'>
            <h1 className='text-foreground text-sm font-semibold mb-1.5'>Description</h1>
            <input 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              type="text" 
              className='text-base rounded-lg p-2.5 w-full border border-border bg-background text-foreground outline-none focus:border-primary transition duration-200' 
              placeholder='Enter description'
            />
          </div>

          {/* Amount */}
          <div className='my-4'>
            <h1 className='text-foreground text-sm font-semibold mb-1.5'>Amount</h1>
            <input 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              type="number" 
              className='text-base rounded-lg p-2.5 w-full border border-border bg-background text-foreground outline-none focus:border-primary transition duration-200' 
              placeholder='0.00'
            />
          </div>

          {/* Category Selector */}
          <div className='my-4'>
            <h1 className='text-foreground text-sm font-semibold mb-1.5'>Category</h1>
            <CategorySelect category={category} setCategory={setCategory} type={type} />
          </div>

          {/* Date */}
          <div className='my-4'>
            <h1 className='text-foreground text-sm font-semibold mb-1.5'>Date</h1>
            <input 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              className='text-base rounded-lg p-2.5 w-full border border-border bg-background text-foreground outline-none focus:border-primary transition duration-200' 
              type="date"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className='flex mt-6 items-center gap-4'>
          <button 
            type="button"
            onClick={onClose}
            className='border-border border text-sm p-2.5 w-full rounded-lg cursor-pointer text-foreground hover:text-red-500 hover:border-red-500 dark:hover:border-red-500/80 duration-300 font-semibold' 
          >
            Cancel
          </button>
          <div className='w-full'>
            <Button isLoading={loading} isEditing={isEditing} click={isEditing ? handleSaveEdit : handleAddTransaction}/>
          </div>
        </div>
      </div>

      {childern}
    </div>
  );
};

export default Modal;