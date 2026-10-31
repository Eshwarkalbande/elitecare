import { Doctor, ServiceItem, Hospital, Appointment, MedicalRecord, Medicine } from "./types";

export const SERVICES: ServiceItem[] = [
  {
    id: "video-consult",
    title: "Video Consultation",
    description: "Consult with top doctors from anywhere.",
    iconName: "Video",
  },
  {
    id: "symptom-checker",
    title: "AI Symptom Checker",
    description: "Check your symptoms and get AI suggestions.",
    iconName: "Cpu",
    badge: "AI Powered",
  },
  {
    id: "lab-tests",
    title: "Lab Tests",
    description: "Book lab tests and get reports online.",
    iconName: "Beaker",
  },
  {
    id: "surgery-assist",
    title: "Surgery Assistance",
    description: "Expert guidance for surgery & recovery support.",
    iconName: "Activity",
  },
  {
    id: "workout-plan",
    title: "Workout Plan",
    description: "Personalised fitness plans for a healthier you.",
    iconName: "Dumbbell",
  },
  {
    id: "diet-plan",
    title: "Diet Plan",
    description: "Custom diet plans by expert nutritionists.",
    iconName: "Apple",
  },
  {
    id: "voice-assist",
    title: "Voice Assistance",
    description: "Talk & get health help instantly.",
    iconName: "Mic",
  },
  {
    id: "emotion-health",
    title: "Emotion Health",
    description: "Detect your emotion and get mental health support.",
    iconName: "HeartHandshake",
  },
  {
    id: "emergency-alert",
    title: "Emergency Alert",
    description: "One tap emergency contact & alerts.",
    iconName: "Siren",
    badge: "Emergency",
  },
  {
    id: "visit-booking",
    title: "Health Visit Booking",
    description: "Book doctor home/clinic visit.",
    iconName: "CalendarDays",
  },
  {
    id: "health-problem",
    title: "Health Problem",
    description: "Get solutions for your health problems.",
    iconName: "Stethoscope",
  },
  {
    id: "10-min-service",
    title: "10 Min Service",
    description: "Get quick consultation in just 10 minutes.",
    iconName: "Clock",
  },
];

export const DOCTORS: Doctor[] = [
  // ==================== CARDIOLOGISTS (9 Only) ====================
  {
    id: "dr-sarah-j",
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    rating: 4.9,
    experience: "12+ Years Exp.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Wednesday", "Friday"],
    location: "EliteCare Heart Center, Suite A",
    bio: "Dr. Sarah Johnson is a leading cardiologist specializing in preventive cardiovascular medicine, heart failure therapy, and cardiac imaging with over a decade of clinical experience.",
    certifications: ["American Board of Internal Medicine (Cardiovascular Disease)", "Fellowship of the American College of Cardiology (FACC)", "Specialty Certificate in Advanced Echocardiography"],
    calendarSlots: [
      { date: "2026-06-18", times: ["09:00 AM", "10:30 AM", "01:00 PM", "03:30 PM"] },
      { date: "2026-06-19", times: ["10:00 AM", "11:30 AM", "02:15 PM", "04:00 PM"] }
    ]
  },
  {
    id: "dr-marcus-v",
    name: "Dr. Marcus Vance",
    specialization: "Cardiologist",
    rating: 4.8,
    experience: "15+ Years Exp.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
    availability: ["Tuesday", "Thursday", "Saturday"],
    location: "Cardiovascular Advanced Clinic, Tower C",
    bio: "Dr. Marcus Vance is an esteemed interventional cardiologist focused on minimally invasive heart procedures, coronary stenting, and hypertension management.",
    certifications: ["Board Certified in Interventional Cardiology", "Licentiate of the Royal College of Physicians", "Certified Cardiac Device Specialist (IBHRE)"],
    calendarSlots: [
      { date: "2026-06-18", times: ["10:00 AM", "11:30 AM", "02:15 PM", "04:00 PM"] },
      { date: "2026-06-20", times: ["09:00 AM", "10:30 AM", "01:00 PM"] }
    ]
  },
  {
    id: "dr-david-ch",
    name: "Dr. David Cho",
    specialization: "Cardiologist",
    rating: 4.7,
    experience: "10+ Years Exp.",
    image: "https://images.unsplash.com/photo-1624772396111-e41927901790?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Thursday"],
    location: "Metro Cardio Unit, Ground Block",
    bio: "Specializing in electrical rhythm diagnostics, pacemaker implementation, and advanced electrophysiology mapping for heart irregularities.",
    certifications: ["ABIM Board Certified in Clinical Cardiac Electrophysiology", "Heart Rhythm Society Senior Fellow"],
    calendarSlots: [
      { date: "2026-06-18", times: ["09:00 AM", "11:00 AM", "03:00 PM"] }
    ]
  },
  {
    id: "dr-isabella-g",
    name: "Dr. Isabella Graham",
    specialization: "Cardiologist",
    rating: 4.9,
    experience: "14+ Years Exp.",
    image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Wednesday", "Thursday"],
    location: "EliteCare Heart Center, Suite B",
    bio: "A renowned pioneer in pediatric cardio-therapeutics, focusing on congenital coronary care, digital rhythm telemetry, and stress prevention.",
    certifications: ["Board Certified in Pediatric Cardiology", "Recipient of the National Cardiovascular Research Merit Award"],
    calendarSlots: [
      { date: "2026-06-19", times: ["10:00 AM", "11:30 AM", "01:15 PM", "04:00 PM"] }
    ]
  },
  {
    id: "dr-robert-s",
    name: "Dr. Robert Smith",
    specialization: "Cardiologist",
    rating: 4.6,
    experience: "9+ Years Exp.",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400",
    availability: ["Tuesday", "Friday"],
    location: "Heart-Lung Specialty Suite 2",
    bio: "Dr. Robert Smith integrates sports medicine with cardiology, providing fitness optimization guidance and cardiopulmonary evaluations for hyper-athletes.",
    certifications: ["Board Certified in Cardiovascular Medicine", "Licensed Exercise Physiologist Specialist"],
    calendarSlots: [
      { date: "2026-06-18", times: ["11:30 AM", "02:15 PM", "03:30 PM"] }
    ]
  },
  {
    id: "dr-elena-v",
    name: "Dr. Elena Vasquez",
    specialization: "Cardiologist",
    rating: 4.8,
    experience: "11+ Years Exp.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400",
    availability: ["Wednesday", "Friday"],
    location: "EliteCare Heart Center, Suite C",
    bio: "Focuses on female-specific cardiovascular risks, arterial diagnostics, genetic vascular profiles, and custom heart diet plans.",
    certifications: ["ASNC Nuclear Cardiology Board Certification", "Member of the Association of Black Cardiologists"],
    calendarSlots: [
      { date: "2026-06-19", times: ["09:00 AM", "10:30 AM", "12:00 PM", "03:00 PM"] }
    ]
  },
  {
    id: "dr-arthur-p",
    name: "Dr. Arthur Pendelton",
    specialization: "Cardiologist",
    rating: 4.7,
    experience: "16+ Years Exp.",
    image: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Thursday", "Saturday"],
    location: "Cardio Rehab Suite G",
    bio: "An authority in chronic heart disease rehabilitation, post-stroke recovery planning, and custom aerobic strength building protocols.",
    certifications: ["Board Certified in Physical Medicine & Heart Rehabilitation", "American College of Chest Physicians Fellow"],
    calendarSlots: [
      { date: "2026-06-18", times: ["10:30 AM", "01:00 PM", "04:30 PM"] }
    ]
  },
  {
    id: "dr-alan-g-cardio",
    name: "Dr. Alan Gallagher",
    specialization: "Cardiologist",
    rating: 4.8,
    experience: "18+ Years Exp.",
    image: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=400",
    availability: ["Tuesday", "Wednesday"],
    location: "EliteCare Heart Center, Suite D",
    bio: "Dr. Gallagher advises on deep arterial imaging, complex structural valve remediation, and digital biometric signal decoding.",
    certifications: ["American Heart Association Active Research Merit", "Fellowship in Structural Heart Disease Restoration"],
    calendarSlots: [
      { date: "2026-06-20", times: ["09:30 AM", "11:30 AM", "03:30 PM"] }
    ]
  },
  {
    id: "dr-priya-s-cardio",
    name: "Dr. Priya Sen",
    specialization: "Cardiologist",
    rating: 4.7,
    experience: "8+ Years Exp.",
    image: "https://images.unsplash.com/photo-1651008011612-e79a404501b0?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Friday"],
    location: "Downtown Clinic B, Level 1",
    bio: "Dedicated interventionalist targeting peripheral vascular health, metabolic heart care plans, and preventive telemetry tracing.",
    certifications: ["American Board Certification (Interventional & Vascular Systems)", "Vascular Medicine Specialist"],
    calendarSlots: [
      { date: "2026-06-18", times: ["01:00 PM", "02:15 PM", "04:00 PM"] }
    ]
  },

  // ==================== NEUROLOGISTS (9 Only) ====================
  {
    id: "dr-amit-v",
    name: "Dr. Amit Verma",
    specialization: "Neurologist",
    rating: 4.8,
    experience: "10+ Years Exp.",
    image: "https://images.unsplash.com/photo-1582750433449-64c01cf0df74?auto=format&fit=crop&q=80&w=400",
    availability: ["Tuesday", "Thursday"],
    location: "Advanced Neurology Hub, Tower 2",
    bio: "Dr. Amit Verma focuses on comprehensive neurological evaluations, migraine therapies, stroke management, and pediatric neuro-developmental support.",
    certifications: ["American Board of Psychiatry and Neurology (ABPN)", "Gold Medalist in Neuro-Therapeutical Sciences", "Fellowship in Neuromuscular Medicine"],
    calendarSlots: [
      { date: "2026-06-18", times: ["09:00 AM", "10:00 AM", "11:30 AM", "03:30 PM"] },
      { date: "2026-06-20", times: ["10:30 AM", "01:00 PM", "02:15 PM"] }
    ]
  },
  {
    id: "dr-elena-r",
    name: "Dr. Elena Rostova",
    specialization: "Neurologist",
    rating: 4.9,
    experience: "11+ Years Exp.",
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Wednesday", "Friday"],
    location: "Neurological Wellness Institute, Floor 4",
    bio: "Dr. Elena Rostova specializes in sleep disorders, electroencephalography (EEG), neuromuscular diseases, and comprehensive dementia support care plans.",
    certifications: ["Board Certified in Clinical Neurophysiology (ABPN)", "European Academy of Neurology Specialist Certification", "Certified Sleep Medicine Specialist"],
    calendarSlots: [
      { date: "2026-06-18", times: ["10:30 AM", "11:30 AM", "02:15 PM"] },
      { date: "2026-06-19", times: ["09:00 AM", "01:00 PM", "03:30 PM"] }
    ]
  },
  {
    id: "dr-monica-n",
    name: "Dr. Monica Geller",
    specialization: "Neurologist",
    rating: 4.6,
    experience: "9+ Years Exp.",
    image: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Thursday"],
    location: "Advanced Neurology Hub, Suite 3",
    bio: "Specialist in chronic cluster headaches, biofeedback techniques, cranial nerve mapping, and brain-gut pathway stabilization.",
    certifications: ["ABPN Board Certified in Pain Medicine / Neurology", "National Headache Foundation Fellow"],
    calendarSlots: [
      { date: "2026-06-18", times: ["09:30 AM", "11:00 AM", "02:00 PM"] }
    ]
  },
  {
    id: "dr-ross-n",
    name: "Dr. Ross Miller",
    specialization: "Neurologist",
    rating: 4.7,
    experience: "12+ Years Exp.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400",
    availability: ["Tuesday", "Wednesday", "Friday"],
    location: "Neurological Wellness Institute, Room B",
    bio: "Dr. Miller leads diagnostic inquiries into cognitive aging, Alzheimer's prevention, cognitive metrics mapping, and deep memory rehabilitation.",
    certifications: ["Certified in Behavioral Neurology & Neuropsychiatry", "Presidential Merit in Neurological Geriatry"],
    calendarSlots: [
      { date: "2026-06-19", times: ["10:00 AM", "11:30 AM", "02:15 PM", "04:00 PM"] }
    ]
  },
  {
    id: "dr-chloe-f",
    name: "Dr. Chloe Frazer",
    specialization: "Neurologist",
    rating: 4.8,
    experience: "10+ Years Exp.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Friday"],
    location: "Advanced Neurology Hub, Tower 5",
    bio: "Focuses on spinal reflex anomalies, neuromuscular trauma mitigation, and clinical biofeedback testing utilizing state-of-the-art laboratory trackers.",
    certifications: ["Board Certified in Clinical Electromyography", "Fellow of the Association of Neuromuscular Diagnostics"],
    calendarSlots: [
      { date: "2026-06-18", times: ["10:00 AM", "01:00 PM", "03:30 PM"] }
    ]
  },
  {
    id: "dr-samuel-d",
    name: "Dr. Samuel Drake",
    specialization: "Neurologist",
    rating: 4.7,
    experience: "14+ Years Exp.",
    image: "https://images.unsplash.com/photo-1623854767648-e7bb8c5f4517?auto=format&fit=crop&q=80&w=400",
    availability: ["Tuesday", "Thursday"],
    location: "Metro Neuro Ward, Floor 2",
    bio: "Dr. Drake integrates advanced pharmacology with neuropsychology to offer comprehensive treatment pathways for severe sleep apnea and Parkinson's disease.",
    certifications: ["ABPN Movement Disorders Specialist", "Society for Sleep Medicine active board member"],
    calendarSlots: [
      { date: "2026-06-18", times: ["11:30 AM", "02:15 PM", "04:00 PM"] }
    ]
  },
  {
    id: "dr-lara-n",
    name: "Dr. Lara Croft-Neuro",
    specialization: "Neurologist",
    rating: 4.9,
    experience: "13+ Years Exp.",
    image: "https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?auto=format&fit=crop&q=80&w=400",
    availability: ["Wednesday", "Friday"],
    location: "Advanced Neurology Hub, Room 101",
    bio: "Pioneering therapeutic applications for neuro-regeneration, memory recovery following high-impact trauma, and automated stroke telemetry.",
    certifications: ["American Academy of Neurology Fellow", "Distinguished Clinical Neuroscientist Award Winner"],
    calendarSlots: [
      { date: "2026-06-19", times: ["09:00 AM", "12:00 PM", "02:15 PM", "04:30 PM"] }
    ]
  },
  {
    id: "dr-jack-m",
    name: "Dr. Jack Morrison",
    specialization: "Neurologist",
    rating: 4.8,
    experience: "15+ Years Exp.",
    image: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Wednesday"],
    location: "Neurological Wellness Institute, Room C",
    bio: "Expertise in managing persistent post-concussion symptoms, nerve decompression assessments, and occupational neuro-restoration protocols.",
    certifications: ["ABPN Board Certified in Traumatic Brain Injury (TBI)", "Defense Clinical Neuro-Restoration Council Rep"],
    calendarSlots: [
      { date: "2026-06-20", times: ["10:30 AM", "01:00 PM", "03:00 PM"] }
    ]
  },
  {
    id: "dr-brigitte-n",
    name: "Dr. Brigitte Lindholm",
    specialization: "Neurologist",
    rating: 4.7,
    experience: "8+ Years Exp.",
    image: "https://images.unsplash.com/photo-1618498082410-b4aa22193b38?auto=format&fit=crop&q=80&w=400",
    availability: ["Tuesday", "Friday"],
    location: "Advanced Neurology Hub, Room F",
    bio: "Designs therapeutic exercise regimes targeting systemic neuromuscular motor recovery, neurological physical therapy, and migraine prevention.",
    certifications: ["Board Certified in Neurologic Physical Therapy (ABPTS)", "Certified Brain Injury Specialist (CBIS)"],
    calendarSlots: [
      { date: "2026-06-18", times: ["09:00 AM", "10:30 AM", "02:15 PM"] }
    ]
  },

  // ==================== DERMATOLOGISTS (9 Only) ====================
  {
    id: "dr-priya-sh",
    name: "Dr. Priya Sharma",
    specialization: "Dermatologist",
    rating: 4.9,
    experience: "10+ Years Exp.",
    image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Tuesday", "Thursday"],
    location: "EliteCare Derma Clinic, Floor 3",
    bio: "Dr. Priya Sharma is double-boarded in general and cosmetic dermatology. She specializes in skin pathology, acne scar treatments, and age-defying therapies.",
    certifications: ["American Board of Dermatology (ABD)", "Society for Pediatric Dermatology Fellow", "Certificate of Advanced Aesthetic Laser Therapies"],
    calendarSlots: [
      { date: "2026-06-18", times: ["09:00 AM", "10:30 AM", "01:00 PM", "03:30 PM"] },
      { date: "2026-06-20", times: ["10:00 AM", "11:30 AM", "02:15 PM", "04:00 PM"] }
    ]
  },
  {
    id: "dr-ross-g",
    name: "Dr. Ross Geller",
    specialization: "Dermatologist",
    rating: 4.6,
    experience: "12+ Years Exp.",
    image: "https://images.unsplash.com/photo-1536064402646-3f90222a1ee6?auto=format&fit=crop&q=80&w=400",
    availability: ["Tuesday", "Thursday"],
    location: "EliteCare Derma Clinic, Floor 2",
    bio: "Dr. Ross Geller focuses on hereditary dermatological syndromes, melanoma screening diagnostics with high-resolution digital dermoscopy.",
    certifications: ["Board Certified in Dermatopathology", "International Society of Dermatology Lead Researcher", "Doctoral Degree in Evolutionary Biology"],
    calendarSlots: [
      { date: "2026-06-18", times: ["10:30 AM", "11:35 AM", "02:15 PM", "04:00 PM"] },
      { date: "2026-06-20", times: ["09:00 AM", "01:15 PM"] }
    ]
  },
  {
    id: "dr-amy-derma",
    name: "Dr. Amy Watson",
    specialization: "Dermatologist",
    rating: 4.8,
    experience: "7+ Years Exp.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Wednesday", "Friday"],
    location: "EliteCare Derma Clinic, Suite C",
    bio: "Provides extensive care for hyper-sensitive pediatric dermatology, immune-mediated eczema cases, and professional skin allergy map tracing.",
    certifications: ["American Osteopathic Board of Dermatology Certification", "Society for Investigational Dermatology Member"],
    calendarSlots: [
      { date: "2026-06-18", times: ["09:00 AM", "11:00 AM", "01:15 PM"] }
    ]
  },
  {
    id: "dr-steven-derma",
    name: "Dr. Steven Strange",
    specialization: "Dermatologist",
    rating: 4.9,
    experience: "15+ Years Exp.",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400",
    availability: ["Wednesday", "Friday"],
    location: "Surgical Derma Lounge 1",
    bio: "Pioneering micrographic surgery (Mohs) for skin cancer elimination, microscopic tumor delineation, and surgical tissue repair.",
    certifications: ["American Board Certificate in Micrographic Dermatologic Surgery", "Fellowship in Advanced Surgical Cutaneous Oncology"],
    calendarSlots: [
      { date: "2026-06-19", times: ["10:30 AM", "01:00 PM", "03:30 PM"] }
    ]
  },
  {
    id: "dr-rachel-derma",
    name: "Dr. Rachel Green",
    specialization: "Dermatologist",
    rating: 4.7,
    experience: "8+ Years Exp.",
    image: "https://images.unsplash.com/photo-1651008011612-e79a404501b0?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Thursday"],
    location: "EliteCare Derma Clinic, Suite A",
    bio: "Focuses on premium laser facial restoration, hormonal acne control, medical collagen restoration techniques, and hyperpigmentation cures.",
    certifications: ["Board Certified in Medical/Cosmetic Dermatology", "American Society for Laser Medicine Fellow"],
    calendarSlots: [
      { date: "2026-06-18", times: ["02:15 PM", "03:30 PM", "04:30 PM"] }
    ]
  },
  {
    id: "dr-bruce-derma",
    name: "Dr. Bruce Wayne",
    specialization: "Dermatologist",
    rating: 4.8,
    experience: "13+ Years Exp.",
    image: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=400",
    availability: ["Tuesday", "Friday"],
    location: "Industrial Derma Center",
    bio: "Researches occupational skin damage, severe contact burns, exposure allergies, toxic chemical shields, and epidermal structural resilience.",
    certifications: ["Board Certified in Preventive Environmental Dermatology", "Gold Star in Occupational Health & Wound Pathology"],
    calendarSlots: [
      { date: "2026-06-19", times: ["09:00 AM", "11:30 AM", "03:00 PM"] }
    ]
  },
  {
    id: "dr-sophia-derma",
    name: "Dr. Sophia Lauren",
    specialization: "Dermatologist",
    rating: 4.8,
    experience: "11+ Years Exp.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
    availability: ["Wednesday", "Saturday"],
    location: "EliteCare Derma Clinic, Room 302",
    bio: "Dr. Lauren brings Italian-medical aesthetic expertise, presenting revolutionary micro-dermabrasion techniques and natural skin hydration shields.",
    certifications: ["European cutis pathology board member", "Italian Board of Cosmetic Medicine Consultant"],
    calendarSlots: [
      { date: "2026-06-20", times: ["10:30 AM", "12:00 PM", "02:15 PM"] }
    ]
  },
  {
    id: "dr-vincent-derma",
    name: "Dr. Vincent Chase",
    specialization: "Dermatologist",
    rating: 4.7,
    experience: "9+ Years Exp.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Wednesday"],
    location: "EliteCare Derma Clinic, Suite E",
    bio: "Specializing in scalp and hair follicle pathology, severe scalp alopecia remedies, micro-needling cell therapies, and hormonal hair control.",
    certifications: ["Certified Trichology Specialist", "American Hair Pathology Society Council Member"],
    calendarSlots: [
      { date: "2026-06-18", times: ["01:00 PM", "02:15 PM", "04:00 PM"] }
    ]
  },
  {
    id: "dr-linda-derma",
    name: "Dr. Linda Carter",
    specialization: "Dermatologist",
    rating: 4.9,
    experience: "14+ Years Exp.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    availability: ["Tuesday", "Friday"],
    location: "EliteCare Derma Clinic, Suite F",
    bio: "Clinical diagnostic specialist for autoimmune psoriasis, lupus-associated skin lesions, systemic sclerosis, and hyper-barrier restoration.",
    certifications: ["Board Certified in Cutaneous Autoimmunology (ABD)", "Senior Scholar in Dermatological Immunology Research"],
    calendarSlots: [
      { date: "2026-06-18", times: ["09:00 AM", "10:30 AM", "03:30 PM"] }
    ]
  },

  // ==================== PEDIATRICIANS (9 Only) ====================
  {
    id: "dr-rohit-p",
    name: "Dr. Rohit Patel",
    specialization: "Pediatrician",
    rating: 4.9,
    experience: "12+ Years Exp.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
    availability: ["Wednesday", "Thursday", "Friday"],
    location: "Happy Kids Pediatric Suite, Ground Court",
    bio: "Dr. Rohit Patel provides child-centered pediatric care, neonatal consultations, immunization tracking, and developmental assessments in a highly supportive environment.",
    certifications: ["American Board of Pediatrics (ABP) Certified", "American Academy of Pediatrics (FAAP) Active Member", "Certificate in Neonatal Critical Care Support"],
    calendarSlots: [
      { date: "2026-06-18", times: ["09:00 AM", "10:30 AM", "11:30 AM", "03:30 PM"] },
      { date: "2026-06-19", times: ["10:30 AM", "01:00 PM", "02:15 PM", "04:00 PM"] }
    ]
  },
  {
    id: "dr-lisa-ped",
    name: "Dr. Lisa Cuddy",
    specialization: "Pediatrician",
    rating: 4.8,
    experience: "15+ Years Exp.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Tuesday", "Thursday"],
    location: "Happy Kids Pediatric Suite, Suite 201",
    bio: "Specializing in high-complexity endocrine pediatrics, childhood growth hormone deficiencies, metabolic mapping, and family health consults.",
    certifications: ["Board Certified in Pediatric Endocrinology", "Chief of Family Clinical Networks Award Recipient"],
    calendarSlots: [
      { date: "2026-06-18", times: ["10:00 AM", "11:30 AM", "01:00 PM", "03:00 PM"] }
    ]
  },
  {
    id: "dr-sam-ped",
    name: "Dr. Samuel Cho",
    specialization: "Pediatrician",
    rating: 4.7,
    experience: "9+ Years Exp.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Wednesday"],
    location: "Children's General Block, Floor 1",
    bio: "Dr. Cho offers compassionate expertise in managing bronchial asthma, childhood seasonal respiratory allergies, and immunization trackers.",
    certifications: ["ABIM Board Certified in Pediatric Allergy & Respiratory Systems", "Certified Pediatric Emergency Life Support Instructor"],
    calendarSlots: [
      { date: "2026-06-18", times: ["09:00 AM", "11:30 AM", "02:15 PM"] }
    ]
  },
  {
    id: "dr-lily-ped",
    name: "Dr. Lily Evans",
    specialization: "Pediatrician",
    rating: 4.8,
    experience: "11+ Years Exp.",
    image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400",
    availability: ["Tuesday", "Friday"],
    location: "Happy Kids Pediatric Suite, Room 4",
    bio: "Focuses on infant dietary science, digestive biome therapies, childhood obesity metrics, and supportive feeding guides.",
    certifications: ["Board Certified Pediatric Nutritionist Specialist", "Association of Infant Digestive Health Fellow"],
    calendarSlots: [
      { date: "2026-06-19", times: ["10:00 AM", "01:00 PM", "04:00 PM"] }
    ]
  },
  {
    id: "dr-sheldon-ped",
    name: "Dr. Sheldon Cooper",
    specialization: "Pediatrician",
    rating: 4.6,
    experience: "8+ Years Exp.",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Thursday"],
    location: "Children's Neurotech Hub, Lounge Y",
    bio: "Dedicated pediatric neuro-developmentalist auditing attention patterns, learning profiles, autism diagnostics, and sensory adjustments.",
    certifications: ["Board Certified in Behavioral-Developmental Pediatrics", "Council of Child Psychology Member"],
    calendarSlots: [
      { date: "2026-06-18", times: ["10:30 AM", "11:30 AM", "03:30 PM"] }
    ]
  },
  {
    id: "dr-mary-ped",
    name: "Dr. Mary Cooper",
    specialization: "Pediatrician",
    rating: 4.7,
    experience: "14+ Years Exp.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400",
    availability: ["Wednesday", "Friday"],
    location: "Happy Kids Pediatric Suite, Suite 3B",
    bio: "Dr. Mary Cooper provides pediatric intensive care, infectious virus diagnosis, child health screenings, and preventative healthcare.",
    certifications: ["ABP Board Certified in Pediatric Critical Medicine", "Infectious Diseases in Children Research Scholar"],
    calendarSlots: [
      { date: "2026-06-19", times: ["09:00 AM", "10:30 AM", "02:15 PM"] }
    ]
  },
  {
    id: "dr-robert-ped",
    name: "Dr. Robert Chase",
    specialization: "Pediatrician",
    rating: 4.8,
    experience: "10+ Years Exp.",
    image: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Wednesday", "Friday"],
    location: "Metro Pediatric Ward 20A",
    bio: "Specializing in child-grade critical immunology, cardiac pediatric anomalies, autoimmune response regulation, and vaccination safety.",
    certifications: ["ABP Certified Specialist in Pediatric Cardiology/Immunology", "American Board of Pathology (Pediatric Path)"],
    calendarSlots: [
      { date: "2026-06-18", times: ["11:30 AM", "01:00 PM", "04:30 PM"] }
    ]
  },
  {
    id: "dr-penny-ped",
    name: "Dr. Penelope Pinker",
    specialization: "Pediatrician",
    rating: 4.9,
    experience: "13+ Years Exp.",
    image: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=400",
    availability: ["Tuesday", "Thursday", "Saturday"],
    location: "Happy Kids Pediatric Suite, Suite D",
    bio: "Dedicated pediatric dermatologist for infants, focusing on skin toxicity, birthmark monitoring, eczema recovery, and natural bath shields.",
    certifications: ["American Academy Certification (Pediatric Dermatology)", "Society for Cutaneo-Pediatrics Principal Rep"],
    calendarSlots: [
      { date: "2026-06-20", times: ["09:00 AM", "11:30 AM", "01:00 PM"] }
    ]
  },
  {
    id: "dr-jonah-ped",
    name: "Dr. Jonah Maiava",
    specialization: "Pediatrician",
    rating: 4.7,
    experience: "11+ Years Exp.",
    image: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=400",
    availability: ["Wednesday", "Friday"],
    location: "Downtown Clinic D, Lounge A",
    bio: "Offers children's metabolic support, pediatric thyroid stabilization, comprehensive weight optimization, and diabetic management plans.",
    certifications: ["Board Certified Pediatric Endocrinologist", "Member of the Pediatric Endocrine Society"],
    calendarSlots: [
      { date: "2026-06-19", times: ["10:30 AM", "02:15 PM", "03:30 PM"] }
    ]
  },

  // ==================== ORTHOPEDICS (9 Only) ====================
  {
    id: "dr-lara-c",
    name: "Dr. Lara Croft",
    specialization: "Orthopedic",
    rating: 4.9,
    experience: "11+ Years Exp.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Wednesday", "Friday"],
    location: "EliteCare Spine & Bone, Floor 4",
    bio: "Dr. Lara Croft specializes in intensive sports injury reconstruction, spinal alignment treatments, joint stability assessment, and musculoskeletal recovery plans.",
    certifications: ["American Board of Orthopaedic Surgery (ABOS) Certified", "Fellow of the American Academy of Orthopaedic Surgeons (FAAOS)", "Fellowship in Sports Medicine Joint Reconstruction"],
    calendarSlots: [
      { date: "2026-06-18", times: ["09:00 AM", "10:30 AM", "11:30 AM", "03:30 PM"] },
      { date: "2026-06-19", times: ["10:00 AM", "01:00 PM", "02:15 PM", "04:00 PM"] }
    ]
  },
  {
    id: "dr-greg-ortho",
    name: "Dr. Gregory House",
    specialization: "Orthopedic",
    rating: 4.5,
    experience: "20+ Years Exp.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Thursday"],
    location: "Specialist Diagnostic Complex, Room 303",
    bio: "Specializing in bone and muscular diagnostic puzzles, joint necrosis remediation, complex muscle biopsies, and diagnostic orthopedics.",
    certifications: ["Board Certified in Specialty Joint Pathology Diagnostics", "Lasker Award for Diagnostic Orthopedic Excellence"],
    calendarSlots: [
      { date: "2026-06-18", times: ["10:30 AM", "11:30 AM", "03:00 PM"] }
    ]
  },
  {
    id: "dr-sarah-ortho",
    name: "Dr. Sarah Paulson",
    specialization: "Orthopedic",
    rating: 4.8,
    experience: "10+ Years Exp.",
    image: "https://images.unsplash.com/photo-1536064402646-3f90222a1ee6?auto=format&fit=crop&q=80&w=400",
    availability: ["Tuesday", "Friday"],
    location: "EliteCare Spine & Bone, Room 403",
    bio: "Reputable spinal neuro-orthopedic surgeon correcting congenital scoliosis, slip disk replacements, and high-impact structural recoveries.",
    certifications: ["Joint Pediatric & Adult Spine Fellowship Certificate", "Awarded Spine Surgeon of the Year 2025"],
    calendarSlots: [
      { date: "2026-06-19", times: ["09:30 AM", "11:30 AM", "02:15 PM"] }
    ]
  },
  {
    id: "dr-tony-ortho",
    name: "Dr. Anthony Stark",
    specialization: "Orthopedic",
    rating: 4.9,
    experience: "15+ Years Exp.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
    availability: ["Wednesday", "Saturday"],
    location: "Bionic Prosthetics Suite, Floor 5",
    bio: "An industry innovator crafting motor-driven orthopedic prosthesis, advanced physical rehabilitation interfaces, and titanium hip replacements.",
    certifications: ["Board Certified in Biomechanical Orthopedic Engineering", "Lasker Medal in Implant Design Research"],
    calendarSlots: [
      { date: "2026-06-20", times: ["10:00 AM", "01:00 PM", "03:30 PM", "04:30 PM"] }
    ]
  },
  {
    id: "dr-ellen-ortho",
    name: "Dr. Ellen Fisher",
    specialization: "Orthopedic",
    rating: 4.7,
    experience: "8+ Years Exp.",
    image: "https://images.unsplash.com/photo-1651008011612-e79a404501b0?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Wednesday"],
    location: "EliteCare Spine & Bone, Suite E",
    bio: "Focuses on female sports athletic strain recovery, osteo-protective diet architectures, knee arthroscopy, and ligaments structural wellness.",
    certifications: ["Orthopedic Sports Medicine Board Certified (ABOS)", "Society of Collegiate Athletic Surgeons Active Rep"],
    calendarSlots: [
      { date: "2026-06-18", times: ["09:00 AM", "11:30 AM", "02:15 PM"] }
    ]
  },
  {
    id: "dr-victor-ortho",
    name: "Dr. Victor Sullivan",
    specialization: "Orthopedic",
    rating: 4.7,
    experience: "16+ Years Exp.",
    image: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&q=80&w=400",
    availability: ["Tuesday", "Thursday"],
    location: "Regenerative Joint Center 9",
    bio: "Dr. Sullivan targets age-associated osteoarthritis, custom joint fluid replacements, knee reconstruction, and geriatric mobility stabilization.",
    certifications: ["American Geriatry Joint Association Lifetime Fellow", "Certified Orthopedic Biomaterials Specialist"],
    calendarSlots: [
      { date: "2026-06-18", times: ["10:30 AM", "01:00 PM", "02:15 PM", "04:00 PM"] }
    ]
  },
  {
    id: "dr-chloe-ortho",
    name: "Dr. Chloe Frazer-Ortho",
    specialization: "Orthopedic",
    rating: 4.8,
    experience: "9+ Years Exp.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Friday"],
    location: "EliteCare Spine & Bone, Room 405",
    bio: "Directs physical bone trauma reconstruction pathways, structural ligament healing protocols, and muscle-to-bone reattachment therapies.",
    certifications: ["ABOS Certified Orthopedic Traumatology Specialist", "Global Musculoskeletal Repair Advocate"],
    calendarSlots: [
      { date: "2026-06-18", times: ["09:00 AM", "11:30 AM", "03:30 PM"] }
    ]
  },
  {
    id: "dr-clark-ortho",
    name: "Dr. Clark Kent",
    specialization: "Orthopedic",
    rating: 4.9,
    experience: "12+ Years Exp.",
    image: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=400",
    availability: ["Tuesday", "Friday"],
    location: "Physical Rehab Hub, block G",
    bio: "Specialist in extreme structural heavy bone mechanics, spinal compression releases, and elite posture realignment blueprints.",
    certifications: ["American Academy Certification (Postural & Spinal Mechanics)", "Distinguished Biofeedback Clinician"],
    calendarSlots: [
      { date: "2026-06-19", times: ["10:00 AM", "01:00 PM", "02:15 PM"] }
    ]
  },
  {
    id: "dr-brigitte-ortho",
    name: "Dr. Brigitte Lindholm-Ortho",
    specialization: "Orthopedic",
    rating: 4.7,
    experience: "10+ Years Exp.",
    image: "https://images.unsplash.com/photo-1618498082410-b4aa22193b38?auto=format&fit=crop&q=80&w=400",
    availability: ["Wednesday", "Friday"],
    location: "Spine & Bone Suite H",
    bio: "Pioneers biomechanical posture harness integrations, muscular tension mapping, chronic joint friction reductions, and therapeutic massages.",
    certifications: ["Master Certification in Advanced Biotherapeutic Mobility Therapy", "Board Certified Orthopedic Physical Therapist"],
    calendarSlots: [
      { date: "2026-06-19", times: ["09:00 AM", "10:30 AM", "02:15 PM", "04:30 PM"] }
    ]
  },

  // ==================== GYNECOLOGISTS (9 Only) ====================
  {
    id: "dr-sophia-m",
    name: "Dr. Sophia Martinez",
    specialization: "Gynecologist",
    rating: 4.8,
    experience: "10+ Years Exp.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Thursday", "Friday"],
    location: "Bloom Women's Wellness & Obstetric Clinic, Suite 501",
    bio: "Dr. Sophia Martinez offers reproductive health services, obstetrics monitoring, post-partum recovery planning, and comprehensive adolescent gynecological consultations.",
    certifications: ["American Board of Obstetrics and Gynecology (ABOG)", "Fellow of the American College of Obstetricians and Gynecologists (FACOG)", "Certificate of Specialized Laparoscopic Surgery"],
    calendarSlots: [
      { date: "2026-06-18", times: ["09:00 AM", "10:30 AM", "01:00 PM", "03:30 PM"] },
      { date: "2026-06-19", times: ["10:00 AM", "11:30 AM", "02:15 PM", "04:00 PM"] }
    ]
  },
  {
    id: "dr-meredith-gyn",
    name: "Dr. Meredith Grey",
    specialization: "Gynecologist",
    rating: 4.9,
    experience: "14+ Years Exp.",
    image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Wednesday", "Friday"],
    location: "Bloom Women's Wellness & Obstetric Clinic, Room 3",
    bio: "Specializing in high-complexity obstetric surgeries, minimally invasive robotic hysterectomy, maternal-fetal high-risk conditions, and fetal care.",
    certifications: ["Fellowship of Maternal-Fetal Surgical Medicine (ABOG)", "Award for Healthcare Innovative Leadership 2025"],
    calendarSlots: [
      { date: "2026-06-18", times: ["10:30 AM", "11:30 AM", "01:00 PM", "04:00 PM"] }
    ]
  },
  {
    id: "dr-allison-gyn",
    name: "Dr. Allison Cameron",
    specialization: "Gynecologist",
    rating: 4.7,
    experience: "8+ Years Exp.",
    image: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=400",
    availability: ["Tuesday", "Thursday"],
    location: "Bloom Women's Wellness & Obstetric Clinic, Room 5",
    bio: "Compassionate gynecological diagnostic consultant specializing in complex hormone balancing, reproductive fertility therapeutics, and polycystic ovarian syndrome recovery.",
    certifications: ["Board Certified Reproductive Endocrinologist & Fertility Specialist", "End endocrine Pathology Active Member"],
    calendarSlots: [
      { date: "2026-06-18", times: ["09:00 AM", "10:30 AM", "02:15 PM"] }
    ]
  },
  {
    id: "dr-rebecca-gyn",
    name: "Dr. Rebecca Vance",
    specialization: "Gynecologist",
    rating: 4.7,
    experience: "12+ Years Exp.",
    image: "https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Wednesday", "Thursday"],
    location: "Metro Maternal Ward, Block A",
    bio: "Offers post-natal physical adjustment guides, specialized lactation counseling, newborn screening oversight, and holistic pelvic floor rehabilitation.",
    certifications: ["FACOG Board Certified Maternal-Newborn Transition Specialist", "Certified Pelvic Floor Therapist Consultant"],
    calendarSlots: [
      { date: "2026-06-19", times: ["10:00 AM", "11:30 AM", "03:30 PM"] }
    ]
  },
  {
    id: "dr-fiona-gyn",
    name: "Dr. Fiona Gallagher-Gyn",
    specialization: "Gynecologist",
    rating: 4.6,
    experience: "7+ Years Exp.",
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400",
    availability: ["Tuesday", "Friday"],
    location: "Bloom Women's Wellness & Obstetric Clinic, Suite 509",
    bio: "Comprehensive gynecological checkups, contraceptive health advisors, adolescent hygiene counselors, and HPV immunization tracking.",
    certifications: ["ABOG Certified General Practitioner in Obstetrics", "National Adolescent reproductive Alliance Rep"],
    calendarSlots: [
      { date: "2026-06-18", times: ["11:30 AM", "01:00 PM", "03:30 PM"] }
    ]
  },
  {
    id: "dr-diana-gyn",
    name: "Dr. Diana Prince",
    specialization: "Gynecologist",
    rating: 4.9,
    experience: "15+ Years Exp.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Wednesday", "Friday"],
    location: "Bloom Women's Wellness & Obstetric Clinic, Room 10",
    bio: "An authoritative figure on maternal resilience, bone density preservation throughout pregnancy, thyroid balance, and custom prenatal nutrition setups.",
    certifications: ["Board Certified in Women's Musculoskeletal & Reproductive Resiliency", "International OBGYN Association Senior Delegate"],
    calendarSlots: [
      { date: "2026-06-19", times: ["09:00 AM", "01:15 PM", "04:30 PM"] }
    ]
  },
  {
    id: "dr-elena-gyn",
    name: "Dr. Elena Fisher-Gyn",
    specialization: "Gynecologist",
    rating: 4.8,
    experience: "11+ Years Exp.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    availability: ["Wednesday", "Saturday"],
    location: "Bloom Women's Wellness & Obstetric Clinic, Room B",
    bio: "Handles complex pregnancy telemetry, maternal cardiac stress assessments, fetal development tracking, and pelvic floor strengthening.",
    certifications: ["ABOG Specialist in Advanced Pre-Partum Health Mechanics", "Active Consultant for Women's Healthy Biometrics"],
    calendarSlots: [
      { date: "2026-06-20", times: ["10:30 AM", "12:00 PM", "02:15 PM"] }
    ]
  },
  {
    id: "dr-chloe-gyn",
    name: "Dr. Chloe Frazer-Gyn",
    specialization: "Gynecologist",
    rating: 4.7,
    experience: "10+ Years Exp.",
    image: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=400",
    availability: ["Monday", "Friday"],
    location: "Bloom Women's Wellness & Obstetric Clinic, Room E",
    bio: "Focuses on menopause medical transition pathways, hormonal replacement therapeutic guides, bone density profiles, and holistic hot flash relief.",
    certifications: ["Certified Menopause Practitioner (NAMS)", "Obstetrics Pathology Board Representative"],
    calendarSlots: [
      { date: "2026-06-18", times: ["09:00 AM", "11:30 AM", "01:00 PM"] }
    ]
  },
  {
    id: "dr-angela-gyn",
    name: "Dr. Angela Ziegler",
    specialization: "Gynecologist",
    rating: 4.9,
    experience: "13+ Years Exp.",
    image: "https://images.unsplash.com/photo-1536064402646-3f90222a1ee6?auto=format&fit=crop&q=80&w=400",
    availability: ["Tuesday", "Thursday"],
    location: "Bloom Women's Wellness & Obstetric Clinic, Suite Z",
    bio: "Pioneering minimally invasive laparoscopic ovarian surgery, hormonal restoration protocols, and premium post-delivery wellness grids.",
    certifications: ["Double Certified (Obstetrics & Advanced Micrographic Laparoscopy)", "Recipient of Global Humanitarian Women's Care Merit"],
      calendarSlots: [
        { date: "2026-06-18", times: ["10:00 AM", "01:00 PM", "03:30 PM"] }
      ]
    },
    // ==================== EYE SPECIALISTS ====================
    {
      id: "dr-carol-e",
      name: "Dr. Carol Danvers",
      specialization: "Eye Specialist",
      rating: 4.9,
      experience: "11+ Years Exp.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
      availability: ["Monday", "Wednesday", "Friday"],
      location: "EliteCare Ophthalmic Ward, Floor 3",
      bio: "Dr. Carol Danvers is a highly acclaimed ophthalmologist specializing in advanced laser refractive surgery (LASIK), corneal restructuring, glaucoma management, and pediatric vision correction.",
      certifications: ["American Board of Ophthalmology Certification", "Fellow of the American Society of Cataract and Refractive Surgery", "Recipient of Clinical Oculoplastic Care Excellence Award"],
      calendarSlots: [
        { date: "2026-06-18", times: ["09:00 AM", "11:00 AM", "01:00 PM", "03:30 PM"] },
        { date: "2026-06-19", times: ["10:00 AM", "11:30 AM", "02:15 PM"] }
      ]
    },
    {
      id: "dr-stephen-e",
      name: "Dr. Stephen Cho",
      specialization: "Eye Specialist",
      rating: 4.8,
      experience: "14+ Years Exp.",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
      availability: ["Tuesday", "Thursday"],
      location: "Vision and Eye Care Clinic, Building 4",
      bio: "Dr. Stephen Cho specializes in diabetic retinopathy, retinal telemetry, custom lens therapeutics, and corrective laser ocular procedures.",
      certifications: ["Board Certified in Vitreoretinal Diseases & Pathology", "Fellowship of the Association for Vision Research in Ophthalmology"],
      calendarSlots: [
        { date: "2026-06-18", times: ["10:30 AM", "11:30 AM", "02:15 PM", "04:00 PM"] },
        { date: "2026-06-20", times: ["09:00 AM", "01:00 PM"] }
      ]
    },
    // ==================== GASTROENTEROLOGISTS ====================
    {
      id: "dr-henry-g",
      name: "Dr. Henry Lin",
      specialization: "Gastroenterologist",
      rating: 4.9,
      experience: "12+ Years Exp.",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400",
      availability: ["Monday", "Wednesday"],
      location: "EliteCare Digestive Health Center",
      bio: "Dr. Henry Lin is an acclaimed gastroenterologist specializing in digestive tract disorders, inflammatory bowel diseases (IBD), gut microbiome balancing, and advanced diagnostic endoscopies.",
      certifications: ["Board Certified in Gastroenterology and Hepatology", "American Gastroenterological Association (AGA) Fellow", "Gold Medalist in Therapeutic Endoscopy Systems"],
      calendarSlots: [
        { date: "2026-06-18", times: ["09:30 AM", "11:00 AM", "02:00 PM", "04:30 PM"] },
        { date: "2026-06-19", times: ["10:00 AM", "01:30 PM", "03:00 PM"] }
      ]
    },
    // ==================== ONCOLOGISTS ====================
    {
      id: "dr-evelyn-o",
      name: "Dr. Evelyn Vance",
      specialization: "Oncologist",
      rating: 4.95,
      experience: "16+ Years Exp.",
      image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400",
      availability: ["Tuesday", "Thursday", "Friday"],
      location: "EliteCare Comprehensive Oncology Institute",
      bio: "Dr. Evelyn Vance is an esteemed clinical oncologist dedicated to personalized targeted cancer therapeutics, genomic tumor sequencing, and holistic immunotherapy patient support.",
      certifications: ["American Board of Internal Medicine (Medical Oncology)", "Society of Clinical Oncology Active Regent", "Distinguished Clinical Cancer Research Laureate (2024)"],
      calendarSlots: [
        { date: "2026-06-18", times: ["09:00 AM", "10:30 AM", "12:00 PM", "02:30 PM"] },
        { date: "2026-06-20", times: ["10:00 AM", "11:30 AM", "03:30 PM"] }
      ]
    },
    // ==================== PULMONOLOGISTS ====================
    {
      id: "dr-robert-p",
      name: "Dr. Robert Harrison",
      specialization: "Pulmonologist",
      rating: 4.85,
      experience: "15+ Years Exp.",
      image: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=400",
      availability: ["Monday", "Thursday"],
      location: "EliteCare Respiratory & Lung Pavilion",
      bio: "Dr. Robert Harrison is a pioneering pulmonologist specializing in lung disease therapies, chronic asthma management, severe sleep apnea recovery, and respiratory muscle rehabilitation.",
      certifications: ["ABIM Certified in Pulmonary Disease & Critical Care Medicine", "Fellow of the American College of Chest Physicians (FCCP)", "Innovations in Respiration Award Recipient"],
      calendarSlots: [
        { date: "2026-06-18", times: ["08:30 AM", "10:00 AM", "01:15 PM", "03:45 PM"] },
        { date: "2026-06-19", times: ["11:00 AM", "02:15 PM", "05:00 PM"] }
      ]
    },
    {
      id: "dr-maya-g",
      name: "Dr. Maya Lin",
      specialization: "Gastroenterologist",
      rating: 4.8,
      experience: "9+ Years Exp.",
      image: "https://images.unsplash.com/photo-1622902046580-2b47f47f0471?auto=format&fit=crop&q=80&w=400",
      availability: ["Tuesday", "Thursday"],
      location: "EliteCare Digestive Health Center",
      bio: "Dr. Maya Lin focuses on microscopic colitis, sensitive digestive mapping, food allergy profiles, and proactive gut barrier optimization.",
      certifications: ["American Board of Internal Medicine (Gastroenterology)", "Society of Women GI Specialists active chair"],
      calendarSlots: [
        { date: "2026-06-18", times: ["10:00 AM", "11:30 AM", "02:45 PM"] }
      ]
    },
    {
      id: "dr-david-g",
      name: "Dr. David Miller",
      specialization: "Gastroenterologist",
      rating: 4.75,
      experience: "11+ Years Exp.",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
      availability: ["Monday", "Friday"],
      location: "Digestive Disease Diagnostic Lab",
      bio: "Specializes in acid-reflux reduction, hepatic diagnostic profiling, healthy liver restoration regimens, and microscopic diagnostic endoscopies.",
      certifications: ["Fellow of the American College of Gastroenterology (FACG)", "Clinical GI Innovation Award Recipient"],
      calendarSlots: [
        { date: "2026-06-19", times: ["09:00 AM", "11:30 AM", "01:00 PM"] }
      ]
    },
    {
      id: "dr-angela-g",
      name: "Dr. Angela Chen",
      specialization: "Gastroenterologist",
      rating: 4.9,
      experience: "14+ Years Exp.",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400",
      availability: ["Wednesday", "Friday"],
      location: "EliteCare Digestive Health Center",
      bio: "Highly trained clinical gastroenterologist specializing in chronic gut inflammatory conditions, microbiome reconstruction, and pediatric hepatic diagnostics.",
      certifications: ["Board Certified in Pediatric Gastroenterology & Nutrition", "Lasker Award nominee for digestive enzyme discoveries"],
      calendarSlots: [
        { date: "2026-06-18", times: ["02:00 PM", "03:30 PM", "04:45 PM"] }
      ]
    },
    {
      id: "dr-marcus-o",
      name: "Dr. Marcus Vance",
      specialization: "Oncologist",
      rating: 4.92,
      experience: "18+ Years Exp.",
      image: "https://images.unsplash.com/photo-1637059824899-a441006a6875?auto=format&fit=crop&q=80&w=400",
      availability: ["Monday", "Tuesday", "Wednesday"],
      location: "EliteCare Comprehensive Oncology Institute",
      bio: "Focuses on complex hematological oncology, molecular targeted sequencing, high-complexity clinical chemotherapeutic trials, and genomic-matched tumor profiles.",
      certifications: ["American Board of Hematology & Oncology Certification", "Distinguished Oncological Society Fellow"],
      calendarSlots: [
        { date: "2026-06-18", times: ["09:30 AM", "11:00 AM", "01:30 PM"] }
      ]
    },
    {
      id: "dr-fiona-o",
      name: "Dr. Fiona Gallagher",
      specialization: "Oncologist",
      rating: 4.88,
      experience: "12+ Years Exp.",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400",
      availability: ["Tuesday", "Thursday"],
      location: "Women's Oncology & Breast Diagnostic Ward",
      bio: "Pioneering therapeutic clinical approaches to early stage breast pathology, active tumor prevention, immunotherapy infusion guidance, and compassionate endocrine care.",
      certifications: ["Board Certified in Gynecologic Oncology (ABOG)", "National Breast Cancer Foundation Outstanding Clinical Leader"],
      calendarSlots: [
        { date: "2026-06-18", times: ["10:00 AM", "11:30 AM", "03:00 PM"] }
      ]
    },
    {
      id: "dr-albert-o",
      name: "Dr. Albert Wright",
      specialization: "Oncologist",
      rating: 4.85,
      experience: "15+ Years Exp.",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400",
      availability: ["Wednesday", "Friday"],
      location: "EliteCare Comprehensive Oncology Institute",
      bio: "Pioneering radiotherapeutic approaches, precise cellular tumor ablation mapping, pain remediation pathways, and advanced recovery timelines for high-complexity cases.",
      certifications: ["ABIM Certified in Medical Oncology and Radiotherapy", "Global Radiation Oncology Research Advocate Chair"],
      calendarSlots: [
        { date: "2026-06-19", times: ["11:00 AM", "01:30 PM", "04:30 PM"] }
      ]
    },
    {
      id: "dr-sophia-p",
      name: "Dr. Sophia Martinez",
      specialization: "Pulmonologist",
      rating: 4.91,
      experience: "13+ Years Exp.",
      image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400",
      availability: ["Tuesday", "Friday"],
      location: "EliteCare Respiratory & Lung Pavilion",
      bio: "Specializing in chronic obstructive pulmonary disease (COPD) mitigation, cystic fibrosis clinical trials, allergen respiratory shields, and athletic lung capacity restoration.",
      certifications: ["Board Certified Pediatric & Adult Pulmonology Specialist", "American Thoracic Society Active Fellow"],
      calendarSlots: [
        { date: "2026-06-18", times: ["09:00 AM", "10:30 AM", "02:15 PM"] }
      ]
    },
    {
      id: "dr-kenneth-p",
      name: "Dr. Kenneth Cole",
      specialization: "Pulmonologist",
      rating: 4.79,
      experience: "10+ Years Exp.",
      image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=400",
      availability: ["Monday", "Wednesday"],
      location: "Surgical Respiration and Ventilation Lab",
      bio: "Researches occupational lung protection, high altitude respiration biology, clinical mechanical ventilation parameters, and toxic smoke inhalation remediation.",
      certifications: ["Certified Critical Care Medicine & Ventilation Specialist", "Thoracic Medicine Research Foundation Scholar"],
      calendarSlots: [
        { date: "2026-06-18", times: ["10:00 AM", "12:00 PM", "03:45 PM"] }
      ]
    },
    {
      id: "dr-linda-p",
      name: "Dr. Linda Zhao",
      specialization: "Pulmonologist",
      rating: 4.87,
      experience: "11+ Years Exp.",
      image: "https://images.unsplash.com/photo-1643227361730-a92c478a57e6?auto=format&fit=crop&q=80&w=400",
      availability: ["Wednesday", "Thursday"],
      location: "EliteCare Respiratory & Lung Pavilion",
      bio: "Clinical rehabilitation specialist for long-term post-viral lung scarring, severe chronic bronchitis protocols, sleep-disordered breathing mapping, and diaphragmatic retraining exercises.",
      certifications: ["American Academy of Sleep Medicine Accredited Member", "Outstanding Pulmonology Educator of the Year Award"],
      calendarSlots: [
        { date: "2026-06-19", times: ["09:30 AM", "11:00 AM", "02:30 PM"] }
      ]
    },
    {
      id: "dr-sarah-g",
      name: "Dr. Sarah Jenkins",
      specialization: "Gastroenterologist",
      rating: 4.93,
      experience: "13+ Years Exp.",
      image: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&q=80&w=400",
      availability: ["Monday", "Tuesday", "Friday"],
      location: "EliteCare Digestive Health Center",
      bio: "An internationally certified expert in metabolic syndrome, nutritional pathways, chronic gut microbiome therapies, and liver wellness mapping.",
      certifications: ["Board Certified Hepatology Specialist", "World Gastroenterology Organisation Active Scholar"],
      calendarSlots: [
        { date: "2026-06-18", times: ["09:00 AM", "10:30 AM", "03:00 PM"] }
      ]
    },
    {
      id: "dr-neil-g",
      name: "Dr. Neil Patel",
      specialization: "Gastroenterologist",
      rating: 4.84,
      experience: "10+ Years Exp.",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400",
      availability: ["Wednesday", "Thursday"],
      location: "Digestive Disease Diagnostic Lab",
      bio: "Specialist in microscopic bowel imaging, early detection gastric screening, reflux control protocols, and custom microbiome diet architectures.",
      certifications: ["American College of Gastroenterology Fellow", "Underberg Digestive Research Award Recipient"],
      calendarSlots: [
        { date: "2026-06-19", times: ["10:00 AM", "11:45 AM", "02:15 PM"] }
      ]
    },
    {
      id: "dr-lisa-o",
      name: "Dr. Lisa Kudrow",
      specialization: "Oncologist",
      rating: 4.96,
      experience: "17+ Years Exp.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
      availability: ["Monday", "Wednesday", "Friday"],
      location: "EliteCare Comprehensive Oncology Institute",
      bio: "Clinical trial director for immunotherapeutic protein inhibitors, cellular diagnostics, personalized genomic maps, and early stage pathology mitigation.",
      certifications: ["Board Certified in Clinical Oncology and Hematology", "Global Cancer Research Coalition active presenter"],
      calendarSlots: [
        { date: "2026-06-18", times: ["11:00 AM", "01:30 PM", "04:00 PM"] }
      ]
    },
    {
      id: "dr-gary-p",
      name: "Dr. Gary Vance",
      specialization: "Pulmonologist",
      rating: 4.88,
      experience: "14+ Years Exp.",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
      availability: ["Tuesday", "Thursday"],
      location: "EliteCare Respiratory & Lung Pavilion",
      bio: "Dedicated clinician specialisng in high-compression respiratory airways, nocturnal diagnostic diagnostics, mechanical ventilation support, and athletic lung resilience.",
      certifications: ["ABIM Certified in Pulmonology & Respiration Systemics", "Fellow of the American Thoracic Association"],
      calendarSlots: [
        { date: "2026-06-19", times: ["09:00 AM", "10:30 AM", "03:15 PM"] }
      ]
    },
    {
      id: "dr-tina-p",
      name: "Dr. Tina Fey",
      specialization: "Pulmonologist",
      rating: 4.92,
      experience: "12+ Years Exp.",
      image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400",
      availability: ["Monday", "Wednesday"],
      location: "EliteCare Respiratory & Lung Pavilion",
      bio: "Specializing in toxic vapor injury rehabilitation, chronic environmental asthma management, custom biome filters, and pediatric respiration systems.",
      certifications: ["Board Certified Specialist in Pediatric & Environmental Pulmonology", "Winner of the Thoracic Medicine Innovation Grant"],
      calendarSlots: [
        { date: "2026-06-18", times: ["10:15 AM", "12:00 PM", "02:45 PM"] }
      ]
    }
  ];

export const HOSPITALS: Hospital[] = [
  {
    id: "hosp-metro",
    name: "EliteCare Metro General Hospital",
    type: "Super-Specialty Care",
    distance: "1.2 km",
    rating: 4.9,
    phone: "+1 (555) 901-4000",
    address: "740 Medical Center Parkway, Downtown City",
    bedsAvailable: 42,
    isEmergency: true,
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    id: "hosp-cardio",
    name: "EliteCare Cardiovascular Institute",
    type: "Cardiology & Surgery",
    distance: "2.8 km",
    rating: 4.8,
    phone: "+1 (555) 302-1200",
    address: "110 Heartbeat Avenue, Pulse District",
    bedsAvailable: 15,
    isEmergency: true,
    latitude: 40.715,
    longitude: -74.01,
  },
  {
    id: "hosp-children",
    name: "EliteCare Children's Hospital",
    type: "Pediatric Super-Specialty",
    distance: "4.5 km",
    rating: 4.8,
    phone: "+1 (555) 880-9900",
    address: "205 Rainbow Lane, Greenfield Court",
    bedsAvailable: 28,
    isEmergency: false,
    latitude: 40.708,
    longitude: -74.002,
  },
  {
    id: "hosp-west",
    name: "EliteCare West Trauma Center",
    type: "Emergency & Critical Unit",
    distance: "5.1 km",
    rating: 4.6,
    phone: "+1 (555) 450-7000",
    address: "99 Expressway Highway, Westside Gate",
    bedsAvailable: 60,
    isEmergency: true,
    latitude: 40.725,
    longitude: -74.025,
  },
  {
    id: "hosp-wellness",
    name: "EliteCare Orthopedic & Rehab Rehab",
    type: "Bone, Joint & Physio Rehab",
    distance: "6.3 km",
    rating: 4.7,
    phone: "+1 (555) 230-5500",
    address: "14 Active Way, Spine Hills",
    bedsAvailable: 18,
    isEmergency: false,
    latitude: 40.704,
    longitude: -74.018,
  },
];

export const BENEFITS = [
  {
    id: "all-in-one",
    title: "All-in-One Healthcare Solution",
    description: "For You And Your Family",
    iconName: "Sparkles",
  },
  {
    id: "secure-private",
    title: "Secure & Private",
    description: "Your data is 100% protected",
    iconName: "ShieldCheck",
  },
  {
    id: "support",
    title: "24x7 Support",
    description: "We are always here for you",
    iconName: "PhoneCall",
  },
  {
    id: "verified",
    title: "Verified Doctors",
    description: "500+ expert doctors",
    iconName: "BadgeCheck",
  },
  {
    id: "hospitals-count",
    title: "500+ Hospitals",
    description: "Across 50+ cities",
    iconName: "Building2",
  },
  {
    id: "digital-records",
    title: "Digital Health Records",
    description: "Access your reports anytime",
    iconName: "FileSpreadsheet",
  },
  {
    id: "insurance",
    title: "Insurance Support",
    description: "We support major insurance",
    iconName: "BookmarkCheck",
  },
];

export const STATISTICS = [
  { value: "500+", subtitle: "Hospitals", icon: "Building", color: "text-emerald-600 bg-emerald-50" },
  { value: "10,000+", subtitle: "Patients", icon: "Users", color: "text-emerald-600 bg-emerald-50" },
  { value: "2,000+", subtitle: "Doctors", icon: "GraduationCap", color: "text-emerald-600 bg-emerald-50" },
  { value: "24/7", subtitle: "Support", icon: "Clock", color: "text-emerald-600 bg-emerald-50" },
];

export const POPULAR_MEDICINES: Medicine[] = [
  {
    name: "Amoxicillin (500mg)",
    tagline: "Broad-spectrum penicillin antibiotic",
    category: "Antibiotics",
    notes: "Treats bacterial throat, chest, skin infections and dental abscesses.",
  },
  {
    name: "Metformin (850mg)",
    tagline: "First-line blood glucose control",
    category: "Anti-Diabetic",
    notes: "Improves insulin sensitivity for Type 2 Diabetes patients. Take with meals.",
  },
  {
    name: "Lisinopril (10mg)",
    tagline: "ACE Inhibitor for vascular protection",
    category: "Antihypertensive",
    notes: "Treats high blood pressure and heart failure. Avoid high potassium intake.",
  },
  {
    name: "Atorvastatin (20mg)",
    tagline: "HMG-CoA reductase inhibitor (Statin)",
    category: "Cholesterol",
    notes: "Reduces LDL cholesterol and triglycerides. Generally taken at bedtime.",
  },
  {
    name: "Ibuprofen (400mg)",
    tagline: "Non-steroidal Anti-inflammatory (NSAID)",
    category: "Analgesics / NSAID",
    notes: "Provides fast relief for muscle aches, joint inflammation, and fever.",
  },
  {
    name: "Albuterol inhaler (90mcg)",
    tagline: "Bronchodilator (Beta-2 agonist)",
    category: "Asthma / Respiratory",
    notes: "Relieves acute breathing tightness, bronchospasms, and exercise asthma triggers.",
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-1",
    doctorName: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    date: "2026-06-18",
    time: "10:30 AM",
    patientName: "John Doe",
    status: "Scheduled",
    fee: "$120",
  },
  {
    id: "apt-2",
    doctorName: "Dr. Priya Sharma",
    specialization: "Dermatologist",
    date: "2026-06-20",
    time: "02:15 PM",
    patientName: "John Doe",
    status: "Scheduled",
    fee: "$95",
  },
  {
    id: "apt-3",
    doctorName: "Dr. Rohit Patel",
    specialization: "Pediatrician",
    date: "2026-05-12",
    time: "11:00 AM",
    patientName: "Lily Doe (Daughter)",
    status: "Completed",
    fee: "$80",
  },
];

export const MOCK_RECORDS: MedicalRecord[] = [
  {
    id: "rec-1",
    date: "2026-05-12",
    type: "Pediatric Checkup",
    doctor: "Dr. Rohit Patel",
    diagnosis: "Healthy development. Routine vaccinations completed.",
    attachmentName: "Pediatric_Log_May2026.pdf",
  },
  {
    id: "rec-2",
    date: "2026-04-10",
    type: "Cardiology Screening",
    doctor: "Dr. Sarah Johnson",
    diagnosis: "General sinus rhythm. Heart rate 72 bpm, blood pressure 118/76 mmHg.",
    attachmentName: "ECG_Report_Screening.pdf",
  },
  {
    id: "rec-3",
    date: "2026-02-15",
    type: "Complete Blood Count",
    doctor: "Dr. Sarah Johnson",
    diagnosis: "All levels (WBC, RBC, Hemoglobin) in optimal health range.",
    attachmentName: "LabResult_CBC_Feb2026.pdf",
  },
];
