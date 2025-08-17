import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { BsCartPlus } from "react-icons/bs";

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

  // تخزين حالة الإضافة لكل منتج
  const [addingToCart, setAddingToCart] = useState<{ [key: string]: boolean }>({});

  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("category");

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
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const addToCart = async (productId: string) => {
    try {
      setAddingToCart((prev) => ({ ...prev, [productId]: true }));
      // هنا تضيف منطق الإضافة الحقيقي
      await new Promise((resolve) => setTimeout(resolve, 1000)); // محاكاة تأخير

      console.log(`تمت إضافة المنتج ${productId} إلى السلة`);
    } catch (err) {
      console.error("خطأ أثناء الإضافة إلى السلة:", err);
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  if (loading) return <div className="text-center py-5">جارٍ تحميل المنتجات...</div>;

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">المنتجات</h2>
      <div className="row g-4">
        {products.map((product) => (
          <div className="col-md-4" key={product._id}>
            <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
              <div className="card h-100 shadow">
                <img
                  src={product.imageCover}
                  alt={product.title}
                  className="card-img-top"
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.price} ج.م</p>
                              <button
              className="btn btn-primary w-100 mt-2"
              onClick={() => addToCart(product._id)}
              disabled={addingToCart[product._id]}
            >
              {addingToCart[product._id] ? (
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
                
              </div>
              
            </Link>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
