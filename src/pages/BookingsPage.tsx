
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Booking, Flight, Passenger } from '@/types/database';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import Header from '@/components/Header';

const BookingsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: bookings, isLoading } = useQuery({
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

  const filteredBookings = bookings?.filter((booking: any) => 
    booking.passenger?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.flight?.flight_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.seat_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                    <TableCell>${booking.total_price}</TableCell>
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
