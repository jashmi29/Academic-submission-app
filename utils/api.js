/**
 * API Utility Module
 * Handles all API calls to external services
 * Uses sample data for posts with proper English content
 */

const BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Sample English posts for the app
 */
const samplePosts = [
  {
    id: 1,
    userId: 1,
    title: "Introduction to Machine Learning",
    body: "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It focuses on developing algorithms that can access data and use it to learn for themselves."
  },
  {
    id: 2,
    userId: 2,
    title: "The Future of Renewable Energy",
    body: "Renewable energy sources like solar, wind, and hydroelectric power are becoming increasingly important as we seek to reduce our carbon footprint and combat climate change. The transition to clean energy is essential for a sustainable future."
  },
  {
    id: 3,
    userId: 3,
    title: "Understanding Blockchain Technology",
    body: "Blockchain is a distributed ledger technology that records transactions across many computers. Its key features include decentralization, transparency, and security. It has applications beyond cryptocurrency in supply chain, voting, and more."
  },
  {
    id: 4,
    userId: 4,
    title: "The Rise of Electric Vehicles",
    body: "Electric vehicles are revolutionizing the automotive industry with their environmental benefits and advancing technology. Major automakers are investing heavily in EV development, making electric cars more accessible to consumers worldwide."
  },
  {
    id: 5,
    userId: 5,
    title: "Web Development Best Practices",
    body: "Modern web development requires understanding of HTML, CSS, JavaScript, and various frameworks. Following best practices like responsive design, accessibility, and performance optimization creates better user experiences."
  },
  {
    id: 6,
    userId: 6,
    title: "Cybersecurity in the Digital Age",
    body: "With increasing digitalization, cybersecurity has become crucial for individuals and organizations. Understanding common threats like phishing, malware, and ransomware helps in implementing effective protection measures."
  },
  {
    id: 7,
    userId: 1,
    title: "Cloud Computing Fundamentals",
    body: "Cloud computing provides on-demand computing resources over the internet. Services like storage, processing power, and applications are delivered through cloud platforms, enabling scalable and cost-effective solutions."
  },
  {
    id: 8,
    userId: 2,
    title: "Data Science and Analytics",
    body: "Data science involves extracting insights from data using various techniques including statistics, machine learning, and programming. It helps organizations make data-driven decisions and solve complex problems."
  },
  {
    id: 9,
    userId: 3,
    title: "Mobile App Development Trends",
    body: "Mobile app development continues to evolve with new technologies and user expectations. Key trends include cross-platform development, AI integration, and focus on user experience and security."
  },
  {
    id: 10,
    userId: 4,
    title: "Artificial Intelligence in Healthcare",
    body: "AI is transforming healthcare through improved diagnostics, personalized treatment plans, and drug discovery. Machine learning algorithms can analyze medical images, predict patient outcomes, and streamline administrative tasks."
  },
  {
    id: 11,
    userId: 5,
    title: "The Internet of Things Explained",
    body: "IoT connects everyday devices to the internet, enabling smart homes, cities, and industries. Sensors and actuators collect and exchange data, creating interconnected systems that improve efficiency and convenience."
  },
  {
    id: 12,
    userId: 6,
    title: "Quantum Computing: A New Era",
    body: "Quantum computing harnesses quantum mechanics to perform computations exponentially faster than classical computers. It has potential applications in cryptography, drug discovery, and solving complex optimization problems."
  },
  {
    id: 13,
    userId: 1,
    title: "Software Engineering Principles",
    body: "Good software engineering involves writing maintainable, scalable, and efficient code. Key principles include SOLID design patterns, test-driven development, and continuous integration and deployment."
  },
  {
    id: 14,
    userId: 2,
    title: "Network Security Essentials",
    body: "Network security protects underlying IT infrastructure from unauthorized access. Essential measures include firewalls, intrusion detection systems, encryption, and regular security audits to identify vulnerabilities."
  },
  {
    id: 15,
    userId: 3,
    title: "The Evolution of Social Media",
    body: "Social media has transformed how we communicate and share information. Platforms continue to evolve with new features, algorithms, and privacy concerns shaping user behavior and digital marketing strategies."
  },
  {
    id: 16,
    userId: 4,
    title: "Database Management Systems",
    body: "Database management systems store, organize, and retrieve data efficiently. Understanding SQL, NoSQL, and database design principles is essential for building robust applications."
  },
  {
    id: 17,
    userId: 5,
    title: "DevOps and Agile Methodologies",
    body: "DevOps combines development and operations to deliver software faster and more reliably. Agile methodologies promote iterative development, collaboration, and adaptability in project management."
  },
  {
    id: 18,
    userId: 6,
    title: "Computer Networks Basics",
    body: "Computer networks enable devices to communicate and share resources. Understanding protocols, IP addressing, routing, and network topologies is fundamental to IT infrastructure."
  },
  {
    id: 19,
    userId: 1,
    title: "User Experience Design",
    body: "UX design focuses on creating products that provide meaningful experiences to users. It involves user research, prototyping, usability testing, and continuous improvement based on user feedback."
  },
  {
    id: 20,
    userId: 2,
    title: "Operating Systems Fundamentals",
    body: "Operating systems manage hardware resources and provide services to applications. Understanding process management, memory allocation, file systems, and security is crucial for system development."
  }
];

/**
 * Fetch all posts from the API
 * @returns {Array} Array of post objects
 */
export const fetchPosts = async () => {
  try {
    // Return sample posts with proper English content
    return { success: true, data: samplePosts };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Fetch a single post by ID
 * @param {number} id - Post ID
 * @returns {Object} Post object
 */
export const fetchPostById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/posts/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Fetch comments for a specific post
 * @param {number} postId - Post ID
 * @returns {Array} Array of comment objects
 */
export const fetchComments = async (postId) => {
  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments`);
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Fetch users from the API
 * @returns {Array} Array of user objects
 */
export const fetchUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { success: false, error: error.message };
  }
};
