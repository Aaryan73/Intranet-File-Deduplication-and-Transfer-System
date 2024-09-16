import React from 'react';
import { MdRefresh, MdBarChart, MdLock, MdBuild, MdShield } from 'react-icons/md';

interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const features: Feature[] = [
  {
    icon: <MdRefresh className="w-6 h-6" />,
    title: "Fast Refresh",
    desc: "Instantly refresh your data views to catch duplicate downloads as they happen, ensuring your analysis is always up-to-date."
  },
  {
    icon: <MdBarChart className="w-6 h-6" />,
    title: "Analytics",
    desc: "Gain insights into your data download patterns with comprehensive analytics that highlight potential duplication issues."
  },
  {
    icon: <MdLock className="w-6 h-6" />,
    title: "Datacenter Security",
    desc: "Ensure the security of your data with robust measures that prevent unauthorized access and maintain data integrity."
  },
  {
    icon: <MdBuild className="w-6 h-6" />,
    title: "Build on Your Terms",
    desc: "Customize and configure your duplication alert system to fit your specific needs and workflows without constraints."
  },
  {
    icon: <MdShield className="w-6 h-6" />,
    title: "Safe to Use",
    desc: "Our system is designed with safety in mind, reducing the risk of false positives and ensuring reliable duplication detection."
  },
  {
    icon: <MdBuild className="w-6 h-6" />, // You can choose different icons as needed
    title: "Flexible",
    desc: "Adapt and scale the system to accommodate various data sources and sizes, ensuring comprehensive coverage for your duplication needs."
  }
];

const FeatureSection: React.FC = () => {
  return (
    <section className="py-14 mt-20" id='features'>
      <div className="max-w-screen-xl mx-auto px-4 text-center text-gray-200 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-gray-100 text-3xl font-semibold sm:text-4xl">
            How it works
          </h3>
          <p className="mt-3">
            Our Data Download Duplication Alert System (DDAS) is designed to monitor, detect, and alert you to any potential data download duplications.
          </p>
        </div>
        <div className="mt-12">
          <ul className="grid gap-y-8 gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item, idx) => (
              <li key={idx} className="space-y-3">
                <div className="w-12 h-12 mx-auto bg-gray-800 border border-gray-700 text-indigo-600 rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
                <h4 className="text-lg text-gray-200 font-semibold">
                  {item.title}
                </h4>
                <p>
                  {item.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
