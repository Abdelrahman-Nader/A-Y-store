import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  productForm: FormGroup;

  loading = false;
  error = false;
  isEditing = false;
  showForm = false;
  searchTerm = '';

  // For image preview
  imagePreview: string | null = null;

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder
  ) {
    this.productForm = this.createProductForm();
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...products];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  createProductForm(product?: Product): FormGroup {
    return this.formBuilder.group({
      id: [product ? product.id : null],
      name: [product ? product.name : '', Validators.required],
      description: [product ? product.description : '', Validators.required],
      price: [product ? product.price : '', [Validators.required, Validators.min(0)]],
      imageUrl: [product ? product.imageUrl : '', Validators.required],
      category: [product ? product.category : '', Validators.required],
      inStock: [product ? product.inStock : true],
      quantity: [product ? product.quantity : 0, [Validators.required, Validators.min(0)]],
      sizes: [product ? product.sizes?.join(', ') : ''],
      colors: [product ? product.colors?.join(', ') : ''],
      featured: [product ? product.featured : false],
      newArrival: [product ? product.newArrival : false],
      discount: [product ? product.discount : 0, [Validators.min(0), Validators.max(100)]]
    });
  }

  get f() { return this.productForm.controls; }

  onSubmit(): void {
    if (this.productForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      return;
    }

    const productData = this.prepareProductData();

    this.loading = true;

    if (this.isEditing) {
      // Update existing product
      this.productService.updateProduct(productData.id, productData).subscribe({
        next: (updatedProduct) => {
          this.handleSuccess('Product updated successfully');
          this.updateProductInList(updatedProduct);
        },
        error: (error) => this.handleError('Error updating product', error)
      });
    } else {
      // Create new product
      this.productService.createProduct(productData).subscribe({
        next: (newProduct) => {
          this.handleSuccess('Product created successfully');
          this.products.push(newProduct);
          this.filteredProducts = [...this.products];
        },
        error: (error) => this.handleError('Error creating product', error)
      });
    }
  }

  prepareProductData(): any {
    const formValue = this.productForm.value;

    // Convert comma-separated strings to arrays
    const sizes = formValue.sizes ? formValue.sizes.split(',').map((size: string) => size.trim()).filter((size: string) => size) : [];
    const colors = formValue.colors ? formValue.colors.split(',').map((color: string) => color.trim()).filter((color: string) => color) : [];

    // إذا كنا نقوم بإنشاء منتج جديد، نقوم بإزالة حقل id لأن JSON Server سيقوم بإنشاء معرف تلقائيًا
    // وإذا كنا نقوم بتعديل منتج موجود، نتأكد من أن المعرف رقمي وليس نصي
    const productData = {
      ...formValue,
      sizes,
      colors
    };

    // إذا كان المنتج جديدًا، نحذف حقل id
    if (!this.isEditing) {
      delete productData.id;
    }
    // إذا كان المنتج موجودًا، نتأكد من أن المعرف رقمي
    else if (productData.id && typeof productData.id === 'string') {
      productData.id = parseInt(productData.id, 10);
    }

    return productData;
  }

  editProduct(product: Product): void {
    this.isEditing = true;
    this.showForm = true;
    this.productForm = this.createProductForm(product);
    this.imagePreview = product.imageUrl;

    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteProduct(product: Product): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.loading = true;
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.handleSuccess('Product deleted successfully');
          this.products = this.products.filter(p => p.id !== product.id);
          this.filteredProducts = this.filteredProducts.filter(p => p.id !== product.id);
        },
        error: (error) => this.handleError('Error deleting product', error)
      });
    }
  }

  addNewProduct(): void {
    this.isEditing = false;
    this.showForm = true;
    this.productForm = this.createProductForm();
    this.imagePreview = null;

    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.showForm = false;
    this.productForm.reset();
    this.imagePreview = null;
  }

  onImageUrlChange(): void {
    const imageUrl = this.f['imageUrl'].value;
    if (imageUrl) {
      this.imagePreview = imageUrl;
    } else {
      this.imagePreview = null;
    }
  }

  search(): void {
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
    } else {
      this.filteredProducts = [...this.products];
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredProducts = [...this.products];
  }

  private handleSuccess(message: string): void {
    this.loading = false;
    this.showForm = false;
    this.productForm.reset();
    this.imagePreview = null;
    alert(message); // In a real app, use a proper notification service
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.loading = false;
    alert(`${message}: ${error.message}`); // In a real app, use a proper notification service
  }

  private updateProductInList(updatedProduct: Product): void {
    const index = this.products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = updatedProduct;
      this.filteredProducts = [...this.products];
    }
  }
}
