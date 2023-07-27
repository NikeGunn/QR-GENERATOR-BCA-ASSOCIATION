import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import QRCode from 'qrcode.react';
import './App.css';

function App() {
  const { register, handleSubmit, reset } = useForm();
  const [id, setID] = useState('');

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('https://mmamc-api-college.onrender.com/api/students', {
        ...data
      });
      console.log(response.data);
      setID(response.data._id);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = () => {
    const canvas = document.querySelector("canvas");
    const qrCodeURL = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = qrCodeURL;
    downloadLink.download = "mmamcbca_qrcode.png";
    downloadLink.click();
  };

  const handleInputChange = (event) => {
    event.target.value = event.target.value.toUpperCase();
  };

  return (
    <div className="container">
      <nav className="navbar">
        <h1 className="navbar-title">MMAMC BCA ASSOCIATION </h1>
        <h2 className="navbar-subtitle">ID CARD GENERATOR </h2>
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
