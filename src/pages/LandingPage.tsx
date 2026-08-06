import React from 'react';
import LoadingScreen from '../components/LoadingScreen';
import ScrollProgress from '../components/ScrollProgress';
import BackToTop from '../components/BackToTop';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Academics from '../components/Academics';
import NewsAgenda from '../components/NewsAgenda';
import GalleryFacilities from '../components/GalleryFacilities';
import CTAContact from '../components/CTAContact';
import Footer from '../components/Footer';

export default function LandingPage() {
 return (
 <>
 <LoadingScreen />
 <ScrollProgress />
 <Header />
 
 <main>
 <Hero />
 <About />
 <Academics />
 <NewsAgenda />
 <GalleryFacilities />
 <CTAContact />
 </main>
 
 <Footer />
 <BackToTop />
 </>
 );
}
