import { Head, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import Toast from '../components/ui/Toast';
import AppLayout from '../layouts/app-layout';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Register New Patient', href: '/doctor/appointments' },
];

const districts = [
    'Colombo',
    'Gampaha',
    'Kalutara',
    'Kandy',
    'Matale',
    'Nuwara Eliya',
    'Galle',
    'Matara',
    'Hambantota',
    'Jaffna',
    'Kilinochchi',
    'Mannar',
    'Vavuniya',
    'Mullaitivu',
    'Batticaloa',
    'Ampara',
    'Trincomalee',
    'Kurunegala',
    'Puttalam',
    'Anuradhapura',
    'Polonnaruwa',
    'Badulla',
    'Moneragala',
    'Ratnapura',
    'Kegalle',
];

const provincesByDistrict: { [key: string]: string[] } = {
    Colombo: ['Western'],
    Gampaha: ['Western'],
    Kalutara: ['Western'],
    Kandy: ['Central'],
    Matale: ['Central'],
    'Nuwara Eliya': ['Central'],
    Galle: ['Southern'],
    Matara: ['Southern'],
    Hambantota: ['Southern'],
    Jaffna: ['Northern'],
    Kilinochchi: ['Northern'],
    Mannar: ['Northern'],
    Vavuniya: ['Northern'],
    Mullaitivu: ['Northern'],
    Batticaloa: ['Eastern'],
    Ampara: ['Eastern'],
    Trincomalee: ['Eastern'],
    Kurunegala: ['North Western'],
    Puttalam: ['North Western'],
    Anuradhapura: ['North Central'],
    Polonnaruwa: ['North Central'],
    Badulla: ['Uva'],
    Moneragala: ['Uva'],
    Ratnapura: ['Sabaragamuwa'],
    Kegalle: ['Sabaragamuwa'],
};

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];

const PatientRegistrationForm: React.FC = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        full_name: '',
        nic: '',
        date_of_birth: '',
        gender: '',
        street_address: '',
        city: '',
        district: '',
        province: '',
        contact_number: '',
        email_address: '',
        marital_status: '',
        emergency_contact_name: '',
        emergency_contact_number: '',
        emergency_contact_relationship: '',
        blood_group: '',
        known_allergies: '',
        current_medications: '',
        past_medical_history: '',
    });

    const [provinces, setProvinces] = useState<string[]>([]);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVisible, setToastVisible] = useState(false);

    useEffect(() => {
        if (data.district) {
            setProvinces(provincesByDistrict[data.district] || []);
            if (!provincesByDistrict[data.district]?.includes(data.province)) {
                setData('province', '');
            }
        } else {
            setProvinces([]);
            setData('province', '');
        }
    }, [data.district]);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!data.full_name) newErrors.full_name = 'Full Name is required';
        if (!data.nic) newErrors.nic = 'NIC is required';
        if (!data.date_of_birth) newErrors.date_of_birth = 'Date of Birth is required';
        if (!data.gender) newErrors.gender = 'Gender is required';
        if (!data.street_address) newErrors.street_address = 'Street Address is required';
        if (!data.city) newErrors.city = 'City is required';
        if (!data.district) newErrors.district = 'District is required';
        if (!data.province) newErrors.province = 'Province is required';
        if (!data.contact_number) newErrors.contact_number = 'Contact Number is required';
        else if (!/^07\d{8}$/.test(data.contact_number)) newErrors.contact_number = 'Invalid Sri Lankan mobile number';
        if (!data.emergency_contact_name) newErrors.emergency_contact_name = 'Emergency Contact Name is required';
        if (!data.emergency_contact_number) newErrors.emergency_contact_number = 'Emergency Contact Number is required';
        if (!data.emergency_contact_relationship) newErrors.emergency_contact_relationship = 'Emergency Contact Relationship is required';
        if (!data.marital_status) newErrors.marital_status = '';
        return newErrors;
    };

    const handleChange = (field: string, value: string) => {
        setData(field as keyof typeof data, value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/patients', {
            preserveScroll: true,
            onSuccess: () => {
                setToastMessage('Successfully Registered');
                setToastVisible(true);
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Register New Patient" />
            <Card className="mx-auto mt-10 max-w-4xl rounded-lg bg-white p-10 shadow-lg">
                <h1 className="mb-6 text-3xl font-extrabold tracking-wide text-blue-600">Register New Patient</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <Label htmlFor="full_name" className="font-semibold text-gray-700">
                                Full Name *
                            </Label>
                            <Input
                                id="full_name"
                                name="full_name"
                                value={data.full_name}
                                onChange={(e) => handleChange('full_name', e.target.value)}
                                required
                                className="w-full rounded-md border border-gray-300 bg-blue-50 transition focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter full name"
                            />
                            {errors.full_name && <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>}
                        </div>
                        <div>
                            <Label htmlFor="nic" className="font-semibold text-gray-700">
                                National Identity Card (NIC) *
                            </Label>
                            <Input
                                id="nic"
                                name="nic"
                                value={data.nic}
                                onChange={(e) => handleChange('nic', e.target.value)}
                                required
                                className="w-full rounded-md border border-gray-300 bg-blue-50 transition focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter NIC"
                            />
                            {errors.nic && <p className="mt-1 text-sm text-red-600">{errors.nic}</p>}
                        </div>
                        <div>
                            <Label htmlFor="date_of_birth" className="font-semibold text-gray-700">
                                Date of Birth *
                            </Label>
                            <Input
                                type="date"
                                id="date_of_birth"
                                name="date_of_birth"
                                value={data.date_of_birth}
                                onChange={(e) => handleChange('date_of_birth', e.target.value)}
                                required
                                className="w-full rounded-md border border-gray-300 bg-blue-50 transition focus:ring-2 focus:ring-blue-400"
                            />
                            {errors.date_of_birth && <p className="mt-1 text-sm text-red-600">{errors.date_of_birth}</p>}
                        </div>
                        <div>
                            <Label htmlFor="gender" className="font-semibold text-gray-700">
                                Gender *
                            </Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        className="input w-full rounded-md border border-gray-300 bg-blue-50 px-3 py-2 text-left transition focus:ring-2 focus:ring-blue-400"
                                        aria-haspopup="listbox"
                                        aria-expanded={!!data.gender}
                                    >
                                        {data.gender || 'Select Gender'}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="rounded-md border border-gray-300 bg-white shadow-md">
                                    {['Male', 'Female', 'Other'].map((gender) => (
                                        <DropdownMenuItem
                                            key={gender}
                                            onSelect={() => handleChange('gender', gender)}
                                            className={`cursor-pointer rounded-md px-4 py-2 hover:bg-blue-100 ${data.gender === gender ? 'bg-blue-200 font-semibold' : ''}`}
                                        >
                                            {gender}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                        </div>
                        <div>
                            <Label htmlFor="street_address" className="font-semibold text-gray-700">
                                Street Address *
                            </Label>
                            <Input
                                id="street_address"
                                name="street_address"
                                value={data.street_address}
                                onChange={(e) => handleChange('street_address', e.target.value)}
                                required
                                className="w-full rounded-md border border-gray-300 bg-blue-50 transition focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter street address"
                            />
                            {errors.street_address && <p className="mt-1 text-sm text-red-600">{errors.street_address}</p>}
                        </div>
                        <div>
                            <Label htmlFor="city" className="font-semibold text-gray-700">
                                City *
                            </Label>
                            <Input
                                id="city"
                                name="city"
                                value={data.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                                required
                                className="w-full rounded-md border border-gray-300 bg-blue-50 transition focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter city"
                            />
                            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                        </div>
                        <div>
                            <Label htmlFor="district" className="font-semibold text-gray-700">
                                District *
                            </Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        className="input w-full rounded-md border border-gray-300 bg-blue-50 px-3 py-2 text-left transition focus:ring-2 focus:ring-blue-400"
                                        aria-haspopup="listbox"
                                        aria-expanded={!!data.district}
                                    >
                                        {data.district || 'Select District'}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="max-h-60 overflow-auto rounded-md border border-gray-300 bg-white shadow-md">
                                    {districts.map((district) => (
                                        <DropdownMenuItem
                                            key={district}
                                            onSelect={() => handleChange('district', district)}
                                            className={`cursor-pointer rounded-md px-4 py-2 hover:bg-blue-100 ${data.district === district ? 'bg-blue-200 font-semibold' : ''}`}
                                        >
                                            {district}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {errors.district && <p className="mt-1 text-sm text-red-600">{errors.district}</p>}
                        </div>
                        <div>
                            <Label htmlFor="province" className="font-semibold text-gray-700">
                                Province *
                            </Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        className={`input w-full rounded-md border border-gray-300 bg-blue-50 px-3 py-2 text-left transition focus:ring-2 focus:ring-blue-400 ${!provinces.length ? 'cursor-not-allowed opacity-50' : ''}`}
                                        aria-haspopup="listbox"
                                        aria-expanded={!!data.province}
                                        disabled={!provinces.length}
                                    >
                                        {data.province || 'Select Province'}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="max-h-60 overflow-auto rounded-md border border-gray-300 bg-white shadow-md">
                                    {provinces.map((province) => (
                                        <DropdownMenuItem
                                            key={province}
                                            onSelect={() => handleChange('province', province)}
                                            className={`cursor-pointer rounded-md px-4 py-2 hover:bg-blue-100 ${data.province === province ? 'bg-blue-200 font-semibold' : ''}`}
                                        >
                                            {province}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {errors.province && <p className="mt-1 text-sm text-red-600">{errors.province}</p>}
                        </div>
                        <div>
                            <Label htmlFor="contact_number" className="font-semibold text-gray-700">
                                Contact Number *
                            </Label>
                            <Input
                                id="contact_number"
                                name="contact_number"
                                value={data.contact_number}
                                onChange={(e) => handleChange('contact_number', e.target.value)}
                                required
                                className="w-full rounded-md border border-gray-300 bg-blue-50 transition focus:ring-2 focus:ring-blue-400"
                                placeholder="07XXXXXXXX"
                            />
                            {errors.contact_number && <p className="mt-1 text-sm text-red-600">{errors.contact_number}</p>}
                        </div>
                        <div>
                            <Label htmlFor="email_address" className="font-semibold text-gray-700">
                                Email Address
                            </Label>
                            <Input
                                id="email_address"
                                name="email_address"
                                value={data.email_address}
                                onChange={(e) => handleChange('email_address', e.target.value)}
                                className="w-full rounded-md border border-gray-300 bg-blue-50 transition focus:ring-2 focus:ring-blue-400"
                                placeholder="example@example.com"
                            />
                            {errors.email_address && <p className="mt-1 text-sm text-red-600">{errors.email_address}</p>}
                        </div>
                        <div>
                            <Label htmlFor="marital_status" className="font-semibold text-gray-700">
                                Marital Status
                            </Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        className="input w-full rounded-md border border-gray-300 bg-blue-50 px-3 py-2 text-left transition focus:ring-2 focus:ring-blue-400"
                                        aria-haspopup="listbox"
                                        aria-expanded={!!data.marital_status}
                                    >
                                        {data.marital_status || 'Select Marital Status'}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="max-h-60 overflow-auto rounded-md border border-gray-300 bg-white shadow-md">
                                    {maritalStatuses.map((status) => (
                                        <DropdownMenuItem
                                            key={status}
                                            onSelect={() => handleChange('marital_status', status)}
                                            className={`cursor-pointer rounded-md px-4 py-2 hover:bg-blue-100 ${data.marital_status === status ? 'bg-blue-200 font-semibold' : ''}`}
                                        >
                                            {status}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {errors.marital_status && <p className="mt-1 text-sm text-red-600">{errors.marital_status}</p>}
                        </div>
                        <div>
                            <Label htmlFor="blood_group" className="font-semibold text-gray-700">
                                Blood Group
                            </Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        className="input w-full rounded-md border border-gray-300 bg-blue-50 px-3 py-2 text-left transition focus:ring-2 focus:ring-blue-400"
                                        aria-haspopup="listbox"
                                        aria-expanded={!!data.blood_group}
                                    >
                                        {data.blood_group || 'Select Blood Group'}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="max-h-60 overflow-auto rounded-md border border-gray-300 bg-white shadow-md">
                                    {bloodGroups.map((group) => (
                                        <DropdownMenuItem
                                            key={group}
                                            onSelect={() => handleChange('blood_group', group)}
                                            className={`cursor-pointer rounded-md px-4 py-2 hover:bg-blue-100 ${data.blood_group === group ? 'bg-blue-200 font-semibold' : ''}`}
                                        >
                                            {group}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {errors.blood_group && <p className="mt-1 text-sm text-red-600">{errors.blood_group}</p>}
                        </div>
                    </div>
                    <hr></hr>

                    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="md:col-span-1">
                            <Label htmlFor="emergency_contact_name" className="font-semibold text-gray-700">
                                Emergency Contact Name *
                            </Label>
                            <Input
                                id="emergency_contact_name"
                                name="emergency_contact_name"
                                value={data.emergency_contact_name}
                                onChange={(e) => handleChange('emergency_contact_name', e.target.value)}
                                required
                                className="w-full rounded-md border border-gray-300 bg-blue-50 transition focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter name"
                            />
                            {errors.emergency_contact_name && <p className="mt-1 text-sm text-red-600">{errors.emergency_contact_name}</p>}
                        </div>
                        <div>
                            <Label htmlFor="emergency_contact_number" className="font-semibold text-gray-700">
                                Emergency Contact Number *
                            </Label>
                            <Input
                                id="emergency_contact_number"
                                name="emergency_contact_number"
                                value={data.emergency_contact_number}
                                onChange={(e) => handleChange('emergency_contact_number', e.target.value)}
                                required
                                className="w-full rounded-md border border-gray-300 bg-blue-50 transition focus:ring-2 focus:ring-blue-400"
                                placeholder="07XXXXXXXX"
                            />
                            {errors.emergency_contact_number && <p className="mt-1 text-sm text-red-600">{errors.emergency_contact_number}</p>}
                        </div>
                        <div>
                            <Label htmlFor="emergency_contact_relationship" className="font-semibold text-gray-700">
                                Emergency Contact Relationship *
                            </Label>
                            <Input
                                id="emergency_contact_relationship"
                                name="emergency_contact_relationship"
                                value={data.emergency_contact_relationship}
                                onChange={(e) => handleChange('emergency_contact_relationship', e.target.value)}
                                required
                                className="w-full rounded-md border border-gray-300 bg-blue-50 transition focus:ring-2 focus:ring-blue-400"
                                placeholder="Relationship"
                            />
                            {errors.emergency_contact_relationship && (
                                <p className="mt-1 text-sm text-red-600">{errors.emergency_contact_relationship}</p>
                            )}
                        </div>
                    </div>
                    <hr></hr>
                    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div>
                            <Label htmlFor="known_allergies" className="font-semibold text-gray-700">
                                Known Allergies
                            </Label>
                            <textarea
                                id="known_allergies"
                                name="known_allergies"
                                value={data.known_allergies}
                                onChange={(e) => handleChange('known_allergies', e.target.value)}
                                className="input min-h-[80px] w-full resize-y rounded-md border border-gray-300 bg-blue-50 p-2 transition focus:ring-2 focus:ring-blue-400"
                                placeholder="List any known allergies"
                            />
                            {errors.known_allergies && <p className="mt-1 text-sm text-red-600">{errors.known_allergies}</p>}
                        </div>
                        <div>
                            <Label htmlFor="current_medications" className="font-semibold text-gray-700">
                                Current Medications
                            </Label>
                            <textarea
                                id="current_medications"
                                name="current_medications"
                                value={data.current_medications}
                                onChange={(e) => handleChange('current_medications', e.target.value)}
                                className="input min-h-[80px] w-full resize-y rounded-md border border-gray-300 bg-blue-50 p-2 transition focus:ring-2 focus:ring-blue-400"
                                placeholder="List current medications"
                            />
                            {errors.current_medications && <p className="mt-1 text-sm text-red-600">{errors.current_medications}</p>}
                        </div>
                        <div>
                            <Label htmlFor="past_medical_history" className="font-semibold text-gray-700">
                                Past Medical History
                            </Label>
                            <textarea
                                id="past_medical_history"
                                name="past_medical_history"
                                value={data.past_medical_history}
                                onChange={(e) => handleChange('past_medical_history', e.target.value)}
                                className="input min-h-[80px] w-full resize-y rounded-md border border-gray-300 bg-blue-50 p-2 transition focus:ring-2 focus:ring-blue-400"
                                placeholder="Provide past medical history"
                            />
                            {errors.past_medical_history && <p className="mt-1 text-sm text-red-600">{errors.past_medical_history}</p>}
                        </div>
                    </div>

                    {toastVisible && <Toast message={toastMessage} type="success" onClose={() => setToastVisible(false)} />}

                    <div className="mt-8 flex justify-center">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="rounded-md px-8 py-3 text-lg font-semibold shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-700"
                        >
                            {processing ? 'Registering...' : 'Register Patient'}
                        </Button>
                    </div>
                </form>
            </Card>
        </AppLayout>
    );
};

export default PatientRegistrationForm;
