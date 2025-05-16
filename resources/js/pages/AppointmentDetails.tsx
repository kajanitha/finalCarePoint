import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import AppLayout from '../layouts/app-layout';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Doctor Appointments', href: '/doctor/appointments' },
    { title: 'Appointment Details', href: '' },
];

type AppointmentType = {
    id: number;
    appointment_date: string;
    appointment_time: string;
    reason?: string;
    status: string;
    notes?: string;
    patient: {
        id: number;
        first_name: string;
        last_name: string;
        contact_number?: string;
    };
};

export default function AppointmentDetails() {
    const { appointment: appointmentId } = usePage().props;
    const [appointment, setAppointment] = useState<AppointmentType | null>(null);
    const [notes, setNotes] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<string>('');

    useEffect(() => {
        fetchAppointment();
    }, [appointmentId]);

    const fetchAppointment = () => {
        fetch(`/api/appointments/${appointmentId}`)
            .then((res) => res.json())
            .then((data: AppointmentType) => {
                setAppointment(data);
                setNotes(data.notes || '');
                setStatus(data.status || '');
            })
            .catch((err) => console.error('Error fetching appointment details:', err));
    };

    const updateAppointment = (updatedFields: Partial<AppointmentType>) => {
        setLoading(true);
        fetch(`/api/appointments/${appointmentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedFields),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to update appointment');
                return res.json();
            })
            .then(() => {
                fetchAppointment();
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value);
    };

    const handleSaveNotes = () => {
        updateAppointment({ notes });
    };

    const handleStatusChange = (newStatus: string) => {
        updateAppointment({ status: newStatus });
    };

    if (!appointment) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Appointment Details" />
                <p>Loading appointment details...</p>
            </AppLayout>
        );
    }

    const patient = appointment.patient;
    const appointmentDate = new Date(appointment.appointment_date).toLocaleDateString();
    const appointmentTime = appointment.appointment_time;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appointment Details" />
            <div className="flex flex-col gap-6 rounded-xl bg-gray-100 p-4">
                <section>
                    <h2 className="mb-4 text-xl font-semibold">Appointment Details</h2>
                    <Card>
                        <div className="mb-4">
                            <h3 className="font-semibold">Patient Information</h3>
                            <p>
                                <strong>Full Name:</strong> {patient.first_name} {patient.last_name}
                            </p>
                            <p>
                                <strong>Contact:</strong> {patient.contact_number || 'N/A'}
                            </p>
                            <p>
                                <strong>Patient ID:</strong> {patient.id}
                            </p>
                        </div>
                        <Separator />
                        <div className="mb-4">
                            <h3 className="font-semibold">Appointment Information</h3>
                            <p>
                                <strong>Date:</strong> {appointmentDate}
                            </p>
                            <p>
                                <strong>Time:</strong> {appointmentTime}
                            </p>
                            <p>
                                <strong>Reason:</strong> {appointment.reason || '-'}
                            </p>
                        </div>
                        <Separator />
                        <div className="mb-4">
                            <h3 className="font-semibold">Medical History</h3>
                            <p>Medical history will be displayed here (see Ticket 2.4).</p>
                        </div>
                        <Separator />
                        <div className="mb-4">
                            <h3 className="font-semibold">Doctor's Notes</h3>
                            <textarea value={notes} onChange={handleNotesChange} rows={5} className="w-full rounded border border-gray-300 p-2" />
                            <Button onClick={handleSaveNotes} disabled={loading} className="mt-2">
                                Save Notes
                            </Button>
                        </div>
                        <Separator />
                        <div className="flex gap-4">
                            <Button variant="outline" onClick={() => handleStatusChange('completed')} disabled={loading || status === 'completed'}>
                                Mark as Completed
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => handleStatusChange('cancelled')}
                                disabled={loading || status === 'cancelled'}
                            >
                                Mark as Cancelled
                            </Button>
                            <Link href={`/book-appointment?appointmentId=${appointment.id}`}>
                                <Button variant="outline">Reschedule</Button>
                            </Link>
                        </div>
                    </Card>
                </section>
            </div>
        </AppLayout>
    );
}
