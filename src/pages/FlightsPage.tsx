
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Flight, Airline, Airport } from '@/types/database';
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
import { 
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose
} from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import Header from '@/components/Header';

const FlightsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: flights, isLoading, refetch } = useQuery({
    queryKey: ['flights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flight')
        .select('*, airline_id(name, code)');
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: airlines } = useQuery({
    queryKey: ['airlines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('airline')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: airports } = useQuery({
    queryKey: ['airports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('airport')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });

  const form = useForm({
    defaultValues: {
      airline_id: '',
      flight_number: '',
      source_airport: '',
      destination_airport: '',
      departure_time: '',
      arrival_time: '',
      aircraft: '',
      total_seats: 0,
      available_seats: 0,
      price: 0,
      status: 'scheduled'
    }
  });

  const onSubmit = async (values: any) => {
    const { error } = await supabase
      .from('flight')
      .insert({
        ...values,
        total_seats: parseInt(values.total_seats),
        available_seats: parseInt(values.available_seats),
        price: parseInt(values.price)
      });
    
    if (error) {
      console.error('Error adding flight:', error);
      return;
    }
    
    refetch();
  };

  const filteredFlights = flights?.filter((flight: any) => 
    flight.flight_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flight.source_airport.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flight.destination_airport.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Flights Management</h1>
          <div className="flex gap-4">
            <Input 
              placeholder="Search flights..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="default">Add New Flight</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Add New Flight</SheetTitle>
                  <SheetDescription>
                    Fill in the details to add a new flight to the system.
                  </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <FormField
                      control={form.control}
                      name="airline_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Airline</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select airline" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {airlines?.map((airline: Airline) => (
                                <SelectItem key={airline.id} value={airline.id}>
                                  {airline.name} ({airline.code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="flight_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Flight Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. BA123" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="source_airport"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>From</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Source" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {airports?.map((airport: Airport) => (
                                  <SelectItem key={airport.airport_code} value={airport.airport_code}>
                                    {airport.name} ({airport.airport_code})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="destination_airport"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>To</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Destination" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {airports?.map((airport: Airport) => (
                                  <SelectItem key={airport.airport_code} value={airport.airport_code}>
                                    {airport.name} ({airport.airport_code})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="departure_time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Departure Time</FormLabel>
                            <FormControl>
                              <Input type="datetime-local" step="60" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="arrival_time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Arrival Time</FormLabel>
                            <FormControl>
                              <Input type="datetime-local" step="60" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="aircraft"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aircraft Type</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Boeing 737" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="total_seats"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Seats</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="available_seats"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Available Seats</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="scheduled">Scheduled</SelectItem>
                              <SelectItem value="delayed">Delayed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-4 pt-4">
                      <SheetClose asChild>
                        <Button variant="outline" type="button">Cancel</Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button type="submit">Save Flight</Button>
                      </SheetClose>
                    </div>
                  </form>
                </Form>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flight No.</TableHead>
                <TableHead>Airline</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Arrival</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Seats (Avail/Total)</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">Loading...</TableCell>
                </TableRow>
              ) : filteredFlights?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">No flights found</TableCell>
                </TableRow>
              ) : (
                filteredFlights?.map((flight: any) => (
                  <TableRow key={flight.id}>
                    <TableCell className="font-medium">{flight.flight_number}</TableCell>
                    <TableCell>{flight.airline_id?.code}</TableCell>
                    <TableCell>{flight.source_airport}</TableCell>
                    <TableCell>{flight.destination_airport}</TableCell>
                    <TableCell>{new Date(flight.departure_time).toLocaleString()}</TableCell>
                    <TableCell>{new Date(flight.arrival_time).toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        flight.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        flight.status === 'delayed' ? 'bg-yellow-100 text-yellow-800' :
                        flight.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {flight.status.charAt(0).toUpperCase() + flight.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{flight.available_seats}/{flight.total_seats}</TableCell>
                    <TableCell>${flight.price}</TableCell>
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

export default FlightsPage;
