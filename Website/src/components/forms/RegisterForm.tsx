import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { registerSchema, RegisterFormData } from '../../lib/schemas';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterForm() {
  const { register: registerAuth } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    await registerAuth(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full mt-6">
      {/* Full Name Field */}
      <div className="relative w-full">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant pointer-events-none" size={20} />
        <label className="absolute left-0 -top-6 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider pl-2">Full Name</label>
        <input
          {...register('fullName')}
          type="text"
          placeholder="e.g. Jane Doe"
          className="w-full bg-surface border-b border-surface-bright text-on-surface font-body-lg text-body-lg px-3 py-3 pl-[44px] focus:outline-none focus:border-primary focus:bg-surface-container transition-colors duration-300 placeholder:text-surface-variant rounded-t-DEFAULT"
          disabled={isSubmitting}
        />
        {errors.fullName && <p className="text-error text-body-sm mt-1">{errors.fullName.message}</p>}
      </div>

      {/* Email Field */}
      <div className="relative w-full mt-3">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant pointer-events-none" size={20} />
        <label className="absolute left-0 -top-6 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider pl-2">Email Address</label>
        <input
          {...register('email')}
          type="email"
          placeholder="name@example.com"
          className="w-full bg-surface border-b border-surface-bright text-on-surface font-body-lg text-body-lg px-3 py-3 pl-[44px] focus:outline-none focus:border-primary focus:bg-surface-container transition-colors duration-300 placeholder:text-surface-variant rounded-t-DEFAULT"
          disabled={isSubmitting}
        />
        {errors.email && <p className="text-error text-body-sm mt-1">{errors.email.message}</p>}
      </div>

      {/* Phone Field */}
      <div className="relative w-full mt-3">
        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant pointer-events-none" size={20} />
        <label className="absolute left-0 -top-6 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider pl-2">Phone Number</label>
        <input
          {...register('phone')}
          type="tel"
          placeholder="+1 234 567 8900"
          className="w-full bg-surface border-b border-surface-bright text-on-surface font-body-lg text-body-lg px-3 py-3 pl-[44px] focus:outline-none focus:border-primary focus:bg-surface-container transition-colors duration-300 placeholder:text-surface-variant rounded-t-DEFAULT"
          disabled={isSubmitting}
        />
        {errors.phone && <p className="text-error text-body-sm mt-1">{errors.phone.message}</p>}
      </div>

      {/* Password Field */}
      <div className="relative w-full mt-3">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant pointer-events-none" size={20} />
        <label className="absolute left-0 -top-6 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider pl-2">Password</label>
        <input
          {...register('password')}
          type="password"
          placeholder="••••••••"
          className="w-full bg-surface border-b border-surface-bright text-on-surface font-body-lg text-body-lg px-3 py-3 pl-[44px] focus:outline-none focus:border-primary focus:bg-surface-container transition-colors duration-300 placeholder:text-surface-variant rounded-t-DEFAULT"
          disabled={isSubmitting}
        />
        {errors.password && <p className="text-error text-body-sm mt-1">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-3 bg-primary text-on-primary font-body-lg text-body-lg font-medium py-3 px-6 rounded-full hover:bg-primary-fixed-dim transition-colors duration-300 flex justify-center items-center gap-2 disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Join Shift'}
        {!isSubmitting && <ArrowRight size={20} />}
      </button>
    </form>
  );
}
