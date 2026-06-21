import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useTransactions from '@/hooks/useTransactions';
import { ArrowLeft, Calendar, Hash, Loader2, TrendingDown, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/FormateCurrency';
import { getCategoryIcon, getCategoryColor } from '@/data/categories';
import Modal from '@/components/ui/Modal';
import DeleteDialog from '@/components/ui/DeleteDialog';

const TransactionDetails = () => {
    const { id } = useParams();
    const {
        transactionDetails,
        getTransactionDetails,
        saveTransaction,
        deleteTransaction,
        setTransactions,
        loading,
        setIsEditing,
        setIsModalOpen,
        isModalOpen,

        type,
        setType,
        setEditId,
        description,
        setDescription,
        amount,
        setAmount,
        category,
        setCategory,
        date,
        setDate,

        isEditing,
        deleteLoadingId,
        isDeleteOpen,
        setIsDeleteOpen,
        deleteId,
        setDeleteId,

        resetForm,
    } = useTransactions();
    const navigate = useNavigate();

    useEffect(() => {
        getTransactionDetails(id);
    }, []);
    
    const closeModal = () => {
        resetForm();
    };

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    const onDelete = (id) => {
        setDeleteId(id);
        setIsDeleteOpen(true);
    };

    if (!transactionDetails) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-foreground">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    if (transactionDetails._id !== id) {
        return (
            <div className="p-8 text-center text-foreground bg-background">
                <h1 className="text-2xl font-bold mb-2">404 - Transaction not found</h1>
                <p className="text-muted-foreground mb-4">No transaction found by this ID: {id}</p>
                <button onClick={handleBack} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                    Go Back
                </button>
            </div>
        );       
    } 

    const handleDelete = async (id) => {
        const success = await deleteTransaction(id);
        if (success) {
            handleBack();
        }
    };

    const editTransactionDetails = () => {
        setIsEditing(true);
        setEditId(transactionDetails._id);
        setIsModalOpen(true);
        setAmount(transactionDetails.amount);
        setCategory(transactionDetails.category);
        setType(transactionDetails.type);
        setDescription(transactionDetails.description);
        setDate(transactionDetails.date.split("T")[0]);
    };

    const CategoryIcon = getCategoryIcon(transactionDetails.category);
    const categoryColor = getCategoryColor(transactionDetails.category);

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-200 p-4 md:p-6 flex flex-col items-center">
            <div className="w-full max-w-[600px]">
                
                {/* Back button */}
                <div className="flex justify-start mb-6">
                    <button 
                        onClick={handleBack} 
                        className="flex items-center cursor-pointer bg-card border border-border px-4 py-2 rounded-xl gap-2 hover:bg-muted text-foreground transition-all duration-300 font-medium text-sm"
                    >
                        <ArrowLeft size={16} />
                        <span>Back</span>
                    </button>
                </div>

                {/* Primary Card */}
                <div className={`border mb-6 p-8 flex flex-col items-center justify-center rounded-2xl shadow-sm transition-all duration-300
                    ${transactionDetails.type === "expense" 
                        ? "bg-red-500/5 border-red-500/20" 
                        : "bg-green-500/5 border-green-500/20"
                    }`}
                >
                    {transactionDetails.type === "income" ? (
                        <div className="bg-green-500/10 p-4 rounded-full text-green-500 mb-3">
                            <TrendingUp size={36} />
                        </div>
                    ) : (
                        <div className="bg-red-500/10 p-4 rounded-full text-red-500 mb-3">
                            <TrendingDown size={36} />
                        </div>
                    )}
                    
                    <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-1">
                        {transactionDetails.type}
                    </p>

                    {transactionDetails.type === "income" ? (
                        <h1 className="text-green-500 text-3xl font-extrabold tracking-wider">
                            +{formatCurrency(transactionDetails.amount)}
                        </h1>
                    ) : (
                        <h1 className="text-red-500 text-3xl font-extrabold tracking-wider">
                            -{formatCurrency(transactionDetails.amount)}
                        </h1>
                    )}
                    
                    <h2 className="text-xl font-bold mt-3 text-foreground">{transactionDetails.description}</h2>
                </div>

                {/* Details list card */}
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm mb-8 space-y-4">
                    {/* Category row */}
                    <div className="border-b border-border pb-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg shrink-0 ${categoryColor}`}>
                                <CategoryIcon size={18} />
                            </div>
                            <span className="text-sm font-semibold text-muted-foreground">Category</span>
                        </div>
                        <span className="text-base font-bold text-foreground">{transactionDetails.category}</span>
                    </div>

                    {/* Date row */}
                    <div className="border-b border-border pb-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg shrink-0">
                                <Calendar size={18} />
                            </div>
                            <span className="text-sm font-semibold text-muted-foreground">Date</span>
                        </div>
                        <span className="text-base font-bold text-foreground">
                            {new Date(transactionDetails.date).toLocaleDateString()}
                        </span>
                    </div>

                    {/* ID row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/10 text-green-500 rounded-lg shrink-0">
                                <Hash size={18} />
                            </div>
                            <span className="text-sm font-semibold text-muted-foreground">ID</span>
                        </div>
                        <span className="text-sm font-mono text-muted-foreground">{transactionDetails._id}</span>    
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={editTransactionDetails}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3.5 rounded-xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow active:scale-[0.99] text-sm"
                    >
                        Edit Transaction
                    </button>
                    <button 
                        onClick={() => onDelete(transactionDetails._id)}
                        className="w-full bg-transparent hover:bg-red-500/10 border border-red-500 text-red-500 font-semibold py-3.5 rounded-xl transition-all duration-300 cursor-pointer text-sm"
                    >
                        Delete Transaction
                    </button>
                </div>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                setTransactions={setTransactions} 
                onClose={closeModal} 
                loading={loading} 
                type={type} 
                setType={setType} 
                description={description} 
                setDescription={setDescription} 
                amount={amount} 
                setAmount={setAmount} 
                category={category} 
                setCategory={setCategory} 
                date={date} 
                setDate={setDate} 
                isEditing={isEditing} 
                handleSaveEdit={saveTransaction}
            />
            
            <DeleteDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                loading={deleteLoadingId}
                onDelete={() => handleDelete(deleteId)}
            />
        </div>
    );
};

export default TransactionDetails;