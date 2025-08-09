import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Spinner, 
  Alert, 
  Modal, // أضفنا استيراد Modal هنا
  ListGroup,
  Badge
} from 'react-bootstrap';
import { 
  CheckCircle, 
  ArrowLeft,
  GeoAlt,
  CreditCard
  // تم إزالة Cash لأنه غير مستخدم
} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


// تعريف أنواع TypeScript
interface Product {
  _id: string;
  title: string;
  price: number;
  imageCover: string;
  priceAfterDiscount?: number;
}

interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  color?: string;
  size?: string;
}

const API_URL = 'https://ecommerce.routemisr.com/api/v1';



const CheckoutPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    shippingAddress: {
      details: '',
      city: '',
      phone: ''
    },
    paymentMethod: 'card'
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');
  const navigate = useNavigate();

  // جلب محتويات السلة من API
const fetchCart = async () => {
  try {
    setLoading(true);
    setError('');
    
    // 1. التحقق من وجود token
    const token = localStorage.getItem('token');
    if (!token) {
      setError('يجب تسجيل الدخول أولاً');
      setCartItems([]);
      return;
    }

    // 2. جلب بيانات السلة من API
    const { data } = await axios.get(`${API_URL}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}` // استخدام Bearer Token
      },
      timeout: 5000 // وقت انتظار 5 ثواني
    });

    // 3. التحقق من بنية البيانات المستلمة
    if (!data.data?.cartItems) {
      throw new Error('بنية البيانات غير متوقعة');
    }

    // 4. تحديث حالة السلة
    setCartItems(data.data.cartItems);
    
  } catch (err) {
    // معالجة أنواع الأخطاء المختلفة
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401) {
        setError('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
        localStorage.removeItem('token'); // حذف token غير صالح
      } else if (err.response?.status === 404) {
        setError('لم يتم العثور على سلة التسوق');
      } else {
        setError('حدث خطأ في الخادم');
      }
    } else if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('حدث خطأ غير متوقع');
    }
    
    setCartItems([]);
    console.error('Fetch cart error:', err);
    
  } finally {
    setLoading(false);
  }
};
  

  useEffect(() => {
    fetchCart();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name in formData.shippingAddress) {
      setFormData({
        ...formData,
        shippingAddress: {
          ...formData.shippingAddress,
          [name]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const calculateTotals = () => {
    if (!cartItems || cartItems.length === 0) {
      return { totalPrice: 0, shippingFee: 0, grandTotal: 0 };
    }
    
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + (item.product.price * item.quantity), 
      0
    );
    const shippingFee = totalPrice > 1000 ? 0 : 50;
    const grandTotal = totalPrice + shippingFee;
    
    return { totalPrice, shippingFee, grandTotal };
  };

  const { totalPrice, shippingFee, grandTotal } = calculateTotals();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.shippingAddress.details || !formData.shippingAddress.city || !formData.shippingAddress.phone) {
      setError('الرجاء ملء جميع حقول العنوان');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const { data } = await axios.post(`${API_URL}/orders/checkout-session`, {
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        cartItems: cartItems.map(item => item._id)
      }, {
        headers: {
          token: localStorage.getItem('token') || '',
          'Content-Type': 'application/json'
        },
        params: {
          url: window.location.origin
        }
      });

      if (formData.paymentMethod === 'card') {
        window.location.href = data.session.url;
      } else {
        setOrderId(data.data.order._id);
        setOrderSuccess(true);
        await axios.delete(`${API_URL}/cart`, {
          headers: {
            token: localStorage.getItem('token') || ''
          }
        });
      }
    } catch (err) {
      setError('حدث خطأ أثناء إتمام الطلب. يرجى المحاولة مرة أخرى.');
      console.error('Checkout error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </Spinner>
      </Container>
    );
  }

  if ((!cartItems || cartItems.length === 0) && !orderSuccess) {
   
  }

  return (
    <Container className="py-5">
      <Button 
        variant="outline-secondary" 
        onClick={() => navigate(-1)} 
        className="mb-4"
      >
        <ArrowLeft className="me-2" /> العودة
      </Button>

      <h2 className="mb-4 fw-bold">إتمام الشراء</h2>
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      
      <Row>
        <Col lg={8}>
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-4">
                <GeoAlt className="me-2" />
                عنوان الشحن
              </h5>
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>العنوان التفصيلي</Form.Label>
                  <Form.Control
                    name="details"
                    value={formData.shippingAddress.details}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>المدينة</Form.Label>
                      <Form.Control
                        name="city"
                        value={formData.shippingAddress.city}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>رقم الهاتف</Form.Label>
                      <Form.Control
                        name="phone"
                        type="tel"
                        value={formData.shippingAddress.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <h5 className="mt-4 mb-3">
                  <CreditCard className="me-2" />
                  طريقة الدفع
                </h5>
                
                <Form.Check
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  label="الدفع بالبطاقة الائتمانية"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleInputChange}
                  className="mb-2"
                />
                
                <Form.Check
                  type="radio"
                  id="cash"
                  name="paymentMethod"
                  label="الدفع عند الاستلام"
                  value="cash"
                  checked={formData.paymentMethod === 'cash'}
                  onChange={handleInputChange}
                />
                
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="mt-4 w-100"
                  disabled={isSubmitting || cartItems.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      جاري المعالجة...
                    </>
                  ) : (
                    'إتمام الطلب'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
            <Card.Body>
              <h5 className="mb-4">ملخص الطلب</h5>
              
              <ListGroup variant="flush">
                {cartItems.map(item => (
                  <ListGroup.Item key={item._id} className="d-flex border-0 px-0">
                    <img
                      src={item.product.imageCover}
                      alt={item.product.title}
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      className="me-3 rounded"
                    />
                    <div>
                      <h6 className="mb-1">{item.product.title}</h6>
                      <div className="d-flex text-muted small">
                        {item.color && <span className="me-2">اللون: {item.color}</span>}
                        {item.size && <span>المقاس: {item.size}</span>}
                      </div>
                      <div>
                        {item.quantity} × {item.product.price} ج.م
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              
              <div className="mt-3 pt-3 border-top">
                <div className="d-flex justify-content-between mb-2">
                  <span>المجموع الفرعي:</span>
                  <span className="fw-bold">{totalPrice.toFixed(2)} ج.م</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>تكلفة الشحن:</span>
                  <span className="fw-bold">
                    {shippingFee === 0 ? (
                      <Badge bg="success">شحن مجاني</Badge>
                    ) : (
                      `${shippingFee.toFixed(2)} ج.م`
                    )}
                  </span>
                </div>
                <div className="d-flex justify-content-between fw-bold fs-5 mt-3 pt-2 border-top">
                  <span>الإجمالي:</span>
                  <span>{grandTotal.toFixed(2)} ج.م</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Modal show={orderSuccess} onHide={() => navigate('/')} centered>
        <Modal.Body className="text-center p-5">
          <CheckCircle className="text-success mb-3" style={{ fontSize: '5rem' }} />
          <h3 className="mb-3">تمت عملية الشراء بنجاح!</h3>
          <p className="text-muted mb-4">
            رقم طلبك: <strong>{orderId}</strong>
          </p>
          <Button variant="primary" onClick={() => navigate('/')}>
            العودة للصفحة الرئيسية
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CheckoutPage;