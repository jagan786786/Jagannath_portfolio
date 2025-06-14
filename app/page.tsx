"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Hero from "@/components/hero";
import About from "@/components/about";
import Skills from "@/components/skills";
import Projects from "@/components/projects";
import Experience from "@/components/experience";
import Contact from "@/components/contact";
import Navigation from "@/components/navigation";

export default function HomePage() {
  return (
    <div className="bg-gray-900 text-white overflow-x-hidden">
      <Navigation />

      {/* Hero Section with 3D Background */}
      <section id="home" className="relative h-screen w-full overflow-hidden">
        {/* Background Canvas */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <Suspense fallback={null}>
              <Hero />
            </Suspense>
          </Canvas>
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 flex items-center justify-center h-full w-full">
          <div className="text-center px-4 max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-28 h-28 md:w-36 md:h-36 lg:w-60 lg:h-60 rounded-full overflow-hidden border-4 border-blue-400 shadow-xl">
                <img
                  src="/profile.png"
                  alt="Jagannath Patro"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              JAGANNATH PATRO
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-8">
              Full Stack and Java Developer & Computer Science Engineer
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors duration-300"
              >
                Get In Touch
              </a>
              <a
                href="#projects"
                className="px-8 py-3 border border-blue-600 hover:bg-blue-600 rounded-full transition-colors duration-300"
              >
                View Projects
              </a>
            </div>
          </div>
        </div>
      </section>

      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
    </div>
  );
}
