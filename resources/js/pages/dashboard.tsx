import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import {
    BellIcon,
    CalendarDaysIcon,
    CheckCircleIcon,
    ClipboardDocumentCheckIcon,
    ClockIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    UserPlusIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import AppLayout from '../layouts/app-layout';

interface Appointment {
    id?: number;
    type: string;
    date: string;
    time: string;
    doctorName: string;
    clinicName: string;
    status: string;
    urgent?: boolean;
    late?: boolean;
}

interface TodaysAppointment {
    id: number;
    appointment_date: string;
    appointment_time: string;
    reason: string;
    patient: {
        id: number;
        first_name: string;
        last_name: string;
    };
}

interface CheckedInPatient {
    id: number;
    first_name: string;
    last_name: string;
    checkin_time: string;
    nowSeeingDoctor: boolean;
}

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
    const [todaysAppointments, setTodaysAppointments] = useState<TodaysAppointment[]>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<TodaysAppointment[]>([]);
    const [checkedInPatients, setCheckedInPatients] = useState<CheckedInPatient[]>([]);
    const [searchPatient, setSearchPatient] = useState('');
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [currentTime, setCurrentTime] = useState(new Date());

    // New state variables for counts
    const [totalPatients, setTotalPatients] = useState<number>(0);
    const [completedAppointmentsCount, setCompletedAppointmentsCount] = useState<number>(0);
    const [pendingAppointmentsCount, setPendingAppointmentsCount] = useState<number>(0);

    // Simulated user info for welcome message and role-based rendering
    const user = {
        name: 'Dr. Silva',
        role: 'doctor', // or 'receptionist'
    };

    useEffect(() => {
        // Update current time every minute
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // Fetch CSRF cookie before making API calls
        fetch('http://127.0.0.1:8000/sanctum/csrf-cookie', { credentials: 'include' })
            .then(() => {
                // Fetch next appointment from API
                fetchNextAppointment();

                // Fetch today's appointments for GP/Receptionist
                fetchTodaysAppointments();

                // Fetch checked-in patients
                fetchCheckedInPatients();

                // Fetch notifications count
                fetchNotificationsCount();

                // Fetch total patients count
                fetch('/api/patients/total')
                    .then((res) => res.json())
                    .then((data) => setTotalPatients(data.totalPatients))
                    .catch((err) => console.error('Error fetching total patients count:', err));

                // Fetch today's completed and pending appointments counts
                fetch('/api/appointments/today/counts')
                    .then((res) => res.json())
                    .then((data) => {
                        setCompletedAppointmentsCount(data.completedCount);
                        setPendingAppointmentsCount(data.pendingCount);
                    })
                    .catch((err) => console.error("Error fetching today's appointment counts:", err));
            })
            .catch((err) => console.error('Error fetching CSRF cookie:', err));
    }, []);

    const fetchNextAppointment = () => {
        fetch('/api/appointments/next')
            .then((res) => res.json())
            .then((data) => setNextAppointment(data))
            .catch((err) => console.error('Error fetching next appointment:', err));
    };

    const fetchTodaysAppointments = () => {
        fetch('/api/appointments/today')
            .then((res) => res.json())
            .then((data) => {
                // Convert appointment_time to Colombo timezone
                const colomboTimezone = 'Asia/Colombo';
                const convertedData = data.map((appointment: TodaysAppointment) => {
                    const time = new Date(appointment.appointment_time + 'Z'); // treat as UTC
                    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: colomboTimezone };
                    const formattedTime = time.toLocaleTimeString('en-GB', options);
                    return { ...appointment, appointment_time: formattedTime };
                });
                setTodaysAppointments(convertedData);
                setFilteredAppointments(convertedData);
            })
            .catch((err) => console.error("Error fetching today's appointments:", err));
    };

    const fetchCheckedInPatients = () => {
        fetch('/api/patients/checked-in')
            .then((res) => res.json())
            .then((data) => setCheckedInPatients(data))
            .catch((err) => console.error('Error fetching checked-in patients:', err));
    };

    const fetchNotificationsCount = () => {
        fetch('/api/notifications/count')
            .then((res) => res.json())
            .then((data) => setNotificationsCount(data.count))
            .catch((err) => console.error('Error fetching notifications count:', err));
    };

    useEffect(() => {
        setFilteredAppointments(todaysAppointments);
    }, [todaysAppointments]);

    const closeCancelDialog = () => {
        setIsCancelDialogOpen(false);
    };

    const handleCancelAppointment = () => {
        if (!nextAppointment || !nextAppointment.id) return;

        setIsCancelling(true);
        fetch(`/api/patient/appointments/${nextAppointment.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to cancel appointment');
                }
                return res.json();
            })
            .then(() => {
                // Update appointment status locally
                setNextAppointment((prev) => (prev ? { ...prev, status: 'Cancelled' } : prev));
                setIsCancelling(false);
                closeCancelDialog();
            })
            .catch((err) => {
                console.error(err);
                setIsCancelling(false);
                closeCancelDialog();
                // Optionally show error notification here
            });
    };

    const markNowSeeingDoctor = (patientId: number) => {
        // API call to mark patient as now seeing doctor
        fetch(`/api/patients/${patientId}/now-seeing`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to mark patient as now seeing doctor');
                }
                return res.json();
            })
            .then(() => {
                // Update checked-in patients list
                setCheckedInPatients((prev) => prev.map((p) => (p.id === patientId ? { ...p, nowSeeingDoctor: true } : p)));
            })
            .catch((err) => {
                console.error(err);
                // Optionally show error notification here
            });
    };

    // Helper to get greeting based on time
    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="bg-gray-40 flex flex-col gap-8 rounded-2xl p-6 shadow-lg">
                {/* Top Section */}
                <section className="grid grid-cols-1 items-center gap-6 md:grid-cols-4">
                    <div className="col-span-2">
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                            {getGreeting()}, {user.name}!
                        </h1>
                        <p className="text-sm tracking-wide text-gray-500">{currentTime.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-5">
                        <div className="relative w-full max-w-xs">
                            <Input
                                type="text"
                                placeholder="Search patients by name or NIC..."
                                value={searchPatient}
                                onChange={(e) => setSearchPatient(e.target.value)}
                                className="rounded-lg border border-gray-300 pr-12 shadow-sm transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            <MagnifyingGlassIcon className="absolute top-1/2 right-4 h-6 w-6 -translate-y-1/2 text-gray-400" />
                        </div>
                        <button
                            type="button"
                            className="relative rounded-full p-3 transition-colors duration-300 ease-in-out hover:bg-gray-200"
                            aria-label="Notifications"
                        >
                            <BellIcon className="h-7 w-7 text-gray-600" />
                            {notificationsCount > 0 && (
                                <span className="absolute -top-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-semibold text-white shadow-lg">
                                    {notificationsCount}
                                </span>
                            )}
                        </button>
                    </div>
                </section>

                {/* New Cards Section for Counts */}
                <section className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Total Patients */}
                    <Card className="flex items-center space-x-4 p-4 shadow-md transition-shadow duration-300 ease-in-out hover:shadow-xl">
                        <UserPlusIcon className="h-12 w-12 text-indigo-600" />
                        <div>
                            <CardTitle className="text-lg font-semibold text-gray-700">Total Patients</CardTitle>
                            <p className="text-3xl font-bold text-gray-900">{totalPatients}</p>
                        </div>
                    </Card>

                    {/* Completed Appointments Today */}
                    <Card className="flex items-center space-x-4 p-4 shadow-md transition-shadow duration-300 ease-in-out hover:shadow-xl">
                        <CheckCircleIcon className="h-12 w-12 text-green-600" />
                        <div>
                            <CardTitle className="text-lg font-semibold text-gray-700">Completed Appointments</CardTitle>
                            <p className="text-3xl font-bold text-gray-900">{completedAppointmentsCount}</p>
                        </div>
                    </Card>

                    {/* Pending Appointments Today */}
                    <Card className="flex items-center space-x-4 p-4 shadow-md transition-shadow duration-300 ease-in-out hover:shadow-xl">
                        <ClockIcon className="h-12 w-12 text-yellow-600" />
                        <div>
                            <CardTitle className="text-lg font-semibold text-gray-700">Pending Appointments</CardTitle>
                            <p className="text-3xl font-bold text-gray-900">{pendingAppointmentsCount}</p>
                        </div>
                    </Card>
                </section>

                {/* Appointments Overview */}
                <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Today's Appointments */}
                    <Card className="shadow-md transition-shadow duration-300 ease-in-out hover:shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-blue-600">Today's Appointments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-64 rounded-md border border-gray-200 shadow-inner">
                                {filteredAppointments.length === 0 ? (
                                    <p className="text-gray-500 italic">No appointments scheduled for today.</p>
                                ) : (
                                    <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
                                        <thead>
                                            <tr className="bg-indigo-50">
                                                <th className="border border-gray-300 px-3 py-2 text-left font-medium text-indigo-700">Time</th>
                                                <th className="border border-gray-300 px-3 py-2 text-left font-medium text-indigo-700">
                                                    Patient Name
                                                </th>
                                                <th className="border border-gray-300 px-3 py-2 text-left font-medium text-indigo-700">Reason</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredAppointments.map((appointment) => (
                                                <tr
                                                    key={appointment.id}
                                                    className="border border-gray-300 transition-colors duration-200 hover:bg-indigo-100"
                                                >
                                                    <td className="border border-gray-300 px-3 py-2">{appointment.appointment_time}</td>
                                                    <td className="border border-gray-300 px-3 py-2">
                                                        <a
                                                            href={`/patients/${appointment.patient.id}`}
                                                            className="font-medium text-blue-600 hover:underline"
                                                        >
                                                            {appointment.patient.first_name} {appointment.patient.last_name}
                                                        </a>
                                                    </td>
                                                    <td className="border border-gray-300 px-3 py-2">{appointment.reason}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* Checked-in Patients */}
                    <Card className="shadow-md transition-shadow duration-300 ease-in-out hover:shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-blue-600">Checked-in Patients</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-64 rounded-md border border-gray-200 shadow-inner">
                                {checkedInPatients.length === 0 ? (
                                    <p className="text-gray-500 italic">No patients have checked in.</p>
                                ) : (
                                    checkedInPatients.map((patient) => (
                                        <div
                                            key={patient.id}
                                            className="mb-3 flex items-center justify-between rounded-lg border border-gray-300 bg-indigo-50 px-4 py-2 shadow-sm transition hover:bg-indigo-100"
                                        >
                                            <div className="font-medium text-gray-800">
                                                {patient.first_name} {patient.last_name} -{' '}
                                                <span className="font-normal text-gray-500">{patient.checkin_time}</span>
                                            </div>
                                            {!patient.nowSeeingDoctor && user.role === 'doctor' && (
                                                <Button
                                                    size="sm"
                                                    className="bg-indigo-600 text-white shadow-md transition hover:bg-indigo-700"
                                                    onClick={() => markNowSeeingDoctor(patient.id)}
                                                >
                                                    Now Seeing Doctor
                                                </Button>
                                            )}
                                            {patient.nowSeeingDoctor && <span className="font-semibold text-green-600">In Consultation</span>}
                                        </div>
                                    ))
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="shadow-md transition-shadow duration-300 ease-in-out hover:shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-blue-600">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col space-y-4">
                            <Button
                                variant="default"
                                size="md"
                                className="flex items-center space-x-3 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-md transition hover:bg-indigo-700"
                                onClick={() => (window.location.href = '/patients/register')}
                            >
                                <UserPlusIcon className="h-6 w-6" />
                                <span>Register New Patient</span>
                            </Button>
                            <Button
                                variant="default"
                                size="md"
                                className="flex items-center space-x-3 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-md transition hover:bg-indigo-700"
                                onClick={() => (window.location.href = '/appointments/book')}
                            >
                                <CalendarDaysIcon className="h-6 w-6" />
                                <span>Book Appointment</span>
                            </Button>
                            <Button
                                variant="default"
                                size="md"
                                className="flex items-center space-x-3 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-md transition hover:bg-indigo-700"
                                onClick={() => (window.location.href = '/patients/checkin')}
                            >
                                <ClipboardDocumentCheckIcon className="h-6 w-6" />
                                <span>Check-in Patient</span>
                            </Button>
                            {user.role === 'doctor' && (
                                <>
                                    <Button
                                        variant="default"
                                        size="md"
                                        className="flex items-center space-x-3 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-md transition hover:bg-indigo-700"
                                        onClick={() => (window.location.href = '/consultations/start')}
                                    >
                                        <UserPlusIcon className="h-6 w-6" />
                                        <span>Start Consultation</span>
                                    </Button>
                                    <Button
                                        variant="default"
                                        size="md"
                                        className="flex items-center space-x-3 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-md transition hover:bg-indigo-700"
                                        onClick={() => (window.location.href = '/prescriptions/create')}
                                    >
                                        <PencilSquareIcon className="h-6 w-6" />
                                        <span>Create Prescription</span>
                                    </Button>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </section>

                <Separator className="my-8" />

                {/* Pending Tasks / Alerts */}
                <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Card className="shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-blue-600">Pending Registrations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">List of patients who started but not completed registration will appear here.</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-blue-600">Appointment Reschedule Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">List of pending reschedule requests from patients will appear here.</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-blue-600">Lab Results Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">Notifications about lab results that need review will appear here.</p>
                        </CardContent>
                    </Card>
                </section>

                <Separator className="my-8" />

                {/* Doctor's Schedule Summary */}
                {user.role === 'doctor' && (
                    <section>
                        <Card className="shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-blue-600">Doctor's Schedule Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Summary of daily schedule, appointment times, patient names, and appointment types will appear here.
                                </p>
                            </CardContent>
                        </Card>
                    </section>
                )}

                <Separator className="my-8" />

                {/* Recent Patient Interactions */}
                <section>
                    <Card className="shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-blue-600">Recent Patient Interactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                List of patients recently interacted with, including last seen and last prescribed medication, will appear here.
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {/* Cancel Confirmation Dialog */}
                <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                    <DialogContent className="rounded-lg shadow-lg">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-red-600">Cancel Appointment</DialogTitle>
                            <DialogDescription className="text-gray-700">Are you sure you want to cancel your appointment?</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={closeCancelDialog} disabled={isCancelling} className="mr-3">
                                No
                            </Button>
                            <Button variant="destructive" onClick={handleCancelAppointment} disabled={isCancelling}>
                                Yes, Cancel
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
