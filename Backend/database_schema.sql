-- Database Schema for School CRM

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE,
    address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    pincode VARCHAR(20),
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    logo TEXT,
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(id) ON DELETE RESTRICT,
    school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    image TEXT,
    gender VARCHAR(20),
    dob DATE,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    section VARCHAR(50) NOT NULL,
    school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES classes(id) ON DELETE SET NULL,
    admission_no VARCHAR(100) UNIQUE NOT NULL,
    roll_number VARCHAR(50),
    section VARCHAR(50),
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    parent_phone VARCHAR(50),
    parent_email VARCHAR(255),
    admission_date DATE DEFAULT CURRENT_DATE,
    transport_required BOOLEAN DEFAULT FALSE,
    photo TEXT,
    qr_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS parents (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    occupation VARCHAR(255),
    relation VARCHAR(100) NOT NULL,
    student_id INTEGER REFERENCES students(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    employee_id VARCHAR(100) UNIQUE NOT NULL,
    qualification VARCHAR(255),
    experience INTEGER,
    subject VARCHAR(255),
    class_assigned VARCHAR(100),
    joining_date DATE DEFAULT CURRENT_DATE,
    salary NUMERIC(10, 2)
);

CREATE TABLE IF NOT EXISTS principals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    employee_id VARCHAR(100) UNIQUE NOT NULL,
    qualification VARCHAR(255),
    experience INTEGER,
    joining_date DATE DEFAULT CURRENT_DATE,
    department VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS accountants (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    employee_id VARCHAR(100) UNIQUE NOT NULL,
    qualification VARCHAR(255),
    experience INTEGER,
    joining_date DATE DEFAULT CURRENT_DATE,
    salary NUMERIC(10, 2)
);

CREATE TABLE IF NOT EXISTS librarians (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    employee_id VARCHAR(100) UNIQUE NOT NULL,
    qualification VARCHAR(255),
    experience INTEGER,
    joining_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS transport_managers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    employee_id VARCHAR(100) UNIQUE NOT NULL,
    vehicle_assigned VARCHAR(255),
    route_assigned VARCHAR(255),
    license_number VARCHAR(100),
    joining_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS receptionists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    employee_id VARCHAR(100) UNIQUE NOT NULL,
    joining_date DATE DEFAULT CURRENT_DATE,
    salary NUMERIC(10, 2)
);

-- Note: We are omitting other tables like subjects, attendance, results, fees, etc. 
-- You should append those based on your complete application needs.

-- Initial Seed Data
INSERT INTO roles (name) VALUES 
('Super Admin'), 
('School Admin'), 
('Principal'), 
('Teacher'), 
('Student'), 
('Parent'), 
('Accountant'), 
('Librarian'), 
('Transport Manager'), 
('Receptionist') 
ON CONFLICT (name) DO NOTHING;


-- Additional Tables

CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100),
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    total_marks INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS results (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    marks_obtained INTEGER,
    grade VARCHAR(20),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fees (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    due_date DATE,
    status VARCHAR(50),
    paid_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    isbn VARCHAR(100),
    quantity INTEGER DEFAULT 1,
    available INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS buses (
    id SERIAL PRIMARY KEY,
    vehicle_number VARCHAR(100) NOT NULL,
    capacity INTEGER,
    route VARCHAR(255),
    driver_id INTEGER REFERENCES transport_managers(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    issue_date DATE DEFAULT CURRENT_DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    organizer VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS homework (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hostel_rooms (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(100) NOT NULL,
    capacity INTEGER,
    occupancy INTEGER DEFAULT 0,
    type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    quantity INTEGER DEFAULT 0,
    unit_price NUMERIC(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lectures (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
    title VARCHAR(255),
    date DATE,
    start_time TIME,
    end_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    target_role VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS timetables (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
    day_of_week VARCHAR(20),
    start_time TIME,
    end_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
