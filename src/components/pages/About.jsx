import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Globe, Heart } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: <Users className="h-8 w-8" />, number: "50+", label: "Expert Developers" },
    { icon: <Award className="h-8 w-8" />, number: "200+", label: "Projects Completed" },
    { icon: <Globe className="h-8 w-8" />, number: "25+", label: "Countries Served" },
    { icon: <Heart className="h-8 w-8" />, number: "98%", label: "Client Satisfaction" }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      description: "Visionary leader with 15+ years in tech innovation"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      description: "Full-stack architect specializing in scalable solutions"
    },
    {
      name: "Emily Rodriguez",
      role: "Lead Designer",
      description: "Creative genius crafting beautiful user experiences"
    }
  ];

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About <span className="gradient-text">IdeaQLabs</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            We're a passionate team of innovators, creators and problem-solvers dedicated to building the future of technology.
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="glass-effect p-12 rounded-3xl">
            <h2 className="text-4xl font-bold text-center mb-8">
              Our <span className="text-yellow-400">Story</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-slate-300 mb-6">
                  Founded in 2025, IdeaQLabs emerged from a simple belief: technology should empower, not complicate. Our journey began in a small home with two passionate developers who shared a vision of creating software that truly makes a difference.
                </p>
                <p className="text-lg text-slate-300">
                  Today, we've grown into a dynamic team of 20+ professionals, but our core values remain unchanged. We believe in innovation, quality, and the transformative power of well-crafted software solutions.
                </p>
              </div>
              <div className="relative">
                <img 
                  className="rounded-2xl shadow-2xl hover-glow" 
                  alt="Team working together in modern office"
                 src="https://images.unsplash.com/photo-1565841327798-694bc2074762" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-center mb-12">
            Our <span className="text-sky-400">Impact</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center glass-effect p-6 rounded-2xl hover-glow"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-yellow-400 mb-4 flex justify-center">{stat.icon}</div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-slate-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-center mb-12">
            Meet Our <span className="gradient-text">Leadership</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="glass-effect p-8 rounded-2xl text-center hover-glow"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-sky-400" 
                  alt={`${member.name} - ${member.role}`}
                 src="https://images.unsplash.com/photo-1657663119025-71c8cd9d6539" />
                <h3 className="text-2xl font-semibold text-white mb-2">{member.name}</h3>
                <p className="text-yellow-400 font-medium mb-4">{member.role}</p>
                <p className="text-slate-300">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;
