import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { DataService } from '../data.service';
import { Subscription, first, map } from 'rxjs';


@Component({
  selector: 'app-campaus-care',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatBadgeModule
  ],
  templateUrl: './campus-care.component.html',
  styleUrl: './campus-care.component.scss'
})
export class CampausCareComponent implements OnInit {


  products: any = {};
  cartItems: any[] = [];
  dataSubscription: Subscription;
  student: any;
  studentCourses: any[];
  myOrdersArr: any;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.allProducts();
  }

  public get categories(): string[] {
    return Object.keys(this.products);
  }

  public allProducts() {
    this.dataService.getProducts()
      .pipe(
        first(),
        map(data => {
          const temp = {};
          const { results: { Items: items } } = data;
          items.forEach(item => {
            if (!temp[item['category']])
              temp[item['category']] = [];
            temp[item['category']].push({ ...item, inCart: false });
          });
          return temp;
        })
      )
      .subscribe({
        next: (data) => this.products = data,
        error: (error) => console.error('Error fetching data:', error),
        complete: () => console.log('Data fetch completed')
      });
  }

  public addProduct(product: any) {
    product.inCart = true;
    this.cartItems.push({
      itemId: product.itemId,
      image: product.image
    });
  }


  public onCheckout() {
    if (!(this.dataService.student && this.dataService.student.id)) {
      alert("Please Login to continue");
      return;
    }
    if (!this.cartItems.length) return alert("Please add items to the cart")
    let order = {
      orderId: crypto.randomUUID(),
      studentId: this.dataService.student?.id,
      createdAt: new Date().toISOString(),
      picked: false,
      orderDetails: this.cartItems
    }


    this.dataService.registerStudentOrder(order)
      .subscribe({
        next: (data) => {
          this.allProducts();
          console.log(data);
          alert('Your order has been placed!');
          this.cartItems = [];
        },
        error: (error) => console.error('Something went wrong', error),
        complete: () => console.log('Completed')
      });
  }

  openDialog() {
    const dialog: any = document.querySelector('#orderDialog');
    dialog.showModal();
  }

  closeDialog() {
    const dialog: any = document.querySelector('#orderDialog');
    dialog.close();
  }

  myOrders() {
    if (!(this.dataService.student && this.dataService.student.id)) {
      alert("Please Login to continue");
      return;
    }
    this.dataService.getStudentOrders(this.dataService.student.id)
      .subscribe({
        next: (data) => {
          this.allProducts();
          this.myOrdersArr = data['results']
          console.log(data);
          this.openDialog()
        },
        error: (error) => console.error('Something went wrong', error),
        complete: () => console.log('Completed')
      });
  }


  test(item?) {
    // // console.log(item);
    // console.log(this.cartItems);
    //  console.log(this.productArr);
  }

  ngOnDestroy(): void {
  }
}
