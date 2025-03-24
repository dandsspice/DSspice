import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ShoppingCartIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { Switch } from '@headlessui/react';
import Button from '../common/Button';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity } = useCart();
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
    Array.from(selectedItems).forEach(itemId => {
      removeFromCart(itemId);
    });
    setSelectedItems(new Set());
    setSelectAll(false);
    setShowConfirmDialog(false);
  };

  return (
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
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-text-primary dark:text-dark-text-primary">
                          Shopping Cart
                        </Dialog.Title>
                        <button
                          type="button"
                          className="relative -m-2 p-2 text-text-secondary hover:text-text-primary dark:text-dark-text-secondary dark:hover:text-dark-text-primary"
                          onClick={() => setIsCartOpen(false)}
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>

                      {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-96">
                          <ShoppingCartIcon className="h-16 w-16 text-text-secondary dark:text-dark-text-secondary mb-4" />
                          <p className="text-text-secondary dark:text-dark-text-secondary">
                            Your cart is empty
                          </p>
                        </div>
                      ) : (
                        <div className="mt-8">
                          <div className="mt-4 flex items-center justify-between">
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
                              <span className="text-xs sm:text-sm text-text-primary">Select All</span>
                            </div>
                            {selectedItems.size > 0 && (
                              <button
                                onClick={handleBulkRemove}
                                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-50 text-xs sm:text-sm text-red-500 hover:text-red-600"
                              >
                                <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">Remove Selected</span>
                                <span className="sm:hidden">Remove ({selectedItems.size})</span>
                              </button>
                            )}
                          </div>
                          <div className="flow-root">
                            <ul className="-my-6 divide-y divide-secondary/10">
                              {cartItems.map((item) => (
                                <motion.li
                                  key={item.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  className="flex py-6"
                                >
                                  <div className="flex items-start gap-4">
                                    <button
                                      onClick={() => handleSelectItem(item.id)}
                                      className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center
                                        ${selectedItems.has(item.id) 
                                          ? 'border-accent bg-accent text-white' 
                                          : 'border-gray-300'
                                        }`}
                                    >
                                      {selectedItems.has(item.id) && (
                                        <CheckCircleIcon className="h-4 w-4" />
                                      )}
                                    </button>
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
                                        <div className="flex items-center gap-2">
                                          <button
                                            className="text-accent hover:text-accent-dark"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                          >
                                            -
                                          </button>
                                          <span className="text-text-primary dark:text-dark-text-primary">
                                            Qty {item.quantity}
                                          </span>
                                          <button
                                            className="text-accent hover:text-accent-dark"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                          >
                                            +
                                          </button>
                                        </div>
                                        <button
                                          type="button"
                                          className="font-medium text-accent hover:text-accent-dark"
                                          onClick={() => removeFromCart(item.id)}
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>

                    {cartItems.length > 0 && (
                      <div className="border-t border-secondary/10 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-text-primary dark:text-dark-text-primary">
                          <p>Subtotal</p>
                          <p>${subtotal.toFixed(2)}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-text-secondary dark:text-dark-text-secondary">
                          Shipping and taxes calculated at checkout.
                        </p>
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
                        <div className="mt-6 flex justify-center text-center text-sm text-text-secondary dark:text-dark-text-secondary">
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
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>

      <Transition appear show={showConfirmDialog} as={Fragment}>
        <Dialog as="div" className="relative z-[60]" onClose={() => setShowConfirmDialog(false)}>
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

                <p className="mt-4 text-sm text-text-secondary">
                  Are you sure you want to remove {selectedItems.size} selected items from your cart?
                  This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    className="px-4 py-2 rounded-lg text-sm text-text-primary bg-secondary/10 hover:bg-secondary/20"
                    onClick={() => setShowConfirmDialog(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg text-sm text-white bg-red-500 hover:bg-red-600"
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
    </Transition.Root>
  );
} 