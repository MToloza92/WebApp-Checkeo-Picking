import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

const STORAGE_KEY = 'checkPicking_products_v1';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  saveProducts(products: Product[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }

  getProducts(): Product[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  clearProducts(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  updateProduct(p: Product): void {
    const products = this.getProducts();
    const idx = products.findIndex(pr => pr.id === p.id);
    if (idx >= 0) {
      products[idx] = p;
      this.saveProducts(products);
    }
  }
}
