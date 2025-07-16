import React from 'react';

export default function StartupLoader({ countdown }) {
  return (
    <div
      style={{
        minHeight: '40vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.8)',
        borderRadius: 16,
        margin: '2rem 0',
      }}
    >
      <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mb-4' />
      <div className='text-blue-700 font-semibold text-lg mb-1'>Loading...</div>
      <div className='text-gray-500 text-sm text-center max-w-xs mb-2'>
        This is a free server and may take a few seconds to wake up. Thank you
        for your patience!
      </div>
      {typeof countdown === 'number' && countdown > 0 && (
        <div className='text-blue-600 font-mono text-base'>
          {`Time left: ${countdown}s`}
        </div>
      )}
      {typeof countdown === 'number' && countdown === 0 && (
        <div className='text-red-500 font-mono text-base'>
          Taking more time than expected... We appreciate your patience!
        </div>
      )}
    </div>
  );
}
