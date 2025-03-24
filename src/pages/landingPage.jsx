'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useTheme } from '../context/ThemeContext'
import landingPageData from '../data/landingPageData'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  fadeInUp, 
  staggerContainer, 
  fadeInScale,
  slideInFromLeft,
  slideInFromRight,
  scaleUp
} from '../animations/variants'
import { 
  AnimatedButton, 
  AnimatedCard, 
  AnimatedImage,
  AnimatedText,
  AnimatedSection
} from '../components/animated/AnimatedComponents'
import Button from '../components/common/Button'

// Enhanced gradient overlay with better opacity
const GradientOverlay = () => (
  <div className="absolute inset-0 bg-gradient-to-b from-black/100 via-black/40 to-transparent" />
);

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { darkMode } = useTheme()
  const aboutRef = useRef(null)
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const scrollToSection = (elementRef) => {
    elementRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const navigation = landingPageData.navigation.links.map(item => ({
    ...item,
    action: item.href === '/' 
      ? () => window.scrollTo({ top: 0, behavior: 'smooth' })
      : item.href === '#about' 
      ? () => scrollToSection(aboutRef)
      : null
  }))

  return (
    <div className={``}>
      {/* Enhanced Header with Better Mobile Experience */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <nav className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${
          darkMode ? 'bg-dark-background/90' : 'bg-background/90'
        } backdrop-blur-md border-b border-secondary/10`}>
          <div className="flex h-16 items-center justify-between">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <img
                src="images/spicy-logo.png"
                alt="D&Sspice Logo"
                className="h-10 w-auto"
              />
          </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    if (item.action) {
                      e.preventDefault()
                      item.action()
                    }
                  }}
                  className="text-sm font-medium transition-colors duration-200 hover:text-accent"
                >
                {item.name}
              </a>
            ))}
          </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <AnimatedButton
                href="/#"
                className="hidden md:block px-4 py-2 rounded-full bg-secondary text-primary font-medium transition-all duration-200 hover:bg-secondary-light hover:shadow-lg"
            >
              Order Now
              </AnimatedButton>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <Dialog
        as="div"
        className="fixed inset-0 z-50 lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        {/* Background overlay */}
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        
        {/* Panel */}
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background dark:bg-dark-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-secondary/10">
            <div className="flex items-center justify-between">
                <img
              src="images/spicy-logo.png"
                  alt="D&Sspice Logo"
                  className="h-8 w-auto"
                />
              <button
                type="button"
              className="-m-2.5 rounded-md p-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-secondary/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                    onClick={(e) => {
                      if (item.action) {
                        e.preventDefault();
                        item.action();
                      }
                      setMobileMenuOpen(false);
                    }}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-secondary/10"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                  href="/#"
                  className="block px-4 py-2 text-center rounded-full bg-secondary text-primary font-medium transition-all duration-200 hover:bg-secondary-light hover:shadow-lg"
                  >
                    Order Now
                  </a>
                </div>
              </div>
            </div>
        </Dialog.Panel>
        </Dialog>

      {/* Enhanced Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center">
        <AnimatedImage
          src={landingPageData.hero.backgroundImage}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <GradientOverlay />
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8"
          >
            <AnimatedText>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                {landingPageData.hero.title}
              </h1>
            </AnimatedText>
            <AnimatedText delay={0.2}>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                {landingPageData.hero.subtitle}
              </p>
            </AnimatedText>
            <AnimatedText delay={0.4}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  href="/order"
                  variant="primary"
                  size="large"
                  fullWidth
                >
                  Order Now
                </Button>
                <Button
                  
                  href="#learn-more"
                  variant="outline"
                  size="large"
                  fullWidth
                >
                  Learn More
                </Button>
              </div>
            </AnimatedText>
          </motion.div>
        </div>
            </div>

      {/* Enhanced Features Section */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Choose D&Sspice?
            </h2>
            <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
              Experience the authentic taste of tradition with our premium products
            </p>
          </AnimatedText>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {landingPageData.features.items.map((feature, index) => (
              <AnimatedCard key={feature.title}>
                <div className="group relative overflow-hidden rounded-2xl">
                  <AnimatedImage
                    src={feature.imageSrc}
                    alt={feature.imageAlt}
                    className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent" />
                  <div className="absolute bottom-0 p-6 sm:p-8 z-10">
                    <h3 className="text-2xl font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-white/90 text-lg">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <AnimatedSection
        ref={aboutRef}
        id="about"
        className="py-20 sm:py-32 bg-background-alt"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              variants={slideInFromLeft}
              className="relative aspect-square rounded-2xl overflow-hidden"
            >
              <img
                src={landingPageData.about.imageSrc}
                alt="About D&Sspice"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </motion.div>

            <motion.div variants={slideInFromRight}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {landingPageData.about.title}
              </h2>
              <div className="space-y-6">
                <p className="text-lg text-text-secondary">
                  {landingPageData.about.description}
                </p>
                <p className="text-lg font-medium italic text-accent">
                  {landingPageData.about.mission}
                </p>
              </div>

              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {landingPageData.about.values.map((value) => (
                  <div
                    key={value.title}
                    className="p-6 rounded-xl bg-background shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="text-3xl text-accent mb-4">{value.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-text-secondary">{value.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Enhanced Testimonials Section */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              What Our Customers Say
            </h2>
            <div className="mt-4 w-20 h-1 bg-accent mx-auto"></div>
          </AnimatedText>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {landingPageData.testimonials.items.map((testimonial, index) => (
              <AnimatedCard key={index}>
                <div className="p-8 rounded-2xl bg-background-alt">
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={testimonial.imageSrc}
                      alt={testimonial.author}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-text-secondary">Verified Customer</div>
                    </div>
                  </div>
                  <p className="text-lg italic">"{testimonial.quote}"</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <AnimatedSection className="py-20 sm:py-32 bg-background-alt">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience Authentic Flavor?
          </h2>
          <p className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust D&Sspice for their authentic
            locust bean needs. Limited stock available!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              href="/order"
              variant="primary"
              size="large"
              fullWidth
            >
              Order Now
            </Button>
            <Button
              href="/contact"
              variant="outline"
              size="large"
              fullWidth
            >
              Contact Us
            </Button>
            </div>
        </div>
      </AnimatedSection>

      {/*  Footer */}
        <footer className="bg-background border-t border-secondary/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-text-secondary">
            <p>&copy; {new Date().getFullYear()} D&Sspice. All rights reserved.</p>
            </div>
          </div>
        </footer>
    </div>
  )
}




