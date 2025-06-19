import React from 'react';
import { BeakerIcon, CodeBracketIcon, ShieldCheckIcon, UserGroupIcon, BookOpenIcon } from '@heroicons/react/24/outline';

const Info = () => {
  return (
    <div className="min-h-screen bg-[#333333] text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9A48D0] to-[#B288C0] text-center mb-16">
          Application Information
        </h1>

        {/* Key Features Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-8 flex items-center gap-3">
            <BeakerIcon className="h-8 w-8 text-purple-400" />
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Code Snippets Management",
                description: "Secure storage and organization of code snippets with syntax highlighting",
                icon: <CodeBracketIcon className="h-6 w-6 text-[#9A48D0]" />
              },
              {
                title: "Smart Tagging System",
                description: "Custom metadata tagging for efficient code organization",
                icon: <BookOpenIcon className="h-6 w-6 text-[#9A48D0]" />
              },
              {
                title: "Data Security",
                description: "Military-grade encryption and access management",
                icon: <ShieldCheckIcon className="h-6 w-6 text-[#9A48D0]" />
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-xl hover:bg-gray-750 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-medium">{feature.title}</h3>
                </div>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Development Team Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-8 flex items-center gap-3">
            <UserGroupIcon className="h-8 w-8 text-purple-400" />
            Development Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800 p-6 rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-[#9A48D0] flex items-center justify-center">
                    <span className="font-medium">YD</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">Yacine DJADEL</h3>
                    <p className="text-purple-400">Full Stack Developer</p>
                  </div>
                </div>
                <p className="text-gray-400 mb-2">Expert in end-to-end web development and system architecture</p>
                <a href="mailto:djadel.vfc@gmail.com" className="text-[#B288C0] hover:text-[#9A48D0] transition-colors">
                  djadel.vfc@gmail.com
                </a>
              </div>
          </div>
        </section>

        {/* Legal Compliance Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-8 flex items-center gap-3">
            <ShieldCheckIcon className="h-8 w-8 text-purple-400" />
            Compliance & Data Protection
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-medium mb-4">GDPR Compliance</h3>
              <p className="text-gray-400">
                We fully comply with the General Data Protection Regulation (GDPR):
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li className="text-gray-400">Right to access and rectification</li>
                <li className="text-gray-400">Data portability</li>
                <li className="text-gray-400">Right to erasure upon request</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-medium mb-4">Data Retention Policy</h3>
              <p className="text-gray-400">
                User data is retained for a maximum period of 2 years after last activity.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-medium mb-4">Security Measures</h3>
              <p className="text-gray-400">
                AES-256 encryption for sensitive data<br/>
                Daily backups<br/>
                Annual security audits
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Info;