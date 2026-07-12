import Lead from '../models/Lead';

interface CreateLeadInput {
  name: string;
  phone: string;
  email?: string;
  cartItems?: { productId: string; name: string; qty: number; price: number }[];
}

export async function createLead(data: CreateLeadInput) {
  return Lead.create(data);
}
