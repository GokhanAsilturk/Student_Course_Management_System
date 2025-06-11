import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Alert,
  Skeleton,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  People,
  School,
  Assignment,
  TrendingUp,
  PersonAdd,
  SchoolOutlined,
  AssignmentTurnedIn,
  Refresh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DashboardStats, RecentActivity } from '../../types';
import { dashboardService } from '../../services';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <Card 
    elevation={0}
    sx={{ 
      height: '100%',
      background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
      borderRadius: 3,
      border: `1px solid ${color}30`,
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 8px 25px ${color}20`,
      }
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: color }}>
            {value}
          </Typography>
        </Box>
        <Avatar sx={{ 
          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          width: 56, 
          height: 56,
          boxShadow: `0 4px 20px ${color}40`,
        }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const getActivityIcon = (type: RecentActivity['type']) => {
  switch (type) {
    case 'student_created':
      return <PersonAdd />;
    case 'course_created':
      return <SchoolOutlined />;
    case 'enrollment_created':
      return <AssignmentTurnedIn />;
    case 'enrollment_deleted':
      return <Assignment />;
    default:
      return <TrendingUp />;
  }
};

const getActivityColor = (type: RecentActivity['type']) => {
  switch (type) {
    case 'student_created':
      return 'success';
    case 'course_created':
      return 'primary';
    case 'enrollment_created':
      return 'info';
    case 'enrollment_deleted':
      return 'warning';
    default:
      return 'default';
  }
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours === 0) {
    return 'Az önce';
  } else if (diffInHours === 1) {
    return '1 saat önce';
  } else if (diffInHours < 24) {
    return `${diffInHours} saat önce`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} gün önce`;  }
};

// Loading skeleton komponenti
const StatCardSkeleton = () => (
  <Card elevation={0} sx={{ height: '100%', borderRadius: 3 }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="text" width={60} height={40} />
        </Box>
        <Skeleton variant="circular" width={56} height={56} />
      </Box>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    activeCourses: 0,
  });  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API'den verileri çekme fonksiyonu
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Dashboard verilerini paralel olarak çek
      const [statsData, activitiesData] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getRecentActivities()
      ]);

      setStats(statsData);
      setRecentActivities(activitiesData);
    } catch (err) {
      console.error('Dashboard veri yükleme hatası:', err);
      setError('Dashboard verileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // İlk yükleme
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Manuel yenileme fonksiyonu
  const handleRefresh = async () => {
    await fetchDashboardData();
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-student':
        navigate('/students/add');
        break;
      case 'add-course':
        navigate('/courses/add');
        break;
      case 'add-enrollment':
        navigate('/enrollments/add');
        break;
      default:
        break;    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Tooltip title="Verileri Yenile">
          <IconButton 
            onClick={handleRefresh} 
            disabled={loading}
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              '&:disabled': {
                bgcolor: 'action.disabled',
                color: 'action.disabled',
              }
            }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Hata mesajı */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* İstatistik Kartları */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <StatCardSkeleton />
          ) : (
            <StatCard
              title="Toplam Öğrenci"
              value={stats.totalStudents}
              icon={<People />}
              color="#2196f3"
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <StatCardSkeleton />
          ) : (
            <StatCard
              title="Toplam Ders"
              value={stats.totalCourses}
              icon={<School />}
              color="#4caf50"
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <StatCardSkeleton />
          ) : (
            <StatCard
              title="Toplam Kayıt"
              value={stats.totalEnrollments}
              icon={<Assignment />}
              color="#ff9800"
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <StatCardSkeleton />
          ) : (
            <StatCard
              title="Aktif Ders"
              value={stats.activeCourses}
              icon={<TrendingUp />}
              color="#9c27b0"
            />
          )}
        </Grid>
      </Grid>      <Grid container spacing={3}>
        {/* Son Aktiviteler */}        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Son Aktiviteler
              </Typography>
              <Tooltip title="Aktiviteleri Yenile">
                <IconButton 
                  onClick={handleRefresh} 
                  disabled={loading}
                  size="small"
                  sx={{ 
                    color: 'primary.main',
                    '&:disabled': {
                      color: 'action.disabled',
                    }
                  }}
                >
                  <Refresh fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>            {loading ? (
              <List>
                {[...Array(5)].map((_, index) => (
                  <ListItem key={`skeleton-${index}`} divider={index < 4}>
                    <ListItemAvatar>
                      <Skeleton variant="circular" width={40} height={40} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Skeleton variant="text" width="60%" />}
                      secondary={<Skeleton variant="text" width="40%" />}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <List>
                {recentActivities.map((activity, index) => (
                  <ListItem key={activity.id} divider={index < recentActivities.length - 1}>
                    <ListItemAvatar>
                      <Avatar sx={{ backgroundColor: `${getActivityColor(activity.type)}.main` }}>
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.description}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Typography variant="caption" color="textSecondary">
                            {formatRelativeTime(activity.createdAt)}
                          </Typography>
                          {activity.user && (
                            <Chip 
                              label={activity.user} 
                              size="small" 
                              variant="outlined" 
                              sx={{ height: 20 }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
                {recentActivities.length === 0 && !loading && (
                  <ListItem>
                    <ListItemText 
                      primary="Henüz aktivite bulunmuyor" 
                      secondary="Sistem kullanımı başladığında aktiviteler burada görünecek"
                    />
                  </ListItem>
                )}
              </List>
            )}
          </Paper>
        </Grid>        {/* Hızlı İşlemler */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Hızlı İşlemler
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Card 
                variant="outlined" 
                sx={{ 
                  cursor: 'pointer', 
                  '&:hover': { backgroundColor: 'action.hover' },
                  transition: 'background-color 0.2s ease-in-out'
                }}
                onClick={() => handleQuickAction('add-student')}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PersonAdd color="primary" />
                  <Typography variant="body1">Yeni Öğrenci Ekle</Typography>
                </CardContent>
              </Card>
              
              <Card 
                variant="outlined" 
                sx={{ 
                  cursor: 'pointer', 
                  '&:hover': { backgroundColor: 'action.hover' },
                  transition: 'background-color 0.2s ease-in-out'
                }}
                onClick={() => handleQuickAction('add-course')}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SchoolOutlined color="primary" />
                  <Typography variant="body1">Yeni Ders Ekle</Typography>
                </CardContent>
              </Card>
              
              <Card 
                variant="outlined" 
                sx={{ 
                  cursor: 'pointer', 
                  '&:hover': { backgroundColor: 'action.hover' },
                  transition: 'background-color 0.2s ease-in-out'
                }}
                onClick={() => handleQuickAction('add-enrollment')}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AssignmentTurnedIn color="primary" />
                  <Typography variant="body1">Yeni Kayıt Oluştur</Typography>
                </CardContent>
              </Card>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
