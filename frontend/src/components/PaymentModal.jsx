import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCreditCard, FaMoneyBillWave, FaMobileAlt } from 'react-icons/fa';
import api from '../utils/api';
import { toast } from 'react-toastify';

const PaymentModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentDetails, setPaymentDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentRef, setPaymentRef] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await api.post('/payment/process', {
        amount: parseFloat(amount),
        description: description || 'Library service payment',
        paymentMethod,
        paymentDetails,
      });
      setPaymentRef(res.data.payment.reference);
      setSuccess(true);
      toast.success('Payment processed successfully!');
      setAmount('');
      setDescription('');
      setPaymentMethod('cash');
      setPaymentDetails({});
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Payment processing failed';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSuccess(false);
    setError('');
    setPaymentRef('');
    setAmount('');
    setDescription('');
    setPaymentMethod('cash');
    setPaymentDetails({});
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setPaymentDetails({});
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8 text-white"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>

          <h2 className="text-3xl font-bold mb-6">Payment</h2>

          {success ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-green-400 mb-2">Payment Successful!</h3>
              <p className="text-gray-300 mb-2">Reference: <span className="font-mono">{paymentRef}</span></p>
              <p className="text-sm text-gray-400">This is a simulated payment system.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-white"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-white"
                  placeholder="Payment description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange('cash')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-indigo-500 bg-indigo-500/20'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <FaMoneyBillWave className="text-2xl mx-auto mb-2" />
                    <span className="text-sm font-medium">Cash</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange('upi')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-indigo-500 bg-indigo-500/20'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <FaMobileAlt className="text-2xl mx-auto mb-2" />
                    <span className="text-sm font-medium">UPI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange('card')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-indigo-500 bg-indigo-500/20'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <FaCreditCard className="text-2xl mx-auto mb-2" />
                    <span className="text-sm font-medium">Card</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'upi' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.upiId || ''}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, upiId: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-white"
                    placeholder="yourname@upi"
                  />
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.cardNumber || ''}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-white"
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Expiry
                      </label>
                      <input
                        type="text"
                        value={paymentDetails.expiry || ''}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-white"
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={paymentDetails.cvv || ''}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-white"
                        placeholder="123"
                        maxLength="3"
                      />
                    </div>
                  </div>
                </div>
              )}

             

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Process Payment'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;

