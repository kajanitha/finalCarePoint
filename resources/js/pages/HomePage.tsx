import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { CalendarIcon, MapPin, Users } from 'lucide-react';
import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { Button } from '../components/ui/button';
import { Calendar } from '../components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../components/ui/carousel';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { ScrollArea } from '../components/ui/scroll-area';
import { cn } from '../lib/utils';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
    },
};

const testimonials = [
    {
        id: 1,
        name: 'Aisha Khan',
        role: 'Patient',
        comment: 'CarePoint made it so easy to find the right clinic and book an appointment. The whole process was smooth and hassle-free.',
        image: '/images/user5.jpeg',
    },
    {
        id: 2,
        name: 'Dr. Imran Ahmed',
        role: 'Clinic Administrator',
        comment: "CarePoint has streamlined our appointment management. It's user-friendly and has helped us improve our efficiency.",
        image: '/images/user1.jpeg',
    },
    {
        id: 3,
        name: 'Sarah Williams',
        role: 'Patient',
        comment: 'I highly recommend CarePoint. The location-based search is very accurate, and I was able to find a clinic near me in minutes.',
        image: '/images/user2.jpeg',
    },
    {
        id: 4,
        name: 'David Lee',
        role: 'Patient',
        comment: 'Great experience using CarePoint.  Easy to use and very efficient.  The reminders are helpful.',
        image: '/images/user4.jpeg',
    },
];

const nearbyClinics = [
    {
        id: 1,
        name: 'City Medical Center',
        address: '123 Main St, Anytown',
        distance: '0.5 km',
        specialization: 'General Practice',
        image: '/images/clinic1.png',
    },
    {
        id: 2,
        name: 'Family Health Clinic',
        address: '456 Oak Ave, Anytown',
        distance: '1.2 km',
        specialization: 'Family Medicine',
        image: '/images/clinic2.png',
    },
    {
        id: 3,
        name: 'Specialist Medical Center',
        address: '789 Pine Ln, Anytown',
        distance: '2.5 km',
        specialization: 'Cardiology',
        image: '/images/clinic3.png',
    },
    {
        id: 4,
        name: 'Childrens Clinic',
        address: '101 Elm St, Anytown',
        distance: '0.8 km',
        specialization: 'Pediatrics',
        image: '/images/clinic4.jpeg',
    },
];

const CarePointHomePage = () => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [date, setDate] = React.useState<Date>();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    return (
        <>
            <Header />
            <motion.div className="space-y-12 bg-white" variants={containerVariants} initial="hidden" animate="visible">
                <section className="bg-gradient-to-r from-blue-500 to-[#1e3a8a] px-4 py-20 text-[#f8f0fb] sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl space-y-6 text-center">
                        <motion.h1 variants={itemVariants} className="animate-fade-in text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                            Your Health, Simplified
                        </motion.h1>
                        <motion.p variants={itemVariants} className="animate-fade-in text-lg sm:text-xl">
                            Find the right clinic, book appointments online, and manage your health journey with CarePoint.
                        </motion.p>
                        <motion.div variants={itemVariants} className="flex justify-center">
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="default"
                                        size="lg"
                                        className="bg-gray-400 px-12 font-semibold text-black transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 hover:bg-green-600"
                                    >
                                        Book an Appointment
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Book an Appointment</DialogTitle>
                                        <DialogDescription>Find a clinic and book your appointment.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="search" className="text-right">
                                                Search
                                            </Label>
                                            <Input
                                                id="search"
                                                placeholder="Search for clinics or services..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="date" className="text-right">
                                                Date
                                            </Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={'outline'}
                                                        className={cn(
                                                            'col-span-3 w-full pl-3 text-left font-normal',
                                                            !date && 'text-muted-foreground',
                                                        )}
                                                    >
                                                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={date}
                                                        onSelect={setDate}
                                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                console.log('Search Query:', searchQuery);
                                                console.log('Selected Date:', date);
                                                setIsDialogOpen(false);
                                            }}
                                            className="bg-blue-500 text-white hover:bg-blue-600"
                                        >
                                            Book
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </motion.div>
                    </div>
                </section>

                <section className="bg-[#f8f0fb] px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-6xl">
                        <h2 className="animate-fade-in mb-12 text-center text-2xl font-semibold text-[#1e3a8a] sm:text-3xl">What Our Users Say</h2>
                        <Carousel
                            opts={{
                                align: 'center',
                                loop: true,
                            }}
                            className="w-full"
                        >
                            <CarouselContent>
                                {testimonials.map((testimonial) => (
                                    <CarouselItem key={testimonial.id} className="animate-slide-in-left md:basis-1/2 lg:basis-1/3">
                                        <div className="p-4">
                                            <Card className="animate-zoom-in border border-gray-200 bg-white/90 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                                                <CardHeader>
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            src={testimonial.image}
                                                            alt={testimonial.name}
                                                            className="h-12 w-12 rounded-full object-cover"
                                                        />
                                                        <div>
                                                            <CardTitle className="text-lg font-semibold text-gray-800">{testimonial.name}</CardTitle>
                                                            <CardDescription className="text-sm text-gray-500">{testimonial.role}</CardDescription>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-gray-700 italic">"{testimonial.comment}"</p>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>
                </section>

                <section className="bg-[#f8f0fb] px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-6xl">
                        <h2 className="animate-fade-in mb-12 text-center text-2xl font-semibold text-[#1e3a8a] sm:text-3xl">Clinics Near You</h2>
                        <ScrollArea className="w-full">
                            <div className="flex w-max gap-6">
                                {nearbyClinics.map((clinic) => (
                                    <Card
                                        key={clinic.id}
                                        className="animate-zoom-in w-full max-w-[300px] border border-gray-200 bg-white/90 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                                    >
                                        <CardHeader>
                                            <img src={clinic.image} alt={clinic.name} className="h-40 w-full rounded-t-lg object-cover" />
                                            <CardTitle className="mt-4 flex items-center gap-1.5 text-lg font-semibold text-gray-800">
                                                {clinic.name}
                                                <Users className="h-4 w-4 text-blue-500" />
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-1 text-sm text-gray-500">
                                                <MapPin className="h-4 w-4" />
                                                {clinic.address}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Specialization:</span> {clinic.specialization}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Distance:</span> {clinic.distance}
                                            </p>
                                        </CardContent>
                                        <CardFooter>
                                            <Button
                                                variant="outline"
                                                className="w-full border-blue-500/30 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-400"
                                                onClick={() => {
                                                    console.log(`View details for clinic ${clinic.id}`);
                                                }}
                                            >
                                                View Details
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </section>

                <section className="bg-[#f8f0fb] px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-6xl space-y-8 text-center">
                        <h2 className="animate-fade-in text-3xl font-bold text-[#1e3a8a] sm:text-4xl">Ready to Get Started?</h2>
                        <p className="animate-fade-in text-lg text-[#1e3a8a]">Find the best care and book your appointment today.</p>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="default"
                                    size="lg"
                                    className="bg-[#6ee7b7] px-8 font-semibold text-[#1e3a8a] transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 hover:bg-green-600"
                                >
                                    Book an Appointment
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Book an Appointment</DialogTitle>
                                    <DialogDescription>Find a clinic and book your appointment.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="search" className="text-right text-[#1e3a8a]">
                                            Search
                                        </Label>
                                        <Input
                                            id="search"
                                            placeholder="Search for clinics or services..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="date-popup" className="text-right text-[#1e3a8a]">
                                            Date
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={'outline'}
                                                    className={cn('col-span-3 w-full pl-3 text-left font-normal', !date && 'text-muted-foreground')}
                                                >
                                                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            console.log('Search Query:', searchQuery);
                                            console.log('Selected Date:', date);
                                            setIsDialogOpen(false);
                                        }}
                                        className="bg-[#6ee7b7] text-[#1e3a8a] hover:bg-[#4dbd9e]"
                                    >
                                        Book
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </section>
            </motion.div>
            <Footer />
        </>
    );
};

export default CarePointHomePage;
