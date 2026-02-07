import type { Project, TeamMember, AboutData, Video } from '@/types';

// Helper to create videos with thumbnails
const createVideo = (
  id: string,
  videoId: string,
  title: string,
  description?: string,
  isFeatured = false
): Video => ({
  id,
  url: `https://www.youtube.com/embed/${videoId}`,
  title,
  description,
  type: 'youtube',
  thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  isFeatured,
});

// Mock Projects Data
export const mockProjects: Project[] = [
  {
    id: '1',
    slug: 'neurochip-accelerator',
    title: 'NeuroChip: Neural Network Accelerator',
    shortDescription: 'A 28nm CMOS implementation of a spiking neural network optimized for edge computing applications.',
    fullDescription: 'NeuroChip represents a breakthrough in low-power neural network acceleration. This project involved the complete design and tape-out of a 28nm CMOS chip capable of running spiking neural networks with unprecedented energy efficiency. The chip achieves 10 TOPS/W efficiency, making it ideal for edge computing applications such as autonomous vehicles, IoT devices, and wearable technology.\n\nThe architecture uses a novel memory-compute integration approach that minimizes data movement, which is typically the biggest energy consumer in neural network inference. We implemented custom SRAM macros and a hierarchical mesh interconnect to enable efficient communication between processing elements.',
    category: 'vlsi',
    status: 'completed',
    visibility: 'public',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
      'https://images.unsplash.com/photo-1555664424-778a69022365?w=1200&q=80',
      'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=1200&q=80',
    ],
    videos: [
      createVideo('v1', 'dQw4w9WgXcQ', 'NeuroChip Demo', 'Demonstration of the NeuroChip running real-time inference', true),
    ],
    techStack: ['Verilog', 'Cadence', 'Synopsys', 'FPGA', 'Python', 'TensorFlow'],
    timeline: [
      {
        id: 't1',
        date: '2023-01-15',
        title: 'Project Kickoff',
        description: 'Initial planning and architecture design phase began',
        milestone: true
      },
      {
        id: 't2',
        date: '2023-04-20',
        title: 'RTL Design Complete',
        description: 'Register-transfer level design finalized and verified',
        milestone: true
      },
      {
        id: 't3',
        date: '2023-08-10',
        title: 'Tape-out',
        description: 'Chip sent for fabrication at TSMC',
        milestone: true
      },
      {
        id: 't4',
        date: '2023-12-05',
        title: 'Chip Testing',
        description: 'Received fabricated chips and began characterization',
        milestone: false
      }
    ],
    teamMembers: ['1', '2', '3'],
    teamMemberRoles: [
      { memberId: '1', role: 'Lead Designer' },
      { memberId: '2', role: 'Algorithm Developer' },
      { memberId: '3', role: 'Verification Lead' },
    ],
    startDate: '2023-01-15',
    endDate: '2023-12-31',
    duration: '11 months',
    githubUrl: 'https://github.com/lab/neurochip',
    demoUrl: 'https://demo.neurochip.ai',
    documentationUrl: 'https://docs.neurochip.ai',
    researchPaperUrl: 'https://arxiv.org/abs/2301.00001',
    metaTitle: 'NeuroChip: Neural Network Accelerator | thinkbuildlabs',
    metaDescription: 'A 28nm CMOS implementation of a spiking neural network optimized for edge computing applications.',
    keywords: ['VLSI', 'Neural Network', 'ASIC', 'Edge Computing', 'Low Power'],
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-12-31T00:00:00Z',
    publishedAt: '2023-01-15T00:00:00Z',
  },
  {
    id: '2',
    slug: 'autonomous-navigation-stack',
    title: 'Autonomous Navigation Stack',
    shortDescription: 'Vision-based SLAM implementation using stereo cameras and reinforcement learning for path planning.',
    fullDescription: 'Our Autonomous Navigation Stack is a comprehensive robotics framework that enables robots to navigate complex, unstructured environments without prior mapping. The system combines cutting-edge computer vision techniques with deep reinforcement learning to achieve robust, real-time navigation.\n\nThe stack features a custom SLAM (Simultaneous Localization and Mapping) implementation that uses stereo vision instead of expensive LiDAR sensors, making it accessible for low-cost robotics applications. The path planning module uses a novel reinforcement learning approach that adapts to different terrains and obstacle types.',
    category: 'ai-robotics',
    status: 'ongoing',
    visibility: 'public',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80',
      'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=1200&q=80',
      'https://images.unsplash.com/photo-1535378437327-b7128d8e1d17?w=1200&q=80',
    ],
    videos: [
      createVideo('v2', 'dQw4w9WgXcQ', 'Navigation Demo', 'Robot navigating through complex environment'),
    ],
    techStack: ['ROS2', 'PyTorch', 'OpenCV', 'C++', 'Python', 'Gazebo'],
    timeline: [
      {
        id: 't5',
        date: '2023-03-01',
        title: 'Project Start',
        description: 'Began development of core SLAM algorithms',
        milestone: true
      },
      {
        id: 't6',
        date: '2023-07-15',
        title: 'SLAM Working',
        description: 'Real-time SLAM achieved on Jetson Xavier',
        milestone: true
      },
      {
        id: 't7',
        date: '2023-11-20',
        title: 'RL Integration',
        description: 'Reinforcement learning path planning integrated',
        milestone: true
      }
    ],
    teamMembers: ['2', '4', '5'],
    teamMemberRoles: [
      { memberId: '2', role: 'Project Lead' },
      { memberId: '4', role: 'Mechanical Design' },
      { memberId: '5', role: 'ML Engineer' },
    ],
    startDate: '2023-03-01',
    githubUrl: 'https://github.com/lab/navstack',
    keywords: ['Robotics', 'SLAM', 'Reinforcement Learning', 'Computer Vision'],
    createdAt: '2023-03-01T00:00:00Z',
    updatedAt: '2023-11-20T00:00:00Z',
    publishedAt: '2023-03-01T00:00:00Z',
  },
  {
    id: '3',
    slug: 'quantum-circuit-simulator',
    title: 'Quantum Circuit Simulator',
    shortDescription: 'High-performance quantum circuit simulation platform for NISQ algorithm development.',
    fullDescription: 'This project develops a state-of-the-art quantum circuit simulator optimized for Near-Term Intermediate-Scale Quantum (NISQ) algorithms. Our simulator leverages GPU acceleration to simulate up to 30 qubits on a single workstation, making it accessible for researchers without access to actual quantum hardware.\n\nThe platform includes a visual circuit designer, comprehensive gate libraries, and built-in noise models that accurately simulate real quantum devices. We also provide integration with popular quantum frameworks like Qiskit and Cirq.',
    category: 'quantum',
    status: 'ongoing',
    visibility: 'public',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&q=80',
      'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=1200&q=80',
    ],
    videos: [],
    techStack: ['CUDA', 'C++', 'Python', 'Qiskit', 'React', 'WebGL'],
    timeline: [
      {
        id: 't8',
        date: '2023-06-01',
        title: 'Development Start',
        description: 'Core simulation engine development began',
        milestone: true
      },
      {
        id: 't9',
        date: '2023-10-15',
        title: 'GPU Optimization',
        description: 'CUDA acceleration implemented',
        milestone: true
      }
    ],
    teamMembers: ['1', '3'],
    teamMemberRoles: [
      { memberId: '1', role: 'System Architect' },
      { memberId: '3', role: 'Quantum Researcher' },
    ],
    startDate: '2023-06-01',
    githubUrl: 'https://github.com/lab/quantum-sim',
    keywords: ['Quantum Computing', 'GPU', 'Simulation', 'NISQ'],
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2023-10-15T00:00:00Z',
    publishedAt: '2023-06-01T00:00:00Z',
  },
  {
    id: '4',
    slug: 'dexterous-robotic-hand',
    title: 'Dexterous Robotic Hand',
    shortDescription: 'Anthropomorphic robotic hand with tactile sensing for delicate object manipulation.',
    fullDescription: 'Our Dexterous Robotic Hand project aims to create a humanoid hand capable of performing complex manipulation tasks that require fine motor control and tactile feedback. The hand features 20 degrees of freedom, pressure-sensitive tactile sensors on each fingertip, and tendon-driven actuation for smooth, human-like movement.\n\nThe control system uses a combination of model-based control and learning from demonstration to master delicate tasks such as threading a needle, handling fragile objects, and performing assembly operations.',
    category: 'ai-robotics',
    status: 'ongoing',
    visibility: 'public',
    thumbnail: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=1200&q=80',
      'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1200&q=80',
    ],
    videos: [
      createVideo('v3', 'dQw4w9WgXcQ', 'Hand Manipulation', 'Demonstration of delicate object manipulation'),
    ],
    techStack: ['SolidWorks', 'ROS', 'Python', 'Reinforcement Learning', '3D Printing'],
    timeline: [
      {
        id: 't10',
        date: '2023-02-15',
        title: 'Design Phase',
        description: 'Mechanical design and prototyping began',
        milestone: true
      },
      {
        id: 't11',
        date: '2023-09-01',
        title: 'First Prototype',
        description: 'Initial prototype with basic functionality',
        milestone: true
      }
    ],
    teamMembers: ['4', '5'],
    teamMemberRoles: [
      { memberId: '4', role: 'Lead Designer' },
      { memberId: '5', role: 'Control Systems' },
    ],
    startDate: '2023-02-15',
    githubUrl: 'https://github.com/lab/robo-hand',
    keywords: ['Robotics', 'Manipulation', 'Tactile Sensing', '3D Printing'],
    createdAt: '2023-02-15T00:00:00Z',
    updatedAt: '2023-09-01T00:00:00Z',
    publishedAt: '2023-02-15T00:00:00Z',
  },
  {
    id: '5',
    slug: 'low-power-adc-design',
    title: 'Ultra-Low Power ADC',
    shortDescription: 'Successive approximation ADC consuming only 50nW for IoT sensor applications.',
    fullDescription: 'This project focuses on designing an ultra-low power successive approximation register (SAR) ADC for IoT sensor nodes. The design achieves an impressive 50nW power consumption while maintaining 10-bit resolution at 1kS/s sampling rate, making it ideal for battery-powered environmental sensors.\n\nKey innovations include a custom capacitive DAC with parasitic cancellation, asynchronous SAR logic to eliminate clock power, and a dynamic comparator with auto-zeroing offset cancellation. The design was fabricated in a 65nm CMOS process.',
    category: 'vlsi',
    status: 'completed',
    visibility: 'public',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    ],
    videos: [],
    techStack: ['Cadence Virtuoso', 'Spectre', 'MATLAB', 'Calibre'],
    timeline: [
      {
        id: 't12',
        date: '2023-04-01',
        title: 'Specification',
        description: 'ADC specifications and architecture defined',
        milestone: true
      },
      {
        id: 't13',
        date: '2023-12-01',
        title: 'Layout Complete',
        description: 'Full chip layout completed and verified',
        milestone: true
      }
    ],
    teamMembers: ['1'],
    teamMemberRoles: [
      { memberId: '1', role: 'Sole Designer' },
    ],
    startDate: '2023-04-01',
    endDate: '2023-12-31',
    duration: '9 months',
    githubUrl: 'https://github.com/lab/ultra-adc',
    researchPaperUrl: 'https://ieeexplore.ieee.org/document/1234567',
    keywords: ['ADC', 'Low Power', 'IoT', 'CMOS'],
    createdAt: '2023-04-01T00:00:00Z',
    updatedAt: '2023-12-31T00:00:00Z',
    publishedAt: '2023-04-01T00:00:00Z',
  },
  {
    id: '6',
    slug: 'multi-agent-rl',
    title: 'Multi-Agent Reinforcement Learning',
    shortDescription: 'Cooperative multi-agent system for warehouse automation and coordination.',
    fullDescription: 'This research project explores multi-agent reinforcement learning (MARL) for coordinating teams of robots in warehouse automation scenarios. We developed novel algorithms that enable agents to learn cooperative behaviors without explicit communication, using only local observations.\n\nThe system has been tested in simulation with up to 100 agents and demonstrates superior performance compared to centralized approaches in terms of scalability and robustness to agent failures.',
    category: 'ai-robotics',
    status: 'ongoing',
    visibility: 'public',
    thumbnail: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1200&q=80',
      'https://images.unsplash.com/photo-1565514020176-db97e2a9f9a2?w=1200&q=80',
    ],
    videos: [],
    techStack: ['PyTorch', 'Ray', 'Python', 'Docker', 'Kubernetes'],
    timeline: [
      {
        id: 't14',
        date: '2023-05-01',
        title: 'Research Begins',
        description: 'Literature review and algorithm design',
        milestone: true
      },
      {
        id: 't15',
        date: '2023-11-01',
        title: 'Simulation Results',
        description: 'Achieved state-of-the-art performance in benchmark',
        milestone: true
      }
    ],
    teamMembers: ['2', '3', '5'],
    teamMemberRoles: [
      { memberId: '2', role: 'Research Lead' },
      { memberId: '3', role: 'Algorithm Design' },
      { memberId: '5', role: 'Implementation' },
    ],
    startDate: '2023-05-01',
    githubUrl: 'https://github.com/lab/marl-warehouse',
    keywords: ['Multi-Agent', 'Reinforcement Learning', 'Warehouse Automation'],
    createdAt: '2023-05-01T00:00:00Z',
    updatedAt: '2023-11-01T00:00:00Z',
    publishedAt: '2023-05-01T00:00:00Z',
  },
];

// Mock Team Members Data
export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    slug: 'alex-chen',
    name: 'Alex Chen',
    role: 'VLSI Design Lead',
    email: 'alex.chen@lab.edu',
    phone: '+1 (555) 123-4567',
    bio: 'Alex is a PhD candidate specializing in low-power VLSI design and neural network accelerators. With over 5 years of experience in chip design, Alex has led multiple successful tape-outs and holds 3 patents in the field.',
    about: 'Alex joined the lab in 2020 and has been instrumental in developing our VLSI design capabilities. Prior to joining, Alex completed a Master\'s degree at MIT and worked as an intern at NVIDIA and Intel.\n\nResearch interests include:\n- Low-power digital design\n- Neural network accelerators\n- Advanced process nodes\n- Memory-compute integration',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/alexchen' },
      { platform: 'github', url: 'https://github.com/alexchen' },
      { platform: 'google-scholar', url: 'https://scholar.google.com/citations?user=alex' },
    ],
    skills: ['Verilog', 'Cadence', 'Synopsys', 'FPGA Design', 'Low Power Design', 'Computer Architecture'],
    projects: ['1', '3', '5'],
    education: [
      {
        id: 'e1',
        institution: 'Stanford University',
        degree: 'PhD',
        field: 'Electrical Engineering',
        startYear: '2020',
        current: true,
        description: 'Focus on low-power VLSI design and neural network accelerators'
      },
      {
        id: 'e2',
        institution: 'MIT',
        degree: 'MS',
        field: 'Electrical Engineering',
        startYear: '2018',
        endYear: '2020',
        current: false
      }
    ],
    experience: [
      {
        id: 'exp1',
        company: 'NVIDIA',
        position: 'VLSI Design Intern',
        startDate: '2022-06-01',
        endDate: '2022-09-01',
        current: false,
        description: 'Worked on next-generation GPU memory controller design'
      },
      {
        id: 'exp2',
        company: 'Intel',
        position: 'Research Intern',
        startDate: '2021-06-01',
        endDate: '2021-09-01',
        current: false,
        description: 'Developed power estimation tools for SoC designs'
      }
    ],
    achievements: [
      {
        id: 'a1',
        title: 'Best Paper Award - ISSCC 2023',
        description: 'Awarded for paper on ultra-low power neural network accelerators',
        date: '2023-02-15',
        link: 'https://isscc.org'
      },
      {
        id: 'a2',
        title: 'NSF Graduate Research Fellowship',
        description: 'Prestigious fellowship for graduate studies',
        date: '2020-09-01'
      }
    ],
    isActive: true,
    status: 'active',
    joinedAt: '2020-01-15',
    memberSince: '2020-01-15',
    metaTitle: 'Alex Chen | VLSI Design Lead',
    metaDescription: 'PhD candidate specializing in low-power VLSI design and neural network accelerators.',
    createdAt: '2020-01-15T00:00:00Z',
    updatedAt: '2023-12-01T00:00:00Z'
  },
  {
    id: '2',
    slug: 'sarah-johnson',
    name: 'Sarah Johnson',
    role: 'AI Robotics Lead',
    email: 'sarah.johnson@lab.edu',
    bio: 'Sarah is a robotics researcher focused on autonomous navigation and reinforcement learning. Her work bridges the gap between theoretical AI and practical robotics applications.',
    about: 'Sarah leads our robotics division, bringing expertise in SLAM, path planning, and multi-agent systems. She completed her PhD at Carnegie Mellon and interned at Boston Dynamics.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80',
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/sarahjohnson' },
      { platform: 'github', url: 'https://github.com/sarahjohnson' },
      { platform: 'twitter', url: 'https://twitter.com/sarahjohnson' },
      { platform: 'instagram', url: 'https://instagram.com/sarahjohnson' }
    ],
    skills: ['ROS', 'PyTorch', 'Reinforcement Learning', 'Computer Vision', 'SLAM', 'Python'],
    projects: ['1', '2', '6'],
    education: [
      {
        id: 'e3',
        institution: 'Carnegie Mellon University',
        degree: 'PhD',
        field: 'Robotics',
        startYear: '2019',
        current: true,
        description: 'Research focus on multi-agent reinforcement learning'
      }
    ],
    experience: [
      {
        id: 'exp3',
        company: 'Boston Dynamics',
        position: 'Robotics Engineer Intern',
        startDate: '2022-05-01',
        endDate: '2022-08-01',
        current: false,
        description: 'Developed locomotion controllers for quadruped robots'
      }
    ],
    achievements: [
      {
        id: 'a3',
        title: 'RSS Best Student Paper Finalist',
        description: 'Finalist for best student paper at Robotics: Science and Systems',
        date: '2023-07-10'
      }
    ],
    isActive: true,
    status: 'active',
    joinedAt: '2019-09-01',
    memberSince: '2019-09-01',
    createdAt: '2019-09-01T00:00:00Z',
    updatedAt: '2023-11-15T00:00:00Z'
  },
  {
    id: '3',
    slug: 'michael-park',
    name: 'Michael Park',
    role: 'Research Scientist',
    email: 'michael.park@lab.edu',
    bio: 'Michael specializes in quantum computing and high-performance simulation. His interdisciplinary background spans physics, computer science, and electrical engineering.',
    about: 'Michael brings unique expertise in quantum computing and GPU-accelerated simulation. He holds a PhD in Physics from Caltech and worked at IBM Research.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/michaelpark' },
      { platform: 'github', url: 'https://github.com/michaelpark' },
      { platform: 'google-scholar', url: 'https://scholar.google.com/citations?user=michael' },
    ],
    skills: ['Quantum Computing', 'CUDA', 'C++', 'Python', 'Simulation', 'Numerical Methods'],
    projects: ['1', '3', '6'],
    education: [
      {
        id: 'e4',
        institution: 'Caltech',
        degree: 'PhD',
        field: 'Physics',
        startYear: '2018',
        endYear: '2022',
        current: false,
        description: 'Quantum information and computation'
      }
    ],
    experience: [
      {
        id: 'exp4',
        company: 'IBM Research',
        position: 'Postdoctoral Researcher',
        startDate: '2022-09-01',
        current: true,
        description: 'Research on quantum error correction and simulation'
      }
    ],
    achievements: [
      {
        id: 'a4',
        title: 'Quantum Computing Research Grant',
        description: 'NSF grant for quantum simulation research',
        date: '2023-01-15'
      }
    ],
    isActive: true,
    status: 'active',
    joinedAt: '2022-09-01',
    memberSince: '2022-09-01',
    createdAt: '2022-09-01T00:00:00Z',
    updatedAt: '2023-10-01T00:00:00Z'
  },
  {
    id: '4',
    slug: 'emma-wilson',
    name: 'Emma Wilson',
    role: 'Mechanical Engineer',
    email: 'emma.wilson@lab.edu',
    bio: 'Emma brings expertise in mechanical design and prototyping to the robotics team. She has designed multiple robotic systems from concept to working prototype.',
    about: 'Emma leads mechanical design for our robotics projects, with expertise in CAD, 3D printing, and CNC machining. She previously worked at Tesla.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/emmawilson' },
      { platform: 'github', url: 'https://github.com/emmawilson' },
      { platform: 'instagram', url: 'https://instagram.com/emmawilson' },
      { platform: 'portfolio', url: 'https://emmawilson.design' }
    ],
    skills: ['SolidWorks', '3D Printing', 'CNC Machining', 'Mechatronics', 'Prototyping', 'MATLAB'],
    projects: ['2', '4'],
    education: [
      {
        id: 'e5',
        institution: 'Georgia Tech',
        degree: 'MS',
        field: 'Mechanical Engineering',
        startYear: '2020',
        endYear: '2022',
        current: false
      }
    ],
    experience: [
      {
        id: 'exp5',
        company: 'Tesla',
        position: 'Mechanical Engineer',
        startDate: '2022-06-01',
        current: true,
        description: 'Designing automation systems for manufacturing'
      }
    ],
    achievements: [
      {
        id: 'a5',
        title: 'Design Excellence Award',
        description: 'Best mechanical design in university competition',
        date: '2022-05-01'
      }
    ],
    isActive: true,
    status: 'active',
    joinedAt: '2022-06-01',
    memberSince: '2022-06-01',
    createdAt: '2022-06-01T00:00:00Z',
    updatedAt: '2023-09-01T00:00:00Z'
  },
  {
    id: '5',
    slug: 'david-kim',
    name: 'David Kim',
    role: 'ML Engineer',
    email: 'david.kim@lab.edu',
    bio: 'David is a machine learning engineer with expertise in deep learning and distributed systems. He focuses on scaling ML algorithms for real-world robotics applications.',
    about: 'David works on large-scale ML systems and distributed training. He was previously at Google Brain and holds an MS from UC Berkeley.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/davidkim' },
      { platform: 'github', url: 'https://github.com/davidkim' },
      { platform: 'twitter', url: 'https://twitter.com/davidkim' }
    ],
    skills: ['Deep Learning', 'Distributed Systems', 'PyTorch', 'TensorFlow', 'Kubernetes', 'MLOps'],
    projects: ['2', '4', '6'],
    education: [
      {
        id: 'e6',
        institution: 'UC Berkeley',
        degree: 'MS',
        field: 'Computer Science',
        startYear: '2019',
        endYear: '2021',
        current: false,
        description: 'Machine learning systems'
      }
    ],
    experience: [
      {
        id: 'exp6',
        company: 'Google Brain',
        position: 'Research Engineer',
        startDate: '2021-07-01',
        current: true,
        description: 'Working on large-scale ML infrastructure'
      }
    ],
    achievements: [
      {
        id: 'a6',
        title: 'NeurIPS Outstanding Paper',
        description: 'Co-authored outstanding paper at NeurIPS 2022',
        date: '2022-12-01'
      }
    ],
    isActive: true,
    status: 'active',
    joinedAt: '2021-07-01',
    memberSince: '2021-07-01',
    createdAt: '2021-07-01T00:00:00Z',
    updatedAt: '2023-08-01T00:00:00Z'
  }
];

// Mock About Data
export const mockAboutData: AboutData = {
  id: '1',
  mission: 'To advance the frontiers of VLSI design and AI robotics through innovative research, collaborative learning, and practical application.',
  vision: 'Becoming a world-leading research lab that bridges the gap between cutting-edge semiconductor technology and intelligent robotic systems.',
  description: 'thinkbuildlabs is a multidisciplinary research group at the intersection of chip design, artificial intelligence, and robotics. Founded in 2018, our lab brings together students and researchers from electrical engineering, computer science, and mechanical engineering to tackle challenging problems in next-generation computing and autonomous systems.\n\nOur research spans from the transistor level to complete robotic systems. We design custom silicon for AI acceleration, develop algorithms for robot perception and control, and build complete robotic platforms that showcase our technologies in real-world scenarios.',
  stats: [
    { id: 's1', label: 'Projects Completed', value: '25+', icon: 'CheckCircle' },
    { id: 's2', label: 'Research Papers', value: '40+', icon: 'FileText' },
    { id: 's3', label: 'Team Members', value: '15+', icon: 'Users' },
    { id: 's4', label: 'Patents Filed', value: '8', icon: 'Award' }
  ],
  history: [
    {
      id: 'h1',
      year: '2018',
      title: 'Lab Founded',
      description: 'thinkbuildlabs was established with initial funding from the National Science Foundation.'
    },
    {
      id: 'h2',
      year: '2019',
      title: 'First Chip Tape-out',
      description: 'Successfully taped out our first custom AI accelerator chip in 40nm technology.'
    },
    {
      id: 'h3',
      year: '2020',
      title: 'Robotics Division Added',
      description: 'Expanded research to include robotics with the addition of autonomous navigation projects.'
    },
    {
      id: 'h4',
      year: '2021',
      title: 'Industry Partnerships',
      description: 'Established partnerships with leading tech companies for collaborative research.'
    },
    {
      id: 'h5',
      year: '2022',
      title: 'Best Paper Award',
      description: 'Received best paper award at ISSCC for our ultra-low power neural network accelerator.'
    },
    {
      id: 'h6',
      year: '2023',
      title: 'New Facility',
      description: 'Moved to state-of-the-art research facility with expanded lab space and equipment.'
    }
  ],
  facilities: [
    {
      id: 'f1',
      name: 'VLSI Design Lab',
      description: 'Complete IC design environment with latest EDA tools from Cadence, Synopsys, and Mentor Graphics.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'
    },
    {
      id: 'f2',
      name: 'Robotics Workshop',
      description: 'Full machine shop with 3D printers, CNC machines, and electronics assembly stations.',
      image: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=800&q=80'
    },
    {
      id: 'f3',
      name: 'AI Computing Cluster',
      description: 'High-performance GPU cluster with 100+ NVIDIA A100 GPUs for training large models.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80'
    },
    {
      id: 'f4',
      name: 'Testing & Characterization',
      description: 'Equipment for chip testing including probe stations, oscilloscopes, and spectrum analyzers.',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80'
    }
  ],
  partners: [
    { id: 'p1', name: 'NVIDIA', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg', website: 'https://nvidia.com' },
    { id: 'p2', name: 'Intel', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg', website: 'https://intel.com' },
    { id: 'p3', name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', website: 'https://google.com' },
    { id: 'p4', name: 'TSMC', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/TSMC_Logo.svg', website: 'https://tsmc.com' }
  ]
};

// Mock data service functions
export const mockDataService = {
  // Projects
  getProjects: async (category?: string): Promise<Project[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (category) {
      return mockProjects.filter(p => p.category === category);
    }
    return mockProjects;
  },
  
  getProjectBySlug: async (slug: string): Promise<Project | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockProjects.find(p => p.slug === slug) || null;
  },
  
  createProject: async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newProject: Project = {
      ...project,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockProjects.push(newProject);
    return newProject;
  },
  
  updateProject: async (id: string, updates: Partial<Project>): Promise<Project | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockProjects.findIndex(p => p.id === id);
    if (index === -1) return null;
    mockProjects[index] = { ...mockProjects[index], ...updates, updatedAt: new Date().toISOString() };
    return mockProjects[index];
  },
  
  deleteProject: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockProjects.findIndex(p => p.id === id);
    if (index === -1) return false;
    mockProjects.splice(index, 1);
    return true;
  },
  
  // Team Members
  getTeamMembers: async (): Promise<TeamMember[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockTeamMembers;
  },
  
  getTeamMemberBySlug: async (slug: string): Promise<TeamMember | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTeamMembers.find(m => m.slug === slug) || null;
  },
  
  createTeamMember: async (member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeamMember> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newMember: TeamMember = {
      ...member,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockTeamMembers.push(newMember);
    return newMember;
  },
  
  updateTeamMember: async (id: string, updates: Partial<TeamMember>): Promise<TeamMember | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockTeamMembers.findIndex(m => m.id === id);
    if (index === -1) return null;
    mockTeamMembers[index] = { ...mockTeamMembers[index], ...updates, updatedAt: new Date().toISOString() };
    return mockTeamMembers[index];
  },
  
  deleteTeamMember: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockTeamMembers.findIndex(m => m.id === id);
    if (index === -1) return false;
    mockTeamMembers.splice(index, 1);
    return true;
  },
  
  // About
  getAboutData: async (): Promise<AboutData> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAboutData;
  }
};
