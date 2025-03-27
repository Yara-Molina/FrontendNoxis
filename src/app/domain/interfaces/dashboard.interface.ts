export type CardType = 'chart' | 'notification';

export interface DashboardCard {
  id: number;
  title: string;
  type: CardType;
  data?: any;
}