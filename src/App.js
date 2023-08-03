import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import QRCode from 'qrcode.react';
import './App.css';
import jsPDF from 'jspdf';
import backgroundImg from './assets/background.png';

function App() {
  const { register, handleSubmit, reset } = useForm();
  const [id, setID] = useState('');
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [batch, setBatch] = useState('');
  const [createdAt, setCreatedAt] = useState('');

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('https://mmamc-api-college.onrender.com/api/students', {
        ...data
      });
      console.log(response.data);
      setID(response.data._id);
      setName(response.data.name);
      setRollNo(response.data.RollNo);
      setBatch(response.data.Batch);
      setCreatedAt(response.data.createdAt);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = async () => {
  // Show a custom modal with a friendly message to the user
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <h2 class="modal-title">Generating ID Card</h2>
      <p class="modal-message">Please wait for a moment while your ID Card is being created...</p>
    </div>
  `;
  document.body.appendChild(modal);

  // Create a new PDF document
  const pdfDoc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    compress: true,
  });

  const qrCodeSize = 80;
  const qrCodeX = 65;
  const qrCodeY = 40;

  // Load the background image
  const img = new Image();
  img.src = backgroundImg;
  await new Promise(resolve => { img.onload = resolve; });

  // Add ID card background
  pdfDoc.addImage(img, 'JPEG', 0, 0, 210, 297);

  // Add the QR code image to the PDF document
  const canvas = document.querySelector("canvas");
  const qrCodeDataURL = canvas.toDataURL("image/png");
  pdfDoc.addImage(qrCodeDataURL, "PNG", qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);

  // Add student's name to the PDF document
  pdfDoc.setFont('Montserrat', 'bold');
  pdfDoc.setFontSize(22);
  pdfDoc.setTextColor('#1D222A');
  pdfDoc.text(name, 105, 32.5, { align: 'center', maxWidth: 100 });

  // Add roll number and batch to the PDF document
  pdfDoc.setFontSize(23);
  pdfDoc.setTextColor('#1D222A');
  pdfDoc.text(`Roll No: ${rollNo}`, 105, 132, { align: 'center', maxWidth: 100 });
  pdfDoc.setTextColor('#1D222A');
  pdfDoc.text(`CreatedAT: ${createdAt}`, 105, 142, { align: 'center', maxWidth: 100 });
  pdfDoc.setFontSize(45);
  pdfDoc.setTextColor('#1D222A');
  pdfDoc.text(`Batch: ${batch}`, 105, 170, { align: 'center', maxWidth: 100 });

  // Save the PDF with the person's name
  pdfDoc.save(`bca_association_${name}.pdf`);

  // Remove the modal after a brief delay (1 second)
  setTimeout(() => {
    document.body.removeChild(modal);
  }, 1000);
};

  const handleInputChange = (event) => {
    event.target.value = event.target.value.toUpperCase();
  };

  return (
    <div className="container">
      <nav className="navbar">
        <h1 className="navbar-title">MMAMC BCA ASSOCIATION</h1>
        <h2 className="navbar-subtitle">eCardify</h2>
      </nav>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <input
          className="input"
          type="text"
          placeholder="Name"
          {...register('name', { required: true })}
          onInput={handleInputChange} // Convert input to uppercase
        />
        <input
          className="input"
          type="number"
          placeholder="RollNo"
          {...register('RollNo', { required: true })}
          onInput={handleInputChange} // Convert input to uppercase
        />
        <input
          className="input"
          type="text"
          placeholder="Batch"
          {...register('Batch', { required: true })}
          onInput={handleInputChange} // Convert input to uppercase
        />
        <button className="button" type="submit">Generate ID Card</button>
      </form>
      {/* Display the QR code */}
      {id && (
        <div className="qr-code-container">
          <div className="qr-code">
            <QRCode value={id} size={256} />
          </div>
          <button className="download-button" onClick={handleDownload}>
            Download QR Code
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
