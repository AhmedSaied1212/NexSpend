import React, { useEffect, useState } from 'react'
import useTransactions from '@/hooks/useTransactions';
import * as XLSX from 'xlsx'
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/FormateCurrency';
const ExportExcel = ({ transactions }) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleExport = () => {
        setIsLoading(true);
        try {
            if (transactions?.length > 0){
                const cleanedTransactions = transactions.map((t) => ({
                    id: t._id,
                    description: t.description,
                    amount: Number(t.amount),
                    type: t.type,
                    category: t.category,
                    date: new Date(t.date).toLocaleDateString()
                }));
                const worksheet = XLSX.utils.json_to_sheet(cleanedTransactions, {
                    header: ["id", "description", "amount", "type", "category", "date"]
                });;
                worksheet["!cols"] = [
                    { wch: 25 }, // id
                    { wch: 30 }, // description
                    { wch: 10 }, // amount
                    { wch: 10 }, // type
                    { wch: 15 }, // category
                    { wch: 25 }, // date
                ];
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
                XLSX.writeFile(workbook, `transactions_${new Date().toISOString().split("T")[0]}.xlsx`);
                toast.success("Transactions exported successfully");
            }else{
                toast.error("No transactions to export");
            }  
        } catch (error) {
            toast.error("Failed to export transactions");
        } finally {
            setIsLoading(false)
        }
    } 
  return (
    <button disabled={isLoading} onClick={handleExport} className={`bg-blue-500 text-white px-4 py-2 rounded-lg duration-500 ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-blue-700"}`}>{isLoading ? <Loader2 className='animate-spin' /> : "Export to Excel"}</button>
  )
}

export default ExportExcel;