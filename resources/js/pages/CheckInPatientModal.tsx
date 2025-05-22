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

interface Patient {
    id: number;
    full_name: string;
    nic: string;
    contact_number?: string;
}

interface Appointment {
    id: number;
    appointment_datetime: string;
}

interface AxiosErrorResponse {
    response: {
        data: {
            errors: {
                [key: string]: string[];
            };
        };
    };
}

const CheckInPatientModal: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [contactNumber, setContactNumber] = useState<string>('');
    const [paymentCollected, setPaymentCollected] = useState<boolean>(false);
    const [triageNotes, setTriageNotes] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [successMessage, setSuccessMessage] = useState<string>('');

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
        } catch (error: unknown) {
            const axiosError = error as AxiosErrorResponse;
            if (axiosError && axiosError.response && axiosError.response.data && axiosError.response.data.errors) {
                const apiErrors = axiosError.response.data.errors;
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
            <Card className="mx-auto mt-12 max-w-4xl rounded-lg bg-white p-10 shadow-lg">
                <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-blue-600">Check-in Patient</h1>
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="search" className="text-lg font-semibold text-gray-700">
                            Patient Name or NIC
                        </Label>
                        <Input
                            id="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Enter patient name or NIC"
                            className="w-full rounded-md border border-gray-300 bg-blue-50 transition duration-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        {patients.length > 0 && (
                            <ul className="mt-2 max-h-48 overflow-auto rounded-md border border-gray-300 bg-white shadow-sm">
                                {patients.map((patient) => (
                                    <li
                                        key={patient.id}
                                        className={`cursor-pointer rounded-md p-3 text-gray-800 transition-colors hover:bg-blue-100 ${
                                            selectedPatient?.id === patient.id ? 'bg-blue-200 font-semibold' : ''
                                        }`}
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
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <Label className="text-md font-medium text-gray-700">Appointment Date</Label>
                                    <p className="mt-1 font-semibold text-gray-900">
                                        {new Date(appointment.appointment_datetime).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-md font-medium text-gray-700">Appointment Time</Label>
                                    <p className="mt-1 font-semibold text-gray-900">
                                        {new Date(appointment.appointment_datetime).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6">
                                <Label htmlFor="contact_number" className="text-md font-medium text-gray-700">
                                    Update Contact Number
                                </Label>
                                <Input
                                    id="contact_number"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                    className="mt-1 w-full rounded-md border border-gray-300 transition duration-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                                {errors.contact_number && <p className="mt-1 text-sm text-red-600">{errors.contact_number}</p>}
                            </div>
                            <div className="mt-4 flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="payment_collected"
                                    checked={paymentCollected}
                                    onChange={(e) => setPaymentCollected(e.target.checked)}
                                    className="h-5 w-5 rounded border-gray-300 text-blue-600 transition duration-300 focus:ring-blue-500"
                                />
                                <Label htmlFor="payment_collected" className="text-md cursor-pointer font-medium text-gray-700 select-none">
                                    Payment Collected
                                </Label>
                            </div>
                            <div className="mt-4">
                                <Label htmlFor="triage_notes" className="text-md font-medium text-gray-700">
                                    Triage Notes
                                </Label>
                                <textarea
                                    id="triage_notes"
                                    value={triageNotes}
                                    onChange={(e) => setTriageNotes(e.target.value)}
                                    className="mt-1 min-h-[80px] w-full resize-y rounded-md border border-gray-300 p-2 transition duration-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            {errors.api && <p className="mt-3 text-sm font-semibold text-red-600">{errors.api}</p>}
                            {successMessage && <p className="mt-3 text-sm font-semibold text-green-600">{successMessage}</p>}
                            <div className="mt-6 flex justify-end">
                                <Button
                                    onClick={handleCheckIn}
                                    disabled={loading}
                                    className="px-6 py-2 text-lg font-semibold transition duration-300 ease-in-out hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
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
