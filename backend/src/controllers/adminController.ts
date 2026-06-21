import { Request, Response } from 'express';
import * as svc from '../services/adminService';

function err(res: Response, e: any) {
  res.status(e?.status ?? 500).json({ message: e?.message ?? 'Server error' });
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) { res.status(400).json({ message: 'Email and password required' }); return; }
    res.json(await svc.adminLogin(email, password));
  } catch (e) { err(res, e); }
}

export async function me(req: Request, res: Response) {
  try {
    const admin = await svc.getAdminById(req.adminAuth!.adminId);
    if (!admin) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(admin);
  } catch (e) { err(res, e); }
}

// ── Products ─────────────────────────────────────────────────────────────────

export async function listProducts(_req: Request, res: Response) {
  try { res.json(await svc.adminListProducts()); } catch (e) { err(res, e); }
}

export async function getProduct(req: Request, res: Response) {
  try {
    const p = await svc.adminGetProduct(req.params.id);
    if (!p) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(p);
  } catch (e) { err(res, e); }
}

export async function createProduct(req: Request, res: Response) {
  try { res.status(201).json(await svc.adminCreateProduct(req.body)); } catch (e) { err(res, e); }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const p = await svc.adminUpdateProduct(req.params.id, req.body);
    if (!p) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(p);
  } catch (e) { err(res, e); }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const ok = await svc.adminDeleteProduct(req.params.id);
    if (!ok) { res.status(404).json({ message: 'Not found' }); return; }
    res.status(204).end();
  } catch (e) { err(res, e); }
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function listCategories(_req: Request, res: Response) {
  try { res.json(await svc.adminListCategories()); } catch (e) { err(res, e); }
}

export async function createCategory(req: Request, res: Response) {
  try { res.status(201).json(await svc.adminCreateCategory(req.body)); } catch (e) { err(res, e); }
}

export async function updateCategory(req: Request, res: Response) {
  try {
    const c = await svc.adminUpdateCategory(req.params.id, req.body);
    if (!c) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(c);
  } catch (e) { err(res, e); }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    const ok = await svc.adminDeleteCategory(req.params.id);
    if (!ok) { res.status(404).json({ message: 'Not found' }); return; }
    res.status(204).end();
  } catch (e) { err(res, e); }
}

// ── Styles ────────────────────────────────────────────────────────────────────

export async function listStyles(_req: Request, res: Response) {
  try { res.json(await svc.adminListStyles()); } catch (e) { err(res, e); }
}

export async function createStyle(req: Request, res: Response) {
  try { res.status(201).json(await svc.adminCreateStyle(req.body)); } catch (e) { err(res, e); }
}

export async function updateStyle(req: Request, res: Response) {
  try {
    const s = await svc.adminUpdateStyle(req.params.id, req.body);
    if (!s) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(s);
  } catch (e) { err(res, e); }
}

export async function deleteStyle(req: Request, res: Response) {
  try {
    const ok = await svc.adminDeleteStyle(req.params.id);
    if (!ok) { res.status(404).json({ message: 'Not found' }); return; }
    res.status(204).end();
  } catch (e) { err(res, e); }
}

// ── Banners ───────────────────────────────────────────────────────────────────

export async function listBanners(_req: Request, res: Response) {
  try { res.json(await svc.adminListBanners()); } catch (e) { err(res, e); }
}

export async function createBanner(req: Request, res: Response) {
  try { res.status(201).json(await svc.adminCreateBanner(req.body)); } catch (e) { err(res, e); }
}

export async function updateBanner(req: Request, res: Response) {
  try {
    const b = await svc.adminUpdateBanner(req.params.id, req.body);
    if (!b) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(b);
  } catch (e) { err(res, e); }
}

export async function toggleBanner(req: Request, res: Response) {
  try {
    const b = await svc.adminToggleBanner(req.params.id);
    if (!b) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(b);
  } catch (e) { err(res, e); }
}

export async function deleteBanner(req: Request, res: Response) {
  try {
    const ok = await svc.adminDeleteBanner(req.params.id);
    if (!ok) { res.status(404).json({ message: 'Not found' }); return; }
    res.status(204).end();
  } catch (e) { err(res, e); }
}

// ── Orders ────────────────────────────────────────────────────────────────────

export async function listOrders(req: Request, res: Response) {
  try {
    const status = req.query.status as string | undefined;
    res.json(await svc.adminListOrders(status));
  } catch (e) { err(res, e); }
}

export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const o = await svc.adminUpdateOrderStatus(req.params.id, req.body.orderStatus);
    if (!o) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(o);
  } catch (e) { err(res, e); }
}

// ── Settings ──────────────────────────────────────────────────────────────────

export async function getSettings(_req: Request, res: Response) {
  try { res.json(await svc.getSettings()); } catch (e) { err(res, e); }
}

export async function updateSettings(req: Request, res: Response) {
  try { res.json(await svc.updateSettings(req.body)); } catch (e) { err(res, e); }
}
