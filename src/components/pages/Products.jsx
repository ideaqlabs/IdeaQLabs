import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Globe, Database, Shield, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Products = () => {
  const products = [
    {
      icon: <Smartphone className="h-12 w-12" />,
      title: "CloudSync Pro",
      category: "Mobile Solutions",
      description: "Revolutionary mobile app development platform with real-time synchronization and offline capabilities.",
      features: ["Cross-platform compatibility", "Real-time data sync", "Offline-first architecture", "Advanced analytics"],
      price: "Starting at $299/month"
    },
    {
      icon: <Globe className="h-12 w-12" />,
      title: "WebForge Enterprise",
      category: "Web Development",
      description: "Complete web application framework for building scalable, high-performance enterprise solutions.",
      features: ["Microservices architecture", "Auto-scaling infrastructure", "Built-in security", "API management"],
      price: "Starting at $499/month"
    },
    {
      icon: <Database className="h-12 w-12" />,
      title: "DataVault AI",
      category: "Data Analytics",
      description: "Intelligent data management and analytics platform powered by machine learning algorithms.",
      features: ["AI-powered insights", "Real-time processing", "Custom dashboards", "Predictive analytics"],
      price: "Starting at $799/month"
    },
    {
      icon: <Shield className="h-12 w-12" />,
      title: "SecureGuard Suite",
      category: "Cybersecurity",
      description: "Comprehensive cybersecurity solution protecting your digital assets with advanced threat detection.",
      features: ["24/7 monitoring", "Threat intelligence", "Incident response", "Compliance reporting"],
      price: "Starting at $399/month"
    },
    {
      icon: <Zap className="h-12 w-12" />,
      title: "AutoFlow Studio",
      category: "Automation",
      description: "Workflow automation platform that streamlines business processes and increases productivity.",
      features: ["Visual workflow builder", "API integrations", "Custom triggers", "Performance metrics"],
      price: "Starting at $199/month"
    },
    {
      icon: <Users className="h-12 w-12" />,
      title: "TeamConnect Hub",
      category: "Collaboration",
      description: "All-in-one collaboration platform designed for modern distributed teams and remote work.",
      features: ["Video conferencing", "Project management", "File sharing", "Team analytics"],
      price: "Starting at $149/month"
    }
  ];

  const handleLearnMore = (productTitle) => {
    toast({
      title: `🚧 ${productTitle} details aren't implemented yet—but don't worry! You can request it in your next prompt! 🚀`
    });
  };

  const handleGetDemo = (productTitle) => {
    toast({
      title: `🚧 ${productTitle} demo isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀`
    });
  };

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
            Our <span className="gradient-text">Products</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Discover our comprehensive suite of innovative software solutions designed to transform your business operations and drive growth.
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid lg:grid-cols-2 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={index}
                className="glass-effect p-8 rounded-2xl hover-glow"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="text-sky-400">{product.icon}</div>
                  <span className="text-yellow-400 text-sm font-medium bg-yellow-400/20 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">{product.title}</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">{product.description}</p>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-yellow-400 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-slate-300">
                        <span className="text-sky-400 mr-3">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">{product.price}</span>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleLearnMore(product.title)}
                      className="border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-slate-900"
                    >
                      Learn More
                    </Button>
                    <Button
                      onClick={() => handleGetDemo(product.title)}
                      className="bg-gradient-to-r from-sky-500 to-yellow-500 hover:from-sky-600 hover:to-yellow-600 text-slate-900 font-semibold"
                    >
                      Get Demo
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Custom Solutions CTA */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="glass-effect p-12 rounded-3xl text-center">
            <h2 className="text-4xl font-bold mb-6">
              Need Something <span className="text-yellow-400">Custom</span>?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Our products are just the beginning. We specialize in creating bespoke solutions tailored to your unique business requirements and challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => handleGetDemo("Custom Solution")}
                className="bg-gradient-to-r from-sky-500 to-yellow-500 hover:from-sky-600 hover:to-yellow-600 text-slate-900 font-semibold px-8 py-3 text-lg"
              >
                Discuss Custom Solution
              </Button>
              <Button
                variant="outline"
                onClick={() => handleLearnMore("Enterprise Solutions")}
                className="border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-slate-900 px-8 py-3 text-lg"
              >
                Enterprise Solutions
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Products;
