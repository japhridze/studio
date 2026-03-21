
import type { Category, Order, Product, User } from './types';

export const categories: Category[] = [
  { 
    id: 'cat-1', 
    name: 'Construction', 
    slug: 'construction',
    subcategories: [
      { id: 'sub-1', name: 'Varnishes & Paints', slug: 'paints-varnishes', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkATr5xoI8LtHysZBmz3Lx8G4GuLCPq07lcTepNylnRA&s&ec=121585071' },
      { id: 'sub-2', name: 'Insulation Materials', slug: 'insulation-materials', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUAAlCsYCUjYHNXbNZmTQe824IRbvbD-GNAFdhM7UT-g&s&ec=121585071' },
      { id: 'sub-3', name: 'Roofing & Facade Systems', slug: 'roofing-facade', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGqmEWfg78v9YP7vlWpYQdH6Qrd0WAaZmXUHsYRcnzcQ&s&ec=121585071' },
      { id: 'sub-4', name: 'Formwork & Wood Systems', slug: 'wood-materials', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW1xr47Vo_yts1kjKNgT2UcxJxlNlXc95zidLti5Fi6w&s&ec=121585071' },
      { id: 'sub-5', name: 'Construction Powders', slug: 'construction-powders', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkHkAUZFyBZxTYTCG92j1CXjpJiyAal4Kut0vYoodYQQ&s&ec=121585071' },
      { id: 'sub-6', name: 'Construction & Gypsum Boards', slug: 'construction-boards', imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop' },
      { id: 'sub-7', name: 'Bricks & Blocks', slug: 'bricks-blocks', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk4HD07epzBmFE2ECW8c221yh2vDPJXoc9YbVwhfaZRQ&s&ec=121585071' },
      { id: 'sub-8', name: 'Consumables', slug: 'consumables', imageUrl: 'https://images.unsplash.com/photo-1581147036324-c17da42ef5e0?w=400&h=400&fit=crop' },
      { id: 'sub-9', name: 'Adhesives & Sealants', slug: 'adhesives-sealants', imageUrl: 'https://images.unsplash.com/photo-1563214591-e4905324316d?w=400&h=400&fit=crop' },
      { id: 'sub-10', name: 'Construction Profiles & Accessories', slug: 'profiles-accessories', imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&h=400&fit=crop' },
      { id: 'sub-11', name: 'Construction Liquids & Solutions', slug: 'liquids-solutions', imageUrl: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?w=400&h=400&fit=crop' },
      { id: 'sub-12', name: 'Warehouse Products', slug: 'warehouse-products', imageUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=400&fit=crop' },
      { id: 'sub-13', name: 'Stair Treads & Railings', slug: 'stairs-railings', imageUrl: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=400&h=400&fit=crop' },
    ]
  },
  { 
    id: 'cat-2', 
    name: 'Renovation', 
    slug: 'renovation',
    subcategories: [
      { id: 'sub-r-1', name: 'Doors', slug: 'doors', imageUrl: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?auto=format&fit=crop&q=80&w=400' },
      { id: 'sub-r-2', name: 'Flooring', slug: 'flooring', imageUrl: 'https://images.unsplash.com/photo-1581850518616-cee815377afb?w=400&h=400&fit=crop' },
      { id: 'sub-r-3', name: 'Ceramic Tiles', slug: 'ceramic-tiles', imageUrl: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=400&h=400&fit=crop' },
      { id: 'sub-r-4', name: 'Varnishes & Paints', slug: 'paints-varnishes', imageUrl: 'https://images.unsplash.com/photo-1562624312-e2ec29a18d99?w=400&h=400&fit=crop' },
    ]
  },
  { id: 'cat-3', name: 'Plumbing', slug: 'plumbing' },
  { id: 'cat-4', name: 'Climate Control', slug: 'climate-control' },
  { id: 'cat-5', name: 'Tools', slug: 'tools' },
  { id: 'cat-6', name: 'Lighting', slug: 'lighting' },
];

export const products: Product[] = [
  { id: '1', name: 'Cordless Drill Pro', slug: 'cordless-drill-pro', sku: 'CDP-001', description: 'High-performance cordless drill for all your DIY needs. Comes with two batteries.', price: 129.99, imageUrl: 'prod-drill', categoryId: 'cat-5', stock: 50 },
  { id: '2', name: 'Premium Wall Paint', slug: 'premium-wall-paint', sku: 'PWP-001', description: '1 gallon of premium, low-odor white wall paint. Easy to clean and durable.', price: 39.99, imageUrl: 'prod-paint', categoryId: 'cat-1', stock: 120 },
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
