// frontend/components/TicketModal.tsx
'use client';

import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface TicketProps {
  booking: any;
  onClose: () => void;
}

export default function TicketModal({ booking, onClose }: TicketProps) {
  const ticketRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!ticketRef.current) return;

    try {
      // Step 1: Capture the element as a canvas
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff", 
        logging: false,
        
        onclone: (clonedDoc) => {
          const ticket = clonedDoc.getElementById('ticket-pdf-content');
          if (ticket) {
            ticket.style.display = 'block';
            ticket.style.color = '#000000';
          }
        }
      });
      
      // Step 2: Convert to PDF
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      
      pdf.addImage(imgData, 'JPEG', 15, 15, 180, 0); 
      pdf.save(`Ticket-${booking.id}.pdf`);
      
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Error: Your browser is using a new CSS color system (LAB/OKLCH) that is not supported for PDF. Please try a different browser or wait for update.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[9999] backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        
        {/* PDF Content - Pure Inline Styles only to avoid LAB/OKLCH errors */}
        <div 
          id="ticket-pdf-content"
          ref={ticketRef} 
          style={{ 
            backgroundColor: '#ffffff', 
            padding: '40px', 
            fontFamily: 'Arial, sans-serif',
            width: '400px', 
            margin: '0 auto'
          }}
        >
          <div style={{ textAlign: 'center', borderBottom: '3px solid #2563eb', paddingBottom: '20px', marginBottom: '30px' }}>
            <h1 style={{ color: '#2563eb', fontSize: '28px', fontWeight: 'bold', margin: '0', textTransform: 'uppercase' }}>
              Event Ticket
            </h1>
            <p style={{ color: '#666666', fontSize: '14px', margin: '5px 0 0 0' }}>
              Booking ID: #{booking.id}
            </p>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <p style={{ color: '#999999', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Event Name</p>
            <h2 style={{ color: '#111111', fontSize: '22px', fontWeight: 'bold', margin: '0', lineHeight: '1.2' }}>
              {booking.event.title}
            </h2>
          </div>

          <div style={{ display: 'flex', borderTop: '1px solid #eeeeee', paddingTop: '20px', marginBottom: '30px' }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#999999', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0' }}>Date</p>
              <p style={{ color: '#333333', fontSize: '14px', fontWeight: 'bold', margin: '5px 0 0 0' }}>
                {new Date(booking.event.date).toLocaleDateString('en-GB')}
              </p>
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <p style={{ color: '#999999', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0' }}>Location</p>
              <p style={{ color: '#333333', fontSize: '14px', fontWeight: 'bold', margin: '5px 0 0 0' }}>
                {booking.event.location}
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#ffffff', border: '1px solid #f0f0f0', borderRadius: '15px' }}>
            <div style={{ display: 'inline-block' }}>
              <QRCodeSVG value={`VERIFY-ID-${booking.id}`} size={160} level="H" bgColor="#ffffff" fgColor="#000000" />
            </div>
            <p style={{ color: '#888888', fontSize: '11px', marginTop: '15px' }}>Scan at the entrance</p>
          </div>
        </div>

        {/* Modal Controls - These stay outside the PDF ref */}
        <div className="flex p-6 gap-4 bg-gray-50 border-t border-gray-100">
          <button 
            onClick={downloadPDF} 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
          >
            Download PDF
          </button>
          <button 
            onClick={onClose} 
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-bold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
