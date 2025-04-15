
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Airport } from '@/types/database';
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
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import Header from '@/components/Header';

const AirportsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: airports, isLoading, refetch } = useQuery({
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
      airport_code: '',
      name: '',
      city: '',
      location: ''
    }
  });

  const onSubmit = async (values: any) => {
    const { error } = await supabase
      .from('airport')
      .insert(values);
    
    if (error) {
      console.error('Error adding airport:', error);
      return;
    }
    
    refetch();
  };

  const filteredAirports = airports?.filter((airport: Airport) => 
    airport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airport.airport_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airport.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Airports Management</h1>
          <div className="flex gap-4">
            <Input 
              placeholder="Search airports..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="default">Add New Airport</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Add New Airport</SheetTitle>
                  <SheetDescription>
                    Fill in the details to add a new airport to the system.
                  </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <FormField
                      control={form.control}
                      name="airport_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Airport Code</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. LHR" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Airport Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Heathrow Airport" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. London" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. United Kingdom" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-4 pt-4">
                      <SheetClose asChild>
                        <Button variant="outline" type="button">Cancel</Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button type="submit">Save Airport</Button>
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
                <TableHead>Code</TableHead>
                <TableHead>Airport Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">Loading...</TableCell>
                </TableRow>
              ) : filteredAirports?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">No airports found</TableCell>
                </TableRow>
              ) : (
                filteredAirports?.map((airport: Airport) => (
                  <TableRow key={airport.airport_code}>
                    <TableCell className="font-medium">{airport.airport_code}</TableCell>
                    <TableCell>{airport.name}</TableCell>
                    <TableCell>{airport.city}</TableCell>
                    <TableCell>{airport.location}</TableCell>
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

export default AirportsPage;
