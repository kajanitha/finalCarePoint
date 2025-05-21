import { Head, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import AppLayout from '../layouts/app-layout';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Prescriptions', href: '/doctor/prescriptions' },
    { title: 'Create Prescription', href: '/doctor/prescriptions/create' },
];

interface Medication {
    id: number;
    name: string;
}

interface FormData {
    [key: string]: any;
    patient_id: string;
    medication_id: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes: string;
}

const CreatePrescription: React.FC = () => {
    const { patients, medications } = usePage().props as unknown as { patients: { id: number; full_name: string }[]; medications: Medication[] };

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        patient_id: '',
        medication_id: '',
        dosage: '',
        frequency: '',
        duration: '',
        notes: '',
    });

    const [successMessage, setSuccessMessage] = React.useState<string>('');
    const [apiError, setApiError] = React.useState<string>('');

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (data.patient_id === '') newErrors.patient_id = 'Patient is required';
        if (data.medication_id === '') newErrors.medication_id = 'Medication is required';
        if (data.dosage === '') newErrors.dosage = 'Dosage is required';
        if (data.frequency === '') newErrors.frequency = 'Frequency is required';
        if (data.duration === '') newErrors.duration = 'Duration is required';
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        post('/prescriptions', {
            onSuccess: () => {
                reset();
                setSuccessMessage('Prescription created successfully!');
                setApiError('');
            },
            onError: (error: any) => {
                if (error && typeof error === 'object') {
                    if ('status' in error && error.status === 401) {
                        setApiError('You are not authenticated. Please login.');
                    } else if ('status' in error && error.status === 422) {
                        const validationErrors = error.errors || {};
                        const messages = Object.values(validationErrors).flat().join(' ');
                        setApiError(messages || 'Validation failed. Please check your input.');
                    } else if ('api' in error) {
                        setApiError(error.api);
                    } else {
                        setApiError('Failed to create prescription. Please try again.');
                    }
                } else {
                    setApiError('Failed to create prescription. Please try again.');
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Prescription" />
            <Card className="mx-auto mt-12 max-w-lg rounded-xl bg-white p-10 shadow-lg">
                <h1 className="mb-6 text-3xl font-extrabold tracking-wide text-blue-600">Create Prescription</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="space-y-6"
                >
                    <div>
                        <Label htmlFor="patient" className="mb-1 block font-semibold text-gray-700">
                            Patient
                        </Label>
                        <Select value={data.patient_id} onValueChange={(value) => setData('patient_id', value)}>
                            <SelectTrigger id="patient" className="w-full">
                                <SelectValue placeholder="Select patient" />
                            </SelectTrigger>
                            <SelectContent>
                                {patients.map((patient) => (
                                    <SelectItem key={patient.id} value={patient.id.toString()}>
                                        {patient.full_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.patient_id && <p className="mt-1 text-sm text-red-600">{errors.patient_id}</p>}
                    </div>
                    <div>
                        <Label htmlFor="medication" className="mb-1 block font-semibold text-gray-700">
                            Medication
                        </Label>
                        <Select value={data.medication_id} onValueChange={(value) => setData('medication_id', value)}>
                            <SelectTrigger id="medication" className="w-full">
                                <SelectValue placeholder="Select medication" />
                            </SelectTrigger>
                            <SelectContent>
                                {medications.map((med) => (
                                    <SelectItem key={med.id} value={med.id.toString()}>
                                        {med.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.medication_id && <p className="mt-1 text-sm text-red-600">{errors.medication_id}</p>}
                    </div>
                    <div>
                        <Label htmlFor="dosage" className="mb-1 block font-semibold text-gray-700">
                            Dosage
                        </Label>
                        <Input id="dosage" value={data.dosage} onChange={(e) => setData('dosage', e.target.value)} required />
                        {errors.dosage && <p className="mt-1 text-sm text-red-600">{errors.dosage}</p>}
                    </div>
                    <div>
                        <Label htmlFor="frequency" className="mb-1 block font-semibold text-gray-700">
                            Frequency
                        </Label>
                        <Input id="frequency" value={data.frequency} onChange={(e) => setData('frequency', e.target.value)} required />
                        {errors.frequency && <p className="mt-1 text-sm text-red-600">{errors.frequency}</p>}
                    </div>
                    <div>
                        <Label htmlFor="duration" className="mb-1 block font-semibold text-gray-700">
                            Duration
                        </Label>
                        <Input id="duration" value={data.duration} onChange={(e) => setData('duration', e.target.value)} required />
                        {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
                    </div>
                    <div>
                        <Label htmlFor="notes" className="mb-1 block font-semibold text-gray-700">
                            Notes
                        </Label>
                        <Input id="notes" value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
                    </div>
                    {apiError && <p className="mb-4 text-red-600">{apiError}</p>}
                    {successMessage && <p className="mb-4 text-green-600">{successMessage}</p>}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-3 text-lg font-semibold transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-700"
                        >
                            {processing ? 'Creating...' : 'Create Prescription'}
                        </Button>
                    </div>
                </form>
            </Card>
        </AppLayout>
    );
};

export default CreatePrescription;
