"use client"

import { motion } from "framer-motion"
import Navigation from "@/components/navigation"
import { Calendar, MapPin, Briefcase, Shield, Code, TrendingUp } from "lucide-react"

export default function ExperiencePage() {
  const experiences = [
    {
      title: "Full Stack Developer Intern",
      company: "Bharat Intern",
      location: "Remote",
      duration: "June 2024 - July 2024",
      type: "Internship",
      description:
        "Developed a comprehensive tour and travel website with personalized itineraries, destination exploration, and activity recommendations. Worked on both frontend and backend development using modern web technologies.",
      responsibilities: [
        "Built a complete tour and travel platform from scratch",
        "Implemented user-friendly booking system with payment integration",
        "Created personalized recommendation engine using algorithms",
        "Developed responsive UI/UX for optimal user experience",
        "Integrated third-party APIs for maps, weather, and booking services",
        "Collaborated with team members on feature development",
      ],
      technologies: ["React", "Node.js", "Express", "MongoDB", "JavaScript", "HTML/CSS"],
      achievements: [
        "Successfully delivered the project within the 2-month timeline",
        "Received positive feedback from mentors and peers",
        "Gained hands-on experience in full-stack development",
      ],
      color: "from-blue-500 to-cyan-500",
      icon: <Code className="text-blue-400" size={24} />,
    },
    {
      title: "Cybersecurity Analyst Intern",
      company: "Rinex",
      location: "Remote",
      duration: "Jan 2024 - March 2024",
      type: "Internship",
      description:
        "Focused on website performance optimization and DDoS mitigation strategies during a 45-day intensive internship. Worked on analyzing security vulnerabilities and implementing protective measures.",
      responsibilities: [
        "Analyzed website performance bottlenecks and optimization opportunities",
        "Researched and implemented DDoS mitigation strategies",
        "Conducted security assessments and vulnerability testing",
        "Collaborated with team members to optimize website loading speed",
        "Documented security protocols and best practices",
        "Monitored website uptime and performance metrics",
      ],
      technologies: ["Security Tools", "Performance Monitoring", "Web Analytics", "Linux", "Networking"],
      achievements: [
        "Achieved 20% increase in website loading speed",
        "Implemented DDoS mitigation strategies",
        "Reduced website downtime by 30%",
        "Completed comprehensive security audit",
      ],
      color: "from-purple-500 to-pink-500",
      icon: <Shield className="text-purple-400" size={24} />,
    },
  ]

  const skills_gained = [
    "Full-Stack Development",
    "Cybersecurity Analysis",
    "Performance Optimization",
    "Team Collaboration",
    "Project Management",
    "Problem Solving",
    "API Integration",
    "Security Best Practices",
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />

      <div className="pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Professional Experience
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              My journey in the tech industry through internships and hands-on projects
            </p>
          </motion.div>

          {/* Experience Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 hidden md:block" />

            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.3 }}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-6 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full hidden md:block" />

                  <div className="md:ml-16 bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
                    <div className={`h-2 bg-gradient-to-r ${exp.color}`} />

                    <div className="p-8">
                      {/* Header */}
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {exp.icon}
                            <h2 className="text-2xl font-bold text-white">{exp.title}</h2>
                          </div>
                          <h3 className="text-xl text-blue-400 font-semibold mb-2">{exp.company}</h3>
                          <p className="text-gray-300 leading-relaxed">{exp.description}</p>
                        </div>

                        <div className="lg:ml-8 mt-4 lg:mt-0 space-y-2">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Calendar size={16} />
                            <span className="text-sm">{exp.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <MapPin size={16} />
                            <span className="text-sm">{exp.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <Briefcase size={16} />
                            <span className="text-sm">{exp.type}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid lg:grid-cols-2 gap-8">
                        {/* Responsibilities */}
                        <div>
                          <h4 className="text-lg font-semibold text-green-400 mb-4">Key Responsibilities:</h4>
                          <ul className="space-y-2">
                            {exp.responsibilities.map((responsibility, i) => (
                              <li key={i} className="flex items-start gap-2 text-gray-300">
                                <div
                                  className={`w-2 h-2 rounded-full bg-gradient-to-r ${exp.color} mt-2 flex-shrink-0`}
                                />
                                <span className="text-sm">{responsibility}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Achievements */}
                        <div>
                          <h4 className="text-lg font-semibold text-yellow-400 mb-4">Key Achievements:</h4>
                          <ul className="space-y-2 mb-6">
                            {exp.achievements.map((achievement, i) => (
                              <li key={i} className="flex items-start gap-2 text-gray-300">
                                <TrendingUp className="text-yellow-400 mt-1 flex-shrink-0" size={16} />
                                <span className="text-sm">{achievement}</span>
                              </li>
                            ))}
                          </ul>

                          <h4 className="text-lg font-semibold text-purple-400 mb-3">Technologies Used:</h4>
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech) => (
                              <span key={tech} className="px-3 py-1 bg-gray-700 text-xs rounded-full text-gray-300">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Skills Gained Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 bg-gray-800 p-8 rounded-lg"
          >
            <h2 className="text-3xl font-bold mb-6 text-center text-green-400">Skills Gained Through Experience</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {skills_gained.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors duration-300"
                >
                  <span className="text-gray-300 font-medium">{skill}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Experience Summary */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-12 text-center"
          >
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-3xl font-bold text-blue-400 mb-2">2</h3>
                <p className="text-gray-300">Internships Completed</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-3xl font-bold text-green-400 mb-2">5</h3>
                <p className="text-gray-300">Months of Experience</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-3xl font-bold text-purple-400 mb-2">8+</h3>
                <p className="text-gray-300">Skills Acquired</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
