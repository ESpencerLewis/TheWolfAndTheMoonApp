import React from 'react';

export default function Layout({ children }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.cdnfonts.com/css/bleeding-cowboys');
      `}</style>
      {children}
    </>
  );
}