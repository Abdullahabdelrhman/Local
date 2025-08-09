import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// تعريف الأنواع
interface Category {
  _id: string;
  name: string;
  image: string;
}

interface Product {
  _id: string;
  title: string;
  imageCover: string;
  price: number;
}

function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch('https://ecommerce.routemisr.com/api/v1/categories'),
          fetch('https://ecommerce.routemisr.com/api/v1/products'),
        ]);

        if (!catRes.ok || !prodRes.ok) {
          throw new Error('فشل في تحميل البيانات');
        }

        const categoriesData = await catRes.json();
        const productsData = await prodRes.json();

        setCategories(categoriesData.data);
        setProducts(productsData.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جارِ التحميل...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-5">
        <h4>{error}</h4>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">مرحباً بك في متجرنا</h2>

      {/* مربع البحث */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="ابحث عن منتج..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* الفئات */}
      <h4 className="mb-3">الفئات</h4>
      <div className="row g-4 mb-5">
        {categories.map((category) => (
          <div key={category._id} className="col-md-3">
            <Link to={`/products?category=${category._id}`} className="text-decoration-none">
              <div className="card text-center h-100">
                <img
                  src={category.image}
                  alt={category.name}
                  className="card-img-top"
                  style={{ height: '150px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h6 className="card-title">{category.name}</h6>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* المنتجات */}
      <h4 className="mb-3">المنتجات</h4>
      <div className="row g-4">
        {filteredProducts.length === 0 ? (
          <p className="text-muted">لا توجد منتجات مطابقة لبحثك.</p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product._id} className="col-md-3">
              <Link to={`/products/${product._id}`} className="text-decoration-none">
                <div className="card h-100">
                  <img
                    src={product.imageCover}
                    alt={product.title}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h6 className="card-title">{product.title}</h6>
                    <p className="card-text text-muted small">
                      السعر: {product.price} ج.م
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;