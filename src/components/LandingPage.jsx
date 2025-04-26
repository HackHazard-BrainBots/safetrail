import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import { getReviewsByDestination, getAverageRating } from '../utils/reviewUtils';
import { FaFacebook, FaInstagram, FaTwitter, FaStar, FaRegStar, FaArrowRight, FaMountain, FaUmbrellaBeach, FaMonument, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleStartJourney = () => {
    setShowAuthModal(true);
  };

  const popularDestinations = [
    { 
      id: 1, 
      name: 'Shimla', 
      image: 'https://img.freepik.com/free-photo/high-angle-shot-wooden-house-surrounded-by-forested-mountain-covered-snow-winter_181624-10162.jpg?t=st=1745487906~exp=1745491506~hmac=3d82c6f9933b1567fb66ecacce9be938c7976f93eddd890adbf77cae37a6ada7&w=1380',
      description: 'The Queen of Hills'
    },
    { 
      id: 2, 
      name: 'Manali', 
      image: 'https://img.freepik.com/free-photo/train-runs-through-beautiful-landscape-swiss-alps_181624-37124.jpg?t=st=1745487806~exp=1745491406~hmac=645010ec0d3b2c8ca99a1388801e4a318e45d0f59276ef9e9bef164af93ef658&w=1380',
      description: 'A Paradise for Honeymooners'
    },
    { 
      id: 3, 
      name: 'Dharamshala', 
      image: 'https://img.freepik.com/free-photo/small-hut-with-red-roof-is-front-mountain_505751-5862.jpg?t=st=1745488045~exp=1745491645~hmac=0efc0d3ff0148f820fadab0476f08d014e603225198220fd2f10d1eb7e3fd55c&w=1060',
      description: 'The Little Lhasa'
    },
    { 
      id: 4, 
      name: 'Kullu', 
      image: 'https://img.freepik.com/premium-photo/local-houses-kasol-village-india_78361-22648.jpg?w=1380',
      description: 'The Valley of Gods'
    },
    {
      id:5,
      name:'Ladakh',
      image:'https://img.freepik.com/free-photo/snowy-mountain-peaks-against-blue-sky_9975-32891.jpg?t=st=1745488163~exp=1745491763~hmac=e8fa94adb8e7d3dc573d1af40267bd8c33be4e8d4355ac2b8286b8786a1d4e01&w=1380',
      description:'The Roof of the World'
    },
    {
      id:6,
      name:'Goa',
      image:'https://img.freepik.com/free-photo/landscape-tropical-vacation-palm-summer_1203-5352.jpg?t=st=1745488193~exp=1745491793~hmac=e6532ef4032b63a18d0af8b6ce83acae26922a1bb7b5c2460d7da01c7927bca1&w=1380',
      description:'The Beach Paradise'
    }
  ];

  const reviews = [
    {
      id: 1,
      rating: 4.5,
    }
  ];

  const userReviews = [
    {
      id: 1,
      rating: 5,
      text: "SafeTrail made my Himalayan trek unforgettable. The booking was seamless and the guides were exceptional!",
      reviewer: "Priya Sharma",
      destination: "Shimla"
    },
    {
      id: 2,
      rating: 4,
      text: "Great experience overall. The app helped me discover hidden gems in Goa I would have never found on my own.",
      reviewer: "Raj Patel",
      destination: "Manali"
    },
    {
      id: 3,
      rating: 5,
      text: "The cultural tours in Rajasthan were amazing. SafeTrail's local experts really brought the history to life.",
      reviewer: "Ananya Gupta",
      destination: "Dharamshala"
    }
  ];

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Explore the Wonders of India with SafeTrail
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            From the snow-capped Himalayas to the serene beaches of Goa, experience
            the diversity and beauty of India like never before.
          </motion.p>
          <motion.button 
            className="explore-button" 
            onClick={handleStartJourney}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Start Your Journey <FaArrowRight style={{ marginLeft: '8px' }} />
          </motion.button>
        </div>
      </motion.section>

      {/* Popular Destinations Section */}
      <motion.section 
        className="popular-destinations"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={fadeIn}
      >
        <div className="section-container">
          <motion.h2 variants={slideUp}>Popular Destinations</motion.h2>
          <motion.div 
            className="destinations-grid"
            variants={staggerContainer}
          >
            {popularDestinations.map((destination, index) => (
              <motion.div 
                key={destination.id} 
                className="destination-card"
                variants={slideUp}
                whileHover={{ y: -10 }}
                transition={{ delay: index * 0.1 }}
              >
                <img 
                  src={destination.image} 
                  alt={destination.name} 
                  className="destination-image"
                />
                <div className="destination-info">
                  <h3>{destination.name}</h3>
                  <p className="destination-description">{destination.description}</p>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      i < (getAverageRating(destination.name) || 5) ? 
                      <FaStar key={i} /> : <FaRegStar key={i} />
                    ))}
                    <span>({getReviewsByDestination(destination.name).length || 0} reviews)</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Reviews Section */}
      <motion.section 
        className="reviews-section"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={fadeIn}
      >
        <div className="section-container">
          <motion.h2 variants={slideUp}>What Our Travelers Say</motion.h2>
          <motion.div 
            className="reviews-grid"
            variants={staggerContainer}
          >
            {userReviews.map((review, index) => (
              <motion.div 
                key={review.id} 
                className="review-card"
                variants={slideUp}
                whileHover={{ scale: 1.03 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="review-content">
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      i < review.rating ? 
                      <FaStar key={i} /> : <FaRegStar key={i} />
                    ))}
                  </div>
                  <p className="review-text">"{review.text}"</p>
                  <div className="reviewer">- {review.reviewer}</div>
                  <div className="review-destination">{review.destination}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section 
        className="about"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={fadeIn}
      >
        <div className="section-container">
          <motion.h2 variants={slideUp} className="gradient-heading">About SafeTrails</motion.h2>
          <motion.div className="about-content" variants={slideUp}>
            <p>
              SafeTrail is your ultimate travel companion for exploring India's hidden treasures.
              Whether you're looking for adventure, tranquility, or cultural immersion, SafeTrail is here
              to make your journey unforgettable.
            </p>
            <div className="about-features">
              <motion.div 
                className="feature"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <FaMountain size={24} />
                <span>Adventure Tours</span>
              </motion.div>
              <motion.div 
                className="feature"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <FaUmbrellaBeach size={24} />
                <span>Beach Getaways</span>
              </motion.div>
              <motion.div 
                className="feature"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <FaMonument size={24} />
                <span>Cultural Experiences</span>
              </motion.div>
              <motion.div 
                className="feature"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <FaLock size={24} />
                <span>Blockchain Secured Platform</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer Section */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="footer-container">
          <p>© 2025 SafeTrails. All rights reserved.</p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <FaFacebook size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <FaTwitter size={20} />
            </a>
          </div>
        </div>
      </motion.footer>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}

export default LandingPage;