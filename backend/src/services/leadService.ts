import Lead from '../models/Lead';

export async function createLead(data: { name: string; phone: string; email?: string }) {
  return Lead.create(data);
}
