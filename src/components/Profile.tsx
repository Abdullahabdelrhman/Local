import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('📦 التوكن من localStorage:', token);

    if (!token) {
      console.log('🚩 لا يوجد توكن، إعادة التوجيه لصفحة تسجيل الدخول');
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/users/getMe', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('✅ بيانات المستخدم:', data);
        setUser(data);
      } catch (error: any) {
        console.error('📛 خطأ عند جلب بيانات المستخدم:', error.response?.data || error.message);

        // إزالة التوكن لأنه قد يكون غير صالح أو منتهي
        localStorage.removeItem('token');

        // إعادة التوجيه لصفحة تسجيل الدخول
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" role="status" />
        <span className="visually-hidden">جاري التحميل...</span>
      </div>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <Card>
            <Card.Img variant="top" src="https://via.placeholder.com/150" />
            <Card.Body>
              <Card.Title>{user?.name || 'اسم المستخدم'}</Card.Title>
              <Card.Text>{user?.email || 'email@example.com'}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <h3>معلومات الحساب</h3>
          <p><strong>الاسم:</strong> {user?.name}</p>
          <p><strong>البريد الإلكتروني:</strong> {user?.email}</p>
          <p><strong>رقم الهاتف:</strong> {user?.phone}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
