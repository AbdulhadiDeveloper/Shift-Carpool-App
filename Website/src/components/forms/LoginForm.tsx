import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { loginSchema, LoginFormData } from '../../lib/schemas';
import { useAuth } from '../../hooks/useAuth';

export default function LoginForm() {
  const { login } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
      {/* Email Field */}
      <div className="relative w-full">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant" size={20} />
        <input
          {...register('email')}
          type="email"
          placeholder="Email Address"
          className="w-full bg-surface-container border-b border-outline-variant focus:border-primary text-on-surface font-body-lg text-body-lg pl-8 pr-3 py-3 focus:outline-none transition-colors"
          disabled={isSubmitting}
        />
        {errors.email && <p className="text-error text-body-sm mt-1">{errors.email.message}</p>}
      </div>

      {/* Password Field */}
      <div className="relative w-full">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant" size={20} />
        <input
          {...register('password')}
          type="password"
          placeholder="Password"
          className="w-full bg-surface-container border-b border-outline-variant focus:border-primary text-on-surface font-body-lg text-body-lg pl-8 pr-3 py-3 focus:outline-none transition-colors"
          disabled={isSubmitting}
        />
        {errors.password && <p className="text-error text-body-sm mt-1">{errors.password.message}</p>}
      </div>

      <div className="flex justify-end">
        <a href="#" className="text-on-surface-variant font-body-sm hover:text-primary transition-colors">
          Forgot Password?
        </a>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-3 bg-primary text-on-primary font-title-md text-title-md py-3 px-6 rounded-full hover:bg-primary-fixed-dim transition-colors duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
        {!isSubmitting && <ArrowRight size={20} />}
      </button>
    </form>
  );
}
