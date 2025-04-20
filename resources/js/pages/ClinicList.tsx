import React from 'react';
import AppLayout from '../layouts/app-layout';

const ClinicList: React.FC = () => {
  // Placeholder data, replace with API call or props
  const clinics = [
    { id: 1, name: 'Clinic One', location: 'Location One' },
    { id: 2, name: 'Clinic Two', location: 'Location Two' },
  ];

  return (
    <AppLayout>
      <h1>Clinic List</h1>
      <ul>
        {clinics.map((clinic) => (
          <li key={clinic.id}>
            {clinic.name} - {clinic.location}
          </li>
        ))}
      </ul>
    </AppLayout>
  );
};

export default ClinicList;
