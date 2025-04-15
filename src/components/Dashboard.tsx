
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Flight, Booking, Airline } from '@/types/database';

const Dashboard = () => {
  const { data: flightsData, isLoading: flightsLoading } = useQuery({
    queryKey: ['flights-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('flight')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('booking')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: airlinesData, isLoading: airlinesLoading } = useQuery({
    queryKey: ['airlines-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('airline')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: airportsData, isLoading: airportsLoading } = useQuery({
    queryKey: ['airports-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('airport')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Flights</CardTitle>
            <CardDescription>Total flights in system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {flightsLoading ? "Loading..." : flightsData}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Bookings</CardTitle>
            <CardDescription>Total bookings made</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {bookingsLoading ? "Loading..." : bookingsData}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Airlines</CardTitle>
            <CardDescription>Active airlines</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {airlinesLoading ? "Loading..." : airlinesData}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Airports</CardTitle>
            <CardDescription>Registered airports</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {airportsLoading ? "Loading..." : airportsData}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
