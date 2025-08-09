import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ✅ استيراد Link
import { Form, Button, Alert, Container, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'https://ecommerce.routemisr.com/api/v1/auth/signin';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post(API_URL, { email, password });

      if (!data.token) {
        throw new Error('لم يتم استلام token');
      }

      localStorage.setItem('token', data.token);
      window.dispatchEvent(new Event('authChanged'));
      navigate('/Home');

    } catch (err: any) {
      const errorMessage = err.response?.data?.message ||
        err.message ||
        'حدث خطأ أثناء تسجيل الدخول';
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

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>البريد الإلكتروني</Form.Label>
            <Form.Control
              type="email"
              placeholder="أدخل البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>كلمة المرور</Form.Label>
            <Form.Control
              type="password"
              placeholder="أدخل كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="w-100"
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                جاري الدخول...
              </>
            ) : 'تسجيل الدخول'}
          </Button>
        </Form>

        {/* ✅ زر الانتقال إلى صفحة التسجيل */}
        <div className="text-center mt-3">
          <span>ليس لديك حساب؟ </span>
          <Link to="/Register">إنشاء حساب</Link>
        </div>
      </Card>
    </Container>
  );
};

export default Login;
