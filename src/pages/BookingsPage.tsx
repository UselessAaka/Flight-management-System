
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Booking, Flight, Passenger } from '@/types/database';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form';
import Header from '@/components/Header';
import { useForm } from 'react-hook-form';

const BookingsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);

  const { data: bookings, isLoading, refetch } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking')
        .select(`
          *,
          flight:flight_id (flight_number, source_airport, destination_airport),
          passenger:passenger_id (name, email)
        `);
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: flights } = useQuery({
    queryKey: ['flights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flight')
        .select('id, flight_number, source_airport, destination_airport, price');
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: passengers } = useQuery({
    queryKey: ['passengers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('passenger')
        .select('id, name, email');
      
      if (error) throw error;
      return data || [];
    }
  });

  const form = useForm({
    defaultValues: {
      flight_id: '',
      passenger_id: '',
      seat_number: '',
      status: 'pending',
      total_price: 0
    }
  });

  const filteredBookings = bookings?.filter((booking: any) => 
    booking.passenger?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.flight?.flight_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.seat_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (values: any) => {
    const selectedFlight = flights?.find(f => f.id === values.flight_id);
    const totalPrice = selectedFlight ? selectedFlight.price : 0;

    const { error } = await supabase
      .from('booking')
      .insert({
        flight_id: values.flight_id,
        passenger_id: values.passenger_id,
        seat_number: values.seat_number,
        status: values.status,
        total_price: totalPrice
      });

    if (error) {
      console.error('Error creating booking:', error);
      return;
    }
    
    setIsNewBookingOpen(false);
    form.reset();
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Bookings Management</h1>
          <div className="flex gap-4">
            <Input 
              placeholder="Search bookings..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Dialog open={isNewBookingOpen} onOpenChange={setIsNewBookingOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="mr-1" /> New Booking</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Booking</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="flight_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Flight</FormLabel>
                          <FormControl>
                            <select 
                              className="w-full p-2 border rounded"
                              {...field}
                            >
                              <option value="">Select a flight</option>
                              {flights?.map((flight) => (
                                <option key={flight.id} value={flight.id}>
                                  {flight.flight_number} ({flight.source_airport} to {flight.destination_airport})
                                </option>
                              ))}
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="passenger_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passenger</FormLabel>
                          <FormControl>
                            <select 
                              className="w-full p-2 border rounded"
                              {...field}
                            >
                              <option value="">Select a passenger</option>
                              {passengers?.map((passenger) => (
                                <option key={passenger.id} value={passenger.id}>
                                  {passenger.name} ({passenger.email})
                                </option>
                              ))}
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="seat_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seat Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. 12A" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <select 
                              className="w-full p-2 border rounded"
                              {...field}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">Create Booking</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Passenger</TableHead>
                <TableHead>Flight</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Seat</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Booking Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">Loading...</TableCell>
                </TableRow>
              ) : filteredBookings?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">No bookings found</TableCell>
                </TableRow>
              ) : (
                filteredBookings?.map((booking: any) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.id.slice(0, 8)}...</TableCell>
                    <TableCell>{booking.passenger?.name}</TableCell>
                    <TableCell>{booking.flight?.flight_number}</TableCell>
                    <TableCell>{booking.flight?.source_airport}</TableCell>
                    <TableCell>{booking.flight?.destination_airport}</TableCell>
                    <TableCell>{booking.seat_number}</TableCell>
                    <TableCell>₹{booking.total_price}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(booking.booking_date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;
