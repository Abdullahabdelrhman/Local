import { useState, useEffect } from "react";
import { useLocation, Link } from 'react-router-dom';

interface Product {
  _id: string;
  title: string;
  price: number;
  imageCover: string;
}

function Products() {
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get('category');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://ecommerce.routemisr.com/api/v1/products${categoryId ? `?category=${categoryId}` : ''}`
        );
        const json = await res.json();
        setProducts(json.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  if (loading) return <div className="text-center py-5">جارٍ تحميل المنتجات...</div>;

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">المنتجات</h2>
      <div className="row g-4">
        {products.map(product => (
          <div className="col-md-4" key={product._id}>
            <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
              <div className="card h-100 shadow">
                <img
                  src={product.imageCover}
                  alt={product.title}
                  className="card-img-top"
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.price} ج.م</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
