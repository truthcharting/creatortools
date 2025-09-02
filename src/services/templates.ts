import { ProjectTemplate, Task } from '../types';

// Helper function to generate unique IDs
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Helper function to format date for task names
const formatDateForTask = (date: Date): string => {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dateNumber = date.getDate();
  
  return `${dayName}. ${monthName} ${dateNumber}`;
};

// Generate shoot day tasks based on date
const generateShootDayTasks = (date: Date): Task[] => {
  const dateString = formatDateForTask(date);
  
  return [
    {
      id: generateId(),
      name: `DAY ${date.getDate()} - ${dateString}`,
      completed: false,
      subtasks: [
        {
          id: generateId(),
          name: 'Daily Docket',
          completed: false,
          subtasks: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: generateId(),
          name: 'Film All Actions Included in Daily Docket',
          completed: false,
          subtasks: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: generateId(),
          name: 'Film Additional Obstacles That Arise in Regards to the Goal',
          completed: false,
          subtasks: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: generateId(),
          name: 'Daily Recap VO',
          completed: false,
          subtasks: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
};

// TC Long Form Template
export const tcLongFormTemplate: ProjectTemplate = {
  id: 'tc-long-form',
  name: 'TC Long Form',
  description: 'Template for long-form content creation with multiple shoot days',
  requiresShootDays: true,
  requiresShootDates: true,
  tasks: [
    {
      id: generateId(),
      name: 'Hook (30 seconds)',
      completed: false,
      subtasks: [
        {
          id: generateId(),
          name: 'Tease the Video',
          completed: false,
          subtasks: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: generateId(),
          name: 'Open a Curiosity Gap',
          completed: false,
          subtasks: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: generateId(),
          name: '"Time Machine" Segment',
          completed: false,
          subtasks: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: generateId(),
      name: 'Chapter 1: World Building (3-5 minutes)',
      completed: false,
      subtasks: [
        {
          id: generateId(),
          name: 'The Project Docket: The Goal',
          completed: false,
          subtasks: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: generateId(),
          name: 'Intro to Starting Characters',
          completed: false,
          subtasks: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: generateId(),
          name: 'Preparation for The Goal',
          completed: false,
          subtasks: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: generateId(),
          name: 'Research of the "Map"',
          completed: false,
          subtasks: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: generateId(),
      name: 'Chapter 2: Journey and Obstacles (10 minutes)',
      completed: false,
      subtasks: [], // This will be populated dynamically based on shoot dates
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: generateId(),
      name: 'Chapter 3: Victory or Lesson Learned (5 minutes)',
      completed: false,
      subtasks: [
        {
          id: generateId(),
          name: 'Film Result of Goal',
          completed: false,
          subtasks: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: generateId(),
          name: 'Emotional Recap and Moral',
          completed: false,
          subtasks: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: generateId(),
          name: 'Remember Important Moments and Characters',
          completed: false,
          subtasks: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: generateId(),
          name: 'Remember What God Did',
          completed: false,
          subtasks: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: generateId(),
          name: 'Remember What You Learned',
          completed: false,
          subtasks: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: generateId(),
          name: 'Follow up recordings',
          completed: false,
          subtasks: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: generateId(),
          name: '"Time machine" Segment',
          completed: false,
          subtasks: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: generateId(),
          name: 'Editing Notes',
          completed: false,
          subtasks: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
};

// Available templates
export const availableTemplates: ProjectTemplate[] = [
  tcLongFormTemplate,
  {
    id: 'blank-project',
    name: 'Blank Project',
    description: 'Start with a clean slate and create your own tasks',
    requiresShootDays: false,
    requiresShootDates: false,
    tasks: []
  }
];

// Generate project from template
export const generateProjectFromTemplate = (
  template: ProjectTemplate,
  projectName: string,
  shootDays?: number,
  shootDates?: Date[]
): any => {
  const projectId = generateId();
  
  // Deep clone the template tasks
  const clonedTasks = JSON.parse(JSON.stringify(template.tasks));
  
  // If this is the TC Long Form template and we have shoot dates, populate Chapter 2
  if (template.id === 'tc-long-form' && shootDates && shootDates.length > 0) {
    // Find Chapter 2 task
    const chapter2Task = clonedTasks.find((task: Task) => 
      task.name.includes('Chapter 2: Journey and Obstacles')
    );
    
    if (chapter2Task) {
      // Generate shoot day tasks for each date
      const shootDayTasks: Task[] = [];
      shootDates.forEach((date, index) => {
        const dayTasks = generateShootDayTasks(date);
        shootDayTasks.push(...dayTasks);
      });
      
      chapter2Task.subtasks = shootDayTasks;
    }
    
    // Add Ad read as a separate main task after Chapter 2
    const adReadTask: Task = {
      id: generateId(),
      name: 'Ad read: (1 minute)',
      completed: false,
      subtasks: [
        {
          id: generateId(),
          name: '[Sponsor]',
          completed: false,
          subtasks: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert Ad read task after Chapter 2
    const chapter2Index = clonedTasks.findIndex((task: Task) => 
      task.name.includes('Chapter 2: Journey and Obstacles')
    );
    if (chapter2Index !== -1) {
      clonedTasks.splice(chapter2Index + 1, 0, adReadTask);
    }
  }
  
  return {
    id: projectId,
    name: projectName,
    description: `Created from ${template.name} template`,
    tasks: clonedTasks,
    instantData: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    template: template.id,
    shootDays,
    shootDates
  };
};

// Get template by ID
export const getTemplateById = (id: string): ProjectTemplate | undefined => {
  return availableTemplates.find(template => template.id === id);
};
