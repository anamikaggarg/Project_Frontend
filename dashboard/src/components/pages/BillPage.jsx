// BillPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Download, CheckCircle, Calendar, ShieldCheck } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function BillPage() {
  const instituteState = useSelector((state) => state.Institute);
  const instituteId = instituteState?.currentInstitute?.instituteId;
  const [activeBill, setActiveBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!instituteId) {
      setError("Institute not found. Please login.");
      setLoading(false);
      return;
    }

    const fetchActiveBill = async () => {
      try {
        const res = await axios.get(
          `https://effie-uncandied-dumpily.ngrok-free.dev/billing/${instituteId}`,
          { headers: { "ngrok-skip-browser-warning": "true" } }
        );
        if (res.data?.bills?.length > 0) {
          setActiveBill(res.data.bills[0]);
        } else {
          setError("No active plan found.");
        }
      } catch (err) {
        console.error("Fetch Bills Error:", err.response?.data || err.message);
        setError("Failed to fetch billing data.");
      } finally {
        setLoading(false);
      }
    };

    fetchActiveBill();
  }, [instituteId]);

  const downloadPDF = (bill) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("OFFICIAL TAX INVOICE", 14, 20);
    doc.setFontSize(12);
    doc.text(`Bill ID: ${bill.billId}`, 14, 30);
    doc.text(`Plan Name: ${bill.planName}`, 14, 38);
    doc.text(`Billing Period: ${bill.startDate} → ${bill.endDate}`, 14, 46);

    autoTable(doc, {
      startY: 55,
      head: [["Description", "Amount (INR)"]],
      body: [
        ["Base Amount", (bill.finalAmount / 1.18).toFixed(2)],
        ["GST (18%)", (bill.finalAmount - bill.finalAmount / 1.18).toFixed(2)],
        ["Total Paid", bill.finalAmount.toFixed(2)],
      ],
    });

    doc.save(`Invoice_${bill.billId}.pdf`);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500 font-semibold">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
       
        {activeBill && (
          <div className="bg-green-100 text-green-800 rounded-xl p-4 flex items-center gap-3 shadow-md animate-fadeIn">
            <CheckCircle size={22} />
            <span className="font-semibold text-sm">🎉 Your plan is activated!</span>
          </div>
        )}

      
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
          <div className="flex items-center gap-2 text-green-500 font-semibold text-sm">
            <ShieldCheck size={18} /> Secure Billing
          </div>
        </div>

        
        {activeBill && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 font-semibold text-gray-900">
                <CheckCircle size={20} className="text-green-500" />
                {activeBill.planName}
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                  ACTIVE
                </span>
              </div>
              <span className="text-gray-400 text-sm">Bill ID: {activeBill.billId}</span>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="flex-1 space-y-4">
                <div className="flex gap-6 text-sm">
                  <div>
                    <div className="text-gray-400 uppercase font-semibold text-xs">Start Date</div>
                    <div className="text-gray-900 font-medium">{activeBill.startDate}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 uppercase font-semibold text-xs">Renewal Date</div>
                    <div className="text-gray-900 font-medium">{activeBill.endDate}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg text-gray-700">
                  <Calendar size={18} className="text-indigo-500" />
                  Your plan is active for <b>{activeBill.months} months</b>
                </div>

                <button
                  onClick={() => downloadPDF(activeBill)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
                >
                  <Download size={16} /> Download Invoice
                </button>
              </div>

              <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Base Amount</span>
                  <span>₹{(activeBill.finalAmount / 1.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600 text-sm font-medium">
                  <span>Discount</span>
                  <span>- ₹0.00</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>GST (18%)</span>
                  <span>₹{(activeBill.finalAmount - activeBill.finalAmount / 1.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-2 pt-2 border-t border-dashed text-gray-900 font-bold text-lg">
                  <span>Total Paid</span>
                  <span>₹{activeBill.finalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}