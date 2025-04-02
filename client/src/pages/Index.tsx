
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, PieChart, Shield, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <motion.section 
        className="relative pt-64 pb-20 overflow-hidden"
        initial="initial"
        animate="animate"
        variants={staggerChildren}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex flex-col items-center justify-center text-center mb-16"
            variants={fadeIn}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-6"
              variants={fadeIn}
            >
              DocuClaim Genius
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 max-w-2xl mb-8"
              variants={fadeIn}
            >
              Transform your medical claims process with AI-powered automation. Upload invoices and let our intelligent system extract all the important information instantly.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={fadeIn}
            >
              <Button asChild size="lg" className="group">
                <Link to="/login">
                  Get Started <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/register">Create Account</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
            variants={staggerChildren}
          >
            <motion.div variants={fadeIn}>
              <FeatureCard 
                icon={<FileText className="h-12 w-12 text-primary" />}
                title="Intelligent Document Processing"
                description="Our AI extracts key information from medical invoices automatically, saving you hours of manual work."
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <FeatureCard 
                icon={<PieChart className="h-12 w-12 text-primary" />}
                title="Claims Dashboard"
                description="Track all your processed claims in one place with a beautiful, easy-to-use dashboard."
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <FeatureCard 
                icon={<Shield className="h-12 w-12 text-primary" />}
                title="Secure & Private"
                description="Your medical data is always protected with enterprise-grade security and encryption."
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our simple 3-step process makes medical claims processing faster and more accurate than ever before.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              number="1"
              title="Upload Document"
              description="Simply upload your medical invoice in PDF or image format through our secure interface."
            />
            <StepCard 
              number="2"
              title="AI Processing"
              description="Our advanced AI extracts patient details, diagnosis codes, treatment information, and cost data."
            />
            <StepCard 
              number="3"
              title="Review & Submit"
              description="Verify the extracted information and submit your claim with a single click."
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Stethoscope className="h-12 w-12 text-primary mx-auto mb-6" />
            <blockquote className="text-2xl font-medium text-gray-700 mb-6">
              "DocuClaim Genius has revolutionized how our clinic handles insurance claims. What used to take hours now takes minutes."
            </blockquote>
            <div className="font-medium">
              <cite className="not-italic text-primary">Dr. Sarah Johnson</cite>
              <p className="text-gray-500">Healthcare Administrator</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to streamline your medical claims process?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">Join thousands of healthcare providers who have simplified their workflow with DocuClaim Genius.</p>
          <Button asChild size="lg" variant="secondary" className="font-medium">
            <Link to="/register">Get Started For Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="flex items-center text-xl font-bold text-white mb-4">
                <FileText className="mr-2 h-5 w-5" /> DocuClaim Genius
              </h3>
              <p className="max-w-xs text-gray-400">AI-powered medical claims processing that saves time and reduces errors.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-white font-medium mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Testimonials</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Support</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                </ul>
              </div>
            </div>
          </div>
          <Separator className="bg-gray-700 my-8" />
          <div className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} DocuClaim Genius. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <CardHeader>
      <div className="mb-4">{icon}</div>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-base">{description}</CardDescription>
    </CardContent>
  </Card>
);

// Step Card Component
const StepCard = ({ number, title, description }) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mb-4">
      {number}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Index;
