export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: 'student' | 'alumni' | 'admin';
  college: string;
  branch: string;
  year: string;
  company?: string;
  jobRole?: string;
  skills?: string[];
  interests?: string[];
  github?: string;
  linkedin?: string;
  resume?: string;
  profileImage?: string;
  isWorking?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConnectionRequest {
  _id: string;
  sender: User;
  receiver: User;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id: string;
  sender: User;
  receiver: User;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface JobPosting {
  _id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  location: string;
  salary?: string;
  type: 'full-time' | 'part-time' | 'internship';
  postedBy: User;
  applicants: User[];
  createdAt: Date;
  expiresAt: Date;
}

export interface Webinar {
  _id: string;
  title: string;
  description: string;
  date: Date;
  duration: number;
  link: string;
  host: User;
  attendees: User[];
  maxAttendees: number;
  createdAt: Date;
}

export interface Notification {
  _id: string;
  user: string;
  type: 'connection_request' | 'connection_accepted' | 'message' | 'job_application' | 'webinar_registration';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}