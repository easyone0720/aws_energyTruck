'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Truck3DProps {
  onStatusChange?: (status: string) => void
}

export function Truck3D({ onStatusChange }: Truck3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const reqIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // --- CONFIG & STATE ---
    const CONFIG = {
      colors: {
        bodyDark: 0x111625,
        bodyBlue: 0x2d5eff,
        chrome: 0xcccccc,
        glass: 0x111111,
        core: 0x00ffff,
        road: 0x1e2a4a
      }
    }

    const STATE = {
      phase: 'drive_in', // drive_in, slowing, stopped, opening, open_wait, closing, driving_out
      doorOpen: 0, // 0 to 1
      truckX: -15,
      speed: 0.15,
      timer: 0
    }

    // --- SCENE SETUP ---
    const container = containerRef.current
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x060b1e, 0.03)

    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 3, 14)
    camera.lookAt(0, 1, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // --- LIGHTING ---
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x060b1e, 0.6)
    scene.add(hemiLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight.position.set(5, 10, 8)
    dirLight.castShadow = true
    dirLight.shadow.mapSize.width = 1024
    dirLight.shadow.mapSize.height = 1024
    scene.add(dirLight)

    // --- ASSET CREATION FUNCTIONS ---

    // 1. Aerodynamic Cab Shape
    function createCab() {
      const shape = new THREE.Shape()
      // Start bottom-rear
      shape.moveTo(0, 0)
      shape.lineTo(1.8, 0) // Bottom length
      // Front bumper curve
      shape.quadraticCurveTo(2.0, 0, 2.0, 0.4)
      // Grill
      shape.lineTo(2.0, 1.0)
      // Windshield slope
      shape.lineTo(1.6, 2.0)
      // Roof
      shape.lineTo(0.2, 2.0)
      // Rear wall
      shape.lineTo(0, 0)

      const extrudeSettings = {
        steps: 1,
        depth: 1.4, // Width of truck
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 3
      }

      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
      // Center the geometry roughly
      geo.translate(-1, 0, -0.7)

      const mat = new THREE.MeshStandardMaterial({
        color: CONFIG.colors.bodyBlue,
        roughness: 0.2,
        metalness: 0.6,
      })

      const mesh = new THREE.Mesh(geo, mat)
      mesh.castShadow = true
      mesh.receiveShadow = true
      return mesh
    }

    // 2. Chassis with details
    function createChassis() {
      const group = new THREE.Group()

      // Main Frame
      const frameGeo = new THREE.BoxGeometry(5.5, 0.4, 1.2)
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8 })
      const frame = new THREE.Mesh(frameGeo, frameMat)
      frame.position.y = 0.4 // Height from ground
      frame.castShadow = true
      group.add(frame)

      // Fuel Tank (Side cylinder)
      const tankGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.2, 16)
      const tankMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 })
      const tank = new THREE.Mesh(tankGeo, tankMat)
      tank.rotation.z = Math.PI / 2
      tank.position.set(0, 0.4, 0.7) // Stick out side
      tank.castShadow = true
      group.add(tank)

      return group
    }

    // 3. Cargo Container with Interior and Sliding Door
    function createCargo() {
      const group = new THREE.Group()

      // Outer Shell Dimensions
      const w = 3.6, h = 2.0, d = 1.5
      const thick = 0.1

      const shellMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.bodyDark, roughness: 0.4, metalness: 0.5 })
      const interiorMat = new THREE.MeshStandardMaterial({ color: 0x111111, side: THREE.DoubleSide })

      // We construct the box from planes to have a hole
      // Back Wall
      const backGeo = new THREE.BoxGeometry(w, h, thick)
      const back = new THREE.Mesh(backGeo, shellMat)
      back.position.z = -d / 2 + thick / 2
      back.position.y = h / 2
      group.add(back)

      // Top
      const topGeo = new THREE.BoxGeometry(w, thick, d)
      const top = new THREE.Mesh(topGeo, shellMat)
      top.position.y = h - thick / 2
      group.add(top)

      // Bottom
      const botGeo = new THREE.BoxGeometry(w, thick, d)
      const bot = new THREE.Mesh(botGeo, shellMat)
      bot.position.y = thick / 2
      group.add(bot)

      // Front Cap
      const capGeo = new THREE.BoxGeometry(thick, h, d)
      const capL = new THREE.Mesh(capGeo, shellMat)
      capL.position.x = -w / 2 + thick / 2
      capL.position.y = h / 2
      group.add(capL)

      const capR = new THREE.Mesh(capGeo, shellMat)
      capR.position.x = w / 2 - thick / 2
      capR.position.y = h / 2
      group.add(capR)

      // FRONT FACE (The side facing camera) with HOLE
      // Left fixed panel
      const panW = 1.0
      const panL = new THREE.Mesh(new THREE.BoxGeometry(panW, h, thick), shellMat)
      panL.position.set(-w / 2 + panW / 2, h / 2, d / 2 - thick / 2)
      group.add(panL)

      // Right fixed panel
      const panR = new THREE.Mesh(new THREE.BoxGeometry(panW, h, thick), shellMat)
      panR.position.set(w / 2 - panW / 2, h / 2, d / 2 - thick / 2)
      group.add(panR)

      // THE DOOR (Sliding part)
      const doorW = w - (panW * 2) + 0.2 // Overlap slightly
      const doorGeo = new THREE.BoxGeometry(doorW, h - 0.1, thick + 0.05) // Slightly thicker

      // Door Detail: Stripe
      // Create a canvas texture for the door
      const canvas = document.createElement('canvas')
      canvas.width = 128; canvas.height = 128
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#1a1f35'; ctx.fillRect(0, 0, 128, 128)
        ctx.fillStyle = '#2d5eff'; ctx.fillRect(0, 50, 128, 20) // Blue stripe
        // Lightning icon
        ctx.fillStyle = '#ffe600'
        ctx.beginPath(); ctx.moveTo(64, 20); ctx.lineTo(80, 50); ctx.lineTo(60, 50); ctx.lineTo(70, 90); ctx.lineTo(40, 50); ctx.lineTo(60, 50); ctx.fill()
      }
      const tex = new THREE.CanvasTexture(canvas)

      const doorMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.3, metalness: 0.4 })
      const door = new THREE.Mesh(doorGeo, doorMat)
      door.position.set(0, h / 2, d / 2) // Slightly front

      // Door Wrapper to animate
      const doorGroup = new THREE.Group()
      doorGroup.add(door)
      group.add(doorGroup)

      // ENERGY CORE (Inside)
      const coreGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16)
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x00ffff })
      const core = new THREE.Mesh(coreGeo, coreMat)
      core.rotation.z = Math.PI / 2
      core.position.set(0, h / 2, 0)
      group.add(core)

      // Glow Light
      const coreLight = new THREE.PointLight(0x00ffff, 0, 4) // Start intensity 0
      coreLight.position.set(0, h / 2, 0.5)
      group.add(coreLight)

      // Spiral around core
      const helixGeo = new THREE.TorusKnotGeometry(0.4, 0.02, 64, 8, 2, 3)
      const helixMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 })
      const helix = new THREE.Mesh(helixGeo, helixMat)
      helix.rotation.x = Math.PI / 2
      helix.position.set(0, h / 2, 0)
      group.add(helix)

      return { mesh: group, door: doorGroup, core: core, light: coreLight, helix: helix }
    }

    // 4. Detailed Wheel
    function createWheel() {
      const group = new THREE.Group()

      // Rubber Tire (rounded)
      const tireGeo = new THREE.TorusGeometry(0.35, 0.15, 12, 32)
      const tireMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 })
      const tire = new THREE.Mesh(tireGeo, tireMat)
      group.add(tire)

      // Rim
      const rimGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 16)
      const rimMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.2 })
      const rim = new THREE.Mesh(rimGeo, rimMat)
      rim.rotation.x = Math.PI / 2
      group.add(rim)

      // Hub Cap
      const capGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.22, 8)
      const capMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.bodyBlue, metalness: 0.5 })
      const cap = new THREE.Mesh(capGeo, capMat)
      cap.rotation.x = Math.PI / 2
      group.add(cap)

      return group
    }

    // --- ASSEMBLE TRUCK ---
    const truckRoot = new THREE.Group()
    const truckBodyGroup = new THREE.Group() // Body moves on suspension
    truckRoot.add(truckBodyGroup)
    scene.add(truckRoot)

    const chassis = createChassis()
    truckBodyGroup.add(chassis)

    const cab = createCab()
    cab.position.set(1.5, 0.8, 0) // Position relative to chassis
    truckBodyGroup.add(cab)

    const cargoObj = createCargo()
    const cargoMesh = cargoObj.mesh
    cargoMesh.position.set(-1.2, 0.8, 0)
    truckBodyGroup.add(cargoMesh)

    // Add Wheels
    const wheels: THREE.Group[] = []
    const wheelPos = [
      { x: -2.8, z: 0.65 },
      { x: -1.6, z: 0.65 },
      { x: 2.5, z: 0.65 },
      { x: -2.8, z: -0.65 },
      { x: -1.6, z: -0.65 },
      { x: 2.5, z: -0.65 }
    ]

    wheelPos.forEach(pos => {
      const w = createWheel()
      w.position.set(pos.x, 0.5, pos.z) // Fixed to root, not bobbing body
      truckRoot.add(w) // Add to root
      wheels.push(w)
    })

    // Add Fender meshes to body for rear wheels
    const fenderGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.4, 32, 1, true, 0, Math.PI)
    const fenderMat = new THREE.MeshStandardMaterial({ color: 0x050505, side: THREE.DoubleSide })

    // Rear fender block
    const rFender = new THREE.Mesh(fenderGeo, fenderMat)
    rFender.rotation.x = Math.PI / 2
    rFender.rotation.y = Math.PI / 2
    rFender.position.set(-2.2, 0.7, 0.65)
    rFender.scale.set(1, 1, 2.8) // Stretch to cover two wheels
    truckBodyGroup.add(rFender)


    // --- ENVIRONMENT ---
    // Road
    const roadGeo = new THREE.PlaneGeometry(200, 20)
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x0a0f1e, roughness: 0.9 })
    const road = new THREE.Mesh(roadGeo, roadMat)
    road.rotation.x = -Math.PI / 2
    road.receiveShadow = true
    scene.add(road)

    // Grid lines on road
    const gridHelper = new THREE.GridHelper(200, 100, 0x1e2a4a, 0x0f1525)
    gridHelper.position.y = 0.01
    scene.add(gridHelper)

    // --- ANIMATION LOOP ---
    function updateStatus(text: string) {
      if (onStatusChange) {
        onStatusChange(text)
      }
    }

    let time = 0

    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate)
      time += 0.05

      // 1. STATE MACHINE
      switch (STATE.phase) {
        case 'drive_in':
          STATE.truckX += STATE.speed
          truckBodyGroup.position.y = 0.1 + Math.sin(time * 2) * 0.02 // Suspension

          if (STATE.truckX >= -2) { // Start slowing down
            STATE.phase = 'slowing'
            updateStatus("Arriving...")
          }
          break

        case 'slowing':
          STATE.truckX += STATE.speed * 0.4
          // Dampen suspension
          truckBodyGroup.position.y = 0.1 + Math.sin(time * 1.5) * 0.01

          if (STATE.truckX >= 0) {
            STATE.truckX = 0
            STATE.phase = 'stopped'
            STATE.timer = 0
            updateStatus("Docked")
            // Pitch down slightly when stopping (brake dive)
            truckBodyGroup.rotation.z = -0.02
          }
          break

        case 'stopped':
          STATE.timer++
          // Settle suspension
          truckBodyGroup.rotation.z *= 0.9
          truckBodyGroup.position.y = 0.1

          if (STATE.timer > 30) {
            STATE.phase = 'opening'
            updateStatus("Accessing Core...")
          }
          break

        case 'opening':
          STATE.doorOpen += 0.05
          // Slide Door to right (relative x)
          cargoObj.door.position.x = STATE.doorOpen * 1.5

          // Light up core
          cargoObj.light.intensity = STATE.doorOpen * 3
          // @ts-ignore
          cargoObj.core.material.color.setHex(0x00ffff)

          if (STATE.doorOpen >= 1) {
            STATE.doorOpen = 1
            STATE.phase = 'open_wait'
            STATE.timer = 0
            updateStatus("Energy Transfer")
          }
          break

        case 'open_wait':
          STATE.timer++
          // Animate Core
          cargoObj.helix.rotation.z += 0.1
          cargoObj.light.intensity = 3 + Math.sin(time * 10) * 1 // Pulse

          if (STATE.timer > 120) { // Wait 2 seconds
            STATE.phase = 'closing'
            updateStatus("Securing...")
          }
          break

        case 'closing':
          STATE.doorOpen -= 0.05
          cargoObj.door.position.x = STATE.doorOpen * 1.5
          cargoObj.light.intensity = STATE.doorOpen * 3

          if (STATE.doorOpen <= 0) {
            STATE.doorOpen = 0
            STATE.phase = 'driving_out'
            updateStatus("Deploying")
            // Pitch up (acceleration squat)
            truckBodyGroup.rotation.z = 0.02
          }
          break

        case 'driving_out':
          STATE.truckX += STATE.speed * 1.5 // Accelerate fast
          truckBodyGroup.rotation.z *= 0.95 // Return to level
          truckBodyGroup.position.y = 0.1 + Math.sin(time * 3) * 0.03

          if (STATE.truckX > 15) {
            // RESET LOOP
            STATE.truckX = -15
            STATE.phase = 'drive_in'
            updateStatus("Incoming")
          }
          break
      }

      // Apply position
      truckRoot.position.x = STATE.truckX

      // 2. Wheel Rotation Logic
      const isMoving = (STATE.phase === 'drive_in' || STATE.phase === 'slowing' || STATE.phase === 'driving_out')
      if (isMoving) {
        let currentSpeed = STATE.speed
        if (STATE.phase === 'slowing') currentSpeed *= 0.4
        if (STATE.phase === 'driving_out') currentSpeed *= 1.5

        wheels.forEach(w => {
          w.rotation.z -= currentSpeed * 2.0
        })
      }

      // 3. Camera Follow (Subtle)
      camera.position.x = STATE.truckX * 0.3 // Slight parallax follow
      camera.lookAt(STATE.truckX * 0.5, 0.5, 0)

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!container) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current)
      if (rendererRef.current) {
        rendererRef.current.dispose()
        container.removeChild(rendererRef.current.domElement)
      }
    }
  }, [onStatusChange])

  return <div ref={containerRef} className="absolute inset-0 z-0 bg-gradient-radial from-[#1a2342] to-[#060b1e]" />
}
