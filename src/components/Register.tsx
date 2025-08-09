import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

interface FormData {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    rePassword: '',
    phone: ''
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');

    if (!validateEmail(formData.email)) {
      setError('البريد الإلكتروني غير صالح');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم ورمز خاص');
      return;
    }

    if (formData.password !== formData.rePassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://ecommerce.routemisr.com/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).join('، ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'فشل في التسجيل');
      }

      setError('تم التسجيل بنجاح! جاري التحويل...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || 'حدث خطأ أثناء التسجيل');
      } else {
        setError('حدث خطأ غير معروف أثناء التسجيل');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8 col-xl-6">
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-2 text-primary">إنشاء حساب جديد</h2>
                  <p className="text-muted mb-0">انضم إلينا اليوم واستمتع بجميع الميزات</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">الاسم الكامل</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="أدخل اسمك الكامل"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">البريد الإلكتروني</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">كلمة المرور</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                    />
                    <small className="form-text text-muted">
                      يجب أن تحتوي على 8 أحرف، حرف كبير، حرف صغير، رقم ورمز خاص
                    </small>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="rePassword" className="form-label">تأكيد كلمة المرور</label>
                    <input
                      type="password"
                      id="rePassword"
                      name="rePassword"
                      className="form-control"
                      value={formData.rePassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="phone" className="form-label">رقم الهاتف</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1234567890"
                      required
                    />
                  </div>

                  {error && (
                    <div className={`alert ${error.includes('تم التسجيل') ? 'alert-success' : 'alert-danger'} text-center`}>
                      {error}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                        جاري التسجيل...
                      </>
                    ) : 'تسجيل الحساب'}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    لديك حساب بالفعل؟{' '}
                    <button 
                      onClick={() => navigate('/login')}
                      className="btn btn-link p-0 text-decoration-none"
                    >
                      تسجيل الدخول
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
