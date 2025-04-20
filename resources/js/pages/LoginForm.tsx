import React from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useForm } from '@inertiajs/react';

const LoginForm: React.FC = () => {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e3a8a] text-[#f8f0fb]">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-gray-900"
      >
        <h2 className="text-2xl font-bold mb-6 text-[#1e3a8a]">Login to CarePoint</h2>
        <div className="mb-4">
          <Label htmlFor="email" className="block mb-1 font-semibold">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            className="w-full"
            required
          />
          {errors.email && <p className="text-red-600 mt-1">{errors.email}</p>}
        </div>
        <div className="mb-6">
          <Label htmlFor="password" className="block mb-1 font-semibold">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            className="w-full"
            required
          />
          {errors.password && <p className="text-red-600 mt-1">{errors.password}</p>}
        </div>
        <Button
          type="submit"
          className="w-full bg-[#1e3a8a] text-[#f8f0fb] hover:bg-[#6ee7b7] hover:text-[#1e3a8a] font-semibold"
          disabled={processing}
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
