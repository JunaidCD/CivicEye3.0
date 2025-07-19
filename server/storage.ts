import { users, properties, reports, taxNotices, type User, type Property, type Report, type TaxNotice, type InsertUser, type InsertProperty, type InsertReport, type InsertTaxNotice } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: number, points: number): Promise<void>;
  getLeaderboard(limit?: number): Promise<User[]>;

  // Property methods
  getProperty(id: number): Promise<Property | undefined>;
  getProperties(filters?: { status?: string; limit?: number }): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, updates: Partial<Property>): Promise<Property | undefined>;
  updatePropertyStatus(id: number, status: string): Promise<void>;
  incrementReportCount(id: number): Promise<void>;

  // Report methods
  getReport(id: number): Promise<Report | undefined>;
  getReports(propertyId?: number, userId?: number): Promise<Report[]>;
  createReport(report: InsertReport & { userId: number }): Promise<Report>;
  getReportsByUser(userId: number): Promise<Report[]>;

  // Tax Notice methods
  getTaxNotice(id: number): Promise<TaxNotice | undefined>;
  getTaxNotices(propertyId?: number): Promise<TaxNotice[]>;
  createTaxNotice(taxNotice: InsertTaxNotice): Promise<TaxNotice>;
  updateTaxNoticeStatus(id: number, status: string, transactionHash?: string): Promise<void>;

  // Statistics
  getStats(): Promise<{
    propertiesReported: number;
    taxRecovered: string;
    activeReporters: number;
    confirmedVacant: number;
    investigating: number;
    totalReports: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private reports: Map<number, Report>;
  private taxNotices: Map<number, TaxNotice>;
  private currentUserId: number;
  private currentPropertyId: number;
  private currentReportId: number;
  private currentTaxNoticeId: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.reports = new Map();
    this.taxNotices = new Map();
    this.currentUserId = 1;
    this.currentPropertyId = 1;
    this.currentReportId = 1;
    this.currentTaxNoticeId = 1;
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample data
    const sampleUsers: User[] = [
      { id: 1, username: "junaid", email: "junaid@example.com", password: "password", points: 2847, rank: 1, badge: "Urban Guardian", createdAt: new Date() },
      { id: 2, username: "sarah_martinez", email: "sarah@example.com", password: "password", points: 2156, rank: 2, badge: "Community Hero", createdAt: new Date() },
      { id: 3, username: "emily_chen", email: "emily@example.com", password: "password", points: 1923, rank: 3, badge: "Civic Champion", createdAt: new Date() },
      { id: 4, username: "david_johnson", email: "david@example.com", password: "password", points: 847, rank: 12, badge: "Rising Star", createdAt: new Date() },
    ];

    const sampleProperties: Property[] = [
      {
        id: 1,
        address: "1247 Oak Street, District 5",
        latitude: "40.7128",
        longitude: "-74.0060",
        propertyType: "Residential - Single Family",
        status: "Investigating",
        vacancyScore: 87,
        reportCount: 3,
        lastUtilityReading: new Date(Date.now() - 8 * 30 * 24 * 60 * 60 * 1000),
        estimatedTaxLoss: "8450.00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        address: "892 Commercial Ave, Downtown",
        latitude: "40.7589",
        longitude: "-73.9851",
        propertyType: "Commercial",
        status: "Confirmed Vacant",
        vacancyScore: 94,
        reportCount: 7,
        lastUtilityReading: new Date(Date.now() - 14 * 30 * 24 * 60 * 60 * 1000),
        estimatedTaxLoss: "23680.00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        address: "456 Residential Blvd, Midtown",
        latitude: "40.7614",
        longitude: "-73.9776",
        propertyType: "Residential - Multi-Family",
        status: "Reported",
        vacancyScore: 72,
        reportCount: 2,
        lastUtilityReading: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000),
        estimatedTaxLoss: "5230.00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        address: "789 Industrial Way, West Side",
        latitude: "40.7505",
        longitude: "-74.0138",
        propertyType: "Industrial",
        status: "Penalty Issued",
        vacancyScore: 96,
        reportCount: 12,
        lastUtilityReading: new Date(Date.now() - 18 * 30 * 24 * 60 * 60 * 1000),
        estimatedTaxLoss: "45200.00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        address: "321 Elm Avenue, Eastside",
        latitude: "40.7282",
        longitude: "-73.9942",
        propertyType: "Residential - Single Family",
        status: "Confirmed Vacant",
        vacancyScore: 89,
        reportCount: 5,
        lastUtilityReading: new Date(Date.now() - 11 * 30 * 24 * 60 * 60 * 1000),
        estimatedTaxLoss: "12750.00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        address: "567 Mixed Use Plaza, Central",
        latitude: "40.7440",
        longitude: "-73.9903",
        propertyType: "Mixed Use",
        status: "Investigating",
        vacancyScore: 78,
        reportCount: 4,
        lastUtilityReading: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000),
        estimatedTaxLoss: "18920.00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 7,
        address: "134 Pine Street, Northside",
        latitude: "40.7690",
        longitude: "-73.9820",
        propertyType: "Residential - Multi-Family",
        status: "Reported",
        vacancyScore: 65,
        reportCount: 1,
        lastUtilityReading: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000),
        estimatedTaxLoss: "7340.00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 8,
        address: "890 Warehouse District, South",
        latitude: "40.7090",
        longitude: "-74.0130",
        propertyType: "Industrial",
        status: "Confirmed Vacant",
        vacancyScore: 92,
        reportCount: 8,
        lastUtilityReading: new Date(Date.now() - 16 * 30 * 24 * 60 * 60 * 1000),
        estimatedTaxLoss: "38650.00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleUsers.forEach(user => this.users.set(user.id, user));
    sampleProperties.forEach(property => this.properties.set(property.id, property));
    
    this.currentUserId = sampleUsers.length + 1;
    this.currentPropertyId = sampleProperties.length + 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      points: 0,
      rank: 0,
      badge: "Newcomer",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPoints(userId: number, points: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.points = (user.points || 0) + points;
      this.users.set(userId, user);
    }
  }

  async getLeaderboard(limit = 10): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, limit);
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getProperties(filters?: { status?: string; limit?: number }): Promise<Property[]> {
    let properties = Array.from(this.properties.values());
    
    if (filters?.status) {
      properties = properties.filter(p => p.status === filters.status);
    }
    
    if (filters?.limit) {
      properties = properties.slice(0, filters.limit);
    }
    
    return properties;
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.currentPropertyId++;
    const property: Property = {
      ...insertProperty,
      id,
      status: "Reported",
      vacancyScore: 0,
      reportCount: 0,
      lastUtilityReading: null,
      latitude: insertProperty.latitude || null,
      longitude: insertProperty.longitude || null,
      estimatedTaxLoss: insertProperty.estimatedTaxLoss || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.properties.set(id, property);
    return property;
  }

  async updateProperty(id: number, updates: Partial<Property>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (property) {
      const updatedProperty = { ...property, ...updates, updatedAt: new Date() };
      this.properties.set(id, updatedProperty);
      return updatedProperty;
    }
    return undefined;
  }

  async updatePropertyStatus(id: number, status: string): Promise<void> {
    const property = this.properties.get(id);
    if (property) {
      property.status = status;
      property.updatedAt = new Date();
      this.properties.set(id, property);
    }
  }

  async incrementReportCount(id: number): Promise<void> {
    const property = this.properties.get(id);
    if (property) {
      property.reportCount = (property.reportCount || 0) + 1;
      property.updatedAt = new Date();
      this.properties.set(id, property);
    }
  }

  async getReport(id: number): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async getReports(propertyId?: number, userId?: number): Promise<Report[]> {
    let reports = Array.from(this.reports.values());
    
    if (propertyId) {
      reports = reports.filter(r => r.propertyId === propertyId);
    }
    
    if (userId) {
      reports = reports.filter(r => r.userId === userId);
    }
    
    return reports;
  }

  async createReport(report: InsertReport & { userId: number }): Promise<Report> {
    const id = this.currentReportId++;
    const newReport: Report = {
      ...report,
      id,
      points: 50,
      description: report.description || null,
      imageUrl: report.imageUrl || null,
      contactName: report.contactName || null,
      contactEmail: report.contactEmail || null,
      propertyId: report.propertyId || null,
      userId: report.userId || null,
      createdAt: new Date(),
    };
    this.reports.set(id, newReport);
    
    // Update property report count
    if (report.propertyId) {
      await this.incrementReportCount(report.propertyId);
    }
    
    return newReport;
  }

  async getReportsByUser(userId: number): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(r => r.userId === userId);
  }

  async getTaxNotice(id: number): Promise<TaxNotice | undefined> {
    return this.taxNotices.get(id);
  }

  async getTaxNotices(propertyId?: number): Promise<TaxNotice[]> {
    let notices = Array.from(this.taxNotices.values());
    
    if (propertyId) {
      notices = notices.filter(n => n.propertyId === propertyId);
    }
    
    return notices;
  }

  async createTaxNotice(insertTaxNotice: InsertTaxNotice): Promise<TaxNotice> {
    const id = this.currentTaxNoticeId++;
    const taxNotice: TaxNotice = {
      ...insertTaxNotice,
      id,
      status: "Pending",
      transactionHash: null,
      propertyId: insertTaxNotice.propertyId || null,
      penaltyAmount: insertTaxNotice.penaltyAmount || null,
      dueDate: insertTaxNotice.dueDate || null,
      createdAt: new Date(),
    };
    this.taxNotices.set(id, taxNotice);
    return taxNotice;
  }

  async updateTaxNoticeStatus(id: number, status: string, transactionHash?: string): Promise<void> {
    const taxNotice = this.taxNotices.get(id);
    if (taxNotice) {
      taxNotice.status = status;
      if (transactionHash) {
        taxNotice.transactionHash = transactionHash;
      }
      this.taxNotices.set(id, taxNotice);
    }
  }

  async getStats(): Promise<{
    propertiesReported: number;
    taxRecovered: string;
    activeReporters: number;
    confirmedVacant: number;
    investigating: number;
    totalReports: number;
  }> {
    const properties = Array.from(this.properties.values());
    const reports = Array.from(this.reports.values());
    const users = Array.from(this.users.values());

    const propertiesReported = properties.length;
    const confirmedVacant = properties.filter(p => p.status === "Confirmed Vacant").length;
    const investigating = properties.filter(p => p.status === "Investigating").length;
    const totalReports = reports.length;
    const activeReporters = users.filter(u => (u.points || 0) > 0).length;
    
    // Calculate tax recovered from confirmed vacant properties
    const taxRecovered = properties
      .filter(p => p.status === "Confirmed Vacant")
      .reduce((sum, p) => sum + parseFloat(p.estimatedTaxLoss || "0"), 0);

    return {
      propertiesReported,
      taxRecovered: `$${(taxRecovered / 1000000).toFixed(1)}M`,
      activeReporters,
      confirmedVacant,
      investigating,
      totalReports,
    };
  }
}

export const storage = new MemStorage();
