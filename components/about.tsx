"use client"

import { motion } from "framer-motion"
import { GraduationCap, MapPin, Phone, Mail, Linkedin } from "lucide-react"

export default function About() {
  return (
    <section id="about" className="py-20 px-4 bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            About Me
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            I'm passionate about technology and I want to bring my knowledge to a forward thinking company. I've learned
            a lot during my studies and projects, and I'm eager to keep learning and growing in a hands-on work
            environment.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 text-blue-400">Education</h3>

            <div className="space-y-6">
              <div className="bg-gray-700 p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <GraduationCap className="text-blue-400 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold text-lg">Bachelor of Engineering</h4>
                    <p className="text-blue-400">Computer Science and Engineering</p>
                    <p className="text-gray-300">GIET University</p>
                    <p className="text-sm text-gray-400">CGPA: 8.4/10.0</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <GraduationCap className="text-purple-400 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold text-lg">Intermediate - Science</h4>
                    <p className="text-purple-400">SHSS School (CHSE)</p>
                    <p className="text-sm text-gray-400">Percentage: 81%</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 text-purple-400">Contact Information</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="text-blue-400" size={20} />
                <span>Odisha, Gunupur</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-blue-400" size={20} />
                <span>+91 6371813048</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-blue-400" size={20} />
                <span>jagannathpatro234@gmail.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Linkedin className="text-blue-400" size={20} />
                <a
                  href="https://linkedin.com/in/jagannath-patro-37a192250/"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn Profile
                </a>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-lg font-bold mb-4">Personal Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Date of Birth:</span>
                  <p>01.07.2003</p>
                </div>
                <div>
                  <span className="text-gray-400">Gender:</span>
                  <p>Male</p>
                </div>
                <div>
                  <span className="text-gray-400">Languages:</span>
                  <p>Hindi, English, Odia</p>
                </div>
                <div>
                  <span className="text-gray-400">Hobbies:</span>
                  <p>Travelling, Cricket, Badminton</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
