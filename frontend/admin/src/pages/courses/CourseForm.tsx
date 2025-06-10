import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CreateCourseRequest, UpdateCourseRequest } from '../../types';
import { courseService } from '../../services';
import { useNotification } from '../../hooks';
import { getErrorMessage } from '../../utils';

const CourseForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { showError, showSuccess } = useNotification();

  const getSubmitButtonText = () => {
    return isEdit ? 'Güncelle' : 'Kaydet';
  };
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Ders adı zorunludur')
      .min(2, 'Ders adı en az 2 karakter olmalıdır'),
    description: Yup.string()
      .max(500, 'Açıklama en fazla 500 karakter olabilir'),
  });
  const formik = useFormik<CreateCourseRequest>({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setSubmitError(null);
          if (isEdit && id) {
          const updateData: UpdateCourseRequest = {
            name: values.name,
            description: values.description,
          };
          await courseService.updateCourse(id, updateData);
          showSuccess('Ders başarıyla güncellendi');
          
          setTimeout(() => {
            navigate('/courses');
          }, 1500);
        } else {
          const createData: CreateCourseRequest = {
            name: values.name,
            description: values.description,
          };
          
          await courseService.createCourse(createData);
          showSuccess('Ders başarıyla oluşturuldu');
          
          setTimeout(() => {
            navigate('/courses');
          }, 1500);
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setSubmitError(errorMessage);
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  const fetchCourse = async () => {
    if (!id) return;
    
    try {
      setInitialLoading(true);
      const course = (await courseService.getCourse(id)).data;
        formik.setValues({
        name: course.name,
        description: course.description ?? '',
      });
    } catch (error) {
      showError(getErrorMessage(error));
      navigate('/courses');
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (isEdit) {
      fetchCourse();
    }
  }, [isEdit, id]);

  if (initialLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Yükleniyor...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Ders Düzenle' : 'Yeni Ders'}
      </Typography>

      <Paper sx={{ p: 3, mt: 3, maxWidth: 800, mx: 'auto' }}>
        <form onSubmit={formik.handleSubmit}>
          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {submitError}
            </Alert>
          )}          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={8} lg={6}>
              <TextField
                fullWidth
                label="Ders Adı"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                required
              />
            </Grid>

            <Grid item xs={12} md={8} lg={6}>
              <TextField
                fullWidth
                label="Açıklama"
                name="description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/courses')}
                  disabled={loading}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !formik.isValid}
                >
                  {loading ? 'Kaydediliyor...' : getSubmitButtonText()}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CourseForm;
