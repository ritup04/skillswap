import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Search, 
  Star, 
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
      icon: <Users className="w-6 h-6" />,
      title: 'Exchange Skills',
      description: 'Request skill swaps and connect with people who can help you learn.'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Rate & Review',
      description: 'Build trust through ratings and reviews after completing swaps.'
    },
    {
      icon: <Users className="w-6 h-6" />,
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
    <div className="space-y-16 transition-colors duration-300">
      {/* Hero Section */}
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="main-card flex flex-col md:flex-row items-center gap-10 w-full bg-light-card dark:bg-dark-card shadow-card rounded-3xl transition-colors duration-300">
          {/* Left: Text Content */}
          <div className="flex-1 flex flex-col items-start justify-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-light-primary dark:text-dark-primary leading-tight transition-colors duration-300">
              Exchange Skills, <br /> <span className="text-light-accent dark:text-dark-accent">Learn Together</span>
            </h1>
            <p className="text-lg text-light-muted dark:text-dark-muted max-w-md transition-colors duration-300">
              Connect with people who have the skills you want to learn, and offer your expertise in return. Build meaningful relationships while expanding your knowledge.
            </p>
            <Link to={isAuthenticated ? "/browse" : "/register"} className="btn btn-primary text-lg px-8 py-3 inline-flex items-center justify-center">
              {isAuthenticated ? "Browse Skills" : "Get Started"}
            </Link>
            <div className="flex space-x-4 mt-4">
              <button className="text-light-primary dark:text-dark-primary hover:text-light-accent dark:hover:text-dark-accent text-2xl transition-colors" aria-label="Community"><Users className="w-6 h-6" /></button>
              <button className="text-light-primary dark:text-dark-primary hover:text-light-accent dark:hover:text-dark-accent text-2xl transition-colors" aria-label="Featured"><Star className="w-6 h-6" /></button>
              <button className="text-light-primary dark:text-dark-primary hover:text-light-accent dark:hover:text-dark-accent text-2xl transition-colors" aria-label="Resources"><BookOpen className="w-6 h-6" /></button>
            </div>
          </div>
          {/* Right: Illustration */}
          <div className="flex-1 flex items-center justify-center">
            <img src="/hero-illustration.png" alt="Hero Illustration" className="w-72 h-72 object-contain rounded-3xl shadow-card-lg transition-colors duration-300" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-light-card/80 dark:bg-dark-card/80 rounded-lg shadow-lg animate-fade-in transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-light-primary dark:text-dark-primary mb-12 transition-colors duration-300">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center animate-slide-up">
                <div className="w-16 h-16 bg-light-accent dark:bg-dark-accent rounded-full flex items-center justify-center mx-auto mb-4 text-light-primary dark:text-dark-primary shadow-md transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-light-primary dark:text-dark-primary mb-2 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-light-muted dark:text-dark-muted transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Skills Section */}
      <section className="py-16 animate-fade-in transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-light-primary dark:text-dark-primary mb-12 transition-colors">
            Popular Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center">
            {popularSkills.map((skill, index) => (
              <div key={index} className="card text-center hover:shadow-xl transition-shadow animate-slide-up flex flex-col items-center w-full max-w-xs transition-colors">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3 bg-light-accent dark:bg-dark-accent text-light-primary dark:text-dark-primary shadow-md mx-auto transition-colors">
                  {skill.icon}
                </div>
                <h3 className="font-semibold text-light-primary dark:text-dark-primary text-lg mt-2 transition-colors">{skill.name}</h3>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/browse" className="btn btn-primary text-lg px-8 py-3 inline-flex items-center justify-center">
              Explore All Skills
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-light-primary dark:bg-dark-primary rounded-lg text-white text-center animate-fade-in mt-16 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of people who are already exchanging skills and building connections.
          </p>
          {!isAuthenticated && (
            <div className="flex justify-center">
              <Link to="/register" className="btn bg-white text-light-primary dark:text-dark-primary hover:bg-light-accent dark:hover:bg-dark-accent text-lg px-8 py-3 inline-flex items-center justify-center transition-colors">
                Create Your Profile
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;