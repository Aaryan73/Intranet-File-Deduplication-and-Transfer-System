import React from 'react';
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import { HiExternalLink } from 'react-icons/hi';

// Define the shape of each contact method
interface ContactMethod {
  icon: React.ReactNode;
  title: string;
  desc: string;
  link: {
    name: string;
    href: string;
  };
}

// Array of contact methods with React Icons
const contactMethods: ContactMethod[] = [
  {
    icon: <FaDiscord className="w-6 h-6" />,
    title: "Join our community",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    link: {
      name: "Join our Discord",
      href: "https://discord.com"  // Example URL
    },
  },
  {
    icon: <FaTwitter className="w-6 h-6" />,
    title: "Follow us on Twitter",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    link: {
      name: "Send us DMs",
      href: "https://twitter.com"  // Example URL
    },
  },
];

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-14  text-gray-300">
      <div className="max-w-screen-xl mx-auto px-4 text-gray-300 gap-12 md:px-8 lg:flex">
        <div className="max-w-md">
          <h3 className=" text-3xl font-semibold sm:text-4xl text-gray-100">
            Let’s connect
          </h3>
          <p className="mt-3">
            We’re here to help and answer any questions you might have. We look forward to hearing from you.
          </p>
        </div>
        <div>
          <ul className="mt-12 gap-y-6 gap-x-12 items-center md:flex lg:gap-x-0 lg:mt-0">
            {
              contactMethods.map((item, idx) => (
                <li key={idx} className="space-y-3 border-t py-6 md:max-w-sm md:py-0 md:border-t-0 lg:border-l lg:px-12 lg:max-w-none border-gray-700">
                  <div className="w-12 h-12 rounded-full border flex items-center justify-center text-gray-400 border-gray-600">
                    {item.icon}
                  </div>
                  <h4 className=" text-lg font-medium xl:text-xl text-gray-200">
                    {item.title}
                  </h4>
                  <p>
                    {item.desc}
                  </p>
                  <a href={item.link.href} className="flex items-center gap-1 text-sm text-indigo-600 duration-150 hover:text-indigo-400 font-medium dark:text-indigo-400 dark:hover:text-indigo-300">
                    {item.link.name}
                    <HiExternalLink className="w-5 h-5" />
                  </a>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
