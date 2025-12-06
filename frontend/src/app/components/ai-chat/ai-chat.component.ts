import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { CartService } from '../../services/cart.service';
import { ChatMessage } from '../../models/chat.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.css']
})
export class AiChatComponent {
  isOpen = false;
  isLoading = false;
  messages: ChatMessage[] = [];
  userInput = '';
  
  suggestionChips = [
    'Gợi ý áo thun nam',
    'Đồ đi tiệc',
    'Quần jean giá rẻ',
    'Áo sơ mi công sở',
    'Váy dự tiệc',
    'Đồ thể thao',
    'Trang phục mùa hè',
    'Áo khoác đẹp'
  ];

  constructor(
    private chatService: ChatService,
    private cartService: CartService,
    private router: Router
  ) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage(message?: string) {
    const text = message || this.userInput.trim();
    if (!text || this.isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      text,
      timestamp: new Date()
    };
    
    this.messages.push(userMessage);
    this.userInput = '';
    this.isLoading = true;

    this.chatService.sendMessage({ message: text, topK: 3 }).subscribe({
      next: (response) => {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          text: response.answer,
          products: response.relatedProducts,
          timestamp: new Date()
        };
        this.messages.push(aiMessage);
        this.isLoading = false;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (error) => {
        console.error('Chat error:', error);
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
          timestamp: new Date()
        };
        this.messages.push(errorMessage);
        this.isLoading = false;
      }
    });
  }

  clearChat() {
    this.messages = [];
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product.id, 1).subscribe({
      next: () => {
        alert(`Đã thêm ${product.name} vào giỏ hàng!`);
      },
      error: (error) => {
        console.error('Add to cart error:', error);
        alert('Không thể thêm vào giỏ hàng. Vui lòng đăng nhập.');
      }
    });
  }

  viewProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom() {
    const chatBody = document.querySelector('.chat-messages');
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }
}
