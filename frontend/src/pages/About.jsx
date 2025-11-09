import { motion } from 'framer-motion';
import { FaBook, FaUsers, FaClock, FaHeart, FaAward } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-8 md:p-12 border border-gray-200"
        >
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              About LibraryHub
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your gateway to knowledge, learning, and endless stories
            </p>
          </div>
          
          <div className="space-y-10 text-gray-700">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to LibraryHub</h2>
              <p className="text-lg leading-relaxed text-gray-700 mb-4">
                LibraryHub is a modern, community-focused library that brings together book lovers, 
                students, researchers, and knowledge seekers. We believe that access to books and 
                information is a fundamental right, and we're committed to making knowledge accessible 
                to everyone.
              </p>
              <p className="text-lg leading-relaxed text-gray-700">
                Our library houses an extensive collection of books spanning various genres, from 
                classic literature to contemporary fiction, academic textbooks to research materials, 
                and everything in between. Whether you're looking for your next great read or 
                conducting research, LibraryHub is here to support your journey.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg leading-relaxed text-gray-700 mb-4">
                At LibraryHub, our mission is to foster a love of reading, support lifelong learning, 
                and build a vibrant community of readers. We strive to:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: FaBook, text: 'Provide access to a diverse collection of books and resources' },
                  { icon: FaUsers, text: 'Build a welcoming community for all readers and learners' },
                  { icon: FaClock, text: 'Offer convenient and efficient library services' },
                  { icon: FaHeart, text: 'Promote literacy and lifelong learning' },
                  { icon: FaAward, text: 'Maintain high standards of service and collection quality' },
                  { icon: FaBook, text: 'Support academic and personal growth through knowledge' },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <Icon className="text-indigo-600 text-xl mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{item.text}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
              <div className="space-y-4">
                <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                  <h3 className="text-xl font-semibold text-indigo-900 mb-2">Book Lending</h3>
                  <p className="text-gray-700">
                    Members can borrow books for up to 10 days. Our easy-to-use system allows you to 
                    browse our collection, issue books, and manage your reading list all in one place.
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="text-xl font-semibold text-purple-900 mb-2">Book Ratings & Reviews</h3>
                  <p className="text-gray-700">
                    Share your thoughts and help others discover great books. Rate books you've read 
                    and see what the community recommends.
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-xl font-semibold text-green-900 mb-2">Digital Catalog</h3>
                  <p className="text-gray-700">
                    Search our entire collection online. Find books by title, author, category, or 
                    ISBN. Our advanced search makes it easy to discover your next favorite read.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Library Policies</h2>
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">•</span>
                    <span><strong>Loan Period:</strong> Books can be borrowed for 10 days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">•</span>
                    <span><strong>Late Fees:</strong> ₹10 per day for books returned after the due date</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">•</span>
                    <span><strong>Membership:</strong> One-time registration fee of ₹200 for members</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">•</span>
                    <span><strong>Multiple Books:</strong> Multiple members can issue the same book</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Visit Us</h2>
              <p className="text-gray-700 mb-2">
                We're open to serve our community and welcome visitors. Whether you're a student, 
                researcher, or simply a book lover, LibraryHub is your home for knowledge and discovery.
              </p>
              <p className="text-gray-600 text-sm mt-4">
                For inquiries or assistance, please contact our library staff or visit our help desk.
              </p>
            </div>

            <div className="pt-6 border-t-2 border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                © 2025 LibraryHub. All rights reserved. | Building a community of readers, one book at a time.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
