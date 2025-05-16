import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import AppLayout from '../layouts/app-layout';

interface Clinic {
    id: number;
    name: string;
    address: string;
    distance: number;
    rating: number;
    specialization: string;
    image: string;
}

interface Appointment {
    id?: number;
    type: string;
    date: string;
    time: string;
    doctorName: string;
    clinicName: string;
    status: string;
}

interface Activity {
    message: string;
    date: string;
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

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const [nearbyClinics, setNearbyClinics] = useState<Clinic[]>([]);
    const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
    const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
    const [clinicSearch, setClinicSearch] = useState('');
    const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    const [todaysAppointments, setTodaysAppointments] = useState<TodaysAppointment[]>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<TodaysAppointment[]>([]);
    const [filterTime, setFilterTime] = useState<string>('');

    useEffect(() => {
        // Fetch CSRF cookie before making API calls
        fetch('http://127.0.0.1:8000/sanctum/csrf-cookie', { credentials: 'include' })
            .then(() => {
                // Fetch nearby clinics from API
                fetch('/api/clinics/nearby')
                    .then((res) => res.json())
                    .then((data) => {
                        setNearbyClinics(data);
                        setFilteredClinics(data);
                    })
                    .catch((err) => console.error('Error fetching clinics:', err));

                // Fetch next appointment from API
                fetchNextAppointment();

                // Fetch recent activity from API
                fetch('/api/activity/recent')
                    .then((res) => res.json())
                    .then((data) => setRecentActivity(data))
                    .catch((err) => console.error('Error fetching recent activity:', err));

                // Fetch today's appointments for GP/Receptionist
                fetchTodaysAppointments();
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

    useEffect(() => {
        if (filterTime.trim() === '') {
            setFilteredAppointments(todaysAppointments);
        } else {
            const filtered = todaysAppointments.filter((appointment) => appointment.appointment_time.startsWith(filterTime));
            setFilteredAppointments(filtered);
        }
    }, [filterTime, todaysAppointments]);

    useEffect(() => {
        if (clinicSearch.trim() === '') {
            setFilteredClinics(nearbyClinics);
        } else {
            const filtered = nearbyClinics.filter(
                (clinic) =>
                    clinic.name.toLowerCase().includes(clinicSearch.toLowerCase()) ||
                    clinic.address.toLowerCase().includes(clinicSearch.toLowerCase()) ||
                    clinic.specialization.toLowerCase().includes(clinicSearch.toLowerCase()),
            );
            setFilteredClinics(filtered);
        }
    }, [clinicSearch, nearbyClinics]);

    const openCancelDialog = () => {
        setIsCancelDialogOpen(true);
    };

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 rounded-xl bg-gray-100 p-4">
                {/* Dashboard Summary */}
                <section>
                    <h2 className="mb-4 text-xl font-semibold">Dashboard Summary</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {/* Nearby Clinics */}
                        <Card>
                            <h3 className="mb-2 font-semibold">Nearby Clinics</h3>
                            <Input
                                type="text"
                                placeholder="Search clinics..."
                                value={clinicSearch}
                                onChange={(e) => setClinicSearch(e.target.value)}
                                className="mb-2"
                            />
                            <ScrollArea className="h-48">
                                {filteredClinics.length === 0 ? (
                                    <p>No clinics found.</p>
                                ) : (
                                    filteredClinics.map((clinic) => (
                                        <div key={clinic.id} className="mb-2 flex items-center rounded border p-2">
                                            <img src={clinic.image} alt={clinic.name} className="mr-2 h-16 w-16 rounded object-cover" />
                                            <div>
                                                <p className="font-semibold">{clinic.name}</p>
                                                <p className="text-sm">{clinic.address}</p>
                                                <p className="text-sm">Distance: {clinic.distance} km</p>
                                                <p className="text-sm">Rating: {clinic.rating}</p>
                                                <p className="text-sm">Specialization: {clinic.specialization}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </ScrollArea>
                        </Card>

                        {/* Next Upcoming Appointment */}
                        <Card>
                            <h3 className="mb-2 font-semibold">Next Upcoming Appointment</h3>
                            {nextAppointment ? (
                                <div>
                                    <p>Type: {nextAppointment.type}</p>
                                    <p>Date: {new Date(nextAppointment.date).toLocaleDateString()}</p>
                                    <p>Time: {nextAppointment.time}</p>
                                    <p>Doctor: {nextAppointment.doctorName}</p>
                                    <p>Clinic: {nextAppointment.clinicName}</p>
                                    <p>Status: {nextAppointment.status}</p>
                                    {nextAppointment.status.toLowerCase() !== 'cancelled' && (
                                        <Button variant="destructive" onClick={openCancelDialog} disabled={isCancelling}>
                                            Cancel Appointment
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <p>No upcoming appointments.</p>
                            )}
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <h3 className="mb-2 font-semibold">Recent Activity</h3>
                            <ScrollArea className="h-48">
                                {recentActivity.length === 0 ? (
                                    <p>No recent activity.</p>
                                ) : (
                                    recentActivity.map((activity, index) => (
                                        <div key={index} className="mb-2 rounded border p-2">
                                            <p>{activity.message}</p>
                                            <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleString()}</p>
                                        </div>
                                    ))
                                )}
                            </ScrollArea>
                        </Card>
                    </div>
                </section>

                <Separator />

                {/* Today's Appointments */}
                <section>
                    <h2 className="mb-4 text-xl font-semibold">Today's Appointments</h2>
                    <Card>
                        <div className="mb-2">
                            <label htmlFor="filterTime" className="mr-2 font-semibold">
                                Filter by Time (HH:mm):
                            </label>
                            <input
                                id="filterTime"
                                type="text"
                                value={filterTime}
                                onChange={(e) => setFilterTime(e.target.value)}
                                placeholder="e.g. 09:00"
                                className="input w-32"
                            />
                        </div>
                        <ScrollArea className="h-64">
                            {filteredAppointments.length === 0 ? (
                                <p>No appointments scheduled for today.</p>
                            ) : (
                                <table className="w-full table-auto border-collapse border border-gray-300">
                                    <thead>
                                        <tr>
                                            <th className="border border-gray-300 px-2 py-1 text-left">Time</th>
                                            <th className="border border-gray-300 px-2 py-1 text-left">Patient Name</th>
                                            <th className="border border-gray-300 px-2 py-1 text-left">Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAppointments.map((appointment) => (
                                            <tr key={appointment.id} className="border border-gray-300">
                                                <td className="border border-gray-300 px-2 py-1">{appointment.appointment_time}</td>
                                                <td className="border border-gray-300 px-2 py-1">
                                                    <a href={`/patients/${appointment.patient.id}`} className="text-blue-600 hover:underline">
                                                        {appointment.patient.first_name} {appointment.patient.last_name}
                                                    </a>
                                                </td>
                                                <td className="border border-gray-300 px-2 py-1">{appointment.reason}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </ScrollArea>
                    </Card>
                </section>

                <Separator />

                {/* Medical Records */}
                <section>
                    <h2 className="mb-4 text-xl font-semibold">Medical Records</h2>
                    {/* Placeholder for medical records content */}
                    <Card className="p-4">
                        <p>Consultation summaries, lab results, medications, and care plans will be displayed here.</p>
                    </Card>
                </section>

                <Separator />

                {/* Communication */}
                <section>
                    <h2 className="mb-4 text-xl font-semibold">Communication</h2>
                    {/* Placeholder for secure messaging and notifications */}
                    <Card className="p-4">
                        <p>Secure messaging and notifications will be available here.</p>
                    </Card>
                </section>

                {/* Cancel Confirmation Dialog */}
                <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Cancel Appointment</DialogTitle>
                            <DialogDescription>Are you sure you want to cancel your appointment?</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={closeCancelDialog} disabled={isCancelling}>
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
