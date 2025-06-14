"use client";

import { motion } from "framer-motion";
import {
  ExternalLink,
  Github,
  ShoppingCart,
  MessageCircle,
  GraduationCap,
} from "lucide-react";

export default function Projects() {
  const projects = [
    {
      title: "E-Commerce Website",
      description:
        "A comprehensive online platform for seamless buying and selling of products with user-friendly design and secure functionality.",
      technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
      icon: <ShoppingCart className="text-blue-400" size={32} />,
      color: "from-blue-500 to-cyan-500",
      github: "https://github.com/jagan786786/chat_application",
      live: "https://ecommerce-demo.vercel.app",
    },
    {
      title: "Real-time Chat Application",
      description:
        "A real-time chat application with live communication, responsive UI, and secure user authentication using JWT and bcrypt.",
      technologies: ["Node.js", "Express", "MongoDB", "WebSockets", "JWT"],
      icon: <MessageCircle className="text-green-400" size={32} />,
      color: "from-green-500 to-emerald-500",
      github: "https://github.com/jagan786786/Ecommerce-Website",
      live: "https://ecommerce-demo.vercel.app",
    },
    {
      title: "University Portal & Dashboard",
      description:
        "A comprehensive portal for students, faculty, and administrators with course registration, attendance tracking, and grade management.",
      technologies: ["Next.js", "TypeScript", "SpringBoot", "PostgreSQL"],
      icon: <GraduationCap className="text-purple-400" size={32} />,
      color: "from-purple-500 to-pink-500",
      github: "https://github.com/jagan786786/unidashboard",
      live: "https://ecommerce-demo.vercel.app",
    },
  ];

  return (
    <section id="projects" className="py-20 px-4 bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-300">
            Some of the projects I've worked on
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 group"
            >
              <div className={`h-2 bg-gradient-to-r ${project.color}`} />

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  {project.icon}
                  <h3 className="text-xl font-bold">{project.title}</h3>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  {project.description}
                </p>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">
                    Technologies Used:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-gray-700 text-xs rounded-full text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  {/* <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-300 text-sm">
                    <ExternalLink size={16} />
                    Live Demo
                  </button> */}
                  <button
                    type="button"
                    onClick={() => {
                      console.log("Button clicked", project.github);
                      window.open(
                        project.github,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-600 hover:bg-gray-700 rounded-lg transition-colors duration-300"
                  >
                    <Github size={18} />
                    Code
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
