import React, { useState, useEffect } from 'react'
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import useTransactions from '@/hooks/useTransactions';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils/FormateCurrency';
import { Loader2 } from 'lucide-react';

const ExportPdf = ({ transactions }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = () => {
    if(!transactions || transactions.length === 0){
        toast.error("No transactions available to export")
        return
    }
    setIsGenerating(true);
    try {
        const doc = new jsPDF()

        const tableData = transactions.map((t) => [
            new Date(t.date).toLocaleDateString(),
            t.description,
            t.category,
            formatCurrency(t.amount),
            t.type
        ]);
        doc.setFontSize(18);
        doc.text("Transactions Report", 14, 20);
        autoTable(doc, { 
            head: [["Date","Description","Category","Amount","Type"]],
            body: tableData,
            startY: 30,
        })
        const date = new Date().toISOString().split("T")[0];
        doc.save(`transactions_${date}.pdf`);
        toast.success("PDF generated successfully");
    } catch (error) {
        toast.error("Error generating PDF");
        console.log(error.message);
    } finally {
        setIsGenerating(false);
    }
  }
  
  return (
    <button onClick={handleExport} disabled={isGenerating} className={`px-4 py-2 rounded-lg bg-red-500 text-white duration-500 cursor-pointer ${isGenerating ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700 cursor-pointer"}`}>{isGenerating ? <Loader2 className='animate-spin'/> : "Export PDF"}</button>
  )
}

export default ExportPdf