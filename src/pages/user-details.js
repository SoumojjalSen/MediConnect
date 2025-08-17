import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import {
  Input,
  Select,
  SelectItem,
  CheckboxGroup,
  Checkbox,
} from '@nextui-org/react';
export default function UserDetails() {
  const [userType, setUserType] = useState('user');
  const [userForm, setUserForm] = useState({
    fullname: '',
    age: '',
    weight: '',
    height: '',
    diet: 'veg',
  });
  const [doctorForm, setDoctorForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    specialization: [],
  });
  const router = useRouter();

  const [isEmailValid, setIsEmailValid] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Get token from cookies
    const tokenFromCookies = Cookies.get('token');
    if (tokenFromCookies) {
      setToken(tokenFromCookies);
    }
  }, []);

  useEffect(() => {
    const checkEmail = async () => {
      if (!token) return;

      try {
        const response = await fetch('/api/check-email-exists', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsEmailValid(data.exists);
        } else {
          setIsEmailValid(false);
        }
      } catch (error) {
        console.error('Email check error:', error);
        setIsEmailValid(false);
      }
    };

    checkEmail();
  }, [token]); // Only run when token is available

  // Redirect or show the form
  useEffect(() => {
    if (isEmailValid === true) {
      router.push('/');
    }
  }, [isEmailValid]); // Run when isEmailValid is updated

  const handleUserChange = (name, value) => {
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDoctorChange = (name, value) => {
    setDoctorForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/saveUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userForm),
    });
    if (res.ok) {
      Cookies.set('userType', 'user');
      router.push('/');
    }
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/saveDoctor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(doctorForm),
    });
    if (res.ok) {
      Cookies.set('userType', 'doctor');
      router.push('/');
    }
  };

  const specializations = [
    'Respiratory',
    'Musculoskeletal',
    'Neurological',
    'Psychological',
    'Dermatological',
    'Excretion',
    'General',
  ];

  return (
    <div
      className='w-screen min-h-screen flex flex-col lg:flex-row justify-start lg:justify-center items-start lg:items-center gap-6 lg:gap-8 px-4 sm:px-6'
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dv6bqnxqf/image/upload/v1747339514/zgi5lyx9jyp3zwgrc31d.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className='w-full lg:w-5/12 flex flex-col items-center justify-center gap-6 mt-8 lg:mt-0'>
        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#f093fb] to-[#f5576c] bg-clip-text text-transparent text-center leading-tight px-2'>
          Allow us to personalize your experience!
        </h1>
        <div className='w-full flex justify-center'>
          <div className='bg-white/80 backdrop-blur-md rounded-xl px-3 py-2 inline-flex items-center gap-3'>
            <div className='flex gap-3 text-base sm:text-lg lg:text-2xl items-center flex-nowrap'>
              <Checkbox
                isSelected={userType === 'user'}
                onValueChange={() => setUserType('user')}
                className='text-base sm:text-lg'
                classNames={{
                  base: 'flex items-center gap-2',
                  label: 'text-black text-base sm:text-lg lg:text-xl font-semibold whitespace-nowrap',
                  icon: 'text-[#0a6efa] w-5 h-5 sm:w-6 sm:h-6',
                }}
              >
                I'm a User
              </Checkbox>

              <Checkbox
                isSelected={userType === 'doctor'}
                onValueChange={() => setUserType('doctor')}
                className='text-base sm:text-lg'
                classNames={{
                  base: 'flex items-center gap-2',
                  label: 'text-black text-base sm:text-lg lg:text-xl font-semibold whitespace-nowrap',
                  icon: 'text-[#0a6efa] w-5 h-5 sm:w-6 sm:h-6',
                }}
              >
                I'm a Doctor
              </Checkbox>
            </div>
          </div>
        </div>
      </div>

      <form
        onSubmit={userType === 'user' ? handleUserSubmit : handleDoctorSubmit}
    className='flex justify-center items-center flex-col gap-4 w-full max-w-md sm:max-w-lg md:w-7/12 lg:w-4/12 bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-0 mx-auto lg:mx-0'
      >
        {userType === 'user' ? (
          <>
            <div className='w-full justify-center items-center flex flex-wrap md:flex-nowrap gap-4 text-cyan-300 lg:text-xl text-lg font-medium'>
              <div className='w-full'>
                Name:
                <Input
                  type='string'
                  aria-label='Full Name'
                  placeholder='Enter your full name'
                  value={userForm.fullname}
                  onChange={(e) => handleUserChange('fullname', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className='w-full justify-center items-center flex flex-wrap md:flex-nowrap gap-4 text-cyan-300 lg:text-xl text-lg font-medium'>
              <div className='w-full'>
                Age:
                <Input
                  type='number'
                  aria-label='Age'
                  label='Enter your age'
                  value={userForm.age}
                  onChange={(e) => handleUserChange('age', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className='w-full justify-center items-center flex flex-wrap md:flex-nowrap gap-4 text-cyan-300 lg:text-xl text-lg font-medium'>
              <div className='w-full'>
                Weight (kg):
                <Input
                  type='number'
                  aria-label='Weight'
                  label='Enter your weight'
                  value={userForm.weight}
                  onChange={(e) => handleUserChange('weight', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className='w-full justify-center items-center flex flex-wrap md:flex-nowrap gap-4 text-cyan-300 lg:text-xl text-lg font-medium'>
              <div className='w-full'>
                Height (cm):
                <Input
                  type='number'
                  aria-label='Height'
                  label='Enter your height'
                  value={userForm.height}
                  onChange={(e) => handleUserChange('height', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className='w-full justify-center items-center flex flex-wrap md:flex-nowrap gap-4 text-cyan-300 lg:text-xl text-lg font-medium'>
              <div className='w-full'>
                Diet:
                <Select
                  label='Diet'
                  aria-label='Diet'
                  className='w-full rounded-md bg-richblack-500 text-zinc-200 text-lg'
                  selectedKeys={[userForm.diet]}
                  onSelectionChange={(key) => {
                    const selected = Array.from(key)[0];
                    handleUserChange('diet', selected);
                  }}
                >
                  <SelectItem key='veg'>Veg</SelectItem>
                  <SelectItem key='non-veg'>Non-Veg</SelectItem>
                </Select>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='w-full justify-center items-center flex flex-wrap md:flex-nowrap gap-4 text-cyan-300 lg:text-xl text-lg font-medium'>
              <div className='w-full'>
                First Name:
                <Input
                  type='text'
                  aria-label='First Name'
                  placeholder='Enter your first name'
                  value={doctorForm.firstName}
                  onChange={(e) =>
                    handleDoctorChange('firstName', e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className='w-full justify-center items-center flex flex-wrap md:flex-nowrap gap-4 text-cyan-300 lg:text-xl text-lg font-medium'>
              <div className='w-full'>
                Last Name:
                <Input
                  type='text'
                  aria-label='Last Name'
                  placeholder='Enter your last name'
                  value={doctorForm.lastName}
                  onChange={(e) =>
                    handleDoctorChange('lastName', e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className='w-full justify-center items-center flex flex-col text-cyan-300 lg:text-xl text-lg font-medium'>
              <div className='w-full'>
                Specializations:
                <CheckboxGroup
                  value={doctorForm.specialization}
                  onValueChange={(val) =>
                    handleDoctorChange('specialization', val)
                  }
                  className='mt-2 w-full'
                  classNames={{
                    base: 'flex flex-wrap gap-3', // container
                    label: 'text-white text-xl font-semibold mb-2', // top label (optional)
                  }}
                >
                  {specializations.map((item) => (
                    <Checkbox
                      key={item}
                      value={item}
                      className=''
                      classNames={{
                        base: 'rounded-xl p-2',
                        label: 'text-lg text-blue-100', // label text
                        icon: 'text-pink-400',
                      }}
                    >
                      {item}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
            </div>
          </>
        )}

        <button
          type='submit'
          className='w-11/12 px-3 py-2 bg-gradient-to-r from-[#0a6efabd] to-[#68c1f5c7] rounded-xl mt-4 text-white text-xl hover:scale-[0.98] transition-all duration-1000'
        >
          Submit
        </button>
      </form>
    </div>
  );
}
