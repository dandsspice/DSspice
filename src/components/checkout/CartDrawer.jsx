import { Fragment, useState } from 'react';
import { Dialog, Transition, Switch } from '@headlessui/react';
import { XMarkIcon, ShoppingCartIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Button from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity } = useCart();
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [quantityError, setQuantityError] = useState(null);

  // Enhanced cart statistics
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => sum + (item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0), 0);

  const handleQuantityChange = (itemId, newQuantity) => {
    setQuantityError(null);
    if (newQuantity < 1) {
      setQuantityError({ itemId, message: "Quantity cannot be less than 1" });
      return;
    }
    if (newQuantity > 99) {
      setQuantityError({ itemId, message: "Maximum quantity is 99" });
      return;
    }
    updateQuantity(itemId, newQuantity);
  };

  const handleSelectItem = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
      setSelectAll(false);
    } else {
      newSelected.add(itemId);
      if (newSelected.size === cartItems.length) {
        setSelectAll(true);
      }
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(item => item.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleBulkRemove = () => {
    setShowConfirmDialog(true);
  };

  const confirmBulkRemove = () => {
    selectedItems.forEach(itemId => {
      removeFromCart(itemId);
    });
    setSelectedItems(new Set());
    setSelectAll(false);
    setShowConfirmDialog(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <>
      <Transition.Root show={isCartOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setIsCartOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col bg-background dark:bg-dark-background shadow-xl">
                      <div className="px-4 py-6 sm:px-6 border-b border-secondary/10">
                        <div className="flex items-start justify-between">
                          <div>
                            <Dialog.Title className="text-lg font-medium text-text-primary">
                              Shopping Cart ({totalItems} items)
                            </Dialog.Title>
                            {savings > 0 && (
                              <p className="mt-1 text-sm text-green-600">
                                You're saving ${savings.toFixed(2)}!
                              </p>
                            )}
                          </div>
                          <button
                            className="relative -m-2 p-2 text-text-secondary hover:text-text-primary"
                            onClick={() => setIsCartOpen(false)}
                          >
                            <XMarkIcon className="h-6 w-6" />
                          </button>
                        </div>
                      </div>

                      {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-96">
                          <ShoppingCartIcon className="h-16 w-16 text-text-secondary dark:text-dark-text-secondary mb-4" />
                          <p className="text-text-secondary dark:text-dark-text-secondary">
                            Your cart is empty
                          </p>
                        </div>
                      ) : (
                        <motion.div 
                          variants={containerVariants}
                          initial="hidden"
                          animate="show"
                          className="flex-1 overflow-y-auto px-4 py-6 sm:px-6"
                        >
                          <div className="flow-root">
                            <div className="flex items-center justify-between mb-4 px-2">
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={selectAll}
                                  onChange={handleSelectAll}
                                  className={`${
                                    selectAll ? 'bg-accent' : 'bg-gray-200'
                                  } relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none`}
                                >
                                  <span className={`${
                                    selectAll ? 'translate-x-5' : 'translate-x-1'
                                  } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}/>
                                </Switch>
                                <span className="text-sm text-text-primary dark:text-dark-text-primary">Select All</span>
                              </div>
                              {selectedItems.size > 0 && (
                                <button
                                  onClick={handleBulkRemove}
                                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                  Remove Selected
                                </button>
                              )}
                            </div>

                            <ul className="space-y-4">
                              <AnimatePresence>
                                {cartItems.map((item) => (
                                  <motion.li
                                    key={item.id}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="show"
                                    exit="exit"
                                    layout
                                    className="flex p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                                  >
                                    <div className="flex items-center mr-4">
                                      <button
                                        onClick={() => handleSelectItem(item.id)}
                                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center
                                          ${selectedItems.has(item.id) 
                                            ? 'border-accent bg-accent text-white' 
                                            : 'border-gray-300'
                                          }`}
                                      >
                                        {selectedItems.has(item.id) && (
                                          <CheckCircleIcon className="h-4 w-4" />
                                        )}
                                      </button>
                                    </div>

                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                                      <img
                                        src={item.imageSrc}
                                        alt={item.name}
                                        className="h-full w-full object-cover object-center"
                                      />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-text-primary dark:text-dark-text-primary">
                                          <h3>{item.name}</h3>
                                          <p className="ml-4">${item.price}</p>
                                        </div>
                                        <p className="mt-1 text-sm text-text-secondary dark:text-dark-text-secondary">
                                          {item.size}
                                        </p>
                                      </div>
                                      <div className="flex flex-1 items-end justify-between text-sm">
                                        <div className="flex items-center gap-3">
                                          <button
                                            className="w-8 h-8 rounded-full bg-secondary/10 hover:bg-secondary/20 flex items-center justify-center disabled:opacity-50"
                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                          >
                                            -
                                          </button>
                                          <span className="w-12 text-center">{item.quantity}</span>
                                          <button
                                            className="w-8 h-8 rounded-full bg-secondary/10 hover:bg-secondary/20 flex items-center justify-center disabled:opacity-50"
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            disabled={item.quantity >= 99}
                                          >
                                            +
                                          </button>
                                        </div>
                                        {quantityError?.itemId === item.id && (
                                          <p className="text-xs text-red-500 mt-1">{quantityError.message}</p>
                                        )}
                                      </div>
                                    </div>
                                  </motion.li>
                                ))}
                              </AnimatePresence>
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {cartItems.length > 0 && (
                      <div className="border-t border-secondary/10 px-4 py-6 sm:px-6 space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-text-secondary">
                            <p>Subtotal ({totalItems} items)</p>
                            <p>${subtotal.toFixed(2)}</p>
                          </div>
                          {savings > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                              <p>Total Savings</p>
                              <p>-${savings.toFixed(2)}</p>
                            </div>
                          )}
                          <div className="flex justify-between text-lg font-bold text-text-primary">
                            <p>Total</p>
                            <p>${(subtotal - savings).toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="mt-6">
                          <Button
                            href="/checkout"
                            variant="primary"
                            fullWidth
                            onClick={() => setIsCartOpen(false)}
                          >
                            Proceed to Checkout
                          </Button>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-text-secondary">
                          <button
                            type="button"
                            className="font-medium text-accent hover:text-accent-dark"
                            onClick={() => setIsCartOpen(false)}
                          >
                            Continue Shopping
                          </button>
                        </div>
                      </div>
                    )}
                </Dialog.Panel>
              </Transition.Child>
                  </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Confirmation Dialog for Bulk Remove */}
      <Transition appear show={showConfirmDialog} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowConfirmDialog(false)}>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-background p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center gap-3 text-warning">
                  <ExclamationTriangleIcon className="h-6 w-6" />
                  <Dialog.Title className="text-lg font-medium">
                    Remove Selected Items?
                  </Dialog.Title>
                </div>

                <p className="mt-4 text-text-secondary">
                  Are you sure you want to remove {selectedItems.size} selected items from your cart?
                  This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    className="px-4 py-2 rounded-lg text-text-primary bg-secondary/10 hover:bg-secondary/20"
                    onClick={() => setShowConfirmDialog(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600"
                    onClick={confirmBulkRemove}
                  >
                    Remove Items
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
} 