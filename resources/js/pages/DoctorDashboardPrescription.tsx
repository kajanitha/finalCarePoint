import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import AppLayout from '../layouts/app-layout';

interface Medication {
    id: number;
    name: string;
}

interface Prescription {
    id: number;
    medication: Medication;
    dosage: string;
    frequency: string;
    duration: string;
    notes?: string;
    created_at: string;
}

interface Props {
    patientId: number;
}

const DoctorDashboardPrescription: React.FC<Props> = ({ patientId }) => {
    const [medications, setMedications] = useState<Medication[]>([]);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [selectedMedicationId, setSelectedMedicationId] = useState<number | null>(null);
    const [dosage, setDosage] = useState('');
    const [frequency, setFrequency] = useState('');
    const [duration, setDuration] = useState('');
    const [notes, setNotes] = useState('');
    const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        fetchMedications();
        fetchPrescriptions();
    }, [patientId]);

    const fetchMedications = async () => {
        try {
            const response = await axios.get('/api/medications');
            setMedications(response.data);
        } catch (error) {
            console.error('Failed to fetch medications', error);
        }
    };

    const fetchPrescriptions = async () => {
        try {
            const response = await axios.get(`/api/patients/${patientId}/prescriptions`);
            setPrescriptions(response.data);
        } catch (error) {
            console.error('Failed to fetch prescriptions', error);
        }
    };

    const resetForm = () => {
        setSelectedMedicationId(null);
        setDosage('');
        setFrequency('');
        setDuration('');
        setNotes('');
        setEditingPrescription(null);
    };

    const handleSubmit = async () => {
        if (!selectedMedicationId || !dosage || !frequency || !duration) {
            alert('Please fill all required fields');
            return;
        }

        try {
            if (editingPrescription) {
                await axios.put(`/api/prescriptions/${editingPrescription.id}`, {
                    medication_id: selectedMedicationId,
                    dosage,
                    frequency,
                    duration,
                    notes,
                });
            } else {
                await axios.post('/api/prescriptions', {
                    patient_id: patientId,
                    doctor_id: 1, // TODO: Replace with actual logged-in doctor ID
                    medication_id: selectedMedicationId,
                    dosage,
                    frequency,
                    duration,
                    notes,
                });
            }
            fetchPrescriptions();
            resetForm();
            setDialogOpen(false);
        } catch (error) {
            console.error('Failed to save prescription', error);
            alert('Failed to save prescription');
        }
    };

    const handleEdit = (prescription: Prescription) => {
        setEditingPrescription(prescription);
        setSelectedMedicationId(prescription.medication.id);
        setDosage(prescription.dosage);
        setFrequency(prescription.frequency);
        setDuration(prescription.duration);
        setNotes(prescription.notes || '');
        setDialogOpen(true);
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Prescriptions', href: '/doctor/prescriptions' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div>
                <h2 className="mb-4 text-2xl font-bold text-blue-500">Prescription Management</h2>
                <Button
                    onClick={() => {
                        resetForm();
                        setDialogOpen(true);
                    }}
                >
                    Create New Prescription
                </Button>

                <div className="mt-6 space-y-4">
                    {prescriptions.map((prescription) => (
                        <Card key={prescription.id} className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p>
                                        <strong>Medication:</strong> {prescription.medication.name}
                                    </p>
                                    <p>
                                        <strong>Dosage:</strong> {prescription.dosage}
                                    </p>
                                    <p>
                                        <strong>Frequency:</strong> {prescription.frequency}
                                    </p>
                                    <p>
                                        <strong>Duration:</strong> {prescription.duration}
                                    </p>
                                    {prescription.notes && (
                                        <p>
                                            <strong>Notes:</strong> {prescription.notes}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-500">Issued on: {new Date(prescription.created_at).toLocaleDateString()}</p>
                                </div>
                                <Button variant="outline" onClick={() => handleEdit(prescription)}>
                                    Edit
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="bg-opacity-30 bg-white backdrop-blur">
                        <DialogHeader>
                            <DialogTitle>{editingPrescription ? 'Edit Prescription' : 'New Prescription'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="medication">Medication</Label>
                                <Select
                                    value={selectedMedicationId !== null ? selectedMedicationId.toString() : undefined}
                                    onValueChange={(value) => setSelectedMedicationId(value ? Number(value) : null)}
                                >
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
                            </div>
                            <div>
                                <Label htmlFor="dosage">Dosage</Label>
                                <Input id="dosage" value={dosage} onChange={(e) => setDosage(e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="frequency">Frequency</Label>
                                <Input id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="duration">Duration</Label>
                                <Input id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="notes">Notes</Label>
                                <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit}>{editingPrescription ? 'Update' : 'Create'}</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
};

export default DoctorDashboardPrescription;
