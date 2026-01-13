export interface MessageData {
  id: string;
  name: string;
  role: string;
  status: 'Offer Pending' | 'Hired' | 'Completed' | 'Inquiry' | 'Canceled';
  statusColor: string;
  statusTextColor: string;
  message: string;
  time: string;
  image: string;
}