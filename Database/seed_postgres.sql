-- ============================================================
-- EliteCare Health Portal — PostgreSQL Seed Data
-- Demo accounts + sample doctors/hospital/appointment/records.
-- Run AFTER schema_postgres.sql, in pgAdmin 4's Query Tool.
-- Passwords below are bcrypt hashes of the plaintext shown in comments.
--
-- !! LOCAL DEVELOPMENT ONLY !!
-- The accounts/passwords in this file (patient123 / doctor123 / admin123) are
-- publicly known demo credentials. Never load this seed file into a production
-- or internet-facing database — remove or rotate these accounts first.
-- ============================================================

-- ---------- Demo users ----------
-- john.doe@example.com     / patient123
-- doctor@elitecare.com     / doctor123
-- admin@elitecare.com      / admin123
INSERT INTO users (full_name, email, password_hash, phone, role)
VALUES
  ('John Doe', 'john.doe@example.com', '$2a$10$w0TCRpttORqYeZN/n/ELnemZfQqV.svRywkjSgoUHC/iszsaLghGu', '+1 555 010 1111', 'patient'),
  ('Dr. Sarah Johnson', 'doctor@elitecare.com', '$2a$10$A9k4vcSm6MUogqvmIBMdwOUfux.CdhY9SHzGDA5PCrkOzYnouufYm', '+1 555 010 2222', 'doctor'),
  ('System Administrator', 'admin@elitecare.com', '$2a$10$bxzV0na91oNKR1eowhSWmOsbZSDHczI7SeL4mVsJaFckV661EtDaO', '+1 555 010 3333', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Extra sample doctors (password for all: doctor123)
INSERT INTO users (full_name, email, password_hash, role)
VALUES
  ('Dr. Alan Fischer', 'alan.fischer@elitecare.com', '$2a$10$A9k4vcSm6MUogqvmIBMdwOUfux.CdhY9SHzGDA5PCrkOzYnouufYm', 'doctor'),
  ('Dr. Meera Nair', 'meera.nair@elitecare.com', '$2a$10$A9k4vcSm6MUogqvmIBMdwOUfux.CdhY9SHzGDA5PCrkOzYnouufYm', 'doctor'),
  ('Dr. Wei Chen', 'wei.chen@elitecare.com', '$2a$10$A9k4vcSm6MUogqvmIBMdwOUfux.CdhY9SHzGDA5PCrkOzYnouufYm', 'doctor')
ON CONFLICT (email) DO NOTHING;

-- ---------- Patient profile ----------
INSERT INTO patient_profiles (user_id, blood_group, address, emergency_contact_name, emergency_contact_phone)
SELECT id, 'O+', '221B Baker Street, Springfield', 'Jane Doe', '+1 555 010 9999'
FROM users WHERE email = 'john.doe@example.com'
ON CONFLICT (user_id) DO UPDATE SET blood_group = EXCLUDED.blood_group;

-- ---------- Doctor profiles ----------
INSERT INTO doctor_profiles (user_id, specialization, experience, rating, location, bio, consultation_fee, is_available)
SELECT id, 'Cardiologist', '12 years', 4.8, 'EliteCare Main Campus',
       'Senior cardiologist specializing in preventive heart care.', 120.00, TRUE
FROM users WHERE email = 'doctor@elitecare.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO doctor_profiles (user_id, specialization, experience, rating, location, bio, consultation_fee, is_available)
SELECT id, 'Neurologist', '8 years', 4.6, 'EliteCare Main Campus', 'Experienced Neurologist.', 115.00, TRUE
FROM users WHERE email = 'alan.fischer@elitecare.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO doctor_profiles (user_id, specialization, experience, rating, location, bio, consultation_fee, is_available)
SELECT id, 'Dermatologist', '8 years', 4.6, 'EliteCare Main Campus', 'Experienced Dermatologist.', 95.00, TRUE
FROM users WHERE email = 'meera.nair@elitecare.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO doctor_profiles (user_id, specialization, experience, rating, location, bio, consultation_fee, is_available)
SELECT id, 'Pediatrician', '8 years', 4.6, 'EliteCare Main Campus', 'Experienced Pediatrician.', 85.00, TRUE
FROM users WHERE email = 'wei.chen@elitecare.com'
ON CONFLICT (user_id) DO NOTHING;

-- ---------- Sample hospital ----------
INSERT INTO hospitals (name, type, address, phone, rating, beds_available, is_emergency, latitude, longitude)
SELECT 'EliteCare General Hospital', 'Multi-Specialty', '100 Wellness Ave, Springfield', '+1 555 900 4000', 4.7, 42, TRUE, 40.7128, -74.0060
WHERE NOT EXISTS (SELECT 1 FROM hospitals);

-- ---------- Sample appointment ----------
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, fee, status)
SELECT p.id, d.id, CURRENT_DATE, '10:30 AM', 'Routine heart checkup', 120.00, 'Completed'
FROM users p, doctor_profiles d, users du
WHERE p.email = 'john.doe@example.com'
  AND du.email = 'doctor@elitecare.com'
  AND d.user_id = du.id
  AND NOT EXISTS (SELECT 1 FROM appointments);

-- ---------- Sample medical record ----------
INSERT INTO medical_records (patient_id, doctor_id, appointment_id, record_date, record_type, diagnosis, notes)
SELECT p.id, d.id, a.id, CURRENT_DATE, 'Consultation', 'Mild Hypertension',
       'Advised to reduce salt intake and monitor BP weekly.'
FROM users p, doctor_profiles d, users du, appointments a
WHERE p.email = 'john.doe@example.com'
  AND du.email = 'doctor@elitecare.com'
  AND d.user_id = du.id
  AND a.patient_id = p.id
  AND NOT EXISTS (SELECT 1 FROM medical_records)
LIMIT 1;

-- ---------- Sample prescription + items ----------
WITH new_presc AS (
  INSERT INTO prescriptions (patient_id, doctor_id, appointment_id, prescription_date, diagnosis, notes, status)
  SELECT p.id, d.id, a.id, CURRENT_DATE, 'Mild Hypertension', 'Follow up in 2 weeks', 'Active'
  FROM users p, doctor_profiles d, users du, appointments a
  WHERE p.email = 'john.doe@example.com'
    AND du.email = 'doctor@elitecare.com'
    AND d.user_id = du.id
    AND a.patient_id = p.id
    AND NOT EXISTS (SELECT 1 FROM prescriptions)
  LIMIT 1
  RETURNING id
)
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, instructions)
SELECT id, 'Amlodipine', '5mg', 'Once daily', '30 days', 'Take in the morning, with or without food' FROM new_presc
UNION ALL
SELECT id, 'Aspirin', '75mg', 'Once daily', '30 days', 'Take after food' FROM new_presc;
