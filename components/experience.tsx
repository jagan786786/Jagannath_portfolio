"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin } from "lucide-react"

export default function Experience() {
  const experiences = [
    {
      title: "Full Stack Developer Intern",
      company: "Bharat Intern",
      location: "Remote",
      duration: "June 2024 - July 2024",
      description:
        "Developed a comprehensive tour and travel website with personalized itineraries, destination exploration, and activity recommendations.",
      achievements: [
        "Built a complete tour and travel platform",
        "Implemented user-friendly booking system",
        "Created personalized recommendation engine",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Cybersecurity Analyst Intern",
      company: "Rinex",
      location: "Remote",
      duration: "Jan 2024 - March 2024",
      description:
        "Focused on website performance optimization and DDoS mitigation strategies during a 45-day intensive internship.",
      achievements: [
        "Achieved 20% increase in website loading speed",
        "Implemented DDoS mitigation strategies",
        "Reduced website downtime by 30%",
      ],
      color: "from-purple-500 to-pink-500",
    },
  ]

  const achievements = [
    "1st prize in GK competition (Block level)",
    "1st prize in debate competition (District level)",
    "3rd prize in debate competition (State level)",
    "Champion of district-level cricket tournament",
  ]

  return (
    <section id="experience" className="py-20 px-4 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Experience & Achievements
          </h2>
          <p className="text-xl text-gray-300">My professional journey and accomplishments</p>
        </motion.div>

        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8 text-blue-400">Professional Experience</h3>

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gray-800 p-6 rounded-lg hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className={`h-1 bg-gradient-to-r ${exp.color} mb-6 rounded`} />

                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">{exp.title}</h4>
                    <p className="text-lg text-blue-400 mb-2">{exp.company}</p>
                  </div>

                  <div className="flex flex-col md:items-end text-sm text-gray-400">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar size={16} />
                      <span>{exp.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{exp.description}</p>

                <div>
                  <h5 className="font-semibold text-gray-400 mb-2">Key Achievements:</h5>
                  <ul className="space-y-1">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${exp.color} mt-2 flex-shrink-0`} />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gray-800 p-8 rounded-lg"
        >
          <h3 className="text-2xl font-bold mb-6 text-purple-400">Awards & Recognition</h3>

          <div className="grid md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 bg-gray-700 p-4 rounded-lg"
              >
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex-shrink-0" />
                <span className="text-gray-300">{achievement}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
