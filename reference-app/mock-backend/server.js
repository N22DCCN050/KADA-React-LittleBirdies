const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

// Initial realistic seed items for LittleBirdies App
const initialSeed = [
  {
    id: "1",
    title: "Morning Aviary Inspection & Feeding",
    subtitle: "Check finch enclosure humidity & refill organic seeds",
    notes: "1. Check temperature (keep at 24C)\n2. Refill vitamin water bottles\n3. Record singing activity",
    category: "birdcare",
    priority: "urgent",
    status: "done",
    dueDate: "2026-08-18",
    favorite: true,
    createdAt: "2026-08-17T07:00:00.000Z",
    updatedAt: "2026-08-18T08:00:00.000Z",
  },
  {
    id: "2",
    title: "KADA Project Integration Plan Review",
    subtitle: "Review React Native architecture & documentation checklist",
    notes: "Review docs/project-brief.md and technical best practices before sprint demo.",
    category: "study",
    priority: "high",
    status: "inprogress",
    dueDate: "2026-08-19",
    favorite: true,
    createdAt: "2026-08-17T09:30:00.000Z",
    updatedAt: "2026-08-17T14:00:00.000Z",
  },
  {
    id: "3",
    title: "Weekly Budget & Sanctuary Supplies Audit",
    subtitle: "Reconcile bird seed invoices and maintenance expenses",
    notes: "Total seed budget: 2,500,000 VND. Purchase new enrichment perches.",
    category: "finance",
    priority: "medium",
    status: "todo",
    dueDate: "2026-08-21",
    favorite: false,
    createdAt: "2026-08-16T11:00:00.000Z",
    updatedAt: "2026-08-16T11:00:00.000Z",
  },
  {
    id: "4",
    title: "Evening Jog & Breathwork Routine",
    subtitle: "5km outdoor run at the botanical park",
    notes: "Track heart rate and maintain 5:30 min/km pace.",
    category: "health",
    priority: "low",
    status: "todo",
    dueDate: "2026-08-18",
    favorite: false,
    createdAt: "2026-08-17T15:00:00.000Z",
    updatedAt: "2026-08-17T15:00:00.000Z",
  },
  {
    id: "5",
    title: "Sprint Planning & Team LittleBirdies Sync",
    subtitle: "Discuss Expo SDK 54 deployment with Khoa, Long, Hai, Nam & An",
    notes: "Agenda:\n- Expo Router v6 deep link testing\n- Offline SQLite vs AsyncStorage benchmarks\n- UI Polish & bilingual validation",
    category: "work",
    priority: "urgent",
    status: "inprogress",
    dueDate: "2026-08-18",
    favorite: true,
    createdAt: "2026-08-17T16:00:00.000Z",
    updatedAt: "2026-08-17T18:00:00.000Z",
  },
  {
    id: "6",
    title: "Mindfulness Meditation & Bird Sounds Listening",
    subtitle: "20 minutes sound bath with nature birdsong recordings",
    notes: "Relaxation exercise to improve focus and stress resilience.",
    category: "personal",
    priority: "low",
    status: "done",
    dueDate: "2026-08-17",
    favorite: false,
    createdAt: "2026-08-17T06:00:00.000Z",
    updatedAt: "2026-08-17T06:30:00.000Z",
  },
  {
    id: "7",
    title: "Canary Breeding Health Checkup",
    subtitle: "Veterinary check for hatchlings and feather growth",
    notes: "Weight check and calcium supplement checkup with Dr. Le.",
    category: "birdcare",
    priority: "high",
    status: "todo",
    dueDate: "2026-08-22",
    favorite: true,
    createdAt: "2026-08-16T08:00:00.000Z",
    updatedAt: "2026-08-16T08:00:00.000Z",
  },
];

let items = JSON.parse(JSON.stringify(initialSeed));
let nextId = 8;

app.post("/api/auth/login", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "email is required" });
  const role = email.includes("admin")
    ? "admin"
    : email.includes("manager")
    ? "manager"
    : "student";
  res.json({
    token: `demo-token-${Date.now()}`,
    name: email.split("@")[0],
    email: email,
    role: role,
  });
});

function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) return res.status(401).json({ error: "missing token" });
  next();
}

// Get all items with optional query filter
app.get("/api/items", requireAuth, (req, res) => {
  const { search, category, status, priority, favorite } = req.query;
  let results = [...items];

  if (category && category !== "all") {
    results = results.filter((i) => i.category === category);
  }
  if (status && status !== "all") {
    results = results.filter((i) => i.status === status);
  }
  if (priority && priority !== "all") {
    results = results.filter((i) => i.priority === priority);
  }
  if (favorite === "true") {
    results = results.filter((i) => i.favorite === true);
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (i) =>
        (i.title && i.title.toLowerCase().includes(q)) ||
        (i.subtitle && i.subtitle.toLowerCase().includes(q)) ||
        (i.notes && i.notes.toLowerCase().includes(q))
    );
  }

  res.json(results);
});

// Analytics & Stats summary
app.get("/api/stats", requireAuth, (req, res) => {
  const total = items.length;
  const completed = items.filter((i) => i.status === "done").length;
  const inProgress = items.filter((i) => i.status === "inprogress").length;
  const todo = items.filter((i) => i.status === "todo").length;
  const favorites = items.filter((i) => i.favorite).length;

  const categoryBreakdown = {};
  const priorityBreakdown = {};

  items.forEach((i) => {
    const cat = i.category || "personal";
    categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;

    const pri = i.priority || "medium";
    priorityBreakdown[pri] = (priorityBreakdown[pri] || 0) + 1;
  });

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  res.json({
    total,
    completed,
    inProgress,
    todo,
    favorites,
    completionRate,
    categoryBreakdown,
    priorityBreakdown,
  });
});

// Reset seed items endpoint
app.post("/api/items/reset-seed", requireAuth, (req, res) => {
  items = JSON.parse(JSON.stringify(initialSeed));
  nextId = 8;
  res.json({ message: "Seed data reset successfully", items });
});

// Get single item
app.get("/api/items/:id", requireAuth, (req, res) => {
  const item = items.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: "not found" });
  res.json(item);
});

// Create item
app.post("/api/items", requireAuth, (req, res) => {
  const now = new Date().toISOString();
  const item = {
    id: String(nextId++),
    title: req.body.title || "Untitled Task",
    subtitle: req.body.subtitle || "",
    notes: req.body.notes || "",
    category: req.body.category || "personal",
    priority: req.body.priority || "medium",
    status: req.body.status || "todo",
    dueDate: req.body.dueDate || "",
    favorite: req.body.favorite === true || req.body.favorite === "true",
    createdAt: now,
    updatedAt: now,
  };
  items.unshift(item);
  res.status(201).json(item);
});

// Update item
app.put("/api/items/:id", requireAuth, (req, res) => {
  const item = items.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: "not found" });
  
  Object.assign(item, {
    title: req.body.title !== undefined ? req.body.title : item.title,
    subtitle: req.body.subtitle !== undefined ? req.body.subtitle : item.subtitle,
    notes: req.body.notes !== undefined ? req.body.notes : item.notes,
    category: req.body.category !== undefined ? req.body.category : item.category,
    priority: req.body.priority !== undefined ? req.body.priority : item.priority,
    status: req.body.status !== undefined ? req.body.status : item.status,
    dueDate: req.body.dueDate !== undefined ? req.body.dueDate : item.dueDate,
    favorite: req.body.favorite !== undefined ? req.body.favorite : item.favorite,
    updatedAt: new Date().toISOString(),
  });
  res.json(item);
});

// Delete item
app.delete("/api/items/:id", requireAuth, (req, res) => {
  items = items.filter((i) => i.id !== req.params.id);
  res.status(204).send();
});

const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`LittleBirdies Mock backend on http://0.0.0.0:${PORT}`));
