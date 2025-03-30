export interface Notification {
  id: number;
  type: 'low' | 'medium' | 'high'; 
  message: string;
  timestamp: Date;
}
