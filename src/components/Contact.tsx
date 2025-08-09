import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface Feedback {
  type: 'success' | 'error';
  message: string;
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('https://ecommerce.routemisr.com/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (res.ok) {
        setFeedback({ type: 'success', message: data.message || 'تم إرسال الرسالة بنجاح!' });
        setForm({ name: '', email: '', message: '' });
      } else {
        setFeedback({ type: 'error', message: data.message || 'فشل في إرسال الرسالة' });
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      setFeedback({ type: 'error', message: 'خطأ في الاتصال بالخادم' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5" dir="rtl">
      <h2 className="mb-4 text-center">تواصل معنا</h2>

      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '500px' }}>
        {feedback && (
          <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
            {feedback.message}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">الاسم</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">البريد الإلكتروني</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">رسالتك</label>
          <textarea
            name="message"
            className="form-control"
            rows={5}
            value={form.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
          {submitting ? 'جاري الإرسال...' : 'إرسال'}
        </button>
      </form>
    </div>
  );
}
