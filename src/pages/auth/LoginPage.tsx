import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { LoginCredentials } from '../../types';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    try {
      await login(data);
      navigate('/candidates');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: '100vh',
      paddingTop: '100px'
    }}>
      <div style={{ width: '300px' }}>
        <h1 style={{ 
          fontSize: '24px',
          marginBottom: '20px',
          fontWeight: '600'
        }}>
          Welcome to Dashboard
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: '16px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Email Address<span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="email"
              {...register('email', { required: true })}
              placeholder="xyz@gmail.com"
              style={{
                width: '100%',
                height: '32px',
                padding: '4px 8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Password<span style={{ color: 'red' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                {...register('password', { required: true })}
                placeholder="••••••••••••••"
                style={{
                  width: '100%',
                  height: '32px',
                  padding: '4px 8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              <button
                type="button"
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'none',
                  padding: 0,
                  cursor: 'pointer'
                }}
              >
                <EyeOff size={16} color="#666" />
              </button>
            </div>
            <a 
              href="#" 
              style={{
                display: 'block',
                marginTop: '4px',
                color: '#4A1D7A',
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '72px',
              height: '32px',
              backgroundColor: '#4A1D7A',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </form>

        <p style={{ fontSize: '14px' }}>
          Don't have an account?{' '}
          <a 
            href="#" 
            style={{
              color: '#4A1D7A',
              textDecoration: 'none'
            }}
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;