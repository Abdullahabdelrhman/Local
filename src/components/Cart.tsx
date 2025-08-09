import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap';
import { Trash, Plus, Dash } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

// تعريف أنواع البيانات
interface ProductBrand {
  name: string;
}

interface CartItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  imageCover?: string;
  brand?: ProductBrand;
  priceAfterDiscount?: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = () => {
      try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  const handleRemove = (id: string) => {
    setCartItems(cartItems.filter(item => item._id !== id));
  };

  const handleQuantityChange = (id: string, change: number) => {
    setUpdating(true);
    setCartItems(cartItems.map(item => {
      if (item._id === id) {
        const newQuantity = item.quantity + change;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    }));
    setTimeout(() => setUpdating(false), 300);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = totalPrice > 500 ? 0 : 50;
  const grandTotal = totalPrice + shippingFee;

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </Spinner>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container className="py-5">
        <Card className="border-0 shadow-sm text-center py-5">
          <Card.Body>
            <h4 className="text-muted mb-4">سلة التسوق فارغة</h4>
            <Button variant="primary" onClick={() => navigate('/products')} className="px-4">
              تصفح المنتجات
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold">سلة التسوق</h2>
      
      <Row className="g-4">
        {/* قائمة المنتجات */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <table className="table mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th style={{ width: '40%' }}>المنتج</th>
                      <th className="text-center">السعر</th>
                      <th className="text-center">الكمية</th>
                      <th className="text-center">المجموع</th>
                      <th style={{ width: '50px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => (
                      <tr key={item._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={item.imageCover || '/placeholder-product.jpg'} 
                              alt={item.title} 
                              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                              className="me-3"
                            />
                            <div>
                              <h6 className="mb-1">{item.title}</h6>
                              {item.brand && (
                                <small className="text-muted">العلامة: {item.brand.name}</small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="text-center align-middle">
                          <span className="fw-bold">{item.price.toFixed(2)} ج.م</span>
                          {item.priceAfterDiscount && (
                            <div>
                              <small className="text-muted text-decoration-line-through">
                                {item.priceAfterDiscount.toFixed(2)} ج.م
                              </small>
                            </div>
                          )}
                        </td>
                        <td className="text-center align-middle">
                          <div className="d-flex align-items-center justify-content-center">
                            <Button 
                              variant="outline-secondary" 
                              size="sm" 
                              className="px-2 py-1"
                              onClick={() => handleQuantityChange(item._id, -1)}
                              disabled={updating}
                            >
                              <Dash size={16} />
                            </Button>
                            <span className="mx-2 fw-bold" style={{ minWidth: '30px' }}>
                              {item.quantity}
                            </span>
                            <Button 
                              variant="outline-secondary" 
                              size="sm" 
                              className="px-2 py-1"
                              onClick={() => handleQuantityChange(item._id, 1)}
                              disabled={updating}
                            >
                              <Plus size={16} />
                            </Button>
                          </div>
                        </td>
                        <td className="text-center align-middle fw-bold">
                          {(item.price * item.quantity).toFixed(2)} ج.م
                        </td>
                        <td className="align-middle">
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            className="p-1"
                            onClick={() => handleRemove(item._id)}
                          >
                            <Trash size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* ملخص الطلب */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
            <Card.Body>
              <h5 className="mb-4">ملخص الطلب</h5>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>المجموع الفرعي:</span>
                  <span className="fw-bold">{totalPrice.toFixed(2)} ج.م</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>تكلفة الشحن:</span>
                  <span className="fw-bold">
                    {shippingFee === 0 ? (
                      <Badge bg="success" className="py-1">شحن مجاني</Badge>
                    ) : (
                      `${shippingFee.toFixed(2)} ج.م`
                    )}
                  </span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>الإجمالي:</span>
                  <span>{grandTotal.toFixed(2)} ج.م</span>
                </div>
              </div>

              <Button 
                variant="primary" 
                size="lg" 
                className="w-100 mb-3"
                onClick={() => navigate('/checkout')}
              >
                إتمام الشراء
              </Button>
              
              <Button 
                variant="outline-primary" 
                size="lg" 
                className="w-100"
                onClick={() => navigate('/products')}
              >
                متابعة التسوق
              </Button>
              
              <div className="mt-4 pt-3 border-top">
                <h6 className="mb-3">طرق الدفع المتاحة</h6>
                <div className="d-flex flex-wrap gap-2">
                  <img src="/payment-methods/visa.png" alt="Visa" style={{ height: '24px' }} />
                  <img src="/payment-methods/mastercard.png" alt="Mastercard" style={{ height: '24px' }} />
                  <img src="/payment-methods/mada.png" alt="Mada" style={{ height: '24px' }} />
                  <img src="/payment-methods/apple-pay.png" alt="Apple Pay" style={{ height: '24px' }} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;