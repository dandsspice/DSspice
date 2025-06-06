import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import BackButton from '../components/common/BackButton';
import { fadeInUp, staggerContainer } from '../animations/variants';
import paymentsService from '../api/payments';
import { cookies } from '../utils/cookies';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

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
    { key: 'succeeded', label: 'Paid' },
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
        
        if (response.code === 200) {
          let filteredPayments = response.data.payments;
          
          // Apply status filter with enhanced status mapping
          if (filterStatus !== 'all') {
            filteredPayments = filteredPayments.filter(payment => {
              const paymentStatus = payment.status.toLowerCase();
             
              
              if (filterStatus === 'succeeded') {
                // Match 'succeeded' status for paid payments
                return paymentStatus === 'succeeded';
              }
              
              return paymentStatus === filterStatus.toLowerCase();
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
      'succeeded': 'text-green-500',
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

        {/* Replace the filter buttons with a dropdown */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Filter by Status</h2>
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="inline-flex justify-center items-center px-4 py-2 border border-secondary/20 rounded-lg bg-background hover:bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-accent/50">
              <span className="mr-2">
                {paymentStatuses.find(status => status.key === filterStatus)?.label || 'All Payments'}
              </span>
              <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
            </Menu.Button>

            <Menu.Items className="absolute left-0 mt-2 w-56 rounded-lg bg-background shadow-lg ring-1 ring-primary ring-opacity-5 focus:outline-none z-10">
              <div className="py-1">
                {paymentStatuses.map(status => (
                  <Menu.Item key={status.key}>
                    {({ active }) => (
                      <button
                        onClick={() => setFilterStatus(status.key)}
                        className={`${
                          active ? 'bg-secondary/10' : ''
                        } ${
                          filterStatus === status.key ? 'bg-accent/10 text-accent' : 'text-text-primary'
                        } flex justify-between items-center w-full px-4 py-2 text-sm`}
                      >
                        <span>{status.label}</span>
                        {payments.length > 0 && (
                          <span className="text-text-secondary">
                            ({status.key === 'all' 
                              ? payments.length 
                              : payments.filter(p => p.status.toLowerCase() === status.key).length
                            })
                          </span>
                        )}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Menu>
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
                    <div className="mt-6 flex flex-col sm:flex-row justify-center sm:justify-start gap-3 sm:gap-4">
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