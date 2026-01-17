
import { ReactNode } from "react";

export type ProductCategory = 'slimming' | 'athlete';

export interface Product {
  id: string;
  name:string;
  description: string;
  imageUrl: string;
  price: number;
  salePrice?: number;
  category: ProductCategory;
  stock: number;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl: string;
  author: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  isActive: boolean;
}

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'info';
  icon: ReactNode;
}

export interface SiteSettings {
  logoUrl?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBannerText: string;
  lastUpdated?: number; // الطابع الزمني لآخر تحديث
}
