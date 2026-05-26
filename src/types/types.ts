export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  instagram?: string;
  created_at: string;
}

export interface Photo {
  id: string;
  submission_id: string;
  url: string;
  uploaded_at: string;
}

export interface Review {
  id: string;
  submission_id: string;
  seen: boolean;
  notes?: string;
}

export interface Payment {
  id: string;
  submission_id: string;
  status: string;
  amount?: number;
  paid_at?: string;
  created_at: string;
}

export interface Submission {
  id: string;
  applicant_id: string;
  car_make: string;
  car_model: string;
  car_year: number;
  questions?: string;
  status: string;
  submitted_at: string;
  // Joined relations
  applicant?: Applicant;
  photos?: Photo[];
  review?: Review;
  payment?: Payment;
}
