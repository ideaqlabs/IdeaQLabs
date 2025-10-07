import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Instagram, Mail, Phone } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
const Footer = () => {
  const socialLinks = [{
    icon: <Github className="h-5 w-5" />,
    name: 'GitHub',
    url: '#'
  }, {
    icon: <Twitter className="h-5 w-5" />,
    name: 'Twitter',
    url: 'https://x.com/IdeaQLabs'
  }, {
    icon: <Linkedin className="h-5 w-5" />,
    name: 'LinkedIn',
    url: '#'
  }, {
    icon: <Instagram className="h-5 w-5" />,
    name: 'Instagram',
    url: '#'
  }];
  const quickLinks = ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Support Center', 'Documentation', 'API Reference'];
  const handleSocialClick = platform => {
    toast({
      title: `🚧 ${platform} integration isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀`
    });
  };
  const handleQuickLinkClick = link => {
    toast({
      title: `🚧 ${link} page isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀`
    });
  };
  return <footer className="section-bg border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div className="md:col-span-2" initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            <span className="text-2xl font-bold gradient-text mb-4 block">IdeaQLabs</span>
            <p className="text-slate-300 mb-6 max-w-md">
              Transforming ideas into powerful digital experiences with cutting-edge technology and creative excellence. Building the future, one solution at a time.
            </p>
            <div className="flex items-center space-x-4 text-slate-300">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-sky-400" />
                <span className="text-sm">support@ideaqlabs.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-sky-400" />
                <span className="text-sm">+1</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }}>
            <span className="text-lg font-semibold text-white mb-4 block">Quick Links</span>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => <li key={index}>
                  <button onClick={() => handleQuickLinkClick(link)} className="text-slate-300 hover:text-yellow-400 transition-colors text-sm">
                    {link}
                  </button>
                </li>)}
            </ul>
          </motion.div>

          {/* Social Media */}
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }}>
            <span className="text-lg font-semibold text-white mb-4 block">Follow Us</span>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => <motion.button key={index} onClick={() => handleSocialClick(social.name)} className="p-3 glass-effect rounded-lg hover-glow text-slate-300 hover:text-sky-400 transition-colors" whileHover={{
              scale: 1.1
            }} whileTap={{
              scale: 0.95
            }}>
                  {social.icon}
                </motion.button>)}
            </div>
            <p className="text-slate-400 text-sm mt-4">
              Stay connected for the latest updates and insights from our team.
            </p>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center" initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} transition={{
        duration: 0.6,
        delay: 0.6
      }}>
          <p className="text-slate-400 text-sm">
            © 2024 IdeaQLabs. All rights reserved.
          </p>
          <p className="text-slate-400 text-sm mt-4 md:mt-0">
            Made with ❤️ by the IdeaQLabs team
          </p>
        </motion.div>
      </div>
    </footer>;
};
export default Footer;
