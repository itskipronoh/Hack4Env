import React, { useState } from 'react';
import { MessageSquare, Clock, Smartphone, TrendingUp, CheckCircle, MessageCircle, Phone } from 'lucide-react';

const SmsRegistration: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [cropType, setCropType] = useState('');
  const [preferredMethod, setPreferredMethod] = useState('sms');
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Communication Registration:', { phoneNumber, location, cropType, preferredMethod });
    setIsRegistered(true);
  };

  const handleWhatsAppChat = () => {
    const whatsappNumber = '+254712345678'; // EcoSentinel WhatsApp number for Kenya
    const message = encodeURIComponent(
      `Hi EcoSentinel! I'm interested in getting agricultural insights via WhatsApp. My location: ${location || 'Not specified'}, Crop type: ${cropType || 'Not specified'}`
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800/50 p-8 text-center">
            <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Registration Successful!</h2>
            <p className="text-slate-300 mb-6">
              You will now receive timely agronomic {preferredMethod === 'sms' ? 'SMS' : 'WhatsApp'} alerts for your location and crops.
            </p>
            {preferredMethod === 'whatsapp' && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-4">
                <p className="text-green-300 text-sm">
                  🌱 For instant access to EcoSentinel AI, you can also chat directly with our WhatsApp bot at +254712345678
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30 mb-6">
            <MessageSquare className="h-5 w-5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">Free SMS & WhatsApp Alerts</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Register for Agricultural Insights
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Get real-time environmental and agricultural alerts via SMS or WhatsApp delivered directly to your mobile device
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Benefits Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Why Register for Agricultural Alerts?</h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
                <Clock className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-white mb-2">Timely Information</h3>
                  <p className="text-slate-300 text-sm">
                    Receive real-time weather updates, pest alerts, disease warnings, and optimal planting/harvesting recommendations delivered instantly via SMS or WhatsApp.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
                <Smartphone className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-white mb-2">Maximum Convenience</h3>
                  <p className="text-slate-300 text-sm">
                    Access critical agricultural information anywhere, anytime. Messages remain available for reference even when you're working in remote field locations.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
                <TrendingUp className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-white mb-2">Expert Crop Management</h3>
                  <p className="text-slate-300 text-sm">
                    Receive professional guidance on irrigation schedules, fertilization timing, integrated pest management, and sustainable farming practices.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-green-500/20 rounded-xl border border-green-500/30">
                <MessageSquare className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-white mb-2">WhatsApp Integration</h3>
                  <p className="text-slate-300 text-sm">
                    Chat directly with EcoSentinel AI on WhatsApp (+254712345678) for instant agricultural insights, weather updates, and personalized farming advice.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800/50 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Register Now</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Communication Method Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Preferred Communication Method *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center p-4 bg-slate-800/30 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors">
                    <input
                      type="radio"
                      name="method"
                      value="sms"
                      checked={preferredMethod === 'sms'}
                      onChange={(e) => setPreferredMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${preferredMethod === 'sms' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-500'}`}>
                      {preferredMethod === 'sms' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                    </div>
                    <MessageSquare className="h-5 w-5 text-emerald-400 mr-3" />
                    <div>
                      <span className="text-white font-medium">SMS Alerts</span>
                      <p className="text-slate-400 text-xs">Traditional text messages</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 bg-slate-800/30 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors">
                    <input
                      type="radio"
                      name="method"
                      value="whatsapp"
                      checked={preferredMethod === 'whatsapp'}
                      onChange={(e) => setPreferredMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${preferredMethod === 'whatsapp' ? 'border-green-500 bg-green-500' : 'border-slate-500'}`}>
                      {preferredMethod === 'whatsapp' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                    </div>
                    <MessageSquare className="h-5 w-5 text-green-400 mr-3" />
                    <div>
                      <span className="text-white font-medium">WhatsApp</span>
                      <p className="text-slate-400 text-xs">Interactive AI assistant</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+254 7XX XXX XXX (Kenya format)"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
                <p className="text-slate-400 text-xs mt-1">Enter your Kenyan mobile number with country code</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Location/County *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Nairobi, Mombasa, Nakuru, Kisumu"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Primary Crop Type
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  title="Select your primary crop type"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select crop type</option>
                  <option value="maize">Maize</option>
                  <option value="beans">Beans</option>
                  <option value="coffee">Coffee</option>
                  <option value="tea">Tea</option>
                  <option value="potatoes">Potatoes</option>
                  <option value="tomatoes">Tomatoes</option>
                  <option value="sugarcane">Sugarcane</option>
                  <option value="rice">Rice</option>
                  <option value="wheat">Wheat</option>
                  <option value="vegetables">Mixed Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* WhatsApp Quick Access */}
              {preferredMethod === 'whatsapp' && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <MessageSquare className="h-5 w-5 text-green-400" />
                    <span className="text-green-400 font-medium">Instant WhatsApp Access</span>
                  </div>
                  <p className="text-slate-300 text-sm mb-3">
                    Start chatting with EcoSentinel AI immediately for personalized agricultural advice!
                  </p>
                  <button
                    type="button"
                    onClick={handleWhatsAppChat}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    💬 Chat on WhatsApp (+254712345678)
                  </button>
                </div>
              )}

              <button
                type="submit"
                className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                  preferredMethod === 'whatsapp' 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white'
                }`}
              >
                Register for Free {preferredMethod === 'whatsapp' ? 'WhatsApp' : 'SMS'} Alerts
              </button>
            </form>

            <p className="text-xs text-slate-400 mt-4 text-center">
              By registering, you agree to receive {preferredMethod === 'whatsapp' ? 'WhatsApp messages' : 'SMS notifications'}. 
              {preferredMethod === 'sms' && ' Standard message rates may apply.'}
              {preferredMethod === 'whatsapp' && ' WhatsApp data charges may apply.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmsRegistration;