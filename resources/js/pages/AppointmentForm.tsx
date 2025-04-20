import React, { useState } from 'react';
import AppLayout from '../layouts/app-layout';

const AppointmentForm: React.FC = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    clinic: '',
    date: '',
    time: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Appointment booked successfully!');
  };

  return (
    <AppLayout>
      <h1>Book an Appointment</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="patientName">Patient Name:</label>
          <input
            type="text"
            id="patientName"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="clinic">Clinic:</label>
          <input
            type="text"
            id="clinic"
            name="clinic"
            value={formData.clinic}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="time">Time:</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Book Appointment</button>
      </form>
    </AppLayout>
  );
};

export default AppointmentForm;
