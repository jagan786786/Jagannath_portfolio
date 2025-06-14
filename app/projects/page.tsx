"use client"

import { motion } from "framer-motion"
import Navigation from "@/components/navigation"
import { ExternalLink, Github, ShoppingCart, MessageCircle, GraduationCap, Globe } from "lucide-react"

export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      title: "E-Commerce Website",
      description:
        "A comprehensive online platform for seamless buying and selling of products with user-friendly design and secure functionality. Features include product catalog, shopping cart, user authentication, payment integration, and admin dashboard.",
      longDescription:
        "This full-stack e-commerce solution provides a complete online shopping experience. Built with modern web technologies, it includes features like product search and filtering, user reviews, order tracking, inventory management, and secure payment processing.",
      technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
      icon: <ShoppingCart className="text-blue-400" size={32} />,
      color: "from-blue-500 to-cyan-500",
      image: "/placeholder.svg?height=300&width=500",
      features: [
        "Product catalog with search and filters",
        "Shopping cart and checkout system",
        "User authentication and profiles",
        "Admin dashboard for inventory management",
        "Secure payment integration",
        "Order tracking and history",
      ],
      status: "Completed",
      duration: "3 months",
    },
    {
      id: 2,
      title: "Real-time Chat Application",
      description:
        "A real-time chat application with live communication, responsive UI, and secure user authentication using JWT and bcrypt. Supports group chats, file sharing, and message history.",
      longDescription:
        "A modern chat application built with Node.js and WebSockets for real-time communication. Features include private messaging, group chats, file sharing, emoji support, and message encryption for enhanced security.",
      technologies: ["Node.js", "Express", "MongoDB", "WebSockets", "JWT", "React"],
      icon: <MessageCircle className="text-green-400" size={32} />,
      color: "from-green-500 to-emerald-500",
      image: "/placeholder.svg?height=300&width=500",
      features: [
        "Real-time messaging with WebSockets",
        "Private and group chat rooms",
        "File and image sharing",
        "Message encryption and security",
        "User presence indicators",
        "Message history and search",
      ],
      status: "Completed",
      duration: "2 months",
    },
    {
      id: 3,
      title: "University Portal & Dashboard",
      description:
        "A comprehensive portal for students, faculty, and administrators with course registration, attendance tracking, and grade management. Built with modern full-stack technologies.",
      longDescription:
        "An integrated university management system that streamlines academic processes. The portal serves different user roles with tailored dashboards, course management, grade tracking, and communication tools.",
      technologies: ["Next.js", "TypeScript", "SpringBoot", "PostgreSQL", "Tailwind CSS"],
      icon: <GraduationCap className="text-purple-400" size={32} />,
      color: "from-purple-500 to-pink-500",
      image: "/placeholder.svg?height=300&width=500",
      features: [
        "Role-based access control",
        "Course registration and management",
        "Attendance tracking system",
        "Grade management and reporting",
        "Timetable and scheduling",
        "Announcements and notifications",
      ],
      status: "In Progress",
      duration: "4 months",
    },
    {
      id: 4,
      title: "Tour & Travel Website",
      description:
        "A comprehensive digital platform designed to simplify trip planning, booking, and management. Features destination exploration, personalized itineraries, and local recommendations.",
      longDescription:
        "Built during my internship at Bharat Intern, this travel platform helps users discover destinations, plan trips, and book accommodations. Includes interactive maps, weather integration, and social features.",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Maps API"],
      icon: <Globe className="text-orange-400" size={32} />,
      color: "from-orange-500 to-red-500",
      image: "/placeholder.svg?height=300&width=500",
      features: [
        "Destination discovery and exploration",
        "Personalized trip planning",
        "Hotel and flight booking integration",
        "Interactive maps and navigation",
        "Weather and local information",
        "User reviews and recommendations",
      ],
      status: "Completed",
      duration: "2 months",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />

      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              My Projects
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A showcase of my technical projects and development work
            </p>
          </motion.div>

          <div className="grid gap-12">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-2xl"
              >
                <div className={`h-2 bg-gradient-to-r ${project.color}`} />

                <div className="grid lg:grid-cols-2 gap-8 p-8">
                  {/* Project Image */}
                  <div className="relative">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-64 lg:h-80 object-cover rounded-lg"
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          project.status === "Completed" ? "bg-green-600 text-white" : "bg-yellow-600 text-white"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      {project.icon}
                      <h2 className="text-3xl font-bold">{project.title}</h2>
                    </div>

                    <p className="text-gray-300 leading-relaxed">{project.longDescription}</p>

                    <div>
                      <h3 className="text-lg font-semibold text-blue-400 mb-3">Key Features:</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {project.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-300">
                            <div
                              className={`w-2 h-2 rounded-full bg-gradient-to-r ${project.color} mt-2 flex-shrink-0`}
                            />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-purple-400 mb-3">Technologies Used:</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="px-3 py-1 bg-gray-700 text-sm rounded-full text-gray-300">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Duration: {project.duration}</span>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-300">
                        <ExternalLink size={18} />
                        Live Demo
                      </button>
                      <button className="flex items-center gap-2 px-6 py-3 border border-gray-600 hover:bg-gray-700 rounded-lg transition-colors duration-300">
                        <Github size={18} />
                        Source Code
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
