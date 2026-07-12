import CustomOrderRequest from '../models/CustomOrderRequest';

interface CreateCustomOrderInput {
  name: string;
  phone: string;
  email?: string;
  occasion?: string;
  budgetRange?: string;
  preferredStone?: string;
  referenceImageUrl?: string;
  message?: string;
}

export async function createCustomOrderRequest(data: CreateCustomOrderInput) {
  return CustomOrderRequest.create(data);
}

export async function listCustomOrderRequests() {
  return CustomOrderRequest.find().sort({ createdAt: -1 });
}
