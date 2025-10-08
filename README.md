# InSafe - Insider Threat Security Platform

![InSafe Logo](./public/wema-logo.jpeg)

**InSafe** is a comprehensive insider threat detection and monitoring platform designed for financial institutions. Built specifically for Wema Bank, it provides real-time monitoring, risk assessment, and automated response capabilities to protect against internal security threats.

## 🚀 Overview

InSafe leverages advanced behavioral analytics, machine learning, and real-time monitoring to detect, analyze, and respond to potential insider threats. The platform provides a unified dashboard for security teams to monitor employee activities, assess risk levels, and implement security controls across the organization.

### Key Features

- **Real-time Activity Monitoring** - Monitor user activities across all systems and endpoints
- **Behavioral Analytics** - AI-powered analysis to detect anomalous behavior patterns
- **Risk Scoring** - Dynamic risk assessment based on user behavior and context
- **Automated Alerts** - Intelligent alerting system with customizable thresholds
- **Incident Response** - Streamlined workflow for investigating and responding to threats
- **Compliance Reporting** - Generate reports for regulatory compliance requirements
- **User Risk Profiling** - Comprehensive employee risk assessment and classification
- **Policy Enforcement** - Automated enforcement of security policies and restrictions

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [User Guide](#user-guide)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🔍 Activity Monitoring
- **Real-time Tracking**: Monitor file access, system logins, network activity, and application usage
- **Multi-platform Support**: Windows, macOS, Linux endpoint monitoring
- **Cloud Integration**: Monitor activities across cloud platforms (AWS, Azure, Google Cloud)
- **Database Activity**: Track database queries, exports, and administrative actions
- **Email & Communication**: Monitor email patterns and communication anomalies

### 🧠 Behavioral Analytics
- **Machine Learning Models**: Advanced algorithms to establish behavioral baselines
- **Anomaly Detection**: Identify deviations from normal user behavior patterns
- **Risk Indicators**: Track access patterns, working hours, location anomalies
- **Peer Group Analysis**: Compare behavior against similar roles and departments
- **Temporal Analysis**: Detect unusual activity timing and frequency patterns

### ⚠️ Intelligent Alerting
- **Severity Classification**: Critical, High, Medium, Low risk categorization
- **Custom Thresholds**: Configurable alert criteria based on organizational needs
- **False Positive Reduction**: ML-driven filtering to minimize alert fatigue
- **Escalation Workflows**: Automated escalation based on alert severity and response time
- **Multi-channel Notifications**: Email, SMS, in-app, and integration with SIEM systems

### 👥 User Risk Management
- **Dynamic Risk Scoring**: Real-time calculation based on multiple risk factors
- **Risk Categories**: Classify users as High, Medium, or Low risk
- **Privileged User Monitoring**: Enhanced monitoring for administrators and privileged accounts
- **Onboarding/Offboarding**: Special monitoring during employee lifecycle changes
- **Contractor & Vendor Tracking**: Monitor external user access and activities

### 📊 Dashboard & Reporting
- **Executive Dashboard**: High-level security posture and key metrics
- **Analyst Workbench**: Detailed investigation tools and case management
- **Compliance Reports**: Automated generation of regulatory compliance reports
- **Custom Dashboards**: Configurable views for different user roles
- **Data Export**: Export data for external analysis and archival

### 🔒 Policy Enforcement
- **Access Controls**: Automated enforcement of data access policies
- **Data Loss Prevention**: Monitor and prevent unauthorized data exfiltration
- **Time-based Restrictions**: Enforce working hour access policies
- **Geographic Controls**: Location-based access restrictions
- **Application Blocking**: Real-time blocking of unauthorized applications

## 🛠 Technology Stack

### Frontend
- **Next.js 15.5.4** - React framework with App Router
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern React component library
- **Lucide React** - Beautiful & consistent icons
- **Sonner** - Toast notifications
- **Date-fns** - Modern JavaScript date utility library

### Backend & Infrastructure
- **Node.js** - JavaScript runtime for server-side development
- **RESTful APIs** - Standard HTTP APIs for data exchange
- **Real-time Processing** - WebSocket connections for live updates
- **Message Queuing** - For handling high-volume activity data

### Data & Analytics
- **Time-series Database** - For storing activity and monitoring data
- **Machine Learning Pipeline** - For behavioral analysis and anomaly detection
- **Data Lake** - For long-term storage and historical analysis
- **ETL Processes** - For data transformation and enrichment

### Security & Compliance
- **OAuth 2.0 / OIDC** - Authentication and authorization
- **Role-based Access Control (RBAC)** - Granular permission management
- **Data Encryption** - At-rest and in-transit encryption
- **Audit Logging** - Comprehensive audit trail
- **SOC 2 Type II Compliance** - Security and availability controls

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** for version control

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tachy-22/insafe.git
   cd insafe
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Credentials
For testing and evaluation purposes:
- **Username**: `admin@wemabank.com`
- **Password**: `admin123`

## 📦 Installation

### Development Environment

1. **Clone and setup**
   ```bash
   git clone https://github.com/Tachy-22/insafe.git
   cd insafe
   npm install
   ```

2. **Configure environment**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Edit configuration
   nano .env.local
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

### Production Deployment

#### Using Docker

1. **Build Docker image**
   ```bash
   docker build -t insafe:latest .
   ```

2. **Run container**
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL="your-database-url" \
     -e NEXTAUTH_SECRET="your-secret" \
     insafe:latest
   ```

#### Using Vercel (Recommended)

1. **Deploy to Vercel**
   ```bash
   npm run build
   vercel --prod
   ```

2. **Configure environment variables**
   Set up environment variables in the Vercel dashboard.

#### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/insafe

# Redis (for caching and sessions)
REDIS_URL=redis://localhost:6379

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password

# External APIs
ML_SERVICE_URL=http://localhost:8000
SIEM_INTEGRATION_URL=http://your-siem-system.com/api

# Security
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key

# Monitoring
SENTRY_DSN=your-sentry-dsn
ANALYTICS_ID=your-analytics-id
```

### Application Configuration

The application can be configured through the `config/app.js` file:

```javascript
module.exports = {
  // Risk scoring thresholds
  riskThresholds: {
    high: 7,
    medium: 4,
    low: 0
  },
  
  // Alert configuration
  alerts: {
    maxPerHour: 50,
    escalationTime: 30, // minutes
    retentionDays: 90
  },
  
  // Monitoring settings
  monitoring: {
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5,
    lockoutDuration: 15 // minutes
  }
}
```

## 📖 User Guide

### Dashboard Overview

The main dashboard provides a comprehensive view of your organization's security posture:

#### Key Metrics
- **Total Employees Monitored**: Real-time count of active users
- **Active Alerts**: Current security alerts requiring attention
- **Risk Score**: Organization-wide risk assessment
- **System Health**: Platform operational status

#### Quick Actions
- **View Critical Alerts**: Access high-priority security incidents
- **Employee Risk Review**: Review users with elevated risk scores
- **System Reports**: Generate compliance and security reports
- **Policy Management**: Configure security policies and rules

### Activity Monitoring

#### Real-time Activity Feed
Monitor user activities as they happen:
- File access and modifications
- System login/logout events
- Application usage
- Network connections
- Email and communication activities

#### Activity Categories
- **File Operations**: Create, Read, Update, Delete operations
- **System Access**: Login attempts, privilege escalations
- **Data Movement**: File transfers, email attachments, cloud uploads
- **Application Usage**: Software usage patterns and anomalies

### Alert Management

#### Alert Types
1. **Critical**: Immediate security threats requiring instant response
2. **High**: Significant risks that need prompt investigation
3. **Medium**: Moderate concerns for routine review
4. **Low**: Minor anomalies for awareness

#### Investigation Workflow
1. **Alert Triage**: Initial assessment and categorization
2. **Evidence Gathering**: Collect relevant activity data and context
3. **Analysis**: Determine threat validity and impact
4. **Response**: Take appropriate action (block, monitor, escalate)
5. **Documentation**: Record findings and actions taken

### Employee Risk Management

#### Risk Factors
- **Behavioral Changes**: Deviations from established patterns
- **Access Patterns**: Unusual data or system access
- **Time Anomalies**: Activity outside normal working hours
- **Location Variance**: Access from unexpected locations
- **Privilege Usage**: Elevation or misuse of access rights

#### Risk Mitigation
- **Enhanced Monitoring**: Increase surveillance for high-risk users
- **Access Restrictions**: Limit permissions based on risk level
- **Manager Notifications**: Alert supervisors to concerning behavior
- **Training Requirements**: Mandate security awareness training

### Reports & Analytics

#### Standard Reports
- **Daily Security Summary**: Overview of security events and metrics
- **Weekly Risk Assessment**: Trend analysis and risk progression
- **Monthly Compliance Report**: Regulatory compliance status
- **Quarterly Executive Brief**: High-level security posture summary

#### Custom Reports
- **Ad-hoc Queries**: Custom data analysis and visualization
- **Scheduled Reports**: Automated report generation and distribution
- **Data Export**: CSV, PDF, and API export capabilities
- **Historical Analysis**: Long-term trend and pattern analysis

## 🔌 API Documentation

### Authentication

All API requests require authentication using JWT tokens:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     https://api.insafe.com/v1/endpoint
```

### Core Endpoints

#### Activities
```bash
# Get user activities
GET /api/activities?employeeId={id}&limit=50

# Create new activity record
POST /api/activities
Content-Type: application/json
{
  "employeeId": "emp_123",
  "action": "file_access",
  "resource": "/sensitive/data.xlsx",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Alerts
```bash
# Get alerts
GET /api/alerts?severity=high&status=open

# Update alert status
PUT /api/alerts/{alertId}
Content-Type: application/json
{
  "status": "investigating",
  "assignedTo": "analyst_001",
  "notes": "Initial investigation started"
}
```

#### Employees
```bash
# Get employee list
GET /api/employees?department=IT&riskLevel=high

# Update employee risk score
PUT /api/employees/{employeeId}
Content-Type: application/json
{
  "riskScore": 8.5,
  "riskFactors": ["unusual_hours", "data_access_spike"]
}
```

#### Dashboard Metrics
```bash
# Get dashboard data
GET /api/dashboard

Response:
{
  "totalEmployees": 1247,
  "activeAlerts": 23,
  "riskScore": 6.2,
  "systemHealth": "operational"
}
```

### Webhooks

Configure webhooks to receive real-time notifications:

```bash
# Register webhook
POST /api/webhooks
Content-Type: application/json
{
  "url": "https://your-system.com/webhook",
  "events": ["alert.created", "user.risk_changed"],
  "secret": "webhook_secret"
}
```

## 🔒 Security

### Security Architecture

InSafe implements multiple layers of security to protect sensitive data:

#### Authentication & Authorization
- **Multi-factor Authentication (MFA)**: Required for all admin accounts
- **Single Sign-On (SSO)**: Integration with corporate identity providers
- **Role-based Access Control**: Granular permissions based on job function
- **Session Management**: Secure session handling with automatic timeouts

#### Data Protection
- **Encryption at Rest**: AES-256 encryption for stored data
- **Encryption in Transit**: TLS 1.3 for all communications
- **Data Anonymization**: PII protection in logs and reports
- **Secure Key Management**: Hardware security modules for key storage

#### Network Security
- **API Rate Limiting**: Protection against abuse and DDoS attacks
- **IP Whitelisting**: Restrict access to authorized networks
- **VPN Integration**: Secure remote access capabilities
- **Network Segmentation**: Isolated security zones for sensitive operations

#### Compliance & Auditing
- **SOC 2 Type II**: Annual compliance certification
- **ISO 27001**: Information security management standards
- **GDPR Compliance**: Data privacy and protection compliance
- **Audit Logging**: Comprehensive audit trail for all actions

### Security Best Practices

#### For Administrators
1. **Regular Security Reviews**: Monthly access and permission audits
2. **Incident Response Plan**: Documented procedures for security incidents
3. **Backup & Recovery**: Regular backups and disaster recovery testing
4. **Security Training**: Ongoing security awareness programs

#### For Users
1. **Strong Passwords**: Enforce complex password requirements
2. **Regular Updates**: Keep systems and applications current
3. **Suspicious Activity Reporting**: Encourage reporting of anomalies
4. **Clean Desk Policy**: Secure sensitive information when not in use

## 🚀 Deployment

### Production Deployment Checklist

#### Pre-deployment
- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] SSL certificates installed
- [ ] Backup procedures tested
- [ ] Security scan completed
- [ ] Performance testing passed

#### Deployment Process
1. **Code Review**: Peer review of all changes
2. **Staging Deployment**: Deploy to staging environment
3. **User Acceptance Testing**: Validate functionality
4. **Production Deployment**: Deploy to production
5. **Smoke Testing**: Verify core functionality
6. **Monitoring**: Monitor system health and performance

#### Post-deployment
- [ ] Application health verified
- [ ] Error rates within acceptable limits
- [ ] Performance metrics normal
- [ ] User acceptance confirmed
- [ ] Documentation updated

### Scaling Considerations

#### Horizontal Scaling
- **Load Balancers**: Distribute traffic across multiple instances
- **Database Clustering**: Scale database operations
- **Microservices**: Break down monolithic components
- **CDN Integration**: Improve global performance

#### Vertical Scaling
- **Resource Optimization**: CPU, memory, and storage optimization
- **Database Tuning**: Query optimization and indexing
- **Caching Strategy**: Redis/Memcached for improved performance
- **Asset Optimization**: Minimize and compress static assets

## 🤝 Contributing

We welcome contributions from the community! Please follow these guidelines:

### Development Workflow

1. **Fork the Repository**
   ```bash
   git fork https://github.com/Tachy-22/insafe.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Write clean, documented code
   - Add tests for new functionality
   - Update documentation as needed

4. **Test Your Changes**
   ```bash
   npm run test
   npm run lint
   npm run build
   ```

5. **Submit Pull Request**
   - Provide clear description of changes
   - Link to relevant issues
   - Ensure all checks pass

### Code Standards

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow established linting rules
- **Prettier**: Consistent code formatting
- **Testing**: Maintain test coverage above 80%
- **Documentation**: Document all public APIs

### Bug Reports

When reporting bugs, please include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details
- Screenshots or logs (if applicable)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

### Contact Information
- **Email**: support@insafe.com
- **Documentation**: https://docs.insafe.com
- **Community Forum**: https://community.insafe.com
- **Emergency Support**: +1-800-INSAFE-1

### Support Channels
- **Email Support**: Technical questions and general inquiries
- **Live Chat**: Real-time assistance during business hours
- **Knowledge Base**: Self-service documentation and tutorials
- **Professional Services**: Custom implementation and consulting

### Business Hours
- **Monday - Friday**: 8:00 AM - 6:00 PM EST
- **Emergency Support**: 24/7 for critical security incidents
- **Response Times**: 
  - Critical: < 1 hour
  - High: < 4 hours
  - Medium: < 24 hours
  - Low: < 48 hours

---

## 📈 Roadmap

### Q1 2024
- [ ] Machine Learning Model Improvements
- [ ] Mobile Application Launch
- [ ] Advanced Behavioral Analytics
- [ ] SIEM Integration Enhancements

### Q2 2024
- [ ] Cloud Security Monitoring
- [ ] Automated Response Actions
- [ ] Enhanced Reporting Dashboard
- [ ] Multi-tenant Architecture

### Q3 2024
- [ ] AI-Powered Threat Hunting
- [ ] Zero Trust Integration
- [ ] Advanced Compliance Reporting
- [ ] Performance Optimizations

### Q4 2024
- [ ] Global Deployment Support
- [ ] Advanced API Management
- [ ] Enhanced User Experience
- [ ] Next-Generation Analytics

---

**InSafe** - Protecting organizations from insider threats through intelligent monitoring and analysis.

*Built with ❤️ for financial institutions worldwide.*
