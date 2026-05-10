import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', detail, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-8 right-8 z-[300] w-full max-w-sm overflow-hidden rounded-[2rem] shadow-2xl animate-in slide-in-from-bottom-full duration-500`}>
      <div className={`p-6 flex items-start gap-4 ${
        type === 'success' ? 'bg-manjo-green text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 'bg-manjo-navy text-white'
      }`}>
        <div className="bg-white/20 p-2 rounded-xl">
          {type === 'success' ? <CheckCircle size={24}/> : 
           type === 'error' ? <AlertTriangle size={24}/> : <Info size={24}/>}
        </div>
        <div className="flex-1">
          <p className="font-black text-lg tracking-tight leading-tight">{message}</p>
          {detail && <p className="text-sm font-medium opacity-80 mt-1">{detail}</p>}
        </div>
        <button onClick={onClose} className="opacity-40 hover:opacity-100 transition-opacity"><X size={20}/></button>
      </div>
      <div className={`h-1.5 bg-white/30 animate-progress origin-left`} />
    </div>
  );
}
