"use client";

import { motion } from "framer-motion";
import { Code, Database, Globe, Wrench } from "lucide-react";

export default function Skills() {
  const skillCategories = [
    {
      title: "Programming Languages",
      icon: <Code className="text-blue-400" size={24} />,
      skills: ["Java", "Python", "C"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Web Technologies",
      icon: <Globe className="text-green-400" size={24} />,
      skills: [
        "HTML",
        "CSS",
        "Javascript",
        "PHP",
        "React.js",
        "Next.js",
        "Node.js",
        "Express.js",
        "Flutter",
        "SpringBoot",
        "React Native",
        "Nest.js",
        "Tailwind CSS",
      ],
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Databases",
      icon: <Database className="text-purple-400" size={24} />,
      skills: ["MySQL", "MongoDB", "PostgreSQL"],
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Tools & Concepts",
      icon: <Wrench className="text-orange-400" size={24} />,
      skills: [
        "Git",
        "GitBash",
        "Data Structures",
        "Algorithms",
        "OOP",
        "DBMS",
      ],
      color: "from-orange-500 to-red-500",
    },
  ];

  const certifications = [
    "Java Basics (HackerRank)",
    "Joy of Computing using Python (NPTEL)",
    "English Language Certification (Cambridge)",
    "4-star rating in Java (HackerRank)",
    "Object Oriented PHP and MVC",
    "3-star rating in SQL (HackerRank)",
  ];

  return (
    <section id="skills" className="py-20 px-4 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          <p className="text-xl text-gray-300">
            Technologies and tools I work with
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800 p-6 rounded-lg hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                {category.icon}
                <h3 className="text-lg font-bold">{category.title}</h3>
              </div>

              <div className="space-y-2">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skill} className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.color}`}
                    />
                    <span className="text-gray-300">{skill}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gray-800 p-8 rounded-lg"
        >
          <h3 className="text-2xl font-bold mb-6 text-center text-blue-400">
            Certifications & Achievements
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors duration-300"
              >
                <p className="text-sm text-gray-300">{cert}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
