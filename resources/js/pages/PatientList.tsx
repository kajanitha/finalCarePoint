import { Head, Link, router, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import AppLayout from '../layouts/app-layout';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Patient List', href: '/patients' },
];

interface Patient {
    id: number;
    full_name: string;
    nic: string;
    contact_number: string;
}

const PatientList: React.FC = () => {
    const { patients } = usePage().props as unknown as { patients: Patient[] };
    const [search, setSearch] = useState('');
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>(patients || []);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

    // State for dialog open and selected patient
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    // Toast state
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [showToast, setShowToast] = useState(false);

    const exportToCSV = () => {
        if (!filteredPatients || filteredPatients.length === 0) {
            alert('No patients to export.');
            return;
        }
        const headers = ['Full Name', 'NIC', 'Phone Number'];
        const rows = filteredPatients.map((p) => [p.full_name, p.nic, p.contact_number]);

        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += headers.join(',') + '\r\n';
        rows.forEach((rowArray) => {
            let row = rowArray.map((item) => `"${item}"`).join(',');
            csvContent += row + '\r\n';
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'patients_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        if (search.trim() === '') {
            setFilteredPatients(patients);
        } else {
            const filtered = patients.filter(
                (patient) =>
                    patient.full_name.toLowerCase().includes(search.toLowerCase()) || patient.nic.toLowerCase().includes(search.toLowerCase()),
            );
            setFilteredPatients(filtered);
        }
        setCurrentPage(1); // Reset to first page on search change
    }, [search, patients]);

    // Handler to open delete confirmation dialog
    const openDeleteDialog = (patient: Patient) => {
        setSelectedPatient(patient);
        setIsDialogOpen(true);
    };

    // Handler for confirming delete
    const confirmDelete = () => {
        if (selectedPatient) {
            router.delete(`/patients/${selectedPatient.id}`, {
                onSuccess: () => {
                    setToastMessage('Patient deleted successfully');
                    setToastType('success');
                    setShowToast(true);
                    setFilteredPatients((prev) => prev.filter((p) => p.id !== selectedPatient.id));
                },
                onError: (error: { message?: string }) => {
                    setToastMessage(`Failed to delete patient: ${error.message || 'Unknown error'}`);
                    setToastType('error');
                    setShowToast(true);
                },
            });
            setIsDialogOpen(false);
            setSelectedPatient(null);
        }
    };

    // Handler for canceling delete
    const cancelDelete = () => {
        setIsDialogOpen(false);
        setSelectedPatient(null);
    };

    // Pagination handlers
    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    // Get current page patients
    const indexOfLastPatient = currentPage * itemsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - itemsPerPage;
    const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patient List" />
            <Card className="mx-auto mt-10 w-196 max-w-full rounded-lg bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-extrabold tracking-wide text-blue-600">Patient List</h1>
                    <button
                        className="rounded-md bg-blue-600 px-5 py-2 font-semibold text-white shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 focus:outline-none"
                        onClick={exportToCSV}
                        aria-label="Export patients to CSV"
                    >
                        Export
                    </button>
                </div>
                <div className="mb-6">
                    <Input
                        type="text"
                        placeholder="Search by name or NIC"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 placeholder-gray-400 transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                {filteredPatients.length === 0 ? (
                    <p className="mt-10 text-center text-lg text-gray-500">No patients found.</p>
                ) : (
                    <>
                        <table className="w-full table-auto border-collapse overflow-hidden rounded-lg shadow-md">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-blue-300 px-4 py-3 text-left font-semibold text-gray-700">Full Name</th>
                                    <th className="border border-blue-300 px-4 py-3 text-left font-semibold text-gray-700">NIC</th>
                                    <th className="border border-blue-300 px-4 py-3 text-left font-semibold text-gray-700">Phone Number</th>
                                    <th className="border border-blue-300 px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPatients.map((patient) => (
                                    <tr key={patient.id} className="border border-blue-200 transition-colors duration-200 hover:bg-blue-50">
                                        <td className="border border-blue-200 px-4 py-3">
                                            <Link href={`/patients/${patient.id}`} className="font-medium text-blue-600 hover:underline">
                                                {patient.full_name}
                                            </Link>
                                        </td>
                                        <td className="border border-blue-200 px-4 py-3">{patient.nic}</td>
                                        <td className="border border-blue-200 px-4 py-3">{patient.contact_number}</td>
                                        <td className="space-x-3 border border-blue-200 px-4 py-3">
                                            <Link
                                                href={`/patients/${patient.id}/edit`}
                                                className="inline-block rounded-md px-4 py-1 font-semibold text-green-500 transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-green-100"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => openDeleteDialog(patient)}
                                                className="inline-block rounded-md px-4 py-1 font-semibold text-red-500 transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-red-100"
                                            >
                                                Delete
                                            </button>
                                            <Link
                                                href={`/patients/${patient.id}`}
                                                className="inline-block rounded-md px-4 py-1 font-semibold text-blue-500 transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-100"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {/* Confirmation Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Delete</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            Are you sure you want to delete patient <strong>{selectedPatient ? selectedPatient.full_name : ''}</strong>? This action
                            cannot be undone.
                        </DialogDescription>
                        <DialogFooter>
                            <button onClick={cancelDelete} className="rounded-md bg-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-400">
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="ml-2 rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </Card>
        </AppLayout>
    );
};

export default PatientList;
