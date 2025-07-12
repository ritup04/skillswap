import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Search, 
  ArrowRight,
  Code,
  Palette,
  Music,
  Camera,
  BookOpen
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Find Skills',
      description: 'Browse through thousands of skills offered by our community members.'
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Exchange Skills',
      description: 'Request skill swaps and connect with people who can help you learn.'
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Rate & Review',
      description: 'Build trust through ratings and reviews after completing swaps.'
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Build Community',
      description: 'Join a community of learners and teachers from around the world.'
    }
  ];

  const popularSkills = [
    { name: 'JavaScript', icon: <Code className="w-5 h-5" />, color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Photoshop', icon: <Palette className="w-5 h-5" />, color: 'bg-blue-100 text-blue-800' },
    { name: 'Guitar', icon: <Music className="w-5 h-5" />, color: 'bg-green-100 text-green-800' },
    { name: 'Photography', icon: <Camera className="w-5 h-5" />, color: 'bg-purple-100 text-purple-800' },
    { name: 'Spanish', icon: <BookOpen className="w-5 h-5" />, color: 'bg-red-100 text-red-800' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="min-h-[75vh] flex items-center justify-center">
          {/* Left: Text Content */}
          <div className="flex-1 flex flex-col items-start justify-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Exchange Skills, <br /> <span className="text-[#5D3C64]">Learn Together</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-md">
              Connect with people who have the skills you want to learn, and offer your expertise in return. Build meaningful relationships while expanding your knowledge.
            </p>
            <Link 
              to={isAuthenticated ? "/browse" : "/register"} 
              className="bg-[#5D3C64] hover:bg-[#4A2F4F] text-white font-semibold text-lg px-8 py-3 rounded-xl inline-flex items-center justify-center transition-colors duration-200 shadow-md"
            >
              {isAuthenticated ? "Browse Skills" : "Get Started"}
            </Link>
          </div>
          {/* Right: Illustration */}
          <div className="flex-1 flex items-center justify-center">
            <img src="/hero-illustration.png" alt="Hero Illustration" className="w-[28rem] h-[28rem] object-contain rounded-3xl shadow-lg" />
          </div>
        </div>

        {/* Features Section */}
        <section className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-[#5D3C64] rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-md">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Skills Section */}
        <section className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Popular Skills
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center">
              {popularSkills.map((skill, index) => (
                <div key={index} className="text-center hover:shadow-lg transition-shadow duration-200 flex flex-col items-center w-full max-w-xs p-4 rounded-xl">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3 bg-[#5D3C64] text-white shadow-md mx-auto">
                    {skill.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mt-2">{skill.name}</h3>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link 
                to="/browse" 
                className="bg-[#5D3C64] hover:bg-[#4A2F4F] text-white font-semibold text-lg px-8 py-3 rounded-xl inline-flex items-center justify-center transition-colors duration-200 shadow-md"
              >
                Explore All Skills
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#5D3C64] rounded-3xl text-white text-center p-8 md:p-12 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of people who are already exchanging skills and building connections.
            </p>
            {!isAuthenticated && (
              <div className="flex justify-center">
                <Link 
                  to="/register" 
                  className="bg-white text-[#5D3C64] hover:bg-gray-50 font-semibold text-lg px-8 py-3 rounded-xl inline-flex items-center justify-center transition-colors duration-200 shadow-md"
                >
                  Create Your Profile
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;