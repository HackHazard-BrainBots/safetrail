export const generateReviewHash = (reviewData) => {
    // Simple hash generation - in a real app, you might use a more secure method
    const str = JSON.stringify(reviewData);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  };
  
  export const getReviewsByDestination = (destination) => {
    const reviews = JSON.parse(localStorage.getItem('travelReviews')) || [];
    return reviews.filter(review => review.destination === destination);
  };
  
  export const getAverageRating = (destination) => {
    const reviews = getReviewsByDestination(destination);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };