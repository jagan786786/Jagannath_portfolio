"use client"

import { motion } from "framer-motion"
import Navigation from "@/components/navigation"
import { GraduationCap, Award, Calendar, MapPin } from "lucide-react"

export default function AboutPage() {
  const achievements = [
    "1st prize in GK competition (Block level)",
    "1st prize in debate competition (District level)",
    "3rd prize in debate competition (State level)",
    "Champion of district-level cricket tournament",
  ]

  const personalDetails = [
    { label: "Date of Birth", value: "01.07.2003" },
    { label: "Gender", value: "Male" },
    { label: "Father's Name", value: "Pradipta Kumar Patro" },
    { label: "Mother's Name", value: "Sabita Patro" },
    { label: "Languages Known", value: "Hindi, English, Odia" },
    { label: "Hobbies", value: "Travelling, Playing Cricket, Badminton" },
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
              About Me
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              I'm passionate about technology and I want to bring my knowledge to a forward thinking company. I've
              learned a lot during my studies and projects, and I'm eager to keep learning and growing in a hands-on
              work environment.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Education Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-800 p-8 rounded-lg"
            >
              <h2 className="text-3xl font-bold mb-6 text-blue-400 flex items-center gap-3">
                <GraduationCap size={32} />
                Education
              </h2>

              <div className="space-y-6">
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-2">Bachelor of Engineering</h3>
                  <p className="text-blue-400 font-semibold">Computer Science and Engineering</p>
                  <p className="text-gray-300">GIET University</p>
                  <p className="text-sm text-gray-400 mt-2">CGPA: 8.4/10.0</p>
                  <p className="text-sm text-gray-400">Expected Graduation: May 2025</p>
                </div>

                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-2">Intermediate - Science</h3>
                  <p className="text-purple-400 font-semibold">SHSS School (CHSE)</p>
                  <p className="text-sm text-gray-400 mt-2">Percentage: 81%</p>
                  <p className="text-sm text-gray-400">Duration: April 2019 - March 2021</p>
                </div>

                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-2">Matriculation</h3>
                  <p className="text-green-400 font-semibold">S.L.N.M High School (BSE)</p>
                  <p className="text-sm text-gray-400 mt-2">Percentage: 81%</p>
                  <p className="text-sm text-gray-400">Duration: March 2018 - March 2019</p>
                </div>
              </div>
            </motion.div>

            {/* Achievements Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gray-800 p-8 rounded-lg"
            >
              <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center gap-3">
                <Award size={32} />
                Achievements
              </h2>

              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="bg-gray-700 p-4 rounded-lg flex items-start gap-3"
                  >
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 mt-2 flex-shrink-0" />
                    <span className="text-gray-300">{achievement}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Personal Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-gray-800 p-8 rounded-lg"
          >
            <h2 className="text-3xl font-bold mb-6 text-green-400 flex items-center gap-3">
              <Calendar size={32} />
              Personal Details
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalDetails.map((detail, index) => (
                <motion.div
                  key={detail.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="bg-gray-700 p-4 rounded-lg"
                >
                  <p className="text-gray-400 text-sm font-medium">{detail.label}</p>
                  <p className="text-white font-semibold mt-1">{detail.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Location Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-blue-400 mb-4">
              <MapPin size={24} />
              <span className="text-xl">Based in Odisha, Gunupur, India</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
