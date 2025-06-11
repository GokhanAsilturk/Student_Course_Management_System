import { apiClient } from './api';
import { 
  DashboardStats, 
  RecentActivity,
  PaginatedActivities,
  Enrollment,
  Student,
  Course
} from '../types';

class DashboardService {
  private readonly ACTIVITIES_PER_PAGE = 5;
  private readonly MAX_PAGES = 3;
  private readonly MAX_ACTIVITIES = this.ACTIVITIES_PER_PAGE * this.MAX_PAGES; // 15 aktivite

  /**
   * Dashboard istatistiklerini getir
   * Mevcut endpoint'lerden toplam verileri hesaplar
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Paralel olarak tüm verileri çek
      const [studentsResponse, coursesResponse, enrollmentsResponse] = await Promise.all([
        apiClient.get<any>('/students?limit=1'),
        apiClient.get<any>('/courses?limit=1'),
        apiClient.get<any>('/enrollments?limit=1')
      ]);      // Backend'den dönen sayfalama bilgilerinden toplam sayıları al
      const totalStudents = studentsResponse.pagination?.total ?? 0;
      const totalCourses = coursesResponse.pagination?.total ?? 0;
      const totalEnrollments = enrollmentsResponse.pagination?.total ?? 0;

      // Aktif ders sayısını şimdilik toplam ders sayısına eşitle
      // Gelecekte status kontrolü eklenebilir
      const activeCourses = totalCourses;

      return {
        totalStudents,
        totalCourses,
        totalEnrollments,
        activeCourses
      };
    } catch (error) {
      console.error('Dashboard stats fetch error:', error);
      // Hata durumunda varsayılan değerler döndür
      return {
        totalStudents: 0,
        totalCourses: 0,
        totalEnrollments: 0,
        activeCourses: 0
      };
    }
  }

  /**
   * Son aktiviteleri getir (geriye dönük uyumluluk için)
   * Sayfalı metodun ilk sayfasını döndürür
   */
  async getRecentActivities(): Promise<RecentActivity[]> {
    const paginatedResult = await this.getPaginatedActivities(1);
    return paginatedResult.activities;
  }

  /**
   * Sayfalanabilir aktiviteleri getir
   * @param page Sayfa numarası (1'den başlar)
   * @returns Sayfalanmış aktiviteler
   */
  async getPaginatedActivities(page: number = 1): Promise<PaginatedActivities> {
    try {
      // Sayfa kontrolü
      if (page < 1 || page > this.MAX_PAGES) {
        throw new Error(`Geçersiz sayfa numarası. 1-${this.MAX_PAGES} arasında olmalı.`);
      }

      // Tüm aktiviteleri çek
      const allActivities = await this.fetchAllActivities();
      
      // Sayfalama işlemi
      const startIndex = (page - 1) * this.ACTIVITIES_PER_PAGE;
      const endIndex = startIndex + this.ACTIVITIES_PER_PAGE;
      const paginatedActivities = allActivities.slice(startIndex, endIndex);

      // Sayfa bilgilerini hesapla
      const totalPages = Math.min(Math.ceil(allActivities.length / this.ACTIVITIES_PER_PAGE), this.MAX_PAGES);
      const hasNextPage = page < totalPages && page < this.MAX_PAGES;
      const hasPreviousPage = page > 1;

      return {
        activities: paginatedActivities,
        currentPage: page,
        totalPages,
        hasNextPage,
        hasPreviousPage
      };
    } catch (error) {
      console.error('Paginated activities fetch error:', error);
      
      // Hata durumunda mock aktiviteler döndür
      const mockActivities = this.getMockActivities();
      const startIndex = (page - 1) * this.ACTIVITIES_PER_PAGE;
      const endIndex = startIndex + this.ACTIVITIES_PER_PAGE;
      const paginatedMockActivities = mockActivities.slice(startIndex, endIndex);

      return {
        activities: paginatedMockActivities,
        currentPage: page,
        totalPages: Math.min(Math.ceil(mockActivities.length / this.ACTIVITIES_PER_PAGE), this.MAX_PAGES),
        hasNextPage: page < this.MAX_PAGES && paginatedMockActivities.length === this.ACTIVITIES_PER_PAGE,
        hasPreviousPage: page > 1
      };
    }
  }

  /**
   * Tüm aktiviteleri API'den çek ve sırala
   * Maksimum aktivite sayısını koruyarak en eski aktiviteleri sil
   */
  private async fetchAllActivities(): Promise<RecentActivity[]> {
    // Daha fazla veri çek ki sayfalama için yeterli veri olsun
    const [studentsResponse, coursesResponse, enrollmentsResponse] = await Promise.all([
      apiClient.get<any>('/students?limit=10&sortBy=createdAt&sortOrder=desc'),
      apiClient.get<any>('/courses?limit=10&sortBy=createdAt&sortOrder=desc'),
      apiClient.get<any>('/enrollments?limit=10&sortBy=createdAt&sortOrder=desc')
    ]);

    const activities: RecentActivity[] = [];

    // Son eklenen öğrenciler
    if (studentsResponse.data) {
      studentsResponse.data.forEach((student: Student) => {
        activities.push({
          id: `student_${student.id}`,
          type: 'student_created',
          description: `Yeni öğrenci eklendi: ${student.user.firstName ?? student.user.firstName} ${student.user.lastName ?? student.user.lastName}`,
          createdAt: student.createdAt,
          user: 'Admin'
        });
      });
    }

    // Son eklenen kurslar
    if (coursesResponse.data) {
      coursesResponse.data.forEach((course: Course) => {
        activities.push({
          id: `course_${course.id}`,
          type: 'course_created',
          description: `Yeni ders oluşturuldu: ${course.name}`,
          createdAt: course.createdAt,
          user: 'Admin'
        });
      });
    }

    // Son kayıtlar
    if (enrollmentsResponse.data) {
      enrollmentsResponse.data.forEach((enrollment: Enrollment) => {
        const studentFirstName = enrollment.student?.user?.firstName;
        const studentLastName = enrollment.student?.user?.lastName;
        const studentName = studentFirstName 
            ? `${studentFirstName} ${studentLastName ?? ''}`.trim()
            : 'Bilinmeyen Öğrenci';
          
        const courseName = enrollment.course?.name ?? 'Bilinmeyen Ders';
        
        activities.push({
          id: `enrollment_${enrollment.id}`,
          type: 'enrollment_created',
          description: `Öğrenci kaydı yapıldı: ${studentName} - ${courseName}`,
          createdAt: enrollment.createdAt,
          user: 'Admin'
        });
      });
    }    // Tarihe göre sırala ve maksimum sayıya sınırla
    const sortedActivities = [...activities]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Maksimum aktivite sayısını koruyarak en eski aktiviteleri sil
    return sortedActivities.slice(0, this.MAX_ACTIVITIES);
  }

  /**
   * Mock aktiviteler (fallback)
   * Test amaçlı daha fazla mock aktivite oluştur
   */
  private getMockActivities(): RecentActivity[] {
    const mockActivities: RecentActivity[] = [];
    const now = Date.now();

    // 20 tane mock aktivite oluştur (3 sayfadan fazla test için)
    for (let i = 0; i < 20; i++) {
      const types: RecentActivity['type'][] = ['student_created', 'course_created', 'enrollment_created', 'enrollment_deleted'];
      const randomType = types[i % types.length];
      
      let description = '';
      switch (randomType) {
        case 'student_created':
          description = `Yeni öğrenci eklendi: Test Öğrenci ${i + 1}`;
          break;
        case 'course_created':
          description = `Yeni ders oluşturuldu: Test Ders ${i + 1}`;
          break;
        case 'enrollment_created':
          description = `Öğrenci kaydı yapıldı: Test Öğrenci ${i + 1} - Test Ders ${i + 1}`;
          break;
        case 'enrollment_deleted':
          description = `Öğrenci kaydı silindi: Test Ders ${i + 1}`;
          break;
      }

      mockActivities.push({
        id: `mock_${i + 1}`,
        type: randomType,
        description,
        createdAt: new Date(now - i * 60 * 60 * 1000).toISOString(), // Her aktivite 1 saat önce
        user: 'Admin'
      });
    }

    // Maksimum aktivite sayısını koruyarak en eski aktiviteleri sil
    return mockActivities.slice(0, this.MAX_ACTIVITIES);
  }
}

export const dashboardService = new DashboardService();
