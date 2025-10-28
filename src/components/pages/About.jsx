import React from "react";
import { motion } from "framer-motion";
import { Users, Award, Globe, Heart, Target, Lightbulb, Compass, Star } from "lucide-react";

// ✅ Local images for About Us team
import IshanImg from "@/assets/Ishan.jpeg";
import DeepImg from "@/assets/Deep.jpeg";
import EmilyImg from "@/assets/Emily.jpg";

const AboutAndVision = () => {
  // About Us data
  const stats = [
    { icon: <Users className="h-8 w-8" />, number: "20+", label: "Expert Developers" },
    { icon: <Award className="h-8 w-8" />, number: "50+", label: "Projects Completed" },
    { icon: <Globe className="h-8 w-8" />, number: "15+", label: "Countries Served" },
    { icon: <Heart className="h-8 w-8" />, number: "98%", label: "Client Satisfaction" },
  ];

  const team = [
    {
      name: "Ishan",
      role: "CEO & Founder",
      description: "Young entrepreneur with a vision to create disruption in web3.0 technologies.",
      image: IshanImg,
    },
    {
      name: "Deep",
      role: "CTO & Co-Founder",
      description: "Visionary leader with 15+ years in tech innovation.",
      image: DeepImg,
    },
    {
      name: "Emily",
      role: "Lead Designer",
      description: "Creative genius crafting beautiful user experiences.",
      image: EmilyImg,
    },
  ];

  // Vision data
  const visionPoints = [
    {
      icon: <Target className="h-12 w-12" />,
      title: "Our Mission",
      description:
        "To democratize technology by creating intuitive, powerful software solutions that empower businesses and individuals to achieve their full potential.",
    },
    {
      icon: <Lightbulb className="h-12 w-12" />,
      title: "Innovation First",
      description:
        "We constantly push the boundaries of what's possible, embracing emerging technologies and pioneering new approaches to solve complex challenges.",
    },
    {
      icon: <Compass className="h-12 w-12" />,
      title: "Future-Ready",
      description:
        "Building solutions that not only meet today's needs but anticipate tomorrow's challenges, ensuring our clients stay ahead of the curve.",
    },
    {
      icon: <Star className="h-12 w-12" />,
      title: "Excellence Standard",
      description:
        "Every line of code, every design element, and every user interaction is crafted with meticulous attention to detail and unwavering quality standards.",
    },
  ];

  const values = [
    "Integrity & Transparency",
    "Continuous Learning",
    "Client-Centric Approach",
    "Sustainable Innovation",
    "Collaborative Excellence",
    "Social Responsibility",
  ];

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* ==================== ABOUT US SECTION ==================== */}
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
                  Founded in 2025, IdeaQLabs emerges from a simple belief: Technology should empower, not complicate.
                  Our journey began in a small room with two passionate developers who shared a vision of creating software that truly makes a difference.
                </p>
                <p className="text-lg text-slate-300">
                  Today, we've grown into a dynamic team of 10+ professionals, but our core values remain unchanged.
                  We believe in innovation, quality, and the transformative power of well-crafted software solutions.
                </p>
              </div>
              <div className="relative">
                <img
                  className="rounded-2xl shadow-2xl hover-glow"
                  alt="Team working together in modern office"
                  src="https://images.unsplash.com/photo-1565841327798-694bc2074762"
                />
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
          className="mb-32"
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
                  className="w-28 h-28 rounded-full mx-auto mb-6 border-4 border-sky-400 object-cover"
                  alt={`${member.name} - ${member.role}`}
                  src={member.image}
                />
                <h3 className="text-2xl font-semibold text-white mb-2">{member.name}</h3>
                <p className="text-yellow-400 font-medium mb-4">{member.role}</p>
                <p className="text-slate-300">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ==================== VISION SECTION (directly below About Us) ==================== */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Our <span className="gradient-text">Vision</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Shaping the future of technology through innovation, excellence, and unwavering commitment to our clients' success.
          </p>
        </motion.div>

        {/* Vision Statement */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="glass-effect p-12 rounded-3xl text-center">
            <h2 className="text-4xl font-bold mb-8">
              <span className="text-yellow-400">Transforming</span> Tomorrow, Today
            </h2>
            <p className="text-2xl text-slate-300 leading-relaxed max-w-4xl mx-auto">
              "We envision a world where technology seamlessly integrates with human potential,
              creating solutions that are not just functional, but transformational. Our goal is to be
              the catalyst that turns ambitious ideas into digital realities."
            </p>
          </div>
        </motion.section>

        {/* Vision Points */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid md:grid-cols-2 gap-8">
            {visionPoints.map((point, index) => (
              <motion.div
                key={index}
                className="glass-effect p-8 rounded-2xl hover-glow"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-sky-400 mb-6">{point.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{point.title}</h3>
                <p className="text-slate-300 text-lg leading-relaxed">{point.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Core Values */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-center mb-12">
            Our <span className="text-sky-400">Core Values</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="glass-effect p-6 rounded-xl text-center hover-glow"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-lg font-semibold text-yellow-400">{value}</h3>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Future Goals */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="glass-effect p-12 rounded-3xl">
            <h2 className="text-4xl font-bold text-center mb-8">
              Looking <span className="gradient-text">Ahead</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-yellow-400 mb-6">2025 & Beyond</h3>
                <ul className="space-y-4 text-lg text-slate-300">
                  <li className="flex items-start">
                    <span className="text-sky-400 mr-3">•</span>
                    Expand AI-driven development capabilities
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-400 mr-3">•</span>
                    Launch sustainable tech initiatives
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-400 mr-3">•</span>
                    Establish global development centers
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-400 mr-3">•</span>
                    Pioneer next-generation user experiences
                  </li>
                </ul>
              </div>
              <div className="relative">
                <img
                  className="rounded-2xl shadow-2xl hover-glow"
                  alt="Futuristic technology and innovation concept"
                  src="https://images.unsplash.com/photo-1651505942687-efc26cb528ba"
                />
              </div>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
};

export default AboutAndVision;
