import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use("*", logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

// ── Auth helpers ──────────────────────────────────────────────────────────────

const serviceClient = () =>
  createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

const anonClient = () =>
  createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);

const getAuthUser = async (authHeader: string | null) => {
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  if (!token) return null;
  try {
    const { data: { user }, error } = await anonClient().auth.getUser(token);
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
};

const generateId = () =>
  `book_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const logActivity = async (action: string, details: string, userId?: string) => {
  try {
    const log: any[] = (await kv.get("activity:log")) || [];
    const entry = { id: Date.now(), action, details, userId: userId || "system", timestamp: new Date().toISOString() };
    await kv.set("activity:log", [entry, ...log].slice(0, 100));
  } catch (e) {
    console.log("Failed to log activity:", e);
  }
};

// ── Digital Library seed data ─────────────────────────────────────────────────

const DIGITAL_BOOKS_SEED = [
  {
    id: "dl_1",
    title: "Introduction to Algorithms",
    authorShort: "Thomas H. Cormen et al.",
    author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
    publisher: "MIT Press",
    year: 2022,
    edition: "4th Edition",
    pages: 1292,
    category: "Computer Science",
    language: "English",
    isbn: "978-0262046305",
    description: "A comprehensive introduction to the modern study of computer algorithms. Each chapter presents an algorithm, a design technique, an application area, or a related topic. Algorithms are described in English and in a pseudocode designed to be readable by anyone who has done a little programming. The book contains 231 problems and over 900 exercises.",
    coverImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=560&fit=crop&auto=format",
    coverColor: "#1B3A8C",
    rating: 4.9,
    downloads: 52400,
    formats: ["PDF", "EPUB"],
    tags: ["algorithms", "data structures", "computer science"],
    relatedIds: ["dl_4", "dl_11"],
  },
  {
    id: "dl_2",
    title: "Artificial Intelligence: A Modern Approach",
    authorShort: "Stuart Russell & Peter Norvig",
    author: "Stuart Russell, Peter Norvig",
    publisher: "Pearson",
    year: 2020,
    edition: "4th Edition",
    pages: 1132,
    category: "Artificial Intelligence",
    language: "English",
    isbn: "978-0134610993",
    description: "The leading textbook in Artificial Intelligence, used in over 1500 universities worldwide. This text offers the most comprehensive, up-to-date introduction to the theory and practice of artificial intelligence. Topics covered include search algorithms, knowledge representation, planning, uncertainty, machine learning, and natural language processing.",
    coverImage: "https://images.unsplash.com/photo-1674027444485-cec3da58eef4?w=400&h=560&fit=crop&auto=format",
    coverColor: "#4C1D95",
    rating: 4.9,
    downloads: 67800,
    formats: ["PDF", "EPUB", "MOBI"],
    tags: ["artificial intelligence", "machine learning", "planning"],
    relatedIds: ["dl_10", "dl_1"],
  },
  {
    id: "dl_3",
    title: "Database System Concepts",
    authorShort: "Abraham Silberschatz et al.",
    author: "Abraham Silberschatz, Henry F. Korth, S. Sudarshan",
    publisher: "McGraw-Hill",
    year: 2019,
    edition: "7th Edition",
    pages: 1376,
    category: "Database Systems",
    language: "English",
    isbn: "978-0078022159",
    description: "Database System Concepts has long been considered the standard textbook on database systems. The book provides comprehensive coverage of the concepts behind database systems, from basic concepts to advanced topics. It covers the relational model, SQL, database design, storage and indexing, query processing, transaction management, and distributed databases.",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=560&fit=crop&auto=format",
    coverColor: "#065F46",
    rating: 4.7,
    downloads: 43200,
    formats: ["PDF", "EPUB"],
    tags: ["database", "SQL", "relational model"],
    relatedIds: ["dl_7", "dl_1"],
  },
  {
    id: "dl_4",
    title: "Software Engineering",
    authorShort: "Ian Sommerville",
    author: "Ian Sommerville",
    publisher: "Pearson",
    year: 2016,
    edition: "10th Edition",
    pages: 810,
    category: "Software Engineering",
    language: "English",
    isbn: "978-0133943030",
    description: "Software Engineering introduces students to all aspects of software development—from analysis and design to testing and maintenance. The book's broad perspective covers all types of software systems, emphasizing agile methods and software engineering practice. This edition includes expanded coverage of agile development methods and software security.",
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=560&fit=crop&auto=format",
    coverColor: "#0C4A6E",
    rating: 4.8,
    downloads: 38900,
    formats: ["PDF", "EPUB"],
    tags: ["software engineering", "agile", "design patterns"],
    relatedIds: ["dl_6", "dl_1"],
  },
  {
    id: "dl_5",
    title: "Computer Networks",
    authorShort: "Andrew S. Tanenbaum",
    author: "Andrew S. Tanenbaum, David J. Wetherall",
    publisher: "Pearson",
    year: 2021,
    edition: "6th Edition",
    pages: 960,
    category: "Networking",
    language: "English",
    isbn: "978-0137523214",
    description: "Computer Networks is the ideal introduction to today's and tomorrow's networks. This comprehensive best-seller covers topics from the physical layer through to application layer protocols, with detailed explanations of TCP/IP, Ethernet, wireless networking, and security. The book is written in a refreshingly clear style and covers all the essentials a network professional needs.",
    coverImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=560&fit=crop&auto=format",
    coverColor: "#134E4A",
    rating: 4.7,
    downloads: 29100,
    formats: ["PDF", "EPUB", "MOBI"],
    tags: ["networking", "TCP/IP", "protocols"],
    relatedIds: ["dl_8", "dl_3"],
  },
  {
    id: "dl_6",
    title: "Clean Code",
    authorShort: "Robert C. Martin",
    author: "Robert C. Martin",
    publisher: "Prentice Hall",
    year: 2008,
    edition: "1st Edition",
    pages: 431,
    category: "Software Engineering",
    language: "English",
    isbn: "978-0132350884",
    description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. This book is a must-read for any developer, software engineer, project manager, team lead, or systems analyst with an interest in producing better code. It shows how to write clean code and gives examples of transforming bad code into clean code.",
    coverImage: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=560&fit=crop&auto=format",
    coverColor: "#1E3A8A",
    rating: 4.8,
    downloads: 71200,
    formats: ["PDF", "EPUB", "MOBI"],
    tags: ["clean code", "best practices", "refactoring"],
    relatedIds: ["dl_4", "dl_1"],
  },
  {
    id: "dl_7",
    title: "Fundamentals of Database Systems",
    authorShort: "Ramez Elmasri & Shamkant Navathe",
    author: "Ramez Elmasri, Shamkant B. Navathe",
    publisher: "Pearson",
    year: 2016,
    edition: "7th Edition",
    pages: 1280,
    category: "Database Systems",
    language: "English",
    isbn: "978-0133970777",
    description: "This book provides in-depth coverage of database management systems and their applications. It covers the complete lifecycle of database design, implementation, and management. Topics include the relational model, SQL, object databases, XML, advanced transaction processing, and distributed and NoSQL databases.",
    coverImage: "https://images.unsplash.com/photo-1695668548342-c0c1ad479aee?w=400&h=560&fit=crop&auto=format",
    coverColor: "#0F2557",
    rating: 4.7,
    downloads: 34600,
    formats: ["PDF", "EPUB"],
    tags: ["database", "ER model", "normalization"],
    relatedIds: ["dl_3", "dl_1"],
  },
  {
    id: "dl_8",
    title: "Computer Security: Principles and Practice",
    authorShort: "William Stallings",
    author: "William Stallings, Lawrie Brown",
    publisher: "Pearson",
    year: 2017,
    edition: "4th Edition",
    pages: 816,
    category: "Cybersecurity",
    language: "English",
    isbn: "978-0134794105",
    description: "Computer Security: Principles and Practice is a comprehensive introduction to computer and Internet security for both students and practitioners. The book covers the security of hardware, software, and data, as well as system security, network security, Internet security, and the management of security. Topics include cryptography, network security protocols, malware, firewalls, and intrusion detection.",
    coverImage: "https://images.unsplash.com/photo-1751448555253-f39c06e29d82?w=400&h=560&fit=crop&auto=format",
    coverColor: "#1E1B4B",
    rating: 4.6,
    downloads: 28700,
    formats: ["PDF", "EPUB"],
    tags: ["security", "cryptography", "network security"],
    relatedIds: ["dl_5", "dl_2"],
  },
  {
    id: "dl_9",
    title: "Machine Learning",
    authorShort: "Tom Mitchell",
    author: "Tom M. Mitchell",
    publisher: "McGraw-Hill",
    year: 1997,
    edition: "1st Edition",
    pages: 432,
    category: "Artificial Intelligence",
    language: "English",
    isbn: "978-0070428072",
    description: "This book covers the field of machine learning with a focus on the algorithms that enable computers to learn from experience. Tom Mitchell provides a clear, crisp definition of machine learning and covers topics such as concept learning, decision trees, neural networks, Bayesian learning, instance-based learning, genetic algorithms, and analytical learning.",
    coverImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=560&fit=crop&auto=format",
    coverColor: "#312E81",
    rating: 4.8,
    downloads: 49300,
    formats: ["PDF", "EPUB", "MOBI"],
    tags: ["machine learning", "neural networks", "decision trees"],
    relatedIds: ["dl_2", "dl_12"],
  },
  {
    id: "dl_10",
    title: "Data Analytics: The Definitive Guide",
    authorShort: "Michael Frampton",
    author: "Michael Frampton",
    publisher: "Packt Publishing",
    year: 2022,
    edition: "2nd Edition",
    pages: 380,
    category: "Data Analytics",
    language: "English",
    isbn: "978-1803242859",
    description: "A comprehensive guide to data analytics that covers all modern tools and techniques. Learn how to collect, process, visualize, and interpret data to make informed business decisions. Topics include statistical analysis, data visualization, predictive modeling, big data technologies, and real-world case studies from various industries.",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=560&fit=crop&auto=format",
    coverColor: "#0E7490",
    rating: 4.5,
    downloads: 21800,
    formats: ["PDF", "EPUB"],
    tags: ["data analytics", "statistics", "visualization"],
    relatedIds: ["dl_9", "dl_2"],
  },
  {
    id: "dl_11",
    title: "Operating System Concepts",
    authorShort: "Abraham Silberschatz et al.",
    author: "Abraham Silberschatz, Peter B. Galvin, Greg Gagne",
    publisher: "Wiley",
    year: 2018,
    edition: "10th Edition",
    pages: 944,
    category: "Computer Science",
    language: "English",
    isbn: "978-1119320913",
    description: "Known as the Dinosaur Book, Operating System Concepts is the standard reference for operating systems courses. This book covers all aspects of operating systems including processes, threads, CPU scheduling, synchronization, deadlock, memory management, virtual memory, storage management, file-system interface, and security.",
    coverImage: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&h=560&fit=crop&auto=format",
    coverColor: "#7C2D12",
    rating: 4.6,
    downloads: 33400,
    formats: ["PDF", "EPUB", "MOBI"],
    tags: ["operating systems", "processes", "memory management"],
    relatedIds: ["dl_1", "dl_5"],
  },
  {
    id: "dl_12",
    title: "Deep Learning",
    authorShort: "Goodfellow, Bengio & Courville",
    author: "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
    publisher: "MIT Press",
    year: 2016,
    edition: "1st Edition",
    pages: 800,
    category: "Artificial Intelligence",
    language: "English",
    isbn: "978-0262035613",
    description: "An introduction to the mathematical and conceptual background needed to understand deep learning, along with industry perspectives on deep learning for vision, speech, and language. This book offers mathematical and conceptual background, covering relevant concepts in linear algebra, probability theory, information theory, and numerical computation.",
    coverImage: "https://images.unsplash.com/photo-1768224656445-33d078c250b7?w=400&h=560&fit=crop&auto=format",
    coverColor: "#4338CA",
    rating: 4.9,
    downloads: 58700,
    formats: ["PDF", "EPUB"],
    tags: ["deep learning", "neural networks", "AI"],
    relatedIds: ["dl_9", "dl_2"],
  },
];

// ── Health ────────────────────────────────────────────────────────────────────

app.get("/make-server-e040eddb/health", (c) => c.json({ status: "ok" }));

// ── Books CRUD ────────────────────────────────────────────────────────────────

app.get("/make-server-e040eddb/books", async (c) => {
  try {
    const search = c.req.query("search")?.toLowerCase() || "";
    const category = c.req.query("category") || "";
    const books: any[] = (await kv.get("books:all")) || [];

    let filtered = books;
    if (search) {
      filtered = filtered.filter((b) =>
        b.title?.toLowerCase().includes(search) ||
        b.author?.toLowerCase().includes(search) ||
        b.category?.toLowerCase().includes(search) ||
        b.publisher?.toLowerCase().includes(search) ||
        b.isbn?.toLowerCase().includes(search)
      );
    }
    if (category && category !== "All") {
      filtered = filtered.filter((b) => b.category === category);
    }

    const sorted = [...filtered].sort((a, b) =>
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    return c.json({ books: sorted, total: sorted.length });
  } catch (error) {
    console.log("Error fetching books:", error);
    return c.json({ error: `Failed to fetch books: ${error}` }, 500);
  }
});

app.get("/make-server-e040eddb/books/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const books: any[] = (await kv.get("books:all")) || [];
    const book = books.find((b) => b.id === id);
    if (!book) return c.json({ error: "Book not found" }, 404);
    return c.json({ book });
  } catch (error) {
    console.log("Error fetching book:", error);
    return c.json({ error: `Failed to fetch book: ${error}` }, 500);
  }
});

app.post("/make-server-e040eddb/books", async (c) => {
  try {
    const user = await getAuthUser(c.req.header("Authorization"));
    if (!user) return c.json({ error: "Unauthorized: login required to add books" }, 401);

    const body = await c.req.json();
    const { title, author, publisher, year, pages, category, description, formats, language, size, isbn } = body;

    if (!title?.trim() || !author?.trim() || !category?.trim()) {
      return c.json({ error: "Title, author, and category are required" }, 400);
    }

    const books: any[] = (await kv.get("books:all")) || [];
    const coverColors = ["#1B3A8C", "#0F2557", "#065F46", "#7C2D12", "#4C1D95", "#134E4A", "#831843", "#0C4A6E", "#92400E", "#1E3A8A"];
    const colorIndex = books.length % coverColors.length;

    const newBook = {
      id: generateId(),
      title: title.trim(),
      author: author.trim(),
      publisher: publisher?.trim() || "",
      year: parseInt(year) || new Date().getFullYear(),
      pages: parseInt(pages) || 0,
      category: category.trim(),
      description: description?.trim() || "",
      formats: formats || ["PDF"],
      language: language || "English",
      size: size?.trim() || "",
      isbn: isbn?.trim() || "",
      coverColor: coverColors[colorIndex],
      rating: 0,
      downloads: 0,
      addedBy: user.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set("books:all", [...books, newBook]);
    await logActivity("Book Added", `"${newBook.title}" by ${newBook.author} added`, user.id);

    return c.json({ book: newBook, message: "Book created successfully" }, 201);
  } catch (error) {
    console.log("Error creating book:", error);
    return c.json({ error: `Failed to create book: ${error}` }, 500);
  }
});

app.put("/make-server-e040eddb/books/:id", async (c) => {
  try {
    const user = await getAuthUser(c.req.header("Authorization"));
    if (!user) return c.json({ error: "Unauthorized: login required to edit books" }, 401);

    const id = c.req.param("id");
    const body = await c.req.json();
    const books: any[] = (await kv.get("books:all")) || [];
    const idx = books.findIndex((b) => b.id === id);

    if (idx === -1) return c.json({ error: "Book not found" }, 404);

    const updated = { ...books[idx], ...body, id, updatedAt: new Date().toISOString() };
    books[idx] = updated;
    await kv.set("books:all", books);
    await logActivity("Book Updated", `"${updated.title}" was updated`, user.id);

    return c.json({ book: updated, message: "Book updated successfully" });
  } catch (error) {
    console.log("Error updating book:", error);
    return c.json({ error: `Failed to update book: ${error}` }, 500);
  }
});

app.delete("/make-server-e040eddb/books/:id", async (c) => {
  try {
    const user = await getAuthUser(c.req.header("Authorization"));
    if (!user) return c.json({ error: "Unauthorized: login required to delete books" }, 401);

    const id = c.req.param("id");
    const books: any[] = (await kv.get("books:all")) || [];
    const book = books.find((b) => b.id === id);

    if (!book) return c.json({ error: "Book not found" }, 404);

    await kv.set("books:all", books.filter((b) => b.id !== id));
    await logActivity("Book Deleted", `"${book.title}" was deleted`, user.id);

    return c.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log("Error deleting book:", error);
    return c.json({ error: `Failed to delete book: ${error}` }, 500);
  }
});

// ── Auth ──────────────────────────────────────────────────────────────────────

app.post("/make-server-e040eddb/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email?.trim() || !password || !name?.trim()) {
      return c.json({ error: "Email, password, and full name are required" }, 400);
    }
    if (password.length < 8) {
      return c.json({ error: "Password must be at least 8 characters" }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    const sc = serviceClient();
    try {
      const { data: { users: existing } } = await sc.auth.admin.listUsers();
      if (existing?.some((u: any) => u.email === email.toLowerCase())) {
        return c.json({ error: "An account with this email already exists" }, 409);
      }
    } catch (listError) {
      console.log("Could not check existing users, proceeding:", listError);
    }

    const { data, error } = await sc.auth.admin.createUser({
      email: email.toLowerCase().trim(),
      password,
      user_metadata: { name: name.trim(), role: "user" },
      email_confirm: true,
    });

    if (error) {
      console.log("Supabase signup error:", error);
      return c.json({ error: `Registration failed: ${error.message}` }, 400);
    }

    await logActivity("User Registered", `New user "${name.trim()}" (${email}) registered`);
    return c.json({ user: { id: data.user.id, email: data.user.email, name }, message: "Account created successfully" }, 201);
  } catch (error) {
    console.log("Signup error:", error);
    return c.json({ error: `Signup error: ${error}` }, 500);
  }
});

// ── Stats & Activity ──────────────────────────────────────────────────────────

app.get("/make-server-e040eddb/stats", async (c) => {
  try {
    const user = await getAuthUser(c.req.header("Authorization"));
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const books: any[] = (await kv.get("books:all")) || [];

    // Try to get user count, gracefully handle permission errors
    let totalUsers = 0;
    try {
      const sc = serviceClient();
      const { data } = await sc.auth.admin.listUsers();
      totalUsers = data?.users?.length || 0;
    } catch (userError) {
      console.log("Could not fetch user count (non-critical):", userError);
    }

    const categories: Record<string, number> = {};
    books.forEach((b) => {
      categories[b.category] = (categories[b.category] || 0) + 1;
    });

    const topCategories = Object.entries(categories)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({ name, count }));

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentBooks = books.filter((b) => b.createdAt && new Date(b.createdAt) > weekAgo).length;

    return c.json({
      stats: {
        totalBooks: books.length,
        totalUsers,
        totalCategories: Object.keys(categories).length,
        recentBooks,
        topCategories,
      },
    });
  } catch (error) {
    console.log("Error fetching stats:", error);
    return c.json({ error: `Failed to fetch stats: ${error}` }, 500);
  }
});

app.get("/make-server-e040eddb/activity", async (c) => {
  try {
    const user = await getAuthUser(c.req.header("Authorization"));
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    let log: any[] = [];
    try {
      log = (await kv.get("activity:log")) || [];
    } catch (kvError) {
      console.log("Could not fetch activity log (non-critical):", kvError);
    }

    return c.json({ activity: log.slice(0, 20) });
  } catch (error) {
    console.log("Error fetching activity:", error);
    return c.json({ error: `Failed to fetch activity: ${error}` }, 500);
  }
});

// ── Digital Library ───────────────────────────────────────────────────────────

app.get("/make-server-e040eddb/digital-library/books", async (c) => {
  try {
    const search = c.req.query("search")?.toLowerCase() || "";
    const category = c.req.query("category") || "";

    // Auto-seed on first call
    let books: any[] = [];
    try {
      books = (await kv.get("digital_library:books")) || [];
    } catch (e) {
      console.log("Could not fetch digital library books:", e);
    }

    if (books.length === 0) {
      try {
        await kv.set("digital_library:books", DIGITAL_BOOKS_SEED);
        books = DIGITAL_BOOKS_SEED;
        console.log("Digital library seeded with", books.length, "books");
      } catch (seedError) {
        console.log("Could not seed digital library, returning seed data directly:", seedError);
        books = DIGITAL_BOOKS_SEED;
      }
    }

    let filtered = books;
    if (search) {
      filtered = filtered.filter((b) =>
        b.title?.toLowerCase().includes(search) ||
        b.author?.toLowerCase().includes(search) ||
        b.authorShort?.toLowerCase().includes(search) ||
        b.category?.toLowerCase().includes(search) ||
        b.tags?.some((t: string) => t.toLowerCase().includes(search))
      );
    }
    if (category && category !== "All") {
      filtered = filtered.filter((b) => b.category === category);
    }

    return c.json({ books: filtered, total: filtered.length });
  } catch (error) {
    console.log("Error fetching digital library:", error);
    return c.json({ books: DIGITAL_BOOKS_SEED, total: DIGITAL_BOOKS_SEED.length });
  }
});

app.get("/make-server-e040eddb/digital-library/books/:id", async (c) => {
  try {
    const id = c.req.param("id");
    let books: any[] = [];
    try {
      books = (await kv.get("digital_library:books")) || DIGITAL_BOOKS_SEED;
    } catch {
      books = DIGITAL_BOOKS_SEED;
    }

    const book = books.find((b) => b.id === id);
    if (!book) return c.json({ error: "Book not found" }, 404);

    const related = books.filter((b) => book.relatedIds?.includes(b.id)).slice(0, 3);

    return c.json({ book, related });
  } catch (error) {
    console.log("Error fetching digital book:", error);
    return c.json({ error: `Failed to fetch book: ${error}` }, 500);
  }
});

Deno.serve(app.fetch);
