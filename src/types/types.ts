export interface Submission {
    id: string;
    name: string;
    email: string;
    phone?: string;
    car_make: string;
    car_model: string;
    car_year: number;
    instagram?: string;
    questions?: string;
    photo_urls: string[];
    status: string;
    payment_status: string;
    submitted_at: string;
    seen: boolean;
    notes?: string;
  };