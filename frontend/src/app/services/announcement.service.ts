import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Announcement } from '../models/announcement.model';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private announcementSubject = new BehaviorSubject<Announcement | null>(null);
  public announcement$ = this.announcementSubject.asObservable();
  private baseUrl = 'http://localhost:8080';
  private pollInterval: any;

  constructor(private http: HttpClient) {}

  connect(): void {
    console.log('Starting announcement polling');
    // Polling thay vì WebSocket để tránh lỗi
    this.pollInterval = setInterval(() => {
      this.checkForNewAnnouncements();
    }, 5000); // Poll mỗi 5 giây
  }

  disconnect(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  private checkForNewAnnouncements(): void {
    // Simulate nhận thông báo mới (có thể thay bằng API call thực tế)
    // Tạm thời comment để không spam
    // const mockAnnouncement: Announcement = {
    //   id: Date.now(),
    //   title: 'Thông báo mới',
    //   message: 'Đây là thông báo test',
    //   isActive: true,
    //   createdAt: new Date().toISOString()
    // };
    // this.announcementSubject.next(mockAnnouncement);
  }

  getActiveAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.baseUrl}/api/announcements/active`);
  }
}