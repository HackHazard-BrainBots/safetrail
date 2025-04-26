import React, { useState } from 'react';
import './ItineraryPlanner.css';

function ItineraryPlanner() {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState(3);
  const [interests, setInterests] = useState('');
  const [budget, setBudget] = useState('medium');
  const [travelStyle, setTravelStyle] = useState('balanced');
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Replace with your actual GROQ API key (in a real app, use environment variables)
  const GROQ_API_KEY = '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';

  const generateItinerary = async () => {
    if (!destination) {
      setError('Please enter a destination');
      return;
    }
    
    setLoading(true);
    setError(null);
    setItinerary(null);
    
    try {
      const prompt = `Act as an expert local travel guide for ${destination}. Create a detailed ${duration}-day itinerary with these specifications:
      
      Traveler Preferences:
      - Interests: ${interests || 'general sightseeing'}
      - Budget: ${budget}
      - Travel style: ${travelStyle}
      
      Required Details for Each Day:
      1. Morning, afternoon, and evening activities with time allocations
      2. Specific transportation details between locations
      3. Restaurant recommendations with price ranges
      4. Must-see attractions and hidden gems
      5. Google Maps links for key locations (format as [Location Name](https://maps.google.com?q=Location+Name))
      6. Estimated costs for activities/meals
      7. Local tips and cultural notes
      
      Format the response with clear daily sections using markdown. Include exact names, addresses, and practical details.`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [
            {
              role: 'system',
              content: 'You are a professional travel planner with deep local knowledge. Provide detailed, practical itineraries with exact information travelers need.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('No itinerary content received');
      }

      const generatedContent = data.choices[0].message.content;
      
      setItinerary({
        raw: generatedContent,
        formatted: formatItinerary(generatedContent)
      });
    } catch (error) {
      console.error('Error generating itinerary:', error);
      setError(error.message || 'Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatItinerary = (rawText) => {
    try {
      const days = rawText.split(/(?=## Day \d+)/).filter(day => day.trim());
      return days.map(dayText => {
        const dayMatch = dayText.match(/## Day (\d+)/);
        const dayNumber = dayMatch ? parseInt(dayMatch[1]) : 1;
        const content = dayText.replace(/## Day \d+\n?/, '');
        
        // Enhanced link processing for Google Maps
        const processedContent = content
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
            // Convert to Google Maps URL if not already
            const isGoogleMaps = url.includes('maps.google.com') || url.includes('goo.gl/maps');
            const mapsUrl = isGoogleMaps ? url : `https://maps.google.com?q=${encodeURIComponent(text)}`;
            return `<a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="map-link">${text} <svg class="map-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>`;
          })
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\n/g, '<br />');
        
        return {
          day: dayNumber,
          content: processedContent
        };
      });
    } catch (e) {
      console.error('Error formatting itinerary:', e);
      return [{
        day: 1,
        content: rawText.replace(/\n/g, '<br />')
      }];
    }
  };

  return (
    <div className="itinerary-planner">
      <h2>
        <svg className="title-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        Plan Your Perfect Trip
      </h2>
      <div className="planner-form">
        <div className="form-group">
          <label>
            <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Destination:
          </label>
          <input 
            type="text" 
            value={destination} 
            onChange={(e) => setDestination(e.target.value)} 
            placeholder="Where do you want to go?"
            required
          />
        </div>
        
        <div className="form-group">
          <label>
            <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Duration (days):
          </label>
          <input 
            type="number" 
            min="1" 
            max="30" 
            value={duration} 
            onChange={(e) => setDuration(parseInt(e.target.value))}
          />
        </div>
        
        <div className="form-group">
          <label>
            <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            Interests (optional):
          </label>
          <input 
            type="text" 
            value={interests} 
            onChange={(e) => setInterests(e.target.value)} 
            placeholder="e.g., hiking, museums, food"
          />
        </div>

        <div className="form-group">
          <label>
            <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            Budget:
          </label>
          <select value={budget} onChange={(e) => setBudget(e.target.value)}>
            <option value="low">Budget</option>
            <option value="medium">Mid-range</option>
            <option value="high">Luxury</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            Travel Style:
          </label>
          <select value={travelStyle} onChange={(e) => setTravelStyle(e.target.value)}>
            <option value="fast-paced">Fast-paced</option>
            <option value="balanced">Balanced</option>
            <option value="relaxed">Relaxed</option>
          </select>
        </div>
        
        <button onClick={generateItinerary} disabled={loading || !destination}>
          {loading ? (
            <>
              <svg className="button-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="button-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21v-4m0 0V7a2 2 0 0 1 2-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 0 0-2 2zm9-13.5V9"></path>
              </svg>
              Generate Itinerary
            </>
          )}
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {itinerary && (
        <div className="itinerary-results">
          <h3>
            <svg className="result-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            Your {duration}-Day {destination} Itinerary
          </h3>
          
          <div className="itinerary-days">
            {itinerary.formatted.map((day, index) => (
              <div key={index} className="itinerary-day">
                <h4>
                  <svg className="day-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Day {day.day}
                </h4>
                <div 
                  className="day-content" 
                  dangerouslySetInnerHTML={{ __html: day.content }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ItineraryPlanner;