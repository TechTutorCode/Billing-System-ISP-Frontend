// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status_code: number;
  message: string;
  session_id: string;
}

export interface VerifyOTPRequest {
  session_id: string;
  otp: string;
}

export interface VerifyOTPResponse {
  status_code: number;
  message: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// Customer types
export interface Customer {
  id: string;
  isp_id: string;
  account_number: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  id_number: string | null;
  address: string | null;
  status: 'active' | 'suspended' | 'terminated';
  created_at: string;
  updated_at: string;
}

export interface CustomerCreate {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  id_number?: string;
  address?: string;
}

export interface CustomerUpdate {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  id_number?: string;
  address?: string;
  status?: 'active' | 'suspended' | 'terminated';
}

// Package types
export interface PackageType {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Package {
  id: string;
  name: string;
  download_speed: number;
  upload_speed: number;
  price: string;
  validity_value: number;
  validity_unit: 'minutes' | 'hours' | 'days';
  data_limit_gb: number | null;
  router_id: string;
  package_type_id: string;
  package_type: PackageType;
  mikrotik_profile: string | null;
  mikrotik_profile_name: string | null;
  mikrotik_synced: boolean;
  mikrotik_synced_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PackageCreate {
  name: string;
  download_speed: number;
  upload_speed: number;
  price: number;
  validity_value: number;
  validity_unit: 'minutes' | 'hours' | 'days';
  data_limit_gb?: number;
  router_id: string;
  package_type_id: string;
}

export interface PackageUpdate {
  name?: string;
  download_speed?: number;
  upload_speed?: number;
  price?: number;
  validity_value?: number;
  validity_unit?: 'minutes' | 'hours' | 'days';
  data_limit_gb?: number;
}

// Subscription types
export interface Subscription {
  id: string;
  isp_id: string;
  customer_id: string;
  router_id: string;
  package_id: string;
  package_type: 'pppoe' | 'static' | 'hotspot';
  username: string;
  password: string | null;
  ip_address: string | null;
  status: 'pending' | 'active' | 'expired' | 'suspended' | 'terminated';
  start_at: string | null;
  end_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionCreate {
  customer_id: string;
  router_id: string;
  package_id: string;
  username: string;
  password?: string;
  ip_address?: string;
}

// Router types
export interface Router {
  id: string;
  isp_id: string;
  name: string;
  vpn_username: string;
  vpn_ip: string;
  api_port: number;
  mikrotik_api_username: string;
  status: 'online' | 'offline';
  last_seen: string | null;
  created_at: string;
}

// Payment types (mock - backend not implemented yet)
export interface Payment {
  id: string;
  subscription_id: string;
  amount: number;
  payment_method: 'M-PESA' | 'Cash' | 'Admin';
  status: 'pending' | 'success' | 'failed';
  transaction_id?: string;
  created_at: string;
}

export interface PaymentCreate {
  subscription_id: string;
  amount: number;
  payment_method: 'M-PESA' | 'Cash' | 'Admin';
  transaction_id?: string;
}

// Dashboard types (mock - backend not implemented yet)
export interface DashboardStats {
  total_customers: number;
  active_subscriptions: number;
  monthly_revenue: number;
  active_routers: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
}

export interface SubscriptionStatusData {
  status: string;
  count: number;
}
