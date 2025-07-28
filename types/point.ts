export interface Point {
  id: number;
  title: string;
  content: string;
  points: number;
  type: 'EARN' | 'USE';
  createdAt: string;
  userId: number;
}

export interface PointSummary {
  totalPoints: number;
  earnedPoints: number;
  usedPoints: number;
  userId: number;
}

export interface PointRequest {
  title: string;
  content: string;
  points: number;
  type: 'EARN' | 'USE';
}

export interface Receipt {
  id: number;
  itemName: string;
  itemType: string;
  price: number;
  quantity: number;
  totalAmount: number;
  purchaseDate: string;
  transactionId: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  createdAt: string;
  userId: number;
}

export interface ReceiptRequest {
  itemName: string;
  itemType: string;
  price: number;
  quantity: number;
  transactionId: string;
  purchaseDate?: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
} 