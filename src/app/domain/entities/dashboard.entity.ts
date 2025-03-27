export interface DashboardCard {
    id: number;
    title: string;
    type: 'chart' | 'notification';
    data?: any;
  }