import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Formik } from 'formik';
import type { FormikHelpers } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';

interface FormValues {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

const initialValues: FormValues = {
  name: '',
  email: '',
  password: '',
  rePassword: '',
  phone: ''
};

const validationSchema = Yup.object({
  name: Yup.string().required('الاسم مطلوب'),
  email: Yup.string().email('البريد الإلكتروني غير صالح').required('البريد الإلكتروني مطلوب'),
  password: Yup.string()
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/, 'كلمة المرور غير قوية')
    .required('كلمة المرور مطلوبة'),
  rePassword: Yup.string()
    .oneOf([Yup.ref('password')], 'كلمات المرور غير متطابقة')
    .required('يرجى تأكيد كلمة المرور'),
  phone: Yup.string().required('رقم الهاتف مطلوب')
});

export default function Register() {
  const navigate = useNavigate();
  const [serverMessage, setServerMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    setIsLoading(true);
    setServerMessage('');

    try {
      const response = await fetch('https://ecommerce.routemisr.com/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).join('، ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'فشل في التسجيل');
      }

      setServerMessage('تم التسجيل بنجاح! جاري التحويل...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setServerMessage(error.message);
      } else {
        setServerMessage('حدث خطأ غير معروف أثناء التسجيل');
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
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

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({
                    handleSubmit,
                    handleChange,
                    values,
                    errors,
                    touched
                  }) => (
                    <form onSubmit={handleSubmit} noValidate>
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">الاسم الكامل</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                          value={values.name}
                          onChange={handleChange}
                          placeholder="أدخل اسمك الكامل"
                        />
                        {touched.name && errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">البريد الإلكتروني</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                          value={values.email}
                          onChange={handleChange}
                          placeholder="example@email.com"
                        />
                        {touched.email && errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">كلمة المرور</label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                          value={values.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                        />
                        {touched.password && errors.password && <div className="invalid-feedback">{errors.password}</div>}
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
                          className={`form-control ${touched.rePassword && errors.rePassword ? 'is-invalid' : ''}`}
                          value={values.rePassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                        />
                        {touched.rePassword && errors.rePassword && <div className="invalid-feedback">{errors.rePassword}</div>}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="phone" className="form-label">رقم الهاتف</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className={`form-control ${touched.phone && errors.phone ? 'is-invalid' : ''}`}
                          value={values.phone}
                          onChange={handleChange}
                          placeholder="+1234567890"
                        />
                        {touched.phone && errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                      </div>

                      {serverMessage && (
                        <div className={`alert ${serverMessage.includes('تم التسجيل') ? 'alert-success' : 'alert-danger'} text-center`}>
                          {serverMessage}
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
                  )}
                </Formik>

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
