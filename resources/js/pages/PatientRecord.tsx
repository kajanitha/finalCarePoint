import { usePage } from '@inertiajs/react';
import jsPDF from 'jspdf';
import React from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import AppLayout from '../layouts/app-layout';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Patient List', href: '/patients' },
    { title: 'Patient Record', href: '' },
];

interface Appointment {
    id: number;
    appointment_date: string;
    appointment_time: string;
    appointment_type: string;
    reason: string;
    notes?: string;
    status: string;
}

interface Patient {
    id: number;
    full_name: string;
    nic: string;
    date_of_birth: string;
    gender: string;
    street_address: string;
    city: string;
    district: string;
    province: string;
    contact_number: string;
    email_address?: string;
    marital_status?: string;
    emergency_contact_name?: string;
    emergency_contact_number?: string;
    emergency_contact_relationship?: string;
    blood_group?: string;
    known_allergies?: string;
    current_medications?: string;
    past_medical_history?: string;
    appointments?: Appointment[];
}

const PatientRecord: React.FC = () => {
    const { props } = usePage();
    const patient = props.patient as Patient | undefined;

    // Helper function to convert patient data to CSV string
    const convertToCSV = (obj: any) => {
        const array = [obj];
        const keys = Object.keys(obj);
        const csvRows = [];

        csvRows.push(keys.join(','));
        for (const row of array) {
            const values = keys.map((k) => {
                const escaped = ('' + (row[k] ?? '')).replace(/"/g, '\\"');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }
        return csvRows.join('\n');
    };

    // Export CSV file
    const exportCSV = () => {
        if (!patient) return;
        const csvData = convertToCSV(patient);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `patient_${patient.id}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Export PDF file using jsPDF
    const exportPDF = () => {
        if (!patient) return;
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Patient Record', 10, 10);
        doc.setFontSize(12);
        let y = 20;

        const addLine = (label: string, value: string) => {
            doc.text(`${label}: ${value}`, 10, y);
            y += 10;
        };

        addLine('Full Name', patient.full_name);
        addLine('NIC', patient.nic);
        addLine('Date of Birth', patient.date_of_birth);
        addLine('Gender', patient.gender);
        addLine('Address', `${patient.street_address}, ${patient.city}, ${patient.district}, ${patient.province}`);
        addLine('Contact Number', patient.contact_number);
        addLine('Email Address', patient.email_address || '');
        addLine('Marital Status', patient.marital_status || '');
        addLine('Emergency Contact Name', patient.emergency_contact_name || '');
        addLine('Emergency Contact Number', patient.emergency_contact_number || '');
        addLine('Emergency Contact Relationship', patient.emergency_contact_relationship || '');
        addLine('Blood Group', patient.blood_group || '');
        addLine('Known Allergies', patient.known_allergies || '');
        addLine('Current Medications', patient.current_medications || '');
        addLine('Past Medical History', patient.past_medical_history || '');
        doc.save(`patient_${patient.id}.pdf`);
    };

    if (!patient) {
        return (
            <AppLayout>
                <p className="mt-20 text-center text-lg text-gray-600">Patient not found.</p>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="mx-auto mt-12 w-196 rounded-lg bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
                    <h1 className="text-3xl font-extrabold tracking-wide text-blue-600">Patient Record</h1>
                    <div className="flex space-x-3">
                        <Button onClick={exportCSV} className="transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-700">
                            Export CSV
                        </Button>
                        <Button
                            onClick={exportPDF}
                            className="transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-700"
                        >
                            Export PDF
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-x-10 gap-y-6 text-gray-700 md:grid-cols-2">
                    {/* Basic Profile Information */}
                    <div>
                        <Label className="text-lg font-semibold text-gray-800">Full Name</Label>
                        <p className="mt-1 rounded-md bg-blue-50 p-3 text-base font-medium">{patient.full_name}</p>
                    </div>
                    <div>
                        <Label className="text-lg font-semibold text-gray-800">NIC</Label>
                        <p className="mt-1 rounded-md bg-blue-50 p-3 text-base font-medium">{patient.nic}</p>
                    </div>
                    <div>
                        <Label className="text-lg font-semibold text-gray-800">Date of Birth</Label>
                        <p className="mt-1 rounded-md bg-blue-50 p-3 text-base font-medium">{patient.date_of_birth}</p>
                    </div>
                    <div>
                        <Label className="text-lg font-semibold text-gray-800">Gender</Label>
                        <p className="mt-1 rounded-md bg-blue-50 p-3 text-base font-medium">{patient.gender}</p>
                    </div>
                    <div className="md:col-span-2">
                        <Label className="text-lg font-semibold text-gray-800">Address</Label>
                        <p className="mt-1 rounded-md bg-blue-50 p-3 text-base font-medium">
                            {`${patient.street_address}, ${patient.city}, ${patient.district}, ${patient.province}`}
                        </p>
                    </div>
                    <div>
                        <Label className="text-lg font-semibold text-gray-800">Contact Number</Label>
                        <p className="mt-1 rounded-md bg-blue-50 p-3 text-base font-medium">{patient.contact_number}</p>
                    </div>
                    <div>
                        <Label className="text-lg font-semibold text-gray-800">Email Address</Label>
                        <p className="mt-1 rounded-md bg-blue-50 p-3 text-base font-medium">{patient.email_address || '-'}</p>
                    </div>
                    <div>
                        <Label className="text-lg font-semibold text-gray-800">Marital Status</Label>
                        <p className="mt-1 rounded-md bg-blue-50 p-3 text-base font-medium">{patient.marital_status || '-'}</p>
                    </div>
                    <div>
                        <Label className="text-lg font-semibold text-gray-800">Emergency Contact Name</Label>
                        <p className="mt-1 rounded-md bg-blue-50 p-3 text-base font-medium">{patient.emergency_contact_name || '-'}</p>
                    </div>
                    <div>
                        <Label className="text-lg font-semibold text-gray-800">Emergency Contact Number</Label>
                        <p className="mt-1 rounded-md bg-blue-50 p-3 text-base font-medium">{patient.emergency_contact_number || '-'}</p>
                    </div>
                    <div>
                        <Label className="text-lg font-semibold text-gray-800">Emergency Contact Relationship</Label>
                        <p className="mt-1 rounded-md bg-blue-50 p-3 text-base font-medium">{patient.emergency_contact_relationship || '-'}</p>
                    </div>
                    <div>
                        <Label className="text-lg font-semibold text-gray-800">Blood Group</Label>
                        <p className="mt-1 rounded-md bg-blue-50 p-3 text-base font-medium">{patient.blood_group || '-'}</p>
                    </div>

                    {/* Known Allergies */}
                    <div className="md:col-span-2">
                        <Label className="text-lg font-semibold text-gray-800">Known Allergies</Label>
                        <p className="mt-1 rounded-md bg-blue-50 p-3 text-base font-medium whitespace-pre-wrap">{patient.known_allergies || '-'}</p>
                    </div>

                    {/* Current Medications */}
                    <div className="md:col-span-2">
                        <Label className="text-lg font-semibold text-gray-800">Current Medications</Label>
                        <p className="mt-1 rounded-md bg-blue-50 p-3 text-base font-medium whitespace-pre-wrap">
                            {patient.current_medications || '-'}
                        </p>
                    </div>

                    {/* Past Medical History */}
                    <div className="md:col-span-2">
                        <Label className="text-lg font-semibold text-gray-800">Past Medical History</Label>
                        <p className="mt-1 rounded-md bg-blue-50 p-3 text-base font-medium whitespace-pre-wrap">
                            {patient.past_medical_history || '-'}
                        </p>
                    </div>

                    {/* Diagnoses - Placeholder */}
                    <div className="md:col-span-2">
                        <Label className="text-lg font-semibold text-gray-800">Diagnoses</Label>
                        <p className="rounded-md bg-blue-50 p-3 text-base font-medium">No diagnoses data available.</p>
                    </div>

                    {/* Surgical Procedures - Placeholder */}
                    <div className="md:col-span-2">
                        <Label className="text-lg font-semibold text-gray-800">Surgical Procedures</Label>
                        <p className="rounded-md bg-blue-50 p-3 text-base font-medium">No surgical procedures data available.</p>
                    </div>

                    {/* Family Medical History - Placeholder */}
                    <div className="md:col-span-2">
                        <Label className="text-lg font-semibold text-gray-800">Family Medical History</Label>
                        <p className="rounded-md bg-blue-50 p-3 text-base font-medium">No family medical history data available.</p>
                    </div>

                    {/* Past Appointments */}
                    <div className="md:col-span-2">
                        <Label className="text-lg font-semibold text-gray-800">Past Appointments</Label>
                        {patient.appointments && patient.appointments.length > 0 ? (
                            <ul className="max-h-48 list-inside list-disc space-y-2 overflow-y-auto rounded-md bg-blue-50 p-2">
                                {patient.appointments.map((appt) => (
                                    <li key={appt.id} className="text-gray-800">
                                        <strong>{new Date(appt.appointment_date).toLocaleDateString()}</strong> - {appt.appointment_type} - Status:{' '}
                                        {appt.status}
                                        <br />
                                        Reason: {appt.reason}
                                        <br />
                                        Notes: {appt.notes || 'N/A'}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-base font-medium text-gray-600">No past appointments available.</p>
                        )}
                    </div>

                    {/* Investigation Results */}
                    <div className="md:col-span-2">
                        <Label className="text-lg font-semibold text-gray-800">Investigation Results</Label>
                        <p className="rounded-md bg-blue-50 p-3 text-base font-medium">No investigation results data available.</p>
                    </div>
                </div>
            </Card>
        </AppLayout>
    );
};

export default PatientRecord;
