'use client'

import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, ChevronDownIcon, SparklesIcon, FireIcon, BoltIcon, TruckIcon } from '@heroicons/react/24/outline'
import { useTheme } from '../context/ThemeContext'
import landingPageData from '../data/landingPageData'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
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
import ScrollIndicator from '../components/common/ScrollIndicator'
import { Link, useLocation } from 'react-router-dom'

// Gradient overlay with better opacity
const GradientOverlay = () => (
  <div className={`absolute inset-0 bg-gradient-to-b from-secondary/100 bg-secondary/40 to-transparent -mt-20`}/>
);

// Icon mapping for features
const featureIcons = {
  SparklesIcon: SparklesIcon,
  FireIcon: FireIcon,
  BoltIcon: BoltIcon,
  TruckIcon: TruckIcon,
};

const PixelImage = ({ src, alt, className = '', style = {} }) => (
  <motion.img
    src={src}
    alt={alt}
    className={`object-cover shadow-2xl border-4 border-white dark:border-dark-background cursor-pointer transition-all duration-300 ${className}`}
    style={{ imageRendering: 'pixelated', ...style }}
    whileHover={{ scale: 1.12, rotate: [0, 4, -4, 0], boxShadow: '0 12px 40px 0 rgba(34,197,94,0.25)' }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: 'spring', stiffness: 180, damping: 14 }}
    whileFocus={{ scale: 1.07 }}
  />
);

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { darkMode } = useTheme()
  const aboutRef = useRef(null)
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const location = useLocation();

  // Add ref for about section visibility
  const aboutInViewRef = useRef(null);
  const isAboutInView = useInView(aboutInViewRef, { once: true });

  // smooth scroll function
  const scrollToSection = (elementRef) => {
    const yOffset = -80; // Header height
    const element = elementRef.current;
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  };

  const navigation = landingPageData.navigation.links.map(item => ({
    ...item,
    action: item.to === '/' 
      ? () => window.scrollTo({ top: 0, behavior: 'smooth' })
      : item.to === '#about' 
      ? () => scrollToSection(aboutRef)
      : null
  }))

  useEffect(() => {
    // Check if we have a section to scroll to and if to scroll
    if (location.state?.scrollTo && location.state?.shouldScroll) {
      // Small delay to ensure the page has loaded
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          const yOffset = -80;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
        // Clear the state after scrolling
        window.history.replaceState({}, document.title);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [location.state]);

  return (
    <div>
     

      {/* Enhanced Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Mobile: show background image, Desktop: show gradient+pattern */}
        <div className="absolute inset-0 w-full h-full">
          {/* Mobile background image */}
          <AnimatedImage
            src={landingPageData.hero.backgroundImage}
            alt="Hero background"
            className="block md:hidden w-full h-full object-cover"
          />
          {/* Desktop: hero-bg.jpg with dark overlay, then gradient+pattern */}
          <div className="hidden md:block w-full h-full absolute inset-0">
            {/* Hero background image */}
            <img
              src="/images/hero-bg.jpg"
              alt="Hero background desktop"
              className="w-full h-full object-cover absolute inset-0 z-0"
              style={{ opacity: 0.55 }}
            />
            {/* Black overlay to darken image */}
            <div className="absolute inset-0 bg-black opacity-40 z-10" />
            {/* Subtle pattern overlay (SVG dots) */}
            <svg className="absolute inset-0 w-full h-full opacity-10 z-30" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 400 400">
              <defs>
                <pattern id="hero-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="2" fill="currentColor" className="text-accent dark:text-accent-light" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-dots)" />
            </svg>
          </div>
        </div>
        <GradientOverlay/>
        {/* Desktop layout: text left, pixel images right */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center h-full px-4 sm:px-6 lg:px-8">
          {/* Left: Text and actions */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center text-center md:text-left space-y-8">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-8"
            >
              <AnimatedText>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white  dark:text-dark-text-primary leading-tight">
                  {landingPageData.hero.title}
                </h1>
              </AnimatedText>
              <AnimatedText delay={0.2}>
                <p className="text-lg md:text-xl text-white max-w-2xl mx-auto md:mx-0">
                  {landingPageData.hero.subtitle}
                </p>
              </AnimatedText>
              <AnimatedText delay={0.4}>
                <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-4">
                  <Link
                    to="/order"
                    className="w-full sm:w-auto"
                  >
                    <Button
                      variant="primary"
                      size="large"
                      fullWidth={true}
                      className='bg-secondary-light text-white border-1 border-white'
                    >
                      Order Now
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto text-secondary bg-white"
                    size="large"
                    fullWidth={true}
                    onClick={() => scrollToSection(aboutRef)}
                  >
                    Learn More
                  </Button>
                </div>
              </AnimatedText>
            </motion.div>
            {/* Scroll indicator only on mobile */}
            <div className="block md:hidden">
              <ScrollIndicator onClick={() => scrollToSection(aboutRef)} />
            </div>
          </div>
          {/* Right: Overlapping, styled, animated pixel images (desktop only) */}
          <div className="hidden md:flex w-1/2 zoom-1 h-full items-center justify-center relative -mt-100">
            {/* Creative overlapping layout */}
            <PixelImage src="/images/products/Dried-locust-beans-250g.jpg" alt="Pixel 1" className="absolute left-8 top-1 w-56 h-56 z-30 rounded-3xl rotate-3" style={{ zIndex: 30 }} />
            <PixelImage src="/images\products\Dried-locust-beans-150g.jpg" alt="Pixel 2" className="absolute left-40 top-32 w-44 h-44 z-40 rounded-full -rotate-6" style={{ zIndex: 50 }} />
            <PixelImage src="/images/products/Dried-locust-beans-150g-2.jpg" alt="Pixel 3" className="absolute left-15 top-64 w-50 h-50 z-10 rounded-2xl rotate-12" style={{ zIndex: 10 }} />
            <PixelImage src="/images/products/Dried-locust-beans.jpg" alt="Pixel 4" className="absolute left-70 top-16 w-52 h-90 z-30 rounded-xl -rotate-2" style={{ zIndex: 40 }} />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="lg:py-20 relative overflow-hidden bg-gradient-to-b from-violet-100 to-purple-200 ">
        {/* Patterned and gradient background (pattern at top, fade down) */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Subtle pattern using SVG at the top */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 400 400">
            <defs>
              <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="currentColor" className="text-accent" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
          {/* Fading gradient overlay: fade from background at top to transparent at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/0 via-background/60 to-background/80 dark:from-dark-background/0 dark:via-dark-background/60 dark:to-dark-background/80" />
        </div>
        {/* Gradient blend to about section, animated on scroll */}
        <motion.div
          style={{ y: 0 }}
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          className="absolute bottom-0 left-0 w-full h-32 z-10 pointer-events-none"
        >
          <div className="w-full h-full bg-gradient-to-b from-transparent to-background dark:to-dark-background transition-all duration-700" />
        </motion.div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Choose D&Sspice?
            </h2>
            <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
              Experience the authentic taste of tradition with our premium products
            </p>
          </AnimatedText>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {landingPageData.features.items.map((feature, index) => {
              const Icon = featureIcons[feature.icon];
              return (
                <AnimatedCard
                  key={feature.title}
                  className="overflow-hidden rounded-2xl shadow-xl border border-white/20 backdrop-blur-lg bg-gradient-to-br from-white/70 to-white/30 dark:from-dark-background/70 dark:to-dark-background/30 flex flex-col max-w-md mx-auto"
                >
                  <AnimatedImage
                    src={feature.imageSrc}
                    alt={feature.imageAlt}
                    className="w-full h-56 object-cover"
                  />
                  <div className="flex items-center gap-3 -mt-7 px-4 sm:px-6">
                    {Icon && (
                      <div className="rounded-full bg-accent/60 p-2 shadow-md border border-accent">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    )}
                    
                  </div>
                  <div className="p-4 sm:p-6 bg-white/60 dark:bg-dark-background/60  items-center rounded-b-2xl">
                  <h3 className="text-2xl font-semibold text-text-primary dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-text-secondary dark:text-dark-text-secondary text-left">
                      {feature.description}
                    </p>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>
      {/* End Features Section */}


      {/*  About Section with improved visibility animation */}
     <section id='about'>
     <AnimatedSection
        ref={aboutRef}
        id="about"
        className="py-20 sm:py-32 bg-background-alt relative"
      >
        <motion.div
          ref={aboutInViewRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Accent border at the bottom, not top */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isAboutInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="absolute bottom-0 left-0 w-full h-1 bg-accent origin-left"
          />

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
        </motion.div>
      </AnimatedSection>
     </section>
      {/*  End About Section with improved visibility animation */}


      {/* Testimonials Section */}
      <section className="py-20 sm:py-32 relative overflow-hidden">
        {/* Vintage background image with opacity */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/vintage-bg.jpg"
            alt="Vintage background"
            className="w-full h-full object-cover opacity-20"
            style={{ objectPosition: 'center' }}
          />
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-white/60 dark:bg-dark-background/70" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText className="text-center mb-16">
            <h2 className="text-xl md:text-4xl font-bold">
              What Our Customers Say
            </h2>
            <div className="mt-4 w-20 h-1 bg-accent mx-auto"></div>
          </AnimatedText>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {landingPageData.testimonials.items.map((testimonial, index) => (
              <AnimatedCard key={index}
                className="group overflow-hidden rounded-2xl shadow-xl border border-white/30 bg-white/40 dark:bg-dark-background/40 backdrop-blur-lg transition-all duration-300 hover:shadow-2xl hover:border-accent/60 relative"
               
              >
                {/* Animated border overlay for liquid effect */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-accent/70 group-hover:animate-pulse-glass z-10 transition-all duration-500" style={{borderImage: 'linear-gradient(120deg, #a78bfa 0%, #f472b6 100%) 1'}} />
                <div className="relative z-20 p-8 rounded-2xl bg-background-alt/60 backdrop-blur-md">
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
      {/*End Testimonials Section */}


      {/* Enhanced CTA Section */}
      <AnimatedSection className="relative py-20 sm:py-32 bg-background-alt">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/vintage-bg.jpg"
            alt="Vintage background"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center' }}
          />
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-black/60 dark:bg-dark-background/70" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Experience Authentic Flavor?
          </h2>
          <p className="text-lg text-white mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust D&Sspice for their authentic
            locust bean needs. Limited stock available!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/order"
              className="w-full sm:w-auto"
            >
              <Button
                variant="primary"
                size="large"
                fullWidth
                className='text-whites'
              >
                Order Now
              </Button>
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                size="large"
                className='text-white'
                fullWidth
              >
                Contact Us
              </Button>
            </Link>
            </div>
        </div>
      </AnimatedSection>

      {/*  Footer */}
        {/* <footer className="bg-background border-t border-secondary/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-text-secondary">
            <p>&copy; {new Date().getFullYear()} D&Sspice. All rights reserved.</p>
            </div>
          </div>
        </footer> */}
    </div>
  )
}




