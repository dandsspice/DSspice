import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import BackButton from '../components/common/BackButton';
import { fadeInUp, staggerContainer } from '../animations/variants';
import orderService from '../api/orderService';
import { cookies } from '../utils/cookies';

export default function OrderManagementPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'

  // Fetch orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = cookies.getToken();
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await orderService.getOrders(token);
        if (response.code === 200) {
          setOrders(response.data || []);
        } else {
          setError(response.message || 'Failed to fetch orders');
        }
      } catch (error) {
        setError(error.message || 'An error occurred while fetching orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setViewMode('detail');
  };

  const handleReorder = (order) => {
    // Create order data from the previous order
    const orderData = {
      productId: order.product_id,
      quantity: order.quantity,
      sizeIndex: order.size_index,
      size: {
        id: order.size_id,
        name: order.size_name,
        weight: order.size_weight,
        price: order.size_price
      },
      type: order.product_type,
      typeName: order.product_name,
      totalPrice: order.total_price
    };

    // Save to cookies and navigate to checkout
    cookies.saveOrderSelection(orderData);
    navigate('/checkout', { state: orderData });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'text-yellow-500',
      'processing': 'text-blue-500',
      'shipped': 'text-purple-500',
      'delivered': 'text-green-500',
      'cancelled': 'text-red-500'
    };
    return colors[status.toLowerCase()] || 'text-gray-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500 mb-2">Error</h2>
          <p className="text-text-secondary">{error}</p>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mt-4"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <BackButton />
        </div>

        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="space-y-8"
        >
          <motion.div variants={fadeInUp} className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
              Order History
            </h1>
            <p className="text-text-secondary dark:text-dark-text-secondary">
              View and manage your orders
            </p>
          </motion.div>

          {viewMode === 'list' ? (
            <motion.div variants={fadeInUp} className="space-y-4">
              {!orders || orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-text-secondary dark:text-dark-text-secondary">
                    You haven't placed any orders yet.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/order')}
                    className="mt-6 mr-auto ml-auto"
                  >
                    Place Your First Order
                  </Button>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.ID}
                    className="bg-background-alt dark:bg-dark-background-alt rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">
                          Order #{order.ID}
                        </h3>
                        <p className="text-text-secondary dark:text-dark-text-secondary">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        <p className={`font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          variant="outline"
                          onClick={() => handleViewOrderDetails(order)}
                        >
                          View Details
                        </Button>
                        {order.status !== 'cancelled' && (
                          <Button
                            variant="primary"
                            onClick={() => handleReorder(order)}
                          >
                            Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="bg-background-alt dark:bg-dark-background-alt rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">
                    Order #{selectedOrder.ID}
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => setViewMode('list')}
                  >
                    Back to Orders
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Order Status */}
                  <div className="p-4 bg-accent/10 rounded-lg">
                    <h3 className="font-semibold mb-2">Order Status</h3>
                    <p className={`text-lg ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </p>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Product Details</h3>
                      <div className="space-y-2">
                        <p><span className="text-text-secondary">Product:</span> {selectedOrder.product_name}</p>
                        <p><span className="text-text-secondary">Size:</span> {selectedOrder.size_weight}</p>
                        <p><span className="text-text-secondary">Quantity:</span> {selectedOrder.quantity}</p>
                        <p><span className="text-text-secondary">Price per unit:</span> £{selectedOrder.unit_price}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Shipping Details</h3>
                      <div className="space-y-2">
                        <p><span className="text-text-secondary">Address:</span> {selectedOrder.shipping_address}</p>
                        <p><span className="text-text-secondary">Method:</span> {selectedOrder.shipping_method}</p>
                        <p><span className="text-text-secondary">Shipping Cost:</span> £{selectedOrder.shipping_cost}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>£{selectedOrder.subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>£{selectedOrder.shipping_cost}</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2 border-t">
                        <span>Total:</span>
                        <span>£{selectedOrder.total_price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4">
                    {selectedOrder.status !== 'cancelled' && (
                      <Button
                        variant="primary"
                        onClick={() => handleReorder(selectedOrder)}
                      >
                        Reorder
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 