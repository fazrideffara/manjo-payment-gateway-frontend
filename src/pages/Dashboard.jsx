import React, { useState, useMemo, useEffect } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useStats } from '../hooks/useStats';
import StatusBadge from '../components/common/StatusBadge';
import Toast from '../components/common/Toast';
import { 
  Search, RotateCcw, Filter, TrendingUp, CheckCircle, Clock, 
  AlertCircle, CreditCard, Landmark, QrCode, Plus, ChevronRight,
  Wallet, Activity, X, Check, Zap, SlidersHorizontal, ListFilter,
  User as UserIcon, Calendar, Building, Hash, ArrowRightLeft, ShieldCheck,
  AlertTriangle, ExternalLink, Info, ChevronLeft, Bell
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../api/axios';
import { generateHmac } from '../utils/crypto';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showSimulasi, setShowSimulasi] = useState(false);
  const [generatedQr, setGeneratedQr] = useState(null);
  const [simAmount, setSimAmount] = useState('50000');
  const [merchantName, setMerchantName] = useState('MANJO');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [toast, setToast] = useState(null);
  
  const { data, isLoading, isError, refetch } = useTransactions({ 
    page: currentPage, 
    size: 10, 
    status: statusFilter 
  });
  const { data: stats, isError: isStatsError, refetch: refetchStats } = useStats();

  const showNotification = (message, type = 'success', detail = '', addToHistory = true) => {
    setToast({ message, type, detail });
    
    if (addToHistory) {
      const history = JSON.parse(localStorage.getItem('notif_history') || '[]');
      const newNotif = { 
        id: Date.now(), 
        message, 
        type, 
        detail, 
        time: new Date().toISOString(),
        read: false 
      };
      localStorage.setItem('notif_history', JSON.stringify([newNotif, ...history].slice(0, 20)));
      window.dispatchEvent(new Event('new_notification'));
    }
  };

  const filteredTransactions = useMemo(() => {
    if (!data || !data.content) return [];
    return data.content.filter(trx => {
      const searchStr = searchQuery.toLowerCase();
      return (
        trx.referenceNumber?.toLowerCase().includes(searchStr) || 
        trx.partnerReferenceNumber?.toLowerCase().includes(searchStr) ||
        trx.merchantId?.toLowerCase().includes(searchStr) ||
        trx.merchantName?.toLowerCase().includes(searchStr)
      );
    });
  }, [data, searchQuery]);

  const handleFullRefresh = async () => {
    setLoading(true);
    await Promise.all([refetch(), refetchStats()]);
    setLoading(false);
    showNotification("Dashboard diperbarui", "success", "Data transaksi terbaru telah dimuat.", false);
  };

  const handleSimulateCallback = async (refNo, status, amount, mName) => {
    try {
      setLoading(true);
      const payload = refNo + amount + status;
      const signature = await generateHmac(payload);
      await api.post('/v1/qr/payment', {
        originalReferenceNo: refNo,
        originalPartnerReferenceNo: "PARTNER-" + refNo,
        transactionStatusDesc: status,
        paidTime: new Date().toISOString(),
        amount: { value: amount.toString(), currency: "IDR" }
      }, { headers: { 'X-Signature': signature } });
      
      setShowSimulasi(false);
      const formattedAmount = `Rp ${parseInt(amount).toLocaleString()}`;
      
      if (status.toUpperCase() === 'SUCCESS') {
        showNotification("Pembayaran Berhasil", "success", `${formattedAmount} untuk ${mName} telah diterima.`);
      } else {
        showNotification("Pembayaran Gagal", "error", `Transaksi ${formattedAmount} untuk ${mName} ditolak.`);
      }
      
      await handleFullRefresh();
    } catch (error) {
      showNotification("Simulasi Gagal", "error", "Gagal mengirim callback simulasi.", false);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const partnerRef = "SIM-" + Math.floor(Math.random() * 1000000000);
      const merchantId = "MANJO-001";
      const payload = merchantId + simAmount + partnerRef;
      const signature = await generateHmac(payload);

      const response = await api.post('/v1/qr/generate', {
        merchantId: merchantId,
        partnerReferenceNo: partnerRef,
        amount: { value: simAmount, currency: "IDR" },
        paymentMethod: "QR",
        merchantName: merchantName,
        mpan: "ID-MPAN-" + Math.floor(Math.random() * 1000000),
        callbackUrl: "http://localhost:5173/callback-test"
      }, { headers: { 'X-Signature': signature } });

      setGeneratedQr(response.data);
      showNotification("QR Berhasil Dibuat", "success", `QR Senilai Rp ${parseInt(simAmount).toLocaleString()} untuk ${merchantName}.`);
      await handleFullRefresh();
    } catch (error) {
      showNotification("Gagal Generate QR", "error", "Terjadi kesalahan saat membuat QR.", false);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (trx) => {
    if (trx.status === 'PENDING') {
      const qrPlaceholder = "00020101021226620015ID.CO.MANJO.WWW01189360085801751859910210EP278421820303UMI51530014ID.CO.QRIS.WWW0215ID102106515" + trx.referenceNumber;
      setGeneratedQr({
        referenceNo: trx.referenceNumber,
        qrContent: qrPlaceholder,
        amount: { value: trx.amount.toString() }
      });
      setSimAmount(trx.amount.toString());
      setMerchantName(trx.merchantName);
      setShowSimulasi(true);
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 space-y-8 font-sans text-slate-800 relative">
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          detail={toast.detail} 
          onClose={() => setToast(null)} 
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payment Gateway</h1>
          <p className="text-slate-500 font-medium mt-1">
            <span className="bg-manjo-navy text-white px-2 py-0.5 rounded mr-2 text-[10px] font-black uppercase tracking-widest">ADMIN</span>
            Monitoring Transaction Compliance
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => { setGeneratedQr(null); setShowSimulasi(true); }}
            className="bg-manjo-green text-white px-6 py-3 rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Generate QR
          </button>
          <button onClick={handleFullRefresh} disabled={loading} className="bg-white text-slate-600 p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
            <RotateCcw size={20} className={loading ? 'animate-spin text-manjo-green' : ''} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Wallet className="text-white"/>} bg="bg-manjo-green" label="Gross Revenue" value={stats?.totalRevenue || "Rp 0"} trend="Live" />
        <StatCard icon={<Activity className="text-manjo-green"/>} bg="bg-white" label="Active Trx" value={stats?.activeTransactions || "0"} trend="Pending" />
        <StatCard icon={<CheckCircle className="text-manjo-green"/>} bg="bg-white" label="Success Rate" value={stats?.successRate || "0%"} trend="Rate" />
        <StatCard icon={<ShieldCheck className="text-manjo-green"/>} bg="bg-white" label="Settlement Ready" value={stats?.settlementVolume || "Rp 0"} trend="MDR 0.7%" />
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-2 rounded-3xl border border-slate-100 shadow-sm w-full">
          <div className="flex-1 w-full relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" placeholder="Cari di halaman ini..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-transparent outline-none font-bold text-slate-700 placeholder:text-slate-300"
            />
          </div>
          <div className="flex w-full md:w-auto bg-slate-50 p-1.5 rounded-2xl gap-1 overflow-x-auto no-scrollbar">
            <FilterTab active={statusFilter === 'ALL'} label="ALL" onClick={() => { setStatusFilter('ALL'); setCurrentPage(0); }} />
            <FilterTab active={statusFilter === 'SUCCESS'} label="SUCCESS" color="text-green-600" onClick={() => { setStatusFilter('SUCCESS'); setCurrentPage(0); }} />
            <FilterTab active={statusFilter === 'PENDING'} label="PENDING" color="text-amber-600" onClick={() => { setStatusFilter('PENDING'); setCurrentPage(0); }} />
            <FilterTab active={statusFilter === 'CANCELLED'} label="CANCELLED" color="text-red-600" onClick={() => { setStatusFilter('CANCELLED'); setCurrentPage(0); }} />
            <FilterTab active={statusFilter === 'EXPIRED'} label="EXPIRED" color="text-slate-600" onClick={() => { setStatusFilter('EXPIRED'); setCurrentPage(0); }} />
            <FilterTab active={statusFilter === 'FAILED'} label="FAILED" color="text-red-700" onClick={() => { setStatusFilter('FAILED'); setCurrentPage(0); }} />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-white overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-900">Transaction Records</h2>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <Info size={14} className="text-manjo-green"/> Klik baris untuk review QR
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-black bg-slate-50/50">
                  <th className="px-8 py-5">Merchant Info</th>
                  <th className="px-8 py-5">Identification Details</th>
                  <th className="px-8 py-5">Transaction Timeline</th>
                  <th className="px-8 py-5 text-right">Amount</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-center">Simulate Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr><td colSpan="6" className="p-20 text-center font-bold text-slate-300">Loading transactions...</td></tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr><td colSpan="6" className="p-20 text-center font-bold text-slate-300">Data tidak ditemukan.</td></tr>
                ) : filteredTransactions.map(trx => (
                  <tr 
                    key={trx.id} 
                    onClick={() => handleRowClick(trx)}
                    className={`group hover:bg-slate-50 transition-all cursor-pointer ${trx.status === 'PENDING' ? 'hover:ring-1 hover:ring-manjo-green/20' : ''}`}
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-base">{trx.merchantName || 'MANJO'}</span>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">MID: {trx.merchantId}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="grid grid-cols-1 gap-1">
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black text-slate-300 uppercase w-12">TRX ID</span>
                          <span className="text-xs font-black text-slate-700">{trx.partnerReferenceNumber}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black text-slate-300 uppercase w-12">REF NO</span>
                          <span className="text-xs font-bold text-manjo-navy">{trx.referenceNumber}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="grid grid-cols-1 gap-1.5">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-300 uppercase">Created</span>
                          <span className="text-[11px] font-bold text-slate-600">{formatDateTime(trx.transactionDate)}</span>
                        </div>
                        {trx.status === 'SUCCESS' && trx.paidDate && (
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-green-300 uppercase">Settled</span>
                            <span className="text-[11px] font-bold text-green-600">{formatDateTime(trx.paidDate)}</span>
                          </div>
                        )}
                        {trx.status === 'PENDING' && (
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-red-200 uppercase">Expires</span>
                            <span className="text-[11px] font-bold text-red-400">{formatDateTime(trx.expiryDate)}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <span className="font-black text-slate-900 text-lg">Rp {trx.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6"><StatusBadge status={trx.status} /></td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                         {trx.status === 'PENDING' ? (
                          <>
                            <button 
                              onClick={() => handleSimulateCallback(trx.referenceNumber, 'SUCCESS', trx.amount, trx.merchantName)} 
                              title="Simulate Success" 
                              className="w-10 h-10 bg-green-50 text-manjo-green rounded-xl flex items-center justify-center hover:bg-manjo-green hover:text-white transition-all shadow-sm"
                            >
                              <Check size={18}/>
                            </button>
                            <button 
                              onClick={() => handleSimulateCallback(trx.referenceNumber, 'CANCELLED', trx.amount, trx.merchantName)} 
                              title="Simulate Cancel" 
                              className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            >
                              <X size={18}/>
                            </button>
                            <button 
                              onClick={() => handleSimulateCallback(trx.referenceNumber, 'FAILED', trx.amount, trx.merchantName)} 
                              title="Simulate Failure" 
                              className="w-10 h-10 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all shadow-sm"
                            >
                              <AlertTriangle size={18}/>
                            </button>
                          </>
                        ) : (
                          <div className="w-10 h-10 bg-slate-50 text-slate-200 rounded-xl flex items-center justify-center mx-auto opacity-40"><Check size={18}/></div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {data && data.totalPages > 1 && (
            <div className="p-8 bg-slate-50/50 flex items-center justify-between border-t border-slate-50">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 Halaman {data.number + 1} dari {data.totalPages} — Total {data.totalElements} Data
               </p>
               <div className="flex gap-2">
                 <button 
                   disabled={data.first}
                   onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                   className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
                 >
                   <ChevronLeft size={20}/>
                 </button>
                 <button 
                   disabled={data.last}
                   onClick={() => setCurrentPage(prev => prev + 1)}
                   className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
                 >
                   <ChevronRight size={20}/>
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal QR */}
      {showSimulasi && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl relative animate-in zoom-in duration-300">
            <button onClick={() => setShowSimulasi(false)} className="absolute right-8 top-8 text-slate-400 hover:text-red-500 transition-colors"><X size={28}/></button>
            <div className="bg-manjo-navy p-12 text-white">
              <div className="flex items-center gap-3 mb-2">
                <QrCode size={24} className="text-manjo-green"/>
                <h2 className="text-3xl font-black italic text-white tracking-tighter">Detail QR</h2>
              </div>
              <p className="opacity-60 text-sm font-medium">Review atau simulasikan pembayaran.</p>
            </div>
            <div className="p-12 space-y-8">
              {!generatedQr ? (
                <>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nama Merchant</label>
                      <input 
                        type="text" value={merchantName} onChange={(e) => setMerchantName(e.target.value)} 
                        className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-manjo-green focus:bg-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nominal</label>
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300 text-xl">Rp</span>
                        <input type="number" value={simAmount} onChange={(e) => setSimAmount(e.target.value)} className="w-full pl-16 pr-6 py-6 bg-slate-50 rounded-[2rem] font-black text-3xl outline-none border-2 border-transparent focus:border-manjo-green focus:bg-white transition-all shadow-inner" />
                      </div>
                    </div>
                  </div>
                  <button onClick={handleGenerate} disabled={loading} className="w-full bg-manjo-green text-white py-6 rounded-[2rem] font-black text-xl shadow-xl shadow-manjo-green/20 hover:scale-[1.02] transition-all">Generate QR</button>
                </>
              ) : (
                <div className="flex flex-col items-center text-center space-y-8">
                  <div className="p-8 bg-white border-[3px] border-slate-50 rounded-[3rem] shadow-xl"><QRCodeSVG value={generatedQr.qrContent} size={180} /></div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">MERCHANT: {merchantName}</p>
                    <p className="text-2xl font-black text-slate-900">Rp {parseInt(generatedQr.amount?.value || simAmount).toLocaleString()}</p>
                    <p className="text-xs font-bold text-manjo-green">REF: {generatedQr.referenceNo}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 w-full">
                    <button onClick={() => handleSimulateCallback(generatedQr.referenceNo, "SUCCESS", generatedQr.amount?.value || simAmount, merchantName)} disabled={loading} className="bg-manjo-green text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg hover:bg-green-600 transition-all text-sm">
                      <Check size={18}/> BAYAR
                    </button>
                    <button onClick={() => handleSimulateCallback(generatedQr.referenceNo, "CANCELLED", generatedQr.amount?.value || simAmount, merchantName)} disabled={loading} className="bg-red-500 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg hover:bg-red-600 transition-all text-sm">
                      <X size={18}/> BATAL
                    </button>
                    <button onClick={() => handleSimulateCallback(generatedQr.referenceNo, "FAILED", generatedQr.amount?.value || simAmount, merchantName)} disabled={loading} className="bg-slate-700 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg hover:bg-slate-800 transition-all text-sm">
                      <AlertTriangle size={18}/> GAGAL
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterTab({ active, label, onClick, color = "text-slate-500" }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all flex-1 whitespace-nowrap ${active ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-100' : `${color} opacity-60 hover:opacity-100`}`}>{label}</button>
  );
}

function StatCard({ icon, bg, label, value, trend }) {
  const isDark = bg === 'bg-manjo-green';
  return (
    <div className={`${bg} p-8 rounded-[3rem] shadow-xl border border-white group hover:-translate-y-2 transition-all duration-300`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${isDark ? 'bg-white/20' : 'bg-manjo-green/10'}`}>{icon}</div>
      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDark ? 'text-white/60' : 'text-slate-400'}`}>{label}</p>
      <div className="flex items-end justify-between">
        <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</p>
        <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl ${isDark ? 'bg-white/20 text-white' : 'bg-green-50 text-manjo-green border border-green-100'}`}>{trend}</span>
      </div>
    </div>
  );
}
