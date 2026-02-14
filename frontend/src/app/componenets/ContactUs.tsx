'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, Leaf, Instagram, Facebook, Youtube, MessageCircle } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactInfo {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  details: string;
}

interface SocialMedia {
  name: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  url: string;
}

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Form submitted:', formData);
    alert('Message sent successfully!');
    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo: ContactInfo[] = [
    {
      icon: MapPin,
      title: 'Visit Our Garment',
      details: '328D/1 Elkaduwa Road, Ukuwela, Matale'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '072 372 5670'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: 'hello@boscoapparel.com'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM'
    }
  ];

  const socialMedia: SocialMedia[] = [
    { name: 'Instagram', icon: Instagram, url: '#' },
    { name: 'Facebook', icon: Facebook, url: '#' },
    { name: 'TikTok', icon: MessageCircle, url: '#' },
    { name: 'YouTube', icon: Youtube, url: '#' }
  ];

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Leaf className="w-5 h-5" style={{ color: 'hsl(142.1, 76.2%, 36.3%)' }} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Bosco Apparel</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Reach out to us for questions about our manufacture,or any other inquiries. We’re here to help and would love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Contact Form - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Send className="w-4 h-4" style={{ color: 'hsl(142.1, 76.2%, 36.3%)' }} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Send Message</h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    placeholder="What's this about?"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
                    placeholder="Tell us more about your inquiry..."
                    required
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90"
                  style={{ backgroundColor: 'hsl(142.1, 76.2%, 36.3%)' }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Contact Info - Takes 1 column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Details */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4" style={{ color: 'hsl(142.1, 76.2%, 36.3%)' }} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Get in Touch</h2>
              </div>
              
              <div className="space-y-2">
                {contactInfo.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-4 h-4" style={{ color: 'hsl(142.1, 76.2%, 36.3%)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.details}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
              <div className="grid grid-cols-4 gap-3">
                {socialMedia.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                    >
                      <IconComponent className="w-4 h-4" style={{ color: 'hsl(142.1, 76.2%, 36.3%)' }} />
                      <span className="text-sm font-medium text-gray-700">{social.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;