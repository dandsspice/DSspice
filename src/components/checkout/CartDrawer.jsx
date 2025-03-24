import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
    </Transition.Root>
  );
} 