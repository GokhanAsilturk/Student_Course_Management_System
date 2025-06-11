import { apiClient } from './api';
import { 
  DashboardStats, 
  RecentActivity,
  ApiResponse 
} from '../types';

class DashboardService {
  /**
   * Dashboard istatistiklerini getir
   * Mevcut endpoint'lerden toplam verileri hesaplar
   */  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Paralel olarak tüm verileri çek
      const [studentsResponse, coursesResponse, enrollmentsResponse] = await Promise.all([
        apiClient.get<any>('/students?limit=1'),
        apiClient.get<any>('/courses?limit=1'),
        apiClient.get<any>('/enrollments?limit=1')
      ]);

      // Backend'den dönen sayfalama bilgilerinden toplam sayıları al
      const totalStudents = studentsResponse.pagination?.total || 0;
      const totalCourses = coursesResponse.pagination?.total || 0;
      const totalEnrollments = enrollmentsResponse.pagination?.total || 0;

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
   * Son aktiviteleri getir
   * Şimdilik mock data döndürür, gelecekte gerçek API'den çekilecek
   */  async getRecentActivities(): Promise<RecentActivity[]> {
    try {
      // Son eklenen öğrencileri ve kursları çek
      const [studentsResponse, coursesResponse, enrollmentsResponse] = await Promise.all([
        apiClient.get<any>('/students?limit=5&sortBy=createdAt&sortOrder=desc'),
        apiClient.get<any>('/courses?limit=5&sortBy=createdAt&sortOrder=desc'),
        apiClient.get<any>('/enrollments?limit=5&sortBy=createdAt&sortOrder=desc')
      ]);

      const activities: RecentActivity[] = [];

      // Son eklenen öğrenciler
      if (studentsResponse.data) {
        studentsResponse.data.forEach((student: any, index: number) => {
          activities.push({
            id: `student_${student.id}`,
            type: 'student_created',
            description: `Yeni öğrenci eklendi: ${student.user?.firstName || student.firstName} ${student.user?.lastName || student.lastName}`,
            createdAt: student.createdAt,
            user: 'Admin'
          });
        });
      }

      // Son eklenen kurslar
      if (coursesResponse.data) {
        coursesResponse.data.forEach((course: any, index: number) => {
          activities.push({
            id: `course_${course.id}`,
            type: 'course_created',
            description: `Yeni ders oluşturuldu: ${course.title}`,
            createdAt: course.createdAt,
            user: 'Admin'
          });
        });
      }

      // Son kayıtlar
      if (enrollmentsResponse.data) {
        enrollmentsResponse.data.forEach((enrollment: any, index: number) => {
          const studentName = enrollment.student?.user?.firstName 
            ? `${enrollment.student.user.firstName} ${enrollment.student.user.lastName}`
            : enrollment.student?.firstName 
            ? `${enrollment.student.firstName} ${enrollment.student.lastName}`
            : 'Bilinmeyen Öğrenci';
          
          const courseName = enrollment.course?.title || 'Bilinmeyen Ders';
          
          activities.push({
            id: `enrollment_${enrollment.id}`,
            type: 'enrollment_created',
            description: `Öğrenci kaydı yapıldı: ${studentName} - ${courseName}`,
            createdAt: enrollment.createdAt,
            user: 'Admin'
          });
        });
      }

      // Tarihe göre sırala ve sadece son 10 aktiviteyi döndür
      return activities
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);

    } catch (error) {
      console.error('Recent activities fetch error:', error);
      // Hata durumunda mock aktiviteler döndür
      return this.getMockActivities();
    }
  }

  /**
   * Mock aktiviteler (fallback)
   */
  private getMockActivities(): RecentActivity[] {
    return [
      {
        id: '1',
        type: 'student_created',
        description: 'Yeni öğrenci eklendi: Ahmet Yılmaz',
        createdAt: new Date().toISOString(),
        user: 'Admin',
      },
      {
        id: '2',
        type: 'course_created',
        description: 'Yeni ders oluşturuldu: React Programlama',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        user: 'Admin',
      },
      {
        id: '3',
        type: 'enrollment_created',
        description: 'Öğrenci kaydı yapıldı: Matematik 101',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        user: 'Admin',
      },
      {
        id: '4',
        type: 'student_created',
        description: 'Yeni öğrenci eklendi: Fatma Demir',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        user: 'Admin',
      },
      {
        id: '5',
        type: 'enrollment_deleted',
        description: 'Öğrenci kaydı silindi: Fizik 201',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        user: 'Admin',
      },
    ];
  }
}

export const dashboardService = new DashboardService();
