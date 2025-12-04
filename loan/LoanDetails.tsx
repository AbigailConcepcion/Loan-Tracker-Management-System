import React, { useState, useMemo } from "react";
import { Payment } from "@/types/loan";
import { PaymentScheduleView } from "./PaymentScheduleView";
import { PaymentRecorder } from "./PaymentRecorder";
import { LoanEditForm } from "./LoanEditForm";
import { PaymentHistory } from "./PaymentHistory";
import { ArrowLeft, Edit, AlertCircle, Image as ImageIcon, X, Download, Calendar, Camera, Plus, Trash2 } from "lucide-react";
import { getLoanStats } from "@/utils/loanCalculations";
import { ImageUpload } from "@/components/loan/ImageUpload"; 

// ============================================================================
// 1. RECEIPT GALLERY COMPONENT (Internal)
// ============================================================================
interface GalleryProps {
  payments: Payment[];
  onClose: () => void;
  onAddPhoto: (url: string) => void;
}

const ReceiptGallery: React.FC<GalleryProps> = ({ payments, onClose, onAddPhoto }) => {
  const receipts = payments.filter(p => p.receiptPhoto && p.receiptPhoto.length > 0);
  const [selectedImage, setSelectedImage] = useState<Payment | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/95 z-[60] overflow-y-auto flex flex-col">
      <div className="sticky top-0 bg-black/80 backdrop-blur-md p-4 flex justify-between items-center text-white z-10 border-b border-gray-800">
        <div>
          <h2 className="text-xl font-bold">Receipt Gallery</h2>
          <p className="text-sm text-gray-400">{receipts.length} photo{receipts.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-4 flex-1">
        {isUploading ? (
          <div className="max-w-md mx-auto bg-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-white font-bold mb-4 text-center">Add New Receipt</h3>
            <ImageUpload 
              label="Take or Upload Photo" 
              onChange={(url) => {
                if(url) {
                  onAddPhoto(url);
                  setIsUploading(false); 
                }
              }} 
            />
            <button onClick={() => setIsUploading(false)} className="w-full mt-4 text-gray-400 py-2 hover:text-white">Cancel</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div 
              onClick={() => setIsUploading(true)}
              className="aspect-[3/4] bg-gray-800 rounded-xl border-2 border-dashed border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700 hover:border-blue-500 hover:text-blue-400 transition group"
            >
              <div className="bg-gray-700 p-4 rounded-full mb-2 group-hover:bg-gray-600">
                <Camera className="w-8 h-8 text-gray-400 group-hover:text-blue-400" />
              </div>
              <span className="text-gray-400 font-medium group-hover:text-blue-400">Add Photo</span>
            </div>

            {receipts.map((payment) => (
              <div 
                key={payment.id} 
                className="relative group cursor-pointer bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700"
                onClick={() => setSelectedImage(payment)}
              >
                <div className="aspect-[3/4] w-full">
                  <img src={payment.receiptPhoto} alt={`Receipt #${payment.paymentNumber}`} className="w-full h-full object-cover"/>
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-8">
                  <p className="font-bold text-white text-sm">Pay #{payment.paymentNumber}</p>
                  <p className="text-xs font-bold text-green-400">₱{(payment.amountPaid || 0).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4 animate-in fade-in zoom-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col items-center">
            <div className="absolute top-4 right-4 flex gap-3 z-10">
              <a 
                href={selectedImage.receiptPhoto} 
                download={`Receipt-${selectedImage.paymentNumber}`}
                className="p-3 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <Download className="w-6 h-6" />
              </a>
              <button onClick={() => setSelectedImage(null)} className="p-3 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur-sm">
                <X className="w-6 h-6" />
              </button>
            </div>
            <img src={selectedImage.receiptPhoto} alt="Full Receipt" className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"/>
            <div className="mt-4 text-white text-center">
              <p className="text-lg font-bold">Payment #{selectedImage.paymentNumber}</p>
              <p className="text-sm text-gray-400">Paid: ₱{(selectedImage.amountPaid || 0).toLocaleString()} • {selectedImage.paidDate}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 2. MAIN LOAN DETAILS COMPONENT
// ============================================================================
export const LoanDetails = ({
  loan,
  payments = [],
  onBack,
  onRecordPayment,
  onUpdateLoan,
  onDelete, // NEW: Added onDelete prop
}) => {
  const [showPaymentRecorder, setShowPaymentRecorder] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showAgreement, setShowAgreement] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const stats = useMemo(() => getLoanStats(loan, payments), [loan, payments]);

  const paymentSchedule = useMemo(() => {
    return stats.schedule.map((item) => {
      const recorded = payments.find(
        (p) => p.loanId === loan.id && p.paymentNumber === item.paymentNumber && p.isPaid
      );
      return {
        id: recorded?.id || `sched-${item.paymentNumber}`,
        loanId: loan.id,
        paymentNumber: item.paymentNumber,
        dueDate: item.dueDate,
        amountDue: item.totalAmount,
        amountPaid: recorded?.amountPaid || 0,
        paidDate: recorded?.paidDate || "",
        isPaid: !!recorded?.isPaid,
        isOverdue: item.isPastDue,
        penalty: item.penalty, 
        receiptPhoto: recorded?.receiptPhoto,
        notes: recorded?.notes,
      };
    });
  }, [loan, stats, payments]);

  const handleAddPhotoFromGallery = (photoUrl: string) => {
    setShowGallery(false);
    const nextUnpaid = paymentSchedule.find(p => !p.isPaid);
    if (nextUnpaid) {
      setSelectedPayment({ ...nextUnpaid, receiptPhoto: photoUrl });
      setShowPaymentRecorder(true);
    } else {
      alert("All scheduled payments are already paid!");
    }
  };

  // NEW: Handle Delete Logic
  const handleDeleteLoan = () => {
    if (confirm(`Are you sure you want to delete the loan for ${loan.customerName}? \n\nThis action cannot be undone.`)) {
      if (onDelete) {
        onDelete(loan.id);
      } else {
        alert("Delete function not connected.");
      }
    }
  };

  if (isEditing)
    return (
      <LoanEditForm
        loan={loan}
        onSave={(updatedLoan) => {
          onUpdateLoan(updatedLoan);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );

  if (showPaymentRecorder && selectedPayment)
    return (
      <PaymentRecorder
        payment={selectedPayment}
        onSubmit={(data) => {
          onRecordPayment(data);
          setShowPaymentRecorder(false);
        }}
        onCancel={() => setShowPaymentRecorder(false)}
      />
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER */}
      <div className={`text-white p-6 ${stats.status === 'overdue' ? 'bg-red-700' : 'bg-blue-600'}`}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full transition">
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="flex gap-2">
            {/* NEW DELETE BUTTON */}
            <button
              onClick={handleDeleteLoan}
              className="bg-red-500/30 hover:bg-red-500/50 px-3 py-2 rounded-lg text-white transition flex items-center justify-center"
              title="Delete Loan"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsEditing(true)}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
            >
              <Edit className="w-4 h-4" /> Edit
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-1">{loan.customerName}</h1>
        <div className="flex items-center gap-2 text-blue-100 text-sm">
           <span>Loan #{loan.id.slice(0, 8)}</span>
           <span className="bg-white/20 px-2 py-0.5 rounded text-xs uppercase font-bold">{stats.status}</span>
        </div>

        {/* SUMMARY */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <p className="text-blue-100 text-xs mb-1 uppercase tracking-wider">Total Loan</p>
            <p className="text-xl font-bold">₱{loan.totalAmount.toLocaleString()}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <p className="text-blue-100 text-xs mb-1 uppercase tracking-wider">Outstanding</p>
            <p className="text-xl font-bold">₱{stats.outstanding.toLocaleString()}</p>
          </div>
        </div>

        {stats.totalPenalties > 0 && (
          <div className="mt-3 bg-red-900/30 rounded-xl p-3 border border-red-400/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-200" />
              <p className="text-red-100 text-sm font-semibold">Accumulated Penalties</p>
            </div>
            <p className="text-lg font-bold text-red-50">
              ₱{stats.totalPenalties.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-4">
        {/* Loan Info Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Loan Terms</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs">Principal</p>
              <p className="font-semibold text-gray-900">₱{loan.amountBorrowed.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Interest (Flat)</p>
              <p className="font-semibold text-gray-900">{loan.interestRate}%</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Schedule</p>
              <p className="font-semibold text-gray-900 capitalize">{loan.paymentInterval || loan.paymentFrequency}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Term Length</p>
              <p className="font-semibold text-gray-900">{loan.termLength} payments</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Start Date</p>
              <p className="font-semibold text-gray-900">{loan.startDate}</p>
            </div>
          </div>
        </div>

        {/* --- RECEIPT GALLERY BUTTON --- */}
        <button
          onClick={() => setShowGallery(true)}
          className="w-full bg-white rounded-xl p-4 shadow-sm flex justify-between items-center border border-gray-100 active:bg-gray-50 hover:bg-gray-50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <ImageIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <span className="block font-semibold text-gray-700">Receipt Gallery</span>
              <span className="text-gray-400 text-xs">
                {payments.filter(p => p.receiptPhoto).length} Photos • Tap to view/add
              </span>
            </div>
          </div>
          <div className="bg-gray-100 p-2 rounded-full">
            <Plus className="w-4 h-4 text-gray-400" />
          </div>
        </button>

        {/* Agreement Button */}
        {loan.agreementPhoto && (
          <>
            <button
              onClick={() => setShowAgreement(!showAgreement)}
              className="w-full bg-white rounded-xl p-4 shadow-sm flex justify-between items-center border border-gray-100 active:bg-gray-50 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-700">View Loan Agreement</span>
              </div>
              <span className="text-blue-600 text-sm">{showAgreement ? 'Hide' : 'View'}</span>
            </button>

            {showAgreement && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <img src={loan.agreementPhoto} className="w-full rounded-lg" alt="agreement" />
              </div>
            )}
          </>
        )}

        {/* Payment Schedule */}
        <PaymentScheduleView
          payments={paymentSchedule}
          onRecordPayment={(p) => {
            setSelectedPayment(p);
            setShowPaymentRecorder(true);
          }}
        />

        {/* History */}
        <PaymentHistory payments={payments.filter(p => p.loanId === loan.id)} />

        {/* --- RENDER GALLERY MODAL --- */}
        {showGallery && (
          <ReceiptGallery 
            payments={payments} 
            onClose={() => setShowGallery(false)}
            onAddPhoto={handleAddPhotoFromGallery} 
          />
        )}
      </div>
    </div>
  );
};
