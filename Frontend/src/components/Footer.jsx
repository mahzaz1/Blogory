const Footer = () => {
  return (
    <>
      <footer className="w-full bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white px-6 md:px-24 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-sm md:text-base">
          {/* Featured Blogs */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-purple-400">Featured Blogs</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-white cursor-pointer">Most Viewed</li>
              <li className="hover:text-white cursor-pointer">Readers Choice</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-purple-400">Support</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-white cursor-pointer">Forum</li>
              <li className="hover:text-white cursor-pointer">Contact Us</li>
              <li className="hover:text-white cursor-pointer">Recent Posts</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-purple-400">Legal</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
              <li className="hover:text-white cursor-pointer">Terms of Service</li>
            </ul>
          </div>
        </div>
      </footer>

      <div className="bg-black py-4 text-center text-xs md:text-sm text-gray-400 border-t border-gray-800">
        &copy; 2023 Blog Market. All Rights Reserved.
      </div>
    </>
  );
};

export default Footer;
