import React, { useEffect, useState } from 'react';
import List from '@/components/dashboard/List';
import SearchInput from '@/components/ui/SearchInput';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import DeleteDialog from "../components/ui/DeleteDialog";
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/FormateCurrency';
import useTransactions from '@/hooks/useTransactions';

const Income = () => {
  const [search, setSearch] = useState("");
  const {
    transactions, setTransactions, isLoading, loading,
    setIsModalOpen, isModalOpen,
    type, setType, description, setDescription,
    amount, setAmount, category, setCategory, date, setDate,
    isEditing, deleteLoadingId, isDeleteOpen, setIsDeleteOpen, deleteId, setDeleteId,
    resetForm, addTransaction, editTransaction, saveTransaction, deleteTransaction, getTransactions,
  } = useTransactions();

  const closeModal = () => resetForm();

  useEffect(() => { getTransactions(); }, []);

  const filterdTransacion = transactions
    .filter((t) => t.type === "income")
    .filter((t) => t.description.toLowerCase().includes(search.toLowerCase()));
  const totalIncomes = filterdTransacion.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="bg-background min-h-screen text-foreground transition-colors duration-200">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 md:px-6 py-5">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Incomes</h1>
        <div className="flex items-center gap-2.5 text-xl text-green-500">
          <TrendingUp className="bg-green-500/10 rounded-lg p-2 w-9 h-9 text-green-500" />
          <span className="font-bold">{formatCurrency(totalIncomes)}</span>
        </div>
      </div>

      {/* Search + Add row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 px-4 md:px-6 pb-2">
        <SearchInput search={search} setSearch={setSearch} type="Incomes" />
        <div className="shrink-0 px-1 sm:px-0">
          <Button click={() => { setType("income"); setCategory(""); setIsModalOpen(true); }} />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen} setTransactions={setTransactions} onClose={closeModal}
        loading={loading} type={type} setType={setType} description={description}
        setDescription={setDescription} amount={amount} setAmount={setAmount}
        category={category} setCategory={setCategory} handleAddTransaction={addTransaction}
        date={date} setDate={setDate} isEditing={isEditing} handleSaveEdit={saveTransaction}
      />

      <List
        search={search} isLoading={isLoading} deleteLoadingId={deleteLoadingId}
        handleDelete={deleteTransaction} filterdTransacion={filterdTransacion}
        handleEdit={editTransaction} setIsDeleteOpen={setIsDeleteOpen}
        onDeleteClick={(id) => { setDeleteId(id); setIsDeleteOpen(true); }}
      />
      <DeleteDialog
        open={isDeleteOpen} onOpenChange={setIsDeleteOpen}
        loading={deleteLoadingId} onDelete={() => deleteTransaction(deleteId)}
      />
    </div>
  );
};

export default Income;