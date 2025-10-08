// Sample data seeding script for testing
import { employeeService, agentService, alertService, activityService } from '../lib/database';
import { Timestamp } from 'firebase/firestore';

const sampleEmployees = [
  {
    employeeId: 'EMP001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@wemabank.com',
    department: 'IT',
    role: 'Software Developer',
    hireDate: Timestamp.fromDate(new Date('2023-01-15')),
    status: 'ACTIVE' as const,
    riskLevel: 'LOW' as const,
    riskScore: 2,
    lastActivity: Timestamp.now(),
    permissions: ['read', 'write']
  },
  {
    employeeId: 'EMP002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@wemabank.com',
    department: 'Finance',
    role: 'Financial Analyst',
    hireDate: Timestamp.fromDate(new Date('2022-06-10')),
    status: 'ACTIVE' as const,
    riskLevel: 'MEDIUM' as const,
    riskScore: 5,
    lastActivity: Timestamp.now(),
    permissions: ['read', 'write', 'financial_data']
  },
  {
    employeeId: 'EMP003',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@wemabank.com',
    department: 'Security',
    role: 'Security Analyst',
    hireDate: Timestamp.fromDate(new Date('2021-03-20')),
    status: 'ACTIVE' as const,
    riskLevel: 'HIGH' as const,
    riskScore: 7,
    lastActivity: Timestamp.now(),
    permissions: ['read', 'write', 'admin', 'security']
  }
];

export async function seedDatabase() {
  console.log('🌱 Seeding database with sample data...');
  
  try {
    // Create employees
    for (const empData of sampleEmployees) {
      const employeeId = await employeeService.create(empData);
      console.log(`✅ Created employee: ${empData.firstName} ${empData.lastName} (${employeeId})`);
      
      // Create sample alerts for high-risk employees
      if (empData.riskLevel === 'HIGH' || empData.riskLevel === 'CRITICAL') {
        await alertService.create({
          employeeId,
          type: 'high_risk_activity',
          severity: 'HIGH',
          title: 'Unusual File Access Pattern',
          description: `${empData.firstName} ${empData.lastName} accessed sensitive files outside normal hours`,
          details: {
            files: ['financial_report_2024.xlsx', 'customer_data.csv'],
            time: '23:45',
            location: 'Remote'
          },
          status: 'open'
        });
      }
      
      // Create sample activities
      await activityService.create({
        employeeId,
        agentId: 'pending', // Will be updated when agent registers
        type: 'file_access',
        description: `File access: document.pdf`,
        details: {
          fileName: 'document.pdf',
          filePath: '/home/user/documents/',
          size: 1024000
        },
        riskLevel: 'LOW',
        blocked: false,
        timestamp: Timestamp.now()
      });
    }
    
    console.log('✅ Database seeded successfully!');
    console.log('📝 Sample employees, alerts, and activities created');
    console.log('🔐 Use Firebase Authentication to create admin users');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}