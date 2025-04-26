import React, { useEffect, useState } from 'react';
import AppLayout from '../layouts/app-layout';
import { Head } from '@inertiajs/react';
import MapComponent from '../components/MapComponent';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { ScrollArea } from '../components/ui/scroll-area';

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

    useEffect(() => {
        // Fetch nearby clinics from API
        fetch('/api/clinics/nearby')
            .then((res) => res.json())
            .then((data) => {
                setNearbyClinics(data);
                setFilteredClinics(data);
            })
            .catch((err) => console.error('Error fetching clinics:', err));

        // Fetch next appointment from API
        fetch('/api/appointments/next')
            .then((res) => res.json())
            .then((data) => setNextAppointment(data))
            .catch((err) => console.error('Error fetching next appointment:', err));

        // Fetch recent activity from API
        fetch('/api/activity/recent')
            .then((res) => res.json())
            .then((data) => setRecentActivity(data))
            .catch((err) => console.error('Error fetching recent activity:', err));
    }, []);

    useEffect(() => {
        if (clinicSearch.trim() === '') {
            setFilteredClinics(nearbyClinics);
        } else {
            const filtered = nearbyClinics.filter((clinic) =>
                clinic.name.toLowerCase().includes(clinicSearch.toLowerCase()) ||
                clinic.address.toLowerCase().includes(clinicSearch.toLowerCase()) ||
                clinic.specialization.toLowerCase().includes(clinicSearch.toLowerCase())
            );
            setFilteredClinics(filtered);
        }
    }, [clinicSearch, nearbyClinics]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-4 bg-gray-100 rounded-xl">
                {/* Dashboard Summary */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Dashboard Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Nearby Clinics */}
                        <Card>
                            <h3 className="font-semibold mb-2">Nearby Clinics</h3>
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
                                        <div key={clinic.id} className="mb-2 p-2 border rounded flex items-center">
                                            <img src={clinic.image} alt={clinic.name} className="h-16 w-16 object-cover rounded mr-2" />
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
                            <h3 className="font-semibold mb-2">Next Upcoming Appointment</h3>
                            {nextAppointment ? (
                                <div>
                                    <p>Type: {nextAppointment.type}</p>
                                    <p>Date: {new Date(nextAppointment.date).toLocaleDateString()}</p>
                                    <p>Time: {nextAppointment.time}</p>
                                    <p>Doctor: {nextAppointment.doctorName}</p>
                                    <p>Clinic: {nextAppointment.clinicName}</p>
                                    <p>Status: {nextAppointment.status}</p>
                                </div>
                            ) : (
                                <p>No upcoming appointments.</p>
                            )}
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <h3 className="font-semibold mb-2">Recent Activity</h3>
                            <ScrollArea className="h-48">
                                {recentActivity.length === 0 ? (
                                    <p>No recent activity.</p>
                                ) : (
                                    recentActivity.map((activity, index) => (
                                        <div key={index} className="mb-2 p-2 border rounded">
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

                {/* Medical Records */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Medical Records</h2>
                    {/* Placeholder for medical records content */}
                    <Card className="p-4">
                        <p>Consultation summaries, lab results, medications, and care plans will be displayed here.</p>
                    </Card>
                </section>

                <Separator />

                {/* Communication */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Communication</h2>
                    {/* Placeholder for secure messaging and notifications */}
                    <Card className="p-4">
                        <p>Secure messaging and notifications will be available here.</p>
                    </Card>
                </section>
            </div>
        </AppLayout>
    );
}
