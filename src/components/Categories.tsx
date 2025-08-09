import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Category {
  _id: string;
  name: string;
  image: string;
}

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://ecommerce.routemisr.com/api/v1/categories');
        const json = await res.json();
        setCategories(json.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
        <h4>حدث خطأ أثناء جلب البيانات</h4>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5">الفئات</h2>

      <div className="row g-4">
        {categories.map((category) => (
          <div key={category._id} className="col-md-4 col-lg-3">
            <div className="card h-100 shadow-sm border-0">
              <Link to={`/products?category=${category._id}`} className="text-decoration-none text-dark">
                <div
                  className="card-img-top position-relative overflow-hidden"
                  style={{ height: '200px' }}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="img-fluid h-100 w-100 object-fit-cover"
                  />
                </div>

                <div className="card-body text-center">
                  <h5 className="card-title">{category.name}</h5>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
