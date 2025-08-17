import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Container, Card, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useState } from 'react';

const API_URL = 'https://ecommerce.routemisr.com/api/v1/auth/signin';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('بريد إلكتروني غير صالح').required('البريد الإلكتروني مطلوب'),
    password: Yup.string().min(6, 'كلمة المرور يجب أن تكون على الأقل 6 أحرف').required('كلمة المرور مطلوبة'),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post(API_URL, values);

      if (!data.token) {
        throw new Error('لم يتم استلام token');
      }

      localStorage.setItem('token', data.token);
      window.dispatchEvent(new Event('authChanged'));
      navigate('/Home');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'حدث خطأ أثناء تسجيل الدخول';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }} className="p-4 shadow-sm">
        <h3 className="text-center mb-4">تسجيل الدخول</h3>

        {error && <Alert variant="danger" className="text-center">{error}</Alert>}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, values, touched, errors }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>البريد الإلكتروني</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="أدخل البريد الإلكتروني"
                  value={values.email}
                  onChange={handleChange}
                  isInvalid={touched.email && !!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>كلمة المرور</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="أدخل كلمة المرور"
                  value={values.password}
                  onChange={handleChange}
                  isInvalid={touched.password && !!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Button variant="primary" type="submit" disabled={loading} className="w-100">
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    جاري الدخول...
                  </>
                ) : 'تسجيل الدخول'}
              </Button>
            </Form>
          )}
        </Formik>

        <div className="text-center mt-3">
          <span>ليس لديك حساب؟ </span>
          <Link to="/Register">إنشاء حساب</Link>
        </div>
      </Card>
    </Container>
  );
};

export default Login;
