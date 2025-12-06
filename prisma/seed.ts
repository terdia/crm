import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.activity.deleteMany()
  await prisma.deal.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.company.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  // Create demo users
  const hashedPassword = await bcrypt.hash('demo123', 10)

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin Demo',
      email: 'admin@demo.com',
      password: hashedPassword,
      role: 'admin',
    },
  })

  const managerUser = await prisma.user.create({
    data: {
      name: 'Manager Demo',
      email: 'manager@demo.com',
      password: hashedPassword,
      role: 'manager',
    },
  })

  const salesUser = await prisma.user.create({
    data: {
      name: 'Sales Demo',
      email: 'sales@demo.com',
      password: hashedPassword,
      role: 'sales',
    },
  })

  const viewerUser = await prisma.user.create({
    data: {
      name: 'Viewer Demo',
      email: 'viewer@demo.com',
      password: hashedPassword,
      role: 'viewer',
    },
  })

  console.log('Created demo users:')
  console.log('  Admin:   admin@demo.com / demo123')
  console.log('  Manager: manager@demo.com / demo123')
  console.log('  Sales:   sales@demo.com / demo123')
  console.log('  Viewer:  viewer@demo.com / demo123')

  // Create companies
  const companies = await Promise.all([
    prisma.company.create({
      data: {
        name: 'TechCorp Solutions',
        industry: 'Technology',
        website: 'https://techcorp.example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Tech Street, San Francisco, CA 94105',
        employees: 250,
        revenue: 15000000,
      },
    }),
    prisma.company.create({
      data: {
        name: 'Global Innovations Inc',
        industry: 'Manufacturing',
        website: 'https://globalinnovations.example.com',
        phone: '+1 (555) 234-5678',
        address: '456 Innovation Ave, Austin, TX 78701',
        employees: 500,
        revenue: 45000000,
      },
    }),
    prisma.company.create({
      data: {
        name: 'Green Energy Partners',
        industry: 'Energy',
        website: 'https://greenenergy.example.com',
        phone: '+1 (555) 345-6789',
        address: '789 Eco Blvd, Seattle, WA 98101',
        employees: 150,
        revenue: 8500000,
      },
    }),
    prisma.company.create({
      data: {
        name: 'HealthFirst Medical',
        industry: 'Healthcare',
        website: 'https://healthfirst.example.com',
        phone: '+1 (555) 456-7890',
        address: '321 Medical Center Dr, Boston, MA 02108',
        employees: 1200,
        revenue: 125000000,
      },
    }),
    prisma.company.create({
      data: {
        name: 'DataStream Analytics',
        industry: 'Technology',
        website: 'https://datastream.example.com',
        phone: '+1 (555) 567-8901',
        address: '654 Data Way, New York, NY 10001',
        employees: 85,
        revenue: 6200000,
      },
    }),
  ])

  // Create contacts
  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@techcorp.example.com',
        phone: '+1 (555) 123-1001',
        position: 'CEO',
        companyId: companies[0].id,
        status: 'active',
        notes: 'Key decision maker, interested in enterprise solutions',
      },
    }),
    prisma.contact.create({
      data: {
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@techcorp.example.com',
        phone: '+1 (555) 123-1002',
        position: 'CTO',
        companyId: companies[0].id,
        status: 'active',
        notes: 'Technical contact, evaluating infrastructure solutions',
      },
    }),
    prisma.contact.create({
      data: {
        firstName: 'Emily',
        lastName: 'Rodriguez',
        email: 'emily.rodriguez@globalinnovations.example.com',
        phone: '+1 (555) 234-2001',
        position: 'VP of Operations',
        companyId: companies[1].id,
        status: 'active',
        notes: 'Looking to streamline manufacturing processes',
      },
    }),
    prisma.contact.create({
      data: {
        firstName: 'David',
        lastName: 'Thompson',
        email: 'david.thompson@greenenergy.example.com',
        phone: '+1 (555) 345-3001',
        position: 'Director of Business Development',
        companyId: companies[2].id,
        status: 'lead',
        notes: 'Potential partnership opportunity, schedule follow-up',
      },
    }),
    prisma.contact.create({
      data: {
        firstName: 'Jennifer',
        lastName: 'Martinez',
        email: 'jennifer.martinez@healthfirst.example.com',
        phone: '+1 (555) 456-4001',
        position: 'Procurement Manager',
        companyId: companies[3].id,
        status: 'active',
        notes: 'Evaluating suppliers for medical equipment',
      },
    }),
    prisma.contact.create({
      data: {
        firstName: 'Robert',
        lastName: 'Kim',
        email: 'robert.kim@datastream.example.com',
        phone: '+1 (555) 567-5001',
        position: 'Founder & CEO',
        companyId: companies[4].id,
        status: 'active',
        notes: 'Fast-growing startup, high potential value',
      },
    }),
    prisma.contact.create({
      data: {
        firstName: 'Lisa',
        lastName: 'Anderson',
        email: 'lisa.anderson@example.com',
        phone: '+1 (555) 678-9012',
        position: 'Independent Consultant',
        status: 'lead',
        notes: 'Met at conference, interested in our services',
      },
    }),
    prisma.contact.create({
      data: {
        firstName: 'James',
        lastName: 'Wilson',
        email: 'james.wilson@globalinnovations.example.com',
        phone: '+1 (555) 234-2002',
        position: 'CFO',
        companyId: companies[1].id,
        status: 'active',
        notes: 'Budget approval authority',
      },
    }),
  ])

  // Create deals
  const deals = await Promise.all([
    prisma.deal.create({
      data: {
        title: 'Enterprise Software License',
        value: 125000,
        stage: 'proposal',
        probability: 60,
        expectedCloseDate: new Date('2025-02-15'),
        companyId: companies[0].id,
        contactId: contacts[0].id,
        description: '3-year enterprise license for 250 users',
      },
    }),
    prisma.deal.create({
      data: {
        title: 'Cloud Infrastructure Upgrade',
        value: 85000,
        stage: 'negotiation',
        probability: 75,
        expectedCloseDate: new Date('2025-01-30'),
        companyId: companies[0].id,
        contactId: contacts[1].id,
        description: 'Migration to cloud infrastructure with managed services',
      },
    }),
    prisma.deal.create({
      data: {
        title: 'Manufacturing ERP System',
        value: 450000,
        stage: 'qualified',
        probability: 40,
        expectedCloseDate: new Date('2025-04-01'),
        companyId: companies[1].id,
        contactId: contacts[2].id,
        description: 'Complete ERP implementation for manufacturing operations',
      },
    }),
    prisma.deal.create({
      data: {
        title: 'Partnership Agreement',
        value: 250000,
        stage: 'lead',
        probability: 25,
        expectedCloseDate: new Date('2025-05-15'),
        companyId: companies[2].id,
        contactId: contacts[3].id,
        description: 'Strategic partnership for renewable energy projects',
      },
    }),
    prisma.deal.create({
      data: {
        title: 'Medical Equipment Supply Contract',
        value: 680000,
        stage: 'negotiation',
        probability: 80,
        expectedCloseDate: new Date('2025-01-20'),
        companyId: companies[3].id,
        contactId: contacts[4].id,
        description: 'Annual supply contract for medical equipment',
      },
    }),
    prisma.deal.create({
      data: {
        title: 'Analytics Platform Subscription',
        value: 48000,
        stage: 'closed_won',
        probability: 100,
        expectedCloseDate: new Date('2024-12-01'),
        actualCloseDate: new Date('2024-11-28'),
        companyId: companies[4].id,
        contactId: contacts[5].id,
        description: 'Annual subscription to analytics platform',
      },
    }),
    prisma.deal.create({
      data: {
        title: 'Consulting Services',
        value: 35000,
        stage: 'proposal',
        probability: 50,
        expectedCloseDate: new Date('2025-02-01'),
        contactId: contacts[6].id,
        description: '6-month consulting engagement',
      },
    }),
    prisma.deal.create({
      data: {
        title: 'Security Audit & Compliance',
        value: 95000,
        stage: 'closed_won',
        probability: 100,
        expectedCloseDate: new Date('2024-11-15'),
        actualCloseDate: new Date('2024-11-10'),
        companyId: companies[1].id,
        contactId: contacts[7].id,
        description: 'Complete security audit and compliance certification',
      },
    }),
  ])

  // Create activities
  await Promise.all([
    prisma.activity.create({
      data: {
        type: 'meeting',
        subject: 'Product Demo',
        description: 'Demonstrate new features to Sarah and her team',
        dueDate: new Date('2024-12-10T14:00:00'),
        contactId: contacts[0].id,
        dealId: deals[0].id,
        completed: false,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'call',
        subject: 'Technical Discussion',
        description: 'Discuss infrastructure requirements with Michael',
        dueDate: new Date('2024-12-08T10:00:00'),
        contactId: contacts[1].id,
        dealId: deals[1].id,
        completed: true,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'email',
        subject: 'Send Proposal',
        description: 'Send detailed proposal for ERP implementation',
        dueDate: new Date('2024-12-07T09:00:00'),
        contactId: contacts[2].id,
        dealId: deals[2].id,
        completed: true,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'task',
        subject: 'Follow up on partnership',
        description: 'Schedule follow-up meeting with David',
        dueDate: new Date('2024-12-12T15:00:00'),
        contactId: contacts[3].id,
        dealId: deals[3].id,
        completed: false,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'meeting',
        subject: 'Contract Negotiation',
        description: 'Final contract negotiation meeting',
        dueDate: new Date('2024-12-09T13:00:00'),
        contactId: contacts[4].id,
        dealId: deals[4].id,
        completed: false,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'note',
        subject: 'Customer Success Check-in',
        description: 'Quarterly check-in with Robert on platform usage',
        dueDate: new Date('2024-12-15T11:00:00'),
        contactId: contacts[5].id,
        completed: false,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'call',
        subject: 'Introduction Call',
        description: 'Initial discovery call with Lisa',
        dueDate: new Date('2024-12-11T16:00:00'),
        contactId: contacts[6].id,
        dealId: deals[6].id,
        completed: false,
      },
    }),
  ])

  console.log('Database seeded successfully!')
  console.log(`Created ${companies.length} companies`)
  console.log(`Created ${contacts.length} contacts`)
  console.log(`Created ${deals.length} deals`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
