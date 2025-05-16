import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import AppLayout from '../layouts/app-layout';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Patient List', href: '/patients' },
    { title: 'Edit Patient', href: '' },
];

const genderOptions = ['Male', 'Female', 'Other'];
const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];
const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const PatientEdit: React.FC = () => {
    const { patient } = usePage().props as unknown as { patient: any };

    const { data, setData, put, processing, errors } = useForm({
        full_name: patient.full_name || '',
        nic: patient.nic || '',
        date_of_birth: patient.date_of_birth || '',
        gender: patient.gender || '',
        street_address: patient.street_address || '',
        city: patient.city || '',
        district: patient.district || '',
        province: patient.province || '',
        contact_number: patient.contact_number || '',
        email_address: patient.email_address || '',
        marital_status: patient.marital_status || '',
        emergency_contact_name: patient.emergency_contact_name || '',
        emergency_contact_number: patient.emergency_contact_number || '',
        emergency_contact_relationship: patient.emergency_contact_relationship || '',
        blood_group: patient.blood_group || '',
        known_allergies: patient.known_allergies || '',
        current_medications: patient.current_medications || '',
        past_medical_history: patient.past_medical_history || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('patients.update', patient.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Patient" />
            <form onSubmit={handleSubmit} className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-lg">
                <h1 className="mb-8 text-3xl font-extrabold tracking-wide text-blue-600">Edit Patient</h1>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <Label htmlFor="full_name" className="font-semibold text-gray-700">
                            Full Name
                        </Label>
                        <Input
                            id="full_name"
                            value={data.full_name}
                            onChange={(e) => setData('full_name', e.target.value)}
                            className={`rounded-md border px-3 py-2 transition focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                errors.full_name ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.full_name && <p className="mt-1 text-sm text-red-500">{errors.full_name}</p>}
                    </div>

                    <div>
                        <Label htmlFor="nic" className="font-semibold text-gray-700">
                            NIC
                        </Label>
                        <Input
                            id="nic"
                            value={data.nic}
                            onChange={(e) => setData('nic', e.target.value)}
                            className={`rounded-md border px-3 py-2 transition focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                errors.nic ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.nic && <p className="mt-1 text-sm text-red-500">{errors.nic}</p>}
                    </div>

                    <div>
                        <Label htmlFor="date_of_birth" className="font-semibold text-gray-700">
                            Date of Birth
                        </Label>
                        <Input
                            id="date_of_birth"
                            type="date"
                            value={data.date_of_birth}
                            onChange={(e) => setData('date_of_birth', e.target.value)}
                            className={`rounded-md border px-3 py-2 transition focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                errors.date_of_birth ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.date_of_birth && <p className="mt-1 text-sm text-red-500">{errors.date_of_birth}</p>}
                    </div>

                    <div>
                        <Label htmlFor="gender" className="font-semibold text-gray-700">
                            Gender
                        </Label>
                        <select
                            id="gender"
                            value={data.gender}
                            onChange={(e) => setData('gender', e.target.value)}
                            className={`w-full rounded-md border px-3 py-2 transition focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                errors.gender ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Select Gender</option>
                            {genderOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
                    </div>

                    <div>
                        <Label htmlFor="street_address" className="font-semibold text-gray-700">
                            Street Address
                        </Label>
                        <Input
                            id="street_address"
                            value={data.street_address}
                            onChange={(e) => setData('street_address', e.target.value)}
                            className={`rounded-md border px-3 py-2 transition focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                errors.street_address ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.street_address && <p className="mt-1 text-sm text-red-500">{errors.street_address}</p>}
                    </div>

                    <div>
                        <Label htmlFor="city" className="font-semibold text-gray-700">
                            City
                        </Label>
                        <Input
                            id="city"
                            value={data.city}
                            onChange={(e) => setData('city', e.target.value)}
                            className={`rounded-md border px-3 py-2 transition focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                errors.city ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                    </div>

                    <div>
                        <Label htmlFor="district" className="font-semibold text-gray-700">
                            District
                        </Label>
                        <Input
                            id="district"
                            value={data.district}
                            onChange={(e) => setData('district', e.target.value)}
                            className={`rounded-md border px-3 py-2 transition focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                errors.district ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.district && <p className="mt-1 text-sm text-red-500">{errors.district}</p>}
                    </div>

                    <div>
                        <Label htmlFor="province" className="font-semibold text-gray-700">
                            Province
                        </Label>
                        <Input
                            id="province"
                            value={data.province}
                            onChange={(e) => setData('province', e.target.value)}
                            className={`rounded-md border px-3 py-2 transition focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                errors.province ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.province && <p className="mt-1 text-sm text-red-500">{errors.province}</p>}
                    </div>

                    <div>
                        <Label htmlFor="contact_number" className="font-semibold text-gray-700">
                            Contact Number
                        </Label>
                        <Input
                            id="contact_number"
                            value={data.contact_number}
                            onChange={(e) => setData('contact_number', e.target.value)}
                            className={`rounded-md border px-3 py-2 transition focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                errors.contact_number ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.contact_number && <p className="mt-1 text-sm text-red-500">{errors.contact_number}</p>}
                    </div>

                    <div>
                        <Label htmlFor="email_address" className="font-semibold text-gray-700">
                            Email Address
                        </Label>
                        <Input
                            id="email_address"
                            type="email"
                            value={data.email_address}
                            onChange={(e) => setData('email_address', e.target.value)}
                            className={`rounded-md border px-3 py-2 transition focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                errors.email_address ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.email_address && <p className="mt-1 text-sm text-red-500">{errors.email_address}</p>}
                    </div>

                    <div>
                        <Label htmlFor="marital_status" className="font-semibold text-gray-700">
                            Marital Status
                        </Label>
                        <select
                            id="marital_status"
                            value={data.marital_status}
                            onChange={(e) => setData('marital_status', e.target.value)}
                            className={`w-full rounded-md border px-3 py-2 transition focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                errors.marital_status ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Select Marital Status</option>
                            {maritalStatusOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        {errors.marital_status && <p className="mt-1 text-sm text-red-500">{errors.marital_status}</p>}
                    </div>

                    <div>
                        <Label htmlFor="emergency_contact_name" className="font-semibold text-gray-700">
                            Emergency Contact Name
                        </Label>
                        <Input
                            id="emergency_contact_name"
                            value={data.emergency_contact_name}
                            onChange={(e) => setData('emergency_contact_name', e.target.value)}
                            className={`rounded-md border px-3 py-2 transition focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                errors.emergency_contact_name ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.emergency_contact_name && <p className="mt-1 text-sm text-red-500">{errors.emergency_contact_name}</p>}
                    </div>

                    <div>
                        <Label htmlFor="emergency_contact_number" className="font-semibold text-gray-700">
                            Emergency Contact Number
                        </Label>
                        <Input
                            id="emergency_contact_number"
                            value={data.emergency_contact_number}
                            onChange={(e) => setData('emergency_contact_number', e.target.value)}
                            className={`rounded-md border px-3 py-2 transition focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                errors.emergency_contact_number ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.emergency_contact_number && <p className="mt-1 text-sm text-red-500">{errors.emergency_contact_number}</p>}
                    </div>

                    <div>
                        <Label htmlFor="emergency_contact_relationship" className="font-semibold text-gray-700">
                            Emergency Contact Relationship
                        </Label>
                        <Input
                            id="emergency_contact_relationship"
                            value={data.emergency_contact_relationship}
                            onChange={(e) => setData('emergency_contact_relationship', e.target.value)}
                            className={`rounded-md border px-3 py-2 transition focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                errors.emergency_contact_relationship ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.emergency_contact_relationship && (
                            <p className="mt-1 text-sm text-red-500">{errors.emergency_contact_relationship}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="blood_group" className="font-semibold text-gray-700">
                            Blood Group
                        </Label>
                        <select
                            id="blood_group"
                            value={data.blood_group}
                            onChange={(e) => setData('blood_group', e.target.value)}
                            className={`w-full rounded-md border px-3 py-2 transition focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                errors.blood_group ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Select Blood Group</option>
                            {bloodGroupOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        {errors.blood_group && <p className="mt-1 text-sm text-red-500">{errors.blood_group}</p>}
                    </div>

                    <div>
                        <Label htmlFor="known_allergies" className="font-semibold text-gray-700">
                            Known Allergies
                        </Label>
                        <Input
                            id="known_allergies"
                            value={data.known_allergies}
                            onChange={(e) => setData('known_allergies', e.target.value)}
                            className={`rounded-md border px-3 py-2 transition focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                errors.known_allergies ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.known_allergies && <p className="mt-1 text-sm text-red-500">{errors.known_allergies}</p>}
                    </div>

                    <div>
                        <Label htmlFor="current_medications" className="font-semibold text-gray-700">
                            Current Medications
                        </Label>
                        <Input
                            id="current_medications"
                            value={data.current_medications}
                            onChange={(e) => setData('current_medications', e.target.value)}
                            className={`rounded-md border px-3 py-2 transition focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                errors.current_medications ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.current_medications && <p className="mt-1 text-sm text-red-500">{errors.current_medications}</p>}
                    </div>

                    <div>
                        <Label htmlFor="past_medical_history" className="font-semibold text-gray-700">
                            Past Medical History
                        </Label>
                        <Input
                            id="past_medical_history"
                            value={data.past_medical_history}
                            onChange={(e) => setData('past_medical_history', e.target.value)}
                            className={`rounded-md border px-3 py-2 transition focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                errors.past_medical_history ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.past_medical_history && <p className="mt-1 text-sm text-red-500">{errors.past_medical_history}</p>}
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-6">
                    <Link
                        href="/patients"
                        className="rounded-md border border-gray-300 px-8 py-2 text-gray-700 transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-gray-100"
                    >
                        Cancel
                    </Link>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="rounded-md border border-blue-600 bg-blue-600 px-8 py-2 text-white transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-700"
                    >
                        Save
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
};

export default PatientEdit;
