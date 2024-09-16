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
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec congue, nisl eget molestie varius, enim ex faucibus purus."
  },
  {
    icon: <MdBarChart className="w-6 h-6" />,
    title: "Analytics",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec congue, nisl eget molestie varius, enim ex faucibus purus."
  },
  {
    icon: <MdLock className="w-6 h-6" />,
    title: "Datacenter security",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec congue, nisl eget molestie varius, enim ex faucibus purus."
  },
  {
    icon: <MdBuild className="w-6 h-6" />,
    title: "Build on your terms",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec congue, nisl eget molestie varius, enim ex faucibus purus."
  },
  {
    icon: <MdShield className="w-6 h-6" />,
    title: "Safe to use",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec congue, nisl eget molestie varius, enim ex faucibus purus."
  },
  {
    icon: <MdBuild className="w-6 h-6" />, // You can choose different icons as needed
    title: "Flexible",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec congue, nisl eget molestie varius, enim ex faucibus purus."
  }
];

const FeatureSection: React.FC = () => {
  return (
    <section className="py-14" id='features'>
      <div className="max-w-screen-xl mx-auto px-4 text-center text-gray-200 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-gray-100 text-3xl font-semibold sm:text-4xl">
            How it works
          </h3>
          <p className="mt-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec congue, nisl eget molestie varius, enim ex faucibus purus.
          </p>
        </div>
        <div className="mt-12">
          <ul className="grid gap-y-8 gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item, idx) => (
              <li key={idx} className="space-y-3">
                <div className="w-12 h-12 mx-auto bg-gay-800 border border-gray-700 text-indigo-600 rounded-full flex items-center justify-center">
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
