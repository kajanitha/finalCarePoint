import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import AppLayout from '../layouts/app-layout';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Doctor Appointments', href: '/doctor/appointments' },
];

type Appointment = {
    id: number;
    appointment_date: string;
    appointment_time: string;
    reason: string;
    status: string;
    patient: {
        id: number;
        first_name?: string;
        last_name?: string;
        full_name?: string;
    } | null;
};

type Props = {
    appointments: Appointment[];
    filters: {
        range: 'day' | 'week' | 'month';
        status: string;
    };
};

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export default function DoctorAppointments({ appointments, filters }: Props) {
    const [range, setRange] = useState(filters.range);
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const statusColors: Record<string, string> = {
        scheduled: 'bg-blue-200 text-blue-800',
        confirmed: 'bg-green-200 text-green-800',
        cancelled: 'bg-red-200 text-red-800',
        pending: 'bg-yellow-200 text-yellow-800',
        completed: 'bg-gray-200 text-gray-800',
    };

    const handleFilterChange = (newRange: 'day' | 'week' | 'month', newStatus: string) => {
        setRange(newRange);
        setStatusFilter(newStatus);
        router.get('/doctor/appointments', { range: newRange, status: newStatus }, { preserveState: true, replace: true });
    };

    const getPatientName = (patient: Appointment['patient']) => {
        if (!patient) return 'Unknown';
        if (patient.first_name || patient.last_name) {
            return `${patient.first_name || ''} ${patient.last_name || ''}`.trim();
        }
        if (patient.full_name) return patient.full_name;
        return 'Unknown';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Doctor Appointments" />
            <div className="wd-196 flex flex-col gap-6 rounded-xl bg-gray-50 p-6 shadow-sm">
                <section>
                    <h2 className="mb-6 text-2xl font-semibold text-blue-600">Appointment Management</h2>
                    <Card className="rounded-lg shadow-md">
                        <div className="mb-6 flex flex-wrap gap-6 rounded-xl bg-gray-50 p-6 shadow-sm">
                            <div>
                                <label htmlFor="range" className="mb-2 block font-semibold text-gray-600">
                                    View Range
                                </label>
                                <select
                                    id="range"
                                    value={range}
                                    onChange={(e) => handleFilterChange(e.target.value as 'day' | 'week' | 'month', statusFilter)}
                                    className="input rounded-md border border-gray-300 px-3 py-2 shadow-sm transition focus:ring-2 focus:ring-red-400 focus:outline-none"
                                >
                                    <option value="day">Day</option>
                                    <option value="week">Week</option>
                                    <option value="month">Month</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="statusFilter" className="mb-2 block font-semibold text-gray-600">
                                    Filter by Status
                                </label>
                                <select
                                    id="statusFilter"
                                    value={statusFilter}
                                    onChange={(e) => handleFilterChange(range, e.target.value)}
                                    className="input rounded-md border border-gray-300 px-3 py-2 shadow-sm transition focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                >
                                    <option value="">All</option>
                                    <option value="scheduled" className="hover:blue bg-blue-200 text-blue-800">
                                        Scheduled
                                    </option>
                                    <option value="confirmed" className="bg-green-200 text-green-800">
                                        Confirmed
                                    </option>
                                    <option value="cancelled" className="bg-red-200 text-red-800">
                                        Cancelled
                                    </option>
                                    <option value="pending" className="bg-yellow-200 text-yellow-800">
                                        Pending
                                    </option>
                                    <option value="completed" className="bg-gray-200 text-gray-800">
                                        Completed
                                    </option>
                                </select>
                            </div>
                        </div>
                        <ScrollArea className="h-96 rounded-lg shadow-inner">
                            {appointments.length === 0 ? (
                                <p className="text-gray-400">No appointments found for the selected criteria.</p>
                            ) : (
                                <table className="w-full table-auto border-collapse overflow-hidden rounded-lg border border-gray-300 shadow-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Time</th>
                                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Patient Name</th>
                                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Reason</th>
                                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map((appointment) => (
                                            <tr
                                                key={appointment.id}
                                                className="cursor-pointer border border-gray-300 transition-colors duration-300 hover:bg-gray-200"
                                                onClick={() => router.visit(`/appointments/${appointment.id}`)}
                                            >
                                                <td className="border border-gray-300 px-4 py-2">{formatDate(appointment.appointment_date)}</td>
                                                <td className="border border-gray-300 px-4 py-2">{appointment.appointment_time}</td>
                                                <td className="border border-gray-300 px-4 py-2">{getPatientName(appointment.patient)}</td>
                                                <td className="border border-gray-300 px-4 py-2">{appointment.reason || '-'}</td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <span
                                                        className={`inline-block rounded px-3 py-1 text-sm font-semibold ${statusColors[appointment.status.toLowerCase()] || 'bg-gray-200 text-gray-800'}`}
                                                    >
                                                        {appointment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </ScrollArea>
                    </Card>
                </section>
            </div>
        </AppLayout>
    );
}
