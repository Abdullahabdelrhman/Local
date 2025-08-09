import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BsCartPlus, BsStarFill, BsStarHalf, BsArrowLeft } from 'react-icons/bs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  priceAfterDiscount?: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  images: string[];
  brand?: { name: string };
  category?: { name: string };
  sizes?: string[];
  colors?: string[];
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
      const json = await res.json();
      setProduct(json.data);
    } catch (err) {
      console.error('Error fetching product:', err);
      toast.error('حدث خطأ أثناء جلب بيانات المنتج');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const addToCart = () => {
    setAdding(true);
    try {
      const storedCart = localStorage.getItem('cart');
      let cart = storedCart ? JSON.parse(storedCart) : [];
      const existingIndex = cart.findIndex((item: Product) => item._id === product?._id);

      if (existingIndex !== -1) {
        cart[existingIndex].quantity += quantity;
      } else if (product) {
        cart.push({ ...product, quantity });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      toast.success(`تم إضافة ${quantity} من المنتج إلى السلة`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('حدث خطأ أثناء إضافة المنتج للسلة');
    } finally {
      setAdding(false);
    }
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<BsStarFill key={`full-${i}`} className="text-warning" />);
    }
    
    if (hasHalfStar) {
      stars.push(<BsStarHalf key="half" className="text-warning" />);
    }
    
    return stars;
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">جار التحميل...</span>
      </div>
    </div>
  );

  if (!product) return (
    <div className="alert alert-danger text-center my-5">
      تعذر تحميل المنتج. يرجى المحاولة مرة أخرى.
    </div>
  );

 return (
    <div className="container py-5">
      <button 
        className="btn btn-outline-secondary mb-4"
        onClick={() => window.history.back()}
      >
        <BsArrowLeft /> العودة
      </button>

      <div className="row g-4">
        {/* صور المنتج */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-3">
              <img 
                src={product.images[selectedImage]} 
                alt={product.title} 
                className="img-fluid rounded-3 mb-3"
                style={{ maxHeight: '400px', objectFit: 'contain' }}
              />
              
              <div className="d-flex flex-wrap gap-2">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.title} ${index + 1}`}
                    className={`img-thumbnail cursor-pointer ${selectedImage === index ? 'border-primary' : ''}`}
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* تفاصيل المنتج */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h2 className="fw-bold mb-3">{product.title}</h2>
              
              <div className="d-flex align-items-center mb-3">
                {renderRatingStars(product.ratingsAverage)}
                <span className="ms-2 text-muted">({product.ratingsQuantity} تقييم)</span>
              </div>
              
              <div className="d-flex align-items-center mb-4">
                <h4 className="text-success fw-bold mb-0">
                  {product.price.toLocaleString()} ج.م
                </h4>
                {product.priceAfterDiscount && (
                  <del className="text-muted ms-2">
                    {product.priceAfterDiscount.toLocaleString()} ج.م
                  </del>
                )}
              </div>
              
              <p className="text-muted mb-4">{product.description}</p>
              
              <div className="mb-4">
                <h5 className="fw-bold">المواصفات:</h5>
                <ul className="list-unstyled">
                  <li><strong>العلامة التجارية:</strong> {product.brand?.name || 'غير محدد'}</li>
                  <li><strong>الفئة:</strong> {product.category?.name || 'غير محدد'}</li>
                  <li><strong>المقاسات المتاحة:</strong> {product.sizes?.join(', ') || 'غير محدد'}</li>
                  <li><strong>الألوان المتاحة:</strong> {product.colors?.join(', ') || 'غير محدد'}</li>
                </ul>
              </div>
              
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="input-group" style={{ width: '120px' }}>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    className="form-control text-center"
                    value={quantity}
                    min="1"
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setQuantity(prev => prev + 1)}
                  >
                    +
                  </button>
                </div>
                
                <button
                  className="btn btn-primary flex-grow-1 py-2"
                  onClick={addToCart}
                  disabled={adding}
                >
                  {adding ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      جاري الإضافة...
                    </>
                  ) : (
                    <>
                      <BsCartPlus className="me-2" />
                      أضف إلى السلة
                    </>
                  )}
                </button>
              </div>
              
              <div className="alert alert-info mb-0">
                <strong>ملاحظة:</strong> الشحن متاح لجميع المحافظات خلال 2-5 أيام عمل
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* قسم التقييمات (يمكن إضافته لاحقًا) */}
    </div>
  );

}
  