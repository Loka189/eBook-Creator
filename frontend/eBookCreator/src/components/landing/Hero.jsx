import React from "react";
import { ArrowRight, Sparkles, BookOpen, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Hero = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative bg-gradient-to-br from-violet-50 via-white to-purple-50 overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-violet-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      {/* Added bottom floating accent */}
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-100/30 rounded-full blur-3xl translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="max-w-xl space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-violet-100 shadow-sm">
              <Sparkles className="h-4 w-4 text-violet-500" />
              <span className="text-sm font-medium text-violet-900">
                AI-Powered Publishing
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
              Create Stunning{" "}
              <span className="block mt-2 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-500 bg-clip-text text-transparent">
                eBooks in minutes
              </span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              From idea to publication, our AI-driven platform simplifies every
              step of eBook creation.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                className="group inline-flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-200"
                to={isAuthenticated ? "/dashboard" : "/login"}
              >
                <span>Start Creating for Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              <a
                href="#demo"
                className="inline-flex items-center space-x-2 text-gray-700 hover:text-violet-500 font-medium transition-colors duration-200"
              >
                <span>Watch Demo</span>
                <span className="text-violet-600">→</span>
              </a>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Books Created</div>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div>
                <div className="text-2xl font-bold text-gray-900">4.8/5</div>
                <div className="text-sm text-gray-600">User Rating</div>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div>
                <div className="text-2xl font-bold text-gray-900">10min</div>
                <div className="text-sm text-gray-600">Avg. Creation Time</div>
              </div>
            </div>
          </div>

          {/* Right image preview */}
          <div className="relative lg:pl-8">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl opacity-20 blur-2xl"></div>

              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                {/* Dummy image added */}
                <img
                  className="w-full h-auto object-cover"
                  src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80"
                  alt="eBook Mockup"
                />

                <div className="absolute top-6 right-6 bg-white rounded-2xl shadow-xl p-4 backdrop-blur-sm border border-gray-100 animate-in fade-in slide-in-from-right duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Processing...</div>
                      <div className="text-sm font-semibold text-gray-900">
                        AI Generation
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 bg-white rounded-2xl shadow-xl p-4 backdrop-blur-sm border border-gray-100 animate-in fade-in slide-in-from-left duration-700 delay-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Completed</div>
                      <div className="text-sm font-semibold text-gray-900">
                        247 Pages
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default Hero;
