#!/usr/bin/env node

/**
 * InSafe Test Agent
 * A simple Node.js script to test the agent communication system
 */

const https = require('https')
const http = require('http')
const { exec } = require('child_process')
const os = require('os')

class InSafeTestAgent {
  constructor(serverUrl = 'http://localhost:3000') {
    this.serverUrl = serverUrl
    this.agentId = null
    this.token = null
    this.pollInterval = 30000 // 30 seconds
    this.isRunning = false
    
    // Generate fake system info
    this.systemInfo = {
      hostname: os.hostname(),
      username: os.userInfo().username,
      macAddress: this.generateFakeMacAddress(),
      platform: os.platform(),
      version: '1.0.0-test'
    }
    
    console.log('🤖 InSafe Test Agent Starting...')
    console.log(`📡 Server: ${this.serverUrl}`)
    console.log(`💻 System: ${this.systemInfo.hostname} (${this.systemInfo.platform})`)
  }

  generateFakeMacAddress() {
    return "00:0a:95:" + 
      Math.floor(Math.random() * 255).toString(16).padStart(2, '0') + ":" +
      Math.floor(Math.random() * 255).toString(16).padStart(2, '0') + ":" +
      Math.floor(Math.random() * 255).toString(16).padStart(2, '0')
  }

  async makeRequest(path, method = 'GET', data = null, useAuth = false) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.serverUrl)
      const isHttps = url.protocol === 'https:'
      const client = isHttps ? https : http
      
      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + url.search,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'InSafe-Agent/1.0.0'
        }
      }

      if (useAuth && this.token) {
        options.headers['Authorization'] = `Bearer ${this.token}`
      }

      if (data) {
        const jsonData = JSON.stringify(data)
        options.headers['Content-Length'] = Buffer.byteLength(jsonData)
      }

      const req = client.request(options, (res) => {
        let responseBody = ''
        
        res.on('data', (chunk) => {
          responseBody += chunk
        })
        
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseBody)
            resolve({ status: res.statusCode, data: parsed })
          } catch (error) {
            resolve({ status: res.statusCode, data: responseBody })
          }
        })
      })

      req.on('error', (error) => {
        reject(error)
      })

      if (data) {
        req.write(JSON.stringify(data))
      }
      
      req.end()
    })
  }

  async register() {
    console.log('📝 Registering with server...')
    
    try {
      const response = await this.makeRequest('/api/agents/register', 'POST', this.systemInfo)
      
      if (response.data.success) {
        this.agentId = response.data.agentId
        this.token = response.data.token
        this.pollInterval = response.data.pollInterval || 2000
        
        console.log(`✅ Registration successful!`)
        console.log(`🆔 Agent ID: ${this.agentId}`)
        console.log(`⏱️  Poll interval: ${this.pollInterval}ms`)
        
        return true
      } else {
        console.error('❌ Registration failed:', response.data.error)
        return false
      }
    } catch (error) {
      console.error('❌ Registration error:', error.message)
      return false
    }
  }

  async sendHeartbeat() {
    try {
      await this.makeRequest('/api/agents/status', 'POST', {
        status: 'online',
        systemInfo: {
          uptime: os.uptime(),
          freeMemory: os.freemem(),
          totalMemory: os.totalmem(),
          loadAverage: os.loadavg()
        }
      }, true)
      
      console.log('💓 Heartbeat sent')
    } catch (error) {
      console.error('❌ Heartbeat failed:', error.message)
    }
  }

  async pollForCommands() {
    try {
      const response = await this.makeRequest('/api/agents/commands', 'GET', null, true)
      
      if (response.data.success && response.data.commands.length > 0) {
        console.log(`📨 Received ${response.data.commands.length} command(s)`)
        
        for (const command of response.data.commands) {
          await this.executeCommand(command)
        }
      }
    } catch (error) {
      console.error('❌ Command polling failed:', error.message)
    }
  }

  async executeCommand(command) {
    console.log(`⚡ Executing command: ${command.type}`)
    
    let result = null
    let error = null
    
    try {
      switch (command.type) {
        case 'disable-usb':
          result = await this.disableUSB()
          break
          
        case 'enable-usb':
          result = await this.enableUSB()
          break
          
        case 'block-git':
          result = await this.blockGit()
          break
          
        case 'unblock-git':
          result = await this.unblockGit()
          break
          
        case 'get-status':
          result = await this.getSystemStatus()
          break
          
        case 'restart-agent':
          result = { message: 'Agent restart requested' }
          console.log('🔄 Agent restart requested - simulating...')
          break
          
        default:
          error = `Unknown command type: ${command.type}`
      }
    } catch (err) {
      error = err.message
    }
    
    // Report command completion
    await this.reportCommandCompletion(command.id, result, error)
  }

  async disableUSB() {
    console.log('🔌 Simulating USB disable...')
    // In a real agent, this would disable USB ports
    return { message: 'USB ports disabled', timestamp: new Date().toISOString() }
  }

  async enableUSB() {
    console.log('🔌 Simulating USB enable...')
    // In a real agent, this would enable USB ports
    return { message: 'USB ports enabled', timestamp: new Date().toISOString() }
  }

  async blockGit() {
    console.log('🚫 Simulating Git blocking...')
    // In a real agent, this would block git commands
    return { message: 'Git commands blocked', timestamp: new Date().toISOString() }
  }

  async unblockGit() {
    console.log('✅ Simulating Git unblocking...')
    // In a real agent, this would unblock git commands
    return { message: 'Git commands unblocked', timestamp: new Date().toISOString() }
  }

  async getSystemStatus() {
    return {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      uptime: os.uptime(),
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        used: os.totalmem() - os.freemem()
      },
      cpus: os.cpus().length,
      networkInterfaces: Object.keys(os.networkInterfaces()),
      timestamp: new Date().toISOString()
    }
  }

  async reportCommandCompletion(commandId, result, error) {
    try {
      const response = await this.makeRequest('/api/agents/commands', 'POST', {
        commandId,
        result,
        error
      }, true)
      
      if (response.data.success) {
        console.log(`✅ Command ${commandId} completion reported`)
      } else {
        console.error(`❌ Failed to report command completion: ${response.data.error}`)
      }
    } catch (err) {
      console.error('❌ Error reporting command completion:', err.message)
    }
  }

  async start() {
    console.log('🚀 Starting InSafe Test Agent...')
    
    // Register with server
    const registered = await this.register()
    if (!registered) {
      console.error('❌ Failed to register. Exiting.')
      process.exit(1)
    }
    
    this.isRunning = true
    
    // Send initial heartbeat
    await this.sendHeartbeat()
    
    // Start polling loop
    console.log(`🔄 Starting polling loop (${this.pollInterval}ms interval)`)
    
    const poll = async () => {
      if (!this.isRunning) return
      
      await this.pollForCommands()
      await this.sendHeartbeat()
      
      setTimeout(poll, this.pollInterval)
    }
    
    poll()
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\\n🛑 Shutting down agent...')
      this.isRunning = false
      process.exit(0)
    })
    
    console.log('✅ Agent is running! Press Ctrl+C to stop.')
  }
}

// Parse command line arguments
const args = process.argv.slice(2)
const serverUrl = args[0] || 'http://localhost:3000'

// Start the test agent
const agent = new InSafeTestAgent(serverUrl)
agent.start().catch(error => {
  console.error('❌ Agent startup failed:', error)
  process.exit(1)
})