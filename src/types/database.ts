
export interface Airline {
  id: string;
  name: string;
  code: string;
  logo: string | null;
}

export interface Airport {
  airport_code: string;
  name: string;
  city: string;
  location: string;
}

export interface BaggageAllowance {
  id: string;
  checked_baggage: string;
  extra_baggage_fee: number;
  cabin_baggage: string;
}

export interface Flight {
  id: string;
  airline_id: string;
  flight_number: string;
  departure_time: string;
  arrival_time: string;
  source_airport: string;
  destination_airport: string;
  aircraft: string;
  total_seats: number;
  available_seats: number;
  price: number;
  status: string;
  created_at: string;
}

export interface Passenger {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  passport_number: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  flight_id: string;
  passenger_id: string;
  booking_date: string;
  status: string;
  seat_number: string;
  total_price: number;
  baggage_allowance_id: string | null;
  created_at: string;
}

export interface Ticket {
  id: string;
  booking_id: string;
  issue_date: string;
  status: string;
}
