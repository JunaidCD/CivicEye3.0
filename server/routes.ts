import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
import { insertReportSchema, insertPropertySchema, insertTaxNoticeSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    ws.on('message', (message) => {
      console.log('Received:', message.toString());
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // Broadcast function for real-time updates
  const broadcast = (data: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(JSON.stringify(data));
      }
    });
  };

  // Statistics endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  // Properties endpoints
  app.get("/api/properties", async (req, res) => {
    try {
      const { status, limit } = req.query;
      const properties = await storage.getProperties({
        status: status as string,
        limit: limit ? parseInt(limit as string) : undefined,
      });
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch property" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const validatedData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(validatedData);
      broadcast({ type: "propertyCreated", property });
      res.status(201).json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create property" });
    }
  });

  // Reports endpoints
  app.get("/api/reports", async (req, res) => {
    try {
      const { propertyId, userId } = req.query;
      const reports = await storage.getReports(
        propertyId ? parseInt(propertyId as string) : undefined,
        userId ? parseInt(userId as string) : undefined
      );
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  app.post("/api/reports", async (req, res) => {
    try {
      const validatedData = insertReportSchema.parse(req.body);
      const userId = 4; // Mock user ID - in real app this would come from auth
      
      const report = await storage.createReport({ ...validatedData, userId });
      
      // Award points to user
      await storage.updateUserPoints(userId, report.points || 50);
      
      // Update property status if enough reports
      if (validatedData.propertyId) {
        const property = await storage.getProperty(validatedData.propertyId);
        if (property && (property.reportCount || 0) >= 3) {
          await storage.updatePropertyStatus(validatedData.propertyId, "Confirmed Vacant");
        }
      }
      
      broadcast({ type: "reportCreated", report });
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create report" });
    }
  });

  // Users endpoints
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.get("/api/leaderboard", async (req, res) => {
    try {
      const { limit } = req.query;
      const leaderboard = await storage.getLeaderboard(
        limit ? parseInt(limit as string) : undefined
      );
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // Tax notices endpoints
  app.get("/api/tax-notices", async (req, res) => {
    try {
      const { propertyId } = req.query;
      const taxNotices = await storage.getTaxNotices(
        propertyId ? parseInt(propertyId as string) : undefined
      );
      res.json(taxNotices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tax notices" });
    }
  });

  app.post("/api/tax-notices", async (req, res) => {
    try {
      const validatedData = insertTaxNoticeSchema.parse(req.body);
      const taxNotice = await storage.createTaxNotice(validatedData);
      
      // Simulate blockchain transaction
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      await storage.updateTaxNoticeStatus(taxNotice.id, "Confirmed", transactionHash);
      
      broadcast({ type: "taxNoticeCreated", taxNotice });
      res.status(201).json({ ...taxNotice, transactionHash });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create tax notice" });
    }
  });

  // PDF generation endpoint
  app.post("/api/generate-pdf", async (req, res) => {
    try {
      const { taxNoticeId } = req.body;
      const taxNotice = await storage.getTaxNotice(taxNoticeId);
      
      if (!taxNotice) {
        return res.status(404).json({ error: "Tax notice not found" });
      }
      
      // In a real app, this would generate an actual PDF
      // For now, return a mock PDF URL
      const pdfUrl = `/api/pdf/${taxNoticeId}`;
      res.json({ pdfUrl });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  });

  return httpServer;
}
