import React, { useState, useEffect } from 'react';
import Cards from '../components/dashboard/Cards';
import SearchInput from '../components/ui/SearchInput';
import Button from '../components/ui/Button';
import List from '../components/dashboard/List';
import Modal from "../components/ui/Modal";
import DeleteDialog from "../components/ui/DeleteDialog";
import useTransactions from '@/hooks/useTransactions';

const Dashboard = () => {
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

  const filterdTransacion = transactions.filter((t) =>
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-200">
      <Cards transactions={transactions} />

      {/* Search + Add row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 px-4 md:px-6 pb-2">
        <SearchInput search={search} setSearch={setSearch} type="Transactions" />
        <div className="shrink-0 px-1 sm:px-0">
          <Button click={() => setIsModalOpen(true)} />
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

export default Dashboard;