import React from "react";
import { FEATURES } from "../../utils/data";

const Features = () => {
    return (
        <div
            id="features"
            className="relative py-24 lg:py-32 bg-white overflow-hidden"
        >
            {/* Header Section */}
            <div className="text-center mb-20 space-y-6">
                <div className="inline-flex items-center space-x-2 bg-violet-100 px-4 py-2 rounded-full">
                    <span className="w-2 h-2 bg-violet-600 rounded-full animate-pulse"></span>
                    <span className="text-sm font-semibold text-violet-900">
                        Features
                    </span>
                </div>

                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
                    Everything You Need to{" "}
                    <span className="block mt-2 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                        Create Your eBook
                    </span>
                </h2>

                <p className="text-base text-gray-600 max-w-2xl mx-auto">
                    Our platform offers a comprehensive suite of features designed to
                    streamline your eBook creation process, from AI-powered writing
                    assistance to seamless publishing tools.
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-8">
                {FEATURES.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <div
                            key={index}
                            className="group relative bg-white p-8 rounded-2xl border border-gray-200 hover:border-violet-500 shadow-sm hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/0 to-purple-50/0 group-hover:from-violet-50/50 group-hover:to-purple-50/30 rounded-2xl transition-all duration-200"></div>
                            <div className="relative space-y-4">
                                <div
                                    className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                >
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-violet-900 transition-all duration-100">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                    );
                })}
            </div>

            {/* CTA Section */}
            <div className="text-center mt-16">
                <p className="text-gray-600 mb-6">
                    Ready to get started?
                </p>
                <a
                    href="/signup"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-200"
                >
                    <span>Start Creating Today</span>
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5-5 5M6 12h12"
                        />
                    </svg>
                </a>
            </div>


        </div>
    );
};

export default Features;
