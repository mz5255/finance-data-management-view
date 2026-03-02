<template>
  <div id="app">
    <!-- Background Orbs -->
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>

    <!-- Star Background -->
    <div class="stars-container">
      <div v-for="i in 200" :key="i" :style="{animationDelay: `${i * 0.01}s`, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`}"
           class="star"></div>
    </div>

    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Exo 2', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #0A0E27 0%, #0D0D0D 50%, #1a1a2e 100%);
  color: rgba(235, 235, 235, 0.64);
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  position: relative;
}

/* Star Background */
.stars-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #ffffff;
  border-radius: 50%;
  animation: starTwinkle 3s infinite ease-in-out;
  opacity: 0.8;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
}

@keyframes starTwinkle {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
  }
  50% {
    transform: scale(1.5);
    opacity: 1;
    box-shadow: 0 0 12px rgba(255, 255, 255, 1);
  }
}

/* Heading styles */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Orbitron', sans-serif;
  color: #ffffff;
  font-weight: 600;
}

/* Button styles */
.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid transparent;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Exo 2', sans-serif;
}

.btn-primary {
  background: linear-gradient(135deg, #3B82F6, #60A5FA);
  color: white;
  border-color: #3B82F6;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: transparent;
  border: 2px solid #3B82F6;
  color: white;
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-secondary:hover {
  background: rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

/* Input styles */
input, select, textarea {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px 12px;
  color: white;
  font-family: 'Exo 2', sans-serif;
  transition: all 0.3s ease;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

input::placeholder, select::placeholder, textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/* Link styles */
a {
  color: #3B82F6;
  text-decoration: none;
  transition: all 0.3s ease;
}

a:hover {
  color: #60A5FA;
  text-decoration: underline;
}

/* Card styles */
.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(59, 130, 246, 0.2);
}

/* Scrollbar styles */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.8);
}
</style>