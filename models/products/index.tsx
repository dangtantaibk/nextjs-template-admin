export interface ProductProps {
  createdAt: string;
  description: string;
  id: Number;
  image: String;
  name: String;
  price: Number;
  rating: Number;
  status: Number;
  stock: Number;
  updatedAt: String;
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