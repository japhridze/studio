import type { Category, Order, Product, User } from './types';

export const categories: Category[] = [
  { 
    id: '1', 
    name: 'Power Tools', 
    slug: 'power-tools',
    subcategories: [
      { id: '1-1', name: 'Drills', slug: 'drills' },
      { id: '1-2', name: 'Saws', slug: 'saws' },
      { id: '1-3', name: 'Sanders', slug: 'sanders' },
    ]
  },
  { 
    id: '2', 
    name: 'Hand Tools', 
    slug: 'hand-tools',
    subcategories: [
        { id: '2-1', name: 'Hammers', slug: 'hammers' },
        { id: '2-2', name: 'Wrenches', slug: 'wrenches' },
        { id: '2-3', name: 'Screwdrivers', slug: 'screwdrivers' },
    ]
  },
  { id: '3', name: 'Painting', slug: 'painting' },
  { id: '4', name: 'Building Materials', slug: 'building-materials' },
  { id: '5', name: 'Lighting', slug: 'lighting' },
  { id: '6', name: 'Safety Equipment', slug: 'safety-equipment' },
];

export const products: Product[] = [
  { id: '1', name: 'Cordless Drill Pro', slug: 'cordless-drill-pro', description: 'High-performance cordless drill for all your DIY needs. Comes with two batteries.', price: 129.99, images: ['prod-drill'], categoryId: '1', stock: 50 },
  { id: '2', name: 'Premium Wall Paint', slug: 'premium-wall-paint', description: '1 gallon of premium, low-odor white wall paint. Easy to clean and durable.', price: 39.99, images: ['prod-paint'], categoryId: '3', stock: 120 },
  { id: '3', name: 'Heavy Duty Circular Saw', slug: 'heavy-duty-circular-saw', description: '15-Amp 7-1/4-Inch circular saw with laser guide for precise cuts.', price: 89.99, images: ['prod-saw'], categoryId: '1', stock: 30 },
  { id: '4', name: '20oz Claw Hammer', slug: '20oz-claw-hammer', description: 'Ergonomic claw hammer with anti-vibration grip. Built to last.', price: 24.99, images: ['prod-hammer'], categoryId: '2', stock: 200 },
  { id: '5', name: 'Portable Red Toolbox', slug: 'portable-red-toolbox', description: 'Durable steel toolbox with multiple compartments to keep your tools organized.', price: 49.99, images: ['prod-toolbox'], categoryId: '2', stock: 75 },
  { id: '6', name: 'LED Smart Bulb', slug: 'led-smart-bulb', description: 'Energy-efficient A19 smart bulb. Controllable via app, works with Alexa and Google Assistant.', price: 19.99, images: ['prod-lightbulb'], categoryId: '5', stock: 300 },
  { id: '7', name: '25ft Measuring Tape', slug: '25ft-measuring-tape', description: 'Self-locking measuring tape with a durable case and easy-to-read markings.', price: 12.99, images: ['prod-tape'], categoryId: '2', stock: 150 },
  { id: '8', name: 'Adjustable Wrench Set', slug: 'adjustable-wrench-set', description: '3-piece set of adjustable wrenches for various nuts and bolts.', price: 34.99, images: ['prod-wrench'], categoryId: '2', stock: 90 },
  { id: '9', name: '6ft Aluminum Stepladder', slug: '6ft-aluminum-stepladder', description: 'Lightweight and sturdy aluminum stepladder with a 250lb capacity.', price: 79.99, images: ['prod-ladder'], categoryId: '4', stock: 40 },
  { id: '10', name: 'Leather Work Gloves', slug: 'leather-work-gloves', description: 'Durable leather gloves to protect your hands during tough jobs.', price: 15.99, images: ['prod-gloves'], categoryId: '6', stock: 250 },
];

export const users: Omit<User, 'id'>[] = [
    { name: 'Admin User', email: 'admin@gorgia.com', role: 'admin' },
    { name: 'John Doe', email: 'john.doe@example.com', role: 'customer' },
    { name: 'Jane Smith', email: 'jane.smith@example.com', role: 'customer' },
    { name: 'Michael Johnson', email: 'michael.j@example.com', role: 'customer' },
    { name: 'Emily Davis', email: 'emily.d@example.com', role: 'customer' },
];

export const orders: Order[] = [
    { id: 'ORD001', userId: '2', userName: 'John Doe', date: '2023-10-26', total: 164.98, status: 'Delivered', itemCount: 2 },
    { id: 'ORD002', userId: '3', userName: 'Jane Smith', date: '2023-10-28', total: 89.99, status: 'Shipped', itemCount: 1 },
    { id: 'ORD003', userId: '4', userName: 'Michael Johnson', date: '2023-10-30', total: 54.98, status: 'Pending', itemCount: 2 },
    { id: 'ORD004', userId: '2', userName: 'John Doe', date: '2023-11-01', total: 15.99, status: 'Pending', itemCount: 1 },
    { id: 'ORD005', userId: '5', userName: 'Emily Davis', date: '2023-11-02', total: 204.97, status: 'Shipped', itemCount: 3 },
];
