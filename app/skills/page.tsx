"use client"

import { motion } from "framer-motion"
import Navigation from "@/components/navigation"
import { Code, Database, Globe, Wrench, Award, Star } from "lucide-react"

export default function SkillsPage() {
  const skillCategories = [
    {
      title: "Programming Languages",
      icon: <Code className="text-blue-400" size={32} />,
      skills: [
        { name: "Java", level: 90, experience: "2+ years" },
        { name: "Python", level: 85, experience: "2+ years" },
        { name: "JavaScript", level: 88, experience: "2+ years" },
        { name: "PHP", level: 75, experience: "1+ year" },
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Web Technologies",
      icon: <Globe className="text-green-400" size={32} />,
      skills: [
        { name: "HTML/CSS", level: 95, experience: "3+ years" },
        { name: "React.js", level: 88, experience: "2+ years" },
        { name: "Next.js", level: 82, experience: "1+ year" },
        { name: "Node.js", level: 85, experience: "2+ years" },
        { name: "Express.js", level: 80, experience: "1+ year" },
        { name: "Flutter", level: 70, experience: "1 year" },
        { name: "SpringBoot", level: 75, experience: "1+ year" },
      ],
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Databases",
      icon: <Database className="text-purple-400" size={32} />,
      skills: [
        { name: "MySQL", level: 85, experience: "2+ years" },
        { name: "MongoDB", level: 80, experience: "1+ year" },
        { name: "PostgreSQL", level: 75, experience: "1+ year" },
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Tools & Concepts",
      icon: <Wrench className="text-orange-400" size={32} />,
      skills: [
        { name: "Git/GitHub", level: 90, experience: "2+ years" },
        { name: "Data Structures", level: 85, experience: "2+ years" },
        { name: "Algorithms", level: 82, experience: "2+ years" },
        { name: "OOP", level: 88, experience: "2+ years" },
        { name: "DBMS", level: 80, experience: "2+ years" },
      ],
      color: "from-orange-500 to-red-500",
    },
  ]

  const certifications = [
    {
      title: "Java Basics",
      issuer: "HackerRank",
      date: "2023",
      badge: "4-star rating",
      icon: <Star className="text-yellow-400" size={20} />,
    },
    {
      title: "Joy of Computing using Python",
      issuer: "NPTEL",
      date: "2023",
      badge: "Certified",
      icon: <Award className="text-blue-400" size={20} />,
    },
    {
      title: "English Language Certification",
      issuer: "Cambridge University",
      date: "2023",
      badge: "Certified",
      icon: <Award className="text-green-400" size={20} />,
    },
    {
      title: "Object Oriented PHP and MVC",
      issuer: "Online Course",
      date: "2023",
      badge: "Completed",
      icon: <Award className="text-purple-400" size={20} />,
    },
    {
      title: "SQL",
      issuer: "HackerRank",
      date: "2023",
      badge: "3-star rating",
      icon: <Star className="text-yellow-400" size={20} />,
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
              Skills & Expertise
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              My technical skills and proficiency levels across various technologies
            </p>
          </motion.div>

          {/* Skills Categories */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {skillCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-gray-800 p-8 rounded-lg"
              >
                <div className="flex items-center gap-3 mb-6">
                  {category.icon}
                  <h2 className="text-2xl font-bold">{category.title}</h2>
                </div>

                <div className="space-y-6">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 + skillIndex * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-white">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">{skill.experience}</span>
                          <span className="text-sm font-semibold text-blue-400">{skill.level}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: index * 0.2 + skillIndex * 0.1 + 0.5 }}
                          className={`h-2 rounded-full bg-gradient-to-r ${category.color}`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Certifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-gray-800 p-8 rounded-lg"
          >
            <h2 className="text-3xl font-bold mb-8 text-center text-blue-400 flex items-center justify-center gap-3">
              <Award size={32} />
              Certifications & Achievements
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-colors duration-300"
                >
                  <div className="flex items-start gap-3 mb-3">
                    {cert.icon}
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1">{cert.title}</h3>
                      <p className="text-sm text-gray-400">{cert.issuer}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{cert.date}</span>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">{cert.badge}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Skills Summary */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-12 text-center"
          >
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-3xl font-bold text-blue-400 mb-2">15+</h3>
                <p className="text-gray-300">Technologies</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-3xl font-bold text-green-400 mb-2">10+</h3>
                <p className="text-gray-300">Projects Completed</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-3xl font-bold text-purple-400 mb-2">5+</h3>
                <p className="text-gray-300">Certifications</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
