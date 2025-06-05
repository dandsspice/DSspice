import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Button from '../components/common/Button';
import { fadeInUp, staggerContainer } from '../animations/variants';
import paymentsService from '../api/payments';
import { cookies } from '../utils/cookies';

export default function PaymentVerificationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);

  // Get the payment ID from the URL
  const paymentId = searchParams.get('id')?.replace('PAY-', '') || '';

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const token = cookies.getToken();
        if (!token) {
          navigate('/login');
          return;
        }

        if (!paymentId) {
          setStatus('error');
          setMessage('Invalid payment ID');
          return;
        }

        // Add PAY- prefix if not present
        const fullPaymentId = paymentId.startsWith('PAY-') ? paymentId : `PAY-${paymentId}`;
        const response = await paymentsService.verifyPayment(fullPaymentId, token);
        
        if (response.code === 200) {
          // Set status based on payment status from API
          const paymentStatus = response.data.status.toLowerCase();
          setStatus(paymentStatus === 'paid' ? 'success' : paymentStatus);
          setMessage(response.message || 'Payment status verified');
          setPaymentDetails(response.data);
        } else {
          setStatus('error');
          setMessage(response.message || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setStatus('error');
        setMessage(error.message || 'An error occurred while verifying payment');
      }
    };

    verifyPayment();
  }, [paymentId, navigate]);

  // Update status colors to match actual statuses
  const getStatusColor = (paymentStatus) => {
    const colors = {
      'paid': 'text-green-500',
      'unpaid': 'text-red-500',
      'pending': 'text-yellow-500',
      'failed': 'text-red-500'
    };
    return colors[paymentStatus?.toLowerCase()] || 'text-gray-500';
  };

  const getStatusIcon = (currentStatus) => {
    switch (currentStatus) {
      case 'success':
        return <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />;
      case 'pending':
        return (
          <div className="mx-auto h-16 w-16 text-yellow-500">
            <svg className="animate-spin" viewBox="0 0 24 24">
              {/* ... spinner SVG path ... */}
            </svg>
          </div>
        );
      case 'error':
        return <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="max-w-2xl mx-auto"
      >
        <motion.div
          variants={fadeInUp}
          className="bg-background-alt dark:bg-dark-background-alt rounded-2xl p-8 shadow-lg"
        >
          {status === 'loading' ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-text-secondary dark:text-dark-text-secondary">
                Verifying payment status...
              </p>
            </div>
          ) : (
            <div className="text-center">
              {getStatusIcon(status)}
              <h2 className="mt-4 text-2xl font-bold text-text-primary dark:text-dark-text-primary">
                {status === 'success' ? 'Payment Successful!' :
                 status === 'pending' ? 'Payment Pending' :
                 'Payment Verification Failed'}
              </h2>
              <p className="mt-2 text-text-secondary dark:text-dark-text-secondary">
                {message}
              </p>
              
              {paymentDetails && (
                <div className="mt-8 text-left bg-accent/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Payment ID:</span>
                      <span>{paymentDetails.ID}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Order ID:</span>
                      <span>{paymentDetails.orderID}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Amount:</span>
                      <span>{paymentDetails.currency.toUpperCase()} {paymentDetails.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Status:</span>
                      <span className={getStatusColor(paymentDetails.status)}>
                        {paymentDetails.status.charAt(0).toUpperCase() + paymentDetails.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8 space-x-4">
                {status === 'success' && (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => navigate('/orders')}
                    >
                      View Orders
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/payments')}
                    >
                      Payment History
                    </Button>
                  </>
                )}
                {status === 'pending' && (
                  <Button
                    variant="primary"
                    onClick={() => window.location.reload()}
                  >
                    Check Again
                  </Button>
                )}
                {status === 'error' && (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => navigate('/checkout')}
                    >
                      Try Again
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/')}
                    >
                      Go Home
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
} 