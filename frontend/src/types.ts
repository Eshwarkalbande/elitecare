export interface Doctor {
  id: string;
  name: string;
  specialization: "Cardiologist" | "Neurologist" | "Dermatologist" | "Pediatrician" | "Orthopedic" | "Gynecologist" | "General Practitioner" | "Eye Specialist" | "Gastroenterologist" | "Oncologist" | "Pulmonologist";
  rating: number;
  experience: string;
  image: string;
  availability: string[];
  location: string;
  bio: string;
  certifications?: string[];
  calendarSlots?: { date: string; times: string[] }[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
}

export interface Hospital {
  id: string;
  name: string;
  type: string;
  distance: string;
  rating: number;
  phone: string;
  address: string;
  bedsAvailable: number;
  isEmergency: boolean;
  latitude: number;
  longitude: number;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  patientName: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  fee: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  type: string;
  doctor: string;
  diagnosis: string;
  attachmentName: string;
}

export interface Medicine {
  name: string;
  tagline: string;
  category: string;
  notes: string;
}
