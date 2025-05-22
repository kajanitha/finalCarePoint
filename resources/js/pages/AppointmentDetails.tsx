import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
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
        full_name?: string;
        contact_number?: string;
    };
};

export default function AppointmentDetails() {
    const { appointment: initialAppointment } = usePage<{ appointment: AppointmentType }>().props; // Directly access initial prop
    const [appointment, setAppointment] = useState<AppointmentType | null>(initialAppointment);
    const { data, setData, processing } = useForm({
        notes: '',
        status: '',
    });

    useEffect(() => {
        if (appointment) {
            setData({
                notes: appointment.notes || '',
                status: appointment.status || '',
            });
        }
    }, [appointment, setData]);

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setData('notes', e.target.value);
    };

    const handleSaveNotes = () => {
        router.put(`/api/appointments/${appointment?.id}`, data, {
            preserveScroll: true,
            onSuccess: () => {
                if (appointment) {
                    setAppointment({ ...appointment, notes: data.notes });
                }
            },
            onError: (error) => {
                console.error('Error updating notes:', error);
            },
        });
    };

    const handleStatusChange = (newStatus: string) => {
        setData('status', newStatus);
        router.put(`/api/appointments/${appointment?.id}`, data, {
            preserveScroll: true,
            onSuccess: () => {
                if (appointment) {
                    setAppointment({ ...appointment, status: newStatus });
                }
            },
            onError: (error) => {
                console.error('Error updating status:', error);
            },
        });
    };

    if (!appointment) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Appointment Details" />
                <p className="mt-10 text-center text-gray-500">Loading appointment details...</p>
            </AppLayout>
        );
    }

    const patient = appointment.patient;
    const appointmentDate = new Date(appointment.appointment_date).toLocaleDateString();
    const appointmentTime = appointment.appointment_time;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appointment Details" />
            <div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-2xl bg-white p-6 shadow-lg">
                <section>
                    <h2 className="mb-6 border-b border-gray-200 pb-3 text-2xl font-semibold text-blue-600">Appointment Details</h2>

                    <Card className="rounded-xl border border-gray-200 shadow-md">
                        <div className="mb-6 px-6 py-4">
                            <div className="flex justify-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="transform bg-blue-500 text-white transition-transform hover:scale-105 focus:scale-105">
                                            Actions
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" sideOffset={4}>
                                        <DropdownMenuItem
                                            disabled={processing || data.status === 'completed'}
                                            onSelect={() => handleStatusChange('completed')}
                                            className="bg-green-100"
                                        >
                                            Mark as Completed
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            disabled={processing || data.status === 'cancelled'}
                                            onSelect={() => handleStatusChange('cancelled')}
                                            className="bg-red-100"
                                        >
                                            Mark as Cancelled
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={`/book-appointment?appointmentId=${appointment.id}`} className="bg-yellow-100">
                                                Reschedule
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <h3 className="mb-3 text-lg font-semibold text-gray-700">Patient Information</h3>
                            <p className="leading-relaxed text-gray-600">
                                <span className="font-medium text-gray-800">Full Name:</span> {patient.full_name}
                            </p>
                            <p className="leading-relaxed text-gray-600">
                                <span className="font-medium text-gray-800">Contact:</span> {patient.contact_number || 'N/A'}
                            </p>
                            <p className="leading-relaxed text-gray-600">
                                <span className="font-medium text-gray-800">Patient ID:</span> {patient.id}
                            </p>
                        </div>
                        <Separator />
                        <div className="mb-6 px-6 py-4">
                            <h3 className="mb-3 text-lg font-semibold text-gray-700">Appointment Information</h3>
                            <p className="leading-relaxed text-gray-600">
                                <span className="font-medium text-gray-800">Date:</span> {appointmentDate}
                            </p>
                            <p className="leading-relaxed text-gray-600">
                                <span className="font-medium text-gray-800">Time:</span> {appointmentTime}
                            </p>
                            <p className="leading-relaxed text-gray-600">
                                <span className="font-medium text-gray-800">Reason:</span> {appointment.reason || '-'}
                            </p>
                        </div>
                        <Separator />
                        <div className="mb-6 px-6 py-4">
                            <h3 className="mb-3 text-lg font-semibold text-gray-700">Medical History</h3>
                            <p className="text-gray-600 italic">Medical history will be displayed here (see Ticket 2.4).</p>
                        </div>
                        <Separator />
                        <div className="mb-6 px-6 py-4">
                            <h3 className="mb-3 text-lg font-semibold text-gray-700">Doctor's Notes</h3>
                            <textarea
                                value={data.notes}
                                onChange={handleNotesChange}
                                rows={5}
                                className="w-full resize-none rounded-lg border border-gray-300 p-3 text-gray-700 placeholder-gray-400 transition duration-300 ease-in-out focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                placeholder="Enter doctor's notes here..."
                            />
                            <Button
                                onClick={handleSaveNotes}
                                disabled={processing}
                                className="mt-4 transform transition-transform hover:scale-105 focus:scale-105"
                            >
                                Save Notes
                            </Button>
                        </div>
                        <Separator />
                        <div className="flex gap-4 px-6 py-4"></div>
                    </Card>
                </section>
            </div>
        </AppLayout>
    );
}
