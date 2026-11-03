import { FaUsers, FaRegAddressBook, FaRegSadTear, FaExclamationTriangle, FaUserTie, FaBalanceScale } from 'react-icons/fa';
import { MdOutlineLaptopChromebook, MdOutlineLocalFireDepartment, MdOutlineTrendingUp } from 'react-icons/md';
import { BiMoney } from 'react-icons/bi';

export const categories = [
  { name: 'Leadership', description: 'Founders, managers, and decisions', icon: <FaUserTie /> },
  { name: 'Coworkers', description: 'Team dynamics and collaboration', icon: <FaUsers /> },
  { name: 'Pay', description: 'Salary, benefits, and raises', icon: <BiMoney /> },
  { name: 'Workload', description: 'Hours, pressure, and burnout', icon: <MdOutlineLocalFireDepartment /> },
  { name: 'Careers', description: 'Hiring, promotions, and growth', icon: <MdOutlineTrendingUp /> },
  { name: 'HR', description: 'Policies, support, and complaints', icon: <FaRegAddressBook /> },
  { name: 'Remote', description: 'Work from home and office rules', icon: <MdOutlineLaptopChromebook /> },
  { name: 'Layoffs', description: 'Restructuring and job security', icon: <FaRegSadTear /> },
  { name: 'Harassment', description: 'Bullying and discrimination', icon: <FaExclamationTriangle /> },
  { name: 'Ethics', description: 'Unethical conduct and speaking up', icon: <FaBalanceScale /> },
];

const previousNames: Record<string, string> = {
  'Toxic Culture': 'Leadership', Culture: 'Leadership',
  'Colleague Drama': 'Coworkers', 'Office Romance': 'Coworkers',
  'Salary Secrets': 'Pay', 'The Burnout Zone': 'Workload',
  'HR Tales': 'HR', 'WFH Reality': 'Remote',
  'Layoff Stories': 'Layoffs', Whistleblower: 'Ethics',
};

export const normalizeTopic = (value: string | null | undefined) => {
  if (!value) return null;
  const name = previousNames[value] ?? value;
  return categories.some(category => category.name === name) ? name : null;
};

