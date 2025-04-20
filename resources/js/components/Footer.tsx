import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center">
      <p>© {new Date().getFullYear()} CarePoint. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
