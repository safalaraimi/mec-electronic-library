export interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  year: number;
  pages: number;
  category: string;
  coverColor: string;
  coverAccent: string;
  coverLabel: string;
  description: string;
  rating: number;
  downloads: number;
  formats: string[];
  language: string;
  size: string;
}

export const mockBooks: Book[] = [
  {
    id: 1,
    title: 'Data Analytics',
    author: 'John Smith',
    publisher: 'Tech Press',
    year: 2023,
    pages: 320,
    category: 'Technology',
    coverColor: '#0e7490',
    coverAccent: '#0891b2',
    coverLabel: 'DATA\nANALYTICS',
    description: 'This book provides a comprehensive introduction to data analytics concepts, techniques, and applications. It covers data collection, processing, visualization, and interpretation for business insights.',
    rating: 4.6,
    downloads: 21400,
    formats: ['PDF', 'EPUB', 'MOBI'],
    language: 'English',
    size: '5.2 MB',
  },
  {
    id: 2,
    title: 'Software Engineering',
    author: 'Ian Sommerville',
    publisher: 'Pearson',
    year: 2022,
    pages: 810,
    category: 'Computer Science',
    coverColor: '#1e3a8a',
    coverAccent: '#1d4ed8',
    coverLabel: 'SOFTWARE\nENGINEERING',
    description: 'A comprehensive guide to software engineering principles, covering requirements engineering, software design, testing, maintenance, and project management methodologies.',
    rating: 4.8,
    downloads: 34200,
    formats: ['PDF', 'EPUB'],
    language: 'English',
    size: '12.1 MB',
  },
  {
    id: 3,
    title: 'Database Systems',
    author: 'Ramez Elmasri',
    publisher: 'Addison-Wesley',
    year: 2021,
    pages: 1260,
    category: 'Database',
    coverColor: '#0f172a',
    coverAccent: '#1e40af',
    coverLabel: 'DATABASE\nSYSTEMS',
    description: 'An in-depth exploration of database concepts, models, and implementation. Covers relational databases, SQL, normalization, transaction management, and emerging NoSQL systems.',
    rating: 4.7,
    downloads: 28900,
    formats: ['PDF', 'EPUB', 'MOBI', 'TXT'],
    language: 'English',
    size: '18.4 MB',
  },
  {
    id: 4,
    title: 'Artificial Intelligence',
    author: 'Stuart Russell',
    publisher: 'MIT Press',
    year: 2020,
    pages: 1132,
    category: 'AI',
    coverColor: '#4c1d95',
    coverAccent: '#7c3aed',
    coverLabel: 'ARTIFICIAL\nINTELLIGENCE',
    description: 'The definitive guide to artificial intelligence, covering intelligent agents, search algorithms, knowledge representation, planning, machine learning, and deep learning foundations.',
    rating: 4.9,
    downloads: 52100,
    formats: ['PDF', 'EPUB', 'MOBI'],
    language: 'English',
    size: '22.7 MB',
  },
  {
    id: 5,
    title: 'Computer Networks',
    author: 'Andrew Tanenbaum',
    publisher: 'Pearson',
    year: 2021,
    pages: 960,
    category: 'Networking',
    coverColor: '#065f46',
    coverAccent: '#059669',
    coverLabel: 'COMPUTER\nNETWORKS',
    description: 'A thorough treatment of computer networking, from the physical layer through application protocols. Covers TCP/IP, network security, wireless networks, and the Internet architecture.',
    rating: 4.7,
    downloads: 19800,
    formats: ['PDF', 'EPUB'],
    language: 'English',
    size: '14.3 MB',
  },
  {
    id: 6,
    title: 'Operating Systems',
    author: 'Abraham Silberschatz',
    publisher: 'Wiley',
    year: 2022,
    pages: 944,
    category: 'Computer Science',
    coverColor: '#7c2d12',
    coverAccent: '#dc2626',
    coverLabel: 'OPERATING\nSYSTEMS',
    description: 'A comprehensive overview of operating system concepts including process management, memory management, file systems, I/O systems, and security fundamentals.',
    rating: 4.5,
    downloads: 17600,
    formats: ['PDF', 'EPUB', 'MOBI', 'TXT'],
    language: 'English',
    size: '11.8 MB',
  },
  {
    id: 7,
    title: 'Machine Learning',
    author: 'Tom Mitchell',
    publisher: 'McGraw-Hill',
    year: 2023,
    pages: 432,
    category: 'AI',
    coverColor: '#134e4a',
    coverAccent: '#0d9488',
    coverLabel: 'MACHINE\nLEARNING',
    description: 'A foundational text on machine learning algorithms and statistical learning theory. Covers supervised, unsupervised, and reinforcement learning with practical implementation guidance.',
    rating: 4.8,
    downloads: 41300,
    formats: ['PDF', 'EPUB', 'MOBI'],
    language: 'English',
    size: '8.6 MB',
  },
  {
    id: 8,
    title: 'Cyber Security',
    author: 'William Stallings',
    publisher: 'Pearson',
    year: 2022,
    pages: 752,
    category: 'Security',
    coverColor: '#1e1b4b',
    coverAccent: '#4338ca',
    coverLabel: 'CYBER\nSECURITY',
    description: 'A comprehensive introduction to cybersecurity principles and practices, covering cryptography, network security, software security, and modern threat landscape.',
    rating: 4.6,
    downloads: 23700,
    formats: ['PDF', 'EPUB'],
    language: 'English',
    size: '9.4 MB',
  },
];

export const mockBooksRecord: Record<number, Book> = Object.fromEntries(
  mockBooks.map(b => [b.id, b])
);
