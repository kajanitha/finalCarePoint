import React from 'react';
import AppLayout from '../layouts/app-layout';

interface ClinicDetailsProps {
  clinic: {
    id: string;
    name: string;
    location: string;
    description: string;
  };
}

const ClinicDetails: React.FC<ClinicDetailsProps> = ({ clinic }) => {
  return (
    <AppLayout>
      <h1>Clinic Details</h1>
      <h2>{clinic.name}</h2>
      <p>Location: {clinic.location}</p>
      <p>{clinic.description}</p>
    </AppLayout>
  );
};

export default ClinicDetails;
