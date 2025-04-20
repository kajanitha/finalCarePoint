import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button'; // Assuming you have Button component
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../components/ui/card'; // Assuming you have Card component
import { Input } from '../components/ui/input'; // Assuming you have Input component
import { Label } from '../components/ui/label';  // Assuming you have Label component
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../components/ui/dialog'; // Assuming you have Dialog component
import { cn } from '../lib/utils'; // Assuming you have cn
import { Calendar } from '../components/ui/calendar'; // Assuming you have Calendar
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover'; // Assuming you have Popover
import { format } from 'date-fns';
import { CalendarIcon, MapPin, Search, User, Users, X } from 'lucide-react'; // Assuming you have CalendarIcon, MapPin, Search, User, Users, X
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../components/ui/carousel'; // Assuming you have Carousel
import { ScrollArea } from '../components/ui/scroll-area'; // Assuming you have ScrollArea
import { Separator } from '../components/ui/separator'; // Assuming you have Separator
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet'; // Assuming you have Sheet
import Header from '../components/Header';
import Footer from '../components/Footer';

// Animation Variants
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

// Dummy Data (Replace with your actual data)
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
        comment: 'CarePoint has streamlined our appointment management. It\'s user-friendly and has helped us improve our efficiency.',
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
    }
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
    }
];

const CarePointHomePage = () => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [date, setDate] = React.useState<Date>();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    return (
        <>
            <Header />
            <motion.div
                className="space-y-12 bg-white"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-500 to-[#1e3a8a] text-[#f8f0fb] py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
                        >
                            Your Health, Simplified
                        </motion.h1>
                        <motion.p
                            variants={itemVariants}
                            className="text-lg sm:text-xl"
                        >
                            Find the right clinic, book appointments online, and manage your health journey with CarePoint.
                        </motion.p>
                        <motion.div variants={itemVariants} className="flex justify-center">
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="default"
                                        size="lg"
                                        className="bg-white hover:bg-gray-100 font-semibold px-8 text-blue-500"
                                    >
                                        Book an Appointment
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Book an Appointment</DialogTitle>
                                        <DialogDescription>
                                            Find a clinic and book your appointment.
                                        </DialogDescription>
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
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal col-span-3",
                                                            !date && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={date}
                                                        onSelect={setDate}
                                                        disabled={(date) =>
                                                            date < new Date(new Date().setHours(0, 0, 0, 0))
                                                        }
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
                                                // Handle the booking logic here.  You'll likely want to
                                                // use the searchQuery and date state to filter clinics
                                                // and show available appointment slots.
                                                console.log('Search Query:', searchQuery);
                                                console.log('Selected Date:', date);
                                                setIsDialogOpen(false); // Close dialog on "Book"
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

            {/* Testimonials Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f8f0fb]">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-[#1e3a8a] text-center mb-12">
                        What Our Users Say
                    </h2>
                    <Carousel
                        opts={{
                            align: "center",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent>
                            {testimonials.map((testimonial) => (
                                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                                    <div className="p-4">
                                        <Card className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg">
                                            <CardHeader>
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={testimonial.image}
                                                        alt={testimonial.name}
                                                        className="w-12 h-12 rounded-full object-cover"
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

            {/* Nearby Clinics Section */}
            <section className="bg-[#f8f0fb] py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-[#1e3a8a] text-center mb-12">
                        Clinics Near You
                    </h2>
                    <ScrollArea className="w-full">
                        <div className="flex gap-6 w-max">
                            {nearbyClinics.map((clinic) => (
                                <Card key={clinic.id} className="w-full max-w-[300px] bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                                    <CardHeader>
                                        <img
                                            src={clinic.image}
                                            alt={clinic.name}
                                            className="w-full h-40 object-cover rounded-t-lg"
                                        />
                                        <CardTitle className="mt-4 text-lg font-semibold text-gray-800 flex items-center gap-1.5">
                                            {clinic.name}
                                            <Users className="w-4 h-4 text-blue-500" />
                                        </CardTitle>
                                        <CardDescription className="text-sm text-gray-500 flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
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
                                            className="w-full bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-400 border-blue-500/30"
                                            onClick={() => {
                                                // Handle the navigation to the clinic details page
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
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f8f0fb]">
                <div className="max-w-6xl mx-auto text-center space-y-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#1e3a8a]">
                        Ready to Get Started?
                    </h2>
                    <p className="text-lg text-[#1e3a8a]">
                        Find the best care and book your appointment today.
                    </p>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="default"
                                size="lg"
                                className="bg-[#6ee7b7] text-[#1e3a8a] hover:bg-[#4dbd9e] font-semibold px-8"
                            >
                                Book an Appointment
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Book an Appointment</DialogTitle>
                                <DialogDescription>
                                    Find a clinic and book your appointment.
                                </DialogDescription>
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
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal col-span-3",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                disabled={(date) =>
                                                    date < new Date(new Date().setHours(0, 0, 0, 0))
                                                }
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
                                        // Handle the booking logic here.  You'll likely want to
                                        // use the searchQuery and date state to filter clinics
                                        // and show available appointment slots.
                                        console.log('Search Query:', searchQuery);
                                        console.log('Selected Date:', date);
                                        setIsDialogOpen(false); // Close dialog on "Book"
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
