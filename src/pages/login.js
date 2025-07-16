// pages/login.js
import dynamic from 'next/dynamic';
import '../styles/medicineDetails.module.css';

const GoogleLoginButton = dynamic(
  () => import('../../components/GoogleLoginButton'),
  { ssr: false }
);

export default function LoginPage() {
  return (
    <div className='w-screen min-h-screen flex justify-around items-center'>
      <div className='w-4/12 flex justify-center items-center flex-col gap-4 '>
        <div className='flex justify-center items-center flex-col'>
          <h1 className='text-3xl lg:text-6xl lg:font-medium font-semibold text-blue-400'>
            MediConnect
          </h1>
          <h1 className='text-3xl lg:text-6xl lg:font-medium font-semibold text-blue-400'>
            Login
          </h1>
        </div>
        <GoogleLoginButton />
      </div>
      <div
        className='w-8/12 h-[100vh] rounded-l-3xl'
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
