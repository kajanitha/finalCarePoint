import { Head } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import AppLayout from '../layouts/app-layout';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Check-in Patient', href: '/doctor/appointments' },
];

const CheckInPatientModal: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState<any[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
    const [appointment, setAppointment] = useState<any | null>(null);
    const [contactNumber, setContactNumber] = useState('');
    const [paymentCollected, setPaymentCollected] = useState(false);
    const [triageNotes, setTriageNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (searchTerm.length >= 3) {
            axios
                .get('/api/patients/search', { params: { q: searchTerm } })
                .then((res) => setPatients(res.data))
                .catch(() => setPatients([]));
        } else {
            setPatients([]);
        }
    }, [searchTerm]);

    useEffect(() => {
        if (selectedPatient) {
            axios
                .get(`/api/appointments/upcoming/${selectedPatient.id}`)
                .then((res) => {
                    setAppointment(res.data);
                    setContactNumber(selectedPatient.contact_number || '');
                    setPaymentCollected(false);
                    setTriageNotes('');
                    setErrors({});
                    setSuccessMessage('');
                })
                .catch(() => {
                    setAppointment(null);
                });
        } else {
            setAppointment(null);
            setContactNumber('');
            setPaymentCollected(false);
            setTriageNotes('');
            setErrors({});
            setSuccessMessage('');
        }
    }, [selectedPatient]);

    const handleCheckIn = async () => {
        if (!selectedPatient || !appointment) {
            setErrors({ api: 'Please select a patient with an upcoming appointment.' });
            return;
        }

        setLoading(true);
        setErrors({});
        setSuccessMessage('');

        try {
            await axios.post(
                `/api/appointments/checkin/${appointment.id}`,
                {
                    contact_number: contactNumber,
                    payment_collected: paymentCollected,
                    triage_notes: triageNotes,
                },
                { headers: { 'Content-Type': 'application/json' } },
            );
            setSuccessMessage('Patient checked in successfully!');
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.errors) {
                const apiErrors = error.response.data.errors;
                const formattedErrors: { [key: string]: string } = {};
                for (const key in apiErrors) {
                    formattedErrors[key] = apiErrors[key][0];
                }
                setErrors(formattedErrors);
            } else {
                setErrors({ api: 'Failed to check in patient. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Check-in Patient" />
            <Card className="mx-auto mt-10 w-196 p-8">
                <h1 className="mb-4 text-2xl font-bold">Check-in Patient</h1>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="search">Patient Name or NIC</Label>
                        <Input
                            id="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Enter patient name or NIC"
                            className="input w-full bg-blue-50"
                        />
                        {patients.length > 0 && (
                            <ul className="mt-1 max-h-40 overflow-auto rounded border">
                                {patients.map((patient) => (
                                    <li
                                        key={patient.id}
                                        className={`cursor-pointer p-2 ${selectedPatient?.id === patient.id ? 'bg-blue-200' : ''}`}
                                        onClick={() => setSelectedPatient(patient)}
                                    >
                                        {patient.full_name} - {patient.nic}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {appointment && (
                        <>
                            <div>
                                <Label>Appointment Date</Label>
                                <p>{new Date(appointment.appointment_datetime).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <Label>Appointment Time</Label>
                                <p>{new Date(appointment.appointment_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <div>
                                <Label htmlFor="contact_number">Update Contact Number</Label>
                                <Input id="contact_number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
                                {errors.contact_number && <p className="text-red-600">{errors.contact_number}</p>}
                            </div>
                            <div>
                                <Label htmlFor="payment_collected">
                                    <input
                                        type="checkbox"
                                        id="payment_collected"
                                        checked={paymentCollected}
                                        onChange={(e) => setPaymentCollected(e.target.checked)}
                                    />{' '}
                                    Payment Collected
                                </Label>
                            </div>
                            <div>
                                <Label htmlFor="triage_notes">Triage Notes</Label>
                                <textarea id="triage_notes" value={triageNotes} onChange={(e) => setTriageNotes(e.target.value)} className="input" />
                            </div>
                            {errors.api && <p className="text-red-600">{errors.api}</p>}
                            {successMessage && <p className="text-green-600">{successMessage}</p>}
                            <div className="flex gap-2">
                                <Button onClick={handleCheckIn} disabled={loading}>
                                    {loading ? 'Checking in...' : 'Confirm Check-in'}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </Card>
        </AppLayout>
    );
};

export default CheckInPatientModal;
