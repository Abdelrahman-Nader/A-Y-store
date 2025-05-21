import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/core/services/order.service';
import { Order, OrderStatus } from 'src/app/core/models/order.model';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss']
})
export class OrderManagementComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedOrder: Order | null = null;

  loading = false;
  error = false;
  searchTerm = '';

  // For status filter
  statusFilter: string = '';
  orderStatuses = OrderStatus;

  // For order details modal
  showOrderDetails = false;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filteredOrders = [...orders];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.showOrderDetails = true;
  }

  closeOrderDetails(): void {
    this.showOrderDetails = false;
    this.selectedOrder = null;
  }

  updateOrderStatus(orderId: number, status: OrderStatus): void {
    this.loading = true;
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: (updatedOrder) => {
        this.loading = false;

        // Update order in the lists
        this.updateOrderInList(updatedOrder);

        // If the order details modal is open and this is the selected order, update it
        if (this.selectedOrder && this.selectedOrder.id === updatedOrder.id) {
          this.selectedOrder = updatedOrder;
        }

        alert('Order status updated successfully'); // In a real app, use a proper notification service
      },
      error: (error) => {
        console.error('Error updating order status', error);
        this.loading = false;
        alert(`Error updating order status: ${error.message}`); // In a real app, use a proper notification service
      }
    });
  }

  search(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  filterByStatus(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.orders];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toString().includes(term) ||
        order.shippingAddress.fullName.toLowerCase().includes(term) ||
        order.shippingAddress.phone.includes(term)
      );
    }

    // Apply status filter
    if (this.statusFilter) {
      filtered = filtered.filter(order => order.status === this.statusFilter);
    }

    this.filteredOrders = filtered;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-warning';
      case OrderStatus.PROCESSING:
        return 'bg-info';
      case OrderStatus.SHIPPED:
        return 'bg-primary';
      case OrderStatus.DELIVERED:
        return 'bg-success';
      case OrderStatus.CANCELLED:
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  private updateOrderInList(updatedOrder: Order): void {
    // Update in main orders array
    const index = this.orders.findIndex(o => o.id === updatedOrder.id);
    if (index !== -1) {
      this.orders[index] = updatedOrder;
    }

    // Update in filtered orders array
    const filteredIndex = this.filteredOrders.findIndex(o => o.id === updatedOrder.id);
    if (filteredIndex !== -1) {
      this.filteredOrders[filteredIndex] = updatedOrder;
    }
  }
}
