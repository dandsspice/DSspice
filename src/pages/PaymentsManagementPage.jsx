import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import BackButton from '../components/common/BackButton';
import { fadeInUp, staggerContainer } from '../animations/variants';
import paymentsService from '../api/payments';
import { cookies } from '../utils/cookies';

export default function PaymentsManagementPage() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'paid', 'unpaid'

  // Update payment statuses to match API response
  const paymentStatuses = [
    { key: 'all', label: 'All Payments' },
    { key: 'paid', label: 'Paid' },
    { key: 'unpaid', label: 'Unpaid' },
    { key: 'pending', label: 'Pending' },
    { key: 'failed', label: 'Failed' }
  ];

  // Fetch payments on mount and when filter changes
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = cookies.getToken();
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await paymentsService.getPayments(token);
        console.log('Payments data:', response.data); // Debug log

        if (response.code === 200) {
          let filteredPayments = response.data.payments;
          
          // Apply status filter with enhanced status mapping
          if (filterStatus !== 'all') {
            filteredPayments = filteredPayments.filter(payment => {
              const paymentStatus = payment.status.toLowerCase();
              switch (filterStatus) {
                case 'paid':
                  // Check for both 'paid' and 'completed' statuses
                  return paymentStatus === 'paid' || paymentStatus === 'completed';
                case 'unpaid':
                  return paymentStatus === 'unpaid';
                case 'pending':
                  return paymentStatus === 'pending';
                case 'failed':
                  return paymentStatus === 'failed';
                default:
                  return paymentStatus === filterStatus.toLowerCase();
              }
            });
          }
          
          setPayments(filteredPayments);
        } else {
          setError(response.message || 'Failed to fetch payments');
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
        setError(error.message || 'An error occurred while fetching payments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [filterStatus, navigate]);

  const handleViewPaymentDetails = (payment) => {
    setSelectedPayment(payment);
    setViewMode('detail');
  };

  // Update status colors to match actual statuses
  const getStatusColor = (status) => {
    const colors = {
      'paid': 'text-green-500',
      'completed': 'text-green-500', // Same color for both paid and completed
      'unpaid': 'text-red-500',
      'pending': 'text-yellow-500',
      'failed': 'text-red-500'
    };
    return colors[status.toLowerCase()] || 'text-gray-500';
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <BackButton />
          <h1 className="text-3xl font-bold mt-4">Payment History</h1>
        </div>

        {/* Enhanced Filter Controls */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Filter by Status</h2>
          <div className="flex flex-wrap gap-3">
            {paymentStatuses.map(status => (
              <Button
                key={status.key}
                variant={filterStatus === status.key ? 'primary' : 'outline'}
                onClick={() => setFilterStatus(status.key)}
                className={`px-4 py-2 ${
                  filterStatus === status.key 
                    ? 'bg-accent text-white' 
                    : 'hover:bg-accent/10'
                }`}
              >
                {status.label}
                {payments.length > 0 && (
                  <span className="ml-2 text-sm">
                    ({status.key === 'all' 
                      ? payments.length 
                      : payments.filter(p => p.status.toLowerCase() === status.key).length
                    })
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-6"
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">{error}</div>
          ) : viewMode === 'list' ? (
            <motion.div variants={fadeInUp} className="space-y-4">
              {payments.length === 0 ? (
                <div className="text-center text-text-secondary dark:text-dark-text-secondary p-8">
                  {filterStatus === 'all' 
                    ? 'No payments found.' 
                    : `No ${filterStatus} payments found.`}
                </div>
              ) : (
                <>
                  {payments.map((payment) => (
                    <div
                      key={payment.ID}
                      className="bg-background-alt dark:bg-dark-background-alt rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">
                            Payment #{payment.ID}
                          </h3>
                          <p className="text-text-secondary dark:text-dark-text-secondary">
                            {formatDate(payment.created_at)}
                          </p>
                          <p className={`font-medium ${getStatusColor(payment.status)}`}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </p>
                          <p className="font-semibold">
                            Amount: {payment.currency.toUpperCase()} {payment.amount}
                          </p>
                          <p className="text-sm text-text-secondary">
                            Order ID: {payment.orderID}
                          </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button
                            variant="primary"
                            onClick={() => handleViewPaymentDetails(payment)}
                          >
                            View Details
                          </Button>
                          {payment.status === 'unpaid' && payment.checkout_url && (
                            <Button
                              variant="outline"
                              onClick={() => window.location.href = payment.checkout_url}
                            >
                              Pay Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </motion.div>
          ) : (
            <motion.div variants={fadeInUp}>
              <Button
                variant="outline"
                onClick={() => setViewMode('list')}
                className="mb-6"
              >
                Back to Payments
              </Button>
              
              <div className="bg-background-alt dark:bg-dark-background-alt rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold mb-6">
                  Payment Details
                </h2>
                
                <div className="space-y-6">
                  {/* Payment Status */}
                  <div className="p-4 bg-accent/10 rounded-lg">
                    <h3 className="font-semibold mb-2">Payment Status</h3>
                    <p className={`text-lg ${getStatusColor(selectedPayment.status)}`}>
                      {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                    </p>
                  </div>

                  {/* Payment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Payment Information</h3>
                      <div className="space-y-2">
                        <p><span className="text-text-secondary">Payment ID:</span> {selectedPayment.ID}</p>
                        <p><span className="text-text-secondary">Order ID:</span> {selectedPayment.orderID}</p>
                        <p><span className="text-text-secondary">Created:</span> {formatDate(selectedPayment.created_at)}</p>
                        <p><span className="text-text-secondary">Last Updated:</span> {formatDate(selectedPayment.updated_at)}</p>
                        <p><span className="text-text-secondary">Customer Email:</span> {selectedPayment.customer_email}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Amount Details</h3>
                      <div className="space-y-2">
                        <p><span className="text-text-secondary">Amount:</span> {selectedPayment.currency.toUpperCase()} {selectedPayment.amount}</p>
                        <p><span className="text-text-secondary">Status:</span> 
                          <span className={`ml-2 ${getStatusColor(selectedPayment.status)}`}>
                            {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                          </span>
                        </p>
                        {selectedPayment.payment_intent && (
                          <p><span className="text-text-secondary">Payment Intent:</span> {selectedPayment.payment_intent}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedPayment.status === 'unpaid' && selectedPayment.checkout_url && (
                    <div className="mt-6 flex justify-center">
                      <Button
                        variant="primary"
                        onClick={() => window.location.href = selectedPayment.checkout_url}
                      >
                        Proceed to Payment
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 