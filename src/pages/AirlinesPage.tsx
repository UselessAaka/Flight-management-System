
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Airline } from '@/types/database';
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

const AirlinesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: airlines, isLoading, refetch } = useQuery({
    queryKey: ['airlines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('airline')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });

  const form = useForm({
    defaultValues: {
      name: '',
      code: '',
      logo: ''
    }
  });

  const onSubmit = async (values: any) => {
    const { error } = await supabase
      .from('airline')
      .insert(values);
    
    if (error) {
      console.error('Error adding airline:', error);
      return;
    }
    
    refetch();
  };

  const filteredAirlines = airlines?.filter((airline: Airline) => 
    airline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airline.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Airlines Management</h1>
          <div className="flex gap-4">
            <Input 
              placeholder="Search airlines..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="default">Add New Airline</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Add New Airline</SheetTitle>
                  <SheetDescription>
                    Fill in the details to add a new airline to the system.
                  </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Airline Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. British Airways" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Airline Code</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. BA" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logo URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/logo.png" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-4 pt-4">
                      <SheetClose asChild>
                        <Button variant="outline" type="button">Cancel</Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button type="submit">Save Airline</Button>
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
                <TableHead>Airline Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Logo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">Loading...</TableCell>
                </TableRow>
              ) : filteredAirlines?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">No airlines found</TableCell>
                </TableRow>
              ) : (
                filteredAirlines?.map((airline: Airline) => (
                  <TableRow key={airline.id}>
                    <TableCell className="font-medium">{airline.name}</TableCell>
                    <TableCell>{airline.code}</TableCell>
                    <TableCell>
                      {airline.logo ? (
                        <img 
                          src={airline.logo} 
                          alt={`${airline.name} logo`} 
                          className="h-8 w-auto" 
                        />
                      ) : (
                        <span className="text-gray-400">No logo</span>
                      )}
                    </TableCell>
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

export default AirlinesPage;
