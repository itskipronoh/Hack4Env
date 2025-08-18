import React, { useState } from 'react';
import { MessageSquare, Clock, Smartphone, TrendingUp, CheckCircle } from 'lucide-react';

const SmsRegistration: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [cropType, setCropType] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('SMS Registration:', { phoneNumber, location, cropType });
    setIsRegistered(true);
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800/50 p-8 text-center">
            <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Registration Successful!</h2>
            <p className="text-slate-300">
              You will now receive timely agronomic SMS alerts for your location and crops.
            </p>
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
            <span className="text-emerald-400 font-medium">Free SMS Alerts</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Register for Free Agronomic SMS
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Get real-time environmental and agricultural alerts delivered directly to your mobile device
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Benefits Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Why Register for SMS Alerts?</h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
                <Clock className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-white mb-2">Timely Information</h3>
                  <p className="text-slate-300 text-sm">
                    Receive real-time weather updates, pest alerts, disease warnings, and optimal planting/harvesting recommendations delivered instantly to your phone.
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
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800/50 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Register Now</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Location/Region *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your farming location"
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
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select crop type</option>
                  <option value="cereals">Cereals (Rice, Wheat, Corn)</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="legumes">Legumes</option>
                  <option value="cash-crops">Cash Crops</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105"
              >
                Register for Free SMS Alerts
              </button>
            </form>

            <p className="text-xs text-slate-400 mt-4 text-center">
              By registering, you agree to receive SMS notifications. Standard message rates may apply.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmsRegistration;