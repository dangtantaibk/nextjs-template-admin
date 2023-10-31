export interface ProductProps {
  createdAt: number;
  description: string;
  id: Number;
  image: string;
  name: string;
  price: Number;
  rating: Number;
  status: Number;
  stock: Number;
  updatedAt: string;
  viewCount: Number;
}

export interface ProductApiProps {
  content: ProductProps[];
  first: boolean;
  last: boolean;
  number: Number;
  numberOfElements: Number;
  size: Number;
  sort: null;
  totalElements: Number;
  totalPages: Number;
}