import { Head, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import AppLayout from '../layouts/app-layout';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Book New Appointment', href: '/doctor/appointments' },
];

const appointmentTypes = ['General Consultation', 'Follow-up', 'Checkup'];

interface Patient {
    id: number;
    full_name: string;
    nic: string;
}

interface AppointmentFormData {
    [key: string]: string | boolean;
    patient_id: string;
    appointment_type: string;
    appointment_date: string;
    appointment_time: string;
    reason: string;
    confirmation_sent: boolean;
    notes: string;
}

interface ApiError {
    status?: number;
    errors?: Record<string, string[]>;
    api?: string;
}

const BookAppointment: React.FC = () => {
    const { patients } = usePage().props as unknown as { patients: Patient[] };

    const { data, setData, post, processing, errors, reset } = useForm<AppointmentFormData>({
        patient_id: '',
        appointment_type: '',
        appointment_date: '',
        appointment_time: '',
        reason: '',
        confirmation_sent: false,
        notes: '',
    });

    const [successMessage, setSuccessMessage] = React.useState<string>('');
    const [apiError, setApiError] = React.useState<string>('');

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (data.patient_id === '') newErrors.patient_id = 'Patient is required';
        if (data.appointment_type === '') newErrors.appointment_type = 'Appointment type is required';
        if (data.appointment_date === '') newErrors.appointment_date = 'Date is required';
        if (data.appointment_time === '') newErrors.appointment_time = 'Time is required';
        if (data.reason === '') newErrors.reason = 'Reason for appointment is required';
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        post('/appointments', {
            onSuccess: () => {
                reset();
                setSuccessMessage('Appointment booked successfully!');
                setApiError('');
            },
            onError: (error: ApiError) => {
                if (error && typeof error === 'object') {
                    if (error.status === 401) {
                        setApiError('You are not authenticated. Please login.');
                    } else if (error.status === 422) {
                        const validationErrors = error.errors || {};
                        const messages = Object.values(validationErrors).flat().join(' ');
                        setApiError(messages || 'Validation failed. Please check your input.');
                    } else if (error.api) {
                        setApiError(error.api);
                    } else {
                        setApiError('Failed to book appointment. Please try again.');
                    }
                } else {
                    setApiError('Failed to book appointment. Please try again.');
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Book New Appointment" />
            <Card className="mx-auto mt-12 max-w-lg rounded-xl bg-white p-10 shadow-lg">
                <h1 className="mb-6 text-3xl font-extrabold tracking-wide text-blue-600">Book New Appointment</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="space-y-6"
                >
                    <div>
                        <Label htmlFor="patient" className="mb-1 block font-semibold text-gray-700">
                            Patient Name
                        </Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="input w-full rounded-md border border-gray-300 bg-blue-50 px-4 py-2 text-left shadow-sm transition hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    aria-haspopup="listbox"
                                    aria-expanded={!!data.patient_id}
                                >
                                    {patients.find((p) => p.id.toString() === data.patient_id)?.full_name || 'Select a patient'}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="rounded-md border border-gray-200 bg-white shadow-md">
                                {patients.map((patient) => (
                                    <DropdownMenuItem
                                        key={patient.id}
                                        onSelect={() => setData('patient_id', patient.id.toString())}
                                        className={`cursor-pointer px-4 py-2 transition select-none hover:bg-blue-100 ${data.patient_id === patient.id.toString() ? 'bg-blue-200 font-semibold' : ''}`}
                                    >
                                        {patient.full_name} ({patient.nic})
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {errors.patient_id && <p className="mt-1 text-sm text-red-600">{errors.patient_id}</p>}
                    </div>
                    <div>
                        <Label htmlFor="appointmentType" className="mb-1 block font-semibold text-gray-700">
                            Appointment Type
                        </Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="input w-full rounded-md border border-gray-300 bg-blue-50 px-4 py-2 text-left shadow-sm transition hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    aria-haspopup="listbox"
                                    aria-expanded={!!data.appointment_type}
                                >
                                    {data.appointment_type || 'Select appointment type'}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="rounded-md border border-gray-200 bg-white shadow-md">
                                {appointmentTypes.map((type) => (
                                    <DropdownMenuItem
                                        key={type}
                                        onSelect={() => setData('appointment_type', type)}
                                        className={`cursor-pointer px-4 py-2 transition select-none hover:bg-blue-100 ${data.appointment_type === type ? 'bg-blue-200 font-semibold' : ''}`}
                                    >
                                        {type}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {errors.appointment_type && <p className="mt-1 text-sm text-red-600">{errors.appointment_type}</p>}
                    </div>
                    <div>
                        <Label htmlFor="date" className="mb-1 block font-semibold text-gray-700">
                            Appointment Date
                        </Label>
                        <Input
                            type="date"
                            id="date"
                            value={data.appointment_date}
                            onChange={(e) => setData('appointment_date', e.target.value)}
                            required
                            className="w-full rounded-md border border-gray-300 bg-blue-50 px-4 py-2 shadow-sm transition focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                        {errors.appointment_date && <p className="mt-1 text-sm text-red-600">{errors.appointment_date}</p>}
                    </div>
                    <div>
                        <Label htmlFor="time" className="mb-1 block font-semibold text-gray-700">
                            Appointment Time
                        </Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="input w-full rounded-md border border-gray-300 bg-blue-50 px-4 py-2 text-left shadow-sm transition hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    aria-haspopup="listbox"
                                    aria-expanded={!!data.appointment_time}
                                >
                                    {data.appointment_time || 'Select a time slot'}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="rounded-md border border-gray-200 bg-white shadow-md">
                                {[
                                    '09:00',
                                    '09:30',
                                    '10:00',
                                    '10:30',
                                    '11:00',
                                    '11:30',
                                    '12:00',
                                    '12:30',
                                    '13:00',
                                    '13:30',
                                    '14:00',
                                    '14:30',
                                    '15:00',
                                    '15:30',
                                    '16:00',
                                    '16:30',
                                    '17:00',
                                ].map((time) => (
                                    <DropdownMenuItem
                                        key={time}
                                        onSelect={() => setData('appointment_time', time)}
                                        className={`cursor-pointer px-4 py-2 transition select-none hover:bg-blue-100 ${data.appointment_time === time ? 'bg-blue-200 font-semibold' : ''}`}
                                    >
                                        {time}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {errors.appointment_time && <p className="mt-1 text-sm text-red-600">{errors.appointment_time}</p>}
                    </div>

                    <div>
                        <Label htmlFor="reason" className="mb-1 block font-semibold text-gray-700">
                            Reason for Appointment
                        </Label>
                        <Input
                            id="reason"
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            placeholder="Brief description"
                            required
                            className="w-full rounded-md border border-gray-300 bg-blue-50 px-4 py-2 shadow-sm transition focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                        {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
                    </div>
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="confirmationSent"
                            checked={data.confirmation_sent}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('confirmation_sent', e.target.checked)}
                            className="form-checkbox h-5 w-5 text-blue-600 transition duration-200 ease-in-out"
                        />
                        <Label htmlFor="confirmationSent" className="font-medium text-gray-700">
                            Send Confirmation SMS/Email
                        </Label>
                    </div>
                    <div>
                        <Label htmlFor="notes" className="mb-1 block font-semibold text-gray-700">
                            Additional Notes
                        </Label>
                        <textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-blue-50 p-3 shadow-sm transition focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            rows={3}
                        />
                    </div>
                    {'api' in errors && typeof errors.api === 'string' && <p className="mb-4 text-red-600">{errors.api}</p>}
                    {apiError && <p className="mb-4 text-red-600">{apiError}</p>}
                    {successMessage && <p className="mb-4 text-green-600">{successMessage}</p>}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-3 text-lg font-semibold transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-700"
                        >
                            {processing ? 'Booking...' : 'Book Appointment'}
                        </Button>
                    </div>
                </form>
            </Card>
        </AppLayout>
    );
};

export default BookAppointment;
