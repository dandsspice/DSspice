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

// Add this gradient overlay component
const GradientOverlay = () => (
  <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/50 to-primary/30" />
);

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { darkMode, toggleDarkMode } = useTheme()
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
    <div className={`bg-background ${darkMode ? 'dark' : ''}`}>
      {/* Animated Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute inset-x-0 top-0 z-50"
      >
        <nav aria-label="Global" className={`flex items-center justify-between p-6 lg:px-8 ${
          darkMode ? 'bg-dark-background/75' : 'bg-background/75'
        } backdrop-blur-sm`}>
          <div className="flex lg:flex-1 items-center gap-4">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">D&Sspice</span>
              <img
                alt="D&Sspice Logo"
                src="/spicy-logo.png"
                className="h-12 w-auto"
              />
            </a>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
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
                className={`text-sm/6 font-semibold ${
                  darkMode 
                    ? 'text-dark-text-primary hover:text-dark-accent' 
                    : 'text-text-primary hover:text-accent'
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4 lg:flex-1 lg:justify-end">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full flex items-center justify-center ${
                darkMode 
                  ? 'bg-dark-background-alt text-dark-text-primary hover:bg-dark-secondary/10' 
                  : 'bg-background-alt text-text-primary hover:bg-secondary/10'
              }`}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <a
              href="#"
              className={`hidden lg:block text-sm/6 font-semibold ${
                darkMode 
                  ? 'text-dark-text-primary hover:text-dark-accent'
                  : 'text-text-primary hover:text-accent'
              }`}
            >
              Live Chat
            </a>
            <a
              href="/order"
              className={`hidden lg:block rounded-md px-3.5 py-2 text-sm font-semibold shadow-sm ${
                darkMode
                  ? 'bg-dark-secondary text-dark-primary hover:bg-dark-secondary-light'
                  : 'bg-secondary text-primary hover:bg-secondary-light'
              }`}
            >
              Order Now
            </a>
            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className={`-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 ${
                  darkMode ? 'text-dark-text-primary' : 'text-text-primary'
                }`}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>
            </div>
          </div>
        </nav>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className={`fixed inset-y-0 right-0 z-50 w-full overflow-y-auto px-6 py-6 sm:max-w-sm sm:ring-1 ${
            darkMode 
              ? 'bg-dark-background sm:ring-dark-secondary/10' 
              : 'bg-background sm:ring-secondary/10'
          }`}>
            <div className="flex items-center justify-between">
              <a href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">D&Sspice</span>
                <img
                  alt="D&Sspice Logo"
                  src="/spicy-logo.png"
                  className="h-8 w-auto"
                />
              </a>
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-full flex items-center justify-center ${
                    darkMode 
                      ? 'bg-dark-background-alt text-dark-text-primary' 
                      : 'bg-background-alt text-text-primary'
                  }`}
                >
                  {darkMode ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-text-primary"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
              </div>
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
                          e.preventDefault()
                          item.action()
                        }
                      }}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-text-primary hover:bg-background-alt"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="/order"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-text-primary hover:bg-background-alt"
                  >
                    Order Now
                  </a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </motion.header>

      {/* Hero Section with Parallax */}
      <motion.div 
            style={{
          opacity: heroOpacity,
          scale: heroScale
        }}
        className="relative min-h-screen"
      >
        <AnimatedImage
          src={landingPageData.hero.backgroundImage}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 pt-32 pb-16 sm:pb-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="text-center"
            >
              <AnimatedText delay={0.2}>
                <h1 className="text-4xl font-bold sm:text-6xl">
                  {landingPageData.hero.title}
                </h1>
              </AnimatedText>
              <AnimatedText delay={0.4}>
                <p className="mt-6 text-lg leading-8">
                  {landingPageData.hero.subtitle}
                </p>
              </AnimatedText>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedText>
            <h2 className="text-3xl font-bold text-center mb-16">
              Why Choose D&Sspice?
            </h2>
          </AnimatedText>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {landingPageData.features.items.map((feature, index) => (
              <AnimatedCard key={feature.title}>
                <div className="relative overflow-hidden rounded-lg">
                  <AnimatedImage
                    src={feature.imageSrc}
                    alt={feature.imageAlt}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-white/80">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <AnimatedSection
        ref={aboutRef}
        id="about"
        variants={staggerContainer}
        className="py-24 sm:py-32 bg-background-alt"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <img
                    src={landingPageData.about.imageSrc}
                    alt="About D&Sspice"
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-secondary/10"></div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-bold tracking-tight text-text-primary dark:text-dark-text-primary sm:text-5xl mb-8">
                  {landingPageData.about.title}
                </h2>
                <div className="space-y-6 text-lg text-text-secondary dark:text-dark-text-secondary">
                  <p>{landingPageData.about.description}</p>
                  <p className="font-medium italic">{landingPageData.about.mission}</p>
                </div>
                <div className="mt-12 grid grid-cols-2 gap-8">
                  {landingPageData.about.values.map((value) => (
                    <div key={value.title} 
                      className="relative p-6 rounded-xl bg-background dark:bg-dark-background shadow-md transition-transform duration-300 hover:-translate-y-1">
                      <div className="text-4xl mb-4">{value.icon}</div>
                      <h3 className="text-lg font-semibold mb-2 text-text-primary dark:text-dark-text-primary">
                        {value.title}
                      </h3>
                      <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                        {value.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonials Section */}
      <AnimatedSection
        variants={staggerContainer}
        className="py-24 sm:py-32 bg-background"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            variants={fadeInUp}
            className="mx-auto max-w-xl text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-5xl mb-4">
              What Our Customers Are Saying
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto"></div>
          </motion.div>
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
            {landingPageData.testimonials.items.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex flex-col justify-between rounded-2xl p-8 transition-transform duration-300 hover:-translate-y-1 bg-background-alt"
              >
                <blockquote className="text-xl italic mb-6 text-text-primary">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-x-4">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={testimonial.imageSrc}
                    alt=""
                  />
                  <div className="text-sm font-semibold text-text-secondary">
                    {testimonial.author}
                  </div>
        </div>
              </motion.div>
            ))}
            </div>
          </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection
        variants={fadeInUp}
        className="relative isolate overflow-hidden bg-background-alt"
      >
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl mb-8">
              Experience the True Taste of Tradition
            </h2>
            <p className="mx-auto max-w-xl text-lg leading-8 mb-10 text-text-secondary">
              Join thousands of satisfied customers who trust D&Sspice for their locust bean needs.
              Stock is limited! Don't miss out—shop now!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
              <a
                href="/products"
                className="w-full sm:w-auto rounded-md bg-secondary px-8 py-4 text-lg font-semibold text-primary hover:bg-secondary-light transition-colors duration-200"
              >
                Order Now
              </a>
              <a
                href="/contact"
                className="w-full sm:w-auto text-lg font-semibold text-text-primary hover:text-accent transition-colors duration-200"
              >
                Contact Us <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-background border-t border-secondary/10"
      >
          <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
            <div className="flex justify-center space-x-6 md:order-2">
          <a href="#" className="text-text-secondary hover:text-accent transition-colors duration-200">
                <span className="sr-only">Facebook</span>
                {/* Add Facebook icon */}
              </a>
            </div>
            <div className="mt-8 md:order-1 md:mt-0">
              <p className="text-center text-sm leading-5 text-text-secondary">
                &copy; {new Date().getFullYear()} D&Sspice. All rights reserved.
              </p>
            </div>
          </div>
      </motion.footer>
    </div>
  )
}




