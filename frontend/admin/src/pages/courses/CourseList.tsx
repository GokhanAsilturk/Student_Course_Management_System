import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Course } from '../../types';
import { courseService } from '../../services';
import { DataTable, DataTableColumn } from '../../components/common';
import { useNotification } from '../../hooks';
import { useConfirmDialog } from '../../contexts/ConfirmDialogContext';
import { formatDate, getErrorMessage } from '../../utils';

const ActionsCell: React.FC<{
  course: Course;
  onView: (course: Course) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ course, onView, onEdit, onDelete }) => (
  <Box sx={{ display: 'flex', gap: 0.5 }}>
    <Tooltip title="Görüntüle">
      <IconButton size="small" onClick={() => onView(course)}>
        <ViewIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title="Düzenle">
      <IconButton size="small" onClick={() => onEdit(course.id)}>
        <EditIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title="Sil">
      <IconButton
        size="small"
        onClick={() => onDelete(course.id)}
        color="error"
      >
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  </Box>
);

const CourseList: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const { showError, showSuccess } = useNotification();
  const { confirmDelete } = useConfirmDialog();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getCourses({
        search: searchTerm,
      }, {
        page: page + 1,
        limit: rowsPerPage,
      });
      setCourses(response.data ?? []);
      setTotalCount(response.pagination.total ?? 0);
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, rowsPerPage, searchTerm]);

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(0);
  };
  const handleDelete = async (courseId: string) => {
    console.log('handleDelete çağrıldı, courseId:', courseId);
    confirmDelete(
      'Ders', 
      async () => {
        console.log('confirmDelete callback çağrıldı');
        try {
          console.log('courseService.deleteCourse çağrılıyor, courseId:', courseId);
          await courseService.deleteCourse(courseId);
          console.log('Silme işlemi başarılı');
          showSuccess('Ders başarıyla silindi');
          fetchCourses();
        } catch (error) {
          console.error('Silme işlemi hatası:', error);
          showError(getErrorMessage(error));
        }
      }
    );
  };
  const handleViewDetail = (course: Course) => {
    setSelectedCourse(course);
    setDetailDialogOpen(true);
  };
  
  const renderActions = (row: Course) => (
    <ActionsCell
      course={row}
      onView={handleViewDetail}
      onEdit={(id) => navigate(`/courses/edit/${id}`)}
      onDelete={handleDelete}
    />
  );
  const columns: DataTableColumn<Course>[] = [
    {
      id: 'name',
      label: 'Ders Adı',
      minWidth: 250,
    },
    {
      id: 'description',
      label: 'Açıklama',
      minWidth: 300,
      format: (value: string) => value ?? 'Açıklama yok',
    },
    {
      id: 'createdAt',
      label: 'Oluşturulma Tarihi',
      minWidth: 150,
      format: (value: string) => formatDate(value),
    },
    {
      id: 'actions',
      label: 'İşlemler',
      minWidth: 150,
      align: 'center',
      format: (_, row: Course) => renderActions(row),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Ders Listesi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/courses/add')}
        >
          Yeni Ders
        </Button>
      </Box>

      <DataTable
        columns={columns}
        rows={courses}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSearch={handleSearch}
        onRefresh={fetchCourses}        searchPlaceholder="Ders ara (ders adı, açıklama)..."
        searchValue={searchTerm}
      />

      {/* Course Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Ders Detayları</DialogTitle>        <DialogContent>
          {selectedCourse && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Typography><strong>Ders Adı:</strong> {selectedCourse.name}</Typography>
              <Typography><strong>Açıklama:</strong> {selectedCourse.description ?? 'Açıklama yok'}</Typography>
              <Typography><strong>Oluşturulma Tarihi:</strong> {formatDate(selectedCourse.createdAt)}</Typography>
              <Typography><strong>Güncellenme Tarihi:</strong> {formatDate(selectedCourse.updatedAt)}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Kapat</Button>
          {selectedCourse && (
            <Button
              variant="contained"
              onClick={() => {
                setDetailDialogOpen(false);
                navigate(`/courses/edit/${selectedCourse.id}`);
              }}
            >
              Düzenle
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseList;
