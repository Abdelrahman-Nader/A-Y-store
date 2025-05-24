import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/core/services/product.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { Product } from 'src/app/core/models/product.model';
import { ProductCreateDto, Category, Size, Color } from 'src/app/core/models/product-dto.model';

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

  // Categories, sizes, and colors for dropdowns
  categories: Category[] = [];
  sizes: Size[] = [];
  colors: Color[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder
  ) {
    this.productForm = this.createProductForm();
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadSizes();
    this.loadColors();
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

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories', error);
      }
    });
  }

  loadSizes(): void {
    this.categoryService.getSizes().subscribe({
      next: (sizes) => {
        this.sizes = sizes;
      },
      error: (error) => {
        console.error('Error loading sizes', error);
      }
    });
  }

  loadColors(): void {
    this.categoryService.getColors().subscribe({
      next: (colors) => {
        this.colors = colors;
      },
      error: (error) => {
        console.error('Error loading colors', error);
      }
    });
  }

  createProductForm(product?: Product): FormGroup {
    return this.formBuilder.group({
      id: [product ? product.id : null],
      name: [product ? product.name : '', Validators.required],
      nameAr: [product ? (product as any).nameAr || '' : ''],
      description: [product ? product.description : '', Validators.required],
      descriptionAr: [product ? (product as any).descriptionAr || '' : ''],
      price: [product ? product.price : '', [Validators.required, Validators.min(0)]],
      imageUrl: [product ? product.imageUrl : '', Validators.required],
      categoryId: [product ? (product as any).categoryId || null : null], // إزالة Validators.required مؤقت<|im_start|>
      inStock: [product ? product.inStock : true],
      quantity: [product ? product.quantity : 0, [Validators.required, Validators.min(0)]],
      sizes: [product ? product.sizes?.join(', ') : ''],
      colors: [product ? product.colors?.join(', ') : ''],
      featured: [product ? product.featured : false],
      newArrival: [product ? product.newArrival : false],
      discount: [product ? product.discount : 0, [Validators.min(0), Validators.max(100)]],
      rating: [product ? product.rating : null]
    });
  }

  get f() { return this.productForm.controls; }

  onSubmit(): void {
    console.log('onSubmit called');
    console.log('Form valid:', this.productForm.valid);
    console.log('Form value:', this.productForm.value);
    console.log('Form errors:', this.getFormErrors());

    if (this.productForm.invalid) {
      console.log('Form is invalid, marking fields as touched');
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
    console.log('Prepared product data:', productData);

    this.loading = true;

    if (this.isEditing) {
      // Update existing product
      const productId = this.productForm.value.id;
      this.productService.updateProductWithDto(productId, { ...productData, id: productId }).subscribe({
        next: (updatedProduct) => {
          this.handleSuccess('Product updated successfully');
          this.updateProductInList(updatedProduct);
        },
        error: (error) => this.handleError('Error updating product', error)
      });
    } else {
      // Create new product using simple method for testing
      console.log('Creating new product...');

      // تحضير البيانات المبسطة
      const simpleProductData = {
        name: productData.name,
        nameAr: productData.nameAr,
        description: productData.description,
        descriptionAr: productData.descriptionAr,
        price: productData.price,
        imageUrl: productData.imageUrl,
        inStock: productData.inStock,
        quantity: productData.quantity,
        featured: productData.featured,
        newArrival: productData.newArrival,
        discount: productData.discount,
        rating: productData.rating
      };

      console.log('Simple product data:', simpleProductData);

      this.productService.createSimpleProduct(simpleProductData).subscribe({
        next: (newProduct) => {
          console.log('Product created successfully:', newProduct);
          this.handleSuccess('Product created successfully');
          this.products.push(newProduct);
          this.filteredProducts = [...this.products];
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.handleError('Error creating product', error);
        }
      });
    }
  }

  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  prepareProductData(): ProductCreateDto {
    const formValue = this.productForm.value;

    // Convert comma-separated strings to arrays and find IDs
    const sizeNames = formValue.sizes ? formValue.sizes.split(',').map((size: string) => size.trim()).filter((size: string) => size) : [];
    const colorNames = formValue.colors ? formValue.colors.split(',').map((color: string) => color.trim()).filter((color: string) => color) : [];

    // Find size IDs
    const sizeIds = sizeNames.map((sizeName: string) => {
      const size = this.sizes.find(s => s.name.toLowerCase() === sizeName.toLowerCase());
      return size ? size.id : null;
    }).filter((id: number | null) => id !== null) as number[];

    // Find color IDs
    const colorIds = colorNames.map((colorName: string) => {
      const color = this.colors.find(c => c.name.toLowerCase() === colorName.toLowerCase());
      return color ? color.id : null;
    }).filter((id: number | null) => id !== null) as number[];

    // Create DTO object
    const productDto: ProductCreateDto = {
      name: formValue.name,
      nameAr: formValue.nameAr || '',
      description: formValue.description,
      descriptionAr: formValue.descriptionAr || '',
      price: parseFloat(formValue.price),
      imageUrl: formValue.imageUrl,
      categoryId: formValue.categoryId ? parseInt(formValue.categoryId) : 1, // افتراضي 1 إذا لم يتم اختيار فئة
      inStock: formValue.inStock,
      quantity: parseInt(formValue.quantity),
      featured: formValue.featured,
      newArrival: formValue.newArrival,
      discount: formValue.discount ? parseInt(formValue.discount) : 0,
      rating: formValue.rating ? parseFloat(formValue.rating) : undefined,
      sizeIds: sizeIds,
      colorIds: colorIds
    };

    return productDto;
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
    console.log('addNewProduct called');
    this.isEditing = false;
    this.showForm = true;
    this.productForm = this.createProductForm();
    this.imagePreview = null;
    console.log('Form created, showForm:', this.showForm);

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
