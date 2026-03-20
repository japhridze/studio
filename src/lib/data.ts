
import type { Category, Order, Product, User } from './types';

export const categories: Category[] = [
  { 
    id: 'cat-1', 
    name: 'Construction', 
    slug: 'construction',
    subcategories: [
      { id: 'sub-1', name: 'Varnishes & Paints', slug: 'paints-varnishes', imageUrl: 'https://aid.ge/wp-content/uploads/2015/10/sagebavebis-tipebi-5.jpg' },
      { id: 'sub-2', name: 'Insulation Materials', slug: 'insulation-materials', imageUrl: 'sub-insulation' },
      { id: 'sub-3', name: 'Roofing & Facade Systems', slug: 'roofing-facade', imageUrl: 'sub-roofing' },
      { id: 'sub-4', name: 'Formwork & Wood Systems', slug: 'wood-systems', imageUrl: 'sub-wood' },
      { id: 'sub-5', name: 'Construction Powders', slug: 'construction-powders', imageUrl: 'sub-powders' },
      { id: 'sub-6', name: 'Construction & Gypsum Boards', slug: 'construction-boards', imageUrl: 'sub-boards' },
      { id: 'sub-7', name: 'Bricks & Blocks', slug: 'bricks-blocks', imageUrl: 'sub-bricks' },
      { id: 'sub-8', name: 'Consumables', slug: 'consumables', imageUrl: 'sub-consumables' },
      { id: 'sub-9', name: 'Adhesives & Sealants', slug: 'adhesives-sealants', imageUrl: 'sub-adhesives' },
      { id: 'sub-10', name: 'Construction Profiles & Accessories', slug: 'profiles-accessories', imageUrl: 'sub-profiles' },
      { id: 'sub-11', name: 'Construction Liquids & Solutions', slug: 'liquids-solutions', imageUrl: 'sub-liquids' },
      { id: 'sub-12', name: 'Warehouse Products', slug: 'warehouse-products', imageUrl: 'sub-warehouse' },
      { id: 'sub-13', name: 'Stair Treads & Railings', slug: 'stairs-railings', imageUrl: 'sub-stairs' },
    ]
  },
  { id: 'cat-2', name: 'Renovation', slug: 'renovation' },
  { id: 'cat-3', name: 'Plumbing', slug: 'plumbing' },
  { id: 'cat-4', name: 'Climate Control', slug: 'climate-control' },
  { id: 'cat-5', name: 'Tools', slug: 'tools' },
  { id: 'cat-6', name: 'Lighting', slug: 'lighting' },
];

export const products: Product[] = [
  { id: '1', name: 'Cordless Drill Pro', slug: 'cordless-drill-pro', sku: 'CDP-001', description: 'High-performance cordless drill for all your DIY needs. Comes with two batteries.', price: 129.99, imageUrl: 'prod-drill', categoryId: 'cat-5', stock: 50 },
  { id: '2', name: 'Premium Wall Paint', slug: 'premium-wall-paint', sku: 'PWP-001', description: '1 gallon of premium, low-odor white wall paint. Easy to clean and durable.', price: 39.99, imageUrl: 'prod-paint', categoryId: 'cat-2', stock: 120 },
  { id: '3', name: 'Heavy Duty Circular Saw', slug: 'heavy-duty-circular-saw', sku: 'HDCS-001', description: '15-Amp 7-1/4-Inch circular saw with laser guide for precise cuts.', price: 89.99, imageUrl: 'prod-saw', categoryId: 'cat-5', stock: 30 },
  { id: '4', name: '20oz Claw Hammer', slug: '20oz-claw-hammer', sku: 'CH-020', description: 'Ergonomic claw hammer with anti-vibration grip. Built to last.', price: 24.99, imageUrl: 'prod-hammer', categoryId: 'cat-5', stock: 200 },
  { id: '5', name: 'Portable Red Toolbox', slug: 'portable-red-toolbox', sku: 'PRT-001', description: 'Durable steel toolbox with multiple compartments to keep your tools organized.', price: 49.99, imageUrl: 'prod-toolbox', categoryId: 'cat-5', stock: 75 },
  { id: '6', name: 'LED Smart Bulb', slug: 'led-smart-bulb', sku: 'LSB-A19', description: 'Energy-efficient A19 smart bulb. Controllable via app, works with Alexa and Google Assistant.', price: 19.99, imageUrl: 'prod-lightbulb', categoryId: 'cat-6', stock: 300 },
  { id: '7', name: '25ft Measuring Tape', slug: '25ft-measuring-tape', sku: 'MT-025', description: 'Self-locking measuring tape with a durable case and easy-to-read markings.', price: 12.99, imageUrl: 'prod-tape', categoryId: 'cat-5', stock: 150 },
  { id: '8', name: 'Adjustable Wrench Set', slug: 'adjustable-wrench-set', sku: 'AWS-003', description: '3-piece set of adjustable wrenches for various nuts and bolts.', price: 34.99, imageUrl: 'prod-wrench', categoryId: 'cat-5', stock: 90 },
];

export const users: Omit<User, 'id'>[] = [
    { name: 'Admin User', email: 'admin@gorgia.com', role: 'admin' },
];

export const orders: Order[] = [
    { id: 'ORD001', userId: '2', userName: 'John Doe', date: '2023-10-26', total: 164.98, status: 'Delivered', itemCount: 2 },
];
