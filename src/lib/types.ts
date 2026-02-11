export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  categoryId: string;
  stock: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
};

export type Order = {
  id: string;
  userId: string;
  userName: string;
  date: string;
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered';
  itemCount: number;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
};
