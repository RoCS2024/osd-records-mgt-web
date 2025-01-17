import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      let exp = localStorage.getItem('exp');
      let currentDate = new Date();
      const role = sessionStorage.getItem('role');

      if (exp * 1000 < currentDate.getTime()) {
        navigate('/login');
        return;
      }

      switch (role) {
        case "ROLE_ROLE_ADMIN":
          break;
        case "ROLE_ROLE_EMPLOYEE":
          navigate('/employee/cs-list');
          break;
        case "ROLE_ROLE_STUDENT":
          navigate('/student/violation');
          break;
        case "ROLE_ROLE_GUEST":
          navigate('/guest/violation');
          break;
        default:
          navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.setItem('token', '');
    sessionStorage.setItem('role', '');
    localStorage.setItem('exp', '');
    navigate('/login');
  };

  return { handleLogout };
};

