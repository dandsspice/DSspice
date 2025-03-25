import { useState } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Button from '../components/common/Button';
import BackButton from '../components/common/BackButton';
import { fadeInUp } from '../animations/variants';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1000);
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton />
        </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
            Contact Us
          </h1>
          <p className="text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you!
          </p>
          </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="space-y-8"
          >
            <h2 className="text-xl font-semibold text-text-primary dark:text-dark-text-primary mb-6">
              Get in Touch
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <EnvelopeIcon className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="text-md font-medium text-text-primary dark:text-dark-text-primary">
                    Email
                  </h3>
                  <a 
                    href="mailto:info@dsspice.com"
                    className="text-accent hover:underline"
                  >
                    info@dsspice.com
                  </a>
        </div>
      </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <PhoneIcon className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="text-md font-medium text-text-primary dark:text-dark-text-primary">
                    Phone
                  </h3>
                  <a 
                    href="tel:+441234567890"
                    className="text-accent hover:underline"
                  >
                    +44 123 456 7890
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <MapPinIcon className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="text-md font-medium text-text-primary dark:text-dark-text-primary">
                    Address
                  </h3>
                  <p className="text-text-secondary dark:text-dark-text-secondary">
                    123 Spice Street<br />
                    London, UK
                  </p>
                </div>
              </div>
        </div>

            <div className="pt-6">
              <h3 className="text-md font-medium text-text-primary dark:text-dark-text-primary mb-3">
                Business Hours
              </h3>
              <p className="text-text-secondary dark:text-dark-text-secondary">
                Monday - Friday: 9am - 5pm<br />
                Saturday: 10am - 2pm<br />
                Sunday: Closed
              </p>
            </div>
          </motion.div>
          
          {/* Contact Form */}
            <motion.div 
            variants={fadeInUp}
              initial="initial"
            animate="animate"
            className="bg-background-alt dark:bg-dark-background-alt p-6 rounded-lg"
          >
            <h2 className="text-xl font-semibold text-text-primary dark:text-dark-text-primary mb-6">
              Send us a Message
                </h2>
            
            {isSubmitted ? (
              <div className="text-center p-6 bg-accent/10 rounded-lg">
                <svg 
                  className="w-12 h-12 text-accent mx-auto mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <h3 className="text-lg font-medium text-text-primary dark:text-dark-text-primary mb-2">
                  Thank You!
                </h3>
                <p className="text-text-secondary dark:text-dark-text-secondary">
                  Your message has been sent. We'll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                  <label 
                    htmlFor="name"
                    className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1"
                  >
                    Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-secondary/20 bg-background dark:bg-dark-background focus:ring-2 focus:ring-accent"
                  />
                    </div>
                    
                    <div>
                  <label 
                    htmlFor="email"
                    className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1"
                  >
                    Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-secondary/20 bg-background dark:bg-dark-background focus:ring-2 focus:ring-accent"
                  />
                  </div>
                  
                  <div>
                  <label 
                    htmlFor="message"
                    className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1"
                  >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                    onChange={handleChange}
                    required
                      rows="5"
                    className="w-full px-4 py-2 rounded-lg border border-secondary/20 bg-background dark:bg-dark-background focus:ring-2 focus:ring-accent"
                    ></textarea>
                  </div>
                  
                <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                    isLoading={isSubmitting}
                    >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
                      </div>
                    </div>
    </div>
  );
} 