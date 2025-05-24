export interface ProductCreateDto {
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  inStock: boolean;
  quantity: number;
  featured: boolean;
  newArrival: boolean;
  discount?: number;
  rating?: number;
  sizeIds?: number[];
  colorIds?: number[];
}

export interface ProductUpdateDto extends ProductCreateDto {
  id: number;
}

export interface Category {
  id: number;
  name: string;
  nameAr?: string;
}

export interface Size {
  id: number;
  name: string;
}

export interface Color {
  id: number;
  name: string;
  nameAr?: string;
  colorCode: string;
}
