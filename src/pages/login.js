// pages/login.js
import dynamic from 'next/dynamic';
import '../styles/medicineDetails.module.css';

const GoogleLoginButton = dynamic(
  () => import('../../components/GoogleLoginButton'),
  { ssr: false }
);

export default function LoginPage() {
  return (
    <div className='w-screen min-h-screen flex flex-col lg:flex-row justify-around items-center relative'>
      {/* Background image for mobile, hidden on large screens */}
      <div
        className='absolute inset-0 lg:hidden z-0'
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dv6bqnxqf/image/upload/v1747337551/qwfm1ff8ocwdjkpsjn5f.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay for better text visibility */}
        <div className='absolute inset-0 bg-black opacity-60'></div>
      </div>
      {/* Content */}
      <div
        className='w-full lg:w-4/12 flex justify-center items-center flex-col gap-4 z-10 px-4 py-12 lg:py-0 bg-transparent lg:bg-[#183366]'
        style={{ position: 'relative' }}
      >
        <div className='flex justify-center items-center flex-col'>
          <h1 className='text-5xl sm:text-6xl lg:text-6xl lg:font-medium font-semibold text-[#3ba3e6] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transition-all duration-200'>
            MediConnect
          </h1>
          <h1 className='text-4xl sm:text-5xl lg:text-6xl lg:font-medium font-semibold text-white lg:text-blue-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transition-all duration-200'>
            Login
          </h1>
        </div>
        <GoogleLoginButton />
      </div>
      {/* Right image for desktop */}
      <div
        className='hidden lg:block w-8/12 h-[100vh] rounded-l-3xl z-0'
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dv6bqnxqf/image/upload/v1747337551/qwfm1ff8ocwdjkpsjn5f.jpg')",
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>
    </div>
  );
}

export async function getStaticProps() {
  return { props: {} };
}
